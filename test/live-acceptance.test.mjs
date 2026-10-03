import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, readdir, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { prepareLiveFixture,checkLiveBounds,defectiveSource,fixtureTests } from '../scripts/acceptance/live.mjs';
import { piCatalog } from '../src/generated/pi-catalog.mjs';
test('prepare creates exactly two known coding files without profile or provider access',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'adr-live-fixture-'));try{
  const result=await prepareLiveFixture(dir,piCatalog);assert.equal(result.api,'openai-completions');assert.equal(result.thinking,false);assert.equal((await readdir(join(dir,'coding-fixture'))).length,2);assert.equal(await readFile(join(dir,'coding-fixture/sum-range.mjs'),'utf8'),defectiveSource);assert.equal(await readFile(join(dir,'coding-fixture/sum-range.test.mjs'),'utf8'),fixtureTests);
 }finally{await rm(dir,{recursive:true,force:true});}
});
test('live bounds include qualification and cannot exceed the configured remaining enforced limits',()=>{
 const node={connectorProtocol:'pi_native_v1',provider:'deepseek',models:['deepseek-flash'],nativeModels:[{api:'openai-completions'}],maxOutputTokens:512,sharedAllowance:{totalTokens:'100000',consumedTokens:'10',outstandingTokens:'2',testCredits:'1000',consumedCredits:'1',outstandingCredits:'0'}};
 const run={nodeId:'synthetic',dispatchLimit:8,maxOutputTokens:512,maximumMicrousd:'10000',maximumTokens:'100000',maximumTestCredits:'1000'};
 assert.equal(checkLiveBounds(node,{remainingMicrousd:'10000'},run).dispatchLimit,8);
 for(const patch of [{dispatchLimit:4},{maximumTokens:'1'},{maximumMicrousd:'0'},{maxOutputTokens:128}])assert.throws(()=>checkLiveBounds(node,{remainingMicrousd:'10000'},{...run,...patch}));
 assert.throws(()=>checkLiveBounds({...node,models:['other']},{remainingMicrousd:'10000'},run));
});
