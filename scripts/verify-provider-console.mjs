// Run in a task-owned PTY; supply a synthetic fixture, never a real upstream key.
import assert from 'node:assert/strict';
import { readFile, mkdtemp, rm } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
const { startProvider } = await import(process.env.ADR_ACCEPTANCE_CLIENT_ROOT ? pathToFileURL(join(process.env.ADR_ACCEPTANCE_CLIENT_ROOT, 'src/provider.mjs')).href : '../src/provider.mjs');
const paths = JSON.parse(await readFile(process.env.ADR_ACCEPTANCE_RUNTIME_PATHS, 'utf8'));
const node = { id: 'synthetic-console', name: 'synthetic', endpoint: 'https://api.deepseek.com/chat/completions', model: 'synthetic', supplyClass: 'authorized_api', availability: 'hot', status: 'published', suspended: false };
const network = {origin:'http://127.0.0.1:9',request:async(path,{body}={})=>path.endsWith('/relay-ticket')?{providerRunId:body.providerRunId,ticket:'t'.repeat(43),reauthenticateSeconds:10}:node};
const diagnosticsDirectory=await mkdtemp('/tmp/adr-console-diag-');
const controller = await startProvider(network, node.id, { diagnosticsDirectory, runtimeConfig: { executable: paths.executable, library: paths.library, home: paths.home } });
try { assert.equal(controller.status.guestReady, true); }
finally { await controller.stop(); await rm(diagnosticsDirectory,{recursive:true,force:true}); }
console.log('synthetic_guest_console_and_teardown_passed');
