import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, realpath } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { workspaceSnapshot } from '../src/guest/workspace-snapshot.mjs';
import { importWorkspace, reviewAndApply } from '../src/workspace.mjs';
import { CodingDisplay, estimateCredits, inferenceErrorMessage, thinkingExplanation } from '../src/coding-display.mjs';
import { actionDiff } from '../src/action-diff.mjs';

test('guest-created hidden/generated/ignored files never block reviewed host application',async()=>{
 const root=await realpath(await mkdtemp(join(tmpdir(),'adr-ui-apply-'))),journals=await realpath(await mkdtemp(join(tmpdir(),'adr-ui-journal-')));
 let workspace;
 try {
  await writeFile(join(root,'main.txt'),'before\n');workspace=await importWorkspace(root,['main.txt']);
  await writeFile(join(workspace.copy,'main.txt'),'after\n');
  for(const folder of ['.cache','node_modules','dist']){await mkdir(join(workspace.copy,folder));await writeFile(join(workspace.copy,folder,'file.txt'),'synthetic excluded');}
  for(const name of ['.npmrc','.DS_Store','ignored.log'])await writeFile(join(workspace.copy,name),'synthetic excluded');
  await writeFile(join(workspace.copy,'.gitignore'),'*.log\nmain.txt\n');
  const snapshot=await workspaceSnapshot(workspace.copy,Object.keys(workspace.manifest));
  assert.deepEqual(Object.keys(snapshot.files).sort(),['.gitignore','main.txt']);
  assert.ok(snapshot.excluded.private>=3);assert.equal(snapshot.excluded.generated,2);assert.equal(snapshot.excluded.ignored,1);
  const result=await reviewAndApply(workspace,snapshot.files,async()=>true,{journalRoot:journals});assert.equal(result.status,'applied');
  const unchanged=await reviewAndApply({...workspace,manifest:{}},{},async()=>{throw Error('empty proposal must not ask approval');},{journalRoot:journals});assert.equal(unchanged.status,'unchanged');
 } finally {if(workspace)await rm(workspace.copy,{recursive:true,force:true});await rm(root,{recursive:true,force:true});await rm(journals,{recursive:true,force:true});}
});
test('credit estimate rounds each request exactly, deduplicates and keeps uncertain usage separate',()=>{
 const rates={inputRate:'1000',outputRate:'2000'};
 assert.equal(estimateCredits({inputTokens:1,outputTokens:1},rates),1n);
 const display=new CodingDisplay({id:'synthetic',charged:'7'},rates);display.pending=true;assert.match(display.view().label,/pending/);
 display.complete('r1',{inputTokens:1,outputTokens:1});display.complete('r1',{inputTokens:1,outputTokens:1});assert.match(display.view().label,/Estimated 8 test credits/);
 display.failed('provider_outcome_unknown');assert.match(display.view().label,/unresolved/);
 assert.equal(JSON.stringify(display.view()).includes('$'),false);
 assert.throws(()=>estimateCredits({inputTokens:-1,outputTokens:1},rates));
});
test('known limits and cancellation do not falsely instruct reconciliation',()=>{
 assert.match(inferenceErrorMessage('session_request_limit'),/request limit/);
 assert.doesNotMatch(inferenceErrorMessage('session_request_limit'),/Reconcile/);
 assert.match(inferenceErrorMessage('provider_outcome_unknown'),/Reconcile/);
 assert.match(inferenceErrorMessage('whatever',true),/cancelled/);
 assert.doesNotMatch(inferenceErrorMessage('unsafe\nsecret'),/unsafe/);
});
test('approval diffs retain unchanged context and only mark actual changes',async()=>{
 const lines=await actionDiff('one\ntwo\nthree\n','one\nchanged\nthree\n');
 assert.ok(lines.includes(' one'));assert.ok(lines.includes('-two'));assert.ok(lines.includes('+changed'));assert.ok(lines.includes(' three'));
});

test('thinking explanation distinguishes provider opt-out, accepted session and model support',()=>{
 assert.match(thinkingExplanation({modelSupported:true,providerEnabled:false}),/provider disabled/);
 assert.match(thinkingExplanation({providerEnabled:true,accepted:false}),/accepted session lacks/);
 assert.match(thinkingExplanation({modelSupported:false}),/model is unsupported/);
 assert.match(thinkingExplanation({accepted:true,providerEnabled:true}),/starts off/);
});

test('automatic coding reads reject outside roots and links while reviewed files remain readable',async()=>{
 const {reviewedRead}=await import('../src/guest/coding-read-policy.mjs');const {symlink}=await import('node:fs/promises');
 const root=await realpath(await mkdtemp(join(tmpdir(),'adr-read-policy-')));
 try{await writeFile(join(root,'main.txt'),'synthetic');await symlink('/tmp',join(root,'outside'));assert.equal((await reviewedRead({toolName:'read',arguments:{path:'main.txt'}},root)).allow,true);
 for(const path of ['../outside','/etc/passwd','outside/file','.adr-runtime/config.json'])assert.equal((await reviewedRead({toolName:'read',arguments:{path}},root)).allow,false);
 assert.equal((await reviewedRead({toolName:'ls',arguments:{}},root)).allow,true);
 }finally{await rm(root,{recursive:true,force:true});}
});

test('the discovered-read guard rejects private descendants and hard links synchronously',async()=>{
 const {reviewedRead}=await import('../src/guest/coding-read-policy.mjs');const {link}=await import('node:fs/promises');
 const root=await realpath(await mkdtemp(join(tmpdir(),'adr-read-discovery-')));
 try{
  await mkdir(join(root,'.adr-runtime'));await writeFile(join(root,'.adr-runtime','runtime.txt'),'synthetic');
  await mkdir(join(root,'.private-fixture'));await writeFile(join(root,'.private-fixture','hidden.txt'),'synthetic');await link(join(root,'.private-fixture','hidden.txt'),join(root,'hard-link'));
  await writeFile(join(root,'main.txt'),'project');
  for(const name of ['read','grep','find','ls']){
   assert.equal(reviewedRead({toolName:name,arguments:{path:join(root,'main.txt')}},root).allow,true);
   for(const path of ['.adr-runtime/runtime.txt','.private-fixture/hidden.txt','hard-link'])assert.equal(reviewedRead({toolName:name,arguments:{path:join(root,path)}},root).allow,false);
  }
 }finally{await rm(root,{recursive:true,force:true});}
});
