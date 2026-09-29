import { constants } from 'node:fs';
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

async function safeRead(root, path) {
  checkRelative(path);
  const full = resolve(root, path);
  if (relative(root, full).startsWith('..')) throw new Error('workspace_escape');
  let current = root;
  for (const component of path.split('/')) {
    current = join(current, component);
    if ((await lstat(current)).isSymbolicLink()) throw new Error('workspace_symlink_rejected');
  }
  if (await realpath(full) !== full) throw new Error('workspace_escape');
  const file = await open(full, constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
  try {
    const before = await file.stat();
    if (!before.isFile() || before.nlink !== 1 || before.size > MAX_BYTES) throw new Error('workspace_file_rejected');
    const bytes = Buffer.alloc(before.size + 1);
    const { bytesRead } = await file.read(bytes, 0, bytes.length, 0);
    const after = await file.stat();
    if (bytesRead !== before.size || before.size !== after.size || before.mtimeMs !== after.mtimeMs || await realpath(full) !== full) throw new Error('workspace_changed_during_import');
    return bytes.subarray(0, bytesRead);
  } finally { await file.close(); }
}

// Imports are explicit file lists, not recursive copies or archive extraction.
export async function importWorkspace(root, files) {
  const canonical = await realpath(root);
  if (canonical !== resolve(root)) throw new Error('workspace_root_symlink_rejected');
  if (!Array.isArray(files) || files.length < 1 || files.length > 100 || new Set(files).size !== files.length) throw new Error('workspace_selection_invalid');
  const copy = await mkdtemp(join(tmpdir(), 'adrnew-workspace-'));
  const manifest = {};
  let total = 0;
  try {
    for (const path of files) {
      const bytes = await safeRead(canonical, path);
      total += bytes.length;
      if (total > 8 * MAX_BYTES) throw new Error('workspace_total_limit');
      manifest[path] = hash(bytes);
      await mkdir(dirname(join(copy, path)), { recursive: true, mode: 0o700 });
      await writeFile(join(copy, path), bytes, { flag: 'wx', mode: 0o600 });
    }
    return { root: canonical, copy, manifest };
  } catch (error) { await rm(copy, { recursive: true, force: true }); throw error; }
}

// No automatic host edits. A proposal contains only explicitly imported paths,
// is bound to original bytes, and expires after one approval attempt.
export async function proposeExport(workspace, changedFiles) {
  const changes = [];
  for (const [path, content] of Object.entries(changedFiles)) {
    checkRelative(path);
    if (!Object.hasOwn(workspace.manifest, path) || typeof content !== 'string' || Buffer.byteLength(content) > MAX_BYTES) throw new Error('export_file_rejected');
    const original = await safeRead(workspace.root, path);
    if (hash(original) !== workspace.manifest[path]) throw new Error('export_conflict');
    changes.push(Object.freeze({ path, before: hash(original), after: hash(content), content }));
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
    for (const change of this.proposal.changes) {
      if (hash(await safeRead(workspace.root, change.path)) !== change.before) throw new Error('export_conflict');
    }
    return this.proposal.changes;
  }
}
