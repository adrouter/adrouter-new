import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, lstat, readFile, symlink, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { generateKeyPairSync, verify, createPublicKey } from 'node:crypto';
import { AuthStore, networkOrigin, Network, proof, safeText } from '../src/network.mjs';
import { parseArgs, run } from '../src/cli.mjs';
import { publicAddress, validateBinding, upstreamInference } from '../src/provider-broker.mjs';
import { createServer } from 'node:http';

test('network targets, terminal escaping and deterministic flag errors', () => {
  assert.equal(networkOrigin('https://api.example.test'), 'https://api.example.test');
  for (const url of ['http://api.example.test', 'https://user:password@example.test', 'https://example.test/path', 'https://example.test/?token=secret']) assert.throws(() => networkOrigin(url));
  assert.equal(networkOrigin('http://127.0.0.1:8790', true), 'http://127.0.0.1:8790');
  assert.throws(() => networkOrigin('https://example.test', true));
  assert.equal(safeText('\x1b]52;attack\x07\u202eevil'), ']52;attackevil');
  assert.throws(() => parseArgs(['--api-key', 'never']), /unknown_or_missing_option/);
  assert.throws(() => parseArgs(['--local', '--local']), /duplicate_option/);
});
test('installation state uses new private home and rejects symlinks', async () => {
  const home = await mkdtemp(join(tmpdir(), 'adr-auth-test-'));
  try {
    const store = new AuthStore(home); assert.equal(await store.read(), null); await store.write({ fixture: 'nonsecret' });
    assert.equal((await lstat(join(home, '.adr-v2/installation.json'))).mode & 0o777, 0o600);
    assert.deepEqual(await store.read(), { fixture: 'nonsecret' }); await store.clear();
    const other = join(home, 'fixture'); await writeFile(other, '{}'); await symlink(other, join(home, '.adr-v2/installation.json'));
    await assert.rejects(store.read(), /state_unavailable/);
  } finally { await rm(home, { recursive: true, force: true }); }
});
test('proof binds exact body, token, origin, method, nonce and marketplace identity', () => {
  const keys = generateKeyPairSync('ed25519'); const identity = { publicKey: keys.publicKey.export({ format: 'jwk' }), privateKey: keys.privateKey.export({ format: 'jwk' }) };
  const signed = proof(identity, 'POST', 'https://api.example.test/v2/quotes?filter=ignored', '{}', 'nonce', 'synthetic-access');
  const [header, payload, signature] = signed.split('.');
  assert.equal(verify(null, Buffer.from(`${header}.${payload}`), createPublicKey({ key: identity.publicKey, format: 'jwk' }), Buffer.from(signature, 'base64url')), true);
  const p = JSON.parse(Buffer.from(payload, 'base64url')); assert.equal(p.client_kind, 'marketplace'); assert.equal(p.htu, 'https://api.example.test/v2/quotes'); assert.equal(p.nonce, 'nonce'); assert.ok(p.bht); assert.ok(p.ath);
});
test('mutation has no network retry after unknown outcome and rejects redirects', async () => {
  let calls = 0;
  const n = new Network({ origin: 'http://127.0.0.1:8790', local: true, fetcher: async (_url, options) => { calls++; assert.equal(options.redirect, 'error'); throw new Error('private upstream diagnostic'); } });
  await assert.rejects(n.request('/v2/sessions', { method: 'POST', body: {} }), /network_unavailable_outcome_unknown/); assert.equal(calls, 1);
});
test('provider CLI creates only metadata and market browsing is public', async () => {
  const calls = []; const output = []; const network = { request: async (path, options) => { calls.push({ path, options }); return path.startsWith('/v2/listings') ? { listings: [], nextCursor: null } : { id: 'fixture' }; } };
  await run(['--local', '--json', 'provider', 'create', '--name', 'Permitted capacity', '--model', 'test-model', '--endpoint', 'https://api.example.test/v1/chat/completions'], { network, output: v => output.push(v) });
  assert.equal(calls[0].path, '/v2/providers/nodes'); assert.equal(calls[0].options.body.supplyClass, 'authorized_api'); assert.equal('apiKey' in calls[0].options.body, false);
  await run(['--local', '--json', 'market', '--model', 'test model'], { network, output: v => output.push(v) });
  assert.equal(calls[1].options.public, true); assert.equal(calls[1].path, '/v2/listings?model=test+model');
});
test('provider broker excludes private destinations and only calls a fixed self-hosted endpoint', async () => {
  for (const ip of ['127.0.0.1', '169.254.169.254', '10.0.0.1', '172.16.0.1', '192.168.1.1', '::1', '::ffff:127.0.0.1', 'fd00::1']) assert.equal(publicAddress(ip), false);
  assert.throws(() => validateBinding({ endpoint: 'https://user:secret@example.test', supplyClass: 'authorized_api' }));
  let received;
  const server = createServer(async (req, res) => { let bytes = ''; for await (const chunk of req) bytes += chunk; received = { path: req.url, authorization: req.headers.authorization, body: JSON.parse(bytes) }; res.setHeader('content-type', 'application/json'); res.end(JSON.stringify({ choices: [{ message: { content: 'synthetic output' } }], usage: { prompt_tokens: 2, completion_tokens: 4 } })); });
  await new Promise(r => server.listen(0, '127.0.0.1', r));
  try {
    const result = await upstreamInference({ endpoint: `http://127.0.0.1:${server.address().port}/v1/chat/completions`, model: 'fixed-model', supplyClass: 'self_hosted' }, 'synthetic-key', { requestId: 'request', messages: [{ role: 'user', content: 'fixture' }], maxOutputTokens: 8, upstreamBudget: { reservedMicrousd: '100', inputBound: 8192, tariffVersion: 'synthetic-v1', inputMicrousdPerMillion: '1000', outputMicrousdPerMillion: '2000' }, endpoint: 'https://other.test' });
    assert.equal(received.path, '/v1/chat/completions'); assert.equal(received.body.model, 'fixed-model'); assert.equal(received.authorization, 'Bearer synthetic-key'); assert.equal(result.text, 'synthetic output'); assert.equal(JSON.stringify(result).includes('synthetic-key'), false);
  } finally { await new Promise(r => server.close(r)); }
});

