import { mkdtemp, writeFile, realpath, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { randomUUID } from 'node:crypto';
import { setTimeout as delay } from 'node:timers/promises';
import { runBuyer } from './buyer.mjs';
import { SandboxRuntime } from './runtime.mjs';
import { createGuest, configuredRuntime } from './provider.mjs';
import { ClientError } from './network.mjs';

export async function waitForActivation(network, session, { signal, progress = () => {}, pollMs = 500 } = {}) {
  const deadline = Math.min(Number(session.activationDeadline) || Date.now() + 120000, Date.now() + 120000);
  while (session.state === 'activating') {
    if (signal?.aborted) throw new ClientError('cancelled');
    const remaining = deadline - Date.now();
    if (remaining <= 0) throw new ClientError('activation_expired');
    await progress({ status: 'activating', remainingSeconds: Math.ceil(remaining / 1000) });
    const bound = AbortSignal.timeout(remaining);
    const pendingSignal = signal ? AbortSignal.any([signal, bound]) : bound;
    try {
      await delay(Math.min(pollMs, remaining), undefined, { signal: pendingSignal });
      session = await network.request(`/v2/admin/evaluation-sessions/${session.id}`, { signal: pendingSignal });
    } catch (error) {
      if (signal?.aborted) throw new ClientError('cancelled');
      if (bound.aborted) throw new ClientError('activation_expired');
      throw error;
    }
  }
  if (!['ready', 'active'].includes(session.state)) throw new ClientError('activation_expired');
  return session;
}

// Explicit operator invocation only; no idle/repeat scheduler or hidden spending.
export async function evaluateNode(network, nodeId, { maximumCharge, runtimeConfig, signal, progress = () => {} }, dependencies = {}) {
  const started = Date.now(); let samples = 0, toolObserved = false, exported, guest, root, session, runtime;
  const startKey = randomUUID();
  const checks = { format: true, tools: false, usage: true, cancellation: false, offlineExecution: false };
  try {
    signal?.throwIfAborted();
    runtime = dependencies.runtime ?? (runtimeConfig ? new SandboxRuntime(runtimeConfig) : await configuredRuntime());
    await runtime.verify({ signal });
    root = await realpath(await mkdtemp(join(tmpdir(), 'adr-evaluation-')));
    // Do not abandon session creation on user cancellation: once its identity is
    // returned, finally can stop it. Unknown transport outcomes are recovered by
    // this unique operation key through the read-only session inventory.
    session = await network.request(`/v2/admin/evaluations/${nodeId}/start`, { method: 'POST', key: startKey, body: { maximumCharge, maxOutputTokens: 1024, confirmBudget: true } });
    await progress({ status: 'evaluation_started', sessionId: session.id, listingId: session.listingId });
    session = await waitForActivation(network, session, { signal, progress });
    signal?.throwIfAborted();
    const transport = { async request(path, options) {
      const value = await network.request(path.replace('/v2/sessions/', '/v2/admin/evaluation-sessions/'), options);
      if (path.endsWith('/inference')) { samples++; checks.format &&= typeof value.text === 'string'; checks.usage &&= Number.isSafeInteger(value.usage?.inputTokens) && Number.isSafeInteger(value.usage?.outputTokens); }
      return value;
    } };
    await writeFile(join(root, 'task.txt'), 'Create sum.mjs exporting function add(a,b) returning a+b.');
    exported = await (dependencies.runBuyer ?? runBuyer)(transport, session.id, { root, files: ['task.txt'], prompt: 'Use write_file to create sum.mjs exporting function add(a,b) returning a+b. Then finish. Do not use commands.', maxTurns: 3, keepSession: true, runtimeConfig, signal, progress, approve: async action => {
      if (signal?.aborted) return false;
      if (action.name === 'export_workspace') return true;
      if (action.name === 'write_file' && action.args.path === 'sum.mjs') { toolObserved = true; return true; }
      return false;
    } });
    checks.tools = toolObserved;
    signal?.throwIfAborted();
    await progress({ status: 'offline_execution' });
    guest = await (dependencies.createGuest ?? createGuest)(runtime, [], join(exported.directory, 'workspace'), undefined, { signal });
    const result = await runtime.run(guest, ['node', '--input-type=module', '-e', "import {add} from '/workspace/sum.mjs';if(add(2,3)!==5||add(-3,4)!==1)process.exit(1);console.log('passed')"], { signal });
    checks.offlineExecution = result.trim() === 'passed';
    // An explicit bounded cancellation attempt is part of this approved run.
    // Closing transport cannot establish that upstream computation/billing stops.
    const probe = new AbortController(), cancellationRequestId = randomUUID();
    await progress({ status: 'cancellation_probe', requestId: cancellationRequestId });
    const timer = setTimeout(() => probe.abort(), 500);
    try {
      await transport.request(`/v2/sessions/${session.id}/inference`, { method: 'POST', signal: signal ? AbortSignal.any([signal, probe.signal]) : probe.signal, body: { requestId: cancellationRequestId, messages: [{ role: 'user', content: 'For this cancellation test, count upward from one.' }], maxOutputTokens: 32 } });
    } catch (error) {
      if (!['cancelled', 'request_outcome_unknown', 'network_unavailable_outcome_unknown'].includes(error.code)) throw error;
    } finally { clearTimeout(timer); }
    // Automatic reports can never assert checks.cancellation=true.
  } finally {
    if (!session) {
      const sessions = await network.request('/v2/admin/evaluation-sessions').catch(() => []);
      session = sessions.find(s => s.startKey === startKey);
    }
    const cleanup = await Promise.allSettled([
      session ? network.request(`/v2/admin/evaluation-sessions/${session.id}/stop`, { method: 'POST', body: {} }) : Promise.resolve(),
      guest && runtime.owned.has(guest) ? runtime.remove(guest) : Promise.resolve(),
      root ? rm(root, { recursive: true, force: true }) : Promise.resolve(),
      exported ? rm(exported.directory, { recursive: true, force: true }) : Promise.resolve(),
    ]);
    if (cleanup.some(r => r.status === 'rejected')) throw new ClientError('evaluation_cleanup_required');
  }
  signal?.throwIfAborted();
  const status = await network.request(`/v2/admin/evaluation-sessions/${session.id}`);
  samples = status.settledSampleCount;
  return network.request(`/v2/admin/evaluations/${nodeId}/result`, { method: 'POST', key: randomUUID(), body: { sessionId: session.id, listingId: session.listingId, listingRevision: session.listingRevision, version: 'adr-offline-tools-v1', sampleCount: samples, elapsedMs: Math.max(1, Date.now() - started), freshUntil: Date.now() + 86400000, evidenceReference: `operator-run-${session.id}`, checks } });
}
