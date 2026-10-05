import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdtemp, readFile, rm, symlink } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { ProviderLifecycle } from '../src/provider-lifecycle.mjs';
import { ProviderReports, reportDigest } from '../src/provider-reports.mjs';
import { modelStatusLines, visibleModelStatus } from '../src/model-status.mjs';

const payload=()=>({id:randomUUID(),usage:{input:10,output:2,cacheRead:0,cacheWrite:0,reasoning:null},streaming:true,tools:true,completed:true});
async function fixture(){const directory=await mkdtemp(join(tmpdir(),'adr-report-'));const binding={nodeId:randomUUID(),providerRunId:randomUUID(),installationId:randomUUID(),nativeRevision:1};const lifecycle=new ProviderLifecycle({...binding,directory});return {directory,binding,lifecycle,reports:new ProviderReports(lifecycle),close:()=>rm(directory,{recursive:true,force:true})};}
for(const lost of ['before_commit','after_commit'])test(`durable ${lost} recovery sends only the exact report`,async()=>{
 const f=await fixture();try{const input=payload();const record=await f.reports.save(f.binding,{...input,text:'private response marker',headers:{private:'marker'}});let reports=0,settlements=0,committed;
 const network={request:async(path,o={})=>{if(path.endsWith('/complete')){reports++;assert.deepEqual(o.body,input);if(reports===1){if(lost==='after_commit'){committed={...f.binding,state:'settled',passed:true,reportDigest:record.digest};settlements++;}throw Object.assign(Error('private transport marker'),{code:'network_unavailable_outcome_unknown'});}settlements++;return {passed:true};}return {nativeChecks:committed?{[input.id]:committed}:{}};}};
 assert.equal((await f.reports.deliver(network,record)).passed,true);assert.equal(reports,lost==='after_commit'?1:2);assert.equal(settlements,1);assert.equal((await f.reports.pending()).length,0);
 const bytes=await readFile(join(f.reports.directory,'report-'+input.id+'.json'),'utf8');assert.doesNotMatch(bytes,/private|headers|text|prompt|arguments/);
 }finally{await f.close();}
});
test('process interruption retains report and permanent auth failure never retries',async()=>{
 const f=await fixture();try{const record=await f.reports.save(f.binding,payload());const restarted=new ProviderReports(new ProviderLifecycle({...f.binding,directory:f.directory}));assert.deepEqual(await restarted.pending(),[record]);let calls=0;await assert.rejects(restarted.deliver({request:async()=>{calls++;throw Object.assign(Error('private'),{code:'installation_revoked',status:401});}},record),{code:'installation_revoked'});assert.equal(calls,1);assert.equal((await restarted.pending()).length,1);
 }finally{await f.close();}
});
test('status freshness never retains positive availability; narrow output lists every model',()=>{
 const status={model:'first',qualification:'passed',availability:'available',confirmedAt:1,leaseUntil:30000};assert.equal(visibleModelStatus(status,{now:15001}).availability,'Unknown');assert.equal(visibleModelStatus(status,{now:2,stale:true}).availability,'Unknown');assert.equal(visibleModelStatus(status,{now:2}).availability,'Available');assert.match(modelStatusLines([status,{...status,model:'second',qualification:'not_tested',availability:'blocked'}],{now:2,width:40}).join('\n'),/first[\s\S]*second/);
});
