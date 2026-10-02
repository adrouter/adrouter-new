import Ajv from 'ajv';
// Imported only in the isolated provider guest (or synthetic fixture tests).
import { createModels, InMemoryCredentialStore, clampThinkingLevel } from '@earendil-works/pi-ai';
import { resolveGoogleThinkingLevel, usesGoogleThinkingLevel, toGoogleThinkingLevel } from '@earendil-works/pi-ai/api/google-shared';
import { piCatalog } from './generated/pi-catalog.mjs';
import { piMessage, piDisplay } from './pi-context.mjs';
import { restrictedPiFetch } from './pi-transport.mjs';
const fail=code=>Object.assign(Error(code),{code});
const integer=n=>Number.isSafeInteger(n)&&n>=0;
export async function nativeLogin(node,key,signal) {
  const p=piCatalog.providers.find(p=>p.id===node.provider);if(!p)throw fail('pi_provider_not_supported');
  if(typeof key!=='string'||!/^[\x20-\x7e]{1,4096}$/.test(key))throw fail('credential_format_invalid');
  // Pi's Anthropic adapter detects this token family even through api_key auth.
  // Never let a pasted subscription token select that implicit OAuth path.
  if(key.includes('sk-ant-oat'))throw fail('metered_api_key_required');
  const module=await import('@earendil-works/pi-ai/providers/'+p.module),provider=module[p.factory]();
  const credentials=new InMemoryCredentialStore();
  const models=createModels({credentials,authContext:{env:async()=>undefined,fileExists:async()=>false}});
  models.setProvider({...provider,auth:{apiKey:provider.auth.apiKey}});
  await models.login(p.id,'api_key',{signal,notify:()=>{},prompt:async prompt=>{
    if(prompt.type==='secret')return key;
    if(prompt.type==='text'&&p.id==='cloudflare-workers-ai')return node.fields.CLOUDFLARE_ACCOUNT_ID;
    throw fail('pi_auth_flow_not_allowed');
  }});
  const auth=await models.getAuth(p.id);if(!auth?.auth.apiKey)throw fail('pi_api_key_required');
  key='';return {models,close:()=>models.logout(p.id)};
}
export class NativeUsageEvidence {
  constructor(api){this.api=api;this.input=false;this.output=false;this.final=false;this.events=0;this.terminal=false;this.reasoningReported=false;}
  observe(e){
    this.events++;
    let u;
    if(['openai-completions','mistral-conversations'].includes(this.api)){this.terminal ||= !!e.choices?.some(c=>['stop','length','tool_calls'].includes(c.finish_reason));u=e.usage;if(u){this.input=integer(u.prompt_tokens);this.output=integer(u.completion_tokens);this.rawInput=u.prompt_tokens;this.rawOutput=u.completion_tokens;this.reasoningReported=integer(u.completion_tokens_details?.reasoning_tokens);this.final=this.input&&this.output;}}
    else if(['openai-responses','azure-openai-responses'].includes(this.api)&&e.type==='response.completed'){u=e.response?.usage;this.input=integer(u?.input_tokens);this.output=integer(u?.output_tokens);this.rawInput=u?.input_tokens;this.rawOutput=u?.output_tokens;this.reasoningReported=integer(u?.output_tokens_details?.reasoning_tokens);this.final=this.input&&this.output;this.terminal=true;}
    else if(this.api==='google-generative-ai'){this.terminal ||= !!e.candidates?.some(c=>['STOP','MAX_TOKENS'].includes(c.finishReason));u=e.usageMetadata;if(u){this.input=integer(u.promptTokenCount);this.output=integer(u.candidatesTokenCount);this.rawInput=u.promptTokenCount;this.rawOutput=u.candidatesTokenCount+(u.thoughtsTokenCount??0);this.reasoningReported=integer(u.thoughtsTokenCount);this.final=this.input&&this.output&&integer(u.totalTokenCount);}}
    else if(this.api==='anthropic-messages'){
      if(e.type==='message_start'){u=e.message?.usage;this.input=integer(u?.input_tokens);this.anthropicUsage={...u};this.rawInput=u?.input_tokens+(u?.cache_read_input_tokens??0)+(u?.cache_creation_input_tokens??0);}
      if(e.type==='message_delta'){u=e.usage;this.anthropicUsage={...this.anthropicUsage,...u};this.rawInput=this.anthropicUsage.input_tokens+(this.anthropicUsage.cache_read_input_tokens??0)+(this.anthropicUsage.cache_creation_input_tokens??0);this.output=integer(u?.output_tokens);this.rawOutput=u?.output_tokens;}
      if(e.type==='message_stop'){this.terminal=true;this.final=this.input&&this.output;}
    }
  }
  normalize(usage){
    if(!this.final||!this.terminal||!['input','output','cacheRead','cacheWrite'].every(k=>integer(usage[k])))throw fail('upstream_usage_missing');
    if(usage.input+usage.cacheRead+usage.cacheWrite!==this.rawInput||usage.output!==this.rawOutput)throw fail('upstream_usage_invalid');
    if(usage.cacheWrite1h!==undefined&&(!integer(usage.cacheWrite1h)||usage.cacheWrite1h>usage.cacheWrite))throw fail('upstream_usage_invalid');
    if(usage.reasoning!==undefined&&(!integer(usage.reasoning)||usage.reasoning>usage.output))throw fail('upstream_usage_invalid');
    return {input:usage.input,output:usage.output,cacheRead:usage.cacheRead,cacheWrite:usage.cacheWrite,...(usage.cacheWrite1h===undefined?{}:{cacheWrite1h:usage.cacheWrite1h}),reasoning:this.reasoningReported?(usage.reasoning??null):null};
  }
}
export async function nativeInference(node,auth,frame,signal,onTiming=()=>{},onEvent=()=>{},fetchFixture) {
  signal?.throwIfAborted();
  const descriptor=node.nativeModels.find(m=>m.model===frame.model);
  if(!descriptor||frame.provider!==node.provider||frame.api!==descriptor.api||frame.messageFormat!=='pi_context_v1')throw fail('pi_model_binding_mismatch');
  const inputBound=Buffer.byteLength(JSON.stringify({messages:frame.messages,...(frame.tools?.length?{tools:frame.tools}:{})}))+frame.messages.length*64+1024;
  const authority=frame.upstreamBudget;
  if(!authority||inputBound>authority.inputBound||frame.maxOutputTokens>node.maxOutputTokens)throw fail('upstream_authority_required');
  const worst=(BigInt(inputBound)*BigInt(authority.inputMicrousdPerMillion)+BigInt(frame.maxOutputTokens)*BigInt(authority.outputMicrousdPerMillion)+999999n)/1000000n;
  if(worst>BigInt(authority.reservedMicrousd))throw fail('upstream_authority_exceeded');
  const model=auth.models.getModel(node.provider,frame.model);if(!model)throw fail('pi_model_not_supported');
  const fixed={...model,compat:{...model.compat,allowedFallbackModels:[]}};
  const evidence=new NativeUsageEvidence(model.api),started=Date.now();let statusCode=null,headersMs=null,sequence=0;
  const transport=fetchFixture??restrictedPiFetch(node,descriptor,signal,status=>{statusCode=status;headersMs=Date.now()-started;});
  const context={messages:frame.messages.map(piMessage),tools:frame.tools.map(t=>({name:t.function.name,description:t.function.description,parameters:t.function.parameters}))};
  const options={signal,maxTokens:frame.maxOutputTokens,maxRetries:0,transport:'sse',timeoutMs:120000,fetch:transport,env:{...node.fields},cacheRetention:'none',...(frame.qualification?{toolChoice:frame.qualification==='tool'?(model.api==='anthropic-messages'||model.api==='google-generative-ai'||model.api==='mistral-conversations'?'any':'required'):'none'}:{}),onResponse:response=>{statusCode=response.status;headersMs=Date.now()-started;},onProviderStreamEvent:event=>evidence.observe(event)};
  // The raw native stream avoids Pi's history-usage estimator: replay has no
  // accounting fields. It also keeps the accepted output ceiling intact (the
  // convenience streamSimple helper may add a separate thinking budget).
  const level=frame.thinking?clampThinkingLevel(model,'medium'):undefined;
  if(model.api==='anthropic-messages')Object.assign(options,{thinkingEnabled:!!level,...(model.compat?.forceAdaptiveThinking?{effort:level?(model.thinkingLevelMap?.[level]??level):undefined}:{thinkingBudgetTokens:Math.max(0,Math.min(8192,frame.maxOutputTokens-1024))})});
  else if(model.api==='google-generative-ai')options.thinking=!level?{enabled:false}:usesGoogleThinkingLevel(model)?{enabled:true,level:toGoogleThinkingLevel(resolveGoogleThinkingLevel(model,level))}:{enabled:true,budgetTokens:Math.max(0,Math.min(8192,frame.maxOutputTokens-128))};
  else if(model.api==='mistral-conversations')Object.assign(options,{reasoningEffort:model.thinkingLevelMap?(level?(model.thinkingLevelMap[level]??'high'):(model.thinkingLevelMap.off??undefined)):undefined,promptMode:level&&!model.thinkingLevelMap?'reasoning':undefined});
  else options.reasoningEffort=level;
  let oldFetch;
  try {
    // The pinned Google SDK calls global fetch and Pi rejects custom fetch.
    // There is one inference at a time in this guest. Control traffic keeps its
    // separately captured fetch; no host/global transport is modified.
    if(model.api==='google-generative-ai'){oldFetch=globalThis.fetch;globalThis.fetch=transport;options.fetch=transport;}
    const stream=auth.models.stream(fixed,context,options);
    let final;
    for await(const event of stream){
      if(event.type==='text_delta'||event.type==='thinking_delta'&&frame.thinking){
        for(let i=0;i<event.delta.length;i+=8192)await onEvent({type:'coding_delta',requestId:frame.requestId,sequence:++sequence,kind:event.type==='text_delta'?'text':'thinking',text:event.delta.slice(i,i+8192)});
      }
      if(event.type==='done')final=event.message;
      if(event.type==='error')throw fail(signal?.aborted?'upstream_timeout':statusCode===401||statusCode===403?'upstream_authentication_failed':statusCode===429?'upstream_rate_limited':statusCode===400?'upstream_parameter_rejected':statusCode===404?'upstream_invalid_model':'upstream_failed_outcome_unknown');
    }
    if(!final||!['stop','length','toolUse'].includes(final.stopReason))throw fail('upstream_malformed_response');
    if(final.responseModel&&final.responseModel!==model.id)throw fail('pi_model_fallback_rejected');
    const nativeMessage=piMessage(final),display=piDisplay(nativeMessage),usage=evidence.normalize(final.usage);
    if(!frame.thinking)display.thinking='';
    if(usage.input+usage.cacheRead+usage.cacheWrite>authority.inputBound||usage.output>frame.maxOutputTokens)throw fail('upstream_usage_invalid');
    if(display.toolCalls.length>8||display.toolCalls.some(c=>!frame.tools.some(t=>t.function.name===c.function.name)))throw fail('upstream_tool_invalid');
    for(const call of display.toolCalls){const definition=frame.tools.find(t=>t.function.name===call.function.name);if(!new Ajv({strict:false,validateFormats:false}).compile(definition.function.parameters)(JSON.parse(call.function.arguments)))throw fail('upstream_malformed_response');}
    for(const [index,call]of display.toolCalls.entries())for(let i=0;i<call.function.arguments.length;i+=8192)await onEvent({type:'coding_delta',requestId:frame.requestId,sequence:++sequence,kind:'tool',index,id:call.id,name:call.function.name,text:call.function.arguments.slice(i,i+8192)});
    onTiming({phase:'upstream',outcome:'succeeded',statusCode,headersMs,totalMs:Date.now()-started});
    return {type:'result',requestId:frame.requestId,...display,nativeMessage,nativeUsage:usage,inputTokens:usage.input+usage.cacheRead+usage.cacheWrite,outputTokens:usage.output};
  }catch(e){onTiming({phase:'upstream',outcome:'unknown',statusCode,headersMs,totalMs:Date.now()-started});throw fail(e.code??(signal?.aborted?'upstream_timeout':'upstream_failed_outcome_unknown'));}
  finally{if(oldFetch)globalThis.fetch=oldFetch;}
}
