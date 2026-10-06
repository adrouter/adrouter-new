import { request } from 'node:https';
import {request as httpRequest} from 'node:http';
import { Readable, Transform } from 'node:stream';
import { tunnelAgent,validateBinding } from './provider-broker.mjs';
const fail=code=>Object.assign(Error(code),{code});
export function restrictedPiFetch(node,model,signal,onResponse=()=>{},{discovery=false,evidence}={}) {
  const {url:approved}=validateBinding({...node,endpoint:model.endpoint});let dispatched=false;
  return async (input,init={})=>{
    // One SDK dispatch per authority reservation. Also fences retries performed
    // internally by an SDK that ignores its retry option.
    if(dispatched)throw fail('upstream_retry_forbidden');
    const req=input instanceof Request?input:new Request(input,init);
    const url=new URL(req.url),method=init.method??req.method;
    if(url.origin!==approved.origin||!url.pathname.startsWith(approved.pathname.replace(/\/$/, '')+'/')||url.username||url.password||url.hash||(discovery?(method!=='GET'||url.pathname!==approved.pathname.replace(/\/$/,'')+'/models'):method!=='POST'))throw fail('pi_destination_rejected');
    if(!node.tunnel)throw fail('pi_restricted_transport_required');
    signal?.throwIfAborted();dispatched=true;
    const body=discovery?undefined:init.body??await req.text();if(!discovery&&(typeof body!=='string'||Buffer.byteLength(body)>1024*1024))throw fail('pi_request_limit');
    const headers=new Headers(init.headers??req.headers);headers.delete('host');headers.delete('content-length');headers.set('accept-encoding','identity');
    if(node.connection?.authentication==='none')for(const key of ['authorization','x-api-key','api-key','x-goog-api-key'])headers.delete(key);
    const requestSignal=AbortSignal.any([signal??new AbortController().signal,init.signal??req.signal]);
    const agent=tunnelAgent({...node,tunnel:{...node.tunnel,path:'/upstream/'+encodeURIComponent(approved.origin)}},url,evidence,requestSignal);
    return new Promise((resolve,reject)=>{
      let incoming,bounded,disposed=false;
      const dispose=()=>{if(disposed)return;disposed=true;incoming?.unpipe(bounded);incoming?.destroy();upstream.destroy();agent.destroy();};
      const upstream=(url.protocol==='http:'?httpRequest:request)(url,{method,headers:Object.fromEntries(headers),agent,signal:requestSignal,timeout:120000},response=>{
        incoming=response;
        evidence?.response(response.statusCode);onResponse(response.statusCode);
        if(response.statusCode>=300&&response.statusCode<400){reject(fail('pi_redirect_rejected'));dispose();return;}
        let bytes=0;
        bounded=new Transform({transform(chunk,_encoding,next){evidence?.stage('streaming');bytes+=chunk.length;if(bytes>2*1024*1024)next(fail('pi_response_limit'));else next(null,chunk);}});
        // A reader can finish at the SSE sentinel before HTTP EOF. Its cancelled
        // Web stream must close the original response and tunnel as well.
        bounded.once('close',dispose);
        response.on('error',e=>{if(!disposed){evidence?.error(e);bounded.destroy(e);}});response.pipe(bounded);
        const h=new Headers();for(const [key,value]of Object.entries(response.headers))if(value!==undefined)h.set(key,Array.isArray(value)?value.join(', '):value);
        resolve(new Response(Readable.toWeb(bounded),{status:response.statusCode,headers:h}));
      });
      upstream.once('error',error=>{if(disposed)return;evidence?.error(error);reject(Object.assign(fail(signal?.aborted?'upstream_timeout':'upstream_failed_outcome_unknown'),{transportCode:error.code}));bounded?.destroy(error);dispose();});
      upstream.once('socket',socket=>{const dispatched=()=>evidence?.stage('dispatch');if(socket.connecting)socket.once('connect',dispatched);else dispatched();});upstream.once('timeout',()=>upstream.destroy(Object.assign(Error('upstream_timeout'),{code:'ETIMEDOUT'})));upstream.once('close',()=>{agent.destroy();});upstream.end(body);
    });
  };
}

// Bounded cause inspection; never exception messages or URL/header content.
export function transportCategory(error) {
  let cause=error;
  for(let depth=0;cause&&depth<4;depth++,cause=cause.cause){
    if(cause.name==='TimeoutError')return 'timeout';
    if(['ENOTFOUND','EAI_AGAIN'].includes(cause.code))return 'dns';
    if(['CERT_HAS_EXPIRED','UNABLE_TO_VERIFY_LEAF_SIGNATURE','ERR_TLS_CERT_ALTNAME_INVALID','DEPTH_ZERO_SELF_SIGNED_CERT'].includes(cause.code))return 'tls';
    if(['ETIMEDOUT','UND_ERR_CONNECT_TIMEOUT','UND_ERR_HEADERS_TIMEOUT','UND_ERR_BODY_TIMEOUT'].includes(cause.code))return 'timeout';
    if(['ECONNRESET','ECONNREFUSED','EPIPE','UND_ERR_SOCKET'].includes(cause.code))return 'connection';
  }
  return null;
}
