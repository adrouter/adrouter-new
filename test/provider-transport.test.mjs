import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer,request as httpRequest} from 'node:http';
import {createServer as createHttpsServer} from 'node:https';
import dns from 'node:dns';
import * as tls from 'node:tls';
import {syncBuiltinESMExports} from 'node:module';
import {randomUUID} from 'node:crypto';
import {mkdtemp,readFile,rm} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {execFileSync} from 'node:child_process';
import {pathToFileURL} from 'node:url';
import {fixture,until} from './helpers/provider-fixture.mjs';
import {providerCatalog} from '../src/generated/provider-catalog.mjs';
const root=process.env.ADR_DIAGNOSTIC_CLIENT_ROOT;
const load=file=>import(root?pathToFileURL(root+'/src/'+file).href:new URL('../src/'+file,import.meta.url).href);
const {nativeLogin,nativeInference}=await load('pi-native.mjs');
const {restrictedPiFetch}=await load('pi-transport.mjs');
const originalLookup=dns.lookup;
// Only the synthetic guest-to-host name is redirected; production transport and
// all destination/capacity checks remain in the test.
dns.lookup=(host,options,callback)=>originalLookup(host==='host.microsandbox.internal'?'127.0.0.1':host,options,callback);
syncBuiltinESMExports();
test.after(()=>{dns.lookup=originalLookup;syncBuiltinESMExports();});
const sse=parts=>parts.map(p=>'data: '+(typeof p==='string'?p:JSON.stringify(p))+'\n\n').join('');

async function connection({https=false,sdk=false,ending='delayed',responseMode}={}) {
 let arrivals=0,live=0,maxLive=0;const timers=new Set();let directory,previousTrust;
 const handler=async(req,res)=>{
  arrivals++;let body='';for await(const part of req)body+=part;
  assert.equal(req.url,'/v1/chat/completions');assert.equal(req.headers.authorization,undefined);
  const request=JSON.parse(body),tool=arrivals%2===1;
  if(responseMode==='redirect'){res.writeHead(302,{location:'http://127.0.0.1:1/forbidden'}).end();return;}
  if(responseMode==='oversize'){res.writeHead(200,{'content-type':'text/plain'}).end('x'.repeat(2*1024*1024+1));return;}
  const delta=tool?{tool_calls:[{index:0,id:'tool_'+arrivals,type:'function',function:{name:'adr_probe',arguments:'{"value":"ready"}'}}]}:{role:'assistant',content:'ready'};
  const base={id:'synthetic_'+arrivals,object:'chat.completion.chunk',created:0,model:request.model};
  res.writeHead(200,{'content-type':'text/event-stream'});
  res.write(sse([{...base,choices:[{index:0,delta,finish_reason:null}]},{...base,choices:[{index:0,delta:{},finish_reason:tool?'tool_calls':'stop'}],usage:{prompt_tokens:10,completion_tokens:2,total_tokens:12}},'[DONE]']));
  if(ending==='immediate')res.end();
  else if(ending==='delayed'){const timer=setTimeout(()=>{timers.delete(timer);res.end();},100);timers.add(timer);}
 };
 let upstream;
 if(https){
  directory=await mkdtemp(join(tmpdir(),'adr-synthetic-tls-'));
  execFileSync('openssl',['req','-x509','-newkey','rsa:2048','-nodes','-keyout',join(directory,'key.pem'),'-out',join(directory,'cert.pem'),'-days','1','-subj','/CN=127.0.0.1','-addext','subjectAltName=IP:127.0.0.1'],{stdio:'ignore'});
  const cert=await readFile(join(directory,'cert.pem'),'utf8');previousTrust=tls.getCACertificates('default');tls.setDefaultCACertificates([...previousTrust,cert]);
  upstream=createHttpsServer({key:await readFile(join(directory,'key.pem')),cert},handler);
 }else upstream=createServer(handler);
 upstream.on('connection',socket=>{live++;maxLive=Math.max(maxLive,live);socket.once('close',()=>live--);});
 await new Promise(r=>upstream.listen(0,'127.0.0.1',r));
 const f=await fixture({native:true});f.node.endpoint=`${https?'https':'http'}://127.0.0.1:${upstream.address().port}/v1`;f.node.nativeModels=[{model:'synthetic',api:'openai-completions',endpoint:f.node.endpoint}];
 const controller=await f.start();
 const source=sdk?providerCatalog.providers.flatMap(p=>p.models.map(m=>({p,m}))).find(({m})=>m.adapter?.id==='@ai-sdk/openai-compatible'&&m.supportedSettings?.reasoning.includes('off')):null;
 const model={...(source?.m??{}),model:'synthetic',api:sdk?'sdk:@ai-sdk/openai-compatible':'openai-completions',endpoint:f.node.endpoint,capabilities:['coding_v1','streaming_v1','tools_v1'],supportedSettings:{reasoning:['off']},defaultSettings:{reasoning:'off'},contextWindowTokens:32768,maxOutputTokens:128,price:{input:0,output:0,cacheRead:0,cacheWrite:0}};
 const node={...f.state.configuration.node,connectorProtocol:sdk?'pi_native_v3':'pi_native_v2',nativeRevision:0,provider:source?.p.id??'synthetic-local',connection:{kind:'custom',authentication:'none',headerNames:[]},fields:{},maxOutputTokens:128,nativeModels:[model]};
 const auth=await nativeLogin(node,'');
 const frame=messages=>({type:'inference',requestId:randomUUID(),sessionId:randomUUID(),model:model.model,provider:node.provider,api:model.api,endpoint:node.endpoint,nativeRevision:0,messageFormat:'pi_context_v1',messages,tools:[{type:'function',function:{name:'adr_probe',description:'Synthetic tool',parameters:{type:'object',properties:{value:{type:'string'}},required:['value']}}}],maxOutputTokens:128,thinking:false,modelSettings:{reasoning:'off'},upstreamBudget:{inputBound:65536,reservedMicrousd:'0',inputMicrousdPerMillion:'0',outputMicrousdPerMillion:'0'}});
 return {node,frame,auth,f,controller,get arrivals(){return arrivals;},get live(){return live;},get maxLive(){return maxLive;},async close(){await auth.close();await f.close();for(const timer of timers)clearTimeout(timer);upstream.closeAllConnections();await new Promise(r=>upstream.close(r));if(previousTrust)tls.setDefaultCACertificates(previousTrust);if(directory)await rm(directory,{recursive:true,force:true});}};
}

