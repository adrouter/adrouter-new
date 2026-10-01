import assert from 'node:assert/strict';
import {mkdtemp,rm} from 'node:fs/promises';
import { SandboxRuntime } from '../src/runtime.mjs';
import { startProvider } from '../src/provider.mjs';
let runtime,guest;const create=SandboxRuntime.prototype.create;
SandboxRuntime.prototype.create=async function(options){runtime=this;guest=await create.call(this,options);return guest;};
const node={id:'synthetic-egress',name:'synthetic',endpoint:'https://api.deepseek.com',model:'synthetic',supplyClass:'self_hosted',availability:'hot',status:'published',approval:'pending'};
const network={origin:'http://127.0.0.1:9',request:async(path,{body}={})=>path.endsWith('/relay-ticket')?{providerRunId:body.providerRunId,ticket:'t'.repeat(43),reauthenticateSeconds:10}:node};
const diagnosticsDirectory=await mkdtemp('/tmp/adr-egress-diag-');
const controller=await startProvider(network,node.id,{diagnosticsDirectory,noKey:true,runtimeConfig:{executable:process.env.ADROUTER_NEW_RUNTIME_EXECUTABLE,library:process.env.ADROUTER_NEW_RUNTIME_LIBRARY,home:process.env.ADROUTER_NEW_RUNTIME_HOME}});
try {
 const code=`(async()=>{const {tunnelAgent}=await import('/workspace/provider-broker.mjs');const config=JSON.parse(require('node:fs').readFileSync('/workspace/config.json'));const url=new URL(config.node.endpoint);const status=await new Promise((resolve,reject)=>{const r=require('node:https').get(url,{agent:tunnelAgent(config.node,url)},res=>{res.resume();resolve(res.statusCode)});r.on('error',reject)});const result={status};for(const url of ['https://example.org','http://169.254.169.254']){try{await fetch(url,{signal:AbortSignal.timeout(2000)});result[url]='reachable'}catch{result[url]='blocked'}}console.log(JSON.stringify(result))})()`;
 const result=JSON.parse(await runtime.run(guest,['node','-e',code],{timeoutSeconds:20}));
 assert.equal(result.status,401);assert.equal(result['https://example.org'],'blocked');assert.equal(result['http://169.254.169.254'],'blocked');
 console.log('Real guest egress passed: end-to-end TLS reached fixed upstream (unauthenticated 401); other public endpoint and metadata address blocked. No inference or real key used.');
}finally{await controller.stop();SandboxRuntime.prototype.create=create;await rm(diagnosticsDirectory,{recursive:true,force:true});}
