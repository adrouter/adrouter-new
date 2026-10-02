import { constants } from 'node:fs';
import { open, lstat, realpath, mkdir, writeFile, rename, rm, readdir } from 'node:fs/promises';
import { join, resolve } from 'node:path';
import { createHash, randomUUID } from 'node:crypto';
import { homedir } from 'node:os';
import { ActionApproval } from './buyer.mjs';
import { checkWorkspacePath } from './workspace-policy.mjs';
import { importWorkspace, proposeExport, changeDiffs, reviewAndApply, exportSnapshot, recoverApplication } from './workspace.mjs';
const hash=value=>createHash('sha256').update(value).digest('hex');
const idPattern=/^[a-f0-9-]{36}$/;
export function codingDirectory(profile) {
  if(!/^[a-z][a-z0-9_-]{0,31}$/.test(profile))throw Error('invalid_profile_name');
  return join(homedir(),'.adr-v2','profiles',profile,'coding');
}
async function privateJSON(path) {
  const file=await open(path,constants.O_RDONLY|constants.O_NOFOLLOW);
  try {const s=await file.stat();if(!s.isFile()||s.nlink!==1||s.uid!==process.getuid()||(s.mode&0o077)||s.size>160*1024*1024)throw Error('coding_checkpoint_rejected');return JSON.parse(await file.readFile('utf8'));}finally{await file.close();}
}
async function privateDirectory(path) {
  if(await realpath(path)!==resolve(path))throw Error('coding_profile_unsafe');
  const s=await lstat(path);if(!s.isDirectory()||s.isSymbolicLink()||s.uid!==process.getuid()||(s.mode&0o077))throw Error('coding_profile_unsafe');
}
function validateState(state) {
  if(![1,2].includes(state.schemaVersion)||typeof state.root!=='string'||!idPattern.test(state.sessionId)||!state.manifest||!state.files)throw Error('coding_checkpoint_rejected');
  if(Object.keys(state.files).length>5000||Object.keys(state.manifest).length>5000)throw Error('coding_checkpoint_rejected');
  let bytes=0;
  for(const [p,h] of Object.entries(state.manifest)){checkWorkspacePath(p);if(!/^[a-f0-9]{64}$/.test(h))throw Error('coding_checkpoint_rejected');}
  for(const [p,v] of Object.entries(state.files)){checkWorkspacePath(p);if(typeof v!=='string'||v.includes('\0')||Buffer.byteLength(v)>2*1024*1024)throw Error('coding_checkpoint_rejected');bytes+=Buffer.byteLength(v);}
  if(bytes>128*1024*1024)throw Error('coding_checkpoint_rejected');
  if(state.schemaVersion===2&&(!/^[a-f0-9]{64}$/.test(state.snapshotRevision)||!/^\d+$/.test(state.rootIdentity?.dev)||!/^\d+$/.test(state.rootIdentity?.ino)))throw Error('coding_checkpoint_rejected');
  return state;
}
export async function saveCodingSnapshot(storage,state) {
  await privateDirectory(storage);
  const payload={...state,schemaVersion:2,savedAt:Date.now()};delete payload.snapshotRevision;
  const snapshotRevision=hash(JSON.stringify(payload)),snapshot={...payload,snapshotRevision};
  validateState(snapshot);
  const directory=join(storage,'snapshots');await mkdir(directory,{recursive:true,mode:0o700});
  await privateDirectory(directory);
  const file=join(directory,snapshotRevision+'.json');
  await writeFile(file,JSON.stringify(snapshot),{flag:'wx',mode:0o600});
  const tmp=join(storage,randomUUID()+'.tmp');
  try{await writeFile(tmp,JSON.stringify(snapshot),{flag:'wx',mode:0o600});await rename(tmp,join(storage,'state.json'));}finally{await rm(tmp,{force:true});}
  return {resumeId:state.sessionId,snapshotRevision,savedAt:payload.savedAt};
}
export async function openSavedCodingWork(profile,id,{root,confirmProject=async()=>false,approve=async()=>false,directory=codingDirectory(profile),revision}={}) {
  if(!idPattern.test(id))throw Error('resume_id_invalid');
  const storage=join(directory,id);await privateDirectory(directory);await privateDirectory(storage);
  let state=validateState(await privateJSON(join(storage,'state.json')));
  if(revision!==undefined){if(!/^[a-f0-9]{64}$/.test(revision))throw Error('coding_checkpoint_rejected');await privateDirectory(join(storage,'snapshots'));state=validateState(await privateJSON(join(storage,'snapshots',revision+'.json')));}
  if(state.schemaVersion===2){const {snapshotRevision,...payload}=state;if(hash(JSON.stringify(payload))!==snapshotRevision)throw Error('coding_snapshot_digest_mismatch');}
  const project=root??state.root,canonical=await realpath(project),stat=await lstat(canonical,{bigint:true});
  if(canonical!==resolve(project)||canonical!==state.root||!stat.isDirectory())throw Error('saved_project_mismatch');
  const identity={dev:String(stat.dev),ino:String(stat.ino)};
  if(state.schemaVersion===2&&JSON.stringify(identity)!==JSON.stringify(state.rootIdentity))throw Error('workspace_root_changed');
  if(state.schemaVersion===1){
    if(!await confirmProject({root:canonical,sessionId:id,legacy:true}))throw Error('saved_project_confirmation_required');
    const checked=await importWorkspace(canonical,Object.keys(state.manifest));
    try{if(JSON.stringify(Object.entries(checked.manifest).sort())!==JSON.stringify(Object.entries(state.manifest).sort()))throw Error('export_conflict');}finally{await rm(checked.copy,{recursive:true,force:true});}
  }
  const snapshotRevision=state.snapshotRevision??hash(JSON.stringify(state));
  const workspace={root:canonical,rootIdentity:identity,manifest:{...state.manifest},snapshotRevision};
  const files=Object.freeze({...state.files});
  // Completed journals let the same immutable snapshot be opened repeatedly.
  // Host hashes are still checked by proposeExport and the application helper.
  const journalRoot=join(directory,'journals');
  if(await lstat(journalRoot).catch(e=>{if(e.code==='ENOENT')return null;throw e;}))await privateDirectory(journalRoot);
  for(const name of await readdir(journalRoot).catch(e=>{if(e.code==='ENOENT')return [];throw e;})){
    if(!/^[a-f0-9-]{36}[.]json$/.test(name))continue;
    const j=await privateJSON(join(journalRoot,name));
    if(j.snapshotRevision===snapshotRevision&&j.status==='complete'&&j.root===canonical&&JSON.stringify(j.identity)===JSON.stringify(identity))for(const c of j.changes){if(c.after===null)delete workspace.manifest[c.path];else workspace.manifest[c.path]=c.after;}
  }
  const bound=async action=>{
    const value={...action,sessionId:id,root:canonical,rootIdentity:identity,snapshotRevision},permission=new ActionApproval(value);
    if(!await approve(value,permission))return false;
    permission.consume(value,{id:permission.id,digest:permission.digest,allowOnce:true});return true;
  };
  const changes=async()=>{const values={...files};for(const p of Object.keys(workspace.manifest))if(!Object.hasOwn(files,p))values[p]=null;return proposeExport(workspace,values);};
  const review=async()=>{const proposal=await changes();return {...proposal,snapshotRevision,root:canonical,diffs:await changeDiffs(workspace,proposal.changes)};};
  const complete=async result=>{if(result.status==='applied'){for(const p of result.completed){if(Object.hasOwn(files,p))workspace.manifest[p]=hash(files[p]);else delete workspace.manifest[p];}await saveCodingSnapshot(storage,{...state,rootIdentity:identity,manifest:{...workspace.manifest},files:{...files}});}return {...result,snapshotRevision,excluded:state.excluded??{}};};
  return {state,snapshotRevision,workspace,files,review,changes,
    async apply(){const diffs=(await review()).diffs;return complete(await reviewAndApply(workspace,files,p=>bound({name:'apply_workspace',digest:p.digest,changes:p.changes.map((c,i)=>({...c,diff:diffs[i]}))}),{journalRoot}));},
    async export(){return exportSnapshot(workspace,files,p=>bound({name:'export_workspace',changes:p.changes}));},
    async recover(journal){if(!/^[a-f0-9-]{36}[.]json$/.test(journal.slice(journalRoot.length+1))||!journal.startsWith(journalRoot+'/'))throw Error('apply_journal_rejected');const j=await privateJSON(journal);if(j.snapshotRevision&&j.snapshotRevision!==snapshotRevision)throw Error('apply_recovery_rejected');return complete(await recoverApplication(workspace,journal,p=>bound({name:'recover_application',digest:p.digest,changes:p.changes})));},
  };
}
