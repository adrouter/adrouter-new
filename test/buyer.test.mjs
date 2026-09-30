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

test('persistent buyer keeps conversation and guest across follow-ups, denies tools and never replays',async()=>{
 const {openBuyer}=await import('../src/buyer.mjs');
 const root=await realpath(await mkdtemp(join(tmpdir(),'adr-conversation-')));await writeFile(join(root,'task.txt'),'before');
 let created=0,removed=0,dispatches=0,toolCalls=0,stopped=0;const frames=[];
 const session={id:'s',state:'ready',mode:'private_rehearsal',handshakeStatus:'succeeded',expiresAt:Date.now()+300000,requestLimit:5,requestSequence:0,maxOutputTokens:1024};
 const runtime={owned:new Set(),verify:async()=>{},create:async()=>{created++;runtime.owned.add('g');return 'g';},inspect:async()=>({config:{manifest_digest:JSON.parse(await readFile(new URL('../runtime/guest-images.json',import.meta.url)))[`node`][`linux-${process.arch}`],mounts:[],network:{policy:{default_egress:'deny'}}}}),run:async(_name,args)=>{if(args[2].includes("m.perform")){toolCalls++;return JSON.stringify({result:'synthetic tool result'});}return '';},touch:async()=>{},remove:async()=>{removed++;runtime.owned.clear();}};
 const network={request:async(path,options)=>{
  if(path.endsWith('/stop')){stopped++;return {};}
  if(path.endsWith('/inference')){dispatches++;session.requestSequence++;frames.push(structuredClone(options.body));return dispatches===1?{text:'',toolCalls:[{id:'write',type:'function',function:{name:'write_file',arguments:'{"path":"task.txt","content":"after"}'}}]}:{text:'synthetic answer',toolCalls:[]};}
  return {...session};
 }};
 let buyer;
 try{
 buyer=await openBuyer(network,'s',{root,files:['task.txt'],runtime,approve:async()=>false});
 await buyer.prompt('first');await buyer.prompt('second');
 assert.equal(created,1);assert.equal(dispatches,3);assert.equal(toolCalls,0);assert.equal(frames[2].messages.some(m=>m.content==='first'),true);assert.equal(frames[2].messages.at(-1).content,'second');assert.ok(frames[1].messages.some(m=>m.role==='tool' && m.content.includes('denied')));
 session.requestSequence=5;assert.equal((await buyer.prompt('exhausted')).status,'exhausted');assert.equal(dispatches,3);
 await buyer.close();assert.equal(removed,1);assert.equal(stopped,1);
 }finally{await buyer?.close();await rm(root,{recursive:true,force:true});}
});
