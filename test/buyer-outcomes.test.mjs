import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdtemp, realpath, writeFile, readFile, rm, chmod, lstat } from 'node:fs/promises';
import { tmpdir, homedir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const base=process.env.ADR_DIAGNOSTIC_CLIENT_ROOT;
const entry=file=>base?pathToFileURL(base+'/src/'+file).href:new URL('../src/'+file,import.meta.url).href;
const {openCodingBuyer}=await import(entry('coding-buyer.mjs'));
const helpers=await import(entry('failure-diagnostics.mjs'));
const wait=async check=>{for(let i=0;i<500;i++){if(check())return;await new Promise(r=>setTimeout(r,10));}throw Error('fixture_timeout');};
const deferred=()=>{let release;const promise=new Promise(r=>release=r);return {promise,release};};

async function fixture(){
 const root=await realpath(await mkdtemp(join(process.platform==='darwin'?'/private/tmp':tmpdir(),'adr-cleanup-'))),profile='test-'+randomUUID().slice(0,8),id=randomUUID();await writeFile(join(root,'index.html'),'PRIVATE_WORKLOAD_SENTINEL');
 const images=JSON.parse(await readFile(base?join(base,'runtime/guest-images.json'):new URL('../runtime/guest-images.json',import.meta.url),'utf8'));
 const session={id,protocol:'coding_v1',state:'ready',handshakeStatus:'succeeded',expiresAt:Date.now()+3600000,requestLimit:100,requestSequence:0,maxOutputTokens:128,contextWindowTokens:32768,model:'synthetic',listingId:randomUUID(),listingRevision:1};
 const guest=deferred(),remote=deferred();let copy,removals=0,stops=0;
 const runtime={owned:new Set(),verify:async()=>{},create:async options=>{copy=options.copyDirectory;const name='adrnew-'+randomUUID();runtime.owned.add(name);return name;},run:async()=>'',readCheckpoint:async(_name,cmd)=>JSON.stringify(cmd[2]?.includes('workspaceSnapshot')?{files:{'index.html':'PRIVATE_WORKLOAD_SENTINEL'},excluded:{}}:{}),touch:async()=>{},inspect:async()=>({config:{manifest_digest:images.coding['linux-'+process.arch],mounts:[],network:{policy:{default_egress:'deny'}}}}),remove:async()=>{removals++;await guest.promise;throw Object.assign(Error('PRIVATE_ERROR_SENTINEL'),{code:'guest_cleanup_failed'});}};
 const network={request:async path=>{if(path.startsWith('/v2/listings/'))return {id:session.listingId,revision:1,model:session.model,inputRate:'1',outputRate:'1'};if(path.endsWith('/stop')){stops++;await remote.promise;throw Object.assign(Error('PRIVATE_ERROR_SENTINEL'),{code:'remote_stop_failed',session:{charged:'PRIVATE_FINANCIAL_SENTINEL'}});}return {...session};}};
 const buyer=await openCodingBuyer(network,id,{root,files:['index.html'],profile,runtime,intervals:{status:100000,checkpoint:100000,keepalive:100000}});
 const diagnostic={schemaVersion:1,requestId:randomUUID(),sessionId:id,providerRunId:randomUUID(),model:'synthetic',api:'openai-completions',phase:'tls',code:'upstream_failed_outcome_unknown',elapsedMs:22,statusCode:null,transportCategory:'tls',transportCode:'CERT_HAS_EXPIRED',dispatchEvidence:'outcome_unknown',responseEvidence:'not_observed',timeline:[{phase:'tls',elapsedMs:22}]};buyer.lifecycle.event('inference',{code:diagnostic.code,failureDiagnostic:diagnostic});
 const storage=join(homedir(),'.adr-v2','profiles',profile,'coding',id),exports=await mkdtemp(join(process.platform==='darwin'?'/private/tmp':tmpdir(),'adr-cleanup-export-'));
 return {buyer,root,profile,id,storage,exports,guest,remote,counts:()=>({removals,stops}),copy:()=>copy,cleanup:async()=>{guest.release();remote.release();await buyer.close();runtime.owned.clear();await rm(root,{recursive:true,force:true});await rm(join(homedir(),'.adr-v2','profiles',profile),{recursive:true,force:true});await rm(exports,{recursive:true,force:true});}};
}
const phases=value=>Object.fromEntries(value.outcomes.map(o=>[o.phase,o]));
for(const saveFailure of [false,true])test(`buyer cleanup snapshot is shared and fresh: write failure ${saveFailure}`,async()=>{
 const f=await fixture();try{
  if(saveFailure)await chmod(f.storage,0o755);
  const close=f.buyer.close();assert.equal(typeof f.buyer.diagnostics,'function');
  const read=()=>f.buyer.diagnostics();await wait(()=>f.counts().removals===1&&f.counts().stops===1);
  await wait(()=>phases(read()).workspace_cleanup?.status==='succeeded');
  if(saveFailure)await wait(()=>phases(read()).diagnostic_save?.status==='failed');
  const during=read();assert.equal(phases(during).guest_removal.status,'pending');assert.equal(phases(during).remote_stop.status,'pending');assert.equal(phases(during).settlement.status,'pending');
  const before=f.counts(),duringPath=await helpers.exportFailure(f.exports,during.failureDiagnostic,during.outcomes);assert.deepEqual(JSON.parse(await readFile(duringPath,'utf8')).outcomes,during.outcomes);assert.deepEqual(f.counts(),before);
  f.guest.release();await wait(()=>phases(read()).guest_removal.status==='failed');assert.equal(phases(read()).remote_stop.status,'pending');f.remote.release();const result=await close;
  const after=read(),out=phases(after);assert.equal(out.guest_removal.status,'failed');assert.equal(out.workspace_cleanup.status,'succeeded');assert.equal(out.remote_stop.status,'failed');assert.equal(out.settlement.status,'pending');assert.equal(new Set(after.outcomes.map(o=>o.phase)).size,after.outcomes.length);assert.deepEqual(result.outcomes,after.outcomes);
  const finalPath=await helpers.exportFailure(f.exports,read().failureDiagnostic,read().outcomes);const final=JSON.parse(await readFile(finalPath,'utf8'));assert.deepEqual(final.outcomes,after.outcomes);assert.doesNotMatch(JSON.stringify(final),/PRIVATE_|charged|session"|workload/);assert.equal((await lstat(finalPath)).mode&0o777,0o600);
  if(saveFailure){assert.equal(out.diagnostic_save.status,'failed');assert.equal(f.buyer.lifecycle.diagnosticSaveFailed,true);}
  else {const stored=JSON.parse(await readFile(join(f.storage,'lifecycle.json'),'utf8'));const reopened=helpers.failureSnapshot(stored);assert.deepEqual(reopened.outcomes,after.outcomes);const path=await helpers.exportFailure(f.exports,reopened.failureDiagnostic,reopened.outcomes);assert.deepEqual(JSON.parse(await readFile(path,'utf8')).outcomes,final.outcomes);}
 }finally{await f.cleanup();}
});

test('reopened legacy outcome normalization strips private fields and duplicate events',()=>{
 const row={firstFailure:null,events:[{phase:'guest_removal',status:'pending'},{phase:'workspace_cleanup',status:'succeeded',arguments:'PRIVATE_WORKLOAD_SENTINEL'},{phase:'diagnostic_save',code:'diagnostic_save_failed'}],outcomes:[{phase:'guest_removal',status:'failed',code:'guest_cleanup_failed',session:{charged:'PRIVATE_FINANCIAL_SENTINEL'}},{phase:'remote_stop',status:'failed',code:'remote_stop_failed'},{phase:'settlement',status:'pending'},{phase:'workspace_cleanup',status:'succeeded'},{phase:'diagnostic_save',status:'succeeded'}]};
 const details=helpers.failureSnapshot(row);assert.equal(phases(details).diagnostic_save.status,'failed');assert.equal(phases(details).guest_removal.status,'failed');assert.equal(new Set(details.outcomes.map(o=>o.phase)).size,details.outcomes.length);assert.doesNotMatch(JSON.stringify(details),/PRIVATE_|session|arguments|charged/);assert.match(helpers.failureLines(null,details.outcomes).join('\n'),/guest_removal.*failed/);
});

test('active workspace export re-reads the controller after cleanup changes in the open view',async()=>{
 const {runTui}=await import(entry('tui.mjs')),{BuyerLifecycle}=await import(entry('buyer-lifecycle.mjs'));
 const root=await realpath(await mkdtemp(join(process.platform==='darwin'?'/private/tmp':tmpdir(),'adr-outcome-ui-'))),directory=await mkdtemp(join(process.platform==='darwin'?'/private/tmp':tmpdir(),'adr-outcome-ui-export-'));await writeFile(join(root,'index.html'),'synthetic');
 const id=randomUUID(),run=randomUUID(),d={schemaVersion:1,requestId:randomUUID(),sessionId:id,providerRunId:run,model:'synthetic',api:'openai-completions',phase:'tls',code:'upstream_failed_outcome_unknown',elapsedMs:22,statusCode:null,transportCategory:'tls',transportCode:'CERT_HAS_EXPIRED',dispatchEvidence:'outcome_unknown',responseEvidence:'not_observed',timeline:[]};
 const lifecycle=new BuyerLifecycle();lifecycle.event('inference',{code:d.code,failureDiagnostic:d});lifecycle.beginCleanup();let homes=0,sessions=0,details=0,workspaces=0,views=0,reads=0,closes=0,exports=0;
 const config={protocol:'2.0.0',product:'adr-v2',settlement:'test_credits',cashValue:false,admissions:false,privateRehearsal:true,privateOwnerEvaluation:true,supplyClasses:['authorized_api','self_hosted'],connectorProfile:'inference_connector_v1',maxNodeSessions:1,relay:'wss_single_instance',agentExecution:'buyer_vm_v1',capabilities:['allowance_v1','provider_budget_v1','cold_activation_v1','coding_v1'],activationDeadlineSeconds:120,codingLimits:{durationSeconds:3600,requestLimit:100}};
 const session={id,protocol:'coding_v1',state:'ready',expiresAt:Date.now()+3600000,requestLimit:100,requestSequence:0,funded:'100',reserved:'1',charged:'0',refunded:'0'};
 const buyer={lifecycle,diagnostics:()=>{reads++;return lifecycle.diagnostics();},interactive:async()=>{},save:async()=>({resumeId:id,savedAt:Date.now()}),status:async()=>session,changes:async()=>({changes:[]}),close:async()=>{closes++;return {status:'closed',outcomes:lifecycle.diagnostics().outcomes};}};
 const ui={start(){},stop(){},suspend:work=>work(),task:(_title,work)=>work(new AbortController().signal,()=>{}),form:async(_t,_f,values)=>{values.root=root;return values;},menu:async(title,options,context)=>{
  if(title==='What would you like to do?')return homes++===0?'sessions':'exit';if(title==='My sessions')return sessions++===0?id:'back';if(title==='Test-credit session')return details++===0?'agent':'back';if(title==='Review project and launch')return 'launch';if(title==='Coding workspace')return workspaces++===0?'failureDetails':'finish';if(title==='Finish with saved work')return 'save';
  if(title==='Failure details'){if(views++===0){assert.match((typeof context.lines==='function'?context.lines():context.lines).join('\n'),/guest_removal.*pending/);lifecycle.event('guest_removal',{status:'failed',code:'guest_cleanup_failed'});lifecycle.event('workspace_cleanup',{status:'succeeded'});lifecycle.event('remote_stop',{status:'failed',code:'remote_stop_failed'});return 'exportDiagnostic';}return 'back';}throw Error('unexpected_screen');
 },page:async(title,lines)=>{if(title==='Private diagnostic export'){assert.equal(closes,0);const value=JSON.parse(await readFile(lines[0],'utf8'));assert.equal(value.outcomes.find(o=>o.phase==='guest_removal').status,'failed');assert.equal(value.outcomes.find(o=>o.phase==='workspace_cleanup').status,'succeeded');assert.equal(value.outcomes.find(o=>o.phase==='settlement').status,'pending');exports++;}}};
 const network={local:true,origin:'http://127.0.0.1:9',request:async(path,options={})=>{assert.ok(!options.method||options.method==='GET');if(path.endsWith('/network/config'))return config;if(path.endsWith('/listings/summary'))throw Error('unavailable');if(path==='/v2/sessions')return [session];if(path==='/v2/sessions/'+id)return session;throw Error('unexpected_read');}};
 try{await runTui({}, {ui,network,store:{profile:'buyer',directory:async()=>directory},openCodingBuyer:async()=>buyer,savedCodingContexts:async()=>[],pendingApplications:async()=>[]});assert.equal(exports,1);assert.ok(reads>=2);assert.equal(closes,1);}finally{await rm(root,{recursive:true,force:true});await rm(directory,{recursive:true,force:true});}
});
