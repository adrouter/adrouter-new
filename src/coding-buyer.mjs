import { safeFailure, writePrivateDiagnostic, safeOutcomes } from './failure-diagnostics.mjs';
import { createServer } from 'node:http';
import { randomBytes, createHash, randomUUID } from 'node:crypto';
import { readFile, writeFile, rename, mkdir, cp, rm, lstat, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { saveCodingSnapshot, openSavedCodingWork } from './saved-work.mjs';
import { ActionApproval } from './buyer.mjs';
import { importWorkspace, exportSnapshot, proposeExport, changeDiffs, reviewAndApply, recoverApplication } from './workspace.mjs';
import { configuredRuntime, createGuest } from './provider.mjs';
import { SandboxRuntime } from './runtime.mjs';
import { ClientError } from './network.mjs';
import { actionDiff } from './action-diff.mjs';
import { CodingDisplay, thinkingExplanation } from './coding-display.mjs';
import { approvedRetrieval, hostOperation } from './host-bridges.mjs';
import { BuyerLifecycle, backgroundOperation, recoverableStatusFailure, approvalRequired } from './buyer-lifecycle.mjs';
const canonical=v=>JSON.stringify(v,(key,value)=>value&&typeof value==='object'&&!Array.isArray(value)?Object.fromEntries(Object.entries(value).sort(([a],[b])=>a.localeCompare(b))):value);
const hash=b=>createHash('sha256').update(b).digest('hex');

export async function savedCodingContexts(profile,root) {
  if(!/^[a-z][a-z0-9_-]{0,31}$/.test(profile))throw new ClientError('invalid_profile_name');
  const directory=join(homedir(),'.adr-v2','profiles',profile,'coding'),rows=[];
  for(const entry of await readdir(directory,{withFileTypes:true}).catch(e=>{if(e.code==='ENOENT')return [];throw e;})) {
    if(!entry.isDirectory()||!/^[a-f0-9-]{36}$/.test(entry.name))continue;
    const path=join(directory,entry.name,'state.json');
    const stat=await lstat(path).catch(()=>null);if(!stat?.isFile()||stat.isSymbolicLink()||stat.nlink!==1||(stat.mode&0o077)||stat.uid!==process.getuid())continue;
    const state=JSON.parse(await readFile(path,'utf8'));if(root===undefined||state.root===root)rows.push({id:entry.name,root:state.root,savedAt:stat.mtimeMs});
  }
  return rows.sort((a,b)=>b.savedAt-a.savedAt);
}

export async function pendingApplications(profile,root) {
  if(!/^[a-z][a-z0-9_-]{0,31}$/.test(profile))throw new ClientError('invalid_profile_name');
  const directory=join(homedir(),'.adr-v2','profiles',profile,'coding','journals'),items=[];
  for(const name of await readdir(directory).catch(e=>{if(e.code==='ENOENT')return [];throw e;})){
    if(!/^[a-f0-9-]{36}[.]json$/.test(name))continue;const path=join(directory,name),s=await lstat(path);
    if(!s.isFile()||s.isSymbolicLink()||s.nlink!==1||(s.mode&0o077)||s.uid!==process.getuid())throw new ClientError('apply_journal_rejected');
    const record=JSON.parse(await readFile(path,'utf8'));if((root===undefined||record.root===root)&&['interrupted','applying'].includes(record.status))items.push({journal:path,root:record.root,operationId:record.operationId,completed:record.completed.length});
  }return items;
}

async function restoreGuestState(runtime,guest,files,resources={},deletions=[]) {
  const code=`const fs=require('node:fs'),path=require('node:path'),data=JSON.parse(fs.readFileSync(0,'utf8'));const safe=p=>{if(typeof p!=='string'||p.startsWith('/')||p.includes(String.fromCharCode(92))||p.split('/').some(x=>!x||x==='..'||x==='.adr-runtime'))throw Error('restore_path_invalid');};for(const p of data.deletions){safe(p);fs.rmSync('/workspace/'+p,{force:true});}for(const [p,text] of Object.entries(data.files)){safe(p);const full='/workspace/'+p;fs.mkdirSync(path.dirname(full),{recursive:true});fs.writeFileSync(full,text,{mode:0o600});}for(const [p,text] of Object.entries(data.resources)){if(!(p.startsWith('sessions/')&&!p.slice(9).includes('/')&&/^[a-zA-Z0-9_.-]+[.]jsonl$/.test(p.slice(9)))&&!['settings.json','keybindings.json','trust.json','history.json'].includes(p))throw Error('restore_resource_invalid');fs.mkdirSync(path.dirname('/tmp/adr-agent/'+p),{recursive:true});fs.writeFileSync('/tmp/adr-agent/'+p,text,{mode:0o600});}`;
  await runtime.run(guest,['node','-e',code],{input:JSON.stringify({files,resources,deletions})});
}

export class DispatchQueue {
  tail=Promise.resolve(); closed=false;
  run(work,signal) {const result=this.tail.then(()=>{if(this.closed||signal?.aborted)throw new ClientError('session_not_active');return work();});this.tail=result.catch(()=>{});return result;}
  stop(){this.closed=true;}
}

export async function openCodingBuyer(network,sessionId,{root,files,runtimeConfig,runtime:provided,signal,approve=approvalRequired,trusted=false,profile='buyer',resumeId,confirmProject=async()=>false,coordinator,progress=()=>{},intervals={}}={}) {
  if(!/^[a-z][a-z0-9_-]{0,31}$/.test(profile))throw new ClientError('invalid_profile_name');
  if(!/^[a-f0-9-]{36}$/.test(sessionId))throw new ClientError('coding_session_required');
  let authorityDeadline;let guest,workspace,closing,watchdog,statusPoll,expires,checkpoint,saving,snapshot,discarded=false,statusChecking,dependencyApproved=false,dependencyBytes=0;const abort=new AbortController(), queue=new DispatchQueue(),authorities=new Map(),mainCapability=randomBytes(32).toString('base64url');
  const startupSignal=signal?AbortSignal.any([signal,abort.signal]):abort.signal;
  const lifecycle=new BuyerLifecycle(value=>{try{progress({status:value.events.at(-1)?.phase,paused:lifecycle.paused});}catch{}});
  let diagnosticWrites=Promise.resolve(),diagnosticOutcomes=[];let runtime,session,display,snapshotExclusions={},privateRoot,storage,storageValidated=false,requestClose,finishStartup;
  const startupReady=new Promise(resolve=>{finishStartup=resolve;});
  const earlySignal=name=>{lifecycle.event('signal',{code:'cancelled',signal:name,status:'cancelled'});if(requestClose)void requestClose().catch(()=>{});else abort.abort();};
  const signalHandlers=new Map(['SIGINT','SIGTERM','SIGHUP','SIGTSTP'].map(name=>[name,()=>earlySignal(name)]));
  const onAbort=()=>{lifecycle.event('cancellation',{code:'cancelled'});if(requestClose)void requestClose().catch(()=>{});else abort.abort();};
  for(const [name,handler] of signalHandlers)process.once(name,handler);
  signal?.addEventListener('abort',onAbort,{once:true});if(signal?.aborted)onAbort();
  const persistDiagnostics=async outcomes=>{
    if(!storageValidated)return;
    if(outcomes?.length)diagnosticOutcomes=safeOutcomes(outcomes);const value={schemaVersion:1,sessionId,firstFailure:lifecycle.firstFailure,failureDiagnostic:lifecycle.failureDiagnostic??null,events:lifecycle.events.slice(),outcomes:diagnosticOutcomes};diagnosticWrites=diagnosticWrites.catch(()=>{}).then(()=>writePrivateDiagnostic(storage,'lifecycle.json',value));await diagnosticWrites;
  };
  try {
    startupSignal.throwIfAborted();
    runtime=provided??(runtimeConfig?new SandboxRuntime(runtimeConfig):await configuredRuntime());
    session=await network.request(`/v2/sessions/${sessionId}`,{signal:startupSignal});
    if(!Number.isSafeInteger(session.expiresAt)||!Number.isInteger(session.requestLimit)||session.requestLimit<1||session.requestLimit>100||session.protocol!=='coding_v1'||!['ready','active'].includes(session.state)||session.handshakeStatus!=='succeeded'||session.expiresAt<=Date.now())throw new ClientError('coding_session_required');
    privateRoot=homedir();for(const part of ['.adr-v2','profiles',profile,'coding']){privateRoot=join(privateRoot,part);await mkdir(privateRoot,{recursive:true,mode:0o700});const st=await lstat(privateRoot);if(!st.isDirectory()||st.isSymbolicLink()||st.uid!==process.getuid()||(st.mode&0o077))throw new ClientError('coding_profile_unsafe');}
    storage=join(privateRoot,sessionId);await mkdir(storage,{recursive:true,mode:0o700});const ss=await lstat(storage);if(!ss.isDirectory()||ss.isSymbolicLink()||ss.uid!==process.getuid()||(ss.mode&0o077))throw new ClientError('coding_profile_unsafe');storageValidated=true;
    startupSignal.throwIfAborted();
  }catch(original){
    const error=startupSignal.aborted&&original.name==='AbortError'?new ClientError('cancelled'):original;
    lifecycle.event('initial_status',{code:error.code??'coding_startup_failed'});
    for(const [name,handler] of signalHandlers)process.removeListener(name,handler);signal?.removeEventListener('abort',onAbort);
    const outcomes=[];try{const stopped=await network.request(`/v2/sessions/${sessionId}/stop`,{method:'POST',body:{},signal:AbortSignal.timeout(30000)});outcomes.push({phase:'remote_stop',status:'succeeded',session:stopped});}catch(e){outcomes.push({phase:'remote_stop',status:'failed',code:e.code??'cleanup_failed'});}
    await persistDiagnostics(outcomes).catch(()=>{});error.lifecycleOutcome={firstFailure:lifecycle.firstFailure,outcomes};throw error;
  }
  const close=async()=>{
    if(closing)return closing;lifecycle.closing=true;lifecycle.event('closure',{status:'closing'});
    queue.stop();approvals.stop();for(const [name,handler] of signalHandlers)process.removeListener(name,handler);
    signal?.removeEventListener('abort',onAbort);watchdog?.stop();statusPoll?.stop();checkpoint?.stop();clearTimeout(expires);clearTimeout(authorityDeadline);
    closing=(async()=>{
      if(!snapshot)abort.abort();
      await startupReady;
      if(!discarded&&snapshot&&guest&&runtime.owned.has(guest))await snapshot().catch(()=>{});
      coordinator?.close();abort.abort();
      const operations=[['guest_removal',()=>guest&&runtime.owned.has(guest)?runtime.remove(guest):undefined],
        ['workspace_cleanup',()=>workspace?rm(workspace.copy,{recursive:true,force:true}):undefined],
        ['remote_stop',()=>network.request(`/v2/sessions/${sessionId}/stop`,{method:'POST',body:{},signal:AbortSignal.timeout(30000)})]];
      const outcomes=await Promise.all(operations.map(async([phase,work])=>{try{const value=await work();lifecycle.event(phase,{status:'succeeded'});return {phase,status:'succeeded',...(phase==='remote_stop'?{session:value}:{})};}catch(e){lifecycle.event(phase,{code:e.code??'cleanup_failed',status:'failed'});return {phase,status:'failed',code:e.code??'cleanup_failed'};}}));
      const stopped=outcomes.find(o=>o.phase==='remote_stop');outcomes.push({phase:'settlement',status:['settled','refunded'].includes(stopped?.session?.state)?'succeeded':'pending'});lifecycle.event('settlement',{status:outcomes.at(-1).status});
      server.closeAllConnections();if(server.listening)await new Promise(r=>server.close(r));
      try{await persistDiagnostics(outcomes);}catch{outcomes.push({phase:'diagnostic_save',status:'failed',code:'diagnostic_save_failed'});}
      return {status:outcomes.some(o=>o.status==='failed')?'cleanup_required':'closed',outcomes,firstFailure:lifecycle.firstFailure};
    })();return closing;
  };
  const status=async()=>{
    if(closing)throw new ClientError('session_not_active');
    if(statusChecking)return statusChecking;
    statusChecking=(async()=>{
      try {
        const current=await network.request(`/v2/sessions/${sessionId}`,{signal:AbortSignal.any([abort.signal,AbortSignal.timeout(15000)])});
        if(!['ready','active'].includes(current.state)||current.expiresAt<=Date.now()||current.protocol!=='coding_v1'||current.listingId!==session.listingId||current.listingRevision!==session.listingRevision)throw new ClientError('session_not_active');
        lifecycle.paused=false;clearTimeout(authorityDeadline);authorityDeadline=undefined;return current;
      }catch(e){lifecycle.paused=true;if(!authorityDeadline)authorityDeadline=setTimeout(()=>{lifecycle.event('authority_expiry',{code:'authority_unavailable'});void close().catch(()=>{});},Math.min(30000,Math.max(1,session.expiresAt-Date.now())));lifecycle.event('status',{code:e.code??'status_failed',status:recoverableStatusFailure(e)?'paused':'failed'});if(!recoverableStatusFailure(e))void close().catch(()=>{});throw e;}
    })();try{return await statusChecking;}finally{statusChecking=undefined;}
  };
  const approvals=new DispatchQueue();
  const authorize=action=>approvals.run(async()=>{
    await status();const bound={sessionId,...action},p=new ActionApproval(bound);
    lifecycle.event('approval',{status:'awaiting_approval'});
    let yes;try{yes=await approve(bound,{id:p.id,digest:p.digest,expiresAt:p.expiresAt});}catch(e){if(e.code==='action_approval_required'){lifecycle.approvalRequired=true;lifecycle.event('approval',{status:'approval_required'});}throw e;}
    if(!yes){lifecycle.event('approval',{status:'denied'});return false;}
    p.consume(bound,{id:p.id,digest:p.digest,allowOnce:true});await status();lifecycle.event('approval',{status:'approved'});return true;
  },abort.signal);
  authorities.set(mainCapability,{purpose:'main',mutation:true});
  const toolGrants=new Map(),usedCalls=new Set();
  let terminalCommand,terminalPending;
  const terminalControl=operation=>new Promise((resolve,reject)=>{
    if(terminalPending)return reject(new ClientError('terminal_operation_busy'));
    const id=randomUUID(),timer=setTimeout(()=>{terminalCommand=undefined;terminalPending=undefined;reject(new ClientError('terminal_ack_timeout'));},3000);
    terminalCommand={id,operation};terminalPending={id,resolve:metadata=>{clearTimeout(timer);terminalCommand=undefined;terminalPending=undefined;coordinator.lastAck=metadata;resolve(metadata);}};
  });
  coordinator?.setControl(terminalControl);
  const server=createServer(async(req,res)=>{
    const authorityKey=req.headers.authorization?.replace(/^Bearer /,'');
    const authority=authorities.get(authorityKey);
    try {
      if(!authority||abort.signal.aborted)throw new ClientError('coding_authority_required');
      if(req.method==='GET'&&req.url?.startsWith('/dependencies/npm/')) {
        await status();
        if(!dependencyApproved){if(!await authorize({name:'dependency_access',args:{registry:'https://registry.npmjs.org',maximumBytes:268435456,expiresAt:session.expiresAt}}))throw new ClientError('dependency_access_denied');dependencyApproved=true;}
        const path=req.url.slice('/dependencies/npm/'.length);let url;
        if(path.startsWith('tarball?'))url=new URLSearchParams(path.slice(8)).get('url');else url='https://registry.npmjs.org/'+path;
        const target=new URL(url);if(target.origin!=='https://registry.npmjs.org'||target.username||target.password)throw new ClientError('dependency_origin_rejected');
        const result=await approvedRetrieval(target.href,abort.signal,0,32*1024*1024);let bytes=Buffer.from(result.base64,'base64');dependencyBytes+=bytes.length;if(dependencyBytes>268435456)throw new ClientError('dependency_budget_exhausted');
        if(result.contentType.includes('json')){const metadata=JSON.parse(bytes);for(const value of Object.values(metadata.versions??{version:metadata})){if(value.dist?.tarball){const t=new URL(value.dist.tarball);if(t.origin!=='https://registry.npmjs.org')throw new ClientError('dependency_origin_rejected');value.dist.tarball=`http://host.microsandbox.internal:${server.address().port}/dependencies/npm/tarball?url=${encodeURIComponent(t.href)}`;}}bytes=Buffer.from(JSON.stringify(metadata));}
        res.writeHead(result.status,{'content-type':result.contentType}).end(bytes);return;
      }
      let bytes='';for await(const b of req){bytes+=b;if(Buffer.byteLength(bytes)>(req.url?.startsWith('/host/')?4*1024*1024:262144))throw new ClientError('coding_body_limit');}
      const body=JSON.parse(bytes||'{}');let reply;
      if(req.method!=='POST')throw new ClientError('coding_operation_rejected');
      if(req.url==='/terminal/poll'){if(authority.purpose!=='main')throw new ClientError('host_bridge_denied');reply=terminalCommand??{};
      }else if(req.url==='/terminal/ack'){if(authority.purpose!=='main'||!terminalPending||body.id!==terminalPending.id)throw new ClientError('terminal_ack_rejected');const metadata={};for(const k of ['draftHash','agentId'])if(/^[a-f0-9-]{36,64}$/.test(body[k]??''))metadata[k]=body[k];terminalPending.resolve(metadata);reply={ok:true};
      }else if(req.url==='/terminal/workspace'){if(authority.purpose!=='main'||!coordinator)throw new ClientError('host_bridge_denied');await snapshot();coordinator.workspace();reply={ok:true};
      }else if(req.url==='/inference') {
        const requestAbort=new AbortController(),disconnect=()=>{if(!res.writableEnded)requestAbort.abort();};res.once('close',disconnect);
        try {reply=await queue.run(async()=>{const current=await status();if(Number(current.requestSequence??0)>=current.requestLimit)throw new ClientError('session_request_limit');display.pending=true;return network.request(`/v2/sessions/${sessionId}/inference`,{method:'POST',body:{...body,protocol:'coding_v1',maxOutputTokens:session.maxOutputTokens,purpose:authority.purpose},signal:AbortSignal.any([abort.signal,requestAbort.signal]),onEvent:event=>{if(res.writableLength>262144||res.destroyed)throw new ClientError('coding_stream_backpressure');if(!res.headersSent)res.setHeader('content-type','application/x-ndjson');res.write(JSON.stringify(event)+'\n');}});},requestAbort.signal);display.complete(reply.requestId,reply.usage,reply.settlement);for(const call of reply.toolCalls??[]){const key=authorityKey+':'+call.id;if(usedCalls.has(key)||toolGrants.has(key))throw new ClientError('tool_replay_rejected');toolGrants.set(key,{name:call.function.name,args:JSON.parse(call.function.arguments)});}
        if(!res.headersSent)res.setHeader('content-type','application/x-ndjson');res.end(JSON.stringify({type:'complete',...(reply.nativeMessage?{nativeMessage:reply.nativeMessage}:{}),requestId:reply.requestId,text:reply.text,thinking:reply.thinking??'',toolCalls:reply.toolCalls,usage:reply.usage})+'\n');return;}
        catch(e){display.failed(e.code);lifecycle.event('inference',{code:e.code??'coding_bridge_rejected',failureDiagnostic:safeFailure(e.failureDiagnostic)});try{await persistDiagnostics([]);}catch{lifecycle.event('diagnostic_save',{code:'diagnostic_save_failed'});}throw e;}finally{res.removeListener('close',disconnect);}
      } else if(req.url==='/approval') {
        if(typeof body.name!=='string'||!body.args||JSON.stringify(body.args).length>131072)throw new ClientError('coding_approval_invalid');
        if(!authority.mutation)reply={allow:false};
        else {const key=authorityKey+':'+body.toolCallId,grant=toolGrants.get(key);if(!grant||grant.name!==body.name||canonical(grant.args)!==canonical(body.args)||usedCalls.has(key))throw new ClientError('coding_approval_invalid');usedCalls.add(key);toolGrants.delete(key);
        if(body.name==='bash'){const timeout=body.args.timeout??120;if(!Number.isInteger(timeout)||timeout<1||timeout>600||timeout>(session.expiresAt-Date.now())/1000)throw new ClientError('command_duration_invalid');body.args.timeout=timeout;}let diff;if(['write','edit'].includes(body.name)){let path=body.args.path;if(typeof path==='string'&&path.startsWith('/workspace/'))path=path.slice(11);if(typeof path!=='string'||path.startsWith('/')||path.includes('\\')||path.split('/').some(p=>!p||p==='..'||p==='.adr-runtime'))throw new ClientError('coding_path_rejected');const preview=JSON.parse(await runtime.readCheckpoint(guest,['node','-e',`let input='';process.stdin.on('data',b=>input+=b).on('end',async()=>{const {codingPreview}=await import('/workspace/.adr-runtime/guest/coding-preview.mjs');console.log(JSON.stringify(await codingPreview(JSON.parse(input))));});`],{signal:abort.signal,outputBytes:8*1024*1024,input:JSON.stringify({name:body.name,args:body.args})}));diff=await actionDiff(preview.before,preview.after);}
        reply={allow:await authorize({name:body.name,args:body.args,toolCallId:body.toolCallId,...(diff?{diff}:{})})};}
      } else if(req.url==='/operator-command'){if(authority.purpose!=='main'||typeof body.command!=='string'||body.command.length>65536)throw new ClientError('coding_approval_invalid');reply={allow:await authorize({name:'operator_command',toolCallId:randomUUID(),args:{command:body.command,timeout:120}})};
      } else if(req.url==='/child') {
        if(authority.purpose!=='main'||!['subagent','btw'].includes(body.purpose)||typeof body.mutation!=='boolean')throw new ClientError('child_authority_invalid');
        const children=[...authorities.values()].filter(a=>a.purpose!=='main');if(children.length>=3||body.mutation&&children.some(a=>a.mutation))throw new ClientError('child_limit');
        const capability=randomBytes(32).toString('base64url');const grant={purpose:body.purpose,mutation:body.mutation};authorities.set(capability,grant);reply={capability,purpose:grant.purpose};
      } else if(req.url==='/child/finish'){if(authority.purpose==='main')throw new ClientError('child_authority_invalid');authorities.delete(req.headers.authorization.replace(/^Bearer /,''));reply={ok:true};}
      else if(req.url==='/display'){if(authority.purpose!=='main')throw new ClientError('host_bridge_denied');reply=display.view();}
      else if(req.url==='/web'){if(!await authorize({name:'web_retrieval',args:{url:body.url}}))throw new ClientError('web_denied');reply=await approvedRetrieval(body.url,abort.signal);}
      else if(req.url?.startsWith('/host/')){const name=req.url.slice(6);if(!['clipboard','editor','share'].includes(name)||authority.purpose!=='main')throw new ClientError('host_bridge_denied');reply=await hostOperation(name,body,(action)=>authorize(action),storage,abort.signal);}
      else throw new ClientError('coding_operation_rejected');
      res.writeHead(200,{'content-type':'application/json'}).end(JSON.stringify(reply));
    }catch(e){const code=/^[a-z0-9_]{1,80}$/.test(e.code??'')?e.code:'coding_bridge_rejected';if(!res.destroyed){if(res.headersSent)res.end(JSON.stringify({type:'error',code,...(safeFailure(e.failureDiagnostic)?{failureDiagnostic:safeFailure(e.failureDiagnostic)}:{})})+'\n');else res.writeHead(400,{'content-type':'application/json'}).end(JSON.stringify({code,...(safeFailure(e.failureDiagnostic)?{failureDiagnostic:safeFailure(e.failureDiagnostic)}:{})}));}}
  });
  requestClose=close;
  try {
    await runtime.verify({signal:startupSignal});startupSignal.throwIfAborted();workspace=await importWorkspace(root,files);startupSignal.throwIfAborted();
    const payload=new URL('../coding-runtime/',import.meta.url),provenance=JSON.parse(await readFile(new URL('provenance.json',payload)));
    if(provenance.revision!=='be7c53dc0b63fb90b70bd6cb7cad4d5713cc0d1a')throw new ClientError('coding_runtime_provenance_invalid');
    for(const [p,digest] of Object.entries(provenance.files))if(hash(await readFile(new URL(p,payload)))!==digest)throw new ClientError('coding_runtime_digest_mismatch');
    await cp(payload,join(workspace.copy,'.adr-runtime'),{recursive:true});startupSignal.throwIfAborted();
    await new Promise(r=>server.listen(0,'0.0.0.0',r));
    guest=await createGuest(runtime,[server.address().port],workspace.copy,undefined,{signal:startupSignal,continuous:true,kind:'coding'});
    await runtime.run(guest,['node','-e',`const fs=require('node:fs');for(const tool of ['rg','fd']){fs.copyFileSync('/workspace/.adr-runtime/tools/${process.arch}/'+tool,'/usr/local/bin/'+tool);fs.chmodSync('/usr/local/bin/'+tool,0o700);}const cp=require('node:child_process');for(const p of ['node','python3','git','rg','fd'])if(cp.spawnSync(p,['--version'],{timeout:2000}).status!==0)throw Error('development_image_incomplete');`],{signal:startupSignal});
    const listing=await network.request(`/v2/listings/${session.listingId}`,{public:true,signal:startupSignal});
    if(listing.id!==session.listingId||listing.revision!==session.listingRevision)throw new ClientError('marketplace_price_unavailable');
    display=new CodingDisplay(session,listing);
    const configuration={terminal:Object.fromEntries(['TERM','COLORTERM','TERM_PROGRAM','TERM_PROGRAM_VERSION'].filter(k=>/^[a-zA-Z0-9_.-]{1,80}$/.test(process.env[k]??'')).map(k=>[k,process.env[k]])),control:`http://host.microsandbox.internal:${server.address().port}`,capability:mainCapability,sessionId,modelSettings:session.modelSettings,messageFormat:session.messageFormat,model:session.model??listing.model,maxOutputTokens:session.maxOutputTokens,contextWindowTokens:session.contextWindowTokens,expiresAt:session.expiresAt,trusted,monochrome:process.env.NO_COLOR!==undefined||process.env.TERM==='dumb',thinkingExplanation:thinkingExplanation({accepted:session.capabilities?.includes('thinking_v1'),providerEnabled:listing.capabilities?.includes('thinking_v1'),modelSupported:session.thinkingModelSupport??null}),thinking:session.capabilities?.includes('thinking_v1')??false,resume:!!resumeId};
    await runtime.run(guest,['node','-e',`const fs=require('node:fs');fs.writeFileSync('/tmp/adr-coding.json',${JSON.stringify(JSON.stringify(configuration))},{mode:0o600});fs.writeFileSync('/tmp/.npmrc',${JSON.stringify(`registry=http://host.microsandbox.internal:${server.address().port}/dependencies/npm/\n//host.microsandbox.internal:${server.address().port}/:_authToken=${mainCapability}\nignore-scripts=true\naudit=false\nfund=false\n`)},{mode:0o600});`],{signal:startupSignal});
    if(resumeId){if(!/^[a-f0-9-]{36}$/.test(resumeId))throw new ClientError('resume_id_invalid');const saved=(await openSavedCodingWork(profile,resumeId,{root:workspace.root,confirmProject})).state;if(saved.root!==root||Object.keys(saved.manifest).length!==Object.keys(workspace.manifest).length||Object.entries(saved.manifest).some(([p,h])=>!Object.hasOwn(workspace.manifest,p)||workspace.manifest[p]!==h))throw new ClientError('resume_workspace_mismatch');await restoreGuestState(runtime,guest,saved.files,saved.resources,Object.keys(saved.manifest).filter(p=>!Object.hasOwn(saved.files,p)));}
    startupSignal.throwIfAborted();
    watchdog=backgroundOperation(()=>runtime.touch(guest,{signal:AbortSignal.any([abort.signal,AbortSignal.timeout(10000)])}),intervals.keepalive??20000,e=>{lifecycle.event('keepalive',{code:e.code??'keepalive_failed'});void close();});
    statusPoll=backgroundOperation(status,intervals.status??5000,()=>{});
    expires=setTimeout(()=>{lifecycle.event('expiry',{code:'session_expired'});void close().catch(()=>{});},Math.max(1,session.expiresAt-Date.now()));
    const exportFiles=async()=>{const result=JSON.parse(await runtime.readCheckpoint(guest,['node','-e',`let input='';process.stdin.on('data',b=>input+=b).on('end',async()=>{const {workspaceSnapshot}=await import('/workspace/.adr-runtime/guest/workspace-snapshot.mjs');console.log(JSON.stringify(await workspaceSnapshot('/workspace',JSON.parse(input))));});`],{signal:abort.signal,outputBytes:24*1024*1024,input:JSON.stringify(Object.keys(workspace.manifest))}));snapshotExclusions=result.excluded;return result.files;};
    snapshot=async()=>{
      if(saving)return saving;
      saving=(async()=>{const resources=JSON.parse(await runtime.readCheckpoint(guest,['node','-e',`const fs=require('node:fs');const r={};for(const n of ['settings.json','keybindings.json','trust.json','history.json']){const p='/tmp/adr-agent/'+n;if(fs.existsSync(p)){const s=fs.lstatSync(p);if(!s.isFile()||s.isSymbolicLink()||s.nlink!==1||s.size>2097152)throw Error('resource_snapshot_invalid');r[n]=fs.readFileSync(p,'utf8');}}if(fs.existsSync('/tmp/adr-agent/sessions'))for(const n of fs.readdirSync('/tmp/adr-agent/sessions')){if(/^[a-zA-Z0-9_.-]+\\.jsonl$/.test(n)){const p='/tmp/adr-agent/sessions/'+n,s=fs.lstatSync(p);if(!s.isFile()||s.isSymbolicLink()||s.nlink!==1||s.size>16777216)throw Error('session_snapshot_invalid');r['sessions/'+n]=fs.readFileSync(p,'utf8');}}console.log(JSON.stringify(r));`],{signal:abort.signal,outputBytes:24*1024*1024}));const saved=await saveCodingSnapshot(storage,{root:workspace.root,rootIdentity:workspace.rootIdentity,sessionId,listingId:session.listingId,resources,manifest:{...workspace.manifest},files:await exportFiles(),excluded:snapshotExclusions});lifecycle.event('checkpoint',{status:'saved'});return saved;})();
      try{return await saving;}catch(e){lifecycle.event('checkpoint',{code:e.code??'checkpoint_failed'});throw e;}finally{saving=undefined;}
    };
    const localWork=async()=>{
      if(!closing&&runtime.owned.has(guest))await snapshot();
      else if(saving)await saving.catch(()=>{});
      return openSavedCodingWork(profile,sessionId,{root:workspace.root,approve});
    };
    const applied=async(saved,result)=>{
      if(result.status==='applied'){
        workspace.manifest={...saved.workspace.manifest};
        if(!closing&&runtime.owned.has(guest))await snapshot();
      }
    };
    checkpoint=backgroundOperation(snapshot,intervals.checkpoint??30000,()=>{});
    finishStartup();
    return {status:()=>network.request(`/v2/sessions/${sessionId}`,{signal:AbortSignal.timeout(15000)}),close,lifecycle,
      async workspace(){if(!coordinator)throw new ClientError('terminal_operation_busy');await terminalControl('suspend');await snapshot();coordinator.workspace();},
      async interactive({prompt='',mode='interactive',consoleOptions={}}={}){await status();if(!coordinator?.child)await runtime.run(guest,['node','-e',`const fs=require('node:fs');const p='/tmp/adr-coding.json';const d=JSON.parse(fs.readFileSync(p));d.prompt=${JSON.stringify(prompt)};d.resume=require('node:fs').existsSync('/tmp/adr-agent/sessions');fs.writeFileSync(p,JSON.stringify(d),{mode:0o600});`]);try{await runtime.attachConsole(guest,['node','/workspace/.adr-runtime/guest/coding-entry.mjs',...(mode==='rpc'?['--mode','rpc']:mode==='json'?['--mode','json','--print']:mode==='print'?['--print']:[])],{...consoleOptions,coordinator,beforeTeardown:()=>snapshot(),onOutcome:o=>lifecycle.event(o.phase,o),signal:abort.signal,timeoutSeconds:Math.min(3600,Math.max(1,Math.floor((session.expiresAt-Date.now())/1000)))});lifecycle.event('console',{status:'completed'});}catch(e){lifecycle.event('console',{code:e.code,exitCode:e.exitCode,signal:e.signal});throw e;}},
      async save(){if(!closing&&runtime.owned.has(guest))return snapshot();if(saving)await saving.catch(()=>{});const saved=await openSavedCodingWork(profile,sessionId,{root:workspace.root});return {resumeId:sessionId,snapshotRevision:saved.snapshotRevision,savedAt:saved.state.savedAt};},
      async discard(){discarded=true;checkpoint?.stop();if(saving)await saving.catch(()=>{});await rm(join(storage,'state.json'),{force:true});lifecycle.event('checkpoint',{status:'discarded'});},
      async changes(){return (await localWork()).changes();},
      async review(){return (await localWork()).review();},
      async recover(journal){const saved=await localWork();const result=await saved.recover(journal);await applied(saved,result);return result;},
      async export(){return (await localWork()).export();},
      async apply(selectedPaths){const saved=await localWork();const result=await saved.apply(selectedPaths);await applied(saved,result);return result;},
    };
  }catch(original){if(!guest&&/^adrnew-[a-f0-9-]{36}$/.test(original.sandboxName??'')&&runtime.owned.has(original.sandboxName))guest=original.sandboxName;const e=startupSignal.aborted&&original.name==='AbortError'?new ClientError('cancelled'):original;lifecycle.event('startup',{code:e.code??'coding_startup_failed',exitCode:e.exitCode,signal:e.signal});finishStartup();e.lifecycleOutcome=await close().catch(()=>undefined);throw e;}
}
