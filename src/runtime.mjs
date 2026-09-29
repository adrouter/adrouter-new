import { createHash, randomUUID } from 'node:crypto';
import { readFile, lstat, mkdir, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { isAbsolute } from 'node:path';

const execute = promisify(execFile);
const manifest = JSON.parse(await readFile(new URL('../runtime/manifest.json', import.meta.url), 'utf8'));
const ownedName = /^adrnew-[a-f0-9-]{36}$/;

export class RuntimeError extends Error {
  constructor(code) { super(code); this.code = code; }
}

// No environment inheritance: provider credentials, npm authentication and host
// configuration are not part of the microVM controller's environment.
export function runtimeEnvironment(home, library) {
  return { PATH: '/usr/bin:/bin:/usr/sbin:/sbin', MSB_HOME: home, MSB_LIBKRUNFW_PATH: library };
}

export class SandboxRuntime {
  constructor({ executable, library, home }) {
    if (![executable, library, home].every(p => typeof p === 'string' && isAbsolute(p))) {
      throw new RuntimeError('runtime_absolute_paths_required');
    }
    this.executable = executable;
    this.library = library;
    this.home = home;
    this.verified = false;
    this.owned = new Set();
  }

  async verify() {
    const platform = `${process.platform}-${process.arch}`;
    const expected = manifest.platforms[platform];
    if (!expected) throw new RuntimeError('unsupported_runtime_platform');
    for (const [path, digest] of [[this.executable, expected.executableSha256], [this.library, expected.librarySha256]]) {
      const stat = await lstat(path);
      if (!stat.isFile() || stat.isSymbolicLink()) throw new RuntimeError('runtime_not_regular_file');
      const actual = createHash('sha256').update(await readFile(path)).digest('hex');
      if (actual !== digest) throw new RuntimeError('runtime_digest_mismatch');
    }
    if (process.platform === 'linux') await access('/dev/kvm', constants.R_OK | constants.W_OK);
    await mkdir(this.home, { recursive: true, mode: 0o700 });
    const version = await this.call(['--version']);
    if (version.trim() !== `msb ${manifest.version}`) throw new RuntimeError('runtime_version_mismatch');
    this.verified = true;
    return { platform, version: manifest.version, executableSha256: expected.executableSha256, librarySha256: expected.librarySha256 };
  }

  async call(args, { timeout = 30_000, signal } = {}) {
    try {
      const pending = execute(this.executable, args, {
        env: runtimeEnvironment(this.home, this.library), timeout, signal,
        maxBuffer: 1024 * 1024, killSignal: 'SIGKILL', windowsHide: true,
      });
      // Non-interactive msb exec waits for stdin EOF even after guest output.
      pending.child.stdin.end();
      const result = await pending;
      return result.stdout;
    } catch (error) {
      // Raw child output can contain workload content; never include it in errors.
      const failure = new RuntimeError(error.name === 'AbortError' ? 'runtime_cancelled' : 'runtime_command_failed');
      failure.exitCode = typeof error.code === 'number' ? error.code : null;
      failure.signal = error.signal ?? null;
      failure.killed = Boolean(error.killed);
      throw failure;
    }
  }

  async create({ image, copyDirectory, hostPorts = [], memoryMiB = 256, durationSeconds = 180 }) {
    if (!this.verified) throw new RuntimeError('runtime_not_verified');
    if (!/^([a-z0-9./:_-]+)@sha256:[a-f0-9]{64}$/.test(image)) throw new RuntimeError('immutable_image_required');
    if (!Number.isInteger(memoryMiB) || memoryMiB < 128 || memoryMiB > 2048) throw new RuntimeError('memory_limit_invalid');
    if (!Number.isInteger(durationSeconds) || durationSeconds < 10 || durationSeconds > 600) throw new RuntimeError('duration_limit_invalid');
    if (!Array.isArray(hostPorts) || hostPorts.length > 2 || hostPorts.some(p => !Number.isInteger(p) || p < 1024 || p > 65535)) throw new RuntimeError('host_ports_invalid');
    const name = `adrnew-${randomUUID()}`;
    const args = ['create', image, '--name', name, '--cpus', '1', '--memory', `${memoryMiB}M`,
      // The multi-tenant public-only floor disallows the intended local broker.
      // A local connector uses single-tenant with deny-all plus exact broker
      // ports. Offline evaluator guests retain the multi-tenant floor.
      '--security', 'restricted', '--deployment-profile', hostPorts.length ? 'single-tenant' : 'multi-tenant', '--no-net',
      '--root-disk', '1G', '--max-duration', `${durationSeconds}s`, '--idle-timeout', '60s',
      '--max-tcp-connections', '8', '--max-udp-connections', '1'];
    for (const port of hostPorts) args.push('--net-rule', `allow@host:tcp:${port}`);
    if (copyDirectory) {
      if (!isAbsolute(copyDirectory) || copyDirectory.includes(':') || !(await lstat(copyDirectory)).isDirectory()) throw new RuntimeError('workspace_copy_invalid');
      // Caller supplies only a sanitized disposable import, never the original tree.
      args.push('--copy-dir', `${copyDirectory}:/workspace`, '--workdir', '/workspace');
    }
    this.owned.add(name);
    try { await this.call(args, { timeout: 180_000 }); }
    catch (error) { await this.remove(name).catch(() => {}); throw error; }
    return name;
  }

  requireOwned(name) {
    if (!ownedName.test(name) || !this.owned.has(name)) throw new RuntimeError('sandbox_not_owned');
  }

  async run(name, command, { timeoutSeconds = 20, signal } = {}) {
    this.requireOwned(name);
    if (!Array.isArray(command) || command.length === 0 || command.some(x => typeof x !== 'string' || x.includes('\0')) || !Number.isInteger(timeoutSeconds) || timeoutSeconds < 1 || timeoutSeconds > 60) throw new RuntimeError('guest_command_invalid');
    try {
      return await this.call(['exec', '--no-tty', '--timeout', `${timeoutSeconds}s`, '--rlimit', 'nofile=128', name, '--', ...command], { timeout: (timeoutSeconds + 5) * 1000, signal });
    } catch (error) {
      // Killing just the client does not prove a guest command stopped. Tear down
      // the whole disposable VM on cancellation or an uncertain command outcome.
      await this.remove(name);
      throw error;
    }
  }

  async inspect(name) { this.requireOwned(name); return JSON.parse(await this.call(['inspect', name, '--format', 'json'])); }

  async remove(name) {
    this.requireOwned(name);
    await this.call(['remove', '--force', name]);
    this.owned.delete(name);
  }
}
