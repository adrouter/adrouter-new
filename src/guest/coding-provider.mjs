import { piContext } from '../pi-context.mjs';
import { AssistantMessageEventStream } from '@adrouter/ai';
import { randomUUID } from 'node:crypto';
import { readCodingStream } from './coding-wire.mjs';
import { bridge, config } from './coding-controls.mjs';
import { inferenceErrorMessage } from '../coding-display.mjs';

const plain=content=>typeof content==='string'?content:(content??[]).filter(c=>c.type==='text').map(c=>c.text).join('\n');
export function wireContext(context,enabled=config.thinking) {
  const messages=context.systemPrompt?[{role:'system',content:context.systemPrompt}]:[];
  for(const m of context.messages) {
    if(m.role==='toolResult')messages.push({role:'tool',tool_call_id:m.toolCallId,content:plain(m.content)});
    else if(m.role==='assistant') {
      const calls=(m.content??[]).filter(c=>c.type==='toolCall').map(c=>({id:c.id,type:'function',function:{name:c.name,arguments:JSON.stringify(c.arguments)}}));
      const thinking=(m.content??[]).filter(c=>c.type==='thinking').map(c=>c.thinking).join('');
      messages.push({role:'assistant',content:plain(m.content),...(calls.length?{tool_calls:calls}:{}),...(thinking && enabled?{reasoning_content:thinking}:{})});
    } else {if(Array.isArray(m.content)&&m.content.some(c=>c.type==='image'))throw Error('listing_image_capability_required');messages.push({role:m.role,content:plain(m.content)});}
  }
  return messages;
}
export function marketplaceStream(model,context,options={}) {
  const stream=new AssistantMessageEventStream();
  const message={role:'assistant',content:[],api:model.api,provider:model.provider,model:model.id,usage:{input:0,output:0,cacheRead:0,cacheWrite:0,totalTokens:0,cost:{input:0,output:0,cacheRead:0,cacheWrite:0,total:0}},stopReason:'stop',timestamp:Date.now()};
  (async()=>{
    try {
      const thinking=config.modelSettings?config.modelSettings.reasoning!=='off':!!config.thinking && options.reasoning!==undefined;
      const body={protocol:'coding_v1',requestId:randomUUID(),...(config.messageFormat==='pi_context_v1'?{messageFormat:'pi_context_v1'}:{}),messages:config.messageFormat==='pi_context_v1'?piContext(context):wireContext(context,thinking),maxOutputTokens:config.maxOutputTokens,tools:(context.tools??[]).map(t=>({type:'function',function:{name:t.name,description:t.description,parameters:t.parameters}})),thinking,purpose:config.purpose??'main'};
      // A guest-only capability authorizes precisely this accepted session. The
      // host serializes all children/compaction/BTW through one upstream slot.
      stream.push({type:'start',partial:message});
      const response=await readCodingStream(await bridge('/inference',body,options.signal,true),event=>{if(event.kind==='text'){let i=message.content.findIndex(c=>c.type==='text');if(i<0){i=message.content.length;message.content.push({type:'text',text:''});stream.push({type:'text_start',contentIndex:i,partial:message});}message.content[i].text+=event.text;stream.push({type:'text_delta',contentIndex:i,delta:event.text,partial:message});}else if(event.kind==='thinking'){let i=message.content.findIndex(c=>c.type==='thinking');if(i<0){i=message.content.length;message.content.push({type:'thinking',thinking:''});stream.push({type:'thinking_start',contentIndex:i,partial:message});}message.content[i].thinking+=event.text;stream.push({type:'thinking_delta',contentIndex:i,delta:event.text,partial:message});}});
      message.content=[];
      if(response.thinking)message.content.push({type:'thinking',thinking:response.thinking});
      if(response.text){const i=message.content.length;message.content.push({type:'text',text:response.text});stream.push({type:'text_start',contentIndex:i,partial:message});stream.push({type:'text_delta',contentIndex:i,delta:response.text,partial:message});stream.push({type:'text_end',contentIndex:i,content:response.text,partial:message});}
      for(const call of response.toolCalls??[]) {const i=message.content.length,args=JSON.parse(call.function.arguments);message.content.push({type:'toolCall',id:call.id,name:call.function.name,arguments:args});stream.push({type:'toolcall_start',contentIndex:i,partial:message});stream.push({type:'toolcall_end',contentIndex:i,toolCall:message.content[i],partial:message});}
      if(config.messageFormat==='pi_context_v1'){if(!response.nativeMessage)throw Error('pi_native_response_required');Object.assign(message,response.nativeMessage);}
      message.usage={...message.usage,input:response.usage.inputTokens,output:response.usage.outputTokens,totalTokens:response.usage.inputTokens+response.usage.outputTokens};
      message.stopReason=response.toolCalls?.length?'toolUse':'stop';stream.push({type:'done',reason:message.stopReason,message});stream.end(message);
    }catch(error) {message.stopReason=options.signal?.aborted?'aborted':'error';message.errorMessage=inferenceErrorMessage(error.code??error.message,options.signal?.aborted);stream.push({type:'error',reason:message.stopReason,error:message});stream.end(message);}
  })();return stream;
}
