import { createHash, createPrivateKey, generateKeyPairSync, randomUUID, sign } from 'node:crypto';
import { constants } from 'node:fs';
import { readFile, mkdir, lstat, open, rename, unlink, realpath } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { setTimeout as delay } from 'node:timers/promises';

const { version } = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

export class ClientError extends Error { constructor(code) { super(code); this.code = code; } }
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
    } finally { await file?.close(); await unlink(temporary).catch(e => { if (e.code !== 'ENOENT') throw e; }); }
  }
  async withLock(fn) {
    const path = join(await this.directory(), 'auth.lock');
    let file;
    try { file = await open(path, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW, 0o600); }
    catch { throw new ClientError('auth_state_busy'); }
    try { return await fn(); }
    finally { await file.close(); await unlink(path); }
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
  async send(path, { method = 'GET', body, identity, token, key, signal } = {}) {
    if (!path.startsWith('/') || path.startsWith('//')) throw new ClientError('request_path_rejected');
    const bytes = body === undefined ? undefined : JSON.stringify(body);
    let nonce;
    for (let attempt = 0; attempt < 2; attempt++) {
      const headers = { accept: 'application/json', ...(bytes === undefined ? {} : { 'Content-Type': 'application/json' }), ...(this.local ? { 'X-Adr-Local-Actor': this.actor } : {}), ...(key ? { 'Idempotency-Key': key } : {}) };
      if (identity) {
        headers.DPoP = proof(identity, method, this.origin + path, bytes, nonce, token);
        if (bytes !== undefined) headers['Content-Digest'] = `sha-256=:${digest(bytes).toString('base64')}:`;
        if (token) headers.Authorization = `DPoP ${token}`;
      }
      let response;
      try { response = await this.fetcher(this.origin + path, { method, headers, body: bytes, redirect: 'error', signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(65000)]) : AbortSignal.timeout(65000) }); }
      catch { throw new ClientError(signal?.aborted ? 'cancelled' : 'network_unavailable_outcome_unknown'); }
      const reader = response.body?.getReader(); let size = 0; const chunks = [];
      try { if (reader) for (;;) { const { value, done } = await reader.read(); if (done) break; size += value.length; if (size > 1024 * 1024) { await reader.cancel(); throw new ClientError('response_too_large'); } chunks.push(Buffer.from(value)); } }
      finally { reader?.releaseLock(); }
      let result; try { result = JSON.parse(Buffer.concat(chunks).toString('utf8')); } catch { throw new ClientError('invalid_network_response'); }
      if (response.status === 401 && result.code === 'use_dpop_nonce' && identity && attempt === 0) { nonce = response.headers.get('DPoP-Nonce'); if (nonce) continue; }
      if (!response.ok) throw new ClientError(typeof result.code === 'string' && /^[a-z0-9_]{1,80}$/.test(result.code) ? result.code : 'network_request_rejected');
      return result;
    }
    throw new ClientError('proof_challenge_failed');
  }
  async request(path, options = {}) {
    if (this.local || options.public) return this.send(path, options);
    const identity = await this.store.withLock(async () => {
      const identity = await this.store.read();
      if (!identity || identity.origin !== this.origin) throw new ClientError('login_required');
      const cleanup = options.method === 'POST' && /^\/v2\/(?:providers\/nodes\/[^/]+\/(?:pause|stop)|sessions\/[^/]+\/stop|admin\/evaluation-sessions\/[^/]+\/stop)$/.test(path);
      if (cleanup) return identity;
      if (identity.refreshPending) throw new ClientError('refresh_outcome_unknown_reenroll_required');
      if (Date.now() >= identity.expiresAt - 30000) {
        identity.refreshPending = true; await this.store.write(identity);
        // Serialize refresh rotation across processes. Unknown outcomes are not retried.
        const tokens = await this.send('/v1/oauth/token', { method: 'POST', identity, body: { grant_type: 'refresh_token', refresh_token: identity.refresh_token, installation_id: identity.installation_id } });
        Object.assign(identity, tokens, { refreshPending: false, expiresAt: Date.now() + tokens.expires_in * 1000 }); await this.store.write(identity);
      }
      return identity;
    });
    return this.send(path, { ...options, identity, token: identity.access_token });
  }
  async login(notify, signal, { operator = false } = {}) {
    if (this.local) return { status: 'local_development', actor: this.actor };
    return this.store.withLock(() => this.enroll(notify, signal, operator));
  }
  async enroll(notify, signal, operator) {
    if (await this.store.read()) throw new ClientError('logout_existing_installation_first');
    const keys = generateKeyPairSync('ed25519');
    const identity = { origin: this.origin, publicKey: keys.publicKey.export({ format: 'jwk' }), privateKey: keys.privateKey.export({ format: 'jwk' }) };
    const authorization = await this.send('/v1/device/authorizations', { method: 'POST', identity, body: { client_kind: 'marketplace', client_version: version, display_name: `adr-cli ${this.store.profile}`, public_key_jwk: identity.publicKey, storage_class: 'file_protected', requested_scopes: operator ? ['marketplace:operator'] : this.store.profile === 'provider' ? ['marketplace:provider'] : ['marketplace:buyer', 'marketplace:provider'] }, signal });
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
          await this.store.write({ ...identity, ...tokens, expiresAt: Date.now() + tokens.expires_in * 1000 }); approved = true;
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
      await this.send('/v1/installation/revoke', { method: 'POST', identity, token: identity.access_token, body: { installation_id: identity.installation_id } });
      await this.store.clear();
    });
    return { status: 'signed_out' };
  }
}
