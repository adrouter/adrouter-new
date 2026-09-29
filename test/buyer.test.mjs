import test from 'node:test';
import assert from 'node:assert/strict';
import { ActionApproval } from '../src/buyer.mjs';
import { importWorkspace, exportSnapshot } from '../src/workspace.mjs';
import { realpath, mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
test('action approvals bind exact payload and are consumed once', () => {
  const action = { name: 'write_file', path: 'a.txt', content: 'reviewed' };
  const approval = new ActionApproval(action);
  assert.throws(() => approval.consume({ ...action, content: 'changed' }, { id: approval.id, digest: approval.digest, allowOnce: true }), /approval_required/);
  approval.consume(action, { id: approval.id, digest: approval.digest, allowOnce: true });
  assert.throws(() => approval.consume(action, { id: approval.id, digest: approval.digest, allowOnce: true }), /approval_required/);
});
test('complete reviewed snapshot includes additions and deletions without altering host originals', async () => {
  const root = await realpath(await mkdtemp(join(tmpdir(), 'adr-export-test-'))); let workspace, exported;
  try {
    await writeFile(join(root, 'keep.txt'), 'before'); await writeFile(join(root, 'remove.txt'), 'remove');
    workspace = await importWorkspace(root, ['keep.txt','remove.txt']);
    exported = await exportSnapshot(workspace, { 'keep.txt': 'after', 'new.txt': 'new' }, async proposal => {
      assert.deepEqual(proposal.changes.map(c => c.kind).sort(), ['add','delete','modify']); return true;
    });
    assert.equal(await readFile(join(root, 'keep.txt'), 'utf8'), 'before');
    assert.equal(await readFile(join(exported.directory, 'workspace/new.txt'), 'utf8'), 'new');
    assert.equal(JSON.parse(await readFile(exported.manifest, 'utf8')).changes.find(c => c.kind === 'delete').path, 'remove.txt');
  } finally { if (exported) await rm(exported.directory, { recursive: true, force: true }); if (workspace) await rm(workspace.copy, { recursive: true, force: true }); await rm(root, { recursive: true, force: true }); }
});
