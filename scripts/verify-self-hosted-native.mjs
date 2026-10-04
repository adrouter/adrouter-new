// Installed provider VM, actual restricted loopback tunnel, synthetic no-key API.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {randomUUID} from 'node:crypto';
import {readFile,mkdtemp,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
const root=process.env.ADR_ACCEPTANCE_CLIENT_ROOT;
if(!root||process.platform!=='darwin'||process.arch!=='arm64')throw Error('installed_macos_artifact_required');
const load=file=>import(pathToFileURL(join(root,'src',file)).href);
const {SandboxRuntime}=await load('runtime.mjs'),{startProvider}=await load('provider.mjs'),{credentialVolume}=await load('credential-volume.mjs'),{providerCatalog}=await load('generated/provider-catalog.mjs');
const runtime=new SandboxRuntime(JSON.parse(await readFile(process.env.ADR_ACCEPTANCE_RUNTIME_PATHS,'utf8')));
await runtime.verify();let requests=0,redirect=false;
const upstream=createServer(async(req,res)=>{
 requests++;assert.equal(req.url,'/v1/chat/completions');assert.equal(req.headers.authorization,undefined);assert.equal(req.headers['x-api-key'],undefined);
 let bytes='';for await(const chunk of req)bytes+=chunk;const body=JSON.parse(bytes);assert.equal(body.model,'native-local-fixture');assert.equal(body.max_tokens??body.max_completion_tokens,128);
 if(redirect){res.writeHead(302,{location:'http://127.0.0.1:1/forbidden'});res.end();return;}
 res.setHeader('content-type','text/event-stream');
 const frames=[{id:'fixture',created:0,model:body.model,choices:[{index:0,delta:{content:'ready'},finish_reason:null}]},{id:'fixture',created:0,model:body.model,choices:[{index:0,delta:{},finish_reason:'stop'}],usage:{prompt_tokens:10,completion_tokens:2,total_tokens:12}}];
 res.end(frames.map(f=>'data: '+JSON.stringify(f)+'\n\n').join('')+'data: [DONE]\n\n');
});await new Promise(resolve=>upstream.listen(0,'127.0.0.1',resolve));
const endpoint=`http://127.0.0.1:${upstream.address().port}/v1`,model={model:'native-local-fixture',api:'openai-completions',endpoint,capabilities:['coding_v1','streaming_v1','tools_v1'],supportedSettings:{reasoning:['off']},defaultSettings:{reasoning:'off'},contextWindowTokens:32768,maxOutputTokens:128,price:{input:0,output:0,cacheRead:0,cacheWrite:0},priceVersion:'connection_definition_v2'};
const node={id:randomUUID(),ownerId:'synthetic-owner',installationId:'synthetic-installation',name:'native loopback fixture',connectorProtocol:'pi_native_v3',nativeRevision:0,catalogDigest:providerCatalog.digest,supplyClass:'self_hosted',availability:'hot',provider:'native-local-fixture',model:model.model,models:[model.model],modelsConfirmed:true,endpoint,maxOutputTokens:128,nativeModels:[model],fields:{},status:'draft',suspended:false,connection:{kind:'custom',authentication:'none',baseUrl:endpoint,api:model.api,headerNames:[],modelDefinitions:[{id:model.model,contextWindow:32768,maxTokens:128,cost:model.price,thinking:'none'}]}};
const network={local:true,origin:'http://127.0.0.1:9',request:async(path,{body}={})=>{if(path.endsWith('/me'))return {userId:node.ownerId};if(path.endsWith('/prepare')){node.providerRunId=body.providerRunId;return {providerRunId:body.providerRunId};}return node;}};
const diagnostics=await mkdtemp('/tmp/adr-local-diag-');let controller,vault;
try{
 controller=await startProvider(network,node.id,{prepareOnly:true,noKey:true,maxOutputTokens:128,runtime,diagnosticsDirectory:diagnostics});assert.equal(controller.status.guestReady,true);
 const guest=[...runtime.owned][0];assert.ok(guest);vault=await credentialVolume(network,runtime,node,{create:false});
 const execute=async(mode)=>{
  const code=`import fs from 'node:fs';import {nativeLogin,nativeInference} from '/workspace/pi-native.mjs';const n=JSON.parse(fs.readFileSync('/workspace/config.json')).node;const a=await nativeLogin(n,'',AbortSignal.timeout(10000));const m=n.nativeModels[0];const f={requestId:'${randomUUID()}',model:m.model,provider:n.provider,api:m.api,nativeRevision:n.nativeRevision,endpoint:m.endpoint,messageFormat:'pi_context_v1',messages:[{role:'user',content:'synthetic',timestamp:0}],tools:[],maxOutputTokens:128,modelSettings:{reasoning:'off'},thinking:false,upstreamBudget:{inputBound:8192,reservedMicrousd:'0',inputMicrousdPerMillion:'0',outputMicrousdPerMillion:'0'}};if('${mode}'==='binding')f.endpoint='http://127.0.0.1:1/v1';try{const r=await nativeInference(n,a,f,AbortSignal.timeout(10000));console.log(JSON.stringify({status:'passed',input:r.inputTokens,output:r.outputTokens}));}catch(e){console.log(JSON.stringify({status:'rejected',code:e.code}));}finally{await a.close();}`;
  return JSON.parse(await runtime.run(guest,['node','--input-type=module','-e',code],{timeoutSeconds:20}));
 };
 assert.equal((await execute('success')).status,'passed');assert.equal(requests,1);
 assert.equal((await execute('binding')).code,'pi_model_binding_mismatch');assert.equal(requests,1);
 redirect=true;assert.equal((await execute('redirect')).status,'rejected');assert.equal(requests,2);
 await controller.stop();assert.equal(controller.status.teardownVerified,true);assert.equal((JSON.parse(await runtime.call(['list','--format','json']))).length,0);
 console.log(JSON.stringify({caseId:'native-self-hosted-transport',status:'passed',installed:true,actualProviderVm:true,loopbackHttp:true,noKey:true,hostGuestTunnel:true,endpointBinding:true,redirectRejected:true,teardown:true,paidInference:false}));
}finally{await controller?.stop();if(vault)await runtime.call(['volume','remove',vault.name]);await new Promise(resolve=>upstream.close(resolve));await rm(diagnostics,{recursive:true,force:true});}
