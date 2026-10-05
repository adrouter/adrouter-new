import { reportDigest } from '../src/provider-reports.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdtemp, readFile, rm, lstat } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { setTimeout as delay } from 'node:timers/promises';
import { piCatalog } from '../src/generated/pi-catalog.mjs';
import { providerCanLaunch } from '../src/provider-diagnostics.mjs';
import { startProvider } from '../src/provider.mjs';
import { providerStatusLines } from '../src/tui.mjs';
import { TerminalUI } from '../src/tui-screen.mjs';
import { PassThrough } from 'node:stream';

const images=JSON.parse(await readFile(new URL('../runtime/guest-images.json',import.meta.url),'utf8'));
async function until(check,timeout=1500){const end=Date.now()+timeout;while(!check()){if(Date.now()>end)throw Error('fixture_timeout');await delay(5);}}
async function fixture(options={}){
 const directory=await mkdtemp(join(tmpdir(),'adr-provider-lifecycle-'));
 const state={created:0,touches:0,removes:0,stops:[],sockets:[],requests:[],configuration:null,run:null,rejectClaim:false,touchFail:0,touchFailures:0,touchRecoveries:0,removeFail:false,leaseMs:25000,renewFailure:null,statusGate:null,activeStatus:0,maximumStatus:0};
 const node={id:randomUUID(),name:'Synthetic provider',model:'synthetic',endpoint:'http://127.0.0.1:9999/inference',supplyClass:'self_hosted',availability:'hot',status:'published',listingId:randomUUID(),listingRevision:1,installationId:randomUUID()};
 if(options.native){const models=piCatalog.providers.find(p=>p.id==='deepseek').models.filter(m=>['deepseek-flash','deepseek-v4-pro'].includes(m.id));Object.assign(node,{connectorProtocol:'pi_native_v1',provider:'deepseek',fields:{},endpoint:models[0].baseUrl,model:models[0].id,models:models.map(m=>m.id),nativeModels:models.map(m=>({model:m.id,api:m.api,endpoint:m.baseUrl})),maxOutputTokens:512,nativeChecks:{},status:'draft'});}
 const control=async(path,body)=>{const url=new URL(path,state.configuration.control);url.hostname='127.0.0.1';const response=await fetch(url,{method:body===undefined?'GET':'POST',headers:{authorization:'Bearer '+state.configuration.capability},body:body===undefined?undefined:JSON.stringify(body)});assert.equal(response.status,200);return response.json();};
 const runtime={owned:new Set(),verify:async()=>{},create:async function(o){state.created++;state.configuration=JSON.parse(await readFile(join(o.copyDirectory,'config.json'),'utf8'));const name='adrnew-'+randomUUID();runtime.owned.add(name);return name;},inspect:async()=>({config:{manifest_digest:images.node['linux-'+process.arch],mounts:[],network:{policy:{default_egress:'deny'}}}}),run:async()=>control('/ready',{ready:true}),touch:async()=>{state.touches++;if(state.touches>1&&state.touchFail){state.touchFail--;state.touchFailures++;throw Object.assign(Error('synthetic private marker'),{code:'runtime_command_failed',exitCode:9});}if(state.touchFailures)state.touchRecoveries++;},remove:async name=>{state.removes++;if(state.removeFail)throw Object.assign(Error('synthetic private marker'),{code:'runtime_cleanup_failed'});runtime.owned.delete(name);}};
 class Socket extends EventTarget{
  static OPEN=1;static CONNECTING=0;readyState=0;
  constructor(){super();state.sockets.push(this);setTimeout(()=>{if(this.readyState!==0)return;this.readyState=1;this.dispatchEvent(new Event('open'));},2);}
  frame(value){this.dispatchEvent(new MessageEvent('message',{data:JSON.stringify(value)}));}
  send(value){const frame=JSON.parse(value);if(frame.type==='authenticate')setTimeout(()=>{if(this.readyState===1){node.ready=state.backendReady!==false;this.frame({type:'ready',providerRunId:state.run,relayGeneration:state.sockets.indexOf(this)+1,leaseUntil:Date.now()+state.leaseMs});}},2);}
  close(){if(this.readyState===3)return;this.readyState=3;this.dispatchEvent(new Event('close'));}
 }
 const network={origin:'http://127.0.0.1:8790',request:async(path,o={})=>{
  state.requests.push({path,body:o.body});
  if(path==='/v2/network/config')return {capabilities:['single_request_setup_v1']};
  if(path.endsWith('?view=diagnostics'))return node;
  const lost=()=>{throw Object.assign(Error('private body'),{code:'network_unavailable_outcome_unknown'});};
  if(path.endsWith('/prepare')){state.run=o.body.providerRunId;node.providerRunId=state.run;return {providerRunId:state.run};}
  if(path.endsWith('/pi-checks')){if(state.reserveError)throw Object.assign(Error('private marker'),state.reserveError);const check={...o.body,id:randomUUID(),state:'dispatched',deadline:Date.now()+(state.checkTimeout??3000),outputBound:512,inputBound:8192,upstreamReserved:'1000000',rates:{inputMicrousdPerMillion:'1',outputMicrousdPerMillion:'1'}};node.nativeChecks[check.id]=check;if(state.lose==='reserve')lost();return check;}
  if(path.endsWith('/pi-checks/complete')){if(state.reportError)throw Object.assign(Error('private marker'),state.reportError);Object.assign(node.nativeChecks[o.body.id],{state:'settled',passed:o.body.tools&&o.body.completed,reportDigest:reportDigest(o.body),installationId:node.installationId,providerRunId:state.run});if(state.lose==='complete')lost();return {passed:true};}
  if(path.endsWith('/publish')){node.status='published';node.listingIds=[node.listingId];if(state.lose==='publish')lost();return node;}
  if(path.endsWith('/pi-checks/teardown')){for(const id of o.body.attemptIds)node.nativeChecks[id].executionReleasedAt=Date.now();return {financialLiabilities:'preserved'};}
  if(path.endsWith('/'+node.id)&&state.pollFailure)throw Object.assign(Error('private body'),{code:'network_unavailable_outcome_unknown'});

  if(path.endsWith('/stop')){state.stops.push(o.body);return {...node,status:'paused'};}
  if(path.endsWith('/relay-ticket')){if(state.rejectClaim)throw Object.assign(Error('synthetic'),{code:'node_already_connected',status:409});if(state.renewFailure){const failure=state.renewFailure;state.renewFailure=null;throw Object.assign(Error('synthetic'),failure);}state.run=o.body.providerRunId;node.providerRunId=state.run;return {ticket:'t'.repeat(43),providerRunId:state.run,reauthenticateSeconds:10};}
  if(state.statusGate&&path.endsWith('/'+node.id)){state.activeStatus++;state.maximumStatus=Math.max(state.maximumStatus,state.activeStatus);try{await state.statusGate;}finally{state.activeStatus--;}}
  return node;
 }};
 let controller;
 return {state,node,runtime,control,directory,start:async()=>{controller=await startProvider(network,node.id,{noKey:true,prepareOnly:!!options.native,runtime,Socket,diagnosticsDirectory:directory,intervals:{status:100000,renewal:100000,guestPollWindow:100000,reconnectInitial:5,reconnectCap:20,...options}});if(!options.native)await until(()=>controller.status.relayReady);return controller;},close:async()=>{state.removeFail=false;await controller?.stop();if(controller?.status.cleanupRequired)await controller.retryCleanup();runtime.owned.clear();await rm(directory,{recursive:true,force:true});}};
}
test('relay close reconnects the same healthy VM; delayed old ready/close events are ignored',async()=>{
 const f=await fixture();try{
  const controller=await f.start(),old=f.state.sockets[0],run=controller.status.providerRunId;old.close();
  await until(()=>f.state.sockets.length===2&&controller.status.relayReady);
  old.frame({type:'ready',providerRunId:run,relayGeneration:999,leaseUntil:Date.now()+25000});old.dispatchEvent(new Event('close'));
  assert.equal(controller.status.stopped,false);assert.equal(controller.status.relayGeneration,2);assert.equal(f.state.created,1);assert.equal(f.state.stops.length,0);
  const outcome=await controller.stop();assert.equal(outcome.status,'stopped');assert.deepEqual(f.state.stops,[{scope:'run',providerRunId:run,trigger:'operator_stop'}]);
 }finally{await f.close();}
});
test('explicit local acceptance signal reconnects only the idle current relay',async()=>{
 const previous=process.env.ADR_ACCEPTANCE_RELAY_RECONNECT;process.env.ADR_ACCEPTANCE_RELAY_RECONNECT='1';const f=await fixture();
 try{const c=await f.start(),run=c.status.providerRunId;process.emit('SIGURG');await until(()=>f.state.sockets.length===2&&c.status.relayReady);assert.equal(c.status.providerRunId,run);assert.equal(f.state.created,1);assert.equal(f.state.removes,0);assert.equal(f.state.stops.length,0);assert.equal(c.status.calls,0);}
 finally{if(previous===undefined)delete process.env.ADR_ACCEPTANCE_RELAY_RECONNECT;else process.env.ADR_ACCEPTANCE_RELAY_RECONNECT=previous;await f.close();}
});
test('duplicate claim fails before VM allocation and makes no node stop request',async()=>{
 const f=await fixture();f.state.rejectClaim=true;try{await assert.rejects(f.start(),{code:'node_already_connected'});assert.equal(f.state.created,0);assert.equal(f.state.stops.length,0);}finally{await f.close();}
});
test('one failed VM touch retries and preserves its first error without stopping the provider',async()=>{
 const f=await fixture({keepalive:15,touchRetry:5,idleWindow:150});try{const controller=await f.start();f.state.touchFail=1;await until(()=>f.state.touchFailures===1&&f.state.touchRecoveries>=1);assert.equal(controller.status.stopped,false);assert.equal(f.state.stops.length,0);assert.equal(controller.status.firstFailure.code,'runtime_command_failed');assert.equal(controller.status.firstFailure.phase,'keepalive');}finally{await f.close();}
});
test('persistent keepalive failure preserves its first error across failed teardown and repeated stop',async()=>{
 const f=await fixture({keepalive:10,touchRetry:5,idleWindow:70});try{
  const controller=await f.start();f.state.touchFail=100;f.state.removeFail=true;
  const outcome=await Promise.race([controller.done,delay(2000).then(()=>{throw Error('fixture_timeout');})]);
  assert.equal(outcome.status,'cleanup_required');assert.equal(outcome.firstFailure.code,'runtime_command_failed');assert.equal(outcome.stopTrigger.trigger,'keepalive_failed');assert.ok(outcome.outcomes.some(o=>o.phase==='guest_removal'&&o.code==='runtime_cleanup_failed'));
  assert.deepEqual(await controller.stop(),outcome);assert.equal(f.state.stops.length,1);
  const diagnostics=await readFile(controller.lifecycle.path,'utf8');assert.equal(diagnostics.includes('synthetic private marker'),false);assert.equal(JSON.parse(diagnostics).firstFailure.code,'runtime_command_failed');assert.equal((await lstat(controller.lifecycle.path)).mode&0o777,0o600);
 }finally{await f.close();}
});
test('lease expiry reconnects without node stop or VM replacement',async()=>{
 const f=await fixture();f.state.leaseMs=40;try{const controller=await f.start();await until(()=>f.state.sockets.length>=2&&controller.status.relayGeneration>=2);assert.equal(controller.status.stopped,false);assert.equal(f.state.created,1);assert.equal(f.state.stops.length,0);}finally{await f.close();}
});
test('request cancel is bound to one request and waits for guest acknowledgement without node stop',async()=>{
 const f=await fixture();try{
  const controller=await f.start(),socket=f.state.sockets[0];
  const frame={type:'inference',sessionId:randomUUID(),requestId:randomUUID(),bindingRevision:f.node.listingId,sequence:1,deadlineUnixMs:Date.now()+30000,messages:[{role:'user',content:'synthetic'}],maxOutputTokens:1024,upstreamBudget:{reservedMicrousd:'1',inputBound:10,tariffVersion:'synthetic',inputMicrousdPerMillion:'1',outputMicrousdPerMillion:'1'},tools:[]};
  socket.frame(frame);await until(()=>controller.status.calls===1);assert.equal((await f.control('/work')).requestId,frame.requestId);
  socket.frame({type:'cancel',requestId:frame.requestId,sessionId:frame.sessionId,bindingRevision:frame.bindingRevision,sequence:frame.sequence});
  const cancellation=await f.control('/work');assert.equal(cancellation.type,'cancel');assert.equal(cancellation.requestId,frame.requestId);
  assert.equal(controller.status.stopped,false);assert.equal(f.state.stops.length,0);await f.control('/cancelled',{requestId:frame.requestId});
  socket.frame({...frame,requestId:randomUUID(),sequence:2});await until(()=>controller.status.calls===2);assert.equal(controller.status.stopped,false);
 }finally{await f.close();}
});
test('provider status never presents stopped or unverified cleanup as a ready VM',()=>{
 const status={stopped:false,guestReady:true,relayReady:true,relayLeaseUntil:100,backendConfirmedAt:1,firstFailure:null};assert.ok(providerStatusLines(status,1).includes('Backend: Hot · ready'));
 assert.ok(providerStatusLines({...status,relayReady:false,firstFailure:{code:'relay_disconnected'}},1).includes('Backend: reconnecting'));
 const stopped=providerStatusLines({...status,stopped:true,teardownVerified:true,stopTrigger:{trigger:'keepalive_failed'}},1);assert.ok(stopped.includes('VM: not running'));assert.ok(stopped.includes('Backend: offline'));assert.equal(stopped.includes('VM: ready'),false);
 assert.ok(providerStatusLines({...status,stopped:true,teardownVerified:false},1).includes('VM: teardown unverified'));
});
test('slow status and temporary renewal contention do not starve VM keepalive or reconnect',async()=>{
 const f=await fixture({status:10,renewal:15,keepalive:10});let release;
 try{
  const controller=await f.start();f.state.statusGate=new Promise(r=>{release=r;});f.state.renewFailure={code:'auth_state_busy'};
  await until(()=>f.state.sockets.length>=2&&controller.status.relayReady&&f.state.touches>=4);
  assert.equal(f.state.maximumStatus,1);assert.equal(controller.status.stopped,false);assert.equal(f.state.stops.length,0);assert.equal(f.state.created,1);
  assert.equal(controller.status.firstFailure.code,'auth_state_busy');release();f.state.statusGate=null;
 }finally{release?.();await f.close();}
});
test('definitive authentication rejection stops only the claimed run and records its cause',async()=>{
 const f=await fixture({renewal:10});try{const controller=await f.start();f.state.renewFailure={code:'invalid_access_token',status:401};const result=await controller.done;assert.equal(result.firstFailure.code,'invalid_access_token');assert.equal(result.stopTrigger.trigger,'relay_auth_failed');assert.equal(f.state.stops.length,1);assert.equal(f.state.stops[0].scope,'run');assert.equal(f.state.stops[0].providerRunId,controller.status.providerRunId);}finally{await f.close();}
});
test('existing terminal page repaints after internal stop without operator navigation',async()=>{
 const input=new PassThrough(),output=new PassThrough();input.isTTY=true;input.setRawMode=v=>{input.isRaw=v;};output.isTTY=true;output.columns=80;output.rows=24;
 const ui=new TerminalUI({input,output,color:false});let status={stopped:false,guestReady:true,relayReady:true,relayLeaseUntil:Date.now()+25000};ui.start();
 try{const page=ui.page(()=>status.stopped?'Provider operation stopped':'Provider operation started',()=>providerStatusLines(status));assert.equal(ui.screen.title,'Provider operation started');
  status={...status,stopped:true,guestReady:false,relayReady:false,teardownVerified:true};ui.pending.redraw();assert.equal(ui.screen.title,'Provider operation stopped');assert.ok(ui.screen.lines.includes('VM: not running'));assert.equal(ui.screen.lines.includes('VM: ready'),false);
  input.write('\r');await page;
 }finally{ui.stop();}
});

