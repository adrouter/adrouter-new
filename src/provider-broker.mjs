import { resolveConnector, connectorHeaders } from './connectors.mjs';
import { UpstreamCodingStream } from './coding-wire.mjs';
import { connect as tlsConnect } from 'node:tls';
import { Agent, request as httpsRequest } from 'node:https';
import { Agent as HttpAgent, request as httpRequest } from 'node:http';
import { isIP } from 'node:net';
import { lookup } from 'node:dns';
class ClientError extends Error { constructor(code) { super(code); this.code = code; } }

export function publicAddress(address) {
  if (address.includes(':')) return /^[23]/.test(address) && !/^(2001:(0:|db8:)|2002:)/i.test(address) && !address.includes('.');
  const octets = address.split('.').map(Number);
  if (octets.length !== 4 || octets.some(v => !Number.isInteger(v) || v < 0 || v > 255)) return false;
  const [a, b] = octets;
  return !(a === 0 || a === 10 || a === 127 || a >= 224 || (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && (b === 168 || b === 0)) || (a === 198 && (b === 18 || b === 19)));
}
export function validateBinding(node) {
  const url = new URL(node.endpoint);
  const loopback = ['127.0.0.1', '[::1]'].includes(url.hostname) || (node.localEngine === true && url.hostname === 'host.microsandbox.internal');
  if (url.username || url.password || url.search || url.hash || !(url.protocol === 'https:' || (node.supplyClass === 'self_hosted' && loopback && url.protocol === 'http:'))) throw new ClientError('endpoint_not_permitted');
  if(!loopback && /(^localhost$|\.localhost$|\.local$|^host\.microsandbox\.internal$)/i.test(url.hostname))throw new ClientError('endpoint_address_rejected');
  const address = url.hostname.replace(/^\[|\]$/g, '');
  if (isIP(address) && !publicAddress(address) && !(node.supplyClass === 'self_hosted' && loopback)) throw new ClientError('endpoint_address_rejected');
  return { url, loopback: node.supplyClass === 'self_hosted' && loopback };
}
export function tunnelAgent(node, url, evidence, signal) {
  if(!node.tunnel)return undefined;
  const agent=new (url.protocol==='http:'?HttpAgent:Agent)({keepAlive:false,maxSockets:1});
  const destroy=agent.destroy.bind(agent);let request,raw,secure,disposed=false,finishPending;
  const aborted=()=>{const error=Object.assign(new Error('tunnel_cancelled'),{code:'ABORT_ERR'});finishPending?.(error);agent.destroy();};
  agent.destroy=()=>{
    if(disposed)return;disposed=true;signal?.removeEventListener('abort',aborted);
    request?.destroy();secure?.destroy();raw?.destroy();destroy();
  };
  agent.createConnection=(_options,callback)=>{
    evidence?.stage('tunnel');let completed=false;const finish=(error,socket)=>{if(completed){if(socket)socket.destroy();return;}completed=true;if(error)evidence?.error(error);callback(error,socket);};
    finishPending=finish;
    if(disposed||signal?.aborted){aborted();return;}
    signal?.addEventListener('abort',aborted,{once:true});
    request=httpRequest({host:'host.microsandbox.internal',port:node.tunnel.port,method:'CONNECT',path:node.tunnel.path??'/upstream',headers:{authorization:`Bearer ${node.tunnel.capability}`},timeout:10000});
    request.once('connect',(response,socket,head)=>{
      raw=socket;if(disposed){socket.destroy();return;}
      if(response.statusCode!==200||head.length){socket.destroy();finish(Object.assign(new Error('tunnel_rejected'),{code:'tunnel_rejected'}));return;}
      if(url.protocol==='http:'){finish(null,socket);return;}
      evidence?.stage('tls');secure=tlsConnect({socket,servername:url.hostname,rejectUnauthorized:true});
      let ready=false;
      secure.once('secureConnect',()=>{ready=true;finish(null,secure);});
      secure.once('error',error=>{if(!ready)finish(error);});
    });
    request.once('error',error=>{finish(error);agent.destroy();});request.once('timeout',()=>request.destroy(Object.assign(new Error('tunnel_timeout'),{code:'tunnel_timeout'})));request.end();
  };
  return agent;
}
export function upstreamBody(node, frame) {
  const profile=resolveConnector(node);
  if(frame.connector&&Object.keys(profile).some(k=>resolveConnector({connector:frame.connector})[k]!==profile[k]))throw new ClientError('connector_binding_mismatch');
  if(frame.thinking&&profile.thinking==='none')throw new ClientError('capability_mismatch');
  const messages=frame.messages.map(m=>{if(profile.reasoningHistory&&frame.thinking)return m;const {reasoning_content:_reasoning,...plain}=m;return plain;});
  return {model:node.model,messages,[profile.outputTokenParameter]:frame.maxOutputTokens,
    ...(frame.tools?.length?{tools:frame.tools}:{}),
    ...(profile.thinking==='type'?{thinking:{type:frame.thinking?'enabled':'disabled'}}:profile.thinking==='reasoning_effort'?{reasoning_effort:frame.thinking?'medium':'none'}:{}),
    stream:frame.protocol==='coding_v1',...(frame.protocol==='coding_v1'&&profile.streamingUsage==='include_usage'?{stream_options:{include_usage:true}}:{})};
}
// Fixed approved endpoint, model and headers. Neither relay nor guest can choose
// a URL, header, redirect, tool or arbitrary proxy target. DNS is checked at the
// connection's lookup, not in an earlier rebindable preflight.
export function upstreamInference(node, key, frame, signal, onTiming = () => {}, onEvent = () => {}) {
  const { url, loopback } = validateBinding(node);
  const profile=resolveConnector(node),authentication=!node.connector&&loopback&&!key?{}:connectorHeaders(profile,key);
  const authority = frame.upstreamBudget;
  const inputBound = Buffer.byteLength(JSON.stringify({ messages: frame.messages, ...(frame.tools?.length ? { tools: frame.tools } : {}) })) + frame.messages.length * 64 + 1024;
  if (!authority || inputBound > authority.inputBound || !['reservedMicrousd','inputMicrousdPerMillion','outputMicrousdPerMillion'].every(k => /^(0|[1-9][0-9]{0,18})$/.test(authority[k]))) throw new ClientError('upstream_authority_required');
  const worst = (BigInt(inputBound) * BigInt(authority.inputMicrousdPerMillion) + BigInt(frame.maxOutputTokens) * BigInt(authority.outputMicrousdPerMillion) + 999999n) / 1000000n;
  if (worst > BigInt(authority.reservedMicrousd)) throw new ClientError('upstream_authority_exceeded');
  const deadlineMs = Number.isSafeInteger(frame.deadlineUnixMs) ? Math.max(1,Math.min(120000,frame.deadlineUnixMs-Date.now())) : 120000;
  const bytes = JSON.stringify(upstreamBody(node, frame));
  return new Promise((resolve, reject) => {
    const started = Date.now(); let statusCode = null, headersMs = null, finished = false;
    const deadline = setTimeout(() => { request.destroy(); fail('upstream_timeout'); }, deadlineMs);
    const timing = outcome => { if(finished)return; finished=true;clearTimeout(deadline);onTiming({phase:'upstream',outcome,statusCode,headersMs,totalMs:Date.now()-started}); };
    const fail = (code='upstream_failed_outcome_unknown') => {if(finished)return;timing('unknown');reject(new ClientError(typeof code==='string'?code:'upstream_failed_outcome_unknown'));};
    const request = (url.protocol === 'https:' ? httpsRequest : httpRequest)(url, {
      method: 'POST', signal, timeout: deadlineMs, agent: tunnelAgent(node,url),
      headers: { 'content-type': 'application/json', 'content-length': Buffer.byteLength(bytes), ...authentication },
      lookup(hostname, options, callback) {
        lookup(hostname, options, (error, addresses, family) => {
          if (error) { callback(error, addresses, family); return; }
          const all = Array.isArray(addresses) ? addresses.map(a => a.address) : [addresses];
          if (!loopback && !all.every(publicAddress)) { callback(new Error('endpoint_address_rejected'), '', 4); return; }
          callback(null, addresses, family);
        });
      },
    }, response => {
      statusCode=response.statusCode; headersMs=Date.now()-started;
      if(response.statusCode!==200){
        if([401,403].includes(response.statusCode)){response.resume();fail('upstream_authentication_failed');return;}
        if(response.statusCode===429){response.resume();fail('upstream_rate_limited');return;}
        if(response.statusCode===400||response.statusCode===404){let errorBytes='';response.on('data',chunk=>{errorBytes+=chunk.toString('utf8');if(Buffer.byteLength(errorBytes)>8192){response.destroy();fail();}});response.once('end',()=>{let error;try{error=JSON.parse(errorBytes)?.error;}catch{}fail(error?.param==='model'||['model_not_found','invalid_model'].includes(error?.code)?'upstream_invalid_model':'upstream_failed_outcome_unknown');});response.once('error',()=>fail());return;}
        response.resume();fail();return;
      }
      const stream = frame.protocol === 'coding_v1' ? new UpstreamCodingStream(frame.requestId,frame.tools.map(t=>t.function.name),onEvent) : undefined;
      const chunks = []; let size = 0; let queue=Promise.resolve();
      response.on('data', chunk => { if(stream){response.pause();queue=queue.then(()=>stream.feed(chunk)).then(()=>response.resume()).catch(()=>{response.destroy();fail('upstream_malformed_response');});return;} size += chunk.length; if (size > 1024 * 1024) { response.destroy(); fail(); } else chunks.push(chunk); });
      response.once('error', fail);
      response.once('end', async () => {
        try {
          await queue;
          if(stream){const result=stream.result();if(!Number.isSafeInteger(result.inputTokens)||result.inputTokens<0||result.inputTokens>inputBound||!Number.isSafeInteger(result.outputTokens)||result.outputTokens<0||result.outputTokens>frame.maxOutputTokens||(!frame.thinking&&result.thinking))throw Error('usage_or_capability_invalid');timing('succeeded');resolve({type:'result',requestId:frame.requestId,...result});return;}
          const data = JSON.parse(Buffer.concat(chunks).toString('utf8'));
          const text = data.choices?.[0]?.message?.content ?? '';
          const toolCalls = data.choices?.[0]?.message?.tool_calls ?? [];
          if (!Array.isArray(toolCalls) || toolCalls.length > 8 || (toolCalls.length && !frame.tools?.length) || toolCalls.some(t => t.type !== 'function' || typeof t.id !== 'string' || !/^[A-Za-z0-9_-]{1,96}$/.test(t.id) || !frame.tools?.some(tool=>tool.function?.name===t.function?.name) || typeof t.function.arguments !== 'string' || t.function.arguments.length > 65536)) { fail(); return; }
          const inputTokens = data.usage?.prompt_tokens; const outputTokens = data.usage?.completion_tokens;
          if (typeof text !== 'string' || Buffer.byteLength(text) > 131072 || !Number.isSafeInteger(inputTokens) || inputTokens < 0 || inputTokens > inputBound || !Number.isSafeInteger(outputTokens) || outputTokens < 0 || outputTokens > frame.maxOutputTokens) { fail(); return; }
          timing('succeeded'); resolve({ type: 'result', requestId: frame.requestId, text, toolCalls, inputTokens, outputTokens });
        } catch { fail('upstream_malformed_response'); }
      });
    });
    request.once('error', fail); request.once('timeout', () => { request.destroy(); fail('upstream_timeout'); }); request.end(bytes);
  });
}
