import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { nativeLogin,nativeInference,NativeUsageEvidence } from '../src/pi-native.mjs';
import { piCatalog } from '../src/generated/pi-catalog.mjs';
import { piMessage,piContext } from '../src/pi-context.mjs';
import { restrictedPiFetch } from '../src/pi-transport.mjs';
const key='synthetic-fixture-key';
const sse=events=>events.map(e=>typeof e==='string'?`data: ${e}\n\n`:`${e.type?.startsWith('message_')||e.type?.startsWith('content_block_')?'event: '+e.type+'\n':''}data: ${JSON.stringify(e)}\n\n`).join('');
const completion=[{id:'synthetic',choices:[{index:0,delta:{role:'assistant',content:'ready'},finish_reason:null}]},{id:'synthetic',choices:[{index:0,delta:{},finish_reason:'stop'}],usage:{prompt_tokens:10,completion_tokens:2,total_tokens:12}},'[DONE]'];
const anthropic=[{type:'message_start',message:{id:'msg_fixture',type:'message',role:'assistant',content:[],usage:{input_tokens:10,output_tokens:0}}},{type:'content_block_start',index:0,content_block:{type:'text',text:''}},{type:'content_block_delta',index:0,delta:{type:'text_delta',text:'ready'}},{type:'content_block_stop',index:0},{type:'message_delta',delta:{stop_reason:'end_turn'},usage:{output_tokens:2}},{type:'message_stop'}];
const responses=[{type:'response.created',response:{id:'resp_fixture',status:'in_progress'}},{type:'response.output_item.added',output_index:0,item:{type:'message',id:'msg_fixture',role:'assistant',content:[]}},{type:'response.content_part.added',output_index:0,content_index:0,part:{type:'output_text',text:'',annotations:[]}},{type:'response.output_text.delta',output_index:0,content_index:0,delta:'ready'},{type:'response.output_text.done',output_index:0,content_index:0,text:'ready'},{type:'response.output_item.done',output_index:0,item:{type:'message',id:'msg_fixture',role:'assistant',content:[{type:'output_text',text:'ready',annotations:[]}]}},{type:'response.completed',response:{id:'resp_fixture',status:'completed',usage:{input_tokens:10,output_tokens:2,total_tokens:12}}}];
const fixtures=[['deepseek','openai-completions',completion],['openai','openai-responses',responses],['azure-openai-responses','azure-openai-responses',responses],['anthropic','anthropic-messages',anthropic],['google','google-generative-ai',[{candidates:[{content:{role:'model',parts:[{text:'ready'}]},finishReason:'STOP',index:0}],usageMetadata:{promptTokenCount:10,candidatesTokenCount:2,totalTokenCount:12}}]],['mistral','mistral-conversations',completion]];
function connection(provider,api){const m=piCatalog.providers.find(p=>p.id===provider).models.find(m=>m.api===api&&!m.unavailableReason);return {provider,fields:provider==='azure-openai-responses'?{AZURE_OPENAI_RESOURCE_NAME:'fixture'}:{},maxOutputTokens:512,nativeModels:[{model:m.id,api,endpoint:m.baseUrl}],model:m.id};}
function frame(n){return {requestId:randomUUID(),model:n.model,provider:n.provider,api:n.nativeModels[0].api,messageFormat:'pi_context_v1',messages:[{role:'user',content:'Say ready.',timestamp:0}],tools:[],maxOutputTokens:512,thinking:false,upstreamBudget:{inputBound:8192,reservedMicrousd:'1000000',inputMicrousdPerMillion:'1000000',outputMicrousdPerMillion:'1000000'}};}
for(const [provider,api,events]of fixtures)test(`${api}: native auth, serialization, streaming, explicit usage and no retries`,async()=>{
 const n=connection(provider,api),auth=await nativeLogin(n,key),calls=[];
 const fetcher=async(input,init)=>{calls.push({url:String(input),body:JSON.parse(init.body),headers:new Headers(init.headers)});return new Response(sse(events),{headers:{'content-type':'text/event-stream'}});};
 try {
  const result=await nativeInference(n,auth,frame(n),AbortSignal.timeout(5000),()=>{},()=>{},fetcher);
  assert.equal(result.text,'ready');assert.equal(result.inputTokens,10);assert.equal(result.outputTokens,2);assert.equal(calls.length,1);assert.equal(JSON.stringify(result).includes(key),false);
  assert.ok([...calls[0].headers].some(([k,v])=>/authorization|api-key/.test(k)&&v.includes(key))||calls[0].url.includes(key));
  let failures=0;await assert.rejects(nativeInference(n,auth,frame(n),AbortSignal.timeout(5000),()=>{},()=>{},async()=>{failures++;return new Response('{"error":{"message":"synthetic denied"}}',{status:429,headers:{'content-type':'application/json'}});}));assert.equal(failures,1);
 }finally{await auth.close();}
});
test('usage cannot default to zero; cached input and reasoning are counted once',()=>{
 const e=new NativeUsageEvidence('openai-completions');assert.throws(()=>e.normalize({input:0,output:0,cacheRead:0,cacheWrite:0}),/missing/);
 e.observe({choices:[{finish_reason:'stop'}],usage:{prompt_tokens:10,completion_tokens:5}});const u=e.normalize({input:6,cacheRead:4,cacheWrite:0,output:5,reasoning:3});assert.equal(u.input+u.cacheRead+u.cacheWrite,10);assert.equal(u.output,5);
});
test('native transcript preserves opaque signatures but excludes accounting and unrelated fields',()=>{
 const original={role:'assistant',api:'anthropic-messages',provider:'anthropic',model:'fixed',stopReason:'toolUse',timestamp:0,usage:{input:999,cost:{total:99}},sponsorId:'forbidden',content:[{type:'thinking',thinking:'',thinkingSignature:'opaque',redacted:true},{type:'toolCall',id:'call|fc_1',name:'read',arguments:{path:'a'},thoughtSignature:'signed'}]};
 const projected=piMessage(original);assert.equal(projected.content[0].thinkingSignature,'opaque');assert.equal(projected.content[1].thoughtSignature,'signed');assert.equal('usage'in projected,false);assert.equal('sponsorId'in projected,false);assert.deepEqual(piContext({messages:[projected]})[0],projected);
});
test('catalog excludes subscription/IAM/custom credential sources and blocked destinations never dispatch',async()=>{
 for(const id of ['openai-codex','github-copilot','kimi-coding','google-vertex','amazon-bedrock','zai','xiaomi-token-plan-cn'])assert.equal(piCatalog.providers.some(p=>p.id===id),false);
 const transport=restrictedPiFetch({tunnel:{port:1,capability:'synthetic'}},{endpoint:'https://api.example.test/v1'},AbortSignal.timeout(1000));
 for(const url of ['http://api.example.test/v1/chat','https://evil.test/v1/chat','https://api.example.test/not-approved'])await assert.rejects(transport(url,{method:'POST',body:'{}'}),/destination/);
});

