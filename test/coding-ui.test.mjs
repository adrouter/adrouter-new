import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, mkdir, writeFile, rm, realpath } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { workspaceSnapshot } from '../src/guest/workspace-snapshot.mjs';
import { importWorkspace, reviewAndApply } from '../src/workspace.mjs';
import { CodingDisplay, estimateCredits, inferenceErrorMessage } from '../src/coding-display.mjs';
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
