import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, realpath, writeFile, readFile, rm, mkdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { randomUUID } from 'node:crypto';
import { importWorkspace } from '../src/workspace.mjs';
import { saveCodingSnapshot, openSavedCodingWork } from '../src/saved-work.mjs';
async function fixture(fn){
 const directory=await realpath(await mkdtemp(join(tmpdir(),'adr-saved-'))),root=join(directory,'project'),id=randomUUID(),storage=join(directory,id);let workspace;
 try{await mkdir(root,{mode:0o700});await mkdir(storage,{mode:0o700});await writeFile(join(root,'main.txt'),'before');workspace=await importWorkspace(root,['main.txt']);const state={root,rootIdentity:workspace.rootIdentity,sessionId:id,manifest:workspace.manifest,files:{'main.txt':'after','new.txt':'created'},resources:{}};await saveCodingSnapshot(storage,state);await fn({directory,root,id,storage,state});}
 finally{if(workspace)await rm(workspace.copy,{recursive:true,force:true});await rm(directory,{recursive:true,force:true});}
}
for(const compute of ['removed','expired','settlement_pending'])test(`saved Apply succeeds with ${compute} compute and repeated application does not rewrite`,()=>fixture(async f=>{
 let approvals=0;const options={directory:f.directory,approve:async a=>{assert.equal(a.root,f.root);assert.equal(a.snapshotRevision.length,64);approvals++;return true;}};
 const saved=await openSavedCodingWork('buyer',f.id,options);assert.equal((await saved.review()).changes.length,2);assert.equal((await saved.apply()).status,'applied');assert.equal(await readFile(join(f.root,'main.txt'),'utf8'),'after');
 const reopened=await openSavedCodingWork('buyer',f.id,options);assert.equal((await reopened.apply()).status,'unchanged');assert.equal(approvals,1);
}));
test('saved denial and changed originals preserve host files',()=>fixture(async f=>{
 const denied=await openSavedCodingWork('buyer',f.id,{directory:f.directory});await assert.rejects(denied.apply(),/apply_denied/);assert.equal(await readFile(join(f.root,'main.txt'),'utf8'),'before');
 await writeFile(join(f.root,'main.txt'),'operator');const saved=await openSavedCodingWork('buyer',f.id,{directory:f.directory,approve:async()=>true});await assert.rejects(saved.apply(),/export_conflict/);assert.equal(await readFile(join(f.root,'main.txt'),'utf8'),'operator');
}));
test('legacy saved work requires explicit project confirmation and baseline hashes',()=>fixture(async f=>{
 const {rootIdentity,...old}=f.state;await writeFile(join(f.storage,'state.json'),JSON.stringify({...old,schemaVersion:1}),{mode:0o600});
 await assert.rejects(openSavedCodingWork('buyer',f.id,{directory:f.directory}),/confirmation_required/);
 const saved=await openSavedCodingWork('buyer',f.id,{directory:f.directory,confirmProject:async()=>true,approve:async()=>true});assert.equal((await saved.apply()).status,'applied');
 assert.equal((await openSavedCodingWork('buyer',f.id,{directory:f.directory})).state.schemaVersion,2);
}));
test('immutable revisions survive newer checkpoints and digest tampering is rejected',()=>fixture(async f=>{
 const selected=await openSavedCodingWork('buyer',f.id,{directory:f.directory});await saveCodingSnapshot(f.storage,{...f.state,files:{'main.txt':'later'}});
 const old=await openSavedCodingWork('buyer',f.id,{directory:f.directory,revision:selected.snapshotRevision});assert.equal(old.files['main.txt'],'after');
 const state=JSON.parse(await readFile(join(f.storage,'state.json')));state.files['main.txt']='tampered';await writeFile(join(f.storage,'state.json'),JSON.stringify(state));await assert.rejects(openSavedCodingWork('buyer',f.id,{directory:f.directory}),/digest_mismatch/);
}));

