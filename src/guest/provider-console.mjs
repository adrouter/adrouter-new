// This program and all credentialed upstream HTTP execute only inside the VM.
import { fork } from 'node:child_process';
import { readFile } from 'node:fs/promises';
import {GuestCredentialStore} from './guest-credentials.mjs';
import { readHiddenKey } from './provider-setup.mjs';
import { upstreamInference } from './provider-broker.mjs';
const controlFetch=globalThis.fetch;
const configuration = JSON.parse(await readFile('/workspace/config.json', 'utf8'));
const { control, capability, node, maxCalls, maxOutputTokens, continuous, persistentCredentials } = configuration;
const controlRequest = async (path, body) => {
  const response = await controlFetch(`${control}${path}`, { method: body === undefined ? 'GET' : 'POST', redirect: 'error', headers: { authorization: `Bearer ${capability}`, 'content-type': 'application/json' }, body: body === undefined ? undefined : JSON.stringify(body), signal: AbortSignal.timeout(5000) });
  if (!response.ok) throw new Error('control_unavailable');
  return response.json();
};
if (process.argv[2] !== '--worker') {
  const credentials=persistentCredentials?new GuestCredentialStore():undefined;
  if(process.argv[2]==='--disconnect'){await credentials?.disconnect();process.exit(0);}
  // This is a newly authorized guest before its sole worker starts. No other
  // writer is attached; remove interrupted lock/temp files, retaining final auth.
  await credentials?.recoverStartup();
  const saved=await credentials?.read(node.provider);
  let key=saved?undefined:configuration.noKey?'':await readHiddenKey(process.stdin,process.stdout,persistentCredentials?'Provider API key (hidden; saved in provider guest vault): ':'Provider API key (hidden; memory only): ');
  const retainedHeaders=JSON.parse(saved?.env?.ADR_CONNECTION_HEADERS??'{}'),headers={};for(const name of node.connection?.headerNames??[])headers[name]=retainedHeaders[name]??await readHiddenKey(process.stdin,process.stdout,`Secret header ${name} (hidden; saved in provider guest vault): `);
  // IPC transfers the key inside the guest only. It never enters argv, host storage,
  // stdout or host application memory. Child logs and dumps are disabled.
  const child = fork('/workspace/provider-console.mjs', ['--worker'], { detached: true, stdio: ['ignore', 'ignore', 'ignore', 'ipc'], env: { PATH: '/usr/local/bin:/usr/bin:/bin' } });
  await new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error('guest_start_failed')), 10000);
    child.once('message', message => { clearTimeout(timer); message === 'ready' ? resolve() : reject(new Error('guest_start_failed')); });
    child.once('error', () => { clearTimeout(timer); reject(new Error('guest_start_failed')); });
    child.send({ key,headers }); key = '';
  }).catch(() => { child.kill(); process.exit(1); });
  child.disconnect(); child.unref();
  process.stdout.write('Guest is ready. Press Ctrl+D to return to AdRouter.\n');
} else {
  process.once('message', async message => {
    let key = message.key; delete message.key;
    const abort = new AbortController(); let attempted = 0; const seen = new Set();
    let nativeAuth;const native=['pi_native_v1','pi_native_v2'].includes(node.connectorProtocol);const nativeModule=native?await import('./pi-native.mjs'):undefined;
    if(native){nativeAuth=await nativeModule.nativeLogin(node,key,abort.signal,{...(persistentCredentials?{credentials:new GuestCredentialStore()}:{}),headers:message.headers??{}});key='';}
    const stop = () => { void nativeAuth?.close(); key = ''; abort.abort(); process.exit(0); };
    process.once('SIGTERM', stop); process.once('SIGINT', stop);
    const lifetime = continuous ? undefined : setTimeout(stop, 540000);
    const challenges = new Set(); let active;
    const execute = async context => {
      const frame = context.frame; let lastTiming;
      try {
        const timeout = AbortSignal.any([abort.signal, context.abort.signal, AbortSignal.timeout(Math.max(1, Math.min(120000, frame.deadlineUnixMs - Date.now())))]);
        const infer=native?(...args)=>nativeModule.nativeInference(node,nativeAuth,...args):(...args)=>upstreamInference(node,key,...args);
        const result = await infer(frame, timeout, timing => { lastTiming = { requestId: frame.requestId, ...timing }; }, event => context.cancelled||frame.type==='qualification' ? undefined : controlRequest('/delta', event));
        if (context.cancelled) { await controlRequest('/cancelled', { requestId: frame.requestId }); return; }
        if (lastTiming) await controlRequest('/timing', lastTiming);
        await controlRequest('/result', result);
      } catch(error) {
        if (context.cancelled) await controlRequest('/cancelled', { requestId: frame.requestId }).catch(() => {});
        else {
          if (lastTiming) await controlRequest('/timing', lastTiming).catch(() => {});
          await controlRequest('/failed', { scope: 'request', requestId: frame.requestId, code: error.code??'provider_outcome_unknown' }).catch(() => {});
        }
      } finally { if (active === context) active = undefined; }
    };
    try {
      await controlRequest('/ready', { ready: true }); process.send('ready');
      while (continuous || attempted < maxCalls || active) {
        const frame = await controlRequest('/work');
        if (!frame) { await new Promise(r => setTimeout(r, 250)); continue; }
        if (frame.type === 'stop') break;
        if(native&&frame.type==='discover'){if(active)throw new Error('frame_rejected');try{const result=await nativeModule.nativeDiscover(node,nativeAuth,AbortSignal.any([abort.signal,AbortSignal.timeout(15000)]));await controlRequest('/discovered',{requestId:frame.requestId,...result});}catch(error){await controlRequest('/discovered',{requestId:frame.requestId,error:['upstream_authentication_failed','model_discovery_unavailable'].includes(error.code)?error.code:'model_discovery_unavailable'});}continue;}
        if(native&&frame.type==='bind'){node.listingIds=frame.listingIds;node.listingRevision=frame.listingRevision;continue;}
        if (frame.type === 'cancel') {
          if (!active) { await controlRequest('/cancelled', {requestId:frame.requestId}).catch(()=>{}); continue; }
          if (['requestId','sessionId','bindingRevision','sequence'].some(k=>active.frame[k]!==frame[k])) throw new Error('frame_rejected');
          active.cancelled = true; active.abort.abort(); continue;
        }
        if (frame.type === 'handshake') {
          if (active || challenges.has(frame.challengeId) || frame.deadlineUnixMs <= Date.now() || (native?!node.listingIds?.includes(frame.bindingRevision):frame.bindingRevision !== node.listingId) || frame.providerInstallationId !== node.installationId || frame.listingRevision !== node.listingRevision) throw new Error('handshake_rejected');
          challenges.add(frame.challengeId);
          if (challenges.size > 4096) challenges.delete(challenges.values().next().value);
          await controlRequest('/handshake-result',{ ...frame,type:'handshake_result' }); continue;
        }
        if (active || (frame.type !== 'inference'&&!(native&&frame.type==='qualification')) || seen.has(frame.requestId) || frame.deadlineUnixMs <= Date.now() || frame.maxOutputTokens > maxOutputTokens) throw new Error('frame_rejected');
        seen.add(frame.requestId); if(seen.size>4096)seen.delete(seen.values().next().value); attempted++;
        active = {frame,abort:new AbortController(),cancelled:false}; void execute(active);
      }
    } catch(error) { const code=['control_unavailable','handshake_rejected','frame_rejected'].includes(error.message)?error.message:'control_unavailable'; await controlRequest('/failed', { scope:'provider',code }).catch(() => {}); }
    finally { clearTimeout(lifetime); stop(); }
  });
}