test('provider correlates validated timing and failure only for the pending request',async()=>{
 const f=await fixture();try{
  const controller=await f.start(),socket=f.state.sockets[0];
  const base={type:'inference',sessionId:randomUUID(),bindingRevision:f.node.listingId,deadlineUnixMs:Date.now()+30000,messages:[{role:'user',content:'synthetic private marker'}],maxOutputTokens:1024,upstreamBudget:{reservedMicrousd:'1',inputBound:10,tariffVersion:'synthetic',inputMicrousdPerMillion:'1',outputMicrousdPerMillion:'1'},tools:[]};
  for(const [index,statusCode] of [401,403,null].entries()){
   const requestId=randomUUID();socket.frame({...base,requestId,sequence:index+1});await until(()=>controller.status.calls===index+1);await f.control('/work');
   if(statusCode!==null)await f.control('/timing',{requestId,phase:'upstream',outcome:'unknown',statusCode,headersMs:1,totalMs:2});
   await f.control('/failed',{scope:'request',requestId,code:'upstream_authentication_failed',message:'synthetic private marker'});
   const failure=controller.status.lastUpstreamFailure;
   assert.deepEqual(Object.keys(failure).sort(),['code','observedAt','requestId','statusCode']);assert.equal(failure.requestId,requestId);assert.equal(failure.statusCode,statusCode);
   assert.ok(Number.isSafeInteger(failure.observedAt));assert.equal(JSON.stringify(failure).includes('synthetic private marker'),false);
   const display=providerStatusLines(controller.status).join('\n');assert.match(display,new RegExp('HTTP '+(statusCode??'unavailable')));assert.doesNotMatch(display,/expired key|synthetic private marker/);
   await assert.rejects(f.control('/timing',{requestId,phase:'upstream',outcome:'unknown',statusCode:200,headersMs:1,totalMs:2}));assert.deepEqual(controller.status.lastUpstreamFailure,failure);
  }
  const persisted=await readFile(controller.lifecycle.path,'utf8');assert.equal(persisted.includes('lastUpstreamFailure'),false);assert.equal(persisted.includes('synthetic private marker'),false);assert.equal(controller.status.stopped,false);
 }finally{await f.close();}
});

