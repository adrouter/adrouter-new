// Run in a task-owned PTY; supply a synthetic fixture, never a real upstream key.
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
const { startProvider } = await import(process.env.ADR_ACCEPTANCE_CLIENT_ROOT ? pathToFileURL(join(process.env.ADR_ACCEPTANCE_CLIENT_ROOT, 'src/provider.mjs')).href : '../src/provider.mjs');
const paths = JSON.parse(await readFile(process.env.ADR_ACCEPTANCE_RUNTIME_PATHS, 'utf8'));
const v3=process.env.ADR_NATIVE_PI_ACCEPTANCE==='3',v2=v3||process.env.ADR_NATIVE_PI_ACCEPTANCE==='2',native=v2||process.env.ADR_NATIVE_PI_ACCEPTANCE==='1';
let relayTickets=0;
const node = { id: randomUUID(),ownerId:'synthetic-owner',installationId:randomUUID(), name: 'synthetic', endpoint: 'https://api.deepseek.com/chat/completions', model: 'synthetic', supplyClass: 'authorized_api', availability: 'hot', status: 'published', suspended: false };
if(native){const {piCatalog}=await import(process.env.ADR_ACCEPTANCE_CLIENT_ROOT?pathToFileURL(join(process.env.ADR_ACCEPTANCE_CLIENT_ROOT,'src/generated/pi-catalog.mjs')).href:'../src/generated/pi-catalog.mjs');const m=piCatalog.providers.find(p=>p.id==='deepseek').models[0];Object.assign(node,{connectorProtocol:v3?'pi_native_v3':v2?'pi_native_v2':'pi_native_v1',nativeRevision:0,connection:{kind:'builtin',headerNames:[]},provider:'deepseek',fields:{},status:'draft',model:m.id,maxOutputTokens:512,nativeModels:[{model:m.id,api:m.api,endpoint:m.baseUrl,capabilities:m.capabilities,contextWindowTokens:32768,maxOutputTokens:512,price:m.cost}]});}
if(v3){const {providerCatalog}=await import(pathToFileURL(join(process.env.ADR_ACCEPTANCE_CLIENT_ROOT,'src/generated/provider-catalog.mjs')).href);node.catalogDigest=providerCatalog.digest;node.modelsConfirmed=false;node.models=node.nativeModels.map(m=>m.model);node.totalTokens='1000000';node.testCredits='10000';node.inputRate='1000';node.outputRate='3000';}
const network = {local:true,origin:'http://127.0.0.1:9',request:async(path,{body}={})=>{
 if(path==='/v2/network/config')return {capabilities:['single_request_setup_v1']};
 if(path.endsWith('/me'))return {userId:node.ownerId};
 if(path.endsWith('/prepare')){node.providerRunId=body.providerRunId;return {providerRunId:body.providerRunId};}
 if(path.endsWith('/native')){const {providerCatalog}=await import(pathToFileURL(join(process.env.ADR_ACCEPTANCE_CLIENT_ROOT,'src/generated/provider-catalog.mjs')).href);const p=providerCatalog.providers.find(p=>p.id==='deepseek');Object.assign(node,body,{nativeRevision:node.nativeRevision+1,nativeModels:body.models.map(id=>{const m=p.models.find(m=>m.id===id);return {...m,model:id,endpoint:m.baseUrl,contextWindowTokens:m.contextWindow,maxOutputTokens:body.maxOutputTokens,price:m.cost};})});return node;}
 if(path.endsWith('/relay-ticket')){relayTickets++;return {providerRunId:body.providerRunId,ticket:'t'.repeat(43),reauthenticateSeconds:10};}return node;
}};
const diagnosticsDirectory=await mkdtemp('/tmp/adr-console-diag-');
let runtime,vault;
try {
 for(let cycle=0;cycle<(v2?2:1);cycle++){
  const controller=await startProvider(network,node.id,{prepareOnly:native,maxOutputTokens:native?512:1024,diagnosticsDirectory,runtimeConfig:paths});
  try{assert.equal(controller.status.guestReady,true);if(v3){const {SandboxRuntime}=await import(pathToFileURL(join(process.env.ADR_ACCEPTANCE_CLIENT_ROOT,'src/runtime.mjs')).href);const inspect=new SandboxRuntime(paths);await inspect.verify();const before=JSON.parse(await inspect.call(['list','--format','json']));assert.equal(before.length,1);const configuration=Object.fromEntries(['connectorProtocol','name','provider','models','fields','connection','inputRate','outputRate','totalTokens','testCredits','maxOutputTokens'].map(k=>[k,node[k]]));await controller.configure({...configuration,models:['deepseek-flash','deepseek-v4-pro'],modelsConfirmed:true});assert.deepEqual(JSON.parse(await inspect.call(['list','--format','json'])),before);assert.equal(node.nativeModels.length,2);}if(native){assert.equal(relayTickets,0);assert.equal(controller.status.relayReady,false);}}finally{await controller.stop();}
 }
 if(v2){const root=process.env.ADR_ACCEPTANCE_CLIENT_ROOT;const {SandboxRuntime}=await import(root?pathToFileURL(join(root,'src/runtime.mjs')).href:'../src/runtime.mjs');const {credentialVolume}=await import(root?pathToFileURL(join(root,'src/credential-volume.mjs')).href:'../src/credential-volume.mjs');runtime=new SandboxRuntime(paths);await runtime.verify();vault=await credentialVolume(network,runtime,node,{create:false});}
}finally{if(vault)await runtime.call(['volume','remove',vault.name]);await rm(diagnosticsDirectory,{recursive:true,force:true});}
console.log('synthetic_guest_console_and_teardown_passed');
