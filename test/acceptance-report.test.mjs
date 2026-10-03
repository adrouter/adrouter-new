import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { newReport, verdicts, validateReport, checkpoint, verifyEvidence, evidenceReference, digest, safeCode, gateIds, validateSyntheticResult } from '../scripts/acceptance/report.mjs';
const fresh=()=>newReport('prepare',Object.fromEntries(['productCommit','baselineVerifierCommit','verifierCommit','verifierTreeSha256','routerCommit','routerVerifierCommit','routerVerifierTreeSha256','version','artifactSha256','runtimeSha256','librarySha256','providerRuntimeSha256','codingRuntimeSha256','catalogSha256','deployment','authExpectationsSha256'].map(k=>[k,k==='version'?'0.1.0-alpha.31':k==='deployment'?'alpha31':'a'.repeat(64)])));
const finish=r=>{r.verdicts=verdicts(r);return r;};
const pass=(r,id)=>Object.assign(r.gates.find(g=>g.id===id),{status:'passed',observedAt:new Date().toISOString(),evidence:[evidenceReference('gate.json',digest('{}'))]});
test('missing hosted gates never establish readiness; all live gates remain required',()=>{
 const r=fresh();for(const id of gateIds.filter(id=>!id.startsWith('live.')))pass(r,id);
 r.gates.find(g=>g.id==='buyer.refresh-2').status='not_run';r.gates.find(g=>g.id==='buyer.refresh-2').evidence=[];r.gates.find(g=>g.id==='buyer.refresh-2').observedAt=null;
 assert.equal(verdicts(r).readiness,'incomplete');pass(r,'buyer.refresh-2');assert.equal(verdicts(r).readiness,'ready');assert.equal(verdicts(r).liveAcceptance,'incomplete');
 for(const id of gateIds.filter(id=>id.startsWith('live.')))pass(r,id);assert.equal(verdicts(r).liveAcceptance,'incomplete');r.finishedAt=new Date().toISOString();assert.equal(verdicts(r).liveAcceptance,'passed');
});
test('report rejects duplicates, missing cases, invented verdicts, secrets and unsafe references',()=>{
 for(const mutate of [r=>r.gates.pop(),r=>r.gates[0]=r.gates[1],r=>r.identities.token='adr_at_private',r=>r.gates[0].raw='private',r=>r.verdicts.readiness='ready',r=>r.gates[0].status='passed']){
  const r=finish(fresh());mutate(r);assert.throws(()=>validateReport(r));
 }
 for(const path of ['../credentials','/private','x/../y','https://secret'])assert.throws(()=>evidenceReference(path,'a'.repeat(64)));
 assert.equal(safeCode(Error('upstream key private text')),'verification_failed');
});
test('interrupted checkpoints preserve completed gates and detect changed evidence',async()=>{
 const dir=await mkdtemp(join(tmpdir(),'adr-report-test-'));try{
  const r=fresh();pass(r,'artifact');r.interrupted=true;await writeFile(join(dir,'gate.json'),'{}');await checkpoint(dir,r);await verifyEvidence(dir,r);assert.equal(r.gates[1].status,'not_run');
  await writeFile(join(dir,'gate.json'),'changed');await assert.rejects(verifyEvidence(dir,r),/./);
 }finally{await rm(dir,{recursive:true,force:true});}
});

test('case evidence rejects unsafe fields and incomplete synthetic success while preserving partial results',()=>{
 const expected=['pi/provider/api/variant/text'],good={status:'passed',requiredCases:[{id:expected[0],status:'passed'}],auxiliaryFailed:0,foreignCases:0,duplicateCases:false,paidInference:false,providerApiPairs:1,nativeFamilies:1};
 validateSyntheticResult(good,expected);
 for(const patch of [{raw:'secret'},{duplicateCases:true},{requiredCases:[]},{requiredCases:[{id:expected[0],status:'not_run'}]},{paidInference:true}])assert.throws(()=>validateSyntheticResult({...good,...patch},expected));
 validateSyntheticResult({...good,status:'failed',requiredCases:[{id:expected[0],status:'not_run'}]},expected);
});
