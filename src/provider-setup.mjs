import { constants } from 'node:fs';
import { mkdir, lstat, open, rename, unlink, realpath, chmod } from 'node:fs/promises';
import { homedir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';

export class ProviderSetupError extends Error {
  constructor(code) { super(code); this.code = code; }
}

export function readHiddenKey(input = process.stdin, output = process.stdout) {
  if (!input.isTTY || !output.isTTY || typeof input.setRawMode !== 'function') {
    throw new ProviderSetupError('interactive_terminal_required');
  }
  output.write('DeepSeek API key (hidden; Ctrl+C cancels): ');
  return new Promise((resolve, reject) => {
    let value = '';
    const previousRaw = Boolean(input.isRaw);
    const wasPaused = input.isPaused();
    const finish = (error) => {
      input.removeListener('data', onData);
      input.removeListener('end', onEnd);
      input.removeListener('error', onError);
      input.setRawMode(previousRaw);
      if (wasPaused) input.pause();
      output.write('\n');
      if (error) { value = ''; reject(new ProviderSetupError(error)); }
      else { const result = value; value = ''; resolve(result); }
    };
    const onEnd = () => finish('credential_entry_cancelled');
    const onError = () => finish('credential_entry_failed');
    const onData = chunk => {
      for (const char of chunk.toString('utf8')) {
        if (char === '\x03' || char === '\x04') { finish('credential_entry_cancelled'); return; }
        if (char === '\r' || char === '\n') {
          finish(/^[\x21-\x7e]{16,512}$/.test(value) ? null : 'credential_format_invalid'); return;
        }
        if (char === '\x7f' || char === '\b') value = value.slice(0, -1);
        else if (/^[\x21-\x7e]$/.test(char)) value += char;
        else { finish('credential_format_invalid'); return; }
        if (value.length > 512) { finish('credential_format_invalid'); return; }
      }
    };
    input.setRawMode(true);
    input.on('data', onData);
    input.once('end', onEnd);
    input.once('error', onError);
    input.resume();
  });
}

// Called by the operator's local terminal only. No network request, subprocess,
// environment export, telemetry, or credential readback is performed here.
export async function saveDeepSeekKey(key, home = homedir()) {
  if (typeof key !== 'string' || !/^[\x21-\x7e]{16,512}$/.test(key)) throw new ProviderSetupError('credential_format_invalid');
  let directory = await realpath(home);
  for (const part of ['.adrouter-new', 'providers', 'deepseek']) {
    directory = join(directory, part);
    await mkdir(directory, { mode: 0o700 }).catch(error => { if (error.code !== 'EEXIST') throw error; });
    const stat = await lstat(directory);
    if (!stat.isDirectory() || stat.isSymbolicLink() || stat.uid !== process.getuid()) throw new ProviderSetupError('credential_directory_unsafe');
    await chmod(directory, 0o700);
  }
  const destination = join(directory, 'api-key');
  const existing = await lstat(destination).catch(error => { if (error.code === 'ENOENT') return null; throw error; });
  if (existing && (!existing.isFile() || existing.isSymbolicLink() || existing.nlink !== 1 || existing.uid !== process.getuid())) throw new ProviderSetupError('credential_file_unsafe');
  const temporary = join(directory, `.key-${randomUUID()}`);
  const bytes = Buffer.from(key, 'utf8');
  let file;
  try {
    file = await open(temporary, constants.O_WRONLY | constants.O_CREAT | constants.O_EXCL | constants.O_NOFOLLOW, 0o600);
    await file.writeFile(bytes);
    await file.sync();
    await file.close(); file = undefined;
    await rename(temporary, destination);
    return { provider: 'deepseek', credentialStored: true };
  } finally {
    bytes.fill(0);
    await file?.close();
    await unlink(temporary).catch(error => { if (error.code !== 'ENOENT') throw error; });
  }
}
