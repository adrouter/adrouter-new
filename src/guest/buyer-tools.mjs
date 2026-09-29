import { lstat, readdir, readFile, writeFile, unlink, mkdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { spawnSync } from 'node:child_process';
const forbidden = /(^\.|credentials?|secrets?|id_rsa|id_ed25519|\.pem$|\.key$|\.p12$|\.pfx$|\.tgz$|\.tar$|\.zip$|\.sqlite$|\.db$)/i;
async function safe(path, create = false) {
  if (typeof path !== 'string' || path.length > 2048 || path.includes('\\') || path.includes('\0') || path.includes(':') || path.split('/').some(x => !x || x === '..' || forbidden.test(x))) throw Error('workspace_path_rejected');
  let current = '/workspace';
  for (const part of path.split('/')) {
    current = join(current, part);
    const stat = await lstat(current).catch(e => { if (create && e.code === 'ENOENT') return null; throw e; });
    if (stat?.isSymbolicLink() || (stat?.isFile() && stat.nlink !== 1)) throw Error('workspace_link_rejected');
  }
  return current;
}
async function files(path = '') {
  const result = [];
  for (const entry of await readdir(join('/workspace', path), { withFileTypes: true })) {
    if (forbidden.test(entry.name)) continue;
    const relative = path ? `${path}/${entry.name}` : entry.name;
    await safe(relative);
    if (entry.isDirectory()) result.push(...await files(relative));
    else if (entry.isFile()) result.push(relative);
    if (result.length > 100) throw Error('workspace_file_limit');
  }
  return result;
}
async function text(path) {
  const full = await safe(path), stat = await lstat(full);
  if (!stat.isFile() || stat.size > 2 * 1024 * 1024) throw Error('workspace_file_limit');
  return readFile(full, 'utf8');
}
export async function perform(name, args) {
  if (name === 'read_file') return text(args.path);
  if (name === 'search') {
    if (typeof args.query !== 'string' || args.query.length > 256) throw Error('query_limit');
    const found = [];
    for (const path of await files()) {
      const lines = (await text(path)).split('\n');
      for (let i=0; i<lines.length && found.length<100; i++) if (lines[i].includes(args.query)) found.push(`${path}:${i+1}: ${lines[i].slice(0,1000)}`);
    }
    return found.join('\n');
  }
  if (name === 'write_file') {
    if (typeof args.content !== 'string' || Buffer.byteLength(args.content) > 2 * 1024 * 1024) throw Error('content_limit');
    const full = await safe(args.path, true); await mkdir(dirname(full), { recursive: true }); await writeFile(full, args.content, { mode: 0o600 }); return 'File written in buyer VM';
  }
  if (name === 'delete_file') { await unlink(await safe(args.path)); return 'File removed in buyer VM'; }
  if (name === 'run_command') {
    if (!Array.isArray(args.argv) || !args.argv.length || args.argv.length > 32 || args.argv.some(a => typeof a !== 'string' || a.length > 4096 || a.includes('\0'))) throw Error('command_limit');
    const result = spawnSync(args.argv[0], args.argv.slice(1), { cwd: '/workspace', env: { PATH: '/usr/local/bin:/usr/bin:/bin', HOME: '/tmp', LANG: 'C.UTF-8' }, encoding: 'utf8', timeout: 15000, maxBuffer: 65536, killSignal: 'SIGKILL' });
    if (result.error || result.signal) throw Error('command_outcome_unknown');
    return JSON.stringify({ exitCode: result.status, stdout: result.stdout, stderr: result.stderr });
  }
  if (name === 'export') {
    const result = {}; let total = 0;
    for (const path of await files()) { const content = await text(path); total += Buffer.byteLength(content); if (total > 16 * 1024 * 1024) throw Error('workspace_total_limit'); result[path] = content; }
    return result;
  }
  throw Error('tool_not_supported');
}
