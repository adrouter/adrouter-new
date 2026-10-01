import { createServer } from 'node:http';
import { randomBytes, createHash, randomUUID } from 'node:crypto';
import { readFile, writeFile, rename, mkdir, cp, rm, lstat, readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { homedir } from 'node:os';
import { ActionApproval } from './buyer.mjs';
import { importWorkspace, exportSnapshot, proposeExport, changeDiffs, reviewAndApply, recoverApplication } from './workspace.mjs';
import { configuredRuntime, createGuest } from './provider.mjs';
import { SandboxRuntime } from './runtime.mjs';
import { ClientError } from './network.mjs';
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

export async function openCodingBuyer(network,sessionId,{root,files,runtimeConfig,runtime:provided,signal,approve=approvalRequired,trusted=false,profile='buyer',resumeId,coordinator,progress=()=>{},intervals={}}={}) {
  if(!/^[a-z][a-z0-9_-]{0,31}$/.test(profile))throw new ClientError('invalid_profile_name');
  if(!/^[a-f0-9-]{36}$/.test(sessionId))throw new ClientError('coding_session_required');
  let guest,workspace,closing,watchdog,statusPoll,expires,checkpoint,saving,snapshot,discarded=false,statusChecking,dependencyApproved=false,dependencyBytes=0;const abort=new AbortController(), queue=new DispatchQueue(),authorities=new Map(),mainCapability=randomBytes(32).toString('base64url');
  const runtime=provided??(runtimeConfig?new SandboxRuntime(runtimeConfig):await configuredRuntime());
  const session=await network.request(`/v2/sessions/${sessionId}`,{signal});
  if(!Number.isSafeInteger(session.expiresAt)||!Number.isInteger(session.requestLimit)||session.requestLimit<1||session.requestLimit>100||session.protocol!=='coding_v1'||!['ready','active'].includes(session.state)||session.handshakeStatus!=='succeeded'||session.expiresAt<=Date.now())throw new ClientError('coding_session_required');
  let privateRoot=homedir();for(const part of ['.adr-v2','profiles',profile,'coding']){privateRoot=join(privateRoot,part);await mkdir(privateRoot,{recursive:true,mode:0o700});const st=await lstat(privateRoot);if(!st.isDirectory()||st.isSymbolicLink()||st.uid!==process.getuid()||(st.mode&0o077))throw new ClientError('coding_profile_unsafe');}
  const ps=await lstat(privateRoot);if(!ps.isDirectory()||ps.isSymbolicLink()||(ps.mode&0o077)||ps.uid!==process.getuid())throw new ClientError('coding_profile_unsafe');
  const lifecycle=new BuyerLifecycle(value=>{try{progress({status:value.events.at(-1)?.phase,paused:lifecycle.paused});}catch{}});
  const storage=join(privateRoot,sessionId);await mkdir(storage,{recursive:true,mode:0o700});const ss=await lstat(storage);if(!ss.isDirectory()||ss.isSymbolicLink()||ss.uid!==process.getuid()||(ss.mode&0o077))throw new ClientError('coding_profile_unsafe');
  const close=async()=>{
    if(closing)return closing;lifecycle.closing=true;lifecycle.event('closure',{status:'closing'});
    queue.stop();approvals.stop();for(const [name,handler] of signalHandlers)process.removeListener(name,handler);
    signal?.removeEventListener('abort',onAbort);watchdog?.stop();statusPoll?.stop();checkpoint?.stop();clearTimeout(expires);
    closing=(async()=>{
      if(!discarded&&snapshot&&guest&&runtime.owned.has(guest))await snapshot().catch(()=>{});
      abort.abort();
      const operations=[['guest_removal',()=>guest&&runtime.owned.has(guest)?runtime.remove(guest):undefined],
        ['workspace_cleanup',()=>workspace?rm(workspace.copy,{recursive:true,force:true}):undefined],
        ['remote_stop',()=>network.request(`/v2/sessions/${sessionId}/stop`,{method:'POST',body:{},signal:AbortSignal.timeout(30000)})]];
      const outcomes=await Promise.all(operations.map(async([phase,work])=>{try{const value=await work();lifecycle.event(phase,{status:'succeeded'});return {phase,status:'succeeded',...(phase==='remote_stop'?{session:value}:{})};}catch(e){lifecycle.event(phase,{code:e.code??'cleanup_failed',status:'failed'});return {phase,status:'failed',code:e.code??'cleanup_failed'};}}));
      const stopped=outcomes.find(o=>o.phase==='remote_stop');outcomes.push({phase:'settlement',status:['settled','refunded'].includes(stopped?.session?.state)?'succeeded':'pending'});lifecycle.event('settlement',{status:outcomes.at(-1).status});
      server.closeAllConnections();if(server.listening)await new Promise(r=>server.close(r));
      try{await writeFile(join(storage,'lifecycle.json'),JSON.stringify({firstFailure:lifecycle.firstFailure,events:lifecycle.events,outcomes:outcomes.map(({session,...o})=>({...o,state:typeof session?.state==='string'&&/^[a-z_]{1,80}$/.test(session.state)?session.state:null}))}),{mode:0o600});}catch{outcomes.push({phase:'diagnostic_save',status:'failed',code:'diagnostic_save_failed'});}
      return {status:outcomes.some(o=>o.status==='failed')?'cleanup_required':'closed',outcomes,firstFailure:lifecycle.firstFailure};
    })();return closing;
  };
  const onSignal=name=>{lifecycle.event('signal',{signal:name,status:'cancelled'});void close().catch(()=>{});};
  const signalHandlers=new Map(['SIGINT','SIGTERM','SIGHUP','SIGTSTP'].map(name=>[name,()=>onSignal(name)]));
  const onAbort=()=>{lifecycle.event('cancellation',{code:'cancelled'});void close().catch(()=>{});};
  for(const [name,handler] of signalHandlers)process.once(name,handler);
  const status=async()=>{
    if(closing)throw new ClientError('session_not_active');
    if(statusChecking)return statusChecking;
    statusChecking=(async()=>{
      try {
        const current=await network.request(`/v2/sessions/${sessionId}`,{signal:AbortSignal.any([abort.signal,AbortSignal.timeout(15000)])});
        if(!['ready','active'].includes(current.state)||current.expiresAt<=Date.now()||current.protocol!=='coding_v1'||current.listingId!==session.listingId||current.listingRevision!==session.listingRevision)throw new ClientError('session_not_active');
        lifecycle.paused=false;return current;
      }catch(e){lifecycle.paused=true;lifecycle.event('status',{code:e.code??'status_failed',status:recoverableStatusFailure(e)?'paused':'failed'});if(!recoverableStatusFailure(e))void close().catch(()=>{});throw e;}
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
      if(req.url==='/inference') {
        const requestAbort=new AbortController(),disconnect=()=>{if(!res.writableEnded)requestAbort.abort();};res.once('close',disconnect);
        try {reply=await queue.run(async()=>{const current=await status();if(Number(current.requestSequence??0)>=current.requestLimit)throw new ClientError('session_request_limit');return network.request(`/v2/sessions/${sessionId}/inference`,{method:'POST',body:{...body,protocol:'coding_v1',maxOutputTokens:session.maxOutputTokens,purpose:authority.purpose},signal:AbortSignal.any([abort.signal,requestAbort.signal]),onEvent:event=>{if(res.writableLength>262144||res.destroyed)throw new ClientError('coding_stream_backpressure');if(!res.headersSent)res.setHeader('content-type','application/x-ndjson');res.write(JSON.stringify(event)+'\n');}});},requestAbort.signal);for(const call of reply.toolCalls??[]){const key=authorityKey+':'+call.id;if(usedCalls.has(key)||toolGrants.has(key))throw new ClientError('tool_replay_rejected');toolGrants.set(key,{name:call.function.name,args:JSON.parse(call.function.arguments)});}
        if(!res.headersSent)res.setHeader('content-type','application/x-ndjson');res.end(JSON.stringify({type:'complete',requestId:reply.requestId,text:reply.text,thinking:reply.thinking??'',toolCalls:reply.toolCalls,usage:reply.usage})+'\n');return;}
        finally{res.removeListener('close',disconnect);}
      } else if(req.url==='/approval') {
        if(typeof body.name!=='string'||!body.args||JSON.stringify(body.args).length>131072)throw new ClientError('coding_approval_invalid');
        if(!authority.mutation)reply={allow:false};
        else {const key=authorityKey+':'+body.toolCallId,grant=toolGrants.get(key);if(!grant||grant.name!==body.name||canonical(grant.args)!==canonical(body.args)||usedCalls.has(key))throw new ClientError('coding_approval_invalid');usedCalls.add(key);toolGrants.delete(key);
        if(body.name==='bash'){const timeout=body.args.timeout??120;if(!Number.isInteger(timeout)||timeout<1||timeout>600||timeout>(session.expiresAt-Date.now())/1000)throw new ClientError('command_duration_invalid');body.args.timeout=timeout;}let diff;if(['write','edit'].includes(body.name)){let path=body.args.path;if(typeof path==='string'&&path.startsWith('/workspace/'))path=path.slice(11);if(typeof path!=='string'||path.startsWith('/')||path.includes('\\')||path.split('/').some(p=>!p||p==='..'||p==='.adr-runtime'))throw new ClientError('coding_path_rejected');const before=await runtime.readCheckpoint(guest,['node','-e',`const fs=require('node:fs');const p='/workspace/'+${JSON.stringify(path)};try{const s=fs.lstatSync(p);if(!s.isFile()||s.isSymbolicLink()||s.size>2097152)throw Error('unsafe');process.stdout.write(fs.readFileSync(p,'utf8'));}catch(e){if(e.code!=='ENOENT')throw e;}`],{signal:abort.signal,outputBytes:3*1024*1024});diff=[...before.split('\n').map(l=>'- '+l),...String(body.args.newText??body.args.content??'').split('\n').map(l=>'+ '+l)];}
        reply={allow:await authorize({name:body.name,args:body.args,toolCallId:body.toolCallId,...(diff?{diff}:{})})};}
      } else if(req.url==='/operator-command'){if(authority.purpose!=='main'||typeof body.command!=='string'||body.command.length>65536)throw new ClientError('coding_approval_invalid');reply={allow:await authorize({name:'operator_command',toolCallId:randomUUID(),args:{command:body.command,timeout:120}})};
      } else if(req.url==='/child') {
        if(authority.purpose!=='main'||!['subagent','btw'].includes(body.purpose)||typeof body.mutation!=='boolean')throw new ClientError('child_authority_invalid');
        const children=[...authorities.values()].filter(a=>a.purpose!=='main');if(children.length>=3||body.mutation&&children.some(a=>a.mutation))throw new ClientError('child_limit');
        const capability=randomBytes(32).toString('base64url');const grant={purpose:body.purpose,mutation:body.mutation};authorities.set(capability,grant);reply={capability,purpose:grant.purpose};
      } else if(req.url==='/child/finish'){if(authority.purpose==='main')throw new ClientError('child_authority_invalid');authorities.delete(req.headers.authorization.replace(/^Bearer /,''));reply={ok:true};}
      else if(req.url==='/web'){if(!await authorize({name:'web_retrieval',args:{url:body.url}}))throw new ClientError('web_denied');reply=await approvedRetrieval(body.url,abort.signal);}
      else if(req.url?.startsWith('/host/')){const name=req.url.slice(6);if(!['clipboard','editor','share'].includes(name)||authority.purpose!=='main')throw new ClientError('host_bridge_denied');reply=await hostOperation(name,body,(action)=>authorize(action),storage,abort.signal);}
      else throw new ClientError('coding_operation_rejected');
      res.writeHead(200,{'content-type':'application/json'}).end(JSON.stringify(reply));
    }catch(e){const code=/^[a-z0-9_]{1,80}$/.test(e.code??'')?e.code:'coding_bridge_rejected';if(!res.destroyed){if(res.headersSent)res.end(JSON.stringify({type:'error',code})+'\n');else res.writeHead(400,{'content-type':'application/json'}).end(JSON.stringify({code}));}}
  });
  try {
    await runtime.verify({signal});workspace=await importWorkspace(root,files);
    const payload=new URL('../coding-runtime/',import.meta.url),provenance=JSON.parse(await readFile(new URL('provenance.json',payload)));
    if(provenance.revision!=='be7c53dc0b63fb90b70bd6cb7cad4d5713cc0d1a')throw new ClientError('coding_runtime_provenance_invalid');
    for(const [p,digest] of Object.entries(provenance.files))if(hash(await readFile(new URL(p,payload)))!==digest)throw new ClientError('coding_runtime_digest_mismatch');
    await cp(payload,join(workspace.copy,'.adr-runtime'),{recursive:true});
    await new Promise(r=>server.listen(0,'0.0.0.0',r));
    guest=await createGuest(runtime,[server.address().port],workspace.copy,undefined,{signal,continuous:true,kind:'coding'});
    await runtime.run(guest,['node','-e',`const fs=require('node:fs');fs.copyFileSync('/workspace/.adr-runtime/tools/${process.arch}/rg','/usr/local/bin/rg');fs.chmodSync('/usr/local/bin/rg',0o700);const cp=require('node:child_process');for(const p of ['node','python3','git','rg'])if(cp.spawnSync(p,['--version']).status!==0)throw Error('development_image_incomplete');`]);
    const configuration={control:`http://host.microsandbox.internal:${server.address().port}`,capability:mainCapability,sessionId,model:session.model??(await network.request(`/v2/listings/${session.listingId}`,{public:true})).model,maxOutputTokens:session.maxOutputTokens,contextWindowTokens:session.contextWindowTokens,expiresAt:session.expiresAt,trusted,thinking:session.capabilities?.includes('thinking_v1')??false,resume:!!resumeId};
    await runtime.run(guest,['node','-e',`const fs=require('node:fs');fs.writeFileSync('/tmp/adr-coding.json',${JSON.stringify(JSON.stringify(configuration))},{mode:0o600});fs.writeFileSync('/tmp/.npmrc',${JSON.stringify(`registry=http://host.microsandbox.internal:${server.address().port}/dependencies/npm/\n//host.microsandbox.internal:${server.address().port}/:_authToken=${mainCapability}\nignore-scripts=true\naudit=false\nfund=false\n`)},{mode:0o600});`],{signal});
    if(resumeId){if(!/^[a-f0-9-]{36}$/.test(resumeId))throw new ClientError('resume_id_invalid');const saved=JSON.parse(await readFile(join(privateRoot,resumeId,'state.json'),'utf8'));if(saved.root!==root||Object.keys(saved.manifest).length!==Object.keys(workspace.manifest).length||Object.entries(saved.manifest).some(([p,h])=>!Object.hasOwn(workspace.manifest,p)||workspace.manifest[p]!==h))throw new ClientError('resume_workspace_mismatch');await restoreGuestState(runtime,guest,saved.files,saved.resources,Object.keys(saved.manifest).filter(p=>!Object.hasOwn(saved.files,p)));}
    watchdog=backgroundOperation(()=>runtime.touch(guest,{signal:AbortSignal.any([abort.signal,AbortSignal.timeout(10000)])}),intervals.keepalive??20000,e=>{lifecycle.event('keepalive',{code:e.code??'keepalive_failed'});void close();});
    statusPoll=backgroundOperation(status,intervals.status??20000,()=>{});
    expires=setTimeout(()=>{lifecycle.event('expiry',{code:'session_expired'});void close().catch(()=>{});},Math.max(1,session.expiresAt-Date.now()));signal?.addEventListener('abort',onAbort,{once:true});if(signal?.aborted)onAbort();
    const exportFiles=async()=>{const code=`const fs=require('node:fs'),path=require('node:path');const out={};function walk(p=''){for(const e of fs.readdirSync(path.join('/workspace',p),{withFileTypes:true})){if(e.name==='.adr-runtime'||['node_modules','dist','build','coverage','.git'].includes(e.name)||e.name.startsWith('.env')||/credentials?|secrets?|\\.(pem|key|p12|db|sqlite|tgz|zip)$/.test(e.name))continue;const rel=p?p+'/'+e.name:e.name,full=path.join('/workspace',rel),s=fs.lstatSync(full);if(s.isSymbolicLink()||s.nlink!==1&&s.isFile())throw Error('export_link');if(e.isDirectory())walk(rel);else if(e.isFile()){if(s.size>2097152)throw Error('export_limit');const text=new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(fs.readFileSync(full));if(text.includes(String.fromCharCode(0)))throw Error('export_binary');out[rel]=text;}}}walk();console.log(JSON.stringify(out));`;return JSON.parse(await runtime.readCheckpoint(guest,['node','-e',code],{signal:abort.signal,outputBytes:24*1024*1024}));};
    snapshot=async()=>{
      if(saving)return saving;
      saving=(async()=>{const resources=JSON.parse(await runtime.readCheckpoint(guest,['node','-e',`const fs=require('node:fs');const r={};for(const n of ['settings.json','keybindings.json','trust.json','history.json']){const p='/tmp/adr-agent/'+n;if(fs.existsSync(p)){const s=fs.lstatSync(p);if(!s.isFile()||s.isSymbolicLink()||s.nlink!==1||s.size>2097152)throw Error('resource_snapshot_invalid');r[n]=fs.readFileSync(p,'utf8');}}if(fs.existsSync('/tmp/adr-agent/sessions'))for(const n of fs.readdirSync('/tmp/adr-agent/sessions')){if(/^[a-zA-Z0-9_.-]+\\.jsonl$/.test(n)){const p='/tmp/adr-agent/sessions/'+n,s=fs.lstatSync(p);if(!s.isFile()||s.isSymbolicLink()||s.nlink!==1||s.size>16777216)throw Error('session_snapshot_invalid');r['sessions/'+n]=fs.readFileSync(p,'utf8');}}console.log(JSON.stringify(r));`],{signal:abort.signal,outputBytes:24*1024*1024}));const temp=join(storage,`checkpoint-${randomUUID()}.tmp`);await writeFile(temp,JSON.stringify({schemaVersion:1,root,sessionId,listingId:session.listingId,resources,manifest:workspace.manifest,files:await exportFiles()}),{flag:'wx',mode:0o600});await rename(temp,join(storage,'state.json'));lifecycle.event('checkpoint',{status:'saved'});return {resumeId:sessionId,savedAt:Date.now()};})();
      try{return await saving;}catch(e){lifecycle.event('checkpoint',{code:e.code??'checkpoint_failed'});throw e;}finally{saving=undefined;}
    };
    checkpoint=backgroundOperation(snapshot,intervals.checkpoint??30000,()=>{});
    return {status,close,lifecycle,
      async interactive({prompt='',mode='interactive',consoleOptions={}}={}){await status();await runtime.run(guest,['node','-e',`const fs=require('node:fs');const p='/tmp/adr-coding.json';const d=JSON.parse(fs.readFileSync(p));d.prompt=${JSON.stringify(prompt)};d.resume=require('node:fs').existsSync('/tmp/adr-agent/sessions');fs.writeFileSync(p,JSON.stringify(d),{mode:0o600});`]);try{await runtime.attachConsole(guest,['node','/workspace/.adr-runtime/guest/coding-entry.mjs',...(mode==='rpc'?['--mode','rpc']:mode==='json'?['--mode','json','--print']:mode==='print'?['--print']:[])],{...consoleOptions,coordinator,beforeTeardown:()=>snapshot(),onOutcome:o=>lifecycle.event(o.phase,o),signal:abort.signal,timeoutSeconds:Math.min(3600,Math.max(1,Math.floor((session.expiresAt-Date.now())/1000)))});lifecycle.event('console',{status:'completed'});}catch(e){lifecycle.event('console',{code:e.code,exitCode:e.exitCode,signal:e.signal});throw e;}},
      save:snapshot,
      async discard(){discarded=true;checkpoint?.stop();if(saving)await saving.catch(()=>{});await rm(join(storage,'state.json'),{force:true});lifecycle.event('checkpoint',{status:'discarded'});},
      async changes(){const files=await exportFiles(),changes=[];for(const p of Object.keys(workspace.manifest))if(!Object.hasOwn(files,p))files[p]=null;for(const [path,content] of Object.entries(files)){const before=workspace.manifest[path]??null,after=content===null?null:hash(content);if(before!==after)changes.push({path,kind:content===null?'delete':before===null?'add':'modify',before,after});}return {changes};},
      async recover(journal){if(!journal.startsWith(join(privateRoot,'journals')+'/'))throw new ClientError('apply_journal_rejected');const record=JSON.parse(await readFile(journal,'utf8'));const result=await recoverApplication(workspace,journal,p=>authorize({name:'recover_application',changes:p.changes,digest:p.digest}));if(result.status==='applied'){await restoreGuestState(runtime,guest,Object.fromEntries(record.changes.filter(c=>c.content!==null).map(c=>[c.path,c.content])),{},record.changes.filter(c=>c.content===null).map(c=>c.path));for(const c of record.changes){if(c.after===null)delete workspace.manifest[c.path];else workspace.manifest[c.path]=c.after;}await snapshot();}return result;},
      async export(){return exportSnapshot(workspace,await exportFiles(),p=>authorize({name:'export_workspace',changes:p.changes}));},
      async apply(){const files=await exportFiles(),values={...files};for(const p of Object.keys(workspace.manifest))if(!Object.hasOwn(values,p))values[p]=null;const diffs=await changeDiffs(workspace,(await proposeExport(workspace,values)).changes);const result=await reviewAndApply(workspace,files,async p=>authorize({name:'apply_workspace',changes:p.changes.map((c,i)=>({...c,diff:diffs[i]})),digest:p.digest}),{journalRoot:join(privateRoot,'journals')});if(result.status==='applied'){for(const c of result.completed){if(Object.hasOwn(files,c))workspace.manifest[c]=hash(files[c]);else delete workspace.manifest[c];}await snapshot();}return result;},
    };
  }catch(e){lifecycle.event('startup',{code:e.code??'coding_startup_failed',exitCode:e.exitCode,signal:e.signal});await close().catch(()=>{});throw e;}
}
