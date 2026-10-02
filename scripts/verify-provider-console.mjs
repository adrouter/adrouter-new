// Run in a task-owned PTY; supply a synthetic fixture, never a real upstream key.
import assert from 'node:assert/strict';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
const { startProvider } = await import(process.env.ADR_ACCEPTANCE_CLIENT_ROOT ? pathToFileURL(join(process.env.ADR_ACCEPTANCE_CLIENT_ROOT, 'src/provider.mjs')).href : '../src/provider.mjs');
const paths = JSON.parse(await readFile(process.env.ADR_ACCEPTANCE_RUNTIME_PATHS, 'utf8'));
const native=process.env.ADR_NATIVE_PI_ACCEPTANCE==='1';
let relayTickets=0;
const node = { id: 'synthetic-console', name: 'synthetic', endpoint: 'https://api.deepseek.com/chat/completions', model: 'synthetic', supplyClass: 'authorized_api', availability: 'hot', status: 'published', suspended: false };
if(native){const {piCatalog}=await import(process.env.ADR_ACCEPTANCE_CLIENT_ROOT?pathToFileURL(join(process.env.ADR_ACCEPTANCE_CLIENT_ROOT,'src/generated/pi-catalog.mjs')).href:'../src/generated/pi-catalog.mjs');const m=piCatalog.providers.find(p=>p.id==='deepseek').models[0];Object.assign(node,{connectorProtocol:'pi_native_v1',provider:'deepseek',fields:{},status:'draft',model:m.id,maxOutputTokens:512,nativeModels:[{model:m.id,api:m.api,endpoint:m.baseUrl}]});}
const network = {origin:'http://127.0.0.1:9',request:async(path,{body}={})=>path.endsWith('/prepare')?{providerRunId:body.providerRunId}:path.endsWith('/relay-ticket')?(relayTickets++,{providerRunId:body.providerRunId,ticket:'t'.repeat(43),reauthenticateSeconds:10}):node};
const diagnosticsDirectory=await mkdtemp('/tmp/adr-console-diag-');
const controller = await startProvider(network, node.id, { prepareOnly:native,maxOutputTokens:native?512:1024,diagnosticsDirectory, runtimeConfig: { executable: paths.executable, library: paths.library, home: paths.home } });
try { assert.equal(controller.status.guestReady, true);if(native){assert.equal(relayTickets,0);assert.equal(controller.status.relayReady,false);} }
finally { await controller.stop(); await rm(diagnosticsDirectory,{recursive:true,force:true}); }
console.log('synthetic_guest_console_and_teardown_passed');