for(const options of [{ending:'delayed'},{ending:'open'},{ending:'immediate'},{ending:'delayed',https:true},{ending:'delayed',sdk:true}])test(`native transport releases each completed stream ${JSON.stringify(options)}`,async()=>{
 const c=await connection(options);let messages=[{role:'user',content:'synthetic',timestamp:0}];
 try{
  for(let i=0;i<12;i++){
   const result=await nativeInference(c.node,c.auth,c.frame(messages),AbortSignal.timeout(5000));
   assert.equal(result.inputTokens,10);assert.equal(result.outputTokens,2);assert.equal(c.arrivals,i+1);
   messages=[...messages,result.nativeMessage];
   if(result.toolCalls.length)messages.push({role:'toolResult',toolCallId:result.toolCalls[0].id,toolName:'adr_probe',content:[{type:'text',text:'ready'}],isError:false,timestamp:0});
   else messages.push({role:'user',content:'continue synthetic',timestamp:0});
   assert.ok(c.live<=2);
  }
  await until(()=>c.live===0,2000);assert.ok(c.maxLive<=2);assert.equal(c.f.state.created,1);
 }finally{await c.close();}
});

for(const phase of ['connect','tls','body'])test(`transport cancellation closes ${phase} resources and allows the next request`,async()=>{
 const sockets=new Set();let requests=0;
 const broker=createServer((_req,res)=>{requests++;res.writeHead(200).write('synthetic');});
 broker.on('connection',socket=>{sockets.add(socket);socket.once('close',()=>sockets.delete(socket));socket.once('end',()=>socket.destroy());});
 broker.on('connect',(_req,socket)=>{if(phase==='connect')return;socket.write('HTTP/1.1 200 Connection Established\r\n\r\n');if(phase==='body')socket.on('data',()=>{socket.write('HTTP/1.1 200 OK\r\nContent-Type: text/plain\r\nTransfer-Encoding: chunked\r\n\r\n9\r\nsynthetic\r\n');});else socket.on('data',()=>{});});
 await new Promise(r=>broker.listen(0,'127.0.0.1',r));
 const endpoint=`${phase==='tls'?'https':'http'}://127.0.0.1:9999/v1`,node={endpoint,supplyClass:'self_hosted',tunnel:{port:broker.address().port,capability:'synthetic'}};
 const abort=new AbortController();const transport=restrictedPiFetch(node,{endpoint},abort.signal);
 try{
  const pending=transport(endpoint+'/chat/completions',{method:'POST',body:'{}'});
  const rejected=phase==='body'?null:assert.rejects(pending);
  await until(()=>sockets.size===1);
  if(phase==='body'){const response=await pending;const reader=response.body.getReader();await reader.read();await reader.cancel();await reader.cancel();}else{abort.abort();await rejected;}
  await until(()=>sockets.size===0,2000);assert.equal(requests,0);
 }finally{for(const socket of sockets)socket.destroy();await new Promise(r=>broker.close(r));}
});

test('broker retains the two-tunnel limit and records a safe rejection reason',async()=>{
 const c=await connection();const sockets=[];
 const open=()=>new Promise((resolve,reject)=>{const req=httpRequest({host:'127.0.0.1',port:c.node.tunnel.port,method:'CONNECT',path:'/upstream/'+encodeURIComponent(new URL(c.node.endpoint).origin),headers:{authorization:'Bearer '+c.node.tunnel.capability}});req.once('connect',(res,socket)=>{assert.equal(res.statusCode,200);sockets.push(socket);resolve(socket);});req.once('error',reject);req.end();});
 try{await open();await open();await assert.rejects(open());assert.equal(c.live,2);assert.equal(c.f.state.created,1);await c.controller.lifecycle.pending;const saved=JSON.parse(await readFile(join(c.f.directory,c.f.node.id,c.f.state.run,'lifecycle.json')));assert.ok(saved.events.some(e=>e.code==='tunnel_capacity_reached'));sockets[0].destroy();await until(()=>c.live===1);await open();assert.equal(c.live,2);}finally{for(const socket of sockets)socket.destroy();await c.close();}
});

for(const responseMode of ['redirect','oversize'])test(`transport ${responseMode} rejection releases the upstream and cannot replay`,async()=>{
 const c=await connection({responseMode});try{
  const fetcher=restrictedPiFetch(c.node,c.node.nativeModels[0],AbortSignal.timeout(5000));
  await assert.rejects(async()=>{const response=await fetcher(c.node.endpoint+'/chat/completions',{method:'POST',body:'{}'});await response.text();},{code:responseMode==='redirect'?'pi_redirect_rejected':'pi_response_limit'});
  await until(()=>c.live===0,2000);await assert.rejects(fetcher(c.node.endpoint+'/chat/completions',{method:'POST',body:'{}'}),{code:'upstream_retry_forbidden'});assert.equal(c.arrivals,1);
 }finally{await c.close();}
});
