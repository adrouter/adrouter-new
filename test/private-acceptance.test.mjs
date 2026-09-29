import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm, readdir, lstat, symlink, realpath } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { PassThrough } from 'node:stream';
import { AuthStore } from '../src/network.mjs';
import { waitForActivation, evaluateNode } from '../src/evaluation.mjs';
import { installRuntime, saveRuntimeConfig } from '../src/runtime-install.mjs';
import { TerminalUI } from '../src/tui-screen.mjs';
import { parseArgs } from '../src/cli.mjs';

test('default, provider and operator profiles have independent identities, locks and logout state', async () => {
  const home = await mkdtemp(join(tmpdir(), 'adr-profiles-'));
  try {
    const original = new AuthStore(home), provider = new AuthStore(home, 'provider'), operator = new AuthStore(home, 'operator');
    await original.write({ fixture: 'default' }); await provider.write({ fixture: 'provider' }); await operator.write({ fixture: 'operator' });
    assert.equal(await original.directory(), join(await realpath(home), '.adr-v2'));
    assert.notEqual(await provider.directory(), await operator.directory());
    await provider.withLock(() => operator.withLock(() => original.withLock(async () => {
      await assert.rejects(new AuthStore(home, 'provider').withLock(() => {}), /auth_state_busy/);
    })));
    await operator.clear(); assert.equal(await operator.read(), null);
    assert.deepEqual(await provider.read(), { fixture: 'provider' }); assert.deepEqual(await original.read(), { fixture: 'default' });
    assert.equal((await lstat(join(await provider.directory(), 'installation.json'))).mode & 0o777, 0o600);
    for (const name of ['../default', '/tmp/evil', '', 'UPPER', 'a'.repeat(33)]) assert.throws(() => new AuthStore(home, name), /invalid_profile/);
    await symlink(await provider.directory(), join(home, '.adr-v2/profiles/unsafe'));
    await assert.rejects(new AuthStore(home, 'unsafe').read(), /state_directory_unsafe/);
    assert.equal(parseArgs(['--profile', 'operator', 'login', '--operator']).options.profile, 'operator');
  } finally { await rm(home, { recursive: true, force: true }); }
});

test('cold evaluation waits for readiness, shows progress, and respects cancellation and expiry', async () => {
  const session = { id: 'test', state: 'activating', activationDeadline: Date.now() + 120000 };
  let polls = 0; const progress = [];
  const network = { request: async () => ({ ...session, state: ++polls === 2 ? 'ready' : 'activating' }) };
  assert.equal((await waitForActivation(network, session, { pollMs: 1, progress: p => progress.push(p) })).state, 'ready');
  assert.equal(polls, 2); assert.ok(progress[0].remainingSeconds <= 120);
  await assert.rejects(waitForActivation(network, { ...session, activationDeadline: Date.now() - 1 }), /activation_expired/);
  const abort = new AbortController(); abort.abort();
  await assert.rejects(waitForActivation(network, session, { signal: abort.signal }), /cancelled/);
});

test('evaluation cleans a cold session on cancellation and a ready session on setup failure', async () => {
  for (const mode of ['cold_cancel', 'buyer_failure', 'unknown_start']) {
    const abort = new AbortController(); let stopped = 0, replayed = 0;
    let session = { id: 'synthetic-session', listingId: 'synthetic-listing', listingRevision: 1, state: mode === 'cold_cancel' ? 'activating' : 'ready', activationDeadline: Date.now() + 120000 };
    const network = { request: async (path, options) => {
      if (path.endsWith('/start')) { replayed++; session.startKey = options.key; if (mode === 'unknown_start') throw new Error('network_unavailable_outcome_unknown'); return session; }
      if (path.endsWith('/stop')) { stopped++; return {}; }
      if (path === '/v2/admin/evaluation-sessions') return [session];
      if (path.endsWith('/result')) throw new Error('must_not_report');
      return session;
    } };
    await assert.rejects(evaluateNode(network, 'synthetic', { maximumCharge: '100', signal: abort.signal, progress: p => { if (mode === 'cold_cancel' && p.status === 'evaluation_started') abort.abort(); } }, { runtime: { verify: async () => {}, owned: new Set() }, runBuyer: async () => { throw new Error('synthetic_buyer_failure'); } }));
    assert.equal(stopped, 1); assert.equal(replayed, 1);
  }
});

test('failed or cancelled runtime downloads leave no install directory or saved configuration', async () => {
  const home = await mkdtemp(join(tmpdir(), 'adr-installer-'));
  try {
    for (const fetcher of [async () => new Response('failed', { status: 503 }), async () => new Response('incorrect digest')]) {
      await assert.rejects(installRuntime({ home, fetcher }));
      assert.deepEqual(await readdir(join(home, '.adr-v2-runtime')), []);
    }
    const abort = new AbortController();
    await assert.rejects(installRuntime({ home, signal: abort.signal, fetcher: async () => { abort.abort(); return new Response('cancelled'); } }));
    assert.deepEqual(await readdir(join(home, '.adr-v2-runtime')), []);
    await assert.rejects(saveRuntimeConfig({ executable: '/tmp/msb', library: '/tmp/lib', home: '/tmp/state', key: 'synthetic forbidden field' }, { home }), /configuration_invalid/);
  } finally { await rm(home, { recursive: true, force: true }); }
});

test('TUI Back, task cancellation and stop restore terminal state and listeners', async () => {
  const input = new PassThrough(), output = new PassThrough();
  input.isTTY = output.isTTY = true; input.isRaw = false; input.setRawMode = value => { input.isRaw = value; };
  output.columns = 60; output.rows = 18; let rendered = ''; output.on('data', bytes => { rendered += bytes; });
  input.pause(); const ui = new TerminalUI({ input, output, color: false }); ui.start();
  const menu = ui.menu('Profiles', ['Default', 'Provider']); input.emit('keypress', '', { name: 'escape' }); assert.equal(await menu, null);
  const task = ui.task('Waiting', signal => new Promise(resolve => signal.addEventListener('abort', () => resolve('cancelled'))), { cancel: true });
  input.emit('keypress', '', { name: 'c', ctrl: true }); assert.equal(await task, 'cancelled');
  ui.stop(); assert.equal(input.isRaw, false); assert.equal(input.isPaused(), true); assert.equal(input.listenerCount('keypress'), 0); assert.equal(output.listenerCount('resize'), 0);
  assert.ok(rendered.endsWith('\x1b[0m\x1b[?25h\x1b[?1049l'));
});
