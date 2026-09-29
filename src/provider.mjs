import { createServer } from 'node:http';
import { randomBytes, createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { InferenceRequest } from './generated/validators.mjs';
import { SandboxRuntime } from './runtime.mjs';
import { ClientError } from './network.mjs';
import { readHiddenKey } from './provider-setup.mjs';
import { upstreamInference, validateBinding } from './provider-broker.mjs';
const hash = value => createHash('sha256').update(value).digest('hex');
export const configuredRuntime = () => new SandboxRuntime({ executable: process.env.ADROUTER_NEW_RUNTIME_EXECUTABLE, library: process.env.ADROUTER_NEW_RUNTIME_LIBRARY, home: process.env.ADROUTER_NEW_RUNTIME_HOME });
export async function createGuest(runtime, hostPorts, copyDirectory) {
  const images = JSON.parse(await readFile(new URL('../runtime/guest-images.json', import.meta.url)));
  const name = await runtime.create({ image: images.node.reference, hostPorts, copyDirectory, durationSeconds: 600 });
  const info = await runtime.inspect(name);
  if (info.config.manifest_digest !== images.node[`linux-${process.arch}`] || info.config.mounts.length || info.config.network.policy.default_egress !== 'deny') {
    await runtime.remove(name); throw new ClientError('guest_identity_or_policy_mismatch');
  }
  return name;
}
export async function serveProvider(network, nodeId, { maxCalls = 1, maxOutputTokens = 1024, noKey = false, notify = () => {} } = {}) {
  if (!Number.isInteger(maxCalls) || maxCalls < 1 || maxCalls > 30 || !Number.isInteger(maxOutputTokens) || maxOutputTokens < 1 || maxOutputTokens > 8192) throw new ClientError('provider_exposure_bound_invalid');
  const node = await network.request(`/v2/providers/nodes/${nodeId}`);
  if (node.approval !== 'approved' || node.status !== 'published') throw new ClientError('approved_published_node_required');
  if (node.availability !== 'hot') throw new ClientError('cold_activation_not_integrated');
  if (noKey && node.supplyClass !== 'self_hosted') throw new ClientError('provider_credential_required');
  validateBinding(node);
  const runtime = configuredRuntime(); await runtime.verify();
  let credential = noKey ? '' : await readHiddenKey();
  let count = 0; let binding; let guest; let socket; let renewal; let deadline; let busy = false;
  const abort = new AbortController(); let closed; const finished = new Promise(resolve => { closed = resolve; });
  const stop = () => { abort.abort(); socket?.close(); closed(); };
  const broker = createServer(async (req, res) => {
    try {
      if (req.method !== 'POST' || req.url !== '/infer' || !binding || req.headers.authorization !== `Bearer ${binding.capability}`) { res.writeHead(403).end(); return; }
      const current = binding; binding = undefined; // capability is consumed once
      let bytes = ''; for await (const chunk of req) { bytes += chunk; if (Buffer.byteLength(bytes) > 150000) throw new Error('bound'); }
      if (hash(bytes) !== current.digest) throw new Error('binding');
      const frame = JSON.parse(bytes);
      if (!InferenceRequest(frame) || frame.deadlineUnixMs <= Date.now() || frame.maxOutputTokens > maxOutputTokens || ++count > maxCalls) throw new Error('exposure');
      const result = await upstreamInference(node, credential, frame, abort.signal);
      res.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify(result));
    } catch { res.writeHead(502).end(JSON.stringify({ code: 'provider_request_failed' })); }
  });
  try {
    await new Promise(resolve => broker.listen(0, '0.0.0.0', resolve));
    const port = broker.address().port; guest = await createGuest(runtime, [port]);
    const ticket = await network.request(`/v2/providers/nodes/${nodeId}/relay-ticket`, { method: 'POST', body: {} });
    const url = new URL('/v2/relay', network.origin); url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    socket = new WebSocket(url);
    const authenticate = async () => {
      try { const lease = await network.request(`/v2/providers/nodes/${nodeId}/relay-ticket`, { method: 'POST', body: {} }); socket.send(JSON.stringify({ type: 'authenticate', ticket: lease.ticket })); }
      catch { stop(); }
    };
    socket.addEventListener('open', () => {
      socket.send(JSON.stringify({ type: 'authenticate', ticket: ticket.ticket }));
      renewal = setInterval(() => void authenticate(), 10000);
    });
    socket.addEventListener('error', stop); socket.addEventListener('close', stop);
    socket.addEventListener('message', event => { void (async () => {
      if (typeof event.data !== 'string' || event.data.length > 1024 * 1024) throw new Error('frame_bound');
      const frame = JSON.parse(event.data);
      if (frame.type === 'ready') { notify({ status: 'serving', nodeId, remainingCalls: maxCalls - count, maxOutputTokens, credentials: 'memory_only' }); return; }
      if (busy || !InferenceRequest(frame) || frame.bindingRevision !== node.listingId || frame.maxOutputTokens > maxOutputTokens || count >= maxCalls) throw new Error('frame_rejected');
      busy = true;
      const bytes = JSON.stringify(frame); const capability = randomBytes(32).toString('base64url'); binding = { digest: hash(bytes), capability };
      // The connector guest sees one narrow capability, never the upstream key.
      const code = `fetch('http://host.microsandbox.internal:${port}/infer',{method:'POST',headers:{authorization:${JSON.stringify(`Bearer ${capability}`)}},body:${JSON.stringify(bytes)},signal:AbortSignal.timeout(42000)}).then(async r=>{if(!r.ok)throw Error();console.log(await r.text())}).catch(()=>process.exit(1))`;
      const result = JSON.parse(await runtime.run(guest, ['node', '-e', code], { timeoutSeconds: 45, signal: abort.signal }));
      socket.send(JSON.stringify(result)); busy = false; binding = undefined;
      if (count >= maxCalls) { await network.request(`/v2/providers/nodes/${nodeId}/pause`, { method: 'POST', body: {} }); stop(); }
    })().catch(stop); });
    process.once('SIGINT', stop); process.once('SIGTERM', stop);
    deadline = setTimeout(stop, 540000);
    await finished;
    return { status: 'stopped', completedOrAttemptedCalls: count, credentials: 'discarded' };
  } finally {
    credential = ''; binding = undefined; abort.abort(); clearInterval(renewal); clearTimeout(deadline);
    process.removeListener('SIGINT', stop); process.removeListener('SIGTERM', stop); socket?.close();
    broker.closeAllConnections(); await new Promise(resolve => broker.close(resolve));
    if (guest && runtime.owned.has(guest)) await runtime.remove(guest);
    await network.request(`/v2/providers/nodes/${nodeId}/stop`, { method: 'POST', body: {} }).catch(() => {});
  }
}
