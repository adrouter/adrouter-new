import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parseAcceptanceArgs,runAcceptance } from '../scripts/acceptance-runner.mjs';
import { verifyArtifact,verifyRuntime } from '../scripts/acceptance/identity.mjs';
const args=['client-root','router-root','runtime-paths','tarball','evidence','pages-cli','database-workdir'].flatMap(k=>['--'+k,'/fixture/'+k]);
test('runner defaults to prepare and rejects implicit advancement, duplicates and missing hosted/live controls',()=>{
 assert.equal(parseAcceptanceArgs(args).phase,'prepare');
 for(const extra of [['--phase','all'],['--phase','prepare','--phase','live'],['--phase','hosted-auth'],['--recover-broken'],['--phase','live','--prior-report','/prior','--auth-config','/auth']])assert.throws(()=>parseAcceptanceArgs([...args,...extra]));
});
test('runner refuses reused evidence before any installed auth or platform operation',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'adr-runner-test-'));try{await assert.rejects(runAcceptance({evidence:dir}),e=>e.code==='evidence_directory_exists');}finally{await rm(dir,{recursive:true,force:true});}
});
test('wrong installation/version cannot borrow alpha31 identity; modified runtime is rejected',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'adr-identity-test-'));try{
  const client=join(dir,'client'),source=join(dir,'source');await mkdir(client);await mkdir(source);
  await writeFile(join(client,'package.json'),JSON.stringify({name:'@adrouter/adr-cli',version:'0.1.0-alpha.30',private:true}));
  await assert.rejects(verifyArtifact({clientRoot:client,sourceRoot:source,tarball:join(dir,'artifact.tgz')}),e=>e.code==='artifact_version_mismatch');
  await assert.rejects(verifyArtifact({clientRoot:source,sourceRoot:source,tarball:join(dir,'artifact.tgz')}),e=>e.code==='installed_artifact_required');
  await writeFile(join(dir,'msb'),'modified-runtime');await writeFile(join(dir,'lib'),'modified-library');await writeFile(join(dir,'paths.json'),JSON.stringify({executable:join(dir,'msb'),library:join(dir,'lib'),home:join(dir,'state')}));
  await assert.rejects(verifyRuntime({clientRoot:fileURLToPath(new URL('../',import.meta.url)),runtimePaths:join(dir,'paths.json')}),e=>e.code==='runtime_digest_mismatch');
 }finally{await rm(dir,{recursive:true,force:true});}
});

test('Supabase metadata envelopes require the active exact linked target',async()=>{
 const {linkedDatabase}=await import('../scripts/acceptance/hosted-metadata.mjs');
 const project={id:'aqyiwlanxdhkwwlwiias',linked:true,status:'ACTIVE_HEALTHY'};
 assert.equal(linkedDatabase({projects:[project],message:'listed'}),project);assert.equal(linkedDatabase([project]),project);
 for(const result of [{projects:[{...project,linked:false}]},{projects:[{...project,id:'historical'}]},{projects:[{...project,status:'INACTIVE'}]},{rows:[]}])assert.throws(()=>linkedDatabase(result));
});
