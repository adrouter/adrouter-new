import { transportCategory } from './pi-transport.mjs';
// Loaded only in the isolated inference guest or synthetic adapter tests.
import {providerCatalog} from './generated/provider-catalog.mjs';
import {Readable} from 'node:stream';
import {createSign} from 'node:crypto';
import Ajv from 'ajv';
import {thinkingBudgetForLevel,clampThinkingBudgetToAnswerRoom} from '@earendil-works/pi-ai/api/simple-options';
import {restrictedPiFetch} from './pi-transport.mjs';
import {piDisplay} from './pi-context.mjs';
const fail=(code,extra={})=>Object.assign(Error(code),{code,...extra});
const integer=n=>Number.isSafeInteger(n)&&n>=0;
export const credentialFields=kind=>(providerCatalog.credentialMethods?.[kind]?.fields??[]).map(f=>f.name);
// Translate explicit Pi-compatible overrides at the pinned SDK's serialized
// request boundary. Other SDK families fail before credential exchange/inference.
export function sdkCompatibility(node, descriptor) {
 const explicit=descriptor.explicitCompat??{...node.connection?.compat,...node.connection?.modelDefinitions?.find(m=>m.id===descriptor.model)?.compat};
 const supported=['supportsStore','supportsDeveloperRole','supportsReasoningEffort','supportsUsageInStreaming','maxTokensField','requiresToolResultName','requiresAssistantAfterToolResult','requiresThinkingAsText','thinkingFormat'];
 for(const key of Object.keys(explicit))if(descriptor.adapter.id!=='@ai-sdk/openai-compatible'||!supported.includes(key)||key==='thinkingFormat'&&explicit[key]!=='openai')throw fail('sdk_compatibility_unsupported',{setting:key});
 const compat={...descriptor.compat,...explicit};
 return {compat,transformRequestBody(body){
  body={...body,messages:body.messages.map(m=>({...m}))};
  if(compat.supportsStore===true)body.store=false;else if(compat.supportsStore===false)delete body.store;
  if(compat.supportsUsageInStreaming===false)delete body.stream_options;else if(compat.supportsUsageInStreaming===true)body.stream_options={include_usage:true};
  if(compat.supportsReasoningEffort===false)delete body.reasoning_effort;
  if(compat.maxTokensField){const limit=body.max_tokens??body.max_completion_tokens;delete body.max_tokens;delete body.max_completion_tokens;body[compat.maxTokensField]=limit;}
  const messages=[];for(const m of body.messages){
   if(compat.supportsDeveloperRole===false&&m.role==='developer')m.role='system';
   else if(compat.supportsDeveloperRole===true&&descriptor.capabilities?.includes('thinking_v1')&&m.role==='system')m.role='developer';
   if(compat.requiresAssistantAfterToolResult&&m.role==='assistant'&&m.content===null)m.content='';
   if(compat.requiresAssistantAfterToolResult&&messages.at(-1)?.role==='tool'&&m.role==='user')messages.push({role:'assistant',content:'I have processed the tool results.'});
   if(compat.requiresToolResultName&&m.role==='tool'){const original=node.compatibilityMessages?.find(v=>v.role==='toolResult'&&v.toolCallId===m.tool_call_id);if(original)m.name=original.toolName;}
   if(compat.requiresThinkingAsText&&m.reasoning_content){m.content=m.reasoning_content+(m.content?'\n\n'+m.content:'');delete m.reasoning_content;}
   messages.push(m);
  }body.messages=messages;return body;
 }};
}
export function sdkPrompt(messages){return messages.map(m=>{
 if(m.role==='system')return {role:'system',content:typeof m.content==='string'?m.content:m.content.map(c=>c.text).join('\n')};
 if(m.role==='toolResult')return {role:'tool',content:[{type:'tool-result',toolCallId:m.toolCallId,toolName:m.toolName,output:{type:m.isError?'error-text':'text',value:m.content.map(c=>c.text).join('\n')}}]};
 const blocks=typeof m.content==='string'?[{type:'text',text:m.content}]:m.content.map(c=>c.type==='text'?{type:'text',text:c.text,...(c.providerMetadata?{providerOptions:c.providerMetadata}:{})}:c.type==='thinking'?{type:'reasoning',text:c.thinking,...(c.providerMetadata?{providerOptions:c.providerMetadata}:{})}:{type:'tool-call',toolCallId:c.id,toolName:c.name,input:c.arguments,...(c.providerMetadata?{providerOptions:c.providerMetadata}:{})});
 return {role:m.role,content:blocks};
});}
function metadata(value){
 if(!value||typeof value!=='object')return undefined;
 const out={};for(const [provider,entry]of Object.entries(value)){
  if(!/^[a-zA-Z0-9_-]{1,64}$/.test(provider)||!entry||typeof entry!=='object')continue;
  const kept={};for(const key of ['signature','thoughtSignature','encryptedContent','reasoningEncryptedContent','itemId'])if(typeof entry[key]==='string'&&entry[key].length<=131072)kept[key]=entry[key];
  if(Object.keys(kept).length)out[provider]=kept;
 }return Object.keys(out).length?out:undefined;
}
export function normalizeSDKUsage(value){
 const input=typeof value?.inputTokens==='number'?value.inputTokens:value?.inputTokens?.total;
 const output=typeof value?.outputTokens==='number'?value.outputTokens:value?.outputTokens?.total;
 if(!integer(input)||!integer(output))throw fail('upstream_usage_missing');
 const read=value.inputTokens?.cacheRead??value.cachedInputTokens??0,write=value.inputTokens?.cacheWrite??0;
 if(!integer(read)||!integer(write)||read+write>input)throw fail('upstream_usage_invalid');
 const reasoning=value.outputTokens?.reasoning??value.reasoningTokens??null;
 if(reasoning!==null&&(!integer(reasoning)||reasoning>output))throw fail('upstream_usage_invalid');
 return {input:input-read-write,output,cacheRead:read,cacheWrite:write,reasoning};
}
async function googleToken(secrets,authFetch,signal){
 let account;try{account=JSON.parse(secrets.GOOGLE_SERVICE_ACCOUNT_JSON);}catch{throw fail('guest_service_account_invalid');}
 if(typeof account.client_email!=='string'||typeof account.private_key!=='string')throw fail('guest_service_account_invalid');
 const enc=v=>Buffer.from(JSON.stringify(v)).toString('base64url'),iat=Math.floor(Date.now()/1000),payload=enc({alg:'RS256',typ:'JWT'})+'.'+enc({iss:account.client_email,scope:'https://www.googleapis.com/auth/cloud-platform',aud:'https://oauth2.googleapis.com/token',iat,exp:iat+3600});
 const assertion=payload+'.'+createSign('RSA-SHA256').update(payload).sign(account.private_key,'base64url');
 const response=await authFetch('https://oauth2.googleapis.com/token',{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded'},body:new URLSearchParams({grant_type:'urn:ietf:params:oauth:grant-type:jwt-bearer',assertion}).toString(),signal});
 if(!response.ok)throw fail('upstream_authentication_failed',{statusCode:response.status});const result=await response.json();if(typeof result.access_token!=='string')throw fail('upstream_authentication_failed');return result.access_token;
}
export async function sdkModel(node,descriptor,secrets,transport,signal,{authFetch=transport,compatibility=sdkCompatibility(node,descriptor)}={}){
 const a=descriptor.adapter;if(!a?.id||a.kind!=='sdk'||providerCatalog.adapters[a.id]?.factory!==a.factory)throw fail('adapter_mapping_missing');
 const fields=node.fields??{},headers=secrets.headers??{},options={name:node.provider,baseURL:descriptor.endpoint,apiKey:secrets.key,headers,fetch:transport};
 let moduleId=a.id;
 if(a.id==='@ai-sdk/openai-compatible')Object.assign(options,{includeUsage:compatibility.compat.supportsUsageInStreaming!==false,transformRequestBody:compatibility.transformRequestBody});
 if(a.authentication==='aws_credentials')Object.assign(options,{region:fields.AWS_REGION,accessKeyId:secrets.AWS_ACCESS_KEY_ID,secretAccessKey:secrets.AWS_SECRET_ACCESS_KEY,sessionToken:secrets.AWS_SESSION_TOKEN||undefined});
 if(a.authentication==='google_service_account'){
  const token=await googleToken(secrets,authFetch,signal);
  // Passing an explicit short-lived guest token avoids ambient host/cloud auth.
  delete options.apiKey;options.headers={...headers,Authorization:`Bearer ${token}`};options.project=fields.GOOGLE_VERTEX_PROJECT;options.location=fields.GOOGLE_VERTEX_LOCATION;
  // SDK's edge variant accepts explicit credential material without filesystem discovery.
  options.googleAuthOptions={authClient:{getAccessToken:async()=>({token})}};options.generateAuthToken=async()=>token;
 }
 if(a.authentication==='ibm_api_key')options.projectId=fields.WATSONX_AI_PROJECT_ID;
 if(a.authentication==='sap_service_key'){
  const url=fields.AUTH_BASE_URL.replace(/\/$/,'')+'/oauth/token';
  const response=await authFetch(url,{method:'POST',headers:{'content-type':'application/x-www-form-urlencoded',authorization:'Basic '+Buffer.from(secrets.SAP_CLIENT_ID+':'+secrets.SAP_CLIENT_SECRET).toString('base64')},body:'grant_type=client_credentials',signal});
  if(!response.ok)throw fail('upstream_authentication_failed',{statusCode:response.status});const token=await response.json();if(typeof token.access_token!=='string')throw fail('upstream_authentication_failed');
  Object.assign(options,{deploymentId:fields.SAP_DEPLOYMENT_ID,resourceGroup:fields.SAP_RESOURCE_GROUP,destination:{url:descriptor.endpoint,authentication:'NoAuthentication',headers:{Authorization:`Bearer ${token.access_token}`}},logLevel:'error',requestConfig:{timeout:120000,maxRedirects:0,adapter:async config=>{
   const url=new URL(config.url,config.baseURL??descriptor.endpoint);const res=await transport(url,{method:(config.method??'POST').toUpperCase(),headers:config.headers?.toJSON?.()??config.headers,body:config.data,signal});
   if(!res.ok)throw fail('upstream_failed_outcome_unknown',{statusCode:res.status});return {data:config.responseType==='stream'?Readable.fromWeb(res.body):await res.json(),status:res.status,statusText:res.statusText,headers:Object.fromEntries(res.headers),config,request:{}};
  }}});
 }
 if(a.authentication==='cloudflare_gateway'){
  const {createAiGateway}=await import('ai-gateway-provider'),{createUnified}=await import('ai-gateway-provider/providers/unified');
  const gateway=createAiGateway({accountId:fields.CLOUDFLARE_ACCOUNT_ID,gateway:fields.CLOUDFLARE_GATEWAY_ID,apiKey:secrets.key,options:{maxAttempts:1}});
  const {name:_name,baseURL:_baseURL,...unifiedOptions}=options;return gateway(createUnified(unifiedOptions)(descriptor.model));
 }
 const module=await import(moduleId),factory=module[a.factory];if(typeof factory!=='function')throw fail('bundled_adapter_missing');
 const provider=factory(options),method=a.method;
 return method?provider[method](descriptor.model):provider.languageModel?provider.languageModel(descriptor.model):provider(descriptor.model);
}
export async function sdkInference(node,auth,frame,signal,onTiming=()=>{},onEvent=()=>{},fetchFixture){
 signal?.throwIfAborted();
 const descriptor=node.nativeModels.find(m=>m.model===frame.model);
 if(!descriptor||descriptor.api!==frame.api||node.provider!==frame.provider||descriptor.endpoint!==frame.endpoint||node.nativeRevision!==frame.nativeRevision)throw fail('pi_model_binding_mismatch');
 const selected=frame.modelSettings?.reasoning??'off';if(!descriptor.supportedSettings?.reasoning.includes(selected))throw fail('model_setting_unsupported');
 const compatibility=sdkCompatibility({...node,compatibilityMessages:frame.messages},descriptor);
 if(compatibility.compat.supportsReasoningEffort===false&&selected!=='off')throw fail('model_setting_unsupported');
 const started=Date.now();let statusCode=null,usage,sequence=0,oldFetch,formatError,responseId,responseModel,transportCause=null;
 const setup=frame.type==='qualification'&&frame.qualification==='setup_probe';const blocks=[],calls=new Map(),parts=new Map();
 const transport=fetchFixture??restrictedPiFetch(node,descriptor,signal,status=>{statusCode=status;});
 const authEndpoints={google_service_account:'https://oauth2.googleapis.com',ibm_api_key:'https://iam.cloud.ibm.com'};
 const authEndpoint=descriptor.authentication==='sap_service_key'?node.fields.AUTH_BASE_URL:authEndpoints[descriptor.authentication];
 const authTransport=authEndpoint?(fetchFixture??restrictedPiFetch(node,{endpoint:authEndpoint},signal,()=>{})):undefined;
 const routed=async(input,init)=>{const url=new URL(typeof input==='string'||input instanceof URL?input:input.url);try{return await (authEndpoint&&url.origin===new URL(authEndpoint).origin?authTransport(input,init):transport(input,init));}catch(error){transportCause=transportCategory(error);throw error;}};
 try{
  oldFetch=globalThis.fetch;globalThis.fetch=routed;
  const model=await sdkModel(node,descriptor,auth.sdkSecrets,routed,signal,{authFetch:routed,compatibility});
  const thinking=selected!=='off',namespace=model.provider.split('.')[0],id=descriptor.adapter.id;
  const budgetTokens=thinking?clampThinkingBudgetToAnswerRoom(thinkingBudgetForLevel(selected),frame.maxOutputTokens):0;
  let providerOptions={[namespace]:thinking?{reasoningEffort:selected}:{reasoningEffort:'none'}};
  if(id.includes('anthropic'))providerOptions={anthropic:{thinking:thinking?{type:'enabled',budgetTokens}:{type:'disabled'},...(thinking&&selected!=='minimal'?{effort:selected}:{})}};
  if(id==='@ai-sdk/cohere')providerOptions={cohere:{thinking:{type:thinking?'enabled':'disabled',...(thinking?{tokenBudget:budgetTokens}:{})}}};
  if(id==='@ai-sdk/amazon-bedrock')providerOptions={bedrock:{reasoningConfig:{type:thinking?'enabled':'disabled',...(thinking?{budgetTokens,...(selected!=='minimal'?{maxReasoningEffort:selected}:{})}:{})}}};
  if(id==='@ai-sdk/google'||id==='@ai-sdk/google-vertex'){
    if(thinking&&!['minimal','low','medium','high'].includes(selected))throw fail('model_setting_unsupported');
    providerOptions={[id.includes('vertex')?'vertex':'google']:{thinkingConfig:thinking?(descriptor.model.includes('gemini-3')?{thinkingLevel:selected,includeThoughts:true}:{thinkingBudget:budgetTokens,includeThoughts:true}):{thinkingBudget:0,includeThoughts:false}}};
  }
  if(id==='@openrouter/ai-sdk-provider')providerOptions={openrouter:{reasoning:{effort:thinking?selected:'none'}}};
  if(!thinking&&['watsonx-ai-provider','@saladtechnologies-oss/ai-sdk-provider'].includes(id))providerOptions={};
  const addsThinkingBudget=thinking&&(id.includes('anthropic')||id==='@ai-sdk/amazon-bedrock'&&descriptor.model.includes('anthropic'));
  if(addsThinkingBudget&&budgetTokens<1024)throw fail('provider_output_bound_exceeded');
  const sdkOutputCeiling=frame.maxOutputTokens-(addsThinkingBudget?budgetTokens:0);
  const result=await model.doStream({prompt:sdkPrompt(frame.messages),maxOutputTokens:sdkOutputCeiling,abortSignal:signal,tools:frame.tools.map(t=>({type:'function',name:t.function.name,description:t.function.description,inputSchema:t.function.parameters})),toolChoice:{type:['tool','setup_probe'].includes(frame.qualification)?'required':frame.qualification==='roundtrip'?'none':'auto'},providerOptions});
  let finish;
  for await(const event of result.stream){
   if(event.type==='response-metadata'){if(typeof event.id==='string')responseId=event.id;if(typeof event.modelId==='string'){responseModel=event.modelId;if(responseModel!==frame.model&&!descriptor.responseAliases?.includes(responseModel))throw fail('pi_model_fallback_rejected');}}
   if(event.type==='error'){formatError='upstream_malformed_response';continue;}
   if(event.type==='text-start'||event.type==='reasoning-start'){const block={type:event.type==='text-start'?'text':'thinking',[event.type==='text-start'?'text':'thinking']:'',...(metadata(event.providerMetadata)?{providerMetadata:metadata(event.providerMetadata)}:{})};blocks.push(block);parts.set(event.id,block);}
   if(event.type==='text-delta'||event.type==='reasoning-delta'){
    const kind=event.type==='text-delta'?'text':'thinking';let block=parts.get(event.id);if(!block){block={type:kind,[kind]:''};blocks.push(block);parts.set(event.id,block);}block[kind]+=event.delta;
    if(Buffer.byteLength(block[kind])>131072)throw fail('upstream_response_limit');
    if(kind==='text'||thinking)for(let i=0;i<event.delta.length;i+=8192)await onEvent({type:'coding_delta',requestId:frame.requestId,sequence:++sequence,kind,text:event.delta.slice(i,i+8192)});
   }
   if(event.type==='text-end'||event.type==='reasoning-end'){const block=parts.get(event.id),meta=metadata(event.providerMetadata);if(block&&meta)block.providerMetadata=meta;}
   if(event.type==='tool-call'){if(event.providerExecuted)throw fail('provider_tool_execution_forbidden');let args;try{args=JSON.parse(event.input);}catch{formatError=setup?'setup_probe_invalid_arguments':'upstream_malformed_response';continue;}const block={type:'toolCall',id:event.toolCallId,name:event.toolName,arguments:args,...(metadata(event.providerMetadata)?{providerMetadata:metadata(event.providerMetadata)}:{})};blocks.push(block);calls.set(block.id,block);}
   if(event.type==='finish'){usage=normalizeSDKUsage(event.usage);finish=typeof event.finishReason==='string'?event.finishReason:event.finishReason?.unified;}
  }
  if(!usage)throw fail('upstream_usage_missing');
  if(!['stop','length','tool-calls'].includes(finish))formatError='upstream_malformed_response';
  const authority=frame.upstreamBudget;if(usage.input+usage.cacheRead+usage.cacheWrite>authority.inputBound||usage.output>frame.maxOutputTokens)throw fail('upstream_usage_invalid');
  const nativeMessage={role:'assistant',api:frame.api,provider:frame.provider,model:frame.model,content:blocks,...(responseId?{responseId}:{}),...(responseModel?{responseModel}:{}),stopReason:finish==='tool-calls'?'toolUse':finish,timestamp:Date.now()};
  const display=piDisplay(nativeMessage);if(!thinking)display.thinking='';
  const known={nativeUsage:usage,inputTokens:usage.input+usage.cacheRead+usage.cacheWrite,outputTokens:usage.output};
  if(formatError||calls.size>8)throw fail(formatError??'upstream_malformed_response',known);
  if(!thinking&&blocks.some(b=>b.type==='thinking'&&b.thinking))throw fail('model_setting_unsupported',known);
  if(!setup)for(const call of calls.values()){const tool=frame.tools.find(t=>t.function.name===call.name);if(!tool||!new Ajv({strict:false,validateFormats:false}).compile(tool.function.parameters)(call.arguments))throw fail('upstream_malformed_response',known);}
  for(const [index,call]of display.toolCalls.entries())for(let i=0;i<call.function.arguments.length;i+=8192)await onEvent({type:'coding_delta',requestId:frame.requestId,sequence:++sequence,kind:'tool',index,id:call.id,name:call.function.name,text:call.function.arguments.slice(i,i+8192)});
  onTiming({phase:'upstream',outcome:'succeeded',statusCode,headersMs:null,totalMs:Date.now()-started});
  return {type:'result',requestId:frame.requestId,...display,nativeMessage,...known};
 }catch(error){onTiming({phase:'upstream',outcome:error.nativeUsage?'succeeded':'unknown',statusCode,headersMs:null,transportCause:transportCause??transportCategory(error),totalMs:Date.now()-started});throw error.code?error:fail(signal?.aborted?'upstream_timeout':error.statusCode===401||error.statusCode===403?'upstream_authentication_failed':error.statusCode===429?'upstream_rate_limited':error.statusCode===400?'upstream_parameter_rejected':'upstream_failed_outcome_unknown',{statusCode:error.statusCode});}
 finally{if(oldFetch)globalThis.fetch=oldFetch;}
}
