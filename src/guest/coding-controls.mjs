import { readFile } from 'node:fs/promises';
const configuration = JSON.parse(await readFile('/tmp/adr-coding.json','utf8'));
let authority;
export async function bridge(path, body, signal, raw=false) {
  if(!authority && path!=='/child') authority = configuration.capability;
  const response=await fetch(`${configuration.control}${path}`,{method:'POST',redirect:'error',headers:{authorization:`Bearer ${authority??configuration.capability}`,'content-type':'application/json'},body:JSON.stringify(body),signal});
  if(!response.ok){let code;try{code=(await response.json()).code;}catch{}throw Object.assign(Error(/^[a-z0-9_]{1,80}$/.test(code??'')?code:'coding_bridge_rejected'),{code:/^[a-z0-9_]{1,80}$/.test(code??'')?code:'coding_bridge_rejected'});}return raw?response:response.json();
}
export async function bindChild(purpose, mutation=false) {const grant=await bridge('/child',{purpose,mutation});authority=grant.capability;return grant;}
export async function authorize(request,signal) { const result=await bridge('/approval',{name:request.toolName,args:request.arguments,toolCallId:request.toolCallId},signal);return {allow:result.allow===true,reason:result.allow?'':'Action denied by user.'}; }
export const config=configuration;
globalThis.__adrCodingBridge=async(operation,value,signal)=>{if(operation==='approval')return authorize(value,signal);if(operation==='operator_command')return bridge('/operator-command',value,signal);if(operation==='share'){if(!/^\/tmp\/adr-agent\/sessions\/[a-zA-Z0-9_.-]+\.jsonl$/.test(value.sessionFile))throw Error('sharing_path_invalid');value={text:await readFile(value.sessionFile,'utf8')};}return bridge(`/host/${operation}`,value,signal);};

globalThis.__adrCodingAuthorize=authorize;

// Legacy web tools retain their bounded parsers and cache. Only credential-free
// retrieval is bridged; paid search remains unconfigured and disabled.
const nativeFetch=globalThis.fetch;
globalThis.fetch=async(input,options={})=>{const url=new URL(typeof input==='string'?input:input.url??input);if(url.origin===new URL(configuration.control).origin)return nativeFetch(input,options);if(options.method&&options.method!=='GET'||options.headers && [...new Headers(options.headers)].some(([name])=>!['accept','user-agent','content-type'].includes(name.toLowerCase())))throw Error('credential_forwarding_rejected');const r=await bridge('/web',{url:url.href},options.signal);return new Response(Buffer.from(r.base64,'base64'),{status:r.status,headers:{'content-type':r.contentType}});};