async function completeCheck(f,frame) {
 const toolCalls=['tool','setup_probe'].includes(frame.qualification)?[{id:'probe',function:{name:'adr_setup_probe',arguments:'{"value":"ready"}'}}]:[];
 await f.control('/result',{type:'result',requestId:frame.requestId,text:'ready',toolCalls,nativeUsage:{input:10,output:2,cacheRead:0,cacheWrite:0,reasoning:null},nativeMessage:{role:'assistant',content:[],stopReason:toolCalls.length?'toolUse':'stop',timestamp:0}});
}
async function nextCheck(f) {let frame;await until(()=>!!(frame=f.state.requests.findLast(r=>r.path.endsWith('/pi-checks'))));let work;for(let i=0;i<100;i++){work=await f.control('/work');if(work?.type==='qualification')return work;await delay(5);}throw Error('qualification_not_dispatched');}
for(const lost of ['reserve','publish'])test(`lost ${lost} response inspects checks and never repeats inference or releases liability`,async()=>{
 const f=await fixture({native:true});try{
  f.state.lose=lost;const c=await f.start();assert.equal(f.state.requests.filter(r=>r.path.endsWith('/pi-checks')).length,0);
  const start=c.start();const rejected=assert.rejects(start,{code:'network_unavailable_outcome_unknown'});
  if(lost!=='reserve')for(let i=0;i<(lost==='complete'?1:2);i++)await completeCheck(f,await nextCheck(f));
  await rejected;const q=c.status.qualification;
  assert.equal(c.status.stopped,true);assert.equal(c.status.teardownVerified,true);assert.equal(c.status.recoveryPending,false);
  assert.equal(f.state.requests.filter(r=>r.path.endsWith('/pi-checks')).length,lost==='publish'?2:1);
  assert.equal(q[0].status,lost==='reserve'?'unknown':'passed');
  await assert.rejects(c.start(),{code:'pi_provider_not_prepared'});
  assert.ok(f.state.requests.some(r=>r.path.endsWith('/pi-checks/teardown')));
  assert.equal(Object.values(f.node.nativeChecks).filter(c=>c.state==='dispatched').length,lost==='reserve'?1:0);
  assert.equal(JSON.stringify(c.status).includes('private body'),false);
 }finally{await f.close();}
});
test('Pro failure survives cleanup with HTTP, phase, model and run/check identifiers',async()=>{
 const f=await fixture({native:true});try{
  const c=await f.start(),start=c.start(),rejected=assert.rejects(start,{code:'upstream_parameter_rejected'});
  for(let i=0;i<1;i++)await completeCheck(f,await nextCheck(f));
  const frame=await nextCheck(f);assert.equal(frame.model,'deepseek-v4-pro');
  f.state.removeFail=true;
  await f.control('/failed',{scope:'request',requestId:frame.requestId,code:'upstream_parameter_rejected',statusCode:400,body:'private body'});
  await rejected;const d=c.status.setupFailure;
  assert.equal(d.model,'deepseek-v4-pro');assert.equal(d.statusCode,400);assert.equal(d.phase,'qualification_setup_probe');assert.equal(d.requestId,frame.requestId);assert.equal(d.providerRunId,c.status.providerRunId);
  assert.equal(c.status.state,'cleanup_required');assert.equal(providerCanLaunch(c),false);
  assert.equal(c.status.qualification.filter(q=>q.status==='passed').length,1);
  const persisted=JSON.parse(await readFile(c.lifecycle.path,'utf8'));assert.equal(persisted.firstFailure.statusCode,400);assert.equal(persisted.firstFailure.model,d.model);
  f.state.removeFail=false;await c.retryCleanup();assert.equal(providerCanLaunch(c),true);assert.equal(f.state.created,1);
  assert.equal(f.node.nativeChecks[frame.requestId].state,'dispatched');
 }finally{await f.close();}
});
test('qualification timeout preserves the original cause before teardown',async()=>{
 const f=await fixture({native:true});try{const c=await f.start();f.state.checkTimeout=30;await assert.rejects(c.start(),{code:'upstream_timeout'});assert.equal(c.status.setupFailure.kind,'timeout');assert.equal(c.status.stopTrigger.trigger,'setup_timeout');assert.equal(f.state.requests.filter(r=>r.path.endsWith('/pi-checks')).length,1);}finally{await f.close();}
});
test('relay acknowledgement needs fresh backend confirmation; failed poll clears serving',async()=>{
 const f=await fixture({status:15});f.state.backendReady=false;try{const c=await f.start();assert.notEqual(c.status.state,'serving');f.node.ready=true;await until(()=>c.status.state==='serving');f.state.pollFailure=true;await until(()=>c.status.state==='reconnecting');assert.equal(c.status.backendConfirmedAt,null);assert.equal(c.status.stopped,false);}finally{await f.close();}
});

