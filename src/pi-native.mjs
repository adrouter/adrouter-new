import Ajv from 'ajv';
import {thinkingBudgetForLevel,clampThinkingBudgetToAnswerRoom} from '@earendil-works/pi-ai/api/simple-options';
import {providerCatalog} from './generated/provider-catalog.mjs';
import {sdkInference} from './sdk-native.mjs';
// Imported only in the isolated provider guest (or synthetic fixture tests).
import { createModels, createProvider, InMemoryCredentialStore, getSupportedThinkingLevels } from '@earendil-works/pi-ai';
import { resolveGoogleThinkingLevel, usesGoogleThinkingLevel, toGoogleThinkingLevel } from '@earendil-works/pi-ai/api/google-shared';
import { piCatalog } from './generated/pi-catalog.mjs';
import { piMessage, piDisplay } from './pi-context.mjs';
import { restrictedPiFetch } from './pi-transport.mjs';
const fail=code=>Object.assign(Error(code),{code});
const integer=n=>Number.isSafeInteger(n)&&n>=0;
const adapterFactories={'openai-completions':'openAICompletionsApi','openai-responses':'openAIResponsesApi','anthropic-messages':'anthropicMessagesApi','google-generative-ai':'googleGenerativeAIApi','mistral-conversations':'mistralConversationsApi','azure-openai-responses':'azureOpenAIResponsesApi','pi-messages':'piMessagesApi'};
export async function nativeLogin(node,key,signal,{credentials=new InMemoryCredentialStore(),headers={},secretFields={}}={}) {
  const unauthenticated=node.supplyClass==='self_hosted'&&node.connection?.authentication==='none';
  if(unauthenticated&&key==='')key='unused-self-hosted';
  const p=(node.connectorProtocol==='pi_native_v3'?providerCatalog:piCatalog).providers.find(p=>p.id===node.provider);
  if(!p&&!['pi_native_v2','pi_native_v3'].includes(node.connectorProtocol))throw fail('pi_provider_not_supported');
  if(key!==undefined&&!(key===''&&node.nativeModels.some(m=>m.api.startsWith('sdk:')))&&(typeof key!=='string'||!/^[\x20-\x7e]{1,4096}$/.test(key)))throw fail('credential_format_invalid');
  if(key?.includes('sk-ant-oat'))throw fail('metered_api_key_required');
  const sdk=node.nativeModels.some(m=>m.api.startsWith('sdk:'));
  let sdkSecrets;
  if(sdk){if(key!==undefined||Object.keys(secretFields).length)await credentials.modify(node.provider,async current=>({type:'api_key',key:key??current?.key??'',env:{...current?.env,ADR_SDK_CREDENTIALS:JSON.stringify({...JSON.parse(current?.env?.ADR_SDK_CREDENTIALS??'{}'),...secretFields,headers})}}));const stored=await credentials.read(node.provider);sdkSecrets={...JSON.parse(stored?.env?.ADR_SDK_CREDENTIALS??'{}'),key:stored?.key};if(node.nativeModels.every(m=>m.api.startsWith('sdk:'))){const session={sdkSecrets,close:async()=>{session.sdkSecrets=undefined;}};return session;}}
  const models=createModels({credentials,authContext:{env:async()=>undefined,fileExists:async()=>false}});
  let provider;
  if(p?.module){const module=await import('@earendil-works/pi-ai/providers/'+p.module);provider=module[p.factory]();}
  if(['pi_native_v2','pi_native_v3'].includes(node.connectorProtocol)) {
    const apis={};for(const m of node.nativeModels.filter(m=>!m.api.startsWith('sdk:'))){const factory=adapterFactories[m.api];if(!factory)throw fail('pi_protocol_unsupported');const module=await import('@earendil-works/pi-ai/api/'+m.api+'.lazy');apis[m.api]=module[factory]();}
    const definitions=node.nativeModels.filter(m=>!m.api.startsWith('sdk:')).map(m=>{const candidate=provider?.getModels().find(x=>x.id===m.model),original=node.connection?.kind==='custom'&&candidate?.baseUrl!==m.endpoint?undefined:candidate;return {...original,id:m.model,name:original?.name??m.model,api:m.api,provider:node.provider,baseUrl:m.endpoint,input:['text'],reasoning:m.capabilities.includes('thinking_v1'),thinkingLevelMap:{...original?.thinkingLevelMap,...m.thinkingLevelMap,...(m.supportedSettings&&!m.supportedSettings.reasoning.includes('off')?{off:null}:{})},contextWindow:m.contextWindowTokens,maxTokens:m.maxOutputTokens,cost:m.price,compat:{...original?.compat,...m.compat,allowedFallbackModels:[]}};});
    provider=createProvider({id:node.provider,name:p?.name??node.provider,headers:provider?.headers,models:definitions,api:apis,auth:{apiKey:node.connection?.kind==='builtin'&&provider?.auth?.apiKey?provider.auth.apiKey:{name:'Connection API key',login:async interaction=>({type:'api_key',key:await interaction.prompt({type:'secret',message:'API key'})}),resolve:async({credential})=>credential?.key?{auth:{apiKey:credential.key,headers:Object.fromEntries((node.connection?.headerNames??[]).map(name=>{const value=JSON.parse(credential.env?.ADR_CONNECTION_HEADERS??'{}')[name];if(typeof value!=='string')throw fail('credential_header_required');return [name,value];}))},env:node.fields}:undefined}}});
  }else provider={...provider,auth:{apiKey:provider.auth.apiKey}};
  models.setProvider(provider);
  if(key!==undefined){
    await models.login(node.provider,'api_key',{signal,notify:()=>{},prompt:async prompt=>{
      if(prompt.type==='secret')return key;
      if(prompt.type==='text'&&['cloudflare-workers-ai','cloudflare-ai-gateway'].includes(p?.id))return /gateway/i.test(prompt.message)?node.fields.CLOUDFLARE_GATEWAY_ID:node.fields.CLOUDFLARE_ACCOUNT_ID;
      throw fail('pi_auth_flow_not_allowed');
    }});
  }
  if(Object.keys(headers).length)await credentials.modify(node.provider,async current=>({...current,env:{...current?.env,ADR_CONNECTION_HEADERS:JSON.stringify(headers)}}));
  const auth=await models.getAuth(node.provider);if(!auth?.auth.apiKey&&!auth?.auth.headers)throw fail('pi_api_key_required');
  key='';const session={models,sdkSecrets,close:async()=>{session.models=undefined;session.sdkSecrets=undefined;}};return session;
}
export async function nativeDiscover(node,auth,signal,fetchFixture) {
  const model=node.nativeModels[0];if(!model||!['openai-completions','openai-responses','azure-openai-responses','mistral-conversations'].includes(model.api))throw fail('model_discovery_unavailable');
  const resolved=await auth.models.getAuth(node.provider);if(!resolved)throw fail('pi_api_key_required');
  const transport=fetchFixture??restrictedPiFetch(node,model,signal,()=>{},{discovery:true});
  const headers={authorization:`Bearer ${resolved.auth.apiKey}`,...resolved.auth.headers};
  if(model.api==='azure-openai-responses'){delete headers.authorization;headers['api-key']=resolved.auth.apiKey;}
  const response=await transport(model.endpoint.replace(/\/$/,'')+'/models',{method:'GET',headers,signal});
  if(!response.ok)throw fail(response.status===401||response.status===403?'upstream_authentication_failed':'model_discovery_unavailable');
  let body;try{body=await response.json();}catch{throw fail('model_discovery_unavailable');}
  if(!Array.isArray(body.data))throw fail('model_discovery_unavailable');
  const models=[...new Set(body.data.flatMap(m=>typeof m?.id==='string'&&/^[\x20-\x7e]{1,256}$/.test(m.id)?[m.id]:[]))].slice(0,256);
  return {models};
}
export class NativeUsageEvidence {
  constructor(api){this.api=api;this.input=false;this.output=false;this.final=false;this.events=0;this.terminal=false;this.reasoningReported=false;}
  observe(e){
    this.events++;
    let u;
    if(this.api==='pi-messages'&&e.type==='done'){u=e.usage??e.message?.usage;if(u){this.input=integer(u.input)&&integer(u.cacheRead)&&integer(u.cacheWrite);this.output=integer(u.output);this.rawInput=u.input+u.cacheRead+u.cacheWrite;this.rawOutput=u.output;this.final=this.input&&this.output;this.terminal=true;this.reasoningReported=integer(u.reasoning);}return;}
    if(['openai-completions','mistral-conversations'].includes(this.api)){this.terminal ||= !!e.choices?.some(c=>['stop','length','tool_calls'].includes(c.finish_reason));u=e.usage;if(u){this.input=integer(u.prompt_tokens);this.output=integer(u.completion_tokens);this.rawInput=u.prompt_tokens;this.rawOutput=u.completion_tokens;this.reasoningReported=integer(u.completion_tokens_details?.reasoning_tokens);this.final=this.input&&this.output;}}
    else if(['openai-responses','azure-openai-responses'].includes(this.api)&&e.type==='response.completed'){u=e.response?.usage;this.input=integer(u?.input_tokens);this.output=integer(u?.output_tokens);this.rawInput=u?.input_tokens;this.rawOutput=u?.output_tokens;this.reasoningReported=integer(u?.output_tokens_details?.reasoning_tokens);this.final=this.input&&this.output;this.terminal=true;}
    else if(this.api==='google-generative-ai'){this.terminal ||= !!e.candidates?.some(c=>['STOP','MAX_TOKENS'].includes(c.finishReason));u=e.usageMetadata;if(u){this.input=integer(u.promptTokenCount);this.output=integer(u.candidatesTokenCount);this.rawInput=u.promptTokenCount;this.rawOutput=u.candidatesTokenCount+(u.thoughtsTokenCount??0);this.reasoningReported=integer(u.thoughtsTokenCount);this.final=this.input&&this.output&&integer(u.totalTokenCount);}}
    else if(this.api==='anthropic-messages'){
      if(e.type==='message_start'){u=e.usage??e.message?.usage;this.input=integer(u?.input_tokens);this.anthropicUsage={...u};this.rawInput=u?.input_tokens+(u?.cache_read_input_tokens??0)+(u?.cache_creation_input_tokens??0);}
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
  if(['pi_native_v2','pi_native_v3'].includes(node.connectorProtocol)&&(frame.nativeRevision!==node.nativeRevision||frame.endpoint!==descriptor.endpoint))throw fail('pi_model_binding_mismatch');
  const inputBound=Buffer.byteLength(JSON.stringify({messages:frame.messages,...(frame.tools?.length?{tools:frame.tools}:{})}))+frame.messages.length*64+1024;
  const authority=frame.upstreamBudget;
  if(!authority||inputBound>authority.inputBound||frame.maxOutputTokens>node.maxOutputTokens)throw fail('upstream_authority_required');
  const worst=(BigInt(inputBound)*BigInt(authority.inputMicrousdPerMillion)+BigInt(frame.maxOutputTokens)*BigInt(authority.outputMicrousdPerMillion)+999999n)/1000000n;
  if(worst>BigInt(authority.reservedMicrousd))throw fail('upstream_authority_exceeded');
  if(descriptor.api.startsWith('sdk:'))return sdkInference(node,auth,frame,signal,onTiming,onEvent,fetchFixture);
  const model=auth.models.getModel(node.provider,frame.model);if(!model)throw fail('pi_model_not_supported');
  if(model.baseUrl!==descriptor.endpoint)throw fail('pi_model_binding_mismatch');
  const fixed={...model,compat:{...model.compat,allowedFallbackModels:[]}};
  const evidence=new NativeUsageEvidence(model.api),started=Date.now();let statusCode=null,headersMs=null,sequence=0;
  const rawTransport=fetchFixture??restrictedPiFetch(node,descriptor,signal,status=>{statusCode=status;headersMs=Date.now()-started;});
  const transport=async(...args)=>{const response=await rawTransport(...args);statusCode=response.status;headersMs=Date.now()-started;return response;};
  const context={messages:frame.messages.map(piMessage),tools:frame.tools.map(t=>({name:t.function.name,description:t.function.description,parameters:t.function.parameters}))};
  const options={signal,maxTokens:frame.maxOutputTokens,maxRetries:0,transport:'sse',timeoutMs:120000,fetch:transport,env:{...node.fields},cacheRetention:'none',...(frame.qualification?{toolChoice:frame.qualification==='tool'?(model.api==='anthropic-messages'||model.api==='google-generative-ai'||model.api==='mistral-conversations'?'any':'required'):'none'}:{}),onResponse:response=>{statusCode=response.status;headersMs=Date.now()-started;},onProviderStreamEvent:event=>evidence.observe(event)};
  // The raw native stream avoids Pi's history-usage estimator: replay has no
  // accounting fields. It also keeps the accepted output ceiling intact (the
  // convenience streamSimple helper may add a separate thinking budget).
  const supported=getSupportedThinkingLevels(model);
  const selected=frame.modelSettings?.reasoning??(frame.thinking?(supported.includes('medium')?'medium':supported.find(v=>v!=='off')):'off');
  if(!getSupportedThinkingLevels(model).includes(selected))throw fail('model_setting_unsupported');
  const level=selected==='off'?undefined:selected;
  if(model.api==='anthropic-messages')Object.assign(options,{thinkingEnabled:!!level,...(model.compat?.forceAdaptiveThinking?{effort:level?(model.thinkingLevelMap?.[level]??level):undefined}:{thinkingBudgetTokens:level?clampThinkingBudgetToAnswerRoom(thinkingBudgetForLevel(level),frame.maxOutputTokens):0})});
  else if(model.api==='google-generative-ai')options.thinking=!level?{enabled:false}:usesGoogleThinkingLevel(model)?{enabled:true,level:toGoogleThinkingLevel(resolveGoogleThinkingLevel(model,level))}:{enabled:true,budgetTokens:clampThinkingBudgetToAnswerRoom(thinkingBudgetForLevel(level),frame.maxOutputTokens)};
  else if(model.api==='mistral-conversations')Object.assign(options,{reasoningEffort:model.thinkingLevelMap?(level?(model.thinkingLevelMap[level]??'high'):(model.thinkingLevelMap.off??undefined)):undefined,promptMode:level&&!model.thinkingLevelMap?'reasoning':undefined});
  else options.reasoningEffort=level;
  let oldFetch,knownUsage;
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
    if(!frame.thinking&&final.content.some(block=>block.type==='thinking'&&(block.thinking||block.redacted)))throw fail('pi_thinking_off_unsupported');
    if(final.responseModel&&final.responseModel!==model.id)throw fail('pi_model_fallback_rejected');
    const nativeMessage=piMessage(final),display=piDisplay(nativeMessage),usage=evidence.normalize(final.usage);
    if(!frame.thinking)display.thinking='';
    if(usage.input+usage.cacheRead+usage.cacheWrite>authority.inputBound||usage.output>frame.maxOutputTokens)throw fail('upstream_usage_invalid');
    knownUsage={nativeUsage:usage,inputTokens:usage.input+usage.cacheRead+usage.cacheWrite,outputTokens:usage.output};
    if(display.toolCalls.length>8||display.toolCalls.some(c=>!frame.tools.some(t=>t.function.name===c.function.name)))throw fail('upstream_tool_invalid');
    for(const call of display.toolCalls){const definition=frame.tools.find(t=>t.function.name===call.function.name);if(!new Ajv({strict:false,validateFormats:false}).compile(definition.function.parameters)(JSON.parse(call.function.arguments)))throw fail('upstream_malformed_response');}
    for(const [index,call]of display.toolCalls.entries())for(let i=0;i<call.function.arguments.length;i+=8192)await onEvent({type:'coding_delta',requestId:frame.requestId,sequence:++sequence,kind:'tool',index,id:call.id,name:call.function.name,text:call.function.arguments.slice(i,i+8192)});
    onTiming({phase:'upstream',outcome:'succeeded',statusCode,headersMs,totalMs:Date.now()-started});
    return {type:'result',requestId:frame.requestId,...display,nativeMessage,nativeUsage:usage,inputTokens:usage.input+usage.cacheRead+usage.cacheWrite,outputTokens:usage.output};
  }catch(e){onTiming({phase:'upstream',outcome:'unknown',statusCode,headersMs,totalMs:Date.now()-started});throw Object.assign(fail(/^[a-z0-9_]{1,80}$/.test(e.code??'')?e.code:(signal?.aborted?'upstream_timeout':'upstream_failed_outcome_unknown')),{statusCode,...knownUsage});}
  finally{if(oldFetch)globalThis.fetch=oldFetch;}
}
