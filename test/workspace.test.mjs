import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, readFile, mkdir, symlink, link, rm, realpath } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { importWorkspace, proposeExport, ExportApproval } from '../src/workspace.mjs';

async function fixture(fn) {
  const root = await realpath(await mkdtemp(join(tmpdir(), 'adrnew-import-test-')));
  try { await writeFile(join(root, 'main.js'), 'original'); await fn(root); }
  finally { await rm(root, { recursive: true, force: true }); }
}
test('imports explicit files; export requires one-use review and never edits original', () => fixture(async root => {
  const workspace = await importWorkspace(root, ['main.js']);
  try {
    assert.equal(await readFile(join(workspace.copy, 'main.js'), 'utf8'), 'original');
    const proposal = await proposeExport(workspace, { 'main.js': 'updated' });
    const approval = new ExportApproval(proposal);
    assert.equal((await approval.approve(workspace, proposal.id))[0].content, 'updated');
    await assert.rejects(approval.approve(workspace, proposal.id), /approval_invalid/);
    assert.equal(await readFile(join(root, 'main.js'), 'utf8'), 'original');
  } finally { await rm(workspace.copy, { recursive: true, force: true }); }
}));
test('rejects traversal, hidden credentials, archives, symlinks and hard links', () => fixture(async root => {
  await symlink(join(root, 'main.js'), join(root, 'alias.js'));
  await mkdir(join(root, 'sub'));
  await symlink(join(root, 'sub'), join(root, 'alias'));
  for (const path of ['../main.js', '/etc/passwd', '.env', '.git/config', 'id_ed25519', 'bundle.zip', 'alias.js', 'alias/main.js']) {
    await assert.rejects(importWorkspace(root, [path]));
  }
  await link(join(root, 'main.js'), join(root, 'hard.js'));
  await assert.rejects(importWorkspace(root, ['hard.js']), /workspace_file_rejected/);
}));
test('refuses changed originals at proposal and approval time', () => fixture(async root => {
  const workspace = await importWorkspace(root, ['main.js']);
  try {
    const proposal = await proposeExport(workspace, { 'main.js': 'updated' });
    await writeFile(join(root, 'main.js'), 'operator edit');
    await assert.rejects(proposeExport(workspace, { 'main.js': 'updated' }), /export_conflict/);
    await assert.rejects(new ExportApproval(proposal).approve(workspace, proposal.id), /export_conflict/);
  } finally { await rm(workspace.copy, { recursive: true, force: true }); }
}));
