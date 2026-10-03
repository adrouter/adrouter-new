import { readCodingStream } from './coding-wire.mjs';
import { createHash, createPrivateKey, generateKeyPairSync, randomUUID, sign } from 'node:crypto';
import { constants } from 'node:fs';
import { readFile, mkdir, lstat, open, rename, unlink, realpath } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const { version } = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

export class ClientError extends Error { constructor(code) { super(code); this.code = code; } }
export const authRecoveryCodes = new Set(['refresh_outcome_unknown_reenroll_required', 'invalid_access_token', 'installation_revoked', 'login_required']);
export function loginHint(code) {
  if (['auth_lock_owner_unknown','auth_lock_orphaned','auth_state_busy'].includes(code)) return 'Another process may own this profile. Close its client and retry; an unidentified or orphaned lock needs explicit local repair. Locks are never stolen automatically.';
  if (code === 'recover_requires_login_without_operator_or_local') return 'Use adr-cli --profile NAME login --recover, without --operator or --local.';
  if (code === 'operator_requires_operator_profile' || code === 'operator_requires_login') return 'Use adr-cli --profile operator login.';
  if (code === 'unknown_or_missing_option') return 'Choose a role with --profile buyer, --profile provider or --profile operator. Use --help for commands.';
  if (code === 'refresh_outcome_unknown_reenroll_required' || code === 'invalid_access_token' || code === 'logout_existing_installation_first') return 'Open this profile in the TUI and choose Repair sign-in, or run login --recover with the same --profile. Recovery preserves installation bindings.';
  if (code === 'installation_revoked') return 'This installation was revoked. Sign out to clear its local sign-in, then approve a new installation. Saved work is preserved.';
  if (code === 'installation_revocation_failed') return 'Revocation was not confirmed. Local sign-in was preserved; retry when the network is available.';
  return '';
}
export const safeText = value => String(value).replace(/[\x00-\x08\x0b-\x1f\x7f-\x9f\u202a-\u202e\u2066-\u2069]/g, '');
export function networkOrigin(value, local = false) {
  let url; try { url = new URL(value); } catch { throw new ClientError('network_url_required'); }
  if (url.username || url.password || url.search || url.hash || url.pathname !== '/' || (url.protocol !== 'https:' && !(local && url.protocol === 'http:' && ['127.0.0.1', '[::1]'].includes(url.hostname)))) throw new ClientError('network_url_rejected');
  if (local && !['127.0.0.1', '[::1]'].includes(url.hostname)) throw new ClientError('local_requires_loopback');
  return url.origin;
}
export class AuthStore {
  constructor(home = homedir(), profile = 'default') {
    if (!/^[a-z][a-z0-9_-]{0,31}$/.test(profile)) throw new ClientError('invalid_profile_name');
    this.home = home; this.profile = profile;
  }
  async directory() {
    const base = await realpath(this.home); let directory = base;
    // Default remains at the original path; named profiles never copy credentials.
    for (const part of ['.adr-v2', ...(this.profile === 'default' ? [] : ['profiles', this.profile])]) {
      directory = join(directory, part);
      await mkdir(directory, { mode: 0o700 }).catch(e => { if (e.code !== 'EEXIST') throw e; });
      const stat = await lstat(directory);
      if (!stat.isDirectory() || stat.isSymbolicLink() || stat.uid !== process.getuid() || (stat.mode & 0o077)) throw new ClientError('state_directory_unsafe');
    }
    return directory;
  }
  async read() {
    const path = join(await this.directory(), 'installation.json');
    let file;
    try {
      file = await open(path, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
      const stat = await file.stat();
      if (!stat.isFile() || stat.nlink !== 1 || stat.uid !== process.getuid() || (stat.mode & 0o077) || stat.size > 16384) throw new ClientError('state_file_unsafe');
      return JSON.parse(await file.readFile('utf8'));
    } catch (e) { if (e.code === 'ENOENT') return null; throw new ClientError('state_unavailable'); }
    finally { await file?.close(); }
  }
  async write(value) {
    const directory = await this.directory(); const destination = join(directory, 'installation.json');
    const temporary = join(directory, `installation-${randomUUID()}.tmp`);
    let file;
    try {
      file = await open(temporary, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW, 0o600);
      await file.writeFile(JSON.stringify(value)); await file.sync(); await file.close(); file = null;
      await rename(temporary, destination);
      const directoryHandle = await open(directory, constants.O_RDONLY);
      try { await directoryHandle.sync(); } finally { await directoryHandle.close(); }
    } finally { await file?.close(); await unlink(temporary).catch(e => { if (e.code !== 'ENOENT') throw e; }); }
  }
  async withLock(fn, { signal, timeoutMs = 30000 } = {}) {
    const path = join(await this.directory(), 'auth.lock');
    const deadline = Date.now() + timeoutMs;
    let file;
    while (!file) {
      if (signal?.aborted) throw new ClientError('cancelled');
      try { file = await open(path, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW, 0o600); await file.writeFile(JSON.stringify({pid:process.pid})); await file.sync(); }
      catch (error) {
        if (error.code !== 'EEXIST') throw new ClientError('auth_state_unavailable');
        if (Date.now() >= deadline) {
          let lock;
          try {
            const handle=await open(path,constants.O_RDONLY|constants.O_NOFOLLOW|constants.O_NONBLOCK);
            try { const stat=await handle.stat(); if(!stat.isFile()||stat.size>128||stat.uid!==process.getuid())throw Error(); lock=JSON.parse(await handle.readFile('utf8')); } finally { await handle.close(); }
            if(!Number.isSafeInteger(lock.pid)||lock.pid<=0)throw Error();
          } catch { throw new ClientError('auth_lock_owner_unknown'); }
          try { process.kill(lock.pid,0); } catch(error) { if(error.code==='ESRCH')throw new ClientError('auth_lock_orphaned'); }
          throw new ClientError('auth_state_busy');
        }
        try { await delay(Math.min(50, Math.max(1, deadline - Date.now())), undefined, { signal }); }
        catch { throw new ClientError('cancelled'); }
      }
    }
    try { if (signal?.aborted) throw new ClientError('cancelled'); return await fn(); }
    finally { await file.close(); await unlink(path); }
  }
  async readSelection() {
    let handle;
    try {
      handle=await open(join(await this.directory(),'network.json'),constants.O_RDONLY|constants.O_NOFOLLOW|constants.O_NONBLOCK);
      const stat=await handle.stat(); if(!stat.isFile()||stat.size>4096||stat.uid!==process.getuid()||(stat.mode&0o077))throw Error();
      return networkOrigin(JSON.parse(await handle.readFile('utf8')).origin);
    } catch(error) { if(error.code==='ENOENT')return undefined;throw new ClientError('network_selection_unavailable'); }
    finally { await handle?.close(); }
  }
  async preserveSelection(origin) {
    networkOrigin(origin);
    const directory=await this.directory(), temporary=join(directory,`network-${randomUUID()}.tmp`);
    const handle=await open(temporary,constants.O_WRONLY|constants.O_CREAT|constants.O_EXCL|constants.O_NOFOLLOW,0o600);
    try { await handle.writeFile(JSON.stringify({origin}));await handle.sync();await handle.close();await rename(temporary,join(directory,'network.json')); }
    finally { await handle.close();await unlink(temporary).catch(e=>{if(e.code!=='ENOENT')throw e;}); }
  }
  async clear() { await unlink(join(await this.directory(), 'installation.json')).catch(e => { if (e.code !== 'ENOENT') throw e; }); }
}
const digest = value => createHash('sha256').update(value).digest();
export function proof(identity, method, url, body, nonce, token) {
  const header = { typ: 'dpop+jwt', alg: 'EdDSA', jwk: identity.publicKey };
  const payload = { jti: randomUUID(), iat: Math.floor(Date.now() / 1000), htm: method, htu: new URL(url).origin + new URL(url).pathname, client_kind: 'marketplace', client_version: version, ...(nonce ? { nonce } : {}), ...(token ? { ath: digest(token).toString('base64url') } : {}), ...(body === undefined ? {} : { bht: digest(body).toString('base64url') }) };
  const data = [header, payload].map(x => Buffer.from(JSON.stringify(x)).toString('base64url')).join('.');
  return `${data}.${sign(null, Buffer.from(data), createPrivateKey({ key: identity.privateKey, format: 'jwk' })).toString('base64url')}`;
}
export class Network {
  constructor({ origin, local = false, actor = 'buyer', store = new AuthStore(), fetcher = fetch }) {
    this.origin = networkOrigin(origin, local); this.local = local; this.actor = actor; this.store = store; this.fetcher = fetcher;
  }
  async send(path, { method = 'GET', body, identity, token, key, signal, onEvent } = {}) {
    if (!path.startsWith('/') || path.startsWith('//')) throw new ClientError('request_path_rejected');
    const bytes = body === undefined ? undefined : JSON.stringify(body);
    let nonce;
    for (let attempt = 0; attempt < 2; attempt++) {
      const headers = { 'X-Adr-Coding-Protocol':'coding_v1','X-Adr-Connector-Protocol':'pi_native_v1', accept: onEvent ? 'application/x-ndjson' : 'application/json', ...(bytes === undefined ? {} : { 'Content-Type': 'application/json' }), ...(this.local ? { 'X-Adr-Local-Actor': this.actor } : {}), ...(key ? { 'Idempotency-Key': key } : {}) };
      if (identity) {
        headers.DPoP = proof(identity, method, this.origin + path, bytes, nonce, token);
        if (bytes !== undefined) headers['Content-Digest'] = `sha-256=:${digest(bytes).toString('base64')}:`;
        if (token) headers.Authorization = `DPoP ${token}`;
      }
      let response;
      try { response = await this.fetcher(this.origin + path, { method, headers, body: bytes, redirect: 'error', signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(135000)]) : AbortSignal.timeout(135000) }); }
      catch { throw new ClientError(signal?.aborted ? 'cancelled' : 'network_unavailable_outcome_unknown'); }
      if(response.ok&&onEvent){try{return await readCodingStream(response,onEvent);}catch(e){if(typeof e.code==='string'&&/^[a-z0-9_]{1,80}$/.test(e.code))throw e;throw new ClientError(signal?.aborted?'cancelled':'network_unavailable_outcome_unknown');}}
      const reader = response.body?.getReader(); let size = 0; const chunks = [];
      try { if (reader) for (;;) { const { value, done } = await reader.read(); if (done) break; size += value.length; if (size > 1024 * 1024) { await reader.cancel(); throw new ClientError('response_too_large'); } chunks.push(Buffer.from(value)); } }
      catch(e){if(e instanceof ClientError)throw e;throw new ClientError(signal?.aborted?'cancelled':'network_unavailable_outcome_unknown');}
      finally { reader?.releaseLock(); }
      let result; try { result = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { throw new ClientError('invalid_network_response'); }
      if (response.status === 401 && result.code === 'use_dpop_nonce' && identity && attempt === 0) { nonce = response.headers.get('DPoP-Nonce'); if (nonce) continue; }
      if(!response.ok)throw Object.assign(new ClientError(typeof result.code==='string'&&/^[a-z0-9_]{1,80}$/.test(result.code)?result.code:'network_request_rejected'),{status:response.status});
      return result;
    }
    throw new ClientError('proof_challenge_failed');
  }
  async request(path, options = {}) {
    if (this.local || options.public) return this.send(path, options);
    const identity = await this.store.withLock(async () => {
      const identity = await this.store.read();
      if (!identity || identity.origin !== this.origin) throw new ClientError('login_required');
      const cleanup = options.method === 'POST' && /^\/v2\/(?:providers\/nodes\/[^/]+\/(?:pause|stop|delete)|sessions\/[^/]+\/(?:stop|delete|restore)|admin\/evaluation-sessions\/[^/]+\/(?:stop|delete|restore)|admin\/sessions\/[^/]+\/release-execution)$/.test(path);
      if (cleanup) return identity;
      if (identity.refreshPending) throw new ClientError('refresh_outcome_unknown_reenroll_required');
      if (Date.now() >= identity.expiresAt - 30000) {
        if (options.signal?.aborted) throw new ClientError('cancelled');
        identity.refreshPending = true; identity.refreshStartedAt = Date.now(); await this.store.write(identity);
        // Serialize refresh rotation across processes. Unknown outcomes are not retried.
        try {
          const tokens = await this.send('/v1/oauth/token', { method: 'POST', identity, body: { grant_type: 'refresh_token', refresh_token: identity.refresh_token, installation_id: identity.installation_id }, signal: options.signal });
          this.validateTokens(tokens, identity.installation_id, identity.scope);
          const replacement = { ...identity, ...tokens, refreshPending: false, refreshError: null, expiresAt: Date.now() + tokens.expires_in * 1000 };
          await this.store.write(replacement);
          return replacement;
        } catch (error) {
          // These Router rejections happen before refresh consumption. Never clear
          // uncertainty for transport/server errors, invalid tokens or malformed success.
          const rejectedBeforeConsumption = {rate_limited:429,client_upgrade_required:426,client_not_allowed:403,marketplace_owner_only:403,marketplace_buyer_scope_only:403,marketplace_access_disabled:403,operator_required:403,developer_required:403,use_dpop_nonce:401};
          if (error.status === rejectedBeforeConsumption[error.code] && error.status) identity.refreshPending = false;
          identity.refreshError = error instanceof ClientError && /^[a-z0-9_]{1,80}$/.test(error.code) ? error.code : 'auth_state_unavailable';
          identity.refreshErrorAt = Date.now();
          await this.store.write(identity);
          throw error;
        }
      }
      return identity;
    }, { signal: options.signal });
    return this.send(path, { ...options, identity, token: identity.access_token });
  }
  async login(notify, signal, { operator = false } = {}) {
    if (this.local) return { status: 'local_development', actor: this.actor };
    return this.store.withLock(() => this.enroll(notify, signal, operator), { signal });
  }
  validateTokens(tokens, installationId, scope) {
    if (!tokens || !/^adr_at_[A-Za-z0-9_-]{43}$/.test(tokens.access_token) || !/^adr_rt_[A-Za-z0-9_-]{43}$/.test(tokens.refresh_token)
      || tokens.token_type !== 'DPoP' || tokens.client_kind !== 'marketplace'
      || !Number.isSafeInteger(tokens.refresh_expires_in) || tokens.refresh_expires_in <= 0
      || typeof tokens.installation_id !== 'string' || !/^[a-f0-9]{8}-[a-f0-9]{4}-[1-5][a-f0-9]{3}-[89ab][a-f0-9]{3}-[a-f0-9]{12}$/i.test(tokens.installation_id)
      || (installationId && tokens.installation_id !== installationId) || !Number.isSafeInteger(tokens.expires_in) || tokens.expires_in <= 0
      || typeof tokens.scope !== 'string' || !tokens.scope || new Set(tokens.scope.split(' ')).size !== tokens.scope.split(' ').length || !tokens.scope.split(' ').every(s => ['marketplace:buyer','marketplace:provider','marketplace:operator'].includes(s))
      || (scope && tokens.scope.split(' ').sort().join(' ') !== scope.split(' ').sort().join(' '))) throw new ClientError('invalid_token_response');
  }
  async recoverLogin(notify, signal) {
    if (this.local) return { status: 'local_development', actor: this.actor };
    return this.store.withLock(async () => {
      const identity = await this.store.read();
      if (!identity || identity.origin !== this.origin) throw new ClientError('login_required');
      const authorization = await this.send('/v1/installation/reauthorize', { method: 'POST', identity,
        body: { installation_id: identity.installation_id, public_key_jwk: identity.publicKey }, signal });
      return this.completeAuthorization(identity, authorization, notify, signal, true);
    }, { signal, timeoutMs: 30000 });
  }
  async enroll(notify, signal, operator) {
    if (await this.store.read()) throw new ClientError('logout_existing_installation_first');
    const keys = generateKeyPairSync('ed25519');
    const identity = { origin: this.origin, publicKey: keys.publicKey.export({ format: 'jwk' }), privateKey: keys.privateKey.export({ format: 'jwk' }) };
    identity.scope = (operator || this.store.profile === 'operator' ? ['marketplace:operator'] : this.store.profile === 'provider' ? ['marketplace:provider'] : this.store.profile === 'buyer' ? ['marketplace:buyer'] : ['marketplace:buyer','marketplace:provider']).join(' ');
    const authorization = await this.send('/v1/device/authorizations', { method: 'POST', identity, body: { client_kind: 'marketplace', client_version: version, display_name: `adr-cli ${this.store.profile}`, public_key_jwk: identity.publicKey, storage_class: 'file_protected', requested_scopes: identity.scope.split(' ') }, signal });
    return this.completeAuthorization(identity, authorization, notify, signal);
  }
  async completeAuthorization(identity, authorization, notify, signal, recovering = false) {
    let approved = false;
    try {
      const verification = new URL(authorization.verification_uri_complete);
      if (verification.protocol !== 'https:' || verification.username || verification.password) throw new ClientError('verification_url_rejected');
      notify({ status: 'approval_required', verificationUrl: verification.href, comparisonCode: safeText(authorization.user_code) });
      const deadline = Date.now() + Math.min(Number(authorization.expires_in), 900) * 1000;
      let interval = Math.max(5, Number(authorization.interval) || 5);
      while (Date.now() < deadline) {
        await delay(interval * 1000, undefined, { signal });
        try {
          const tokens = await this.send('/v1/oauth/token', { method: 'POST', identity, body: { grant_type: 'urn:ietf:params:oauth:grant-type:device_code', device_code: authorization.device_code, client_kind: 'marketplace' }, signal });
          this.validateTokens(tokens, recovering ? identity.installation_id : undefined, identity.scope);
          await this.store.write({ ...identity, ...tokens, refreshPending: false, refreshError: null, expiresAt: Date.now() + tokens.expires_in * 1000 }); approved = true;
          return { status: 'signed_in', installationId: tokens.installation_id };
        } catch (e) { if (e.code === 'slow_down') interval = Math.min(30, interval + 5); else if (e.code !== 'authorization_pending') throw e; }
      }
      throw new ClientError('authorization_expired');
    } finally {
      if (!approved) await this.send('/v1/device/authorizations/cancel', { method: 'POST', identity, body: { client_kind: 'marketplace', device_code: authorization.device_code } }).catch(() => undefined);
    }
  }
  async logout() {
    if (!this.local) await this.store.withLock(async () => {
      const identity = await this.store.read();
      if (!identity) return;
      if (identity.origin !== this.origin) throw new ClientError('login_required');
      // Revocation uses its own fresh proof, even when refresh or access is disabled.
      const result = await this.send('/v1/installation/revoke', { method: 'POST', identity, body: { installation_id: identity.installation_id, public_key_jwk: identity.publicKey } });
      if (result?.status !== 'revoked' || result.installation_id !== identity.installation_id) throw new ClientError('installation_revocation_failed');
      await this.store.preserveSelection?.(this.origin);
      await this.store.clear();
    });
    return { status: 'signed_out' };
  }
}
