import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdtemp, chmod, readFile, lstat, rm, symlink, mkdir, copyFile, cp } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { execFileSync } from 'node:child_process';
import { join } from 'node:path';
import { safeFailure, failureLines, writePrivateDiagnostic, readPrivateDiagnostic, exportFailure, normalizeDiagnosticCode, setupResponseCodes } from '../src/failure-diagnostics.mjs';
import { upstreamFailureCodes } from '../src/connectors.mjs';
import { ProviderLifecycle } from '../src/provider-lifecycle.mjs';
import { providerDiagnostic } from '../src/provider-diagnostics.mjs';
import { BuyerLifecycle } from '../src/buyer-lifecycle.mjs';
import { requestEvidence } from '../src/transport-evidence.mjs';
import { readCodingStream } from '../src/coding-wire.mjs';
import { Network } from '../src/network.mjs';

const fixture=()=>({schemaVersion:1,requestId:randomUUID(),sessionId:randomUUID(),providerRunId:randomUUID(),model:'deepseek-flash',api:'openai-completions',phase:'tunnel',code:'upstream_failed_outcome_unknown',elapsedMs:27,statusCode:null,transportCategory:'dns',transportCode:'ENOTFOUND',dispatchEvidence:'outcome_unknown',responseEvidence:'not_observed',timeline:[{phase:'preparation',elapsedMs:0},{phase:'tunnel',elapsedMs:20}]});
test('canonical diagnostic normalization preserves supported codes and maps only local setup aliases',()=>{
 for(const code of [...upstreamFailureCodes,'request_cancelled','request_deadline_expired','provider_connection_lost','request_authority_lost','request_outcome_unknown']){assert.ok(safeFailure({...fixture(),code}));assert.equal(normalizeDiagnosticCode(code),code);}
 for(const code of setupResponseCodes)assert.equal(normalizeDiagnosticCode(code),'upstream_malformed_response');
 for(const code of [undefined,null,{},'PRIVATE_SENTINEL','sdk_compatibility_unsupported','provider_output_bound_exceeded','upstream_response_limit'])assert.equal(normalizeDiagnosticCode(code),'upstream_failed_outcome_unknown');
 const d={...fixture(),code:'upstream_malformed_response'};assert.match(failureLines(d,[],'setup_probe_invalid_arguments').join('\n'),/setup_probe_invalid_arguments/);assert.doesNotMatch(failureLines(d,[],'PRIVATE_SENTINEL').join('\n'),/PRIVATE_SENTINEL/);
});
test('legacy inference guest imports without buyer validators or npm dependencies',async()=>{
 const directory=await mkdtemp(join(process.platform==='darwin'?'/private/tmp':tmpdir(),'adr-legacy-import-'));
 try{
  await mkdir(join(directory,'generated'));
  for(const file of ['provider-broker.mjs','coding-wire.mjs','connectors.mjs','generated/connectors.mjs'])await copyFile(new URL('../src/'+file,import.meta.url),join(directory,file));
  execFileSync(process.execPath,['--input-type=module','-e',`const m=await import(${JSON.stringify('file://'+join(directory,'provider-broker.mjs'))});if(typeof m.upstreamInference!=='function')throw Error('guest_import_failed');`],{stdio:'pipe'});
 }finally{await rm(directory,{recursive:true,force:true});}
});
test('strict diagnostics reject extra private fields, invalid evidence and unbounded timelines',()=>{
 const d=fixture();assert.deepEqual(safeFailure(d),d);
 for(const patch of [{prompt:'PRIVATE_SENTINEL'},{transportCode:'PRIVATE_SENTINEL'},{code:'PRIVATE_SENTINEL'},{timeline:[{phase:'tls',elapsedMs:28}]},{timeline:[{phase:'tls',elapsedMs:20},{phase:'dispatch',elapsedMs:1}]},{statusCode:400}])assert.equal(safeFailure({...d,...patch}),null);
 const lines=failureLines(d).join('\n');assert.match(lines,/outcome_unknown/);assert.doesNotMatch(lines,/No model request sent/);assert.match(lines,/27 ms/);
});
test('preparation, dispatch and response evidence are independent; transport causes survive wrappers',()=>{
 let now=100;const d=fixture(),trace=requestEvidence({providerRunId:d.providerRunId},{requestId:d.requestId,sessionId:d.sessionId,model:d.model,api:d.api},()=>now);
 assert.equal(trace.snapshot(d.code).dispatchEvidence,'not_sent');trace.attempt();assert.equal(trace.snapshot(d.code).dispatchEvidence,'outcome_unknown');trace.stage('tunnel');now+=20;trace.error({cause:{code:'ENOTFOUND',message:'PRIVATE_SENTINEL'}});
 assert.equal(trace.snapshot(d.code).dispatchEvidence,'outcome_unknown');assert.equal(trace.snapshot(d.code).transportCategory,'dns');trace.stage('dispatch');assert.equal(trace.snapshot(d.code).dispatchEvidence,'dispatched');trace.response(503);assert.equal(trace.snapshot(d.code).responseEvidence,'headers_received');trace.stage('streaming');trace.response(503);assert.equal(trace.snapshot(d.code).phase,'streaming');now+=7;assert.equal(safeFailure(trace.snapshot(d.code)).elapsedMs,27);
 assert.equal(JSON.stringify(trace.snapshot(d.code)).includes('PRIVATE_SENTINEL'),false);
});
test('primary request evidence survives provider cleanup and buyer status failures',async()=>{
 const directory=await mkdtemp(join(process.platform==='darwin'?'/private/tmp':tmpdir(),'adr-failure-')),d=fixture(),nodeId=randomUUID();
 try{
  const p=new ProviderLifecycle({nodeId,providerRunId:d.providerRunId,directory});p.fail(providerDiagnostic('request',{code:d.code},{nodeId,providerRunId:d.providerRunId,requestId:d.requestId,sessionId:d.sessionId,model:d.model,api:d.api,requestEvidence:'outcome_unknown',failureDiagnostic:d}));p.fail({phase:'guest_removal',code:'runtime_cleanup_failed'},{secondary:true});await p.finish([{phase:'guest_removal',status:'failed',code:'runtime_cleanup_failed'}]);
  const saved=JSON.parse(await readFile(p.path,'utf8'));assert.deepEqual(saved.terminalFailure.failureDiagnostic,d);assert.equal(saved.terminalFailure.requestId,d.requestId);assert.equal(saved.terminalFailure.requestEvidence,'outcome_unknown');assert.equal(saved.secondaryFailures[0].code,'runtime_cleanup_failed');
  const buyer=new BuyerLifecycle();buyer.event('status',{code:'network_unavailable_outcome_unknown'});buyer.event('inference',{code:d.code,failureDiagnostic:d,diagnosticSaveFailed:true});buyer.event('diagnostic_save',{code:'router_diagnostic_save_failed'});buyer.event('cleanup',{code:'cleanup_failed'});assert.deepEqual(buyer.failureDiagnostic,d);assert.equal(buyer.diagnosticSaveFailed,true);
 }finally{await rm(directory,{recursive:true,force:true});}
});
test('atomic owner-only persistence, reopen and export contain no workload/financial fields',async()=>{
 const directory=await mkdtemp(join(process.platform==='darwin'?'/private/tmp':tmpdir(),'adr-failure-')),d=fixture();
 try{
  await writePrivateDiagnostic(directory,'lifecycle.json',{failureDiagnostic:d});assert.deepEqual((await readPrivateDiagnostic(directory,'lifecycle.json')).failureDiagnostic,d);assert.equal((await lstat(join(directory,'lifecycle.json'))).mode&0o777,0o600);
  const path=await exportFailure(directory,d,[{phase:'remote_stop',status:'failed',code:'cleanup_failed',session:{secret:'PRIVATE_SENTINEL',charged:'99'}}]);const value=await readFile(path,'utf8');assert.doesNotMatch(value,/PRIVATE_SENTINEL|charged|secret/);assert.deepEqual(JSON.parse(value).failureDiagnostic,d);
  await symlink(join(directory,'lifecycle.json'),join(directory,'unsafe.json'));await assert.rejects(readPrivateDiagnostic(directory,'unsafe.json'));
  await chmod(directory,0o755);await assert.rejects(exportFailure(directory,d),/unsafe/);
 }finally{await rm(directory,{recursive:true,force:true});}
});
test('both JSON and streaming errors retain validated diagnostics; legacy errors remain usable',async()=>{
 const d=fixture();const response=new Response(JSON.stringify({type:'error',code:d.code,failureDiagnostic:d,diagnosticSaveFailed:true})+'\n',{headers:{'content-type':'application/x-ndjson'}});await assert.rejects(readCodingStream(response),e=>e.code===d.code&&e.failureDiagnostic.requestId===d.requestId&&e.diagnosticSaveFailed===true);
 const network=new Network({origin:'http://127.0.0.1:9',local:true,fetcher:async(_url,init)=>{assert.equal(init.headers['X-Adr-Failure-Diagnostics'],'1');return new Response(JSON.stringify({code:d.code,failureDiagnostic:d,diagnosticSaveFailed:true}),{status:409});}});
 await assert.rejects(network.request('/v2/sessions/'+d.sessionId),e=>e.failureDiagnostic.requestId===d.requestId&&e.diagnosticSaveFailed===true);
 const old=new Response('{"type":"error","code":"upstream_timeout"}\n',{headers:{'content-type':'application/x-ndjson'}});await assert.rejects(readCodingStream(old),e=>e.code==='upstream_timeout'&&!e.failureDiagnostic);
});

test('coding payload diagnostic validator imports in isolation from host dependencies',async()=>{
 const directory=await mkdtemp(join(process.platform==='darwin'?'/private/tmp':tmpdir(),'adr-coding-import-'));
 try{
  await mkdir(join(directory,'generated'));await mkdir(join(directory,'node_modules'));
  for(const file of ['failure-diagnostics.mjs','generated/validators.mjs'])await copyFile(new URL('../coding-runtime/'+file,import.meta.url),join(directory,file));
  for(const dependency of ['ajv','fast-deep-equal'])await cp(new URL('../coding-runtime/node_modules/'+dependency,import.meta.url),join(directory,'node_modules',dependency),{recursive:true});
  execFileSync(process.execPath,['--input-type=module','-e',`const m=await import(${JSON.stringify('file://'+join(directory,'failure-diagnostics.mjs'))});if(m.safeFailure(null)!==null)throw Error('diagnostic_import_failed');`],{stdio:'pipe'});
 }finally{await rm(directory,{recursive:true,force:true});}
});
