import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdtemp, readFile, rm, lstat } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { setTimeout as delay } from 'node:timers/promises';
import { startProvider } from '../src/provider.mjs';
import { providerStatusLines } from '../src/tui.mjs';
import { TerminalUI } from '../src/tui-screen.mjs';
import { PassThrough } from 'node:stream';

const images=JSON.parse(await readFile(new URL('../runtime/guest-images.json',import.meta.url),'utf8'));
async function until(check,timeout=1500){const end=Date.now()+timeout;while(!check()){if(Date.now()>end)throw Error('fixture_timeout');await delay(5);}}
async function fixture(options={}){
 const directory=await mkdtemp(join(tmpdir(),'adr-provider-lifecycle-'));
 const state={created:0,touches:0,removes:0,stops:[],sockets:[],requests:[],configuration:null,run:null,rejectClaim:false,touchFail:0,touchFailures:0,touchRecoveries:0,removeFail:false,leaseMs:25000,renewFailure:null,statusGate:null,activeStatus:0,maximumStatus:0};
 const node={id:randomUUID(),name:'Synthetic provider',model:'synthetic',endpoint:'http://127.0.0.1:9999/inference',supplyClass:'self_hosted',availability:'hot',status:'published',listingId:randomUUID(),listingRevision:1,installationId:'synthetic-provider'};
 const control=async(path,body)=>{const url=new URL(path,state.configuration.control);url.hostname='127.0.0.1';const response=await fetch(url,{method:body===undefined?'GET':'POST',headers:{authorization:'Bearer '+state.configuration.capability},body:body===undefined?undefined:JSON.stringify(body)});assert.equal(response.status,200);return response.json();};
 const runtime={owned:new Set(),verify:async()=>{},create:async function(o){state.created++;state.configuration=JSON.parse(await readFile(join(o.copyDirectory,'config.json'),'utf8'));const name='adrnew-'+randomUUID();runtime.owned.add(name);return name;},inspect:async()=>({config:{manifest_digest:images.node['linux-'+process.arch],mounts:[],network:{policy:{default_egress:'deny'}}}}),run:async()=>control('/ready',{ready:true}),touch:async()=>{state.touches++;if(state.touches>1&&state.touchFail){state.touchFail--;state.touchFailures++;throw Object.assign(Error('synthetic private marker'),{code:'runtime_command_failed',exitCode:9});}if(state.touchFailures)state.touchRecoveries++;},remove:async name=>{state.removes++;if(state.removeFail)throw Object.assign(Error('synthetic private marker'),{code:'runtime_cleanup_failed'});runtime.owned.delete(name);}};
 class Socket extends EventTarget{
  static OPEN=1;static CONNECTING=0;readyState=0;
  constructor(){super();state.sockets.push(this);setTimeout(()=>{if(this.readyState!==0)return;this.readyState=1;this.dispatchEvent(new Event('open'));},2);}
  frame(value){this.dispatchEvent(new MessageEvent('message',{data:JSON.stringify(value)}));}
  send(value){const frame=JSON.parse(value);if(frame.type==='authenticate')setTimeout(()=>{if(this.readyState===1)this.frame({type:'ready',providerRunId:state.run,relayGeneration:state.sockets.indexOf(this)+1,leaseUntil:Date.now()+state.leaseMs});},2);}
  close(){if(this.readyState===3)return;this.readyState=3;this.dispatchEvent(new Event('close'));}
 }
 const network={origin:'http://127.0.0.1:8790',request:async(path,o={})=>{
  state.requests.push({path,body:o.body});
  if(path.endsWith('/stop')){state.stops.push(o.body);return {...node,status:'paused'};}
  if(path.endsWith('/relay-ticket')){if(state.rejectClaim)throw Object.assign(Error('synthetic'),{code:'node_already_connected',status:409});if(state.renewFailure){const failure=state.renewFailure;state.renewFailure=null;throw Object.assign(Error('synthetic'),failure);}state.run=o.body.providerRunId;node.providerRunId=state.run;return {ticket:'t'.repeat(43),providerRunId:state.run,reauthenticateSeconds:10};}
  if(state.statusGate&&path.endsWith('/'+node.id)){state.activeStatus++;state.maximumStatus=Math.max(state.maximumStatus,state.activeStatus);try{await state.statusGate;}finally{state.activeStatus--;}}
  return node;
 }};
 let controller;
 return {state,node,runtime,control,directory,start:async()=>{controller=await startProvider(network,node.id,{noKey:true,runtime,Socket,diagnosticsDirectory:directory,intervals:{status:100000,renewal:100000,guestPollWindow:100000,reconnectInitial:5,reconnectCap:20,...options}});await until(()=>controller.status.relayReady);return controller;},close:async()=>{await controller?.stop();runtime.owned.clear();await rm(directory,{recursive:true,force:true});}};
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
 const status={stopped:false,guestReady:true,relayReady:true,relayLeaseUntil:100,firstFailure:null};assert.ok(providerStatusLines(status,1).includes('Backend: Hot · ready'));
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