test('cancelling qualification records cancellation and cannot dispatch a later model',async()=>{
 const f=await fixture({native:true});try{const c=await f.start(),start=c.start();const rejected=assert.rejects(start,{code:'cancelled'});await nextCheck(f);await c.stop({trigger:'setup_cancelled'});await rejected;assert.equal(c.status.setupFailure.kind,'cancelled');assert.equal(f.state.requests.filter(r=>r.path.endsWith('/pi-checks')).length,1);assert.equal(c.status.qualification.filter(q=>q.status==='pending').length,1);}finally{await f.close();}
});

test('lost completion acknowledgement confirms the saved report without another model request',async()=>{
 const f=await fixture({native:true});try{f.state.lose='complete';const c=await f.start(),started=c.start();for(let i=0;i<2;i++)await completeCheck(f,await nextCheck(f));await started;assert.equal(f.state.requests.filter(r=>r.path.endsWith('/pi-checks')).length,2);assert.equal(f.state.requests.filter(r=>r.path.endsWith('/pi-checks/complete')).length,2);assert.equal(c.status.publication,'published');assert.equal(c.status.qualification.every(q=>q.status==='passed'),true);await c.stop();}finally{await f.close();}
});

test('failed-stream usage is saved before a lost report acknowledgement and never repeats inference',async()=>{
 const f=await fixture({native:true});try{f.state.lose='complete';const c=await f.start(),started=c.start();const rejected=assert.rejects(started,{code:'upstream_malformed_response'});const frame=await nextCheck(f);await f.control('/usage',{requestId:frame.requestId,nativeUsage:{input:10,output:2,cacheRead:0,cacheWrite:0,reasoning:null}});await f.control('/failed',{scope:'request',requestId:frame.requestId,code:'upstream_malformed_response'});await rejected;const report=JSON.parse(await readFile(join(c.lifecycle.path.slice(0,-'lifecycle.json'.length),'report-'+frame.requestId+'.json'),'utf8'));assert.equal(report.delivery,'confirmed');assert.equal(report.payload.tools,false);assert.equal(report.payload.completed,false);assert.equal(f.state.requests.filter(r=>r.path.endsWith('/pi-checks')).length,1);assert.equal(c.status.stopped,true);}finally{await f.close();}
});

