// Actual orphaned provider VM and retained ownership metadata; local Router only.
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {readFile,mkdtemp,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {spawn} from 'node:child_process';
const root=process.env.ADR_ACCEPTANCE_CLIENT_ROOT,router=process.env.ADR_ACCEPTANCE_ROUTER_ROOT;
if(!root||!router||process.platform!=='darwin'||process.arch!=='arm64')throw Error('installed_mac_inputs_required');
const load=file=>import(pathToFileURL(join(root,'src',file)).href);
const {Network}=await load('network.mjs'),{SandboxRuntime}=await load('runtime.mjs'),{startProvider}=await load('provider.mjs'),{credentialVolume}=await load('credential-volume.mjs'),{deleteProviderListing,retryProviderCleanup}=await load('provider-diagnose.mjs');
const {MarketplaceService}=await import(pathToFileURL(router+'/backend/src/marketplace/service.ts')),{MemoryMarketplaceStore}=await import(pathToFileURL(router+'/backend/src/marketplace/store.ts')),{marketplaceRouter}=await import(pathToFileURL(router+'/backend/src/marketplace/routes.ts'));
const {default:express}=await import(pathToFileURL(router+'/backend/node_modules/express/index.js'));
const provider={userId:randomUUID(),installationId:randomUUID(),roles:['provider']},service=new MarketplaceService(new MemoryMarketplaceStore(),true,Date.now,true);
const app=express();app.use(express.json());app.use('/v2',marketplaceRouter(service,()=>((_req,res,next)=>{res.locals.actor=provider;next();}),res=>res.locals.actor));
const server=app.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));const origin=`http://127.0.0.1:${server.address().port}`,network=new Network({origin,local:true,actor:'provider'});
const config=JSON.parse(await readFile(process.env.ADR_ACCEPTANCE_RUNTIME_PATHS,'utf8')),runtime=new SandboxRuntime(config),diagnostics=await mkdtemp('/private/tmp/adr-recovery-diag-');
const definition=name=>({connectorProtocol:'pi_native_v3',name,provider:'recovery-fixture',models:['recovery-fixture'],fields:{},supplyClass:'self_hosted',inputRate:'1000',outputRate:'2000',totalTokens:'1000000',testCredits:'10000',maxOutputTokens:128,connection:{kind:'custom',authentication:'none',baseUrl:'http://127.0.0.1:9999/v1',api:'openai-completions',headerNames:[],modelDefinitions:[{id:'recovery-fixture',contextWindow:32768,maxTokens:128,cost:{input:0,output:0,cacheRead:0,cacheWrite:0},thinking:'none'}]}});
const vaults=[];let healthy,orphan;
try{
 await runtime.verify();assert.equal(JSON.parse(await runtime.call(['list','--format','json'])).length,0);
 const old=await service.createNode(provider,definition('Synthetic orphan'),randomUUID());
 const code=`import {startProvider} from ${JSON.stringify(pathToFileURL(root+'/src/provider.mjs').href)};import {Network} from ${JSON.stringify(pathToFileURL(root+'/src/network.mjs').href)};import {SandboxRuntime} from ${JSON.stringify(pathToFileURL(root+'/src/runtime.mjs').href)};const runtime=new SandboxRuntime(${JSON.stringify(config)});const controller=await startProvider(new Network({origin:${JSON.stringify(origin)},local:true,actor:'provider'}),${JSON.stringify(old.id)},{prepareOnly:true,noKey:true,runtime,maxOutputTokens:128,diagnosticsDirectory:${JSON.stringify(diagnostics)}});console.log(JSON.stringify({run:controller.status.providerRunId,guest:[...runtime.owned][0]}));process.exit(0);`;
 const child=spawn(process.execPath,['--input-type=module','-e',code],{stdio:['ignore','pipe','pipe']});let output='';child.stdout.on('data',part=>{output+=part;assert.ok(output.length<4096);});child.stderr.resume();
 await new Promise((resolve,reject)=>{child.once('error',reject);child.once('exit',code=>code===0?resolve():reject(Error('orphan_fixture_failed')));});orphan=JSON.parse(output);
 vaults.push(await credentialVolume(network,runtime,old,{create:false}));await runtime.call(['stop',orphan.guest,'--timeout','10']);
 assert.equal(JSON.parse(await runtime.call(['list','--format','json'])).find(v=>v.name===orphan.guest)?.status,'Stopped');
 const other=await service.createNode(provider,definition('Synthetic independent run'),randomUUID());healthy=await startProvider(network,other.id,{prepareOnly:true,noKey:true,runtime,diagnosticsDirectory:diagnostics,maxOutputTokens:128});vaults.push(await credentialVolume(network,runtime,other,{create:false}));const otherRun=healthy.status.providerRunId,otherGuest=[...runtime.owned][0];
 const failedReplacement={status:{providerRunId:randomUUID(),stopped:true,teardownVerified:true},stop:async()=>{throw Error('wrong_controller_selected');}};
 const deleted=await deleteProviderListing(network,old.id,'provider',{directory:diagnostics,runtime,controller:failedReplacement,key:randomUUID()});assert.equal(deleted.status,'deleted');assert.ok(!(await service.nodes(provider)).some(n=>n.id===old.id));
 const inventory=JSON.parse(await runtime.call(['list','--format','json']));assert.ok(!inventory.some(v=>v.name===orphan.guest));assert.ok(inventory.some(v=>v.name===otherGuest));assert.equal(healthy.status.providerRunId,otherRun);assert.equal(healthy.status.stopped,false);
 const saved=JSON.parse(await readFile(join(diagnostics,old.id,orphan.run,'lifecycle.json')));assert.equal(saved.pid,child.pid);assert.equal(saved.ownership.guestName,orphan.guest);
 await assert.rejects(retryProviderCleanup(network,other.id,'provider',{directory:diagnostics,runtime}),{code:'provider_controller_still_running'});assert.equal(healthy.status.stopped,false);
 await healthy.stop();assert.equal(runtime.owned.size,0);
 console.log(JSON.stringify({caseId:'installed-orphan-provider-recovery',status:'passed',actualStoppedGuest:true,oldControllerExited:true,failedReplacementIgnored:true,deleted:true,newerIndependentGuestPreserved:true,originalOwnershipRetained:true,inferenceRequests:0,paidInference:false}));
}finally{
 await healthy?.stop();if(orphan){const inventory=JSON.parse(await runtime.call(['list','--format','json']));if(inventory.some(v=>v.name===orphan.guest)){runtime.owned.add(orphan.guest);await runtime.remove(orphan.guest);}}
 for(const vault of vaults)await runtime.call(['volume','remove',vault.name]);server.closeAllConnections();await new Promise(r=>server.close(r));await rm(diagnostics,{recursive:true,force:true});
}
