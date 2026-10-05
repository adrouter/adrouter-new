import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { nativeLogin,nativeInference,NativeUsageEvidence } from '../src/pi-native.mjs';
import { piCatalog } from '../src/generated/pi-catalog.mjs';
import { piMessage,piContext } from '../src/pi-context.mjs';
import { restrictedPiFetch } from '../src/pi-transport.mjs';
import { catalogMatrix } from './helpers/pi-matrix.mjs';
const key='sk-synthetic-fixture-key';
const sse=events=>events.map(e=>typeof e==='string'?`data: ${e}\n\n`:`${e.type?.startsWith('message_')||e.type?.startsWith('content_block_')?'event: '+e.type+'\n':''}data: ${JSON.stringify(e)}\n\n`).join('');
const completion=[{id:'synthetic',choices:[{index:0,delta:{role:'assistant',content:'ready'},finish_reason:null}]},{id:'synthetic',choices:[{index:0,delta:{},finish_reason:'stop'}],usage:{prompt_tokens:10,completion_tokens:2,total_tokens:12}},'[DONE]'];
const anthropic=[{type:'message_start',message:{id:'msg_fixture',type:'message',role:'assistant',content:[],usage:{input_tokens:10,output_tokens:0}}},{type:'content_block_start',index:0,content_block:{type:'text',text:''}},{type:'content_block_delta',index:0,delta:{type:'text_delta',text:'ready'}},{type:'content_block_stop',index:0},{type:'message_delta',delta:{stop_reason:'end_turn'},usage:{output_tokens:2}},{type:'message_stop'}];
const responses=[{type:'response.created',response:{id:'resp_fixture',status:'in_progress'}},{type:'response.output_item.added',output_index:0,item:{type:'message',id:'msg_fixture',role:'assistant',content:[]}},{type:'response.content_part.added',output_index:0,content_index:0,part:{type:'output_text',text:'',annotations:[]}},{type:'response.output_text.delta',output_index:0,content_index:0,delta:'ready'},{type:'response.output_text.done',output_index:0,content_index:0,text:'ready'},{type:'response.output_item.done',output_index:0,item:{type:'message',id:'msg_fixture',role:'assistant',content:[{type:'output_text',text:'ready',annotations:[]}]}},{type:'response.completed',response:{id:'resp_fixture',status:'completed',usage:{input_tokens:10,output_tokens:2,total_tokens:12}}}];
const google=[{candidates:[{content:{role:'model',parts:[{text:'ready'}]},finishReason:'STOP',index:0}],usageMetadata:{promptTokenCount:10,candidatesTokenCount:2,totalTokenCount:12}}];
const piUsageFixture={input:10,output:2,cacheRead:0,cacheWrite:0,totalTokens:12,cost:{input:0,output:0,cacheRead:0,cacheWrite:0,total:0}};
const piEvents=[{type:'text_start',contentIndex:0},{type:'text_delta',contentIndex:0,delta:'ready'},{type:'text_end',contentIndex:0,content:'ready'},{type:'done',reason:'stop',usage:piUsageFixture}];
const familyEvents={'openai-completions':completion,'openai-responses':responses,'azure-openai-responses':responses,'anthropic-messages':anthropic,'google-generative-ai':google,'mistral-conversations':completion,'pi-messages':piEvents};
const matrix=catalogMatrix(piCatalog);
function connection(provider,api,entry){const c=entry??matrix.find(c=>c.provider===provider&&c.api===api);if(!c)throw Error('matrix_model_missing');return {provider,fields:c.fields,maxOutputTokens:4096,nativeModels:[{...c.descriptor,model:c.model,api,endpoint:c.descriptor.baseUrl}],model:c.model};}
// Only this synthetic transport may dispatch. A factory that bypasses it fails.
const realFetch=globalThis.fetch;globalThis.fetch=async()=>{throw Error('unexpected_network_access');};
test.after(()=>{globalThis.fetch=realFetch;});
function checkedFetch(n,handler){return async(input,init={})=>{
 const req=input instanceof Request?input:new Request(input,init),url=new URL(req.url),c=matrix.find(c=>c.provider===n.provider&&c.model===n.model);
 if(n.provider==='azure-openai-responses'){assert.equal(url.hostname,'fixture-resource.openai.azure.com');assert.match(url.pathname,/responses/);}
 else if(n.provider==='cloudflare-workers-ai'){assert.equal(url.hostname,'api.cloudflare.com');assert.ok(url.pathname.includes('a'.repeat(32)));}
 else {let endpoint=c.descriptor.baseUrl;for(const [key,value]of Object.entries(n.fields))endpoint=endpoint.replaceAll('{'+key+'}',value);const base=new URL(endpoint);assert.equal(url.origin,base.origin);assert.ok(url.pathname.startsWith(base.pathname.replace(/\/$/,'')));}
 assert.equal(req.method,'POST');const headers=new Headers(init.headers??req.headers);
 assert.ok([...headers].some(([k,v])=>/authorization|api-key/.test(k)&&v.includes(key))||url.searchParams.get('key')===key);
 return handler(req.url,{...init,headers,body:init.body??await req.text()});
};}
// Deliberately fragment every event across transport chunks, including JSON arguments.
function streamResponse(events){const bytes=new TextEncoder().encode(sse(events));let offset=0;return new Response(new ReadableStream({pull(controller){if(offset===bytes.length){controller.close();return;}const end=Math.min(bytes.length,offset+17);controller.enqueue(bytes.slice(offset,end));offset=end;}}),{headers:{'content-type':'text/event-stream'}});}
function frame(n){return {requestId:randomUUID(),model:n.model,provider:n.provider,api:n.nativeModels[0].api,messageFormat:'pi_context_v1',messages:[{role:'user',content:'Say ready.',timestamp:0}],tools:[],maxOutputTokens:4096,modelSettings:n.nativeModels[0].defaultSettings,thinking:n.nativeModels[0].defaultSettings?.reasoning!=='off',upstreamBudget:{inputBound:8192,reservedMicrousd:'1000000',inputMicrousdPerMillion:'1000000',outputMicrousdPerMillion:'1000000'}};}
for(const c of matrix)test(`${c.id}/text`,async()=>{
 const {provider,api}=c,events=familyEvents[api],n=connection(provider,api,c),auth=await nativeLogin(n,key),calls=[];
 const fetcher=async(input,init)=>{const body=JSON.parse(init.body);assert.equal(body.model?.id??body.model??body.config?.model??n.model,n.model);const ceiling=body.max_tokens??body.max_completion_tokens??body.max_output_tokens??body.generationConfig?.maxOutputTokens??body.options?.maxTokens;assert.equal(ceiling,4096);calls.push({url:String(input),body,headers:new Headers(init.headers)});return streamResponse(events);};
 try {
  const result=await nativeInference(n,auth,frame(n),AbortSignal.timeout(5000),()=>{},()=>{},checkedFetch(n,fetcher));
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
test('catalog excludes subscription credential sources and blocked destinations never dispatch',async()=>{
 for(const id of ['openai-codex','github-copilot','kimi-coding','zai','xiaomi-token-plan-cn'])assert.equal(piCatalog.providers.some(p=>p.id===id),false);
 const transport=restrictedPiFetch({tunnel:{port:1,capability:'synthetic'}},{endpoint:'https://api.example.test/v1'},AbortSignal.timeout(1000));
 for(const url of ['http://api.example.test/v1/chat','https://evil.test/v1/chat','https://api.example.test/not-approved'])await assert.rejects(transport(url,{method:'POST',body:'{}'}),/destination/);
});

const toolCompletion=[{id:'synthetic',choices:[{index:0,delta:{tool_calls:[{index:0,id:'call_fixture',type:'function',function:{name:'adr_probe',arguments:'{"value":'}}]},finish_reason:null}]},{id:'synthetic',choices:[{index:0,delta:{tool_calls:[{index:0,function:{arguments:'"ready"}'}}]},finish_reason:null}]},{id:'synthetic',choices:[{index:0,delta:{},finish_reason:'tool_calls'}],usage:{prompt_tokens:10,completion_tokens:2,total_tokens:12}},'[DONE]'];
const toolAnthropic=[anthropic[0],{type:'content_block_start',index:0,content_block:{type:'tool_use',id:'call_fixture',name:'adr_probe',input:{}}},{type:'content_block_delta',index:0,delta:{type:'input_json_delta',partial_json:'{"value":'}},{type:'content_block_delta',index:0,delta:{type:'input_json_delta',partial_json:'"ready"}'}},{type:'content_block_stop',index:0},{type:'message_delta',delta:{stop_reason:'tool_use'},usage:{output_tokens:2}},{type:'message_stop'}];
const toolResponses=[responses[0],{type:'response.output_item.added',output_index:0,item:{type:'function_call',id:'fc_fixture',call_id:'call_fixture',name:'adr_probe',arguments:''}},{type:'response.function_call_arguments.delta',output_index:0,delta:'{"value":'},{type:'response.function_call_arguments.delta',output_index:0,delta:'"ready"}'},{type:'response.output_item.done',output_index:0,item:{type:'function_call',id:'fc_fixture',call_id:'call_fixture',name:'adr_probe',arguments:'{"value":"ready"}'}},responses.at(-1)];
for(const c of matrix)test(`${c.id}/tools`,async()=>{
 const {provider,api}=c,textEvents=familyEvents[api],n=connection(provider,api,c),auth=await nativeLogin(n,key),request=frame(n);
 request.qualification='tool';request.tools=[{type:'function',function:{name:'adr_probe',description:'Synthetic probe',parameters:{type:'object',properties:{value:{type:'string'}},required:['value']}}}];
 const toolEvents=api==='pi-messages'?[{type:'toolcall_start',contentIndex:0,id:'call_fixture',name:'adr_probe'},{type:'toolcall_delta',contentIndex:0,delta:'{"value":"ready"}'},{type:'toolcall_end',contentIndex:0,toolCall:{type:'toolCall',id:'call_fixture',name:'adr_probe',arguments:{value:'ready'}}},{type:'done',reason:'toolUse',usage:piUsageFixture}]:api==='anthropic-messages'?toolAnthropic:api.includes('responses')?toolResponses:api==='google-generative-ai'?[{candidates:[{content:{role:'model',parts:[{functionCall:{id:'call_fixture',name:'adr_probe',args:{value:'ready'}},thoughtSignature:'c3ludGhldGljLXNpZ25hdHVyZQ=='}]},finishReason:'STOP',index:0}],usageMetadata:{promptTokenCount:10,candidatesTokenCount:2,totalTokenCount:12}}]:toolCompletion;
 try{
  let calls=0;const first=await nativeInference(n,auth,request,AbortSignal.timeout(5000),()=>{},()=>{},checkedFetch(n,async()=>{calls++;return streamResponse(toolEvents);}));assert.equal(first.toolCalls.length,1);assert.deepEqual(JSON.parse(first.toolCalls[0].function.arguments),{value:'ready'});
  const second={...request,qualification:'roundtrip',requestId:randomUUID(),messages:[...request.messages,first.nativeMessage,{role:'toolResult',toolCallId:first.toolCalls[0].id,toolName:'adr_probe',content:[{type:'text',text:'ready'}],isError:false,timestamp:0}]};
  await nativeInference(n,auth,second,AbortSignal.timeout(5000),()=>{},()=>{},checkedFetch(n,async(_input,init)=>{calls++;const body=JSON.parse(init.body);assert.ok(JSON.stringify(body).includes('ready'));assert.ok(JSON.stringify(body).includes('adr_probe'));if(api==='anthropic-messages')assert.ok(body.messages.some(m=>Array.isArray(m.content)&&m.content.some(c=>c.type==='tool_result')));else if(api.includes('responses'))assert.ok(body.input.some(m=>m.type==='function_call_output'));else if(api==='google-generative-ai')assert.ok(body.contents.some(m=>m.parts?.some(p=>p.functionResponse)));else if(api==='pi-messages')assert.ok(body.context.messages.some(m=>m.role==='toolResult'));else assert.ok(body.messages.some(m=>m.role==='tool'));if(api==='google-generative-ai')assert.ok(JSON.stringify(body).includes('c3ludGhldGljLXNpZ25hdHVyZQ=='));assert.equal(JSON.stringify(body).includes('cost'),false);return streamResponse(textEvents);}));assert.equal(calls,2);
  const third={...request,qualification:undefined,requestId:randomUUID(),messages:[...second.messages,{role:'user',content:'A subsequent turn.',timestamp:1}]};
  const later=await nativeInference(n,auth,third,AbortSignal.timeout(5000),()=>{},()=>{},checkedFetch(n,async()=>{calls++;return streamResponse(textEvents);}));assert.equal(later.text,'ready');assert.equal(calls,3);
  const abort=new AbortController();abort.abort();let cancelledCalls=0;await assert.rejects(nativeInference(n,auth,request,abort.signal,()=>{},()=>{},async()=>{cancelledCalls++;throw Error('unexpected');}));assert.equal(cancelledCalls,0);
 }finally{await auth.close();}
});


test('startup qualification rejects a native call that violates the declared tool schema',async()=>{
 const n=connection('deepseek','openai-completions'),auth=await nativeLogin(n,key),request=frame(n);request.tools=[{type:'function',function:{name:'adr_probe',description:'probe',parameters:{type:'object',properties:{value:{type:'string'}},required:['value']}}}];
 const malformed=structuredClone(toolCompletion);malformed.splice(1,1);malformed[0].choices[0].delta.tool_calls[0].function.arguments='{"value":42}';
 try{await assert.rejects(nativeInference(n,auth,request,AbortSignal.timeout(5000),()=>{},()=>{},async()=>new Response(sse(malformed),{headers:{'content-type':'text/event-stream'}})),/upstream_malformed_response/);}finally{await auth.close();}
});

test('API-key login rejects subscription tokens before native adapter resolution',async()=>{await assert.rejects(nativeLogin(connection('anthropic','anthropic-messages'),'sk-ant-oat-synthetic-not-valid'),/metered_api_key_required/);});

for(const api of Object.keys(familyEvents))test(`${api}: failure, timeout, incomplete and inconsistent usage cannot replay`,async()=>{
 const c=matrix.find(c=>c.api===api),n=connection(c.provider,api,c),auth=await nativeLogin(n,key),request=frame(n);
 try{
  for(const status of [401,403,429]){let calls=0;await assert.rejects(nativeInference(n,auth,request,AbortSignal.timeout(5000),()=>{},()=>{},checkedFetch(n,async()=>{calls++;return new Response('{"error":{"message":"synthetic rejection"}}',{status,headers:{'content-type':'application/json'}});})));assert.equal(calls,1);}
  let calls=0;const abort=new AbortController();
  await assert.rejects(nativeInference(n,auth,request,abort.signal,()=>{},()=>{},checkedFetch(n,async()=>{calls++;abort.abort();throw Error('synthetic timeout');})));assert.equal(calls,1);
  await assert.rejects(nativeInference(n,auth,request,AbortSignal.timeout(5000),()=>{},()=>{},checkedFetch(n,async()=>streamResponse([]))));
  const usage=new NativeUsageEvidence(api);for(const e of familyEvents[api])if(typeof e==='object')usage.observe(e);
  assert.throws(()=>usage.normalize({input:11,output:2,cacheRead:0,cacheWrite:0}),/invalid/);
  await assert.rejects(nativeInference(n,auth,{...request,model:'unavailable-fixture'},AbortSignal.timeout(5000),()=>{},()=>{},async()=>{throw Error('must_not_dispatch');}),/binding/);
  await assert.rejects(nativeInference(n,auth,{...request,messageFormat:'wrong'},AbortSignal.timeout(5000),()=>{},()=>{},async()=>{throw Error('must_not_dispatch');}),/binding/);
 }finally{await auth.close();}
});
test('native provider fallback is rejected even when its stream and usage succeed',async()=>{
 const n=connection('deepseek','openai-completions'),auth=await nativeLogin(n,key),events=structuredClone(completion);events[0].model='unapproved-fallback';
 try{await assert.rejects(nativeInference(n,auth,frame(n),AbortSignal.timeout(5000),()=>{},()=>{},checkedFetch(n,async()=>streamResponse(events))),/fallback_rejected/);}finally{await auth.close();}
});

test('Anthropic streamed reasoning signature survives native history and tool continuation',async()=>{
 const c=matrix.find(c=>c.provider==='anthropic'&&c.descriptor.reasoning),n=connection(c.provider,c.api,c);n.maxOutputTokens=4096;
 const auth=await nativeLogin(n,key),request={...frame(n),thinking:true,maxOutputTokens:4096};
 const events=[anthropic[0],{type:'content_block_start',index:0,content_block:{type:'thinking',thinking:'',signature:''}},{type:'content_block_delta',index:0,delta:{type:'thinking_delta',thinking:'Synthetic reasoning.'}},{type:'content_block_delta',index:0,delta:{type:'signature_delta',signature:'opaque-fixture-signature'}},{type:'content_block_stop',index:0},...anthropic.slice(1).map(e=>({...e,...('index'in e?{index:1}:{})}))];
 try{
  const first=await nativeInference(n,auth,request,AbortSignal.timeout(5000),()=>{},()=>{},checkedFetch(n,async()=>streamResponse(events)));
  assert.equal(first.nativeMessage.content.find(c=>c.type==='thinking').thinkingSignature,'opaque-fixture-signature');
  const next={...request,requestId:randomUUID(),messages:[...request.messages,first.nativeMessage,{role:'user',content:'Continue.',timestamp:1}]};
  await nativeInference(n,auth,next,AbortSignal.timeout(5000),()=>{},()=>{},checkedFetch(n,async(_url,init)=>{assert.ok(JSON.stringify(JSON.parse(init.body)).includes('opaque-fixture-signature'));return streamResponse(anthropic);}));
 }finally{await auth.close();}
});
test('DeepSeek streamed cache and reasoning usage are explicit and counted once',async()=>{
 const n=connection('deepseek','openai-completions'),auth=await nativeLogin(n,key),events=[{id:'synthetic',choices:[{index:0,delta:{reasoning_content:'Synthetic reasoning.',content:'ready'},finish_reason:null}]},{id:'synthetic',choices:[{index:0,delta:{},finish_reason:'stop'}],usage:{prompt_tokens:10,completion_tokens:5,total_tokens:15,prompt_tokens_details:{cached_tokens:4},completion_tokens_details:{reasoning_tokens:3}}},'[DONE]'];
 try{const result=await nativeInference(n,auth,{...frame(n),thinking:true},AbortSignal.timeout(5000),()=>{},()=>{},checkedFetch(n,async()=>streamResponse(events)));assert.equal(result.inputTokens,10);assert.equal(result.outputTokens,5);assert.equal(result.nativeUsage.cacheRead,4);assert.equal(result.nativeUsage.reasoning,3);}finally{await auth.close();}
});

for(const id of ['deepseek-flash','deepseek-v4-pro'])test(`explicit ${id} qualification preserves pinned settings, thinking off and bounded tool roundtrip`,async()=>{
 const m=piCatalog.providers.find(p=>p.id==='deepseek').models.find(m=>m.id===id);assert.ok(m);
 const n={provider:'deepseek',fields:{},connectorProtocol:'pi_native_v3',nativeRevision:1,connection:{kind:'builtin',headerNames:[]},maxOutputTokens:4096,model:id,nativeModels:[{...m,model:id,api:m.api,endpoint:m.baseUrl,capabilities:m.capabilities,contextWindowTokens:m.contextWindow,maxOutputTokens:4096,price:m.cost}]};
 const auth=await nativeLogin(n,key),request={...frame(n),nativeRevision:1,endpoint:m.baseUrl,qualification:'tool',tools:[{type:'function',function:{name:'adr_probe',description:'probe',parameters:{type:'object',properties:{value:{type:'string'}},required:['value']}}}]};let calls=0;
 const transport=async(_url,init)=>{const body=JSON.parse(init.body);calls++;assert.equal(body.model,id);assert.equal(body.max_tokens??body.max_completion_tokens,4096);assert.deepEqual(body.thinking,{type:'disabled'});return streamResponse(calls===1?toolCompletion:completion);};
 try{
  const first=await nativeInference(n,auth,request,AbortSignal.timeout(5000),()=>{},()=>{},transport);assert.equal(first.nativeUsage.input,10);assert.equal(first.nativeUsage.output,2);
  const result=await nativeInference(n,auth,{...request,qualification:'roundtrip',requestId:randomUUID(),messages:[...request.messages,first.nativeMessage,{role:'toolResult',toolCallId:first.toolCalls[0].id,toolName:'adr_probe',content:[{type:'text',text:'ready'}],isError:false,timestamp:0}]},AbortSignal.timeout(5000),()=>{},()=>{},transport);assert.equal(result.text,'ready');assert.equal(calls,2);
  for(const status of [400,401,402,403,404,429,500]){let count=0;await assert.rejects(nativeInference(n,auth,request,AbortSignal.timeout(5000),()=>{},()=>{},async()=>{count++;return Response.json({error:{message:'private synthetic rejection'}},{status});}),e=>{assert.equal(e.statusCode,status);assert.equal(e.message.includes('private synthetic'),false);return true;});assert.equal(count,1);}
 }finally{await auth.close();}
});

for(const id of ['deepseek-flash','deepseek-v4-pro'])for(const effort of ['high','max'])test(`DeepSeek ${id} ${effort} retains reasoning across tool and later turns without changing output authority`,async()=>{
 const c=matrix.find(c=>c.provider==='deepseek'&&c.model===id);assert.ok(c);const n=connection(c.provider,c.api,c),auth=await nativeLogin(n,key);
 const request={...frame(n),thinking:true,modelSettings:{reasoning:effort},tools:[{type:'function',function:{name:'adr_probe',description:'probe',parameters:{type:'object',properties:{value:{type:'string'}},required:['value']}}}]};let dispatches=0,previous;
 try{
  for(let turn=0;turn<3;turn++){
   if(previous){request.messages.push(previous.nativeMessage);if(previous.toolCalls.length)request.messages.push({role:'toolResult',toolCallId:previous.toolCalls[0].id,toolName:'adr_probe',content:[{type:'text',text:'ready'}],isError:false,timestamp:turn});else request.messages.push({role:'user',content:'Continue the synthetic task',timestamp:turn});}
   previous=await nativeInference(n,auth,{...request,requestId:randomUUID()},AbortSignal.timeout(3000),()=>{},()=>{},async(_url,init)=>{
    dispatches++;const body=JSON.parse(init.body);assert.equal(body.model,id);assert.equal(body.max_tokens,4096);assert.equal(body.reasoning_effort,effort);assert.deepEqual(body.thinking,{type:'enabled'});
    const history=body.messages.filter(m=>m.role==='assistant');assert.equal(history.length,turn);for(const assistant of history)assert.equal(assistant.reasoning_content,'Synthetic retained reasoning.');
    const chunks=structuredClone(turn===0?toolCompletion:completion);chunks[0].choices[0].delta.reasoning_content='Synthetic retained reasoning.';return streamResponse(chunks);
   });
  }
  assert.equal(dispatches,3);
 }finally{await auth.close();}
});

test('Custom API DeepSeek connection retains verified off control and output limit under an independent name',async()=>{
 const model=piCatalog.providers.find(p=>p.id==='deepseek').models.find(m=>m.id==='deepseek-flash');
 const n={provider:'my-deepseek-api',connectorProtocol:'pi_native_v3',nativeRevision:1,fields:{},connection:{kind:'custom',baseUrl:model.baseUrl,api:model.api,headerNames:[]},maxOutputTokens:4096,model:model.id,nativeModels:[{...model,model:model.id,endpoint:model.baseUrl,maxOutputTokens:4096,contextWindowTokens:model.contextWindow,price:model.cost}]};
 const auth=await nativeLogin(n,key);let calls=0;
 try{const result=await nativeInference(n,auth,{...frame(n),nativeRevision:1,endpoint:model.baseUrl},AbortSignal.timeout(3000),()=>{},()=>{},async(_url,init)=>{calls++;const body=JSON.parse(init.body);assert.equal(body.model,model.id);assert.deepEqual(body.thinking,{type:'disabled'});assert.equal(body.max_tokens,4096);return streamResponse(completion);});assert.equal(result.text,'ready');assert.equal(result.nativeMessage.provider,'my-deepseek-api');assert.equal(calls,1);}finally{await auth.close();}
});


test('authorized setup returns invalid probe evidence for precise host validation while ordinary tools remain strict',async()=>{
 const n=connection('deepseek','openai-completions'),auth=await nativeLogin(n,key),request=frame(n);
 request.type='qualification';request.qualification='setup_probe';request.tools=[{type:'function',function:{name:'adr_setup_probe',description:'Synthetic setup probe',parameters:{type:'object',properties:{value:{type:'string'}},required:['value']}}}];
 const events=structuredClone(toolCompletion);events[0].choices[0].delta.tool_calls[0].function.name='adr_setup_probe';events[0].choices[0].delta.tool_calls[0].function.arguments='{"value":42}';
 try{const result=await nativeInference(n,auth,request,AbortSignal.timeout(5000),()=>{},()=>{},checkedFetch(n,async()=>streamResponse(events)));assert.equal(JSON.parse(result.toolCalls[0].function.arguments).value,42);assert.equal(result.nativeUsage.input,10);}
 finally{await auth.close();}
});