for(const error of [{code:'pi_check_not_allowed',status:409},{code:'network_unavailable_outcome_unknown'}])test(`reservation ${error.code} is Router control before model dispatch`,async()=>{
 const f=await fixture({native:true});try{f.state.reserveError=error;const c=await f.start();await assert.rejects(c.start(),{code:error.code});assert.equal(c.status.setupFailure.operation,'setup_reserve');assert.equal(c.status.setupFailure.provenance,'router_control');assert.equal(c.status.setupFailure.requestEvidence,'not_sent');assert.equal(c.status.setupFailure.statusCode,error.status??null);assert.equal(f.state.requests.filter(r=>r.path.endsWith('/pi-checks')).length,1);assert.equal(c.status.publication,'not_published');}finally{await f.close();}
});
for(const reportingFails of [false,true])test(`invalid probe stays primary when reporting ${reportingFails?'fails':'succeeds'}`,async()=>{
 const f=await fixture({native:true});try{if(reportingFails)f.state.reportError={code:'installation_revoked',status:401};const c=await f.start(),started=c.start(),rejected=assert.rejects(started,{code:'setup_probe_invalid_arguments'}),frame=await nextCheck(f);
 await f.control('/timing',{requestId:frame.requestId,phase:'upstream',outcome:'succeeded',statusCode:200,headersMs:1,totalMs:7});
 await f.control('/result',{type:'result',requestId:frame.requestId,text:'private response marker',toolCalls:[{function:{name:'adr_setup_probe',arguments:'{"value":4}'}}],nativeUsage:{input:10,output:2,cacheRead:0,cacheWrite:0,reasoning:null},nativeMessage:{stopReason:'toolUse'}});
 await rejected;assert.equal(c.status.setupFailure.operation,'setup_response_validate');assert.equal(c.status.setupFailure.elapsedMs,7);assert.equal(c.status.setupFailure.statusCode,200);assert.equal(c.status.setupFailure.requestEvidence,'response_received');assert.equal(f.state.requests.filter(r=>r.path.endsWith('/pi-checks')).length,1);assert.equal(c.status.publication,'not_published');
 const saved=JSON.parse(await readFile(c.lifecycle.path));assert.equal(saved.terminalFailure.code,'setup_probe_invalid_arguments');assert.equal(saved.secondaryFailures.length,reportingFails?1:0);if(reportingFails){assert.equal(saved.secondaryFailures[0].operation,'setup_report_submit');assert.equal(saved.secondaryFailures[0].statusCode,401);}assert.doesNotMatch(JSON.stringify(saved),/private response marker/);
 }finally{await f.close();}
});
test('local report-save failure is storage and retains the received model evidence',async()=>{
 const {ProviderReports}=await import('../src/provider-reports.mjs');const save=ProviderReports.prototype.save;const f=await fixture({native:true});
 try{const c=await f.start();ProviderReports.prototype.save=async()=>{throw Object.assign(Error('private marker'),{code:'ENOSPC'});};const started=c.start(),rejected=assert.rejects(started,{code:'completion_report_save_failed'});await completeCheck(f,await nextCheck(f));await rejected;assert.equal(c.status.setupFailure.operation,'setup_report_save');assert.equal(c.status.setupFailure.provenance,'local_storage');assert.equal(c.status.setupFailure.requestEvidence,'response_received');assert.equal(c.status.publication,'not_published');assert.equal(f.state.requests.filter(r=>r.path.endsWith('/pi-checks/complete')).length,0);}finally{ProviderReports.prototype.save=save;await f.close();}
});

