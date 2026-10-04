// Only replayable Pi fields cross inference boundaries. Accounting and arbitrary
// transcript metadata are deliberately absent from this projection.
const pick=(value,keys)=>Object.fromEntries(keys.filter(k=>value[k]!==undefined).map(k=>[k,structuredClone(value[k])]));
export function piBlock(block) {
  const keys={text:['type','text','textSignature'],thinking:['type','thinking','thinkingSignature','redacted'],toolCall:['type','id','name','arguments','thoughtSignature','namespace']}[block.type];
  if(!keys)throw Error('pi_content_not_supported');
  const result=pick(block,keys);
  if(block.providerMetadata){const metadata={};for(const [provider,value]of Object.entries(block.providerMetadata)){if(!/^[a-zA-Z0-9_-]{1,64}$/.test(provider)||!value||typeof value!=='object')continue;const kept=pick(value,['signature','thoughtSignature','encryptedContent','reasoningEncryptedContent','itemId']);if(Object.values(kept).some(v=>typeof v!=='string'||v.length>131072))throw Error('pi_metadata_invalid');if(Object.keys(kept).length)metadata[provider]=kept;}if(Object.keys(metadata).length)result.providerMetadata=metadata;}
  return result;
}
export function piMessage(message) {
  if(['system','user'].includes(message.role))return {role:message.role,content:typeof message.content==='string'?message.content:message.content.map(piBlock),timestamp:message.timestamp??0};
  if(message.role==='toolResult')return {...pick(message,['role','toolCallId','toolName','isError']),content:message.content.map(piBlock),timestamp:message.timestamp??0};
  if(message.role!=='assistant')throw Error('pi_message_not_supported');
  return {...pick(message,['role','api','provider','model','responseId','responseModel','providerThinkingLevel','thinkingLevel','stopReason']),content:message.content.map(piBlock),timestamp:message.timestamp??0};
}
export function piContext(context) {
  return [...(context.systemPrompt?[{role:'system',content:context.systemPrompt,timestamp:0}]:[]),...context.messages.map(piMessage)];
}
export function piDisplay(message) {
  return {text:message.content.filter(c=>c.type==='text').map(c=>c.text).join(''),thinking:message.content.filter(c=>c.type==='thinking').map(c=>c.thinking).join(''),toolCalls:message.content.filter(c=>c.type==='toolCall').map(c=>({id:c.id,type:'function',function:{name:c.name,arguments:JSON.stringify(c.arguments)}}))};
}
