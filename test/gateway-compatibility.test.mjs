import test from 'node:test';
import assert from 'node:assert/strict';
import {createServer} from 'node:http';
import {setTimeout as delay} from 'node:timers/promises';
import {connectorCatalog,resolveConnector,connectorHeaders} from '../src/connectors.mjs';
import {upstreamInference,validateBinding} from '../src/provider-broker.mjs';
import {UpstreamCodingStream} from '../src/coding-wire.mjs';
const base=connectorCatalog.profiles[0],secret='synthetic key never valid';
const frame={requestId:'123e4567-e89b-42d3-a456-426614174000',protocol:'coding_v1',messages:[{role:'assistant',content:'',reasoning_content:'synthetic history'}],tools:[{type:'function',function:{name:'read',parameters:{type:'object'}}}],maxOutputTokens:32,thinking:false,upstreamBudget:{inputBound:10000,reservedMicrousd:'100000',inputMicrousdPerMillion:'1',outputMicrousdPerMillion:'1'}};
const event=data=>'data: '+JSON.stringify(data)+'\r\n\r\n';
const complete=(thinking=false,choices=[])=>': keepalive\r\n\r\n'+event({choices:[{index:0,delta:{role:'assistant',content:''}}]})+event({choices:[{index:0,delta:{content:'界🙂',...(thinking?{reasoning_content:'thought'}:{})},finish_reason:'stop'}]})+event({choices,usage:{prompt_tokens:10,completion_tokens:4}})+'data: [DONE]\r\n\r\n';
async function gateway(respond,run){
 const seen=[];const server=createServer(async(req,res)=>{let body='';for await(const b of req)body+=b;seen.push({path:req.url,headers:req.headers,body:JSON.parse(body)});respond(req,res);});
 server.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));
 const node={supplyClass:'self_hosted',endpoint:`http://127.0.0.1:${server.address().port}/custom/chat/completions`,model:'vendor/exact-model:variant',connector:base};
 try{await run(node,seen);}finally{server.closeAllConnections();await new Promise(r=>server.close(r));}
}
test('every permitted generic connector combination sends exact headers/body once',async()=>{
 let combinations=0;
 for(const authentication of ['bearer','api_key','x_api_key','none'])for(const outputTokenParameter of ['max_tokens','max_completion_tokens'])for(const streamingUsage of ['include_usage','native'])for(const thinking of ['none','type','reasoning_effort'])for(const reasoningHistory of [false,true]){
  const connector={...base,authentication,outputTokenParameter,streamingUsage,thinking,reasoningHistory};
  if(thinking==='none'&&reasoningHistory){assert.throws(()=>resolveConnector({connector}),/unsupported/);continue;}
  for(const enabled of thinking==='none'?[false]:[false,true])await gateway((req,res)=>{res.writeHead(200,{'content-type':'text/event-stream'});res.end(complete(enabled));},async(node,seen)=>{
   node.connector=connector;const result=await upstreamInference(node,secret,{...frame,thinking:enabled});
   assert.equal(seen.length,1);assert.equal(seen[0].path,'/custom/chat/completions');const {headers,body}=seen[0];
   for(const name of ['authorization','api-key','x-api-key'])assert.equal(headers[name],connectorHeaders(connector,secret)[name]);
   assert.equal(body.model,node.model);assert.equal(body[outputTokenParameter],32);assert.equal(Object.hasOwn(body,outputTokenParameter==='max_tokens'?'max_completion_tokens':'max_tokens'),false);
   assert.deepEqual(body.stream_options,streamingUsage==='include_usage'?{include_usage:true}:undefined);assert.equal(body.stream,true);
   assert.equal(body.messages[0].reasoning_content,enabled&&reasoningHistory?'synthetic history':undefined);
   assert.deepEqual(body.thinking,thinking==='type'?{type:enabled?'enabled':'disabled'}:undefined);
   assert.equal(body.reasoning_effort,thinking==='reasoning_effort'?(enabled?'medium':'none'):undefined);
   assert.equal(result.text,'界🙂');assert.equal(result.inputTokens,10);assert.equal(result.outputTokens,4);
  });combinations++;
 }
 assert.equal(combinations,80);
 for(const connector of [{...base,authentication:'cookie'},{...base,thinking:'mandatory'},{...base,outputTokenParameter:'limit'},{...base,streamingUsage:'estimated'},{...base,version:2},{...base,headers:{}}])assert.throws(()=>resolveConnector({connector}),/unsupported/);
 for(const endpoint of ['https://localhost/chat','https://private.local/chat','http://public.example.test/chat','https://127.0.0.1/chat','https://user:password@example.test/chat','https://example.test/chat?key=x','https://example.test/chat#x'])assert.throws(()=>validateBinding({supplyClass:'authorized_api',endpoint}));
});
test('SSE parses one-byte UTF-8/CRLF, comments, fragmented tools and both final usage shapes',async()=>{
 for(const choices of [[],[{index:0,delta:{},finish_reason:'tool_calls'}]]){
  const bytes=Buffer.from(': keepalive\r\n\r\n'+event({choices:[{delta:{content:'界🙂',reasoning_content:'thought',tool_calls:[{index:0,id:'c1',type:'function',function:{name:'read',arguments:'{"pa'}}]}}]})+event({choices:[{delta:{tool_calls:[{index:0,function:{arguments:'th":"a.py"}'}}]},finish_reason:'tool_calls'}]})+event({choices,usage:{prompt_tokens:12,completion_tokens:9}})+'data: [DONE]\r\n\r\n');
  const events=[],stream=new UpstreamCodingStream(frame.requestId,['read'],e=>events.push(e));for(const b of bytes)await stream.feed(Buffer.from([b]));
  const result=stream.result();assert.equal(result.text,'界🙂');assert.equal(result.thinking,'thought');assert.equal(result.toolCalls[0].function.arguments,'{"path":"a.py"}');assert.equal(result.inputTokens,12);assert.ok(events.every((e,i)=>e.sequence===i+1));
 }
});
test('incomplete usage/tools, unsupported reasoning and bounded output fail closed',async()=>{
 const finish={choices:[{delta:{},finish_reason:'stop'}]},usage={choices:[],usage:{prompt_tokens:1,completion_tokens:1}};
 const cases=[
  event(usage)+event(finish)+'data: [DONE]\n\n',
  event({choices:[{delta:{},finish_reason:'tool_calls'}]})+event(usage)+'data: [DONE]\n\n',
  event(finish)+'data: [DONE]\n\n',event(finish)+event(usage),
  event(finish)+event({...usage,usage:{prompt_tokens:-1,completion_tokens:1}})+'data: [DONE]\n\n',
  event({choices:[{delta:{reasoning_details:[{text:secret}]},finish_reason:'stop'}]})+event(usage)+'data: [DONE]\n\n',
  event({choices:[{delta:{content:123},finish_reason:'stop'}]})+event(usage)+'data: [DONE]\n\n',
  event({choices:[{delta:{tool_calls:[{index:0,id:'c1',function:{name:'read',arguments:'{"path":'}}]},finish_reason:'tool_calls'}]})+event(usage)+'data: [DONE]\n\n',
  event({choices:[{delta:{tool_calls:[{index:0,id:'c1',function:{name:'bash',arguments:'{}'}}]},finish_reason:'tool_calls'}]})+event(usage)+'data: [DONE]\n\n',
  event({choices:[{delta:{content:'x'.repeat(131073)},finish_reason:'stop'}]})+event(usage)+'data: [DONE]\n\n',
  event(finish)+event({choices:[{delta:{content:'late'}}]})+event(usage)+'data: [DONE]\n\n',
  event({choices:[{delta:{tool_calls:[{index:0,id:'c1',function:{name:'read',arguments:'{}'}}]},finish_reason:'length'}]})+event(usage)+'data: [DONE]\n\n',
 ];
 for(const bytes of cases){const stream=new UpstreamCodingStream(frame.requestId,['read'],()=>{});await assert.rejects(async()=>{await stream.feed(Buffer.from(bytes));stream.result();},e=>!e.message.includes(secret));}
 await gateway((req,res)=>res.end(complete()),async(node,seen)=>{await assert.rejects(upstreamInference(node,secret,{...frame,maxOutputTokens:1}),{code:'upstream_malformed_response'});assert.equal(seen.length,1);});
});
test('HTTP failures and partial/aborted streams retain status and never replay',async()=>{
 for(const status of [400,401,402,403,404,429,500,503,302])await gateway((req,res)=>{res.writeHead(status,{'content-type':'text/html',location:'/other'});res.end('<html>'+secret+'</html>');},async(node,seen)=>{
  let timing;await assert.rejects(upstreamInference(node,secret,frame,undefined,t=>timing=t),e=>e.code===([401,403].includes(status)?'upstream_authentication_failed':status===429?'upstream_rate_limited':'upstream_failed_outcome_unknown')&&!e.message.includes(secret));assert.equal(timing.statusCode,status);assert.equal(seen.length,1);
 });
 await gateway((req,res)=>req.socket.destroy(),async(node,seen)=>{let timing;await assert.rejects(upstreamInference(node,secret,frame,undefined,t=>timing=t));assert.equal(timing.statusCode,null);assert.equal(seen.length,1);});
 await gateway((req,res)=>res.end(event({choices:[{delta:{content:'partial'}}]})+event({error:{message:secret}})),async(node,seen)=>{await assert.rejects(upstreamInference(node,secret,frame),{code:'upstream_malformed_response'});assert.equal(seen.length,1);});
 await gateway((req,res)=>{res.writeHead(200);res.flushHeaders();},async(node,seen)=>{const controller=new AbortController();const result=upstreamInference(node,secret,frame,controller.signal);while(!seen.length)await delay(2);controller.abort();await assert.rejects(result);assert.equal(seen.length,1);});
});