const toolCompletion=[{id:'synthetic',choices:[{index:0,delta:{tool_calls:[{index:0,id:'call_fixture',type:'function',function:{name:'adr_probe',arguments:'{"value":"ready"}'}}]},finish_reason:null}]},{id:'synthetic',choices:[{index:0,delta:{},finish_reason:'tool_calls'}],usage:{prompt_tokens:10,completion_tokens:2,total_tokens:12}},'[DONE]'];
const toolAnthropic=[anthropic[0],{type:'content_block_start',index:0,content_block:{type:'tool_use',id:'call_fixture',name:'adr_probe',input:{}}},{type:'content_block_delta',index:0,delta:{type:'input_json_delta',partial_json:'{"value":"ready"}'}},{type:'content_block_stop',index:0},{type:'message_delta',delta:{stop_reason:'tool_use'},usage:{output_tokens:2}},{type:'message_stop'}];
const toolResponses=[responses[0],{type:'response.output_item.added',output_index:0,item:{type:'function_call',id:'fc_fixture',call_id:'call_fixture',name:'adr_probe',arguments:''}},{type:'response.function_call_arguments.delta',output_index:0,delta:'{"value":"ready"}'},{type:'response.output_item.done',output_index:0,item:{type:'function_call',id:'fc_fixture',call_id:'call_fixture',name:'adr_probe',arguments:'{"value":"ready"}'}},responses.at(-1)];
for(const [provider,api,textEvents]of fixtures)test(`${api}: native tool round trip and cancellation without replay`,async()=>{
 const n=connection(provider,api),auth=await nativeLogin(n,key),request=frame(n);
 request.qualification='tool';request.tools=[{type:'function',function:{name:'adr_probe',description:'Synthetic probe',parameters:{type:'object',properties:{value:{type:'string'}},required:['value']}}}];
 const toolEvents=api==='anthropic-messages'?toolAnthropic:api.includes('responses')?toolResponses:api==='google-generative-ai'?[{candidates:[{content:{role:'model',parts:[{functionCall:{id:'call_fixture',name:'adr_probe',args:{value:'ready'}},thoughtSignature:'c3ludGhldGljLXNpZ25hdHVyZQ=='}]},finishReason:'STOP',index:0}],usageMetadata:{promptTokenCount:10,candidatesTokenCount:2,totalTokenCount:12}}]:toolCompletion;
 try{
  let calls=0;const first=await nativeInference(n,auth,request,AbortSignal.timeout(5000),()=>{},()=>{},async()=>{calls++;return new Response(sse(toolEvents),{headers:{'content-type':'text/event-stream'}});});assert.equal(first.toolCalls.length,1);assert.deepEqual(JSON.parse(first.toolCalls[0].function.arguments),{value:'ready'});
  const second={...request,qualification:'roundtrip',requestId:randomUUID(),messages:[...request.messages,first.nativeMessage,{role:'toolResult',toolCallId:first.toolCalls[0].id,toolName:'adr_probe',content:[{type:'text',text:'ready'}],isError:false,timestamp:0}]};
  await nativeInference(n,auth,second,AbortSignal.timeout(5000),()=>{},()=>{},async(_input,init)=>{calls++;const body=JSON.parse(init.body);assert.ok(JSON.stringify(body).includes('ready'));if(api==='google-generative-ai')assert.ok(JSON.stringify(body).includes('c3ludGhldGljLXNpZ25hdHVyZQ=='));assert.equal(JSON.stringify(body).includes('cost'),false);return new Response(sse(textEvents),{headers:{'content-type':'text/event-stream'}});});assert.equal(calls,2);
  const abort=new AbortController();abort.abort();let cancelledCalls=0;await assert.rejects(nativeInference(n,auth,request,abort.signal,()=>{},()=>{},async()=>{cancelledCalls++;throw Error('unexpected');}));assert.equal(cancelledCalls,0);
 }finally{await auth.close();}
});


test('startup qualification rejects a native call that violates the declared tool schema',async()=>{
 const n=connection('deepseek','openai-completions'),auth=await nativeLogin(n,key),request=frame(n);request.tools=[{type:'function',function:{name:'adr_probe',description:'probe',parameters:{type:'object',properties:{value:{type:'string'}},required:['value']}}}];
 const malformed=structuredClone(toolCompletion);malformed[0].choices[0].delta.tool_calls[0].function.arguments='{"value":42}';
 try{await assert.rejects(nativeInference(n,auth,request,AbortSignal.timeout(5000),()=>{},()=>{},async()=>new Response(sse(malformed),{headers:{'content-type':'text/event-stream'}})),/upstream_malformed_response/);}finally{await auth.close();}
});
