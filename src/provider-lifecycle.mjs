import { providerDiagnostic } from './provider-diagnostics.mjs';
import { randomUUID } from 'node:crypto';
import { mkdir, lstat, writeFile, rename, unlink, readFile } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join, isAbsolute } from 'node:path';

const identifier = value => /^[a-zA-Z0-9_-]{1,80}$/.test(value ?? '') ? value : null;
const { version } = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));

// Deliberately accepts metadata fields only. No exception message, child output,
// relay ticket, workload frame or guest configuration reaches this recorder.
export class ProviderLifecycle {
  constructor({ nodeId, providerRunId, profile = 'provider', directory, now = Date.now }) {
    this.nodeId = identifier(nodeId); this.providerRunId = identifier(providerRunId);
    if (!this.nodeId || !this.providerRunId || !/^[a-z][a-z0-9_-]{0,31}$/.test(profile)) throw Error('provider_diagnostic_identity_invalid');
    if (directory && !isAbsolute(directory)) throw Error('provider_diagnostic_path_invalid');
    this.base = directory ?? join(homedir(), '.adr-v2', 'profiles', profile, 'provider');
    this.path = join(this.base, this.nodeId, this.providerRunId, 'lifecycle.json');
    this.directory = directory; this.profile = profile; this.now = now; this.events = []; this.firstFailure = null; this.stopTrigger = null;
    this.pending = Promise.resolve(); this.outcomes = []; this.saveFailed = false;
  }
  event(phase, value = {}) {
    const entry = { ...providerDiagnostic(phase,value,value,this.now), at: this.now(), phase: identifier(phase), code: identifier(value.code), status: identifier(value.status),
      signal: identifier(value.signal), exitCode: Number.isInteger(value.exitCode) ? value.exitCode : null,
      relayGeneration: Number.isSafeInteger(value.relayGeneration) ? value.relayGeneration : null,
      leaseUntil: Number.isSafeInteger(value.leaseUntil) ? value.leaseUntil : null };
    if (entry.code && !this.firstFailure) this.firstFailure = entry;
    this.events.push(entry); if (this.events.length > 256) this.events.shift();
    this.persist(); return entry;
  }
  stop(trigger, value = {}) { this.stopTrigger ??= { at: this.now(), trigger: identifier(trigger), signal: identifier(value.signal) }; this.event('stop', { ...value, status: 'stopping' }); }
  async prepare() {
    if (this.prepared) return;
    if (!this.directory) {
      let path = homedir();
      for (const part of ['.adr-v2', 'profiles', this.profile, 'provider']) {
        path = join(path, part); await mkdir(path, { mode: 0o700 }).catch(e => { if (e.code !== 'EEXIST') throw e; });
        const stat = await lstat(path); if (!stat.isDirectory() || stat.isSymbolicLink() || stat.uid !== process.getuid() || (stat.mode & 0o077)) throw Error('provider_diagnostic_path_unsafe');
      }
    } else {
      const stat = await lstat(this.base); if (!stat.isDirectory() || stat.isSymbolicLink() || stat.uid !== process.getuid() || (stat.mode & 0o077)) throw Error('provider_diagnostic_path_unsafe');
    }
    let path = this.base;
    for (const part of [this.nodeId, this.providerRunId]) {
      path = join(path, part); await mkdir(path, { mode: 0o700 }).catch(e => { if (e.code !== 'EEXIST') throw e; });
      const stat = await lstat(path); if (!stat.isDirectory() || stat.isSymbolicLink() || stat.uid !== process.getuid() || (stat.mode & 0o077)) throw Error('provider_diagnostic_path_unsafe');
    }
    this.prepared = true;
  }
  persist() {
    const value = JSON.stringify({ schemaVersion: 1, nodeId: this.nodeId, providerRunId: this.providerRunId, pid: process.pid, clientVersion: version,
      firstFailure: this.firstFailure, stopTrigger: this.stopTrigger, events: this.events.slice(), outcomes: this.outcomes });
    this.pending = this.pending.catch(() => {}).then(async () => {
      await this.prepare(); const temporary = this.path + '.' + randomUUID() + '.tmp';
      try { await writeFile(temporary, value, { flag: 'wx', mode: 0o600 }); await rename(temporary, this.path); this.saveFailed = false; }
      finally { await unlink(temporary).catch(e => { if (e.code !== 'ENOENT') throw e; }); }
    }).catch(() => { this.saveFailed = true; });
  }
  async finish(outcomes) {
    this.outcomes = outcomes.map(o => ({ phase: identifier(o.phase), status: identifier(o.status), code: identifier(o.code) }));
    this.persist(); await this.pending;
    return { phase: 'diagnostic_save', status: this.saveFailed ? 'failed' : 'succeeded', ...(this.saveFailed ? { code: 'provider_diagnostic_save_failed' } : {}) };
  }
}
