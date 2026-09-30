import { connect } from 'node:net';
import { lookup } from 'node:dns';
import { createServer } from 'node:http';
import { randomBytes } from 'node:crypto';
import { readFile, writeFile, mkdtemp, copyFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { InferenceRequest } from './generated/validators.mjs';
import { SandboxRuntime } from './runtime.mjs';
import { ClientError } from './network.mjs';
import { validateBinding, publicAddress } from './provider-broker.mjs';
export async function configuredRuntime() {
  const { loadRuntimeConfig } = await import('./runtime-install.mjs');
  const config = process.env.ADROUTER_NEW_RUNTIME_EXECUTABLE ? { executable: process.env.ADROUTER_NEW_RUNTIME_EXECUTABLE, library: process.env.ADROUTER_NEW_RUNTIME_LIBRARY, home: process.env.ADROUTER_NEW_RUNTIME_HOME } : await loadRuntimeConfig();
  return new SandboxRuntime(config ?? {});
}
export async function createGuest(runtime, hostPorts, copyDirectory, endpoint, { signal } = {}) {
  const images = JSON.parse(await readFile(new URL('../runtime/guest-images.json', import.meta.url)));
  const name = await runtime.create({ image: images.node.reference, hostPorts, copyDirectory, endpoint, durationSeconds: 540, signal });
  try {
    signal?.throwIfAborted();
    const info = await runtime.inspect(name);
    if (info.config.manifest_digest !== images.node[`linux-${process.arch}`] || info.config.mounts.length || info.config.network.policy.default_egress !== 'deny') throw new ClientError('guest_identity_or_policy_mismatch');
    signal?.throwIfAborted(); return name;
  } catch (error) { await runtime.remove(name); throw error; }
}

export async function startProvider(networkInput, nodeId, { maxCalls = 5, maxOutputTokens = 1024, runtimeConfig, noKey = false, notify = () => {}, consoleOptions } = {}) {
  if (!Number.isInteger(maxCalls) || maxCalls < 1 || maxCalls > 30 || !Number.isInteger(maxOutputTokens) || maxOutputTokens < 1 || maxOutputTokens > 8192) throw new ClientError('provider_exposure_bound_invalid');
  const network = Object.create(networkInput); network.actor = 'provider';
  let node = await network.request(`/v2/providers/nodes/${nodeId}`);
  if (node.suspended === true) throw new ClientError('node_suspended');
  const binding = validateBinding(node);
  if(noKey && node.supplyClass !== 'self_hosted')throw new ClientError('provider_credential_required');
  const enginePort = binding.loopback ? Number(binding.url.port) : undefined;
  if(binding.loopback && (!enginePort || enginePort < 1024))throw new ClientError('self_hosted_port_required');
  const runtime = runtimeConfig ? new SandboxRuntime(runtimeConfig) : await configuredRuntime(); await runtime.verify();
  const capability = randomBytes(32).toString('base64url');
  let guest, copied, socket, timer, deadline, pending, guestReady = false, relayReady = false, stopped = false, starting = false, connecting = false, calls = 0;
  let complete; const done = new Promise(resolve => { complete = resolve; });
  let activation = [];
  const abort = new AbortController();
  const broker = createServer(async (req, res) => {
    try {
      if (req.headers.authorization !== `Bearer ${capability}`) { res.writeHead(403).end(); return; }
      let bytes = ''; for await (const chunk of req) { bytes += chunk; if (Buffer.byteLength(bytes) > 1024 * 1024) throw new Error('body_limit'); }
      let reply = { ok: true };
      if (req.method === 'POST' && req.url === '/ready' && bytes === '{"ready":true}') guestReady = true;
      else if (req.method === 'GET' && req.url === '/work') { reply = stopped ? { type: 'stop' } : pending?.frame ?? null; if (pending?.frame) pending.frame = undefined; }
      else if (req.method === 'POST' && req.url === '/result') {
        const result = JSON.parse(bytes);
        if (!pending || result.type !== 'result' || result.requestId !== pending.id || typeof result.text !== 'string' || !Number.isSafeInteger(result.inputTokens) || !Number.isSafeInteger(result.outputTokens)) throw new Error('result_binding');
        socket?.send(JSON.stringify(result)); pending = undefined; calls++;
        if (calls >= maxCalls) void stop();
      } else if (req.method === 'POST' && req.url === '/failed') { void stop(); }
      else throw new Error('control_operation');
      res.writeHead(200, { 'content-type': 'application/json' }).end(JSON.stringify(reply));
    } catch { res.writeHead(400).end('{"code":"control_rejected"}'); }
  });
  // Fixed-destination byte transport only. TLS starts in the guest and ends at
  // the approved upstream; this process never decrypts or constructs credentials.
  const tunnels = new Set();
  broker.on('connect', (req, socket, head) => {
    if(stopped || req.url !== '/upstream' || req.headers.authorization !== `Bearer ${capability}` || head.length || tunnels.size >= 2) { socket.destroy(); return; }
    const target=binding.url;
    const upstream=connect({host:target.hostname,port:Number(target.port)||443,lookup(host,options,callback){
      lookup(host,options,(error,addresses,family)=>{
        if(error){callback(error,addresses,family);return;}
        const all=Array.isArray(addresses)?addresses.map(a=>a.address):[addresses];
        if(!all.every(publicAddress)){callback(new Error('address_rejected'),'',4);return;}
        callback(null,addresses,family);
      });
    }});
    tunnels.add(upstream); const close=()=>{upstream.destroy();socket.destroy();tunnels.delete(upstream);};
    upstream.setTimeout(45000,close);socket.setTimeout(45000,close);upstream.once('error',close);socket.once('error',close);socket.once('close',close);upstream.once('close',close);
    upstream.once('connect',()=>{socket.write('HTTP/1.1 200 Connection Established\r\n\r\n');socket.pipe(upstream);upstream.pipe(socket);});
  });
  async function warm() {
    const activationDeadline = activation.length ? Math.min(...activation.map(a => a.deadline)) : undefined;
    if (activationDeadline && activationDeadline <= Date.now()) throw new ClientError('activation_expired');
    const warmSignal = activationDeadline ? AbortSignal.any([abort.signal, AbortSignal.timeout(Math.max(1, activationDeadline - Date.now()))]) : abort.signal;
    if (stopped || starting || guest) throw new ClientError('guest_already_started');
    starting = true;
    try {
      copied = await mkdtemp(join(tmpdir(), 'adr-provider-'));
      for (const [from, to] of [['guest/provider-console.mjs', 'provider-console.mjs'], ['provider-broker.mjs', 'provider-broker.mjs'], ['provider-setup.mjs', 'provider-setup.mjs']]) await copyFile(new URL(from, import.meta.url), join(copied, to));
      await writeFile(join(copied, 'config.json'), JSON.stringify({ control: `http://host.microsandbox.internal:${broker.address().port}`, capability, noKey, node: binding.loopback ? {...node,localEngine:true,endpoint:node.endpoint.replace(binding.url.hostname,'host.microsandbox.internal')} : {...node,tunnel:{port:broker.address().port,capability}}, maxCalls, maxOutputTokens }), { mode: 0o600 });
      guest = await createGuest(runtime, [broker.address().port, ...(enginePort ? [enginePort] : [])], copied, undefined, { signal: warmSignal });
      warmSignal.throwIfAborted();
      if(noKey) await runtime.run(guest,['node','/workspace/provider-console.mjs'],{signal:warmSignal,timeoutSeconds:20});
      else await runtime.attachConsole(guest, ['node', '/workspace/provider-console.mjs'], { ...consoleOptions, signal: warmSignal });
      warmSignal.throwIfAborted();
      if (!guestReady) throw new ClientError('guest_start_failed');
      notify({ status: 'warm', credentials: 'guest_memory_only' });
    } catch (error) {
      const cleanup = await Promise.allSettled([stop(), guest && runtime.owned.has(guest) ? runtime.remove(guest) : Promise.resolve()]);
      if (cleanup.some(r => r.status === 'rejected' || r.value?.status === 'cleanup_required')) throw new ClientError('provider_cleanup_required');
      throw error;
    }
    finally { starting = false; if (copied) { await rm(copied, { recursive: true, force: true }); copied = undefined; } }
  }
  async function tick() {
    if (stopped || connecting) return;
    connecting = true;
    try {
      node = await network.request(`/v2/providers/nodes/${nodeId}`);
      if (node.suspended === true || node.status === 'paused') { await stop(); return; }
      if (node.status !== 'published') return;
      if (node.availability === 'cold' && !guestReady) {
        await network.request(`/v2/providers/nodes/${nodeId}/heartbeat`, { method: 'POST', body: { ready: false } });
        activation = await network.request(`/v2/providers/nodes/${nodeId}/activations`);
        if (activation.length) notify({ status: 'activation_required', deadline: activation[0].deadline });
        return;
      }
      if (!guestReady) return;
      const ticket = await network.request(`/v2/providers/nodes/${nodeId}/relay-ticket`, { method: 'POST', body: {} });
      if (socket?.readyState === WebSocket.OPEN) socket.send(JSON.stringify({ type: 'authenticate', ticket: ticket.ticket, ready: true }));
      else {
        const url = new URL('/v2/relay', network.origin); url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
        socket = new WebSocket(url);
        socket.addEventListener('open', () => socket.send(JSON.stringify({ type: 'authenticate', ticket: ticket.ticket, ready: true })));
        socket.addEventListener('error', () => void stop());
        socket.addEventListener('close', () => void stop());
        socket.addEventListener('message', event => { void (async () => {
          if (typeof event.data !== 'string' || event.data.length > 1024 * 1024) throw new Error('frame_limit');
          const frame = JSON.parse(event.data);
          if (frame.type === 'ready') {
            relayReady = true;
            for (const a of activation) await network.request(`/v2/providers/nodes/${nodeId}/activations/${a.sessionId}`, { method: 'POST', body: {} });
            activation = []; notify({ status: 'serving', remainingCalls: maxCalls - calls }); return;
          }
          if (frame.type === 'cancel') { await stop(); return; }
          if (pending || !InferenceRequest(frame) || frame.bindingRevision !== node.listingId || frame.maxOutputTokens > maxOutputTokens || calls >= maxCalls) throw new Error('frame_rejected');
          pending = { id: frame.requestId, frame };
        })().catch(() => void stop()); });
      }
    } catch { await stop(); }
    finally { connecting = false; }
  }
  async function stop() {
    if (stopped) return done;
    stopped = true; guestReady = false; relayReady = false; for(const tunnel of tunnels)tunnel.destroy(); abort.abort(); clearInterval(timer); clearTimeout(deadline); socket?.close();
    process.removeListener('SIGINT', onSignal); process.removeListener('SIGTERM', onSignal);
    let teardownVerified = true;
    try { if (guest && runtime.owned.has(guest)) await runtime.remove(guest); }
    catch { teardownVerified = false; }
    finally {
      broker.closeAllConnections(); await new Promise(resolve => broker.close(resolve));
      await network.request(`/v2/providers/nodes/${nodeId}/stop`, { method: 'POST', body: {} }).catch(() => {});
      const result = { status: teardownVerified ? 'stopped' : 'cleanup_required', completedCalls: calls, credentials: teardownVerified ? 'discarded' : 'teardown_unverified' };
      notify(result); complete(result);
    }
  }
  const onSignal = () => void stop();
  try {
    await new Promise(resolve => broker.listen(0, '0.0.0.0', resolve));
    process.once('SIGINT', onSignal); process.once('SIGTERM', onSignal);
    deadline = setTimeout(onSignal, 540000);
    if (node.availability === 'hot') await warm();
    await tick(); if (!stopped) timer = setInterval(() => void tick(), 3000);
    return { done, stop, warm, get status() { return { stopped, guestReady, relayReady, calls, activation }; } };
  } catch (error) { await stop(); throw error; }
}
export async function serveProvider(network, nodeId, options = {}) { const controller = await startProvider(network, nodeId, options); return controller.done; }
