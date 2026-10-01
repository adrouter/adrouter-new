import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, realpath, writeFile, readFile, rm, symlink, mkdir } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { UpstreamCodingStream, readCodingStream } from '../src/coding-wire.mjs';
import { DispatchQueue } from '../src/coding-buyer.mjs';
import { importWorkspace, reviewAndApply, projectManifest } from '../src/workspace.mjs';
test('SSE parser tolerates every byte boundary and rejects incomplete or malformed calls',async()=>{
 const events=[];const p=new UpstreamCodingStream('request',['read'],e=>events.push(e));
 const chunks=[{choices:[{delta:{content:'é'}}]},{choices:[{delta:{tool_calls:[{index:0,id:'c1',type:'function',function:{name:'read',arguments:'{"path":'}}]}}]},{choices:[{delta:{tool_calls:[{index:0,function:{arguments:'"a"}'}}]},finish_reason:'tool_calls'}]},{choices:[],usage:{prompt_tokens:2,completion_tokens:3}}];
 const bytes=Buffer.from(chunks.map(d=>`data: ${JSON.stringify(d)}\n\n`).join('')+'data: [DONE]\n\n');
 for(const b of bytes)await p.feed(Buffer.from([b]));const result=p.result();assert.equal(result.text,'é');assert.equal(result.toolCalls[0].function.arguments,'{"path":"a"}');assert.equal(events[0].sequence,1);
 const incomplete=new UpstreamCodingStream('request',[],()=>{});await incomplete.feed(Buffer.from('data: {"choices":[]}\n\n'));assert.throws(()=>incomplete.result(),/incomplete/);
 const denied=new UpstreamCodingStream('request',['write'],()=>{});await denied.feed(bytes);assert.throws(()=>denied.result(),/invalid/);
});
test('stream reader requires final completion; fragments alone never grant execution',async()=>{
 const response=s=>new Response(s,{headers:{'content-type':'application/x-ndjson'}});
 await assert.rejects(readCodingStream(response('{"type":"coding_delta","sequence":1,"kind":"text","text":"partial"}\n')),/unknown/);
 const value=await readCodingStream(response('{"type":"complete","text":"done"}\n'));assert.equal(value.text,'done');
 await assert.rejects(readCodingStream(response('{"type":"error","code":"request_outcome_unknown"}\n')),/outcome_unknown/);
});
test('parallel requests serialize into one dispatch slot; cancelled queued work does not run',async()=>{
 const queue=new DispatchQueue();let active=0,maximum=0,calls=0;const work=async()=>{active++;maximum=Math.max(maximum,active);calls++;await new Promise(r=>setTimeout(r,5));active--;};
 await Promise.all([queue.run(work),queue.run(work),queue.run(work)]);assert.equal(maximum,1);assert.equal(calls,3);queue.stop();await assert.rejects(queue.run(work));assert.equal(calls,3);
});
test('Review and Apply binds additions, modifications and deletions while preserving unrelated files',async()=>{
 const root=await realpath(await mkdtemp(join(tmpdir(),'adr-apply-test-'))),journals=await realpath(await mkdtemp(join(tmpdir(),'adr-journals-test-')));let workspace;
 try {await writeFile(join(root,'main.txt'),'old');await writeFile(join(root,'delete.txt'),'delete');await writeFile(join(root,'unrelated.txt'),'operator');workspace=await importWorkspace(root,['main.txt','delete.txt']);
 const result=await reviewAndApply(workspace,{'main.txt':'new','added.txt':'add'},async p=>{assert.equal(p.digest.length,64);assert.deepEqual(p.changes.map(c=>c.kind).sort(),['add','delete','modify']);return true;},{journalRoot:journals});assert.equal(result.status,'applied');assert.equal(await readFile(join(root,'main.txt'),'utf8'),'new');assert.equal(await readFile(join(root,'unrelated.txt'),'utf8'),'operator');await assert.rejects(readFile(join(root,'delete.txt')));assert.equal(JSON.parse(await readFile(result.journal)).status,'complete');
 }finally{if(workspace)await rm(workspace.copy,{recursive:true,force:true});await rm(root,{recursive:true,force:true});await rm(journals,{recursive:true,force:true});}
});
test('changed-original after review and denied approval cause zero host writes',async()=>{
 const root=await realpath(await mkdtemp(join(tmpdir(),'adr-apply-conflict-'))),journals=await realpath(await mkdtemp(join(tmpdir(),'adr-apply-journals-')));let workspace;
 try {await writeFile(join(root,'main.txt'),'old');workspace=await importWorkspace(root,['main.txt']);await assert.rejects(reviewAndApply(workspace,{'main.txt':'new'},async()=>false,{journalRoot:journals}),/denied/);const result=await reviewAndApply(workspace,{'main.txt':'new','added.txt':'add'},async()=>{await writeFile(join(root,'main.txt'),'operator');return true;},{journalRoot:journals});assert.equal(result.status,'interrupted');assert.deepEqual(result.completed,[]);assert.equal(await readFile(join(root,'main.txt'),'utf8'),'operator');await assert.rejects(readFile(join(root,'added.txt')));
 }finally{if(workspace)await rm(workspace.copy,{recursive:true,force:true});await rm(root,{recursive:true,force:true});await rm(journals,{recursive:true,force:true});}
});
test('manifest excludes credentials, dependency/generated folders and symlink escapes',async()=>{
 const root=await realpath(await mkdtemp(join(tmpdir(),'adr-manifest-test-')));
 try{await writeFile(join(root,'main.py'),'synthetic');await writeFile(join(root,'.env'),'synthetic forbidden fixture');await mkdir(join(root,'node_modules'));await writeFile(join(root,'node_modules','ignored.js'),'synthetic');await symlink('/etc',join(root,'escape'));const m=await projectManifest(root);assert.deepEqual(m.files.map(f=>f.path),['main.py']);}finally{await rm(root,{recursive:true,force:true});}
});
