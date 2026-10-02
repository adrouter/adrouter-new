import test from 'node:test';
import assert from 'node:assert/strict';
import { PassThrough } from 'node:stream';
import { mkdtemp, lstat, readFile, symlink, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { readHiddenKey } from '../src/provider-setup.mjs';

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
  for (const data of [synthetic + '\x03', 'x'.repeat(4097)]) {
    const tty = terminal();
    const pending = readHiddenKey(tty.input, tty.output);
    tty.input.emit('data', Buffer.from(data));
    await assert.rejects(pending, /credential_entry_cancelled|credential_format_invalid/);
    assert.equal(tty.input.isRaw, false);
    assert.equal(tty.displayed().includes(synthetic), false);
  }
  assert.throws(() => readHiddenKey(new PassThrough(), new PassThrough()), /interactive_terminal_required/);
});

test('hidden bracketed paste survives split markers and trailing newline without submitting',async()=>{
 const tty=terminal();let resolved=false;const pending=readHiddenKey(tty.input,tty.output).then(v=>{resolved=true;return v;});
 for(const b of Buffer.from('\x1b[200~'+synthetic+'\n\x1b[201~'))tty.input.emit('data',Buffer.from([b]));
 await Promise.resolve();assert.equal(resolved,false);tty.input.emit('data',Buffer.from('\r'));assert.equal(await pending,synthetic);assert.equal(tty.displayed().includes(synthetic),false);
});
