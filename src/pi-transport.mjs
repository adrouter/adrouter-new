import { request } from 'node:https';
import { Readable, Transform } from 'node:stream';
import { tunnelAgent } from './provider-broker.mjs';
const fail=code=>Object.assign(Error(code),{code});
export function restrictedPiFetch(node,model,signal,onResponse=()=>{},{discovery=false}={}) {
  const approved=new URL(model.endpoint);let dispatched=false;
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
    const agent=tunnelAgent({...node,tunnel:{...node.tunnel,path:'/upstream/'+encodeURIComponent(approved.origin)}},url);
    return new Promise((resolve,reject)=>{
      const upstream=request(url,{method,headers:Object.fromEntries(headers),agent,signal:AbortSignal.any([signal??new AbortController().signal,init.signal??req.signal]),timeout:120000},response=>{
        onResponse(response.statusCode);
        if(response.statusCode>=300&&response.statusCode<400){response.destroy();reject(fail('pi_redirect_rejected'));return;}
        let bytes=0;
        const bounded=new Transform({transform(chunk,_encoding,next){bytes+=chunk.length;if(bytes>2*1024*1024)next(fail('pi_response_limit'));else next(null,chunk);}});
        response.on('error',e=>bounded.destroy(e));response.pipe(bounded);
        const h=new Headers();for(const [key,value]of Object.entries(response.headers))if(value!==undefined)h.set(key,Array.isArray(value)?value.join(', '):value);
        resolve(new Response(Readable.toWeb(bounded),{status:response.statusCode,headers:h}));
      });
      upstream.once('error',()=>reject(fail(signal?.aborted?'upstream_timeout':'upstream_failed_outcome_unknown')));
      upstream.once('timeout',()=>upstream.destroy());upstream.once('close',()=>agent.destroy());upstream.end(body);
    });
  };
}
