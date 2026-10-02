import { createHash, randomUUID } from 'node:crypto';
import { readFile, lstat, mkdir, access } from 'node:fs/promises';
import { constants } from 'node:fs';
import { execFile, spawn, spawnSync } from 'node:child_process';
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
    this.removing = new Map();
  }

  async verify({ signal } = {}) {
    signal?.throwIfAborted();
    const platform = `${process.platform}-${process.arch}`;
    const expected = manifest.platforms[platform];
    if (!expected) throw new RuntimeError('unsupported_runtime_platform');
    for (const [path, digest] of [[this.executable, expected.executableSha256], [this.library, expected.librarySha256]]) {
      const stat = await lstat(path);
      if (!stat.isFile() || stat.isSymbolicLink()) throw new RuntimeError('runtime_not_regular_file');
      const actual = createHash('sha256').update(await readFile(path)).digest('hex');
      if (actual !== digest) throw new RuntimeError('runtime_digest_mismatch');
    }
    // The pinned runtime appends 50 bytes for a UUID sandbox control socket.
    if (Buffer.byteLength(this.home) + 50 >= (process.platform === 'darwin' ? 104 : 108)) throw new RuntimeError('runtime_directory_path_too_long');
    if (process.platform === 'linux') await access('/dev/kvm', constants.R_OK | constants.W_OK);
    await mkdir(this.home, { recursive: true, mode: 0o700 });
    const state = await lstat(this.home);
    if (!state.isDirectory() || state.isSymbolicLink() || state.uid !== process.getuid() || (state.mode & 0o077)) throw new RuntimeError('runtime_directory_unsafe');
    const version = await this.call(['--version'], { signal });
    if (version.trim() !== `msb ${manifest.version}`) throw new RuntimeError('runtime_version_mismatch');
    this.verified = true;
    return { platform, version: manifest.version, executableSha256: expected.executableSha256, librarySha256: expected.librarySha256 };
  }

  async call(args, { timeout = 30_000, signal, outputBytes = 1024 * 1024, input } = {}) {
    try {
      const pending = execute(this.executable, args, {
        env: runtimeEnvironment(this.home, this.library), timeout, signal,
        maxBuffer: outputBytes, killSignal: 'SIGKILL', windowsHide: true,
      });
      // Non-interactive msb exec waits for stdin EOF even after guest output.
      if(input!==undefined && (!(typeof input==='string'||Buffer.isBuffer(input))||Buffer.byteLength(input)>32*1024*1024)) {pending.child.kill();throw new RuntimeError('runtime_input_limit');}
      pending.child.stdin.end(input);
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

  async create({ image, copyDirectory, hostPorts = [], endpoint, memoryMiB = 256, durationSeconds = 180, continuous = false, signal, rootDiskGiB = 1 }) {
    if (!this.verified) throw new RuntimeError('runtime_not_verified');
    if (!/^([a-z0-9./:_-]+)@sha256:[a-f0-9]{64}$/.test(image)) throw new RuntimeError('immutable_image_required');
    if (!Number.isInteger(memoryMiB) || memoryMiB < 128 || memoryMiB > 2048) throw new RuntimeError('memory_limit_invalid');
    if (!continuous && (!Number.isInteger(durationSeconds) || durationSeconds < 10 || durationSeconds > 600)) throw new RuntimeError('duration_limit_invalid');
    if(!Number.isInteger(rootDiskGiB)||rootDiskGiB<1||rootDiskGiB>8)throw new RuntimeError('disk_limit_invalid');
    if (!Array.isArray(hostPorts) || hostPorts.length > 2 || hostPorts.some(p => !Number.isInteger(p) || p < 1024 || p > 65535)) throw new RuntimeError('host_ports_invalid');
    let upstream;
    if (endpoint) {
      upstream = new URL(endpoint);
      if (upstream.protocol !== 'https:' || upstream.username || upstream.password || upstream.search || upstream.hash || !/^[a-z0-9.-]+$/i.test(upstream.hostname)) throw new RuntimeError('guest_endpoint_rejected');
    }
    const name = `adrnew-${randomUUID()}`;
    const args = ['create', image, '--name', name, '--cpus', '1', '--memory', `${memoryMiB}M`,
      // The multi-tenant public-only floor disallows the intended local broker.
      // A local connector uses single-tenant with deny-all plus exact broker
      // ports. Offline evaluator guests retain the multi-tenant floor.
      '--security', 'restricted', '--deployment-profile', hostPorts.length ? 'single-tenant' : 'multi-tenant', '--no-net',
      '--root-disk', `${rootDiskGiB}G`, ...(continuous ? [] : ['--max-duration', `${durationSeconds}s`]), '--idle-timeout', '60s',
      '--max-tcp-connections', '8', '--max-udp-connections', '1'];
    for (const port of hostPorts) args.push('--net-rule', `allow@host:tcp:${port}`);
    if (upstream) args.push('--net-rule', `allow@${upstream.hostname}:tcp:${upstream.port || 443}`, '--net-rule', 'allow@dns');
    if (copyDirectory) {
      if (!isAbsolute(copyDirectory) || copyDirectory.includes(':') || !(await lstat(copyDirectory)).isDirectory()) throw new RuntimeError('workspace_copy_invalid');
      // Caller supplies only a sanitized disposable import, never the original tree.
      args.push('--copy-dir', `${copyDirectory}:/workspace`, '--workdir', '/workspace');
    }
    this.owned.add(name);
    try { await this.call(args, { timeout: 300_000, signal }); }
    catch(error){try{error.sandboxName=name;}catch{}await this.remove(name).catch(()=>{});throw error;}
    return name;
  }

  requireOwned(name) {
    if (!ownedName.test(name) || !this.owned.has(name)) throw new RuntimeError('sandbox_not_owned');
  }

  async run(name, command, { timeoutSeconds = 20, signal, outputBytes = 1024 * 1024, input } = {}) {
    this.requireOwned(name);
    if (!Number.isSafeInteger(outputBytes) || outputBytes < 1024 || outputBytes > 24 * 1024 * 1024) throw new RuntimeError('output_limit_invalid');
    if (!Array.isArray(command) || command.length === 0 || command.some(x => typeof x !== 'string' || x.includes('\0')) || !Number.isInteger(timeoutSeconds) || timeoutSeconds < 1 || timeoutSeconds > 600) throw new RuntimeError('guest_command_invalid');
    try {
      return await this.call(['exec', '--no-tty', '--timeout', `${timeoutSeconds}s`, '--rlimit', 'nofile=128', '--rlimit', 'core=0', name, '--', ...command], { timeout: (timeoutSeconds + 5) * 1000, signal, outputBytes, input });
    } catch (error) {
      // Killing just the client does not prove a guest command stopped. Tear down
      // the whole disposable VM on cancellation or an uncertain command outcome.
      await this.remove(name).catch(() => {});
      throw error;
    }
  }

  // Controller-owned, read-only checkpoint programs have bounded failure without
  // destroying work. Effectful run() retains uncertain-outcome VM teardown.
  async readCheckpoint(name, command, { signal, outputBytes = 24 * 1024 * 1024, input } = {}) {
    this.requireOwned(name);
    return this.call(['exec', '--no-tty', '--timeout', '15s', '--rlimit', 'core=0', name, '--', ...command],
      { timeout: 20000, signal, outputBytes, input });
  }

  async attachConsole(name, command, { signal, stdio = 'inherit', timeoutSeconds = 120, coordinator, beforeTeardown, onOutcome = () => {} } = {}) {
    this.requireOwned(name);
    if (!Number.isInteger(timeoutSeconds) || timeoutSeconds < 1 || timeoutSeconds > 3600) throw new RuntimeError('console_duration_invalid');
    if (!Array.isArray(command) || command.some(x => typeof x !== 'string' || x.includes('\0'))) throw new RuntimeError('guest_command_invalid');
    const args = ['exec', '--tty', '--timeout', `${timeoutSeconds}s`, '--rlimit', 'core=0', '--rlimit', 'nofile=128', name, '--', ...command];
    let terminalState, primary;
    if (process.stdin.isTTY && stdio === 'inherit' && !coordinator) {
      const captured = spawnSync('/bin/stty', ['-g'], { stdio: [0, 'pipe', 'ignore'], encoding: 'utf8', timeout: 1000 });
      terminalState = captured.status === 0 ? captured.stdout.trim() : undefined;
      if (!terminalState || !/^[A-Za-z0-9_=;:-]+$/.test(terminalState)) throw new RuntimeError('terminal_state_unavailable');
    }
    try {
      if (coordinator && stdio === 'inherit') await coordinator.attach(this.executable, args, runtimeEnvironment(this.home, this.library), signal);
      else await new Promise((resolve, reject) => {
        const child = spawn(this.executable, args, { env: runtimeEnvironment(this.home, this.library), stdio, signal });
        child.once('error', error => { const e = new RuntimeError(error.name === 'AbortError' ? 'runtime_cancelled' : 'guest_console_failed'); onOutcome({ phase: 'console', code: e.code }); reject(e); });
        child.once('exit', (code, exitSignal) => { onOutcome({ phase: 'console', exitCode: code, signal: exitSignal,...(code!==0?{code:'guest_console_cancelled'}:{}) }); if (code === 0) resolve(); else { const e = new RuntimeError('guest_console_cancelled'); e.exitCode = code; e.signal = exitSignal; reject(e); } });
      });
    } catch (error) {
      primary = error;
      await beforeTeardown?.().catch(()=>{});
      try { if (this.owned.has(name)) await this.remove(name); onOutcome({ phase: 'guest_removal', status: 'succeeded' }); }
      catch (cleanup) { onOutcome({ phase: 'guest_removal', code: cleanup.code }); }
    } finally {
      if (terminalState) {
        const restored = spawnSync('/bin/stty', [terminalState], { stdio: [0, 'ignore', 'ignore'], timeout: 1000 });
        onOutcome({ phase: 'terminal_restoration', status: restored.status === 0 ? 'succeeded' : 'failed' });
        if (restored.status !== 0 && !primary) primary = new RuntimeError('terminal_restore_failed');
      }
    }
    if (primary) throw primary;
  }

  async touch(name, { signal } = {}) { this.requireOwned(name); await this.call(['ping', name, '--touch'], { signal }); }

  async inspect(name) { this.requireOwned(name); return JSON.parse(await this.call(['inspect', name, '--format', 'json'])); }

  async remove(name) {
    if (this.removing.has(name)) return this.removing.get(name);
    this.requireOwned(name);
    const pending = this.call(['remove', '--force', name]).then(() => { this.owned.delete(name); }).finally(() => this.removing.delete(name));
    this.removing.set(name, pending); return pending;
  }
}
