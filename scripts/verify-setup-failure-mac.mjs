// Real installed provider guest, SDK, control reports and host qualification.
// The only upstream is a task-owned synthetic HTTP server; no real credentials.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {randomUUID} from 'node:crypto';
import {readFile,mkdtemp,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';

const root=process.env.ADR_ACCEPTANCE_CLIENT_ROOT;
if(!root||process.platform!=='darwin'||process.arch!=='arm64')throw Error('installed_macos_artifact_required');
const load=file=>import(pathToFileURL(join(root,'src',file)).href);
const {SandboxRuntime}=await load('runtime.mjs'),{startProvider}=await load('provider.mjs');
const {credentialVolume}=await load('credential-volume.mjs'),{providerCatalog}=await load('generated/provider-catalog.mjs');
const {reportDigest}=await load('provider-reports.mjs'),{diagnoseProvider}=await load('provider-diagnose.mjs'),{exportFailure}=await load('failure-diagnostics.mjs');
const runtime=new SandboxRuntime(JSON.parse(await readFile(process.env.ADR_ACCEPTANCE_RUNTIME_PATHS,'utf8')));
await runtime.verify();let requests=0;const reports=[];
const upstream=createServer(async(req,res)=>{
 requests++;assert.equal(req.url,'/v1/chat/completions');assert.equal(req.headers.authorization,undefined);
 let bytes='';for await(const part of req)bytes+=part;const body=JSON.parse(bytes);
 assert.equal(body.tools[0].function.name,'adr_setup_probe');assert.equal(body.max_tokens??body.max_completion_tokens,128);
 const frames=[{id:'synthetic',object:'chat.completion.chunk',created:0,model:body.model,choices:[{index:0,delta:{tool_calls:[{index:0,id:'call_1',type:'function',function:{name:'adr_setup_probe',arguments:'{'}}]},finish_reason:null}]},
  {id:'synthetic',object:'chat.completion.chunk',created:0,model:body.model,choices:[{index:0,delta:{},finish_reason:'tool_calls'}],usage:{prompt_tokens:10,completion_tokens:2,total_tokens:12}},'[DONE]'];
 res.writeHead(200,{'content-type':'text/event-stream'}).end(frames.map(e=>'data: '+(typeof e==='string'?e:JSON.stringify(e))+'\n\n').join(''));
});await new Promise(resolve=>upstream.listen(0,'127.0.0.1',resolve));
const p=providerCatalog.providers.find(p=>p.models.some(m=>m.adapter?.id==='@ai-sdk/openai-compatible'&&m.supportedSettings?.reasoning.includes('off')));
const source=p.models.find(m=>m.adapter?.id==='@ai-sdk/openai-compatible'&&m.supportedSettings?.reasoning.includes('off'));
const endpoint=`http://127.0.0.1:${upstream.address().port}/v1`,model={...source,model:source.id,endpoint,capabilities:['coding_v1','streaming_v1','tools_v1'],supportedSettings:{reasoning:['off']},defaultSettings:{reasoning:'off'},contextWindowTokens:32768,maxOutputTokens:128,price:{input:0,output:0,cacheRead:0,cacheWrite:0},priceVersion:'connection_definition_v2'};
const node={id:randomUUID(),ownerId:randomUUID(),installationId:randomUUID(),name:'Setup failure fixture',connectorProtocol:'pi_native_v3',nativeRevision:0,catalogDigest:providerCatalog.digest,supplyClass:'self_hosted',availability:'hot',provider:p.id,model:model.model,models:[model.model],modelsConfirmed:true,endpoint,maxOutputTokens:128,nativeModels:[model],nativeChecks:{},fields:{},status:'draft',suspended:false,connection:{kind:'custom',authentication:'none',baseUrl:endpoint,api:model.api,headerNames:[],modelDefinitions:[{id:model.model,contextWindow:32768,maxTokens:128,cost:model.price,thinking:'none'}]}};
const network={local:true,origin:'http://127.0.0.1:9',request:async(path,{body}={})=>{
 if(path.endsWith('/me'))return {userId:node.ownerId};
 if(path==='/v2/network/config')return {capabilities:['single_request_setup_v1','failure_diagnostics_v1']};
 if(path.endsWith('/prepare')){node.providerRunId=body.providerRunId;return {providerRunId:body.providerRunId};}
 if(path.endsWith('/pi-checks')){const check={...body,id:randomUUID(),state:'dispatched',deadline:Date.now()+30000,outputBound:128,inputBound:8192,upstreamReserved:'0',rates:{inputMicrousdPerMillion:'0',outputMicrousdPerMillion:'0'}};node.nativeChecks[check.id]=check;return check;}
 if(path.endsWith('/pi-checks/complete')){reports.push(body);Object.assign(node.nativeChecks[body.id],{state:'settled',passed:false,reportDigest:reportDigest(body),installationId:node.installationId,providerRunId:node.providerRunId});return {passed:false};}
 if(path.endsWith('/pi-checks/teardown')){for(const id of body.attemptIds)node.nativeChecks[id].executionReleasedAt=Date.now();return {};}
 if(path.endsWith('/stop'))node.status='paused';
 if(path.endsWith('/teardown'))node.cleanupState='succeeded';
 if(path.endsWith('/publish'))throw Error('failed_probe_must_not_publish');
 return node;
}};
const directory=await mkdtemp('/private/tmp/adr-setup-failure-');let controller,vault;
try{
 controller=await startProvider(network,node.id,{prepareOnly:true,noKey:true,maxOutputTokens:128,runtime,diagnosticsDirectory:directory});
 vault=await credentialVolume(network,runtime,node,{create:false});
 const started=Date.now();let error;try{await controller.start();}catch(e){error=e;}
 assert.equal(error?.code,'setup_probe_invalid_arguments');assert.ok(Date.now()-started<30000);assert.equal(requests,1);assert.equal(reports.length,1);
 assert.deepEqual(reports[0].usage,{input:10,output:2,cacheRead:0,cacheWrite:0,reasoning:0});assert.equal(reports[0].completed,false);
 assert.equal(error.failureDiagnostic.code,'upstream_malformed_response');assert.equal(error.failureDiagnostic.phase,'validation');assert.equal(error.failureDiagnostic.statusCode,200);
 const reopened=await diagnoseProvider(network,node.id,'provider',{directory}),primary=reopened.diagnosis.primaryFailure;
 assert.equal(primary.code,error.code);assert.deepEqual(primary.failureDiagnostic,error.failureDiagnostic);
 const exported=JSON.parse(await readFile(await exportFailure(directory,primary.failureDiagnostic,reopened.diagnosis.cleanupOutcomes,{setupCode:primary.code}),'utf8'));
 assert.equal(exported.setupCode,error.code);assert.deepEqual(exported.failureDiagnostic,error.failureDiagnostic);assert.equal(controller.status.teardownVerified,true);assert.equal(runtime.owned.size,0);
 console.log(JSON.stringify({caseId:'installed-sdk-setup-normalization',status:'passed',actualProviderGuest:true,actualSdk:true,actualGuestReports:true,upstreamRequests:requests,usageReports:reports.length,originalSetupCode:error.code,diagnosticCode:error.failureDiagnostic.code,phase:error.failureDiagnostic.phase,reopenedExport:true,teardown:true,paidInference:false}));
}finally{
 await controller?.stop();if(vault)await runtime.call(['volume','remove',vault.name]);upstream.closeAllConnections();await new Promise(resolve=>upstream.close(resolve));await rm(directory,{recursive:true,force:true});
}
