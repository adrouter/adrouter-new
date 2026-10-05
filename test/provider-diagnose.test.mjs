import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {mkdtemp,rm,readFile,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {ProviderLifecycle} from '../src/provider-lifecycle.mjs';
import {diagnoseProvider,diagnosisLines,normalizeDiagnosis} from '../src/provider-diagnose.mjs';
import {providerDiagnostic,setupProbeFailure} from '../src/provider-diagnostics.mjs';

test('operation classification preserves safe source, transport and model request evidence',()=>{
 const sources={setup_reserve:'router_control',setup_model_request:'upstream_api',setup_response_validate:'model_response_validation',setup_report_save:'local_storage',setup_report_submit:'router_reporting',publication:'router_configuration',guest_removal:'local_runtime'};
 for(const [operation,provenance] of Object.entries(sources)){
  const d=providerDiagnostic('qualification_setup_probe',{code:'network_timeout',status:503,elapsedMs:40,body:'private marker'},{operation,requestEvidence:'not_sent'});
  assert.equal(d.operation,operation);assert.equal(d.provenance,provenance);assert.equal(d.requestEvidence,'not_sent');assert.equal(d.statusCode,503);assert.equal(d.transportCause,'timeout');assert.doesNotMatch(JSON.stringify(d),/private marker/);
 }
 assert.equal(providerDiagnostic('qualification_complete',{code:'result_report_unconfirmed'}).provenance,'router_reporting');
});
test('setup response validation distinguishes missing, wrong, invalid and truncated probes',()=>{
 const valid={toolCalls:[{function:{name:'adr_setup_probe',arguments:'{"value":"ready"}'}}],nativeMessage:{stopReason:'toolUse'}};
 assert.equal(setupProbeFailure(valid),null);
 for(const [patch,reason] of [[{toolCalls:[]},'setup_probe_missing'],[{toolCalls:[{function:{name:'different',arguments:'{}'}}]},'setup_probe_wrong_tool'],[{toolCalls:[{function:{name:'adr_setup_probe',arguments:'{"value":4}'}}]},'setup_probe_invalid_arguments'],[{toolCalls:[{function:{name:'adr_setup_probe',arguments:'null'}}]},'setup_probe_invalid_arguments'],[{nativeMessage:{stopReason:'length'}},'setup_response_truncated']])assert.equal(setupProbeFailure({...valid,...patch}),reason);
});
test('reopened matching evidence keeps terminal, transient, report and cleanup details independent',async()=>{
 const directory=await mkdtemp(join(tmpdir(),'adr-diag-')),nodeId=randomUUID(),providerRunId=randomUUID(),checkId=randomUUID();
 const l=new ProviderLifecycle({nodeId,providerRunId,directory});
 try{
  l.event('keepalive',{code:'runtime_command_failed'});
  const context={nodeId,providerRunId,requestId:checkId,provider:'fixture',model:'model-a',api:'sdk:@ai-sdk/openai',operation:'setup_response_validate',requestEvidence:'response_received',maxOutputTokens:512};
  const d=providerDiagnostic('qualification_setup_probe',{code:'setup_probe_invalid_arguments',statusCode:200,elapsedMs:17},context,()=>1234);
  l.fail(d);l.fail(providerDiagnostic('qualification_complete',{code:'result_report_unconfirmed',status:503},{...context,operation:'setup_report_submit'},()=>1240),{secondary:true});
  await l.finish([{phase:'guest_removal',status:'succeeded'}]);
  const node={id:nodeId,providerRunId,cleanupState:'succeeded',nativeChecks:{[checkId]:{id:checkId,providerRunId,state:'dispatched'}},lastRunFailure:{operation:d.operation,code:d.code,checkId,providerRunId,statusCode:200,requestEvidence:'response_received',at:1250},modelStatuses:[]};
  let reads=0;const network={origin:'https://synthetic.example.test',request:async(path)=>{reads++;assert.ok(path.endsWith('?view=diagnostics'));return node;}};
  const result=await diagnoseProvider(network,nodeId,'provider',{directory});assert.equal(reads,1);
  const primary=result.diagnosis.primaryFailure;assert.equal(primary.model,'model-a');assert.equal(primary.api,'sdk:@ai-sdk/openai');assert.equal(primary.elapsedMs,17);assert.equal(primary.operation,'setup_response_validate');assert.equal(primary.requestId,checkId);
  assert.equal(result.diagnosis.secondaryFailures[0].operation,'setup_report_submit');assert.equal(result.diagnosis.earlierTransientFailure.code,'runtime_command_failed');assert.equal(result.diagnosis.cleanupOutcomes[0].status,'succeeded');assert.match(diagnosisLines(result).join('\n'),/model-a[\s\S]*17 ms|17 ms[\s\S]*model-a/);
  // Bounded historical recovery sanitizes old events and retains their exact binding.
  const legacy=JSON.parse(await readFile(l.path));delete legacy.terminalFailure;delete legacy.secondaryFailures;legacy.firstFailure.body='private marker';legacy.events[1].arguments='private marker';await writeFile(l.path,JSON.stringify(legacy),{mode:0o600});
  const old=await diagnoseProvider(network,nodeId,'provider',{directory});assert.equal(old.diagnosis.primaryFailure.model,'model-a');assert.doesNotMatch(JSON.stringify(old.diagnosis),/private marker|"arguments"|"body"/);
  node.providerRunId=randomUUID();const changed=await diagnoseProvider(network,nodeId,'provider',{directory});assert.equal(changed.diagnosis.primaryFailure,null);
 }finally{await rm(directory,{recursive:true,force:true});}
});
test('reordered runs, missing evidence and conflicting identities never borrow another attempt',()=>{
 const id=randomUUID(),run=randomUUID(),oldRun=randomUUID(),check=randomUUID(),oldCheck=randomUUID();
 const node={id,providerRunId:run,nativeChecks:{[check]:{providerRunId:run}},lastRunFailure:{providerRunId:run,checkId:check,operation:'setup_report_submit',code:'result_report_unconfirmed',requestEvidence:'response_received',statusCode:503}};
 const local=providerDiagnostic('qualification_complete',{code:'result_report_unconfirmed',statusCode:502},{nodeId:id,providerRunId:run,requestId:check,operation:'setup_report_submit',model:'current-model',requestEvidence:'response_received'});
 const current={providerRunId:run,pending:[],local:{terminalFailure:local,outcomes:[]}};
 const historical={providerRunId:oldRun,pending:[],local:{terminalFailure:{...local,providerRunId:oldRun,requestId:oldCheck,model:'old-model'},outcomes:[]}};
 const a=normalizeDiagnosis(node,[current,historical]),b=normalizeDiagnosis(node,[historical,current]);assert.deepEqual(a,b);assert.equal(a.primaryFailure.statusCode,503);assert.equal(a.primaryFailure.model,'current-model');assert.ok(a.evidenceNotes.some(n=>n.includes('Conflicting')));
 const mismatch=normalizeDiagnosis(node,[{...current,local:{...current.local,terminalFailure:{...local,requestId:oldCheck}}}]);assert.equal(mismatch.primaryFailure.model,null);assert.ok(mismatch.evidenceNotes.some(n=>n.includes('identity')));
 const absent=normalizeDiagnosis(node,[]);assert.equal(absent.primaryFailure.model,null);assert.ok(absent.evidenceNotes.some(n=>n.includes('absent')));
});
