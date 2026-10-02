// Installed native adapters in an actual isolated macOS VM, synthetic streams.
import assert from 'node:assert/strict';
import {readFile,mkdtemp,cp,mkdir,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
const root=process.env.ADR_ACCEPTANCE_CLIENT_ROOT;
if(!root||process.platform!=='darwin'||process.arch!=='arm64')throw Error('installed_macos_artifact_required');
const entry=f=>pathToFileURL(join(root,'src',f)).href;
const {SandboxRuntime}=await import(entry('runtime.mjs'));
const {createGuest}=await import(entry('provider.mjs'));
const {verifyProviderRuntime}=await import(entry('provider-runtime.mjs'));
await verifyProviderRuntime();
const runtime=new SandboxRuntime(JSON.parse(await readFile(process.env.ADR_ACCEPTANCE_RUNTIME_PATHS,'utf8')));await runtime.verify();
const copy=await mkdtemp('/tmp/adrpi-fixture-');let guest;
try{
 await cp(join(root,'provider-runtime'),join(copy,'src'),{recursive:true});await mkdir(join(copy,'test'));await cp(new URL('../test/pi-native.test.mjs',import.meta.url),join(copy,'test/pi-native.test.mjs'));
 guest=await createGuest(runtime,[],copy,undefined,{continuous:false});
 const output=await runtime.run(guest,['node','--test','/workspace/test/pi-native.test.mjs'],{timeoutSeconds:60});
 assert.match(output,/fail 0/);assert.match(output,/pass 15/);
 console.log(JSON.stringify({status:'passed',installed:root,platform:'darwin-arm64',nativeFamilies:6,syntheticTests:15,paidInference:false}));
}finally{if(guest)await runtime.remove(guest);await rm(copy,{recursive:true,force:true});}