test('missing diagnostic negotiation retains legacy failure frames and richer local cause',async()=>{
 const f=await fixture();try{
  const controller=await f.start();await until(()=>controller.status.relayReady);const socket=f.state.sockets.at(-1),send=socket.send.bind(socket),frames=[];socket.send=value=>{const frame=JSON.parse(value);if(frame.type==='request_failed')frames.push(frame);return send(value);};
  const requestId=randomUUID();socket.frame({type:'inference',sessionId:randomUUID(),requestId,bindingRevision:f.node.listingId,sequence:1,deadlineUnixMs:Date.now()+30000,messages:[{role:'user',content:'synthetic'}],maxOutputTokens:1024,upstreamBudget:{reservedMicrousd:'1',inputBound:10,tariffVersion:'synthetic',inputMicrousdPerMillion:'1',outputMicrousdPerMillion:'1'},tools:[]});await until(()=>controller.status.calls===1);await f.control('/work');await f.control('/failed',{scope:'request',requestId,code:'pi_request_limit'});
  assert.equal(frames.length,1);assert.equal(frames[0].code,'provider_outcome_unknown');assert.equal('failureDiagnostic' in frames[0],false);assert.equal(controller.status.terminalFailure.code,'pi_request_limit');assert.equal(controller.status.terminalFailure.requestId,requestId);assert.equal(controller.status.terminalFailure.requestEvidence,'outcome_unknown');
 }finally{await f.close();}
});
