// Real microVM feasibility gate with synthetic inference. This is deliberately
// not metered-provider, WSS, wallet, installed-package or release acceptance.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { once } from 'node:events';
import { mkdtemp, realpath, writeFile, readFile, rm, mkdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { tmpdir } from 'node:os';
import { randomUUID, createHash } from 'node:crypto';
import { SandboxRuntime } from '../src/runtime.mjs';
import { importWorkspace, proposeExport, ExportApproval } from '../src/workspace.mjs';
import { InferenceRequest } from '../src/generated/validators.mjs';

const image = JSON.parse(await readFile(new URL('../runtime/guest-images.json', import.meta.url))).node;
const runtime = new SandboxRuntime({ executable: process.env.ADROUTER_NEW_RUNTIME_EXECUTABLE, library: process.env.ADROUTER_NEW_RUNTIME_LIBRARY, home: process.env.ADROUTER_NEW_RUNTIME_HOME });
const servers = [];
const sandboxes = [];
const root = await realpath(await mkdtemp(join(tmpdir(), 'adrnew-proof-')));
const wire = [];
const fixtureSecret = `synthetic-upstream-${randomUUID()}`;
let imported;
let connectorTask;
async function jsonBody(req) {
  let text = '';
  for await (const chunk of req) { text += chunk; if (Buffer.byteLength(text) > 65536) throw new Error('fixture_frame_limit'); }
  return JSON.parse(text);
}
async function server(handler) {
  const srv = createServer((req, res) => Promise.resolve(handler(req, res)).catch(() => { res.writeHead(400); res.end('fixture_rejected'); }));
  srv.requestTimeout = 15_000;
  srv.listen(0, '127.0.0.1');
  await once(srv, 'listening');
  servers.push(srv);
  return srv.address().port;
}
function reply(res, value) { res.setHeader('content-type', 'application/json'); res.end(JSON.stringify(value)); }

try {
  const identity = await runtime.verify();
  console.log('runtime_identity_verified');
  await writeFile(join(root, 'task.txt'), 'fixture workspace');
  await writeFile(join(root, '.env'), 'SYNTHETIC_HOST_SECRET=never-imported');
  await mkdir(join(root, '.git'));
  await writeFile(join(root, '.git', 'config'), 'synthetic-git-marker');
  imported = await importWorkspace(root, ['task.txt']);
  const upstream = await server(async (req, res) => {
    assert.equal(req.headers.authorization, `Bearer ${fixtureSecret}`);
    const request = await jsonBody(req);
    assert.equal(InferenceRequest(request), true);
    reply(res, { text: 'fixture result: updated workspace', inputTokens: 3, outputTokens: 5 });
  });
  // Trusted host broker inserts synthetic auth only at its fixed upstream. It
  // accepts no URL/header/command from either guest. Production binding not yet implemented.
  const broker = await server(async (req, res) => {
    assert.equal(req.method, 'POST'); assert.equal(req.url, '/infer');
    const request = await jsonBody(req);
    assert.equal(InferenceRequest(request), true);
    wire.push(JSON.stringify(request));
    const result = await fetch(`http://127.0.0.1:${upstream}/infer`, { method: 'POST', headers: { authorization: `Bearer ${fixtureSecret}` }, body: JSON.stringify(request), signal: AbortSignal.timeout(5000) });
    reply(res, await result.json());
  });
  let queued;
  let delivered;
  let done;
  const completion = new Promise(resolve => { done = resolve; });
  const relay = await server(async (req, res) => {
    if (req.method === 'GET' && req.url === '/work') { reply(res, queued ?? null); queued = undefined; return; }
    if (req.method === 'POST' && req.url === '/result') {
      delivered = await jsonBody(req); wire.push(JSON.stringify(delivered)); done(); reply(res, { ok: true }); return;
    }
    assert.equal(req.method, 'POST'); assert.equal(req.url, '/infer');
    const request = await jsonBody(req); assert.equal(InferenceRequest(request), true);
    wire.push(JSON.stringify(request)); queued = request;
    await Promise.race([completion, new Promise((_, reject) => { const timer = setTimeout(() => reject(new Error('fixture_deadline')), 15000); timer.unref(); })]);
    reply(res, delivered);
  });
  const connector = await runtime.create({ image: image.reference, hostPorts: [relay, broker], durationSeconds: 180 }); sandboxes.push(connector);
  console.log('connector_guest_created');
  const buyer = await runtime.create({ image: image.reference, copyDirectory: imported.copy, hostPorts: [relay], durationSeconds: 180 }); sandboxes.push(buyer);
  console.log('buyer_guest_created');
  for (const name of sandboxes) {
    const info = await runtime.inspect(name);
    assert.equal(info.config.manifest_digest, image[`linux-${process.arch}`]);
    assert.equal(info.config.resources.cpus, 1);
    assert.equal(info.config.resources.memory_mib, 256);
    assert.equal(info.config.security_profile, 'restricted');
    assert.equal(info.config.network.policy.default_egress, 'deny');
    assert.equal(info.config.network.policy.default_ingress, 'deny');
    assert.deepEqual(info.config.mounts, []);
  }
  const connectorCode = `
    (async () => {
      for (let i=0;i<100;i++) {
        const job = await (await fetch('http://host.microsandbox.internal:${relay}/work',{signal:AbortSignal.timeout(5000)})).json();
        if (job) {
          const result = await (await fetch('http://host.microsandbox.internal:${broker}/infer', {method:'POST',body:JSON.stringify(job),signal:AbortSignal.timeout(5000)})).json();
          await fetch('http://host.microsandbox.internal:${relay}/result', {method:'POST',body:JSON.stringify(result),signal:AbortSignal.timeout(5000)});
          console.log('connector_done'); return;
        }
        await new Promise(r=>setTimeout(r,100));
      }
      throw new Error('connector_deadline');
    })().catch(e=>{console.log(JSON.stringify({error:'connector_fixture_failed',code:e.cause?.code??e.code??e.name}));});`;
  connectorTask = runtime.run(connector, ['node', '-e', connectorCode], { timeoutSeconds: 30 });
  connectorTask.catch(() => {});
  const request = { type: 'inference', sessionId: 'fixture-session', requestId: 'fixture-request', bindingRevision: 'fixture-binding', sequence: 1, deadlineUnixMs: Date.now() + 15000, messages: [{ role: 'user', content: 'Update the fixture workspace' }], maxOutputTokens: 32 };
  const buyerCode = `
    (async () => {
      const fs = require('node:fs');
      if (process.platform !== 'linux' || fs.existsSync('/workspace/.env') || fs.existsSync('/workspace/.git') || fs.existsSync(${JSON.stringify(join(root, '.env'))})) throw new Error('isolation');
      const result = await (await fetch('http://host.microsandbox.internal:${relay}/infer', {method:'POST',body:JSON.stringify(${JSON.stringify(request)}),signal:AbortSignal.timeout(10000)})).json();
      fs.writeFileSync('/workspace/task.txt', result.text);
      console.log(JSON.stringify({content:fs.readFileSync('/workspace/task.txt','utf8'),platform:process.platform}));
    })().catch(e=>{console.log(JSON.stringify({error:'buyer_fixture_failed',code:e.cause?.code??e.code??e.name}));});`;
  const result = JSON.parse(await runtime.run(buyer, ['node', '-e', buyerCode], { timeoutSeconds: 25 }));
  if (result.error) throw new Error(JSON.stringify(result));
  assert.equal(await connectorTask, 'connector_done\n');
  assert.equal(result.platform, 'linux');
  assert.equal(result.content, 'fixture result: updated workspace');
  assert.equal(wire.join('').includes(fixtureSecret), false);
  // A buyer cannot bypass the relay and directly reach the credential broker.
  const bypass = await runtime.run(buyer, ['node', '-e', `(async()=>{try{await fetch('http://host.microsandbox.internal:${broker}/infer',{signal:AbortSignal.timeout(1000)});process.exit(1)}catch{console.log('blocked')}})()`]);
  assert.equal(bypass, 'blocked\n');
  const proposal = await proposeExport(imported, { 'task.txt': result.content });
  assert.equal((await new ExportApproval(proposal).approve(imported, proposal.id))[0].after, proposal.changes[0].after);
  assert.equal(await readFile(join(root, 'task.txt'), 'utf8'), 'fixture workspace');
  const abort = new AbortController();
  const pending = runtime.run(buyer, ['node', '-e', 'setInterval(()=>{},1000)'], { signal: abort.signal, timeoutSeconds: 20 });
  setTimeout(() => abort.abort(), 500);
  await assert.rejects(pending, /runtime_cancelled/);
  assert.equal(runtime.owned.has(buyer), false);
  await runtime.remove(connector);
  assert.equal(runtime.owned.size, 0);
  const sourceSha256 = {};
  for (const path of ['scripts/verify-runtime.mjs', 'src/runtime.mjs', 'src/workspace.mjs', 'src/generated/validators.mjs', 'runtime/manifest.json', 'runtime/guest-images.json']) sourceSha256[path] = createHash('sha256').update(await readFile(new URL(`../${path}`, import.meta.url))).digest('hex');
  const evidence = { schemaVersion: 1, recordedAt: new Date().toISOString(), kind: 'real_microvm_synthetic_inference_feasibility', sourceSha256, identity, image: image.reference, guestManifest: image[`linux-${process.arch}`], checks: ['two_guest_execution', 'typed_relay_fixture', 'provider_local_synthetic_auth', 'no_credential_on_wire', 'no_host_files_or_git', 'no_shared_mounts', 'cpu_memory_policy', 'deny_default_network', 'buyer_broker_bypass_blocked', 'reviewed_export', 'original_unchanged', 'cancel_tears_down', 'all_guests_removed'], releaseAcceptance: false };
  await mkdir(resolve('output'), { recursive: true });
  await writeFile(resolve('output/runtime-feasibility.json'), JSON.stringify(evidence, null, 2) + '\n');
  console.log(JSON.stringify(evidence));
} finally {
  for (const name of sandboxes) if (runtime.owned.has(name)) await runtime.remove(name);
  await connectorTask?.catch(() => {});
  for (const srv of servers) { srv.closeAllConnections(); srv.close(); }
  if (imported) await rm(imported.copy, { recursive: true, force: true });
  await rm(root, { recursive: true, force: true });
}
