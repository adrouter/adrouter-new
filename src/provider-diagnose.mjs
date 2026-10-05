import { constants } from 'node:fs';
import { open, lstat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { ProviderLifecycle } from './provider-lifecycle.mjs';
import { ProviderReports } from './provider-reports.mjs';
import { modelStatusLines } from './model-status.mjs';
import { providerDiagnosticLines, capturedDiagnostic } from './provider-diagnostics.mjs';
import { ClientError } from './network.mjs';

export async function providerEvidence(node, profile, {directory,origin}={}) {
  const runs=[...new Set([node.providerRunId,...Object.values(node.nativeChecks??{}).map(c=>c.providerRunId)].filter(v=>/^[a-f0-9-]{36}$/i.test(v??'')))].slice(0,32);
  const evidence=[];
  for(const providerRunId of runs) {
    const lifecycle=new ProviderLifecycle({nodeId:node.id,providerRunId,profile,directory});
    try {
      // Reopening uses existing metadata only; no directories or credentials are created/read.
      let current=dirname(lifecycle.path);
      for(;;){const st=await lstat(current);if(!st.isDirectory()||st.isSymbolicLink()||st.uid!==process.getuid()||(st.mode&0o077))throw new ClientError('provider_diagnostic_path_unsafe');if(current===lifecycle.base)break;current=dirname(current);}
      lifecycle.prepared=true;
      const file=await open(lifecycle.path,constants.O_RDONLY|constants.O_NOFOLLOW|constants.O_NONBLOCK);
      let local;
      try{const st=await file.stat();if(!st.isFile()||st.uid!==process.getuid()||st.nlink!==1||(st.mode&0o077)||st.size>262144)throw new ClientError('provider_diagnostic_file_unsafe');local=JSON.parse(await file.readFile('utf8'));}finally{await file.close();}
      if(local.nodeId!==node.id||local.providerRunId!==providerRunId)throw new ClientError('provider_diagnostic_binding_invalid');
      if(origin&&local.ownership?.origin&&local.ownership.origin!==origin)continue;
      const reports=new ProviderReports(lifecycle);
      const binding={nodeId:node.id,providerRunId};
      const sanitize = value => capturedDiagnostic(value,{nodeId:value?.nodeId??node.id,providerRunId:value?.providerRunId??providerRunId});
      const events=Array.isArray(local.events)?local.events.slice(-256).map(sanitize).filter(Boolean):[];
      const historical=events.length?events:[sanitize(local.firstFailure)].filter(Boolean);
      const failure=local.terminalFailure?sanitize(local.terminalFailure):historical.find(e=>['setup_reserve','setup_model_request','setup_response_validate','setup_report_save','setup_report_submit','configure_models','publication'].includes(e.operation))??null;
      evidence.push({providerRunId,lifecycle,reports,pending:await reports.pending(),local:{terminalFailure:failure,firstFailure:sanitize(local.firstFailure),secondaryFailures:(Array.isArray(local.secondaryFailures)?local.secondaryFailures:[]).slice(-32).map(sanitize).filter(Boolean),stopTrigger:typeof local.stopTrigger?.trigger==='string'&&/^[a-z0-9_]{1,80}$/.test(local.stopTrigger.trigger)?{trigger:local.stopTrigger.trigger,at:Number.isSafeInteger(local.stopTrigger.at)?local.stopTrigger.at:null}:null,outcomes:(Array.isArray(local.outcomes)?local.outcomes:[]).slice(-32).map(o=>({phase:/^[a-z0-9_]{1,80}$/.test(o.phase??'')?o.phase:null,status:['succeeded','failed','superseded','not_requested'].includes(o.status)?o.status:'unknown',code:/^[a-zA-Z0-9_]{1,80}$/.test(o.code??'')?o.code:null})),ownership:local.ownership,pid:local.pid}});
    }catch(error){if(error.code==='ENOENT')continue;throw error;}
  }
  return evidence;
}
export async function diagnoseProvider(network,nodeId,profile,options={}) {
  const node=await network.request(`/v2/providers/nodes/${nodeId}?view=diagnostics`);
  const evidence=await providerEvidence(node,profile,{...options,origin:network.origin});
  return {node,evidence,diagnosis:normalizeDiagnosis(node,evidence)};
}
export function normalizeDiagnosis(node,evidence=[]) {
  const notes=[];
  const running=node.status==='published'&&node.ready===true&&Number(node.leaseUntil)>Date.now()&&node.stoppedProviderRunId!==node.providerRunId;
  const run=evidence.find(e=>e.providerRunId===node.providerRunId);
  const backend=capturedDiagnostic(node.lastRunFailure,{nodeId:node.id});
  let currentBackend=backend?.providerRunId===node.providerRunId?backend:null;
  const check=currentBackend?.requestId?node.nativeChecks?.[currentBackend.requestId]:null;
  if(currentBackend&&check?.providerRunId===currentBackend.providerRunId){
    const model=check.nativeRevision===(node.nativeRevision??0)?node.nativeModels?.find(m=>m.model===check.model):null;
    currentBackend=capturedDiagnostic({...currentBackend,provider:node.provider,model:check.model,api:model?.api,maxOutputTokens:check.outputBound},{nodeId:node.id});
  }
  if(backend&&!currentBackend)notes.push('Router failure belongs to a different run.');
  const local=run?.local.terminalFailure??null;
  const bound = d => d && d.providerRunId===node.providerRunId && d.nodeId===node.id &&
    (!d.requestId || node.nativeChecks?.[d.requestId]?.providerRunId===d.providerRunId);
  if(local&&!bound(local))notes.push('Local failure check identity does not match Router evidence.');
  const safeLocal=bound(local)?local:null;
  let primary=currentBackend??safeLocal;
  if(currentBackend&&safeLocal){
    if(currentBackend.requestId===safeLocal.requestId&&currentBackend.operation===safeLocal.operation&&currentBackend.code===safeLocal.code){
      primary={...currentBackend};
      for(const [key,value] of Object.entries(safeLocal))if(value!==null&&value!==undefined&&(!Array.isArray(value)||value.length))primary[key]=value;
      for(const key of ['statusCode','requestEvidence'])if(currentBackend[key]!=null&&safeLocal[key]!=null&&currentBackend[key]!==safeLocal[key]){notes.push('Conflicting '+key+' evidence.');primary[key]=currentBackend[key];}
    }else notes.push('Local and Router failures identify different operations or attempts; evidence was not combined.');
  }
  if(!run)notes.push('Matching local run evidence is absent.');
  if(!primary&&node.cleanupState==='failed')notes.push('Cleanup failed, but its causal failure was not captured.');
  else if(primary&&(!primary.model||!primary.api))notes.push('Some model/API details were not captured.');
  const secondary=(run?.local.secondaryFailures??[]).filter(bound).filter(d=>!primary||d.requestId===primary.requestId);
  const pending=evidence.reduce((n,e)=>n+e.pending.length,0);
  const actions=[];
  if(pending&&node.diagnosticCapabilities?.retryResultReport)actions.push('retry_saved_report');
  if(node.diagnosticCapabilities?.retryCleanup&&run?.local.ownership?.nodeId===node.id&&run.local.ownership?.providerRunId===node.providerRunId&&run.local.ownership?.installationId===node.installationId&&Number.isSafeInteger(run.local.pid)&&run.local.pid>0){
    try{process.kill(run.local.pid,0);}catch(error){if(error.code==='ESRCH')actions.push('retry_verified_cleanup');}
  }
  if(node.diagnosticCapabilities?.operatorCleanupRequired)actions.push('operator_cleanup');
  if(node.status!=='deleted'&&node.cleanupState==='succeeded'&&Number(node.providerRunLeaseUntil??0)<=Date.now())actions.push('edit_configuration','authorize_new_test');
  return {nodeId:node.id,providerRunId:node.providerRunId??null,running,primaryFailure:primary,secondaryFailures:secondary,
    earlierTransientFailure:run?.local.firstFailure&&run.local.firstFailure.code!==primary?.code?run.local.firstFailure:null,
    modelStatuses:node.modelStatuses??[],cleanupState:node.cleanupState??'unknown',cleanupOutcomes:run?.local.outcomes??[],
    accountingState:node.diagnosticSessions??[],pendingReports:pending,evidenceNotes:notes,recoveryActions:actions};
}
export function diagnosisLines(result,{controllerAttached}={}) {
  const d=result.diagnosis??normalizeDiagnosis(result.node,result.evidence);
  return [...(d.primaryFailure?providerDiagnosticLines(d.primaryFailure):[d.running?'Provider is running. No setup failure recorded.':'No setup failure recorded.']),...d.secondaryFailures.flatMap(f=>['Separate unresolved operation:',...providerDiagnosticLines(f)]),
    ...(d.earlierTransientFailure?['Earlier transient diagnostic:',...providerDiagnosticLines(d.earlierTransientFailure)]:[]),
    ...modelStatusLines(d.modelStatuses),`Cleanup: ${d.running&&d.cleanupState==='pending'?'Not requested — provider is running':d.cleanupState}`,...d.cleanupOutcomes.map(o=>`${o.phase}: ${o.status}${o.code?' · '+o.code:''}`),
    `Pending exact reports: ${d.pendingReports}`,...d.evidenceNotes,
    ...d.recoveryActions.map(a=>'Next action: '+({retry_saved_report:'Retry saved result report; no model request.',retry_verified_cleanup:'Retry verified cleanup.',operator_cleanup:'Marketplace operator → Provider sessions and cleanup.',edit_configuration:'Edit configuration.',authorize_new_test:'Explicitly authorize a new setup test.'}[a])),controllerAttached===true?'Controller attached in this terminal':controllerAttached===false?'No controller attached in this terminal':'Local controller attachment not checked'];
}
export async function retryProviderReports(network,nodeId,profile,options={}) {
  const {node,evidence}=await diagnoseProvider(network,nodeId,profile,options);
  let delivered=0;
  for(const run of evidence)for(const record of run.pending){await run.reports.deliver(network,record);delivered++;}
  return {nodeId:node.id,delivered,inferenceRequests:0};
}

export async function retryProviderCleanup(network,nodeId,profile,options={}) {
  const {node,evidence}=await diagnoseProvider(network,nodeId,profile,options);
  const owned=evidence.find(e=>e.providerRunId===node.providerRunId&&e.local.ownership?.nodeId===node.id&&e.local.ownership?.providerRunId===node.providerRunId&&e.local.ownership?.origin===network.origin&&e.local.ownership?.installationId===node.installationId);
  if(!owned||!node.diagnosticCapabilities?.retryCleanup||!/^adrnew-[a-f0-9-]{36}$/.test(owned.local.ownership.guestName))throw new ClientError('verified_cleanup_ownership_required');
  if(!Number.isSafeInteger(owned.local.pid)||owned.local.pid<=0)throw new ClientError('provider_controller_identity_unknown');
  try{process.kill(owned.local.pid,0);throw new ClientError('provider_controller_still_running');}catch(error){if(error.code!=='ESRCH')throw error;}
  const {configuredRuntime}=await import('./provider.mjs');const runtime=options.runtime??await configuredRuntime();await runtime.verify();
  const name=owned.local.ownership.guestName;
  await network.request(`/v2/providers/nodes/${node.id}/stop`,{method:'POST',body:{scope:'run',providerRunId:node.providerRunId,trigger:'cleanup_retry'},signal:AbortSignal.timeout(10000)});
  const inventory=JSON.parse(await runtime.call(['list','--format','json']));if(!Array.isArray(inventory))throw new ClientError('runtime_inventory_invalid');
  const present=inventory.some(v=>v===name||v.name===name);
  if(present){
    // Adoption is limited to persisted task-created ownership and the current
    // backend run, after its original controller has exited.
    runtime.owned.add(name);
    try{const info=await runtime.inspect(name);const image=JSON.parse(await (await import('node:fs/promises')).readFile(new URL('../runtime/guest-images.json',import.meta.url),'utf8'));if(info.config?.manifest_digest!==image.node['linux-'+process.arch]||info.config?.network?.policy?.default_egress!=='deny')throw new ClientError('guest_identity_or_policy_mismatch');await runtime.remove(name);}
    catch(error){runtime.owned.delete(name);throw error;}
  }
  const result=await network.request(`/v2/providers/nodes/${node.id}/teardown`,{method:'POST',body:{providerRunId:node.providerRunId,guestTeardownVerified:true},signal:AbortSignal.timeout(10000)});
  await owned.lifecycle.finish([{phase:'guest_removal',status:'succeeded'},{phase:'execution_release',status:'succeeded'}]);
  return {nodeId:node.id,providerRunId:node.providerRunId,guestRemoved:true,cleanupState:result.cleanupState,inferenceRequests:0};
}
