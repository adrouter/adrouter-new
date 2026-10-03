// Installed native adapters in an actual isolated macOS VM, synthetic streams.
import assert from 'node:assert/strict';
import {readFile,mkdtemp,cp,mkdir,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {catalogMatrix,matrixCaseIds,tapCaseResults} from '../test/helpers/pi-matrix.mjs';
const {piCatalog}=await import(pathToFileURL(join(process.env.ADR_ACCEPTANCE_CLIENT_ROOT??'', 'src/generated/pi-catalog.mjs')).href);
const matrix=catalogMatrix(piCatalog);
const root=process.env.ADR_ACCEPTANCE_CLIENT_ROOT;
if(!root||process.platform!=='darwin'||process.arch!=='arm64')throw Error('installed_macos_artifact_required');
const entry=f=>pathToFileURL(join(root,'src',f)).href;
const {SandboxRuntime}=await import(entry('runtime.mjs'));
const {createGuest}=await import(entry('provider.mjs'));
const {verifyProviderRuntime}=await import(entry('provider-runtime.mjs'));
const abort=new AbortController(),interrupt=()=>abort.abort();process.once('SIGINT',interrupt);process.once('SIGTERM',interrupt);
await verifyProviderRuntime();
const runtime=new SandboxRuntime(JSON.parse(await readFile(process.env.ADR_ACCEPTANCE_RUNTIME_PATHS,'utf8')));await runtime.verify({signal:abort.signal});
const copy=await mkdtemp('/tmp/adrpi-fixture-');let guest;
try{
 await cp(join(root,'provider-runtime'),join(copy,'src'),{recursive:true});await mkdir(join(copy,'test'));await cp(new URL('../test/pi-native.test.mjs',import.meta.url),join(copy,'test/pi-native.test.mjs'));await cp(new URL('../test/helpers/',import.meta.url),join(copy,'test/helpers'),{recursive:true});
 guest=await createGuest(runtime,[],copy,undefined,{continuous:false,signal:abort.signal});
 const output=await runtime.run(guest,['node','/workspace/test/helpers/run-pi-matrix.mjs'],{timeoutSeconds:300,signal:abort.signal});
 const result=JSON.parse(output);if(result.status==='passed')tapCaseResults(result.requiredCases.map((c,i)=>`ok ${i+1} - ${c.id}`).join('\n'),matrixCaseIds(matrix));
 console.log(JSON.stringify({...result,installed:root,platform:'darwin-arm64',nativeFamilies:new Set(matrix.map(c=>c.api)).size,providerApiPairs:new Set(matrix.map(c=>c.provider+'/'+c.api)).size,paidInference:false}));if(result.status!=='passed')process.exitCode=1;
}finally{if(guest)await runtime.remove(guest);await rm(copy,{recursive:true,force:true});process.removeListener('SIGINT',interrupt);process.removeListener('SIGTERM',interrupt);}
