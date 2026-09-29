import { readFile, writeFile, mkdir, lstat, mkdtemp, rm, open, rename, unlink } from 'node:fs/promises';
import { constants } from 'node:fs';
import { createHash, randomUUID } from 'node:crypto';
import { homedir } from 'node:os';
import { join, isAbsolute } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { SandboxRuntime, RuntimeError } from './runtime.mjs';
const execute = promisify(execFile);
const sha = bytes => createHash('sha256').update(bytes).digest('hex');
async function directory(home) {
  const root = join(home, '.adr-v2-runtime');
  await mkdir(root, { mode: 0o700 }).catch(e => { if (e.code !== 'EEXIST') throw e; });
  const stat = await lstat(root);
  if (!stat.isDirectory() || stat.isSymbolicLink() || stat.uid !== process.getuid() || (stat.mode & 0o077)) throw new RuntimeError('runtime_directory_unsafe');
  return root;
}
function configuration(value) {
  if (!value || Object.keys(value).sort().join(',') !== 'executable,home,library' || !Object.values(value).every(v => typeof v === 'string' && isAbsolute(v) && !v.includes('\0'))) throw new RuntimeError('runtime_configuration_invalid');
  return value;
}
export async function loadRuntimeConfig(home = homedir()) {
  let file;
  try {
    file = await open(join(await directory(home), 'config.json'), constants.O_RDONLY | constants.O_NOFOLLOW | constants.O_NONBLOCK);
    const stat = await file.stat();
    if (!stat.isFile() || stat.nlink !== 1 || stat.uid !== process.getuid() || (stat.mode & 0o077) || stat.size > 8192) throw new RuntimeError('runtime_configuration_unsafe');
    return configuration(JSON.parse(await file.readFile('utf8')));
  } catch (e) { if (e.code === 'ENOENT') return undefined; throw e; }
  finally { await file?.close(); }
}
export async function saveRuntimeConfig(config, { home = homedir(), signal } = {}) {
  configuration(config); signal?.throwIfAborted();
  await new SandboxRuntime(config).verify({ signal });
  const root = await directory(home), temporary = join(root, `config-${randomUUID()}.tmp`);
  try {
    signal?.throwIfAborted();
    await writeFile(temporary, JSON.stringify(config) + '\n', { flag: 'wx', mode: 0o600 });
    signal?.throwIfAborted(); await rename(temporary, join(root, 'config.json'));
  } finally { await unlink(temporary).catch(e => { if (e.code !== 'ENOENT') throw e; }); }
  return config;
}
export async function installRuntime({ home = homedir(), signal, fetcher = fetch } = {}) {
  signal?.throwIfAborted();
  const manifest = JSON.parse(await readFile(new URL('../runtime/manifest.json', import.meta.url)));
  const pin = manifest.platforms[`${process.platform}-${process.arch}`];
  if (!pin) throw new RuntimeError('unsupported_runtime_platform');
  const root = await directory(home), installed = await loadRuntimeConfig(home);
  if (installed) { await new SandboxRuntime(installed).verify({ signal }); return installed; }
  const target = await mkdtemp(join(root, 'install-'));
  try {
    const response = await fetcher(pin.archive, { signal: signal ? AbortSignal.any([signal, AbortSignal.timeout(300000)]) : AbortSignal.timeout(300000) });
    if (!response.ok || !response.body) throw new RuntimeError('runtime_download_failed');
    const chunks = []; let size = 0;
    for await (const chunk of response.body) { signal?.throwIfAborted(); size += chunk.length; if (size > 512 * 1024 * 1024) throw new RuntimeError('runtime_download_limit'); chunks.push(chunk); }
    const archive = Buffer.concat(chunks);
    if (sha(archive) !== pin.sha256) throw new RuntimeError('runtime_archive_digest_mismatch');
    const archivePath = join(target, 'download.tar.gz'); await writeFile(archivePath, archive, { flag: 'wx', mode: 0o600 });
    const list = (await execute('/usr/bin/tar', ['-tzf', archivePath], { maxBuffer: 1024 * 1024, signal })).stdout.split('\n').filter(Boolean);
    const executableEntry = list.find(p => /(^|\/)msb$/.test(p));
    const libraryEntry = list.find(p => process.platform === 'darwin' ? /(^|\/)libkrunfw\.5\.dylib$/.test(p) : /(^|\/)libkrunfw\.so\.5$/.test(p));
    if (!executableEntry || !libraryEntry || [executableEntry, libraryEntry].some(p => p.startsWith('-') || p.startsWith('/') || p.split('/').includes('..'))) throw new RuntimeError('runtime_archive_layout_mismatch');
    for (const [entry, name, digest] of [[executableEntry, 'msb', pin.executableSha256], [libraryEntry, process.platform === 'darwin' ? 'libkrunfw.5.dylib' : 'libkrunfw.so.5', pin.librarySha256]]) {
      const { stdout } = await execute('/usr/bin/tar', ['-xOzf', archivePath, entry], { encoding: 'buffer', maxBuffer: 512 * 1024 * 1024, signal });
      if (sha(stdout) !== digest) throw new RuntimeError('runtime_digest_mismatch');
      await writeFile(join(target, name), stdout, { flag: 'wx', mode: 0o700 });
    }
    await rm(archivePath);
    const config = { executable: join(target, 'msb'), library: join(target, process.platform === 'darwin' ? 'libkrunfw.5.dylib' : 'libkrunfw.so.5'), home: join(root, 'state') };
    return await saveRuntimeConfig(config, { home, signal });
  } catch (error) { await rm(target, { recursive: true, force: true }); throw error; }
}
