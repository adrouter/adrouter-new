import { constants } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
const execute = promisify(execFile);
import { lstat, open, realpath, mkdir, mkdtemp, writeFile, rm } from 'node:fs/promises';
import { createHash, randomUUID } from 'node:crypto';
import { resolve, relative, dirname, join, isAbsolute } from 'node:path';
import { tmpdir } from 'node:os';

const MAX_BYTES = 2 * 1024 * 1024;
const hash = bytes => createHash('sha256').update(bytes).digest('hex');
const forbidden = /(^\.|credentials?|secrets?|id_rsa|id_ed25519|\.pem$|\.key$|\.p12$|\.pfx$|\.tgz$|\.tar$|\.zip$|\.sqlite$|\.db$)/i;

function checkRelative(path) {
  if (typeof path !== 'string' || !path || isAbsolute(path) || path.includes('\\') || path.includes('\0') || path.includes(':') || path.split('/').some(part => part === '..' || part === '.' || !part || forbidden.test(part))) throw new Error('workspace_path_rejected');
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
  if (!Array.isArray(files) || files.length < 1 || files.length > 100 || new Set(files).size !== files.length) throw new Error('workspace_selection_invalid');
  const rootStat = await lstat(canonical,{bigint:true}); const rootIdentity = {dev:String(rootStat.dev),ino:String(rootStat.ino)};
  const copy = await mkdtemp(join(tmpdir(), 'adrnew-workspace-'));
  const manifest = {};
  let total = 0;
  try {
    for (const path of files) {
      const bytes = await safeRead(canonical, path, rootIdentity);
      total += bytes.length;
      if (total > 8 * MAX_BYTES) throw new Error('workspace_total_limit');
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
    const original = exists ? await safeRead(workspace.root, path, workspace.rootIdentity) : null;
    if (!exists && await lstat(resolve(workspace.root, path)).then(() => true, e => { if (e.code === 'ENOENT') return false; throw e; })) throw new Error('export_conflict');
    if (exists && hash(original) !== workspace.manifest[path]) throw new Error('export_conflict');
    changes.push(Object.freeze({ path, kind: content === null ? 'delete' : exists ? 'modify' : 'add', before: original === null ? null : hash(original), after: content === null ? null : hash(content), content }));
  }
  return Object.freeze({ id: randomUUID(), changes: Object.freeze(changes) });
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
