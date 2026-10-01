// Actual Apple Silicon microVM acceptance, synthetic inference only. Never reads
// auth profiles or makes paid calls. No workload content is written as evidence.
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { realpath, mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir, homedir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const clientRoot=process.env.ADR_ACCEPTANCE_CLIENT_ROOT;
const {openCodingBuyer}=await import(clientRoot?pathToFileURL(join(clientRoot,'src/coding-buyer.mjs')).href:new URL('../src/coding-buyer.mjs',import.meta.url).href);
if(process.platform!=='darwin'||process.arch!=='arm64')throw Error('actual_apple_silicon_required');
const profile=`test-${randomUUID().slice(0,8)}`,root=await realpath(await mkdtemp(join(tmpdir(),'adr-coding-native-'))),id=randomUUID();
await writeFile(join(root,'main.py'),'print("before")\n');await writeFile(join(root,'remove.txt'),'synthetic remove');await writeFile(join(root,'large.txt'),'synthetic-large-content\n'.repeat(32000));
let dispatches=0,approvals=0,stops=0;
let session={id,protocol:'coding_v1',mode:'private_rehearsal',state:'ready',handshakeStatus:'succeeded',expiresAt:Date.now()+3600000,requestLimit:100,requestSequence:0,maxOutputTokens:1024,contextWindowTokens:32768,listingId:randomUUID(),listingRevision:1,model:'synthetic'};
const call=(id,name,args)=>({id,type:'function',function:{name,arguments:JSON.stringify(args)}});
const network={request:async(path,options={})=>{
  if(path.endsWith('/stop')){stops++;session.state='settled';return {...session};}
  if(path.endsWith('/inference')){
    dispatches++;session.requestSequence++;
    const toolCalls=dispatches===1?[call('read1','read',{path:'main.py'}),call('ls1','ls',{path:'.'})]:dispatches===2?[call('write1','write',{path:'main.py',content:'print("after")\n'}),call('write2','write',{path:'added.py',content:'assert 2 + 2 == 4\n'}),call('bash1','bash',{command:'rm remove.txt && python3 added.py && git --version && rg after main.py',timeout:120})]:[];
    return {requestId:options.body.requestId,text:toolCalls.length?'':'Synthetic coding complete.',thinking:'',toolCalls,usage:{inputTokens:8,outputTokens:8}};
  }
  return {...session};
}};
let buyer;
try{
  buyer=await openCodingBuyer(network,id,{root,files:['main.py','remove.txt','large.txt'],trusted:true,profile,approve:async()=>{approvals++;return true;}});
  await buyer.interactive({prompt:'Synthetic test: inspect and update the fixture, add a file, delete remove.txt and run Python, Git and ripgrep.',mode:process.argv.includes('--pty')?'interactive':'print',consoleOptions:process.argv.includes('--pty')?{}:{stdio:['ignore','ignore','inherit']}});
  assert.ok(dispatches>=3,'guest harness dispatched structured inference');const saved=await buyer.save();assert.equal(saved.resumeId,id);const state=JSON.parse(await readFile(join(homedir(),'.adr-v2','profiles',profile,'coding',id,'state.json'),'utf8'));assert.ok(Object.keys(state.resources).length>0,'private context must contain session records');
  const applied=await buyer.apply();assert.equal(applied.status,'applied');assert.equal(await readFile(join(root,'main.py'),'utf8'),'print("after")\n');assert.equal(await readFile(join(root,'added.py'),'utf8'),'assert 2 + 2 == 4\n');await assert.rejects(readFile(join(root,'remove.txt')));
  await buyer.close();assert.equal(stops,1);
  const oldDispatches=dispatches;session={...session,id:randomUUID(),state:'ready',requestSequence:0};
  buyer=await openCodingBuyer(network,session.id,{root,files:['added.py','large.txt','main.py'],trusted:true,profile,resumeId:id,approve:async()=>true});assert.equal(dispatches,oldDispatches,'resume does not replay inference');await buyer.interactive({prompt:'Synthetic resumed follow-up.',mode:'print',consoleOptions:{stdio:['ignore','ignore','inherit']}});assert.equal(dispatches,oldDispatches+1);await buyer.close();assert.equal(stops,2);console.log(JSON.stringify({status:'passed',platform:'darwin-arm64',dispatches,approvals,guestTools:true,reviewedApply:true,privateSave:true,resumeNoReplay:true,teardown:true,paidInference:false}));
}finally{await buyer?.close();await rm(root,{recursive:true,force:true});await rm(join(homedir(),'.adr-v2','profiles',profile),{recursive:true,force:true});}
