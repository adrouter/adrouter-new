import { constants } from 'node:fs';
import { spawn, execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import ignore from 'ignore';
const execute = promisify(execFile);
import { readFile, readdir, lstat, open, realpath, mkdir, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { createHash, randomUUID } from 'node:crypto';
import { resolve, relative, dirname, join, isAbsolute } from 'node:path';
import { tmpdir } from 'node:os';

const MAX_BYTES = 2 * 1024 * 1024;
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const forbidden = /(^auth\.json$|^\.npmrc$|^\.pypirc$|^\.netrc$|^\.|credentials?|secrets?|id_rsa|id_ed25519|\.pem$|\.key$|\.p12$|\.pfx$|\.tgz$|\.tar$|\.zip$|\.sqlite$|\.db$)/i;

function checkRelative(path) {
  if (typeof path !== 'string' || !path || isAbsolute(path) || path.includes('\\') || path.includes('\0') || path.includes(':') || path.split('/').some(part => part === '..' || part === '.' || !part || (forbidden.test(part) && !['.gitignore','.ignore','.editorconfig','.adrouter'].includes(part)))) throw new Error('workspace_path_rejected');
}

async function safeRead(root, path, identity) {
  checkRelative(path);
  try {
    const result = await execute('python3', [fileURLToPath(new URL('./workspace-read.py', import.meta.url)), root, path, String(identity.dev), String(identity.ino)], { timeout: 10000, maxBuffer: 3 * MAX_BYTES, env: { PATH: '/usr/local/bin:/opt/homebrew/bin:/usr/bin:/bin' } });
    return Buffer.from(result.stdout.trim(), 'base64');
  } catch { throw new Error('workspace_file_rejected'); }
}

// Imports are explicit file lists, not recursive copies or archive extraction.
export async function importWorkspace(root, files) {
  const canonical = await realpath(root);
  if (canonical !== resolve(root)) throw new Error('workspace_root_symlink_rejected');
  if (!Array.isArray(files) || files.length < 1 || files.length > 5000 || new Set(files).size !== files.length) throw new Error('workspace_selection_invalid');
  const rootStat = await lstat(canonical,{bigint:true}); const rootIdentity = {dev:String(rootStat.dev),ino:String(rootStat.ino)};
  const copy = await mkdtemp(join(tmpdir(), 'adrnew-workspace-'));
  const manifest = Object.create(null);
  let total = 0;
  try {
    for (const path of files) {
      const bytes = await safeRead(canonical, path, rootIdentity);
      total += bytes.length;
      if (total > 64 * MAX_BYTES) throw new Error('workspace_total_limit');
      manifest[path] = hash(bytes);
      await mkdir(dirname(join(copy, path)), { recursive: true, mode: 0o700 });
      await writeFile(join(copy, path), bytes, { flag: 'wx', mode: 0o600 });
    }
    return { root: canonical, rootIdentity, copy, manifest };
  } catch (error) { await rm(copy, { recursive: true, force: true }); throw error; }
}

// No automatic host edits. A proposal contains only explicitly imported paths,
// is bound to original bytes, and expires after one approval attempt.
export async function proposeExport(workspace, changedFiles) {
  const changes = [];
  for (const [path, content] of Object.entries(changedFiles)) {
    checkRelative(path);
    if (content !== null && (typeof content !== 'string' || Buffer.byteLength(content) > MAX_BYTES)) throw new Error('export_file_rejected');
    const exists = Object.hasOwn(workspace.manifest, path);
    if(exists && content!==null && hash(content)===workspace.manifest[path])continue;
    const original = exists ? await safeRead(workspace.root, path, workspace.rootIdentity) : null;
    if (!exists && await lstat(resolve(workspace.root, path)).then(() => true, e => { if (e.code === 'ENOENT') return false; throw e; })) throw new Error('export_conflict');
    if (exists && hash(original) !== workspace.manifest[path]) throw new Error('export_conflict');
    if (exists && content !== null && hash(content) === hash(original)) continue;
    changes.push(Object.freeze({ path, kind: content === null ? 'delete' : exists ? 'modify' : 'add', before: original === null ? null : hash(original), after: content === null ? null : hash(content), content }));
  }
  return Object.freeze({ id: randomUUID(), changes: Object.freeze(changes) });
}

export async function changeDiffs(workspace,changes) {
  return Promise.all(changes.map(async c=>{
    const before=c.before===null?'':(await safeRead(workspace.root,c.path,workspace.rootIdentity)).toString('utf8');
    return [...(c.before===null?[]:before.split('\n').map(l=>'- '+l)),...(c.content===null?[]:c.content.split('\n').map(l=>'+ '+l))];
  }));
}

export class ExportApproval {
  #used = false;
  constructor(proposal) { this.proposal = proposal; }
  async approve(workspace, proposalId) {
    if (this.#used || proposalId !== this.proposal.id) throw new Error('approval_invalid');
    this.#used = true;
    // Return reviewed artifacts only. Applying them is a separate, conflict-
    // checked host operation; this MVP feasibility layer never writes originals.
    for (const [path, original] of Object.entries(workspace.manifest)) if (hash(await safeRead(workspace.root,path,workspace.rootIdentity)) !== original) throw new Error('export_conflict');
    for (const change of this.proposal.changes) {
      if (change.before === null && await lstat(resolve(workspace.root,change.path)).then(()=>true,e=>{if(e.code==='ENOENT')return false;throw e;})) throw new Error('export_conflict');
      if (change.before !== null && hash(await safeRead(workspace.root, change.path, workspace.rootIdentity)) !== change.before) throw new Error('export_conflict');
    }
    return this.proposal.changes;
  }
}

// Export a complete reviewed snapshot and explicit add/modify/delete manifest to a
// fresh private directory. Never replace host originals or merge without review.
export async function exportSnapshot(workspace, finalFiles, approval) {
  const changes = { ...finalFiles };
  for (const path of Object.keys(workspace.manifest)) if (!Object.hasOwn(finalFiles, path)) changes[path] = null;
  const proposal = await proposeExport(workspace, changes);
  if (!await approval(proposal)) throw new Error('export_denied');
  await new ExportApproval(proposal).approve(workspace, proposal.id);
  const destination = await mkdtemp(join(tmpdir(), 'adr-reviewed-export-'));
  try {
    for (const [path, content] of Object.entries(finalFiles)) {
      checkRelative(path); await mkdir(dirname(join(destination, 'workspace', path)), { recursive: true, mode: 0o700 });
      await writeFile(join(destination, 'workspace', path), content, { flag: 'wx', mode: 0o600 });
    }
    await writeFile(join(destination, 'manifest.json'), JSON.stringify({ schemaVersion: 1, changes: proposal.changes.map(({ content, ...entry }) => entry) }, null, 2), { flag: 'wx', mode: 0o600 });
    return { directory: destination, manifest: join(destination, 'manifest.json') };
  } catch (error) { await rm(destination, { recursive: true, force: true }); throw error; }
}

// Discover paths using Git ignore semantics without opening excluded contents.
export async function projectManifest(root) {
  let canonical;try{canonical=await realpath(root);}catch{throw Error('workspace_directory_inaccessible');}if(canonical!==resolve(root))throw Error('workspace_root_symlink_rejected');if(!(await lstat(canonical)).isDirectory())throw Error('workspace_directory_required');
  const exclusions={categories:['credentials and hidden/private paths','ignored files','dependencies and generated output','links and nonregular files','files larger than 2 MiB'],counts:{private:0,generated:0,links:0,oversize:0,ignored:0}};
  let paths;
  try { paths=(await execute('git',['-C',canonical,'ls-files','-z','--cached','--others','--exclude-standard'],{maxBuffer:8*1024*1024,env:{PATH:'/opt/homebrew/bin:/usr/bin:/bin'}})).stdout.split('\0').filter(Boolean); }
  catch {
    paths=[];
    const identity=await lstat(canonical,{bigint:true});
    const walk=async(dir='',inherited=[])=>{
      const matchers=[...inherited];
      for(const name of ['.gitignore','.ignore']){const path=dir?`${dir}/${name}`:name;const stat=await lstat(join(canonical,path)).catch(e=>{if(e.code==='ENOENT')return null;throw e;});if(stat){if(stat.isSymbolicLink()||!stat.isFile()||stat.nlink!==1)throw Error('workspace_ignore_rejected');const patterns=(await safeRead(canonical,path,{dev:String(identity.dev),ino:String(identity.ino)})).toString('utf8');matchers.push({base:dir,filter:ignore().add(patterns)});}}
      for(const e of await readdir(join(canonical,dir),{withFileTypes:true})){
        const p=dir?`${dir}/${e.name}`:e.name;try{checkRelative(p);}catch{exclusions.counts.private++;continue;}
        if(['node_modules','dist','build','coverage','vendor','target','__pycache__'].includes(e.name)){exclusions.counts.generated++;continue;}if(e.isSymbolicLink()){exclusions.counts.links++;continue;}
        let ignored=false;for(const m of matchers){const rel=m.base?p.slice(m.base.length+1):p;const state=m.filter.test(rel+(e.isDirectory()?'/':''));if(state.ignored)ignored=true;if(state.unignored)ignored=false;}if(ignored){exclusions.counts.ignored++;continue;}
        if(e.isDirectory())await walk(p,matchers);else if(e.isFile())paths.push(p);if(paths.length>5000)throw Error('workspace_selection_invalid');
      }
    };await walk();
  }
  const result=[];let total=0;
  for(const path of [...new Set(paths)].sort()){try{checkRelative(path);}catch{exclusions.counts.private++;continue;}if(path.split('/').some(p=>['node_modules','dist','build','coverage','target','__pycache__'].includes(p)))continue;const s=await lstat(join(canonical,path));if(s.isSymbolicLink()||!s.isFile()||s.nlink!==1){exclusions.counts.links++;continue;}if(s.size>MAX_BYTES){exclusions.counts.oversize++;continue;}total+=s.size;if(total>128*1024*1024)throw Error('workspace_total_limit');result.push({path,bytes:s.size,resource:path==='package.json'||path.endsWith('.sh')||path==='AGENTS.md'||path.includes('/skills/')||path.includes('/extensions/')||path.endsWith('SKILL.md')});}
  if(!result.length)throw Error('workspace_import_empty');if(result.length>5000)throw Error('workspace_selection_invalid');return {root:canonical,files:result,totalBytes:total,exclusions};
}

export async function reviewAndApply(workspace, finalFiles, approve, {journalRoot, recover}={}) {
  if(!journalRoot||!isAbsolute(journalRoot))throw Error('private_journal_required');
  const values={...finalFiles};for(const p of Object.keys(workspace.manifest))if(!Object.hasOwn(values,p))values[p]=null;
  const proposal=recover?.proposal??await proposeExport(workspace,values);
  if(!/^[a-f0-9-]{36}$/.test(proposal.id))throw Error('apply_operation_invalid');
  const digest=hash(JSON.stringify(proposal));
  if(!await approve({...proposal,digest,recovery:!!recover}))throw Error('apply_denied');
  await mkdir(journalRoot,{recursive:true,mode:0o700});const stat=await lstat(journalRoot);
  if(!stat.isDirectory()||stat.isSymbolicLink()||stat.uid!==process.getuid()||(stat.mode&0o077))throw Error('private_journal_rejected');
  const journal=join(journalRoot,`${proposal.id}.json`);
  const result=await new Promise((resolveResult,reject)=>{
    const child=spawn('python3',[fileURLToPath(new URL('./workspace-apply.py',import.meta.url))],{env:{PATH:'/opt/homebrew/bin:/usr/bin:/bin'},stdio:['pipe','pipe','ignore']});let output='';
    child.stdout.on('data',b=>{output+=b;if(output.length>65536)child.kill();});child.once('error',reject);child.once('close',async()=>{try{resolveResult(JSON.parse(output));}catch{const state=await readFile(journal,'utf8').then(v=>JSON.parse(v)).catch(()=>null);resolveResult({status:'interrupted',code:'apply_outcome_unknown',uncertain:true,completed:state?.completed??[],operationId:proposal.id});}});
    child.stdin.end(JSON.stringify({id:proposal.id,root:workspace.root,identity:workspace.rootIdentity,changes:proposal.changes,journal,recover:!!recover}));
  });
  return {...result,journal};
}

export async function recoverApplication(workspace,journal,approve) {
  const stat=await lstat(journal);
  if(!stat.isFile()||stat.isSymbolicLink()||stat.nlink!==1||stat.uid!==process.getuid()||(stat.mode&0o077)||stat.size>32*1024*1024)throw Error('apply_journal_rejected');
  const state=JSON.parse(await readFile(journal,'utf8'));
  if(state.root!==workspace.root||JSON.stringify(state.identity)!==JSON.stringify(workspace.rootIdentity)||!['interrupted','applying'].includes(state.status))throw Error('apply_recovery_rejected');
  const proposal={id:state.operationId,changes:state.changes};
  return reviewAndApply(workspace,{},approve,{journalRoot:dirname(journal),recover:{proposal}});
}
