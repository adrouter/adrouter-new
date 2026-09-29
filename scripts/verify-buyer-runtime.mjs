import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, realpath, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runBuyer } from '../src/buyer.mjs';
const root = await realpath(await mkdtemp(join(tmpdir(), 'adr-buyer-vm-test-')));
let exported; let calls = 0; const approved = [];
const tool = (id, name, args) => ({ id, type: 'function', function: { name, arguments: JSON.stringify(args) } });
const network = { async request(path, options = {}) {
  if (path.endsWith('/inference')) {
    calls++;
    if (calls === 1) return { text: '', toolCalls: [tool('one','write_file',{path:'result.txt',content:'new result'}),tool('two','delete_file',{path:'old.txt'}),tool('three','run_command',{argv:['node','-e','console.log(process.platform)']})] };
    assert.ok(options.body.messages.some(m => m.role === 'tool' && m.content.includes('linux')));
    return { text: 'Synthetic task complete.', toolCalls: [] };
  }
  return { id: 'synthetic', state: 'ready', maxOutputTokens: 128 };
} };
try {
  await writeFile(join(root,'old.txt'),'original');
  exported = await runBuyer(network, 'synthetic', { root, files:['old.txt'], prompt:'Synthetic test', runtimeConfig: { executable:process.env.ADROUTER_NEW_RUNTIME_EXECUTABLE, library:process.env.ADROUTER_NEW_RUNTIME_LIBRARY, home:process.env.ADROUTER_NEW_RUNTIME_HOME }, approve: async action => { approved.push(action.name); return true; } });
  assert.deepEqual(approved, ['write_file','delete_file','run_command','export_workspace']);
  assert.equal(await readFile(join(root,'old.txt'),'utf8'),'original');
  assert.equal(await readFile(join(exported.directory,'workspace/result.txt'),'utf8'),'new result');
  const manifest = JSON.parse(await readFile(exported.manifest,'utf8'));
  assert.equal(manifest.changes.find(c=>c.path==='old.txt').kind,'delete');
  console.log('Real Apple Silicon buyer VM: tools, Linux command, action approvals, additions/deletions export and host-original preservation passed; synthetic inference only.');
} finally { await rm(root,{recursive:true,force:true}); if(exported)await rm(exported.directory,{recursive:true,force:true}); }
