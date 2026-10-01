import { connect } from 'node:net';
import { lookup } from 'node:dns';
import { createServer } from 'node:http';
import { randomBytes, randomUUID } from 'node:crypto';
import { readFile, writeFile, mkdtemp, copyFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { CodingInferenceRequest, InferenceRequest, Handshake, HandshakeResult, ProviderRelayReady, ProviderRequestFailure } from './generated/validators.mjs';
import { SandboxRuntime } from './runtime.mjs';
import { ClientError } from './network.mjs';
import { validateBinding, publicAddress } from './provider-broker.mjs';
import { backgroundOperation, recoverableStatusFailure } from './buyer-lifecycle.mjs';
import { ProviderLifecycle } from './provider-lifecycle.mjs';
export async function configuredRuntime() {
  const { loadRuntimeConfig } = await import('./runtime-install.mjs');
  const config = process.env.ADROUTER_NEW_RUNTIME_EXECUTABLE ? { executable: process.env.ADROUTER_NEW_RUNTIME_EXECUTABLE, library: process.env.ADROUTER_NEW_RUNTIME_LIBRARY, home: process.env.ADROUTER_NEW_RUNTIME_HOME } : await loadRuntimeConfig();
  return new SandboxRuntime(config ?? {});
}
export async function createGuest(runtime, hostPorts, copyDirectory, endpoint, { signal, continuous = false, kind = 'node' } = {}) {
  const images = JSON.parse(await readFile(new URL('../runtime/guest-images.json', import.meta.url)));
  const name = await runtime.create({ image: images[kind].reference, hostPorts, copyDirectory, endpoint, durationSeconds: 540, continuous, signal, ...(kind==='coding'?{memoryMiB:1024,rootDiskGiB:4}:{}) });
  try {
    signal?.throwIfAborted();
    const info = await runtime.inspect(name);
    if (info.config.manifest_digest !== images[kind][`linux-${process.arch}`] || info.config.mounts.length || info.config.network.policy.default_egress !== 'deny') throw new ClientError('guest_identity_or_policy_mismatch');
    signal?.throwIfAborted(); return name;
  }catch(error){try{error.sandboxName=name;}catch{}await runtime.remove(name).catch(()=>{});throw error;}
}

export async function startProvider(networkInput, nodeId, { maxCalls = 5, maxOutputTokens = 1024, runtimeConfig, runtime: providedRuntime, noKey = false, notify = () => {}, continuous: requestedContinuous, consoleOptions, diagnosticsDirectory, intervals = {}, Socket = WebSocket, now = Date.now } = {}) {
  if (!Number.isInteger(maxCalls) || maxCalls < 1 || maxCalls > 30 || !Number.isInteger(maxOutputTokens) || maxOutputTokens < 1 || maxOutputTokens > 8192) throw new ClientError('provider_exposure_bound_invalid');
  const network = Object.create(networkInput); network.actor = 'provider';
  let node = await network.request(`/v2/providers/nodes/${nodeId}`);
  if (node.suspended === true) throw new ClientError('node_suspended');
  const continuous = requestedContinuous ?? node.availability === 'hot';
  if (continuous && node.availability !== 'hot') throw new ClientError('continuous_hot_only');
  const binding = validateBinding(node);
  if(noKey && node.supplyClass !== 'self_hosted')throw new ClientError('provider_credential_required');
  const enginePort = binding.loopback ? Number(binding.url.port) : undefined;
  if(binding.loopback && (!enginePort || enginePort < 1024))throw new ClientError('self_hosted_port_required');
  const runtime = providedRuntime ?? (runtimeConfig ? new SandboxRuntime(runtimeConfig) : await configuredRuntime()); await runtime.verify();
  const providerRunId = randomUUID();
  const lifecycle = new ProviderLifecycle({ nodeId, providerRunId, profile: network.store?.profile ?? 'provider', directory: diagnosticsDirectory, now });
  const capability = randomBytes(32).toString('base64url');
  let guest, copied, socket, deadline, pending, guestReady = false, relayReady = false, stopped = false, starting = false, calls = 0;
  let claimed = false, allocation, closing, statusPoll, renewal, keepalive, touchRetry, reconnectTimer, authenticationTimer, leaseTimer;
  let relayGeneration, relayLeaseUntil = 0, socketEpoch = 0, backoff = 0, lastTouch = 0, lastGuestPoll = 0, cleanupRequired = false, teardownVerified;
  const control = [];
  let complete; const done = new Promise(resolve => { complete = resolve; });
  let activation = [];
  const abort = new AbortController();
  const bounded = ms => AbortSignal.any([abort.signal, AbortSignal.timeout(ms)]);
  const snapshot = () => ({ stopped, guestReady, relayReady, calls, activation, providerRunId, relayGeneration, relayLeaseUntil, cleanupRequired, teardownVerified, firstFailure: lifecycle.firstFailure, stopTrigger: lifecycle.stopTrigger });
  const announce = value => { try { notify({ ...value, ...snapshot() }); } catch {} };
  const failure = (phase, error, fallback) => lifecycle.event(phase, { code: error?.code ?? fallback, signal: error?.signal, exitCode: error?.exitCode });
  const clearReadiness = code => { relayReady = false; relayLeaseUntil = 0; clearTimeout(leaseTimer); lifecycle.event('relay', { code, status: 'reconnecting' }); announce({ status: 'reconnecting' }); };
  const cancelRequest = () => {
    if (!pending || pending.cancelled) return;
    pending.cancelled = true;
    pending.frame = undefined;
    if (pending.binding.type === 'handshake') { pending = undefined; return; }
    control.push({ type: 'cancel', requestId: pending.id, sessionId: pending.binding.sessionId, bindingRevision: pending.binding.bindingRevision, sequence: pending.binding.sequence });
    for (const tunnel of tunnels) tunnel.destroy();
    lifecycle.event('request', { status: 'cancellation_requested' });
  };
  const broker = createServer(async (req, res) => {
    try {
      if (req.headers.authorization !== `Bearer ${capability}`) { res.writeHead(403).end(); return; }
      let bytes = ''; for await (const chunk of req) { bytes += chunk; if (Buffer.byteLength(bytes) > 1024 * 1024) throw new Error('body_limit'); }
      let reply = { ok: true };
      if (req.method === 'POST' && req.url === '/ready' && bytes === '{"ready":true}') { guestReady = true; lastGuestPoll = now(); }
      else if (req.method === 'GET' && req.url === '/work') { lastGuestPoll = now(); reply = stopped ? { type: 'stop' } : control.shift() ?? pending?.frame ?? null; if (reply === pending?.frame) pending.frame = undefined; }
      else if (req.method === 'POST' && req.url === '/handshake-result') {
        const result = JSON.parse(bytes);
        if (!pending || !HandshakeResult(result) || pending.id !== result.challengeId || Object.keys(pending.binding).some(k => k !== 'type' && pending.binding[k] !== result[k])) throw new Error('handshake_binding');
        if (!pending.cancelled && relayReady && pending.socket === socket) socket.send(JSON.stringify(result)); pending = undefined;
      } else if (req.method === 'POST' && req.url === '/delta') {
        const e=JSON.parse(bytes); if(!pending || e.requestId!==pending.id || e.type!=='coding_delta' || !Number.isInteger(e.sequence) || e.sequence!==Number(pending.streamSequence??0)+1 || !['text','thinking','tool'].includes(e.kind) || typeof e.text!=='string' || e.text.length>8192)throw Error('delta_rejected');
        pending.streamSequence=e.sequence;if (!pending.cancelled && relayReady && pending.socket === socket) socket.send(JSON.stringify(e));
      } else if (req.method === 'POST' && req.url === '/timing') {
        const timing = JSON.parse(bytes);
        if (!pending || timing.requestId !== pending.id || timing.phase !== 'upstream' || !['unknown','succeeded'].includes(timing.outcome) || (timing.statusCode !== null && (!Number.isInteger(timing.statusCode) || timing.statusCode < 100 || timing.statusCode > 599)) || !Number.isInteger(timing.totalMs) || timing.totalMs < 0 || timing.totalMs > 135000 || (timing.headersMs !== null && (!Number.isInteger(timing.headersMs) || timing.headersMs < 0 || timing.headersMs > timing.totalMs))) throw new Error('timing_rejected');
        if (!pending.cancelled && relayReady && pending.socket === socket) socket.send(JSON.stringify({type:'diagnostic',requestId:timing.requestId,phase:'upstream',outcome:timing.outcome,statusCode:timing.statusCode,headersMs:timing.headersMs,totalMs:timing.totalMs}));
      } else if (req.method === 'POST' && req.url === '/result') {
        const result = JSON.parse(bytes);
        if (!pending || result.type !== 'result' || result.requestId !== pending.id || typeof result.text !== 'string' || !Number.isSafeInteger(result.inputTokens) || !Number.isSafeInteger(result.outputTokens)) throw new Error('result_binding');
        if (!pending.cancelled && relayReady && pending.socket === socket) socket.send(JSON.stringify(result)); pending = undefined;
        if (!continuous && calls >= maxCalls) void stop({ trigger: 'request_limit' });
      } else if (req.method === 'POST' && req.url === '/cancelled') {
        const result = JSON.parse(bytes); if (!pending?.cancelled || result.requestId !== pending.id) throw Error('cancellation_binding');
        pending = undefined; lifecycle.event('request', { status: 'cancelled' });
      } else if (req.method === 'POST' && req.url === '/failed') {
        const result = JSON.parse(bytes);
        if (result.scope === 'request' && pending && result.requestId === pending.id) {
          const frame = { type: 'request_failed', requestId: pending.id, sessionId: pending.binding.sessionId, bindingRevision: pending.binding.bindingRevision, sequence: pending.binding.sequence, code: 'provider_outcome_unknown' };
          if (!ProviderRequestFailure(frame)) throw Error('request_failure_binding');
          failure('request', { code: 'provider_outcome_unknown' }, 'provider_outcome_unknown');
          if (!pending.cancelled && relayReady && pending.socket === socket) socket.send(JSON.stringify(frame)); pending = undefined;
        } else if (result.scope === 'provider' && ['control_unavailable','handshake_rejected','frame_rejected'].includes(result.code)) void stop({ trigger: 'guest_failed', error: new ClientError(result.code) });
        else throw Error('provider_failure_binding');
      }
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
    const deadlineMs = Math.max(1, Math.min(120000, Number(pending?.binding?.deadlineUnixMs ?? Date.now() + 120000) - Date.now()));
    const deadlineTimer = setTimeout(close,deadlineMs);
    upstream.setTimeout(deadlineMs,close);socket.setTimeout(deadlineMs,close);upstream.once('close',()=>clearTimeout(deadlineTimer));upstream.once('error',close);socket.once('error',close);socket.once('close',close);upstream.once('close',close);
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
      for (const [from, to] of [['guest/provider-console.mjs', 'provider-console.mjs'], ['provider-broker.mjs', 'provider-broker.mjs'], ['coding-wire.mjs','coding-wire.mjs'], ['provider-setup.mjs', 'provider-setup.mjs']]) await copyFile(new URL(from, import.meta.url), join(copied, to));
      await writeFile(join(copied, 'config.json'), JSON.stringify({ control: `http://host.microsandbox.internal:${broker.address().port}`, capability, noKey, node: binding.loopback ? {...node,localEngine:true,endpoint:node.endpoint.replace(binding.url.hostname,'host.microsandbox.internal')} : {...node,tunnel:{port:broker.address().port,capability}}, maxCalls, maxOutputTokens, continuous }), { mode: 0o600 });
      allocation = createGuest(runtime, [broker.address().port, ...(enginePort ? [enginePort] : [])], copied, undefined, { signal: warmSignal, continuous });
      guest = await allocation;
      warmSignal.throwIfAborted();
      if(noKey) await runtime.run(guest,['node','/workspace/provider-console.mjs'],{signal:warmSignal,timeoutSeconds:20});
      else await runtime.attachConsole(guest, ['node', '/workspace/provider-console.mjs'], { ...consoleOptions, signal: warmSignal });
      warmSignal.throwIfAborted();
      if (!guestReady) throw new ClientError('guest_start_failed');
      if (continuous) {
        await runtime.touch(guest,{signal:bounded(intervals.touchTimeout ?? 10000)});
        lastTouch = now();
        keepalive = backgroundOperation(async () => {
          if (now() - lastTouch >= (intervals.idleWindow ?? 60000)) throw new ClientError('provider_keepalive_expired');
          await runtime.touch(guest, { signal: bounded(intervals.touchTimeout ?? 10000) }); lastTouch = now(); clearTimeout(touchRetry);
          lifecycle.event('keepalive', { status: 'succeeded' });
        }, intervals.keepalive ?? 20000, error => {
          if (stopped) return; failure('keepalive', error, 'provider_keepalive_failed');
          if (now() - lastTouch >= (intervals.idleWindow ?? 60000)) void stop({ trigger: 'keepalive_failed', error });
          else { clearTimeout(touchRetry); touchRetry = setTimeout(() => void keepalive.run(), intervals.touchRetry ?? 5000); }
        });
      }
      lifecycle.event('vm', { status: 'ready' }); announce({ status: 'warm', credentials: 'guest_memory_only' });
    } catch (error) {
      failure('startup', error, 'provider_start_failed');
      if (!stopped) await stop({ trigger: 'startup_failed', error });
      throw error;
    }
    finally { starting = false; if (copied) { await rm(copied, { recursive: true, force: true }); copied = undefined; } }
  }
  function scheduleReconnect() {
    if (stopped || reconnectTimer) return;
    backoff = Math.min(intervals.reconnectCap ?? 10000, backoff ? backoff * 2 : (intervals.reconnectInitial ?? 1000));
    reconnectTimer = setTimeout(() => { reconnectTimer = undefined; void renewal?.run(); }, backoff);
  }
  async function inspectStatus() {
    node = await network.request(`/v2/providers/nodes/${nodeId}`, { signal: bounded(intervals.networkTimeout ?? 10000) });
    if (stopped) return;
    if (node.suspended === true || node.status !== 'published') { await stop({ trigger: node.suspended ? 'node_suspended' : 'node_paused', remote: false }); return; }
    if (node.providerRunId && node.providerRunId !== providerRunId) { await stop({ trigger: 'run_superseded', remote: false }); return; }
    if (node.availability === 'cold' && !guestReady) {
      await network.request(`/v2/providers/nodes/${nodeId}/heartbeat`, { method: 'POST', body: { ready: false, providerRunId }, signal: bounded(intervals.networkTimeout ?? 10000) });
      activation = await network.request(`/v2/providers/nodes/${nodeId}/activations`, { signal: bounded(intervals.networkTimeout ?? 10000) });
      if (activation.length) announce({ status: 'activation_required', deadline: activation[0].deadline });
    }
    if (guestReady && lastGuestPoll && now() - lastGuestPoll > (intervals.guestPollWindow ?? 15000)) throw new ClientError('provider_worker_unresponsive');
  }
  function operationFailed(phase, error) {
    if (stopped) return;
    failure(phase, error, 'provider_control_failed');
    if (recoverableStatusFailure(error) && !['marketplace_admissions_disabled','relay_disabled'].includes(error.code)) {
      if (phase === 'renewal') { clearReadiness(); socket?.close(); scheduleReconnect(); }
    } else void stop({ trigger: phase === 'renewal' ? 'relay_auth_failed' : 'provider_control_failed', error });
  }
  async function renewRelay() {
    if (stopped || socket?.readyState === Socket.CONNECTING || authenticationTimer) return;
    const ticket = await network.request(`/v2/providers/nodes/${nodeId}/relay-ticket`, { method: 'POST', body: { providerRunId }, signal: bounded(intervals.networkTimeout ?? 10000) });
    if (stopped) return;
    if (ticket.providerRunId !== providerRunId || !/^[A-Za-z0-9_-]{43}$/.test(ticket.ticket ?? '')) throw new ClientError('provider_run_contract_required');
    claimed = true;
    if (!guestReady) return;
    const authenticate = ws => {
      if (stopped || socket !== ws || ws.readyState !== Socket.OPEN) return;
      ws.send(JSON.stringify({ type: 'authenticate', ticket: ticket.ticket, ready: true, maxOutputTokens }));
    };
    const authDeadline = () => {
      authenticationTimer = undefined;
      if (stopped) return; clearReadiness('relay_authentication_timeout'); socket?.close(); scheduleReconnect();
    };
    authenticationTimer = setTimeout(authDeadline, intervals.authenticationTimeout ?? 10000);
    if (socket?.readyState === Socket.OPEN) { authenticate(socket); return; }
    const url = new URL('/v2/relay', network.origin); url.protocol = url.protocol === 'https:' ? 'wss:' : 'ws:';
    const ws = socket = new Socket(url), epoch = ++socketEpoch;
    const current = () => !stopped && socket === ws && epoch === socketEpoch;
    const disconnected = code => {
      if (!current()) return;
      clearTimeout(authenticationTimer); authenticationTimer = undefined;
      clearReadiness(code); cancelRequest(); scheduleReconnect();
    };
    ws.addEventListener('open', () => { if(current())authenticate(ws); });
    ws.addEventListener('error', () => { disconnected('relay_connection_failed'); ws.close(); });
    ws.addEventListener('close', () => disconnected('relay_disconnected'));
    ws.addEventListener('message', event => { void (async () => {
      if (!current() || ws.readyState !== Socket.OPEN) return;
      if (typeof event.data !== 'string' || event.data.length > 1024 * 1024) throw new ClientError('relay_frame_limit');
      let frame; try { frame = JSON.parse(event.data); } catch { throw new ClientError('relay_frame_invalid'); }
      if (frame.type === 'ready') {
        if (!ProviderRelayReady(frame) || frame.providerRunId !== providerRunId || frame.leaseUntil <= now()) throw new ClientError('relay_ready_rejected');
        clearTimeout(authenticationTimer); authenticationTimer = undefined; clearTimeout(leaseTimer);
        relayGeneration = frame.relayGeneration; relayLeaseUntil = frame.leaseUntil; relayReady = true; backoff = 0;
        clearTimeout(reconnectTimer); reconnectTimer = undefined;
        leaseTimer = setTimeout(() => { if(current()){clearReadiness('relay_lease_expired');ws.close();scheduleReconnect();} }, Math.max(1, relayLeaseUntil - now()));
        lifecycle.event('relay', { status: 'ready', relayGeneration, leaseUntil: relayLeaseUntil });
        for (const a of activation) await network.request(`/v2/providers/nodes/${nodeId}/activations/${a.sessionId}`, { method: 'POST', body: {}, signal: bounded(intervals.networkTimeout ?? 10000) });
        activation = []; announce({ status: 'serving', remainingCalls: continuous ? null : maxCalls - calls }); return;
      }
      if (!relayReady || relayLeaseUntil <= now()) throw new ClientError('relay_not_authenticated');
      if (frame.type === 'cancel') {
        if (!pending || frame.requestId !== pending.id) return;
        if (['sessionId','bindingRevision','sequence'].some(key => frame[key] !== pending.binding[key])) throw new ClientError('cancellation_binding_rejected');
        cancelRequest(); return;
      }
      if (frame.type === 'handshake') {
        if (pending || !Handshake(frame) || frame.bindingRevision !== node.listingId || frame.providerInstallationId !== node.installationId || frame.listingRevision !== node.listingRevision || frame.deadlineUnixMs <= now()) throw new ClientError('handshake_rejected');
        pending = { id: frame.challengeId, binding: frame, frame, socket: ws }; return;
      }
      if (pending || !(frame.protocol==='coding_v1'?CodingInferenceRequest(frame):InferenceRequest(frame)) || frame.bindingRevision !== node.listingId || frame.maxOutputTokens > maxOutputTokens || (!continuous && calls >= maxCalls)) throw new ClientError('frame_rejected');
      calls++; pending = { id: frame.requestId, binding: frame, frame, socket: ws };
    })().catch(error => { if(current())void stop({ trigger: 'relay_frame_failed', error }); }); });
  }
  async function stop({ trigger = 'operator_stop', error, signal, remote = true } = {}) {
    if (closing) return closing;
    if (error) failure('failure', error, 'provider_failed');
    lifecycle.stop(trigger, { signal });
    stopped = true; guestReady = false; relayReady = false; for(const tunnel of tunnels)tunnel.destroy(); abort.abort();
    statusPoll?.stop(); renewal?.stop(); keepalive?.stop(); for(const timer of [deadline,touchRetry,reconnectTimer,authenticationTimer,leaseTimer])clearTimeout(timer); socket?.close();
    for (const [name,handler] of signalHandlers) process.removeListener(name,handler);
    announce({ status: 'stopping' });
    closing = (async () => {
      const outcomes = [];
      const outcome = async (phase, work) => { try { await work(); outcomes.push({phase,status:'succeeded'});lifecycle.event(phase,{status:'succeeded'}); } catch(e){outcomes.push({phase,status:'failed',code:e.code??'provider_cleanup_failed'});lifecycle.event(phase,{status:'failed',code:e.code??'provider_cleanup_failed'});} };
      await allocation?.catch(()=>{});
      await outcome('guest_removal', async () => { if(guest && runtime.owned.has(guest))await runtime.remove(guest); });
      await outcome('broker_cleanup', async () => { broker.closeAllConnections(); if(broker.listening)await new Promise(resolve=>broker.close(resolve)); });
      if (remote && claimed) {
        try { await network.request(`/v2/providers/nodes/${nodeId}/stop`, { method: 'POST', body: { scope: 'run', providerRunId, trigger }, signal: AbortSignal.timeout(30000) }); outcomes.push({phase:'remote_stop',status:'succeeded'});lifecycle.event('remote_stop',{status:'succeeded'}); }
        catch(e){const superseded=['provider_run_superseded','not_found'].includes(e.code);outcomes.push({phase:'remote_stop',status:superseded?'superseded':'failed',code:e.code??'provider_stop_failed'});lifecycle.event('remote_stop',{status:superseded?'superseded':'failed',...(!superseded?{code:e.code??'provider_stop_failed'}:{})});}
      } else outcomes.push({phase:'remote_stop',status:'not_requested'});
      outcomes.push(await lifecycle.finish(outcomes));
      const failed = outcomes.some(o=>o.status==='failed'),removed=outcomes.find(o=>o.phase==='guest_removal').status==='succeeded';
      cleanupRequired = failed; teardownVerified = removed;
      const result = { status: failed ? 'cleanup_required' : 'stopped', completedCalls: calls, credentials: removed ? 'discarded' : 'teardown_unverified', providerRunId, firstFailure: lifecycle.firstFailure, stopTrigger: lifecycle.stopTrigger, outcomes };
      announce(result); complete(result); return result;
    })();
    return closing;
  }
  const signalHandlers = new Map(['SIGINT','SIGTERM','SIGHUP','SIGTSTP'].map(name=>[name,()=>void stop({trigger:'process_signal',signal:name})]));
  const onSignal = () => void stop({trigger:'provider_deadline'});
  try {
    await new Promise(resolve => broker.listen(0, '0.0.0.0', resolve));
    for (const [name,handler] of signalHandlers) process.once(name,handler);
    const ticket = await network.request(`/v2/providers/nodes/${nodeId}/relay-ticket`, { method:'POST', body:{providerRunId}, signal:bounded(intervals.networkTimeout ?? 10000) });
    if (ticket.providerRunId !== providerRunId) throw new ClientError('provider_run_contract_required');
    claimed = true; lifecycle.event('run', { status: 'claimed' }); announce({status:'starting'});
    renewal = backgroundOperation(renewRelay, intervals.renewal ?? 10000, error=>operationFailed('renewal',error));
    statusPoll = backgroundOperation(inspectStatus, intervals.status ?? 3000, error=>operationFailed('status',error));
    if (!continuous) deadline = setTimeout(onSignal, 540000);
    if (node.availability === 'hot') await warm();
    if (!stopped) { await statusPoll.run(); await renewal.run(); }
    return { done, stop, warm, lifecycle, get status() { return snapshot(); } };
  } catch (error) { await stop({trigger:'startup_failed',error});throw error; }
}
export async function serveProvider(network, nodeId, options = {}) { const controller = await startProvider(network, nodeId, options); return controller.done; }
