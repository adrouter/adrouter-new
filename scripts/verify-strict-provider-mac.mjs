// Exact installed host + actual Mac VM, loopback synthetic upstream only.
import assert from 'node:assert/strict';
import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const root=process.env.ADR_ACCEPTANCE_CLIENT_ROOT;
if(!root||process.platform!=='darwin'||process.arch!=='arm64')throw Error('installed_macos_artifact_required');
const from=name=>pathToFileURL(join(root,'src',name)).href;
const {startProvider}=await import(from('provider.mjs'));
const {providerCatalog}=await import(from('generated/provider-catalog.mjs'));
const {reportDigest}=await import(from('provider-reports.mjs'));
const {SandboxRuntime}=await import(from('runtime.mjs'));
const paths=JSON.parse(await readFile(process.env.ADR_ACCEPTANCE_RUNTIME_PATHS,'utf8'));
for(const scenario of ['first_failure','lost_before_commit','lost_after_commit']) {
 const runtime=new SandboxRuntime(paths);await runtime.verify();
 const diagnosticsDirectory=await mkdtemp('/tmp/adr-strict-diag-');
 let modelRequests=0,reportRequests=0,reportLost=false,controller;
 const server=createServer(async(req,res)=>{
  let input='';for await(const chunk of req){input+=chunk;if(input.length>65536)throw Error('fixture_bound');}
  const body=JSON.parse(input);modelRequests++;
  if(scenario==='first_failure'){res.writeHead(400,{'content-type':'application/json'}).end(JSON.stringify({error:{message:'synthetic parameter rejection',type:'invalid_request_error'}}));return;}
  assert.equal(body.tools[0].function.name,'adr_setup_probe');
  res.writeHead(200,{'content-type':'text/event-stream'});
  const base={id:'synthetic',object:'chat.completion.chunk',model:body.model};
  res.write('data: '+JSON.stringify({...base,choices:[{index:0,delta:{role:'assistant',tool_calls:[{index:0,id:'probe',type:'function',function:{name:'adr_setup_probe',arguments:'{"value":"ready"}'}}]},finish_reason:null}]})+'\n\n');
  res.write('data: '+JSON.stringify({...base,choices:[{index:0,delta:{},finish_reason:'tool_calls'}]})+'\n\n');
  res.end('data: '+JSON.stringify({...base,choices:[],usage:{prompt_tokens:10,completion_tokens:2,total_tokens:12}})+'\n\ndata: [DONE]\n\n');
 });await new Promise(resolve=>server.listen(0,'127.0.0.1',resolve));
 const endpoint=`http://127.0.0.1:${server.address().port}/v1`,price={input:0,output:0,cacheRead:0,cacheWrite:0};
 const models=['fixture-first','fixture-second'];
 const node={id:randomUUID(),ownerId:randomUUID(),installationId:randomUUID(),name:'Strict synthetic setup',provider:'fixture',connectorProtocol:'pi_native_v3',catalogDigest:providerCatalog.digest,supplyClass:'self_hosted',availability:'hot',status:'draft',nativeRevision:0,modelsConfirmed:true,model:models[0],models,endpoint,maxOutputTokens:512,totalTokens:'100000',testCredits:'1000',inputRate:'1000',outputRate:'1000',fields:{},nativeChecks:{},connection:{kind:'custom',baseUrl:endpoint,api:'openai-completions',authentication:'none',headerNames:[],modelDefinitions:models.map(id=>({id,contextWindow:32768,maxTokens:512,cost:price,thinking:'none'}))},nativeModels:models.map(model=>({model,api:'openai-completions',provider:'fixture',endpoint,price,priceVersion:'connection_definition_v2',maxOutputTokens:512,contextWindowTokens:32768,capabilities:['coding_v1','streaming_v1','tools_v1'],defaultSettings:{reasoning:'off'},supportedSettings:{reasoning:['off']},nativeLimits:{contextWindowTokens:32768,maxOutputTokens:512},adapter:{kind:'pi',id:'pi:openai-completions'},compat:{}}))};
 class Socket extends EventTarget {static OPEN=1;static CONNECTING=0;readyState=0;constructor(){super();setTimeout(()=>{this.readyState=1;this.dispatchEvent(new Event('open'));},5);}send(){node.ready=true;node.leaseUntil=Date.now()+30000;this.dispatchEvent(new MessageEvent('message',{data:JSON.stringify({type:'ready',providerRunId:node.providerRunId,relayGeneration:1,leaseUntil:node.leaseUntil})}));}close(){this.readyState=3;this.dispatchEvent(new Event('close'));}}
 const network={local:true,origin:'http://127.0.0.1:9',request:async(path,o={})=>{
  if(path==='/v2/network/config')return {capabilities:['single_request_setup_v1']};
  if(path.endsWith('/me'))return {userId:node.ownerId};
  if(path.endsWith('/prepare')){node.providerRunId=o.body.providerRunId;return {providerRunId:node.providerRunId};}
  if(path.endsWith('/pi-checks')){assert.equal(o.body.phase,'setup_probe');const c={...o.body,id:randomUUID(),installationId:node.installationId,state:'dispatched',nativeRevision:0,deadline:Date.now()+120000,inputBound:8192,outputBound:512,upstreamReserved:'0',rates:{inputMicrousdPerMillion:'0',outputMicrousdPerMillion:'0'}};node.nativeChecks[c.id]=c;return c;}
  if(path.endsWith('/pi-checks/complete')){reportRequests++;if(!reportLost&&scenario==='lost_before_commit'){reportLost=true;throw Object.assign(Error('synthetic lost report'),{code:'network_unavailable_outcome_unknown'});}Object.assign(node.nativeChecks[o.body.id],{state:'settled',passed:o.body.tools&&o.body.completed,reportDigest:reportDigest(o.body)});if(!reportLost&&scenario==='lost_after_commit'){reportLost=true;throw Object.assign(Error('synthetic lost acknowledgement'),{code:'network_unavailable_outcome_unknown'});}return {passed:node.nativeChecks[o.body.id].passed};}
  if(path.endsWith('/publish')){node.status='published';node.listingIds=models.map(()=>randomUUID());node.listingRevision=1;return node;}
  if(path.endsWith('/relay-ticket'))return {providerRunId:node.providerRunId,ticket:'t'.repeat(43),reauthenticateSeconds:10};
  if(path.endsWith('/stop')){node.ready=false;node.status='paused';return node;}
  return node;
 }};
 try{
  controller=await startProvider(network,node.id,{prepareOnly:true,noKey:true,runtime,Socket,diagnosticsDirectory});
  if(scenario==='first_failure'){await assert.rejects(controller.start());assert.equal(modelRequests,1);assert.equal(controller.status.stopped,true);assert.equal(controller.status.teardownVerified,true);assert.equal(controller.status.publication,'not_published');assert.equal(controller.status.qualification[1].status,'pending');}
  else{await controller.start();assert.equal(modelRequests,2);assert.equal(reportRequests,scenario==='lost_before_commit'?3:2);assert.equal(controller.status.publication,'published');await controller.stop();}
  assert.equal(runtime.owned.size,0);
  console.log(JSON.stringify({caseId:'installed-strict-'+scenario,status:'passed',modelRequests,reportRequests,actualVm:true,paidInference:false,guestRemoved:true}));
 }finally{
  if(controller)await controller.stop();
  for(const name of [...runtime.owned])await runtime.remove(name);
  const {credentialVolume}=await import(from('credential-volume.mjs'));const vault=await credentialVolume(network,runtime,node,{create:false}).catch(()=>null);if(vault)await runtime.call(['volume','remove',vault.name]);
  server.closeAllConnections();await new Promise(resolve=>server.close(resolve));await rm(diagnosticsDirectory,{recursive:true,force:true});
 }
}
