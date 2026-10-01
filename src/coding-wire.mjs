class ClientError extends Error { constructor(code){super(code);this.code=code;} }
export async function readCodingStream(response, onEvent = () => {}) {
  if (!response.body || !response.headers.get('content-type')?.includes('application/x-ndjson')) throw new ClientError('coding_stream_required');
  const decoder = new TextDecoder('utf-8',{fatal:true}); let pending = '', bytes = 0, sequence = 0, complete;
  for await (const chunk of response.body) {
    bytes += chunk.length; if (bytes > 2*1024*1024 || complete) throw new ClientError('coding_stream_invalid');
    pending += decoder.decode(chunk,{stream:true});
    for (;;) {
      const end = pending.indexOf('\n'); if (end < 0) break;
      const line = pending.slice(0,end); pending = pending.slice(end+1);
      if (!line || line.length > 1024*1024) throw new ClientError('coding_stream_invalid');
      if(complete)throw new ClientError('coding_stream_invalid');
      const event = JSON.parse(line);
      if (event.type === 'error') throw new ClientError(/^[a-z0-9_]{1,80}$/.test(event.code) ? event.code : 'coding_outcome_unknown');
      if (event.type === 'complete') { if (complete) throw new ClientError('coding_stream_invalid'); complete = event; }
      else if (event.type === 'coding_delta' && event.sequence === ++sequence && ['text','thinking','tool'].includes(event.kind) && typeof event.text === 'string' && event.text.length <= 8192) await onEvent(event);
      else throw new ClientError('coding_stream_invalid');
    }
    if (pending.length > 1024*1024) throw new ClientError('coding_stream_invalid');
  }
  pending += decoder.decode();
  if (pending || !complete) throw new ClientError('coding_outcome_unknown');
  return complete;
}

// Upstream SSE framing is independent of TCP chunk boundaries. Tool fragments
// never become executable calls until a final, validated snapshot is received.
export class UpstreamCodingStream {
  constructor(requestId, allowed, emit) { this.requestId=requestId; this.allowed=allowed; this.emit=emit; this.decoder=new TextDecoder('utf-8',{fatal:true}); this.pending=''; this.text=''; this.thinking=''; this.calls=new Map(); this.sequence=0; this.done=false; this.finished=false; }
  async feed(chunk) {
    this.pending = (this.pending + this.decoder.decode(chunk,{stream:true})).replace(/\r\n/g,'\n');
    if (this.pending.length>262144) throw Error('upstream_stream_limit');
    for (;;) { const end=this.pending.indexOf('\n\n'); if(end<0)break; const frame=this.pending.slice(0,end);this.pending=this.pending.slice(end+2); await this.frame(frame); }
  }
  async frame(frame) {
    const lines=frame.split('\n').filter(l=>l.startsWith('data:')).map(l=>l.slice(5).trimStart());
    if(!lines.length)return; const raw=lines.join('\n');
    if(this.done)throw Error('upstream_stream_after_done');
    if(raw==='[DONE]'){this.done=true;return;}
    const data=JSON.parse(raw); if(data.error)throw Error('upstream_stream_error');
    if(data.usage)this.usage=data.usage;
    const choice=data.choices?.[0]; if(!choice)return;
    const delta=choice.delta??{};
    const send=async(kind,text,extra={})=>{if(typeof text!=='string')throw Error('upstream_delta_invalid');for(let i=0;i<text.length;i+=8192)await this.emit({type:'coding_delta',requestId:this.requestId,sequence:++this.sequence,kind,text:text.slice(i,i+8192),...extra});};
    if(delta.content){this.text+=delta.content;await send('text',delta.content);}
    if(delta.reasoning_content){this.thinking+=delta.reasoning_content;await send('thinking',delta.reasoning_content);}
    for(const t of delta.tool_calls??[]) {
      if(!Number.isInteger(t.index)||t.index<0||t.index>7||(t.type && t.type!=='function'))throw Error('upstream_tool_invalid');
      const c=this.calls.get(t.index)??{id:'',name:'',arguments:''};
      if((t.id && c.id && t.id!==c.id)||(t.function?.name && c.name && t.function.name!==c.name))throw Error('upstream_tool_changed');
      c.id ||= t.id??'';c.name ||= t.function?.name??'';c.arguments+=t.function?.arguments??'';
      if(c.arguments.length>65536)throw Error('upstream_tool_limit');this.calls.set(t.index,c);
      await send('tool',t.function?.arguments??'',{index:t.index,...(t.id?{id:t.id}:{}),...(t.function?.name?{name:t.function.name}:{})});
      if(!t.function?.arguments)await this.emit({type:'coding_delta',requestId:this.requestId,sequence:++this.sequence,kind:'tool',text:'',index:t.index,...(t.id?{id:t.id}:{}),...(t.function?.name?{name:t.function.name}:{})});
    }
    if(Buffer.byteLength(this.text)>131072||Buffer.byteLength(this.thinking)>131072)throw Error('upstream_output_limit');
    if(choice.finish_reason){if(!['stop','length','tool_calls'].includes(choice.finish_reason))throw Error('upstream_finish_invalid');this.finished=true;}
  }
  result() {
    this.pending+=this.decoder.decode(); if(!this.done||!this.finished||this.pending.trim())throw Error('upstream_incomplete');
    const ids=new Set();const toolCalls=[...this.calls.entries()].sort((a,b)=>a[0]-b[0]).map(([,c])=>{
      if(!/^[A-Za-z0-9_-]{1,96}$/.test(c.id)||!this.allowed.includes(c.name)||ids.has(c.id))throw Error('upstream_tool_invalid');ids.add(c.id);
      const args=JSON.parse(c.arguments);if(!args||typeof args!=='object'||Array.isArray(args))throw Error('upstream_tool_invalid');
      return {id:c.id,type:'function',function:{name:c.name,arguments:c.arguments}};
    });
    return {text:this.text,thinking:this.thinking,toolCalls,inputTokens:this.usage?.prompt_tokens,outputTokens:this.usage?.completion_tokens};
  }
}
