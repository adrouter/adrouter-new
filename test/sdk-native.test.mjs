import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {providerCatalog} from '../src/generated/provider-catalog.mjs';
import {sdkInference,sdkModel,normalizeSDKUsage,sdkPrompt,sdkCompatibility} from '../src/sdk-native.mjs';
const credentials={key:'synthetic-api-key',headers:{}};
const sse=events=>new Response(events.map(e=>'data: '+(typeof e==='string'?e:JSON.stringify(e))+'\n\n').join(''),{headers:{'content-type':'text/event-stream'}});
const events=(tool=false,model='synthetic')=>[{id:'synthetic',object:'chat.completion.chunk',created:0,model,choices:[{index:0,delta:tool?{tool_calls:[{index:0,id:'call_test',type:'function',function:{name:'probe',arguments:'{"value":"ready"}'}}]}:{content:'ready'},finish_reason:null}]},{id:'synthetic',object:'chat.completion.chunk',created:0,model,choices:[{index:0,delta:{},finish_reason:tool?'tool_calls':'stop'}],usage:{prompt_tokens:10,completion_tokens:2,total_tokens:12}},'[DONE]'];
const fieldValue=name=>name.endsWith('BASE_URL')?'https://fixture.example.test':/ACCOUNT_ID/.test(name)?'a'.repeat(32):/REGION|LOCATION/.test(name)?'us-east-1':'fixture';
const connection=(p,m)=>{const fields=Object.fromEntries(p.fields.map(f=>[f.name,fieldValue(f.name)]));let endpoint=m.baseUrl;for(const [k,v]of Object.entries(fields))endpoint=endpoint.replaceAll('{'+k+'}',v);return {connectorProtocol:'pi_native_v3',provider:p.id,nativeRevision:1,fields,maxOutputTokens:4096,nativeModels:[{...m,model:m.id,endpoint}]};};
const frame=n=>({type:'inference',requestId:randomUUID(),model:n.nativeModels[0].model,provider:n.provider,api:n.nativeModels[0].api,nativeRevision:1,endpoint:n.nativeModels[0].endpoint,messageFormat:'pi_context_v1',messages:[{role:'user',content:'synthetic',timestamp:0}],tools:[],maxOutputTokens:4096,modelSettings:{reasoning:'off'},upstreamBudget:{inputBound:8192,reservedMicrousd:'1000000',inputMicrousdPerMillion:'1',outputMicrousdPerMillion:'1'}});
for(const p of providerCatalog.providers){
 const m=p.models.find(m=>m.adapter?.id==='@ai-sdk/openai-compatible');if(!m)continue;
 test(`sdk/${p.id}/stream-tool-roundtrip-usage-cancellation`,async()=>{
  const n=connection(p,m),request=frame(n);let calls=0;
  request.tools=[{type:'function',function:{name:'probe',description:'synthetic',parameters:{type:'object',properties:{value:{type:'string'}},required:['value'],additionalProperties:false}}}];
  const transport=async(input,init)=>{calls++;const url=new URL(typeof input==='string'?input:input.url),body=JSON.parse(init.body);assert.equal(url.origin,new URL(n.nativeModels[0].endpoint).origin);assert.equal(body.model,m.id);assert.equal(body.max_tokens??body.max_completion_tokens,4096);assert.ok(new Headers(init.headers).get('authorization')?.includes(credentials.key));return sse(events(calls===1,m.id));};
  const first=await sdkInference(n,{sdkSecrets:credentials},request,AbortSignal.timeout(3000),()=>{},()=>{},transport);assert.equal(first.nativeUsage.input,10);assert.equal(first.nativeUsage.output,2);assert.equal(first.toolCalls[0].id,'call_test');
  const next={...request,requestId:randomUUID(),messages:[...request.messages,first.nativeMessage,{role:'toolResult',toolCallId:'call_test',toolName:'probe',content:[{type:'text',text:'ready'}],isError:false,timestamp:0}]};
  const second=await sdkInference(n,{sdkSecrets:credentials},next,AbortSignal.timeout(3000),()=>{},()=>{},transport);assert.equal(second.text,'ready');assert.equal(calls,2);
  const abort=new AbortController();abort.abort();await assert.rejects(sdkInference(n,{sdkSecrets:credentials},request,abort.signal,()=>{},()=>{},async()=>{throw Error('must not dispatch');}));
 });
}
test('SDK usage requires authoritative totals and retains replay-only metadata',()=>{
 assert.throws(()=>normalizeSDKUsage({inputTokens:{},outputTokens:{}}),/usage_missing/);
 assert.deepEqual(normalizeSDKUsage({inputTokens:{total:10,cacheRead:4,cacheWrite:1},outputTokens:{total:5,reasoning:2}}),{input:5,output:5,cacheRead:4,cacheWrite:1,reasoning:2});
 assert.equal(sdkPrompt([{role:'assistant',content:[{type:'thinking',thinking:'synthetic',providerMetadata:{anthropic:{signature:'opaque'}}}]}])[0].content[0].providerOptions.anthropic.signature,'opaque');
});
test('explicit SDK compatibility settings reach the serialized upstream request',async()=>{
 const p=providerCatalog.providers.find(p=>p.models.some(m=>m.adapter?.id==='@ai-sdk/openai-compatible'));
 const m=p.models.find(m=>m.adapter?.id==='@ai-sdk/openai-compatible'),n=connection(p,m),request=frame(n);
 n.nativeModels[0].explicitCompat={supportsStore:true,supportsDeveloperRole:false,supportsReasoningEffort:false,supportsUsageInStreaming:true,maxTokensField:'max_completion_tokens',requiresToolResultName:true,requiresAssistantAfterToolResult:true,requiresThinkingAsText:true,thinkingFormat:'openai'};
 request.messages=[{role:'system',content:'synthetic instruction',timestamp:0},{role:'assistant',api:m.api,provider:p.id,model:m.id,content:[{type:'toolCall',id:'call_test',name:'probe',arguments:{}}],timestamp:0,stopReason:'toolUse'},{role:'toolResult',toolCallId:'call_test',toolName:'probe',content:[{type:'text',text:'ready'}],isError:false,timestamp:0},...request.messages];
 await sdkInference(n,{sdkSecrets:credentials},request,AbortSignal.timeout(3000),()=>{},()=>{},async(_input,init)=>{
  const body=JSON.parse(init.body);assert.equal(body.max_completion_tokens,4096);assert.equal(body.max_tokens,undefined);assert.equal(body.store,false);assert.deepEqual(body.stream_options,{include_usage:true});assert.equal(body.reasoning_effort,undefined);
  assert.equal(body.messages.find(v=>v.role==='tool').name,'probe');assert.equal(body.messages.at(-2).role,'assistant');assert.equal(body.messages[0].role,'system');return sse(events(false,m.id));
 });
 const translated=sdkCompatibility(n,n.nativeModels[0]).transformRequestBody({messages:[{role:'developer',content:'synthetic'},{role:'assistant',content:'answer',reasoning_content:'reason'}]});assert.equal(translated.messages[0].role,'system');assert.equal(translated.messages[1].content,'reason\n\nanswer');assert.equal(translated.messages[1].reasoning_content,undefined);
 n.nativeModels[0].explicitCompat={supportsDeveloperRole:true,requiresAssistantAfterToolResult:true};n.nativeModels[0].capabilities=['thinking_v1'];
 const developer=sdkCompatibility(n,n.nativeModels[0]).transformRequestBody({messages:[{role:'system',content:'synthetic'},{role:'assistant',content:null}]});assert.equal(developer.messages[0].role,'developer');assert.equal(developer.messages[1].content,'');
});
test('unsupported explicit SDK settings reject before any upstream dispatch',async()=>{
 const p=providerCatalog.providers.find(p=>p.models.some(m=>m.adapter?.id==='@ai-sdk/openai-compatible')),m=p.models.find(m=>m.adapter?.id==='@ai-sdk/openai-compatible'),n=connection(p,m);
 for(const overrides of [{unknownSetting:true},{thinkingFormat:'deepseek'}]){
  n.nativeModels[0].explicitCompat=overrides;let calls=0;await assert.rejects(sdkInference(n,{sdkSecrets:credentials},frame(n),AbortSignal.timeout(3000),()=>{},()=>{},async()=>{calls++;throw Error('must not dispatch');}),e=>e.code==='sdk_compatibility_unsupported');assert.equal(calls,0);
 }
 n.nativeModels[0].adapter={id:'@ai-sdk/anthropic'};n.nativeModels[0].explicitCompat={supportsStore:false};assert.throws(()=>sdkCompatibility(n,n.nativeModels[0]),e=>e.code==='sdk_compatibility_unsupported');
});
