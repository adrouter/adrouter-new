import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { runTui, providerStatusLines } from '../src/tui.mjs';
import {providerCatalog} from '../src/generated/provider-catalog.mjs';
import { providerCanLaunch, providerDiagnostic } from '../src/provider-diagnostics.mjs';
import { ProviderActivityMonitor, providerActivityLines } from '../src/provider-activity.mjs';
const config={protocol:'2.0.0',product:'adr-v2',settlement:'test_credits',cashValue:false,admissions:false,privateRehearsal:false,privateOwnerEvaluation:true,supplyClasses:['authorized_api','self_hosted'],connectorProfile:'inference_connector_v1',maxNodeSessions:1,relay:'wss_single_instance',agentExecution:'buyer_vm_v1',capabilities:['allowance_v1','provider_budget_v1','cold_activation_v1','pi_native_v1','pi_native_v2','pi_native_v3'],activationDeadlineSeconds:120};
async function flow(mode) {
 let homes=0,picks=0,prepared=0,starts=0,stops=0,management=0,redraws=0;const errors=[],controllers=[];
 const node={id:randomUUID(),name:'Synthetic connection',connectorProtocol:'pi_native_v3',provider:'deepseek',fields:{},connection:{kind:'builtin',headerNames:[],modelDefinitions:[]},nativeRevision:0,modelsConfirmed:false,totalTokens:'1000000',testCredits:'10000',inputRate:'1000',outputRate:'3000',status:'draft',availability:'hot',models:['deepseek-v4-pro'],maxOutputTokens:512,sharedAllowance:{totalTokens:'1000000',testCredits:'10000'}};
 const unavailable=mode==='unavailable'?providerCatalog.providers.find(p=>p.models.some(m=>m.unavailableReason)&&p.models.some(m=>!m.unavailableReason)):undefined;
 let unavailableStep=0;if(unavailable){node.provider=unavailable.id;node.models=[unavailable.models.find(m=>m.unavailableReason).id];}
 const ui={start(){},stop(){},pending:{redraw(){redraws++;}},task:(_t,fn)=>fn(new AbortController().signal,()=>{}),suspend:fn=>fn(),page:async(title,lines)=>{if(title==='Provider setup needs correction'||title==='Something needs attention')errors.push({title,lines});},
 menu:async(title,items)=>{
  if(title==='What would you like to do?')return ++homes===1?'create':'exit';
  if(title==='List compute · 1 of 3')return 'authorized_api';if(title==='Connection type')return 'builtin';if(title==='Choose provider')return node.provider;
  if(title==='Choose offered models')return picks++===0?'manual':'continue';
  if(title==='Choose models from prepared guest'){
   if(unavailable){const bad=items.find(i=>i.value===node.models[0]);if(unavailableStep++===0){assert.equal(bad.disabled,false);assert.equal(items.find(i=>i.value==='continue').disabled,true);return 'continue';}if(unavailableStep===2){assert.equal(starts,0);return bad.value;}if(unavailableStep===3)return unavailable.models.find(m=>!m.unavailableReason).id;return 'continue';}
   return items.find(i=>i.value==='deepseek-v4-pro')?.label.startsWith('[x]')?'continue':'deepseek-v4-pro';
  }
  if(title==='Review connection')return 'save';
  if(title==='Connection saved'){assert.equal(prepared,0);assert.equal(starts,0);assert.ok(items.some(i=>i.value==='continue'));return 'continue';}
  if(title==='Start provider')return mode==='back'||mode==='unavailable'?'back':'start';
  if(title==='Your listing is drafted'||title===node.name){
   management++;assert.ok(!items.some(i=>['thinking','launch','publish'].includes(i.value)));
   if(mode==='back'||mode==='unavailable'){assert.equal(starts,0);assert.equal(items.find(i=>i.value==='setup').disabled,false);return 'back';}
   if(management===1){assert.equal(items.find(i=>i.value==='setup').disabled,true);assert.equal(items.find(i=>i.value==='stop').disabled,false);assert.ok(items.some(i=>i.value==='status'));return 'stop';}
   if(mode==='cleanup'&&management===2){assert.equal(items.find(i=>i.value==='setup').disabled,true);assert.ok(items.some(i=>i.value==='cleanup'));return 'cleanup';}
   if(mode==='stale'&&management===2){assert.equal(items.find(i=>i.value==='setup').disabled,false);return 'setup';}
   if(mode==='stale'&&management===3){const before=redraws;controllers[0].complete();await Promise.resolve();assert.equal(redraws,before);assert.equal(items.find(i=>i.value==='setup').disabled,true);}
   return 'back';
  }
  return null;
 },form:async(title,fields)=>{
  assert.equal(fields.some(f=>f.name==='thinking'),false);
  if(title==='Manual model definition')return {id:'manual-model',contextWindow:'32768',maxTokens:'512',input:'1',output:'2',cacheRead:'1',cacheWrite:'1'};
  return Object.fromEntries(fields.map(f=>[f.name,f.default]));
 }};
 const network={local:true,origin:'http://127.0.0.1:8790',request:async(path,options={})=>{
  if(path.endsWith('/network/config'))return config;
  if(path==='/v2/providers/nodes'&&options.method==='POST'){assert.equal(options.body.modelsConfirmed,false);return node;}
  if(path.endsWith('/budget'))return {remainingMicrousd:'1000000',outstandingMicrousd:'0'};
  if(path.endsWith('/activity'))throw Object.assign(Error('private error'),{code:'network_unavailable_outcome_unknown'});
  if(path.endsWith('/'+node.id))return node;throw Error('unexpected route '+path);
 }};
 const startProvider=async(_network,id,options)=>{
  prepared++;assert.equal(options.prepareOnly,true);let complete;const done=new Promise(r=>{complete=r;});
  const c={done,complete,configure:async configuration=>{Object.assign(node,configuration,{nativeRevision:node.nativeRevision+1});},status:{state:'preparing',guestReady:true,stopped:false,activation:[]},start:async()=>{starts++;c.status.state='reconnecting';},stop:async()=>{stops++;Object.assign(c.status,{stopped:true,state:mode==='cleanup'?'cleanup_required':'stopped',cleanupRequired:mode==='cleanup',teardownVerified:mode!=='cleanup'});},retryCleanup:async()=>{Object.assign(c.status,{state:'stopped',cleanupRequired:false,teardownVerified:true});}};controllers.push(c);return c;
 };
 await runTui({}, {network,ui,store:{profile:'provider'},startProvider});assert.equal(errors.length,0,JSON.stringify(errors));assert.ok(stops>=1);return {prepared,starts,controllers};
}
test('Save → Continue enters setup directly, and Back before Start performs no qualification',async()=>{const r=await flow('back');assert.equal(r.prepared,1);assert.equal(r.starts,0);});
test('prepared guest keeps unavailable selection removable and rejects Continue until corrected',async()=>{const r=await flow('unavailable');assert.equal(r.starts,0);assert.equal(r.prepared,1);});
test('saved connection editing removes unavailable selection before submitting replacement models',async()=>{
 const provider=providerCatalog.providers.find(p=>p.models.some(m=>m.unavailableReason)&&p.models.some(m=>!m.unavailableReason));
 const unavailable=provider.models.find(m=>m.unavailableReason),available=provider.models.find(m=>!m.unavailableReason);
 const node={id:randomUUID(),name:'Saved fixture',provider:provider.id,connectorProtocol:'pi_native_v3',status:'paused',models:[unavailable.id],fields:{},nativeRevision:3,modelsConfirmed:true,connection:{kind:'builtin',headerNames:[],modelDefinitions:[]},inputRate:'1000',outputRate:'3000',totalTokens:'1000000',testCredits:'10000',maxOutputTokens:4096};
 let homes=0,lists=0,management=0,step=0,saved;
 const ui={start(){},stop(){},task:(_title,fn)=>fn(new AbortController().signal),page:async title=>assert.notEqual(title,'Something needs attention'),form:async(_title,fields,draft)=>Object.fromEntries(fields.map(f=>[f.name,String(draft?.[f.name]??f.default??'')])),menu:async(title,items)=>{
  if(title==='What would you like to do?')return ++homes===1?'providers':'exit';
  if(title==='My provider listings')return ++lists===1?node.id:'back';if(title===node.name)return ++management===1?'editNative':'back';
  if(title==='Choose offered models'){step++;if(step===1){assert.equal(items.find(i=>i.value===unavailable.id).disabled,false);assert.equal(items.find(i=>i.value==='continue').disabled,true);return 'continue';}if(step===2){assert.equal(saved,undefined);return unavailable.id;}if(step===3)return available.id;return 'continue';}
  if(title==='Review connection')return 'save';if(title==='Save provider changes?')return true;if(title==='Connection saved')return 'back';return null;
 }};
 const network={local:true,origin:'http://127.0.0.1:8790',request:async(path,options={})=>{
  if(path.endsWith('/network/config'))return config;if(path==='/v2/providers/nodes')return [node];if(path.endsWith('/budget'))return {remainingMicrousd:'1000000',outstandingMicrousd:'0'};
  if(path.endsWith('/activity'))throw Object.assign(Error('synthetic'),{code:'network_unavailable_outcome_unknown'});
  if(path.endsWith('/native')){saved=options.body;assert.deepEqual(saved.models,[available.id]);assert.equal(saved.expectedRevision,3);Object.assign(node,saved);return node;}
  if(path.endsWith('/'+node.id))return node;throw Error('unexpected route');
 }};
 await runTui({}, {network,ui,store:{profile:'provider'}});assert.deepEqual(saved.models,[available.id]);assert.equal(step,4);
});
test('Pi reconnecting run exposes status and Stop while relaunch remains disabled',()=>flow('reconnecting'));
test('failed teardown stays visible and blocks relaunch until explicit recovery',()=>flow('cleanup'));
test('obsolete completion callback cannot affect replacement controller',async()=>{const r=await flow('stale');assert.equal(r.prepared,2);});
test('activity poll failure is safe and retains last successful time with unknown availability',async()=>{
 const value={nodeId:randomUUID(),at:Date.now(),providerRunId:null,runStartedAt:null,connectionUpdatedAt:null,connectionFresh:true,activeSessions:[],completedRequests:null,pendingRequests:0,inputTokens:null,outputTokens:null,totalsSince:null};let fail=false;
 const monitor=new ProviderActivityMonitor({request:async()=>{if(fail)throw Object.assign(Error('private body'),{code:'network_request_rejected',status:503});return value;}},randomUUID(),()=>{});
 try{await monitor.start();assert.equal(monitor.stale,false);const at=monitor.view().lastSuccessfulAt;fail=true;await monitor.poll();assert.equal(monitor.view().lastSuccessfulAt,at);assert.equal(monitor.view().failure.statusCode,503);assert.match(providerActivityLines(monitor.view()).join('\n'),/unknown availability/);assert.doesNotMatch(JSON.stringify(monitor.view()),/private body/);}finally{monitor.stop();}
});
test('readiness and launch require independent fresh confirmation and verified teardown',()=>{
 const status={state:'connecting',guestReady:true,relayReady:true,relayLeaseUntil:99999,publication:'published'};
 assert.ok(!providerStatusLines(status,10).includes('Backend: Hot · ready'));
 assert.ok(providerStatusLines({...status,backendConfirmedAt:5},10).includes('Backend: Hot · ready'));
 assert.ok(!providerStatusLines({...status,backendConfirmedAt:5},20000).includes('Backend: Hot · ready'));
 for(const s of [{stopped:true},{stopped:true,teardownVerified:false},{stopped:true,teardownVerified:true,cleanupRequired:true},{stopped:true,teardownVerified:true,recoveryPending:true}])assert.equal(providerCanLaunch({status:s}),false);
 const d=providerDiagnostic('qualification_tool',{code:'invalid message with key',status:400,body:'private body',headers:{authorization:'private key'}});assert.equal(d.code,'provider_control_failed');assert.equal(d.statusCode,400);assert.doesNotMatch(JSON.stringify(d),/private/);
});

