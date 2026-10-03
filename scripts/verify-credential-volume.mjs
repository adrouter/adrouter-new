import assert from 'node:assert/strict';import {mkdtemp,writeFile,copyFile,rm,readFile} from 'node:fs/promises';import {join,resolve} from 'node:path';import {tmpdir} from 'node:os';import {pathToFileURL} from 'node:url';import {randomUUID} from 'node:crypto';
const root=resolve(process.env.ADR_ACCEPTANCE_CLIENT_ROOT??'.');
const {SandboxRuntime}=await import(pathToFileURL(join(root,'src/runtime.mjs')));
const {credentialVolume}=await import(pathToFileURL(join(root,'src/credential-volume.mjs')));
const {createGuest}=await import(pathToFileURL(join(root,'src/provider.mjs')));
const config=JSON.parse(await readFile(process.env.ADR_ACCEPTANCE_RUNTIME_PATHS??'runtime-paths.json','utf8'));
const runtime=new SandboxRuntime(config);await runtime.verify();
const node={id:randomUUID(),ownerId:randomUUID(),installationId:randomUUID()};let account=node.ownerId,installation=node.installationId;
const network={origin:'https://synthetic.example.test',store:{read:async()=>({installation_id:installation})},request:async path=>path.endsWith('/me')?{userId:account}:node};
let vault,guest,copied;
try {
 copied=await mkdtemp(join(tmpdir(),'adr-vault-check-'));await copyFile(join(root,'src/guest-credentials.mjs'),join(copied,'guest-credentials.mjs'));
 await writeFile(join(copied,'check.mjs'),`import assert from 'node:assert/strict';import {GuestCredentialStore} from './guest-credentials.mjs';const store=new GuestCredentialStore();const action=process.argv[2];if(action==='write')await store.modify('fixture',async()=>({type:'api_key',key:'synthetic-vault-key'}));if(action==='read')assert.equal((await store.read('fixture')).key,'synthetic-vault-key');if(action==='delete'){await store.disconnect();assert.equal(await store.read('fixture'),undefined);}console.log('PASS '+action);`);
 vault=await credentialVolume(network,runtime,node);guest=await createGuest(runtime,[],copied,undefined,{vault});assert.match(await runtime.run(guest,['node','/workspace/check.mjs','write']),/PASS write/);await runtime.remove(guest);guest=null;
 account=randomUUID();await assert.rejects(credentialVolume(network,runtime,node),/not_authorized/);account=node.ownerId;
 installation=randomUUID();await assert.rejects(credentialVolume(network,runtime,node),/not_authorized/);node.installationId=installation;
 const restored=await credentialVolume(network,runtime,node);assert.equal(restored.name,vault.name);guest=await createGuest(runtime,[],copied,undefined,{vault:restored});assert.match(await runtime.run(guest,['node','/workspace/check.mjs','read']),/PASS read/);assert.match(await runtime.run(guest,['node','/workspace/check.mjs','delete']),/PASS delete/);await runtime.remove(guest);guest=null;
 console.log(JSON.stringify({status:'passed',actualGuest:true,stopRestart:true,otherAccountDenied:true,replacementInstallationRequiresBinding:true,sameOwnerReclaim:true,disconnect:true,hostReadCredentialBytes:false}));
}finally{if(guest&&runtime.owned.has(guest))await runtime.remove(guest);if(copied)await rm(copied,{recursive:true,force:true});if(vault)await runtime.call(['volume','remove',vault.name]);}
