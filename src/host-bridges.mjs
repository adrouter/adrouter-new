import { request as httpsRequest } from 'node:https';
import { lookup } from 'node:dns';
import { execFile, spawn } from 'node:child_process';
import { promisify } from 'node:util';
import { writeFile, readFile, rm, mkdtemp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID, createHash } from 'node:crypto';
import { publicAddress } from './provider-broker.mjs';
import { ClientError } from './network.mjs';
const execute=promisify(execFile);
export async function nativeApproval(action,permission={}) {
  if(process.platform!=='darwin')throw new ClientError('host_approval_unavailable');
  const text=JSON.stringify(action,null,2);if(text.length>32*1024*1024)throw new ClientError('approval_display_limit');
  let review,display=text;
  if(text.length>8192){
    review=await mkdtemp(join(tmpdir(),'adr-action-review-'));const path=join(review,'review.json');await writeFile(path,text,{flag:'wx',mode:0o600});
    try{await execute('/usr/bin/open',['-W','-a','TextEdit',path],{timeout:110000,env:{PATH:'/usr/bin:/bin'}});}catch{await rm(review,{recursive:true,force:true});return false;}
    if(await readFile(path,'utf8')!==text){await rm(review,{recursive:true,force:true});return false;}
    display=`Reviewed exact content: ${path}\nSHA-256: ${createHash('sha256').update(text).digest('hex')}`;
  }
  const script='on run argv\ntry\ndisplay dialog (item 1 of argv) with title "AdRouter · Host approval" buttons {"Deny", "Allow once"} default button "Deny" cancel button "Deny" giving up after 120\nreturn button returned of result\non error\nreturn "Deny"\nend try\nend run';
  try{const result=await execute('/usr/bin/osascript',['-e',script,`${display}\n\nApproval: ${permission.digest??''}`],{timeout:125000,maxBuffer:8192,env:{PATH:'/usr/bin:/bin'}}).catch(()=>({stdout:'Deny'}));return result.stdout.trim()==='Allow once';}
  finally{if(review)await rm(review,{recursive:true,force:true});}
}

// Connect-time DNS validation also applies after each redirect. No caller headers,
// cookies, bearer credentials, proxy environment or private-network access.
export async function approvedRetrieval(input,signal,redirects=0,byteLimit=4*1024*1024) {
  let url;try{url=new URL(input);}catch{throw new ClientError('web_url_rejected');}
  if([...url.searchParams.keys()].some(k=>/(api[_-]?key|access[_-]?token|authorization|password|secret)/i.test(k)))throw new ClientError('credential_forwarding_rejected');
  if(url.protocol!=='https:'||url.username||url.password||url.port&&url.port!=='443'||url.href.length>2048||redirects>3)throw new ClientError('web_url_rejected');
  return new Promise((resolve,reject)=>{
    const request=httpsRequest(url,{method:'GET',signal,timeout:15000,headers:{accept:'text/plain,text/html,application/json,application/octet-stream'},lookup(host,options,callback){lookup(host,options,(error,addresses,family)=>{const values=Array.isArray(addresses)?addresses.map(a=>a.address):[addresses];if(error||!values.every(a=>typeof a==='string'&&publicAddress(a))){callback(Error('web_address_rejected'),'',4);return;}callback(null,addresses,family);});}},response=>{
      if([301,302,303,307,308].includes(response.statusCode)){response.resume();if(!response.headers.location){reject(new ClientError('web_redirect_rejected'));return;}approvedRetrieval(new URL(response.headers.location,url).href,signal,redirects+1,byteLimit).then(resolve,reject);return;}
      const chunks=[];let size=0;response.on('data',b=>{size+=b.length;if(size>byteLimit){response.destroy();reject(new ClientError('web_output_limit'));}else chunks.push(b);});
      response.once('end',()=>resolve({status:response.statusCode,contentType:String(response.headers['content-type']??'application/octet-stream'),base64:Buffer.concat(chunks).toString('base64')}));response.once('error',()=>reject(new ClientError('web_failed')));
    });request.once('timeout',()=>request.destroy());request.once('error',()=>reject(new ClientError('web_failed')));request.end();
  });
}

export async function hostOperation(name,value,approve,privateDirectory,signal) {
  if(typeof value.text!=='string'||Buffer.byteLength(value.text)>2*1024*1024)throw new ClientError('host_content_invalid');
  const digest=createHash('sha256').update(value.text).digest('hex');
  if(name==='clipboard') {
    if(!await approve({name:'copy_to_clipboard',args:{text:value.text,digest}}))throw new ClientError('clipboard_denied');
    await new Promise((resolve,reject)=>{const p=spawn('/usr/bin/pbcopy',[],{env:{PATH:'/usr/bin:/bin'},stdio:['pipe','ignore','ignore'],signal});p.once('error',reject);p.once('close',n=>n===0?resolve():reject(new ClientError('clipboard_failed')));p.stdin.end(value.text);});return {copied:true};
  }
  const path=join(privateDirectory,`${name}-${randomUUID()}.${name==='share'?'jsonl':'txt'}`);await writeFile(path,value.text,{flag:'wx',mode:0o600});
  try {
    if(!await approve({name:name==='share'?'review_sharing_content':'open_external_editor',args:{path,digest}}))throw new ClientError('host_operation_denied');
    await execute('/usr/bin/open',['-W','-a','TextEdit',path],{signal,env:{PATH:'/usr/bin:/bin'},timeout:600000});
    const text=await readFile(path,'utf8');if(Buffer.byteLength(text)>2*1024*1024)throw new ClientError('host_content_invalid');
    if(name==='editor')return {text};
    const reviewedDigest=createHash('sha256').update(text).digest('hex');
    if(!await approve({name:'publish_reviewed_secret_gist',args:{digest:reviewedDigest,bytes:Buffer.byteLength(text),destination:'GitHub secret gist',text}}))throw new ClientError('sharing_denied');
    const result=await execute('gh',['gist','create',path,'--desc','Reviewed AdRouter coding conversation'],{signal,timeout:30000,maxBuffer:8192});
    const url=result.stdout.trim();if(!/^https:\/\/gist.github.com\/[A-Za-z0-9_/-]+$/.test(url))throw new ClientError('sharing_outcome_unknown');return {message:url};
  }finally{await rm(path,{force:true});}
}
