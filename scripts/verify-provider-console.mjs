// Run in a task-owned PTY; supply a synthetic fixture, never a real upstream key.
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
const { startProvider } = await import(process.env.ADR_ACCEPTANCE_CLIENT_ROOT ? pathToFileURL(join(process.env.ADR_ACCEPTANCE_CLIENT_ROOT, 'src/provider.mjs')).href : '../src/provider.mjs');
const paths = JSON.parse(await readFile(process.env.ADR_ACCEPTANCE_RUNTIME_PATHS, 'utf8'));
const node = { id: 'synthetic-console', name: 'synthetic', endpoint: 'https://api.deepseek.com/chat/completions', model: 'synthetic', supplyClass: 'authorized_api', availability: 'hot', status: 'draft', approval: 'pending' };
const controller = await startProvider({ request: async () => node }, node.id, { runtimeConfig: { executable: paths.executable, library: paths.library, home: paths.home } });
try { assert.equal(controller.status.guestReady, true); }
finally { await controller.stop(); }
console.log('synthetic_guest_console_and_teardown_passed');
