// Run in a task-owned PTY; supply a synthetic fixture, never a real upstream key.
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
const { startProvider } = await import(process.env.ADR_ACCEPTANCE_CLIENT_ROOT ? pathToFileURL(join(process.env.ADR_ACCEPTANCE_CLIENT_ROOT, 'src/provider.mjs')).href : '../src/provider.mjs');
const paths = JSON.parse(await readFile(process.env.ADR_ACCEPTANCE_RUNTIME_PATHS, 'utf8'));
const v2=process.env.ADR_NATIVE_PI_ACCEPTANCE==='2',native=v2||process.env.ADR_NATIVE_PI_ACCEPTANCE==='1';
let relayTickets=0;
const node = { id: randomUUID(),ownerId:'synthetic-owner',installationId:'synthetic-installation', name: 'synthetic', endpoint: 'https://api.deepseek.com/chat/completions', model: 'synthetic', supplyClass: 'authorized_api', availability: 'hot', status: 'published', suspended: false };
if(native){const {piCatalog}=await import(process.env.ADR_ACCEPTANCE_CLIENT_ROOT?pathToFileURL(join(process.env.ADR_ACCEPTANCE_CLIENT_ROOT,'src/generated/pi-catalog.mjs')).href:'../src/generated/pi-catalog.mjs');const m=piCatalog.providers.find(p=>p.id==='deepseek').models[0];Object.assign(node,{connectorProtocol:v2?'pi_native_v2':'pi_native_v1',nativeRevision:0,connection:{kind:'builtin',headerNames:[]},provider:'deepseek',fields:{},status:'draft',model:m.id,maxOutputTokens:512,nativeModels:[{model:m.id,api:m.api,endpoint:m.baseUrl,capabilities:m.capabilities,contextWindowTokens:32768,maxOutputTokens:512,price:m.cost}]});}
const network = {local:true,origin:'http://127.0.0.1:9',request:async(path,{body}={})=>path.endsWith('/me')?{userId:node.ownerId}:path.endsWith('/prepare')?{providerRunId:body.providerRunId}:path.endsWith('/relay-ticket')?(relayTickets++,{providerRunId:body.providerRunId,ticket:'t'.repeat(43),reauthenticateSeconds:10}):node};
const diagnosticsDirectory=await mkdtemp('/tmp/adr-console-diag-');
let runtime,vault;
try {
 for(let cycle=0;cycle<(v2?2:1);cycle++){
  const controller=await startProvider(network,node.id,{prepareOnly:native,maxOutputTokens:native?512:1024,diagnosticsDirectory,runtimeConfig:paths});
  try{assert.equal(controller.status.guestReady,true);if(native){assert.equal(relayTickets,0);assert.equal(controller.status.relayReady,false);}}finally{await controller.stop();}
 }
 if(v2){const root=process.env.ADR_ACCEPTANCE_CLIENT_ROOT;const {SandboxRuntime}=await import(root?pathToFileURL(join(root,'src/runtime.mjs')).href:'../src/runtime.mjs');const {credentialVolume}=await import(root?pathToFileURL(join(root,'src/credential-volume.mjs')).href:'../src/credential-volume.mjs');runtime=new SandboxRuntime(paths);await runtime.verify();vault=await credentialVolume(network,runtime,node,{create:false});}
}finally{if(vault)await runtime.call(['volume','remove',vault.name]);await rm(diagnosticsDirectory,{recursive:true,force:true});}
console.log('synthetic_guest_console_and_teardown_passed');
