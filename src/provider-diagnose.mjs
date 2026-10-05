import { constants } from 'node:fs';
import { open, lstat } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { ProviderLifecycle } from './provider-lifecycle.mjs';
import { ProviderReports } from './provider-reports.mjs';
import { modelStatusLines } from './model-status.mjs';
import { providerDiagnosticLines } from './provider-diagnostics.mjs';
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
      evidence.push({providerRunId,lifecycle,reports,pending:await reports.pending(),local:{firstFailure:local.firstFailure,stopTrigger:local.stopTrigger,outcomes:local.outcomes,ownership:local.ownership,pid:local.pid}});
    }catch(error){if(error.code==='ENOENT')continue;throw error;}
  }
  return evidence;
}
export async function diagnoseProvider(network,nodeId,profile,options={}) {
  const node=await network.request(`/v2/providers/nodes/${nodeId}?view=diagnostics`);
  const evidence=await providerEvidence(node,profile,{...options,origin:network.origin});
  return {node,evidence};
}
export function diagnosisLines({node,evidence}) {
  return [...providerDiagnosticLines(node.lastRunFailure??evidence.at(-1)?.local.firstFailure),...modelStatusLines(node.modelStatuses),`Cleanup: ${node.cleanupState??'unknown'}`,`Pending exact reports: ${evidence.reduce((n,e)=>n+e.pending.length,0)}`,...(node.diagnosticCapabilities?.operatorCleanupRequired?['Next action: Marketplace operator → Provider sessions and cleanup']:['Next action: Refresh, Retry result report, or Retry cleanup as shown.']),'No controller attached in this terminal'];
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
