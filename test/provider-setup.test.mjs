import test from 'node:test';
import assert from 'node:assert/strict';
import { PassThrough } from 'node:stream';
import { mkdtemp, lstat, readFile, symlink, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readHiddenKey, saveDeepSeekKey } from '../src/provider-setup.mjs';

const synthetic = 'unit-test-synthetic-key-not-valid';
function terminal() {
  const input = new PassThrough(); const output = new PassThrough();
  input.isTTY = output.isTTY = true;
  input.setRawMode = value => { input.isRaw = value; };
  let displayed = '';
  output.on('data', chunk => { displayed += chunk; });
  return { input, output, displayed: () => displayed };
}
test('hidden input never echoes the key and restores terminal mode', async () => {
  const tty = terminal();
  const pending = readHiddenKey(tty.input, tty.output);
  tty.input.emit('data', Buffer.from(synthetic + '\r'));
  assert.equal(await pending, synthetic);
  assert.equal(tty.displayed().includes(synthetic), false);
  assert.equal(tty.input.isRaw, false);
  assert.equal(tty.input.listenerCount('data'), 0);
});
test('cancel, oversized input and noninteractive input fail without exposing input', async () => {
  for (const data of [synthetic + '\x03', 'x'.repeat(513)]) {
    const tty = terminal();
    const pending = readHiddenKey(tty.input, tty.output);
    tty.input.emit('data', Buffer.from(data));
    await assert.rejects(pending, /credential_entry_cancelled|credential_format_invalid/);
    assert.equal(tty.input.isRaw, false);
    assert.equal(tty.displayed().includes(synthetic), false);
  }
  assert.throws(() => readHiddenKey(new PassThrough(), new PassThrough()), /interactive_terminal_required/);
});
test('credential setup creates private files, rotates atomically, and refuses symlink targets', async () => {
  const home = await mkdtemp(join(tmpdir(), 'adrnew-key-test-'));
  try {
    const directory = join(home, '.adrouter-new', 'providers', 'deepseek');
    const keyFile = join(directory, 'api-key');
    assert.deepEqual(await saveDeepSeekKey(synthetic, home), { provider: 'deepseek', credentialStored: true });
    assert.equal((await lstat(directory)).mode & 0o777, 0o700);
    assert.equal((await lstat(keyFile)).mode & 0o777, 0o600);
    assert.equal(await readFile(keyFile, 'utf8'), synthetic);
    await saveDeepSeekKey(synthetic + '-rotated', home);
    assert.equal(await readFile(keyFile, 'utf8'), synthetic + '-rotated');
    await rm(keyFile);
    const other = join(home, 'other'); await writeFile(other, 'unchanged');
    await symlink(other, keyFile);
    await assert.rejects(saveDeepSeekKey(synthetic, home), /credential_file_unsafe/);
    assert.equal(await readFile(other, 'utf8'), 'unchanged');
  } finally { await rm(home, { recursive: true, force: true }); }
});
test('credential setup refuses symlink directories', async () => {
  const home = await mkdtemp(join(tmpdir(), 'adrnew-key-test-'));
  try {
    await symlink(home, join(home, '.adrouter-new'));
    await assert.rejects(saveDeepSeekKey(synthetic, home), /credential_directory_unsafe/);
  } finally { await rm(home, { recursive: true, force: true }); }
});
