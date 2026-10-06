// Exact installed provider and buyer VMs, production guest reporting/relay and
// local Router. Synthetic upstream only; no real profiles or credentials.
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {randomUUID} from 'node:crypto';
import {readFile,writeFile,mkdtemp,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {homedir} from 'node:os';
import {pathToFileURL} from 'node:url';
const root=process.env.ADR_ACCEPTANCE_CLIENT_ROOT,router=process.env.ADR_ACCEPTANCE_ROUTER_ROOT;
if(!root||!router||process.platform!=='darwin'||process.arch!=='arm64')throw Error('installed_mac_inputs_required');
const load=file=>import(pathToFileURL(join(root,'src',file)).href);
const {startProvider}=await load('provider.mjs'),{openCodingBuyer}=await load('coding-buyer.mjs'),{Network}=await load('network.mjs'),{SandboxRuntime}=await load('runtime.mjs'),{credentialVolume}=await load('credential-volume.mjs');
const {MarketplaceService}=await import(pathToFileURL(router+'/backend/src/marketplace/service.ts'));
const {MemoryMarketplaceStore}=await import(pathToFileURL(router+'/backend/src/marketplace/store.ts'));
const {MarketplaceRelay}=await import(pathToFileURL(router+'/backend/src/marketplace/relay.ts'));
const {marketplaceRouter}=await import(pathToFileURL(router+'/backend/src/marketplace/routes.ts'));
const {default:express}=await import(pathToFileURL(router+'/backend/node_modules/express/index.js'));
const runtimeConfig=JSON.parse(await readFile(process.env.ADR_ACCEPTANCE_RUNTIME_PATHS,'utf8')),runtime=new SandboxRuntime(runtimeConfig);
const provider={userId:randomUUID(),installationId:randomUUID(),roles:['provider']},buyer={userId:randomUUID(),installationId:randomUUID(),roles:['buyer']},operator={userId:provider.userId,installationId:randomUUID(),roles:['admin']};
const store=new MemoryMarketplaceStore(),service=new MarketplaceService(store,false,Date.now,true,true,provider.userId,buyer.userId),relay=new MarketplaceRelay(service);
let arrivals=0,mainCalls=0,live=0,maximumLive=0,mode='normal',cancelStarted;
const sawCancel=new Promise(r=>cancelStarted=r);
const upstream=createServer(async(req,res)=>{
 arrivals++;let bytes='';for await(const chunk of req)bytes+=chunk;const body=JSON.parse(bytes);assert.equal(req.headers.authorization,undefined);
 const setup=body.tools?.some(t=>t.function.name==='adr_setup_probe');
 if(mode==='cancel'&&!setup){cancelStarted();return;}
 if(!setup)mainCalls++;
 const tool=setup||mainCalls%2===1,name=setup?'adr_setup_probe':'read',args=setup?{value:'ready'}:{path:'fixture.txt'};
 const base={id:'synthetic-'+arrivals,object:'chat.completion.chunk',created:0,model:body.model};
 res.writeHead(200,{'content-type':'text/event-stream'});
 res.write([{...base,choices:[{index:0,delta:tool?{tool_calls:[{index:0,id:'call_'+arrivals,type:'function',function:{name,arguments:JSON.stringify(args)}}]}:{content:'Synthetic completion.'},finish_reason:null}]},{...base,choices:[{index:0,delta:{},finish_reason:tool?'tool_calls':'stop'}],usage:{prompt_tokens:10,completion_tokens:2,total_tokens:12}},'[DONE]'].map(p=>'data: '+(typeof p==='string'?p:JSON.stringify(p))+'\n\n').join(''));
 // Native Pi finishes at [DONE]; the SDK path waits for HTTP EOF. Exercise both.
 if(process.argv.includes('--sdk'))setTimeout(()=>res.end(),100);
});
upstream.on('connection',socket=>{live++;maximumLive=Math.max(maximumLive,live);socket.once('close',()=>live--);});await new Promise(r=>upstream.listen(0,'127.0.0.1',r));
const app=express();app.use(express.json());app.use('/v2',marketplaceRouter(service,role=>(req,res,next)=>{const a=req.header('X-Adr-Local-Actor')==='provider'?provider:req.header('X-Adr-Local-Actor')==='buyer'?buyer:operator;if(!a.roles.includes(role)){res.status(403).end();return;}res.locals.actor=a;next();},res=>res.locals.actor,relay));
const server=app.listen(0,'127.0.0.1');relay.attach(server,true);await new Promise(r=>server.once('listening',r));
const network=new Network({origin:`http://127.0.0.1:${server.address().port}`,local:true,actor:'buyer'}),pn=Object.create(network);pn.actor='provider';
const diagnostics=await mkdtemp('/private/tmp/adr-stream-diag-'),project=await mkdtemp('/private/tmp/adr-stream-project-'),profile='stream-'+randomUUID().slice(0,10);
let controller,coding,vault,node;
const until=async check=>{const end=Date.now()+30000;while(!await check()){if(Date.now()>end)throw Error('native_stream_acceptance_timeout');await new Promise(r=>setTimeout(r,10));}};
try{
 await runtime.verify();assert.equal(JSON.parse(await runtime.call(['list','--format','json'])).length,0);
 await service.grant(operator,{userId:buyer.userId,amount:'10000'},randomUUID());
 const api=process.argv.includes('--sdk')?'sdk:@ai-sdk/openai-compatible':'openai-completions',endpoint=`http://127.0.0.1:${upstream.address().port}/v1`;
 node=await service.createNode(provider,{connectorProtocol:'pi_native_v3',name:'Synthetic native streaming',provider:'native-stream-fixture',models:['native-stream-fixture'],fields:{},supplyClass:'self_hosted',inputRate:'1000',outputRate:'2000',totalTokens:'1000000',testCredits:'10000',maxOutputTokens:128,connection:{kind:'custom',authentication:'none',baseUrl:endpoint,api,headerNames:[],modelDefinitions:[{id:'native-stream-fixture',contextWindow:32768,maxTokens:128,cost:{input:0,output:0,cacheRead:0,cacheWrite:0},thinking:'none'}]}},randomUUID());
 controller=await startProvider(pn,node.id,{prepareOnly:true,noKey:true,runtime,diagnosticsDirectory:diagnostics,maxOutputTokens:128});vault=await credentialVolume(pn,runtime,node,{create:false});await controller.start();await until(()=>controller.status.state==='serving');
 const run=controller.status.providerRunId,ready=await service.inspectNode(provider,node.id),listingId=ready.listingIds[0];
 const session=async()=>{const q=await service.quote(buyer,{listingId,connectorProtocol:'pi_native_v3',maximumCharge:'1000',maxOutputTokens:128,durationSeconds:3600,protocol:'coding_v1',requestLimit:100,mode:'private_rehearsal',acknowledgeProvisional:true},randomUUID());const s=await service.accept(buyer,{quoteId:q.id,accept:true,mode:'private_rehearsal',acknowledgeProvisional:true},randomUUID());await network.request(`/v2/sessions/${s.id}/handshake`,{method:'POST',body:{}});return s;};
 await writeFile(join(project,'fixture.txt'),'synthetic fixture\n');const first=await session();coding=await openCodingBuyer(network,first.id,{root:project,files:['fixture.txt'],runtimeConfig,profile,trusted:true,approve:async()=>true});
 for(let i=0;i<6;i++){
  await coding.interactive({prompt:'Synthetic read and completion.',mode:'print',consoleOptions:{stdio:['ignore','ignore','pipe']}});
  assert.equal(mainCalls,(i+1)*2);assert.equal(controller.status.providerRunId,run);assert.equal(controller.status.stopped,false);
  await until(()=>live===0);
 }
 assert.equal(arrivals,13);assert.ok(maximumLive<=2);await coding.close();coding=undefined;assert.equal((await service.session(buyer,first.id)).accountingState,'settled');
 const cancelled=await session();mode='cancel';const requestId=randomUUID();
 const request=network.request(`/v2/sessions/${cancelled.id}/inference`,{method:'POST',body:{protocol:'coding_v1',messageFormat:'pi_context_v1',requestId,messages:[{role:'user',content:'synthetic cancel',timestamp:0}],maxOutputTokens:128,thinking:false,purpose:'main',tools:[]}}).catch(e=>e.code);
 await Promise.race([sawCancel,request.then(()=>{throw Error('cancel_not_dispatched');})]);await network.request(`/v2/sessions/${cancelled.id}/stop`,{method:'POST',body:{}});assert.equal(await request,'request_cancelled');await until(()=>live===0);
 await until(async()=>!!(await service.session(buyer,cancelled.id)).executionReleasedAt);assert.equal((await service.session(buyer,cancelled.id)).accountingState,'pending_reconciliation');
 mode='normal';const last=await session();const before=mainCalls;
 coding=await openCodingBuyer(network,last.id,{root:project,files:['fixture.txt'],runtimeConfig,profile,trusted:true,approve:async()=>true});await coding.interactive({prompt:'Synthetic continuation after cancellation.',mode:'print',consoleOptions:{stdio:['ignore','ignore','pipe']}});assert.equal(mainCalls,before+2);await coding.close();coding=undefined;
 assert.equal(controller.status.providerRunId,run);assert.equal((await service.unresolved(operator)).length,1);await controller.stop();assert.equal(runtime.owned.size,0);
 console.log(JSON.stringify({caseId:'installed-native-streaming-'+(process.argv.includes('--sdk')?'sdk':'pi'),status:'passed',actualProviderVm:true,actualBuyerVm:true,productionReporting:true,mainRequests:mainCalls,upstreamArrivals:arrivals,oneProviderRun:true,toolContinuations:7,cancelledRequestHeld:true,subsequentSession:true,maximumOpenConnections:maximumLive,paidInference:false}));
}finally{
 await coding?.close();await controller?.stop();if(vault)await runtime.call(['volume','remove',vault.name]);relay.close();server.closeAllConnections();upstream.closeAllConnections();await Promise.all([new Promise(r=>server.close(r)),new Promise(r=>upstream.close(r))]);await rm(project,{recursive:true,force:true});await rm(diagnostics,{recursive:true,force:true});await rm(join(homedir(),'.adr-v2','profiles',profile),{recursive:true,force:true});
}
