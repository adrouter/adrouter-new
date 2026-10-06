import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {setTimeout as delay} from 'node:timers/promises';
import {piCatalog} from '../../src/generated/pi-catalog.mjs';
import {reportDigest} from '../../src/provider-reports.mjs';
import {pathToFileURL} from 'node:url';
const root=process.env.ADR_DIAGNOSTIC_CLIENT_ROOT;
const {startProvider}=await import(root?pathToFileURL(root+'/src/provider.mjs').href:new URL('../../src/provider.mjs',import.meta.url).href);
const images=JSON.parse(await readFile(new URL('../../runtime/guest-images.json',import.meta.url),'utf8'));
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
 return {state,node,runtime,control,directory,network,start:async()=>{controller=await startProvider(network,node.id,{noKey:true,prepareOnly:!!options.native,runtime,Socket,diagnosticsDirectory:directory,intervals:{status:100000,renewal:100000,guestPollWindow:100000,reconnectInitial:5,reconnectCap:20,...options}});if(!options.native)await until(()=>controller.status.relayReady);return controller;},close:async()=>{state.removeFail=false;await controller?.stop();if(controller?.status.cleanupRequired)await controller.retryCleanup();runtime.owned.clear();await rm(directory,{recursive:true,force:true});}};
}

export {fixture,until};