test('non-JSON HTTP rejection keeps status without leaking its body or retrying',async()=>{
 const {Network}=await import('../src/network.mjs');let calls=0;const n=new Network({origin:'http://127.0.0.1:8790',local:true,fetcher:async()=>{calls++;return new Response('private upstream rejection',{status:502});}});
 await assert.rejects(n.request('/v2/providers/nodes'),e=>{assert.equal(e.status,502);assert.equal(e.code,'network_request_rejected');assert.doesNotMatch(e.message,/private/);return true;});assert.equal(calls,1);
});

test('control timeout remains distinct from user cancellation without retries',async()=>{
 const {Network}=await import('../src/network.mjs');
 for(const [reason,kind] of [[new DOMException('synthetic timeout','TimeoutError'),'timeout'],[new DOMException('synthetic cancel','AbortError'),'cancelled']]){
  const abort=new AbortController();abort.abort(reason);let calls=0;
  const n=new Network({origin:'http://127.0.0.1:8790',local:true,fetcher:async()=>{calls++;throw reason;}});
  await assert.rejects(n.request('/v2/providers/nodes',{signal:abort.signal}),e=>{assert.equal(providerDiagnostic('qualification_tool',e).kind,kind);return true;});assert.equal(calls,1);
 }
});

test('explicit custom model settings are preserved with endpoint-specific compatibility',async()=>{
 const {connectionCapabilities}=await import('../src/provider-models.mjs');
 const connection={kind:'custom',api:'openai-completions',baseUrl:'https://custom.example.test/v1',compat:{maxTokensField:'max_completion_tokens'},modelDefinitions:[{id:'manual-model',thinking:'optional'},{id:'deepseek-v4-pro',thinking:'none'},{id:'deepseek-flash',api:'anthropic-messages',thinking:'optional'}]};
 const normalized=connectionCapabilities('deepseek',connection);
 assert.deepEqual(normalized.modelDefinitions.map(m=>m.thinking),['optional','none','optional']);assert.deepEqual(normalized.compat,connection.compat);assert.equal(normalized.api,connection.api);assert.equal(normalized.baseUrl,connection.baseUrl);assert.equal(connection.modelDefinitions[0].thinking,'optional');
});

test('Custom API model metadata follows the exact endpoint even with an independent connection name',async()=>{
 const {catalogModelsForConnection}=await import('../src/tui.mjs');
 const models=catalogModelsForConnection('my-deepseek-api',{kind:'custom',baseUrl:'https://api.deepseek.com/',api:'openai-completions'});
 assert.ok(models.some(m=>m.id==='deepseek-flash'&&!m.unavailableReason));assert.ok(models.some(m=>m.id==='deepseek-v4-pro'&&!m.unavailableReason));
 assert.deepEqual(catalogModelsForConnection('deepseek',{kind:'custom',baseUrl:'https://unrelated.example.test/v1',api:'openai-completions'}),[]);
});
