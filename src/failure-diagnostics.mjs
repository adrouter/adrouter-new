import { FailureDiagnostic } from './generated/validators.mjs';
import { constants } from 'node:fs';
import { open, lstat, rename, unlink } from 'node:fs/promises';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

export function safeFailure(value) {
  if (!FailureDiagnostic(value)) return null;
  if (value.timeline.some((e,i)=>e.elapsedMs>value.elapsedMs||i>0&&e.elapsedMs<value.timeline[i-1].elapsedMs)) return null;
  if (value.statusCode!==null&&value.responseEvidence==='not_observed') return null;
  return structuredClone(value);
}
export function failureSummary(value) {
  const d=safeFailure(value);
  return d ? `${d.code} · ${d.phase} · request ${d.requestId}` : 'Failure evidence unavailable (older request)';
}
export function failureLines(value, outcomes=[]) {
  const d=safeFailure(value);
  if(!d)return [failureSummary(value),...safeOutcomes(outcomes).map(e=>`Separate cleanup: ${e.phase} · ${e.status}${e.code?' · '+e.code:''}`),'Inspect the session/provider status. No request is replayed.'];
  return [failureSummary(d),`Session: ${d.sessionId??'unavailable'} · Run: ${d.providerRunId??'unavailable'}`,
    `Model/API: ${d.model??'unavailable'} / ${d.api??'unavailable'}`,`Elapsed: ${d.elapsedMs} ms · HTTP: ${d.statusCode??'not observed'}`,
    `Transport: ${d.transportCategory??'not captured'} · ${d.transportCode??'not captured'}`,
    `Dispatch: ${d.dispatchEvidence} · Response: ${d.responseEvidence}`,
    ...d.timeline.map(e=>`${e.elapsedMs} ms · ${e.phase}`),
    ...safeOutcomes(outcomes).map(e=>`Separate cleanup: ${e.phase} · ${e.status}${e.code?' · '+e.code:''}`),
    d.code==='request_cancelled'?'Request stopped. Save or export your work.':d.phase==='preparation'?'Inspect the accepted model/settings before another request.':d.transportCategory?'Inspect the provider connection and retained evidence before another request.':'Inspect provider status and HTTP evidence before another request.',
    'Unknown inference retains its liability. No automatic replay.'];
}
export const buyerOutcomePhases=Object.freeze(['guest_removal','workspace_cleanup','remote_stop','settlement','diagnostic_save']);
export function safeOutcomes(values=[]) {
  const byPhase=new Map();
  for(const v of (Array.isArray(values)?values:[]).slice(-256)){
    if(!v||typeof v!=='object'||!/^[a-z0-9_]{1,80}$/.test(v.phase??''))continue;
    const entry={phase:v.phase,status:['succeeded','failed','pending','superseded','not_requested','unknown'].includes(v.status)?v.status:'unknown',code:/^[a-z0-9_]{1,80}$/.test(v.code??'')?v.code:null};
    if(entry.phase==='diagnostic_save'&&byPhase.get(entry.phase)?.status==='failed')continue;
    byPhase.set(entry.phase,entry);
  }
  return [...byPhase.values()].slice(-32);
}
// The same normalization is used for live snapshots and historical records.
export function failureSnapshot(record={}) {
  const events=(Array.isArray(record.events)?record.events:[]).filter(e=>buyerOutcomePhases.includes(e?.phase)&&(e.status||e.code)).map(e=>({...e,status:e.status??(e.code?'failed':'unknown')}));
  const outcomes=safeOutcomes([...events,...(Array.isArray(record.outcomes)?record.outcomes:[])]);
  return Object.freeze({failureDiagnostic:safeFailure(record.failureDiagnostic??record.firstFailure?.failureDiagnostic),outcomes:Object.freeze(outcomes.map(e=>Object.freeze(e)))});
}
export async function writePrivateDiagnostic(directory,name,value) {
  if(!/^[a-z0-9_.-]{1,100}$/.test(name))throw Error('diagnostic_path_unsafe');
  const stat=await lstat(directory);if(!stat.isDirectory()||stat.isSymbolicLink()||stat.uid!==process.getuid()||(stat.mode&0o077))throw Error('diagnostic_path_unsafe');
  const path=join(directory,name),temporary=path+'.'+randomUUID()+'.tmp';let file;
  try {
    file=await open(temporary,constants.O_WRONLY|constants.O_CREAT|constants.O_EXCL|constants.O_NOFOLLOW,0o600);
    await file.writeFile(JSON.stringify(value,null,2)+'\n');await file.sync();await file.close();file=null;
    await rename(temporary,path);const dir=await open(directory,constants.O_RDONLY);try{await dir.sync();}finally{await dir.close();}
    return path;
  }finally{await file?.close();await unlink(temporary).catch(e=>{if(e.code!=='ENOENT')throw e;});}
}
export async function readPrivateDiagnostic(directory,name) {
  const st=await lstat(directory);if(!st.isDirectory()||st.isSymbolicLink()||st.uid!==process.getuid()||(st.mode&0o077))throw Error('diagnostic_path_unsafe');
  const file=await open(join(directory,name),constants.O_RDONLY|constants.O_NOFOLLOW|constants.O_NONBLOCK);
  try{const s=await file.stat();if(!s.isFile()||s.nlink!==1||s.uid!==process.getuid()||(s.mode&0o077)||s.size>262144)throw Error('diagnostic_file_unsafe');return JSON.parse(await file.readFile('utf8'));}finally{await file.close();}
}
export async function exportFailure(directory,diagnostic,outcomes=[]) {
  const failureDiagnostic=safeFailure(diagnostic);if(!failureDiagnostic)throw Error('failure_evidence_unavailable');
  return writePrivateDiagnostic(directory,'failure-'+randomUUID()+'.json',{schemaVersion:1,failureDiagnostic,outcomes:safeOutcomes(outcomes)});
}