test('refresh state lock rejects concurrent rotation without reading or leaking credentials', async () => {
  const home = await mkdtemp(join(tmpdir(), 'adr-lock-test-'));
  try {
    const a = new AuthStore(home); const b = new AuthStore(home); let release;
    const pending = a.withLock(() => new Promise(r => { release = r; }));
    while (!release) await new Promise(r => setTimeout(r, 1));
    await assert.rejects(b.withLock(() => undefined), /auth_state_busy/); release(); await pending;
    assert.equal(await b.withLock(() => 'released'), 'released');
  } finally { await rm(home, { recursive: true, force: true }); }
});

test('unknown refresh outcome is persisted and cannot reuse the rotating refresh token', async () => {
  const home = await mkdtemp(join(tmpdir(), 'adr-refresh-test-'));
  try {
    const keys = generateKeyPairSync('ed25519'); const store = new AuthStore(home);
    await store.write({ origin: 'https://api.example.test', publicKey: keys.publicKey.export({ format: 'jwk' }), privateKey: keys.privateKey.export({ format: 'jwk' }), expiresAt: 1, refresh_token: 'synthetic-only', installation_id: 'synthetic' });
    let calls = 0; const n = new Network({ origin: 'https://api.example.test', store, fetcher: async () => { calls++; throw new Error('unknown'); } });
    await assert.rejects(n.request('/v2/me'), /network_unavailable_outcome_unknown/);
    await assert.rejects(n.request('/v2/me'), /refresh_outcome_unknown_reenroll_required/);
    assert.equal(calls, 1);
  } finally { await rm(home, { recursive: true, force: true }); }
});

test('official DeepSeek requests disable thinking for text/tool-only continuation', async () => {
  const { upstreamBody } = await import('../src/provider-broker.mjs');
  const frame = { messages: [{ role: 'user', content: 'synthetic' }], maxOutputTokens: 32, tools: [] };
  const body = upstreamBody({ endpoint: 'https://api.deepseek.com/chat/completions', model: 'deepseek-v4-flash' }, frame);
  assert.deepEqual(body.thinking, { type: 'disabled' }); assert.equal(body.max_tokens, 32);
  assert.equal('thinking' in upstreamBody({ endpoint: 'https://example.test/infer', model: 'fixed' }, frame), false);
});