test('repeated saved application detects a subsequent host edit instead of claiming unchanged',()=>fixture(async f=>{
 const options={directory:f.directory,approve:async()=>true};const saved=await openSavedCodingWork('buyer',f.id,options);await saved.apply();await writeFile(join(f.root,'main.txt'),'operator after apply');
 const reopened=await openSavedCodingWork('buyer',f.id,options);await assert.rejects(reopened.apply(),/export_conflict/);assert.equal(await readFile(join(f.root,'main.txt'),'utf8'),'operator after apply');
}));
test('saved recovery after teardown confirms an interrupted rename and completes only pending files',()=>fixture(async f=>{
 const work=await openSavedCodingWork('buyer',f.id,{directory:f.directory,approve:async()=>true}),review=await work.review(),journalRoot=join(f.directory,'journals');await mkdir(journalRoot,{mode:0o700});
 const journal=join(journalRoot,review.id+'.json');await writeFile(journal,JSON.stringify({schemaVersion:1,operationId:review.id,root:f.root,identity:f.state.rootIdentity,snapshotRevision:work.snapshotRevision,status:'interrupted',completed:[],changes:review.changes}),{mode:0o600});
 // Crash after replacement but before journal update: recovery recognizes the
 // exact proposed hash, without rerunning a tool or requesting compute.
 await writeFile(join(f.root,'main.txt'),'after');assert.equal((await work.recover(journal)).status,'applied');assert.equal(await readFile(join(f.root,'new.txt'),'utf8'),'created');
 assert.equal((await (await openSavedCodingWork('buyer',f.id,{directory:f.directory,approve:async()=>true})).apply()).status,'unchanged');
}));
test('saved recovery denial and changed completed host bytes fail without writes',()=>fixture(async f=>{
 const work=await openSavedCodingWork('buyer',f.id,{directory:f.directory}),review=await work.review(),journalRoot=join(f.directory,'journals');await mkdir(journalRoot,{mode:0o700});
 const journal=join(journalRoot,review.id+'.json');await writeFile(journal,JSON.stringify({schemaVersion:1,operationId:review.id,root:f.root,identity:f.state.rootIdentity,snapshotRevision:work.snapshotRevision,status:'interrupted',completed:['main.txt'],changes:review.changes}),{mode:0o600});
 await assert.rejects(work.recover(journal),/apply_denied/);await writeFile(join(f.root,'main.txt'),'operator');
 const allowed=await openSavedCodingWork('buyer',f.id,{directory:f.directory,approve:async()=>true});assert.equal((await allowed.recover(journal)).code,'apply_recovery_conflict');assert.equal(await readFile(join(f.root,'main.txt'),'utf8'),'operator');await assert.rejects(readFile(join(f.root,'new.txt')));
}));

test('selected Apply binds exact paths, defaults UI selection empty and preserves remaining snapshot changes',()=>fixture(async f=>{
 const approvals=[];const options={directory:f.directory,approve:async action=>{approvals.push(action);return true;}};
 const work=await openSavedCodingWork('buyer',f.id,options);
 assert.equal((await work.apply([])).status,'unchanged');assert.equal(approvals.length,0);
 await assert.rejects(work.apply(['missing.txt']),/apply_selection_invalid/);
 const applied=await work.apply(['new.txt']);assert.deepEqual(applied.completed,['new.txt']);
 assert.deepEqual(approvals[0].changes.map(c=>c.path),['new.txt']);assert.ok(approvals[0].digest);assert.ok(approvals[0].changes[0].diff.some(line=>line.includes('created')));
 assert.equal(await readFile(join(f.root,'main.txt'),'utf8'),'before');assert.equal(await readFile(join(f.root,'new.txt'),'utf8'),'created');
 const reopened=await openSavedCodingWork('buyer',f.id,options);assert.deepEqual((await reopened.review()).changes.map(c=>c.path),['main.txt']);
 assert.deepEqual((await reopened.apply(['main.txt'])).completed,['main.txt']);assert.equal(await readFile(join(f.root,'main.txt'),'utf8'),'after');
}));
