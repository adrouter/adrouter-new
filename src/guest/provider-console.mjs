// This program and all credentialed upstream HTTP execute only inside the VM.
import { fork } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import { readHiddenKey } from './provider-setup.mjs';
import { upstreamInference } from './provider-broker.mjs';
const configuration = JSON.parse(await readFile('/workspace/config.json', 'utf8'));
const { control, capability, node, maxCalls, maxOutputTokens } = configuration;
const controlRequest = async (path, body) => {
  const response = await fetch(`${control}${path}`, { method: body === undefined ? 'GET' : 'POST', redirect: 'error', headers: { authorization: `Bearer ${capability}`, 'content-type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error('control_unavailable');
  return response.json();
};
if (process.argv[2] !== '--worker') {
  let key = configuration.noKey ? '' : await readHiddenKey();
  // IPC transfers the key inside the guest only. It never enters argv, env, disk,
  // stdout or host application memory. Child logs and dumps are disabled.
  const child = fork('/workspace/provider-console.mjs', ['--worker'], { detached: true, stdio: ['ignore', 'ignore', 'ignore', 'ipc'], env: { PATH: '/usr/local/bin:/usr/bin:/bin' } });
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('guest_start_failed')), 10000);
    child.once('message', message => { clearTimeout(timer); message === 'ready' ? resolve() : reject(new Error('guest_start_failed')); });
    child.once('error', () => { clearTimeout(timer); reject(new Error('guest_start_failed')); });
    child.send({ key }); key = '';
  }).catch(() => { child.kill(); process.exit(1); });
  child.disconnect(); child.unref();
  process.stdout.write('Guest is ready. Press Ctrl+D to return to AdRouter.\n');
} else {
  process.once('message', async message => {
    let key = message.key; delete message.key;
    const abort = new AbortController(); let attempted = 0; const seen = new Set();
    const stop = () => { key = ''; abort.abort(); process.exit(0); };
    process.once('SIGTERM', stop); process.once('SIGINT', stop);
    const lifetime = setTimeout(stop, 540000);
    try {
      await controlRequest('/ready', { ready: true }); process.send('ready');
      while (attempted < maxCalls) {
        const frame = await controlRequest('/work');
        if (!frame) { await new Promise(r => setTimeout(r, 250)); continue; }
        if (frame.type === 'stop') break;
        if (frame.type !== 'inference' || seen.has(frame.requestId) || frame.deadlineUnixMs <= Date.now() || frame.maxOutputTokens > maxOutputTokens) throw new Error('frame_rejected');
        seen.add(frame.requestId); attempted++;
        const timeout = AbortSignal.any([abort.signal, AbortSignal.timeout(Math.max(1, Math.min(40000, frame.deadlineUnixMs - Date.now())))]);
        const result = await upstreamInference(node, key, frame, timeout);
        await controlRequest('/result', result);
      }
    } catch { await controlRequest('/failed', { code: 'provider_outcome_unknown' }).catch(() => {}); }
    finally { clearTimeout(lifetime); stop(); }
  });
}
