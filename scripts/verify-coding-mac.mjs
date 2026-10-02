// Actual Apple Silicon microVM acceptance, synthetic inference only. Never reads
// auth profiles or makes paid calls. No workload content is written as evidence.
import assert from 'node:assert/strict';
import { randomUUID, createHash } from 'node:crypto';
import { realpath, mkdtemp, writeFile, readFile, rm } from 'node:fs/promises';
import { tmpdir, homedir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
const clientRoot=process.env.ADR_ACCEPTANCE_CLIENT_ROOT;
const entry=file=>clientRoot?pathToFileURL(join(clientRoot,'src',file)).href:new URL('../src/'+file,import.meta.url).href;
const {TerminalUI}=await import(entry('tui-screen.mjs'));
const {TerminalCoordinator}=await import(entry('terminal-coordinator.mjs'));
const {configuredRuntime}=await import(entry('provider.mjs'));
const readOnly=process.argv.includes('--read-only');
const controlled=process.argv.includes('--host-approval'),idle=process.argv.includes('--idle');
const ui=controlled?new TerminalUI():undefined,coordinator=ui?new TerminalCoordinator(ui):undefined;
const {openCodingBuyer}=await import(clientRoot?pathToFileURL(join(clientRoot,'src/coding-buyer.mjs')).href:new URL('../src/coding-buyer.mjs',import.meta.url).href);
if(process.platform!=='darwin'||process.arch!=='arm64')throw Error('actual_apple_silicon_required');
const profile=`test-${randomUUID().slice(0,8)}`,root=await realpath(await mkdtemp(join(tmpdir(),'adr-coding-native-'))),id=randomUUID();
await writeFile(join(root,'index.html'),'<body style="background:red">synthetic website</body>\n');await writeFile(join(root,'denied.txt'),'unchanged');await writeFile(join(root,'bom.txt'),'\ufeffsynthetic UTF-8 BOM\n');
await writeFile(join(root,'main.py'),'print("before")\n');await writeFile(join(root,'remove.txt'),'synthetic remove');await writeFile(join(root,'large.txt'),'synthetic-large-content\n'.repeat(32000));
let readsVerified=false;
let dispatches=0,approvals=0,stops=0,statusUnavailable=false;
let session={id,protocol:'coding_v1',mode:'private_rehearsal',state:'ready',handshakeStatus:'succeeded',expiresAt:Date.now()+3600000,requestLimit:100,requestSequence:0,maxOutputTokens:1024,contextWindowTokens:32768,listingId:randomUUID(),listingRevision:1,model:'synthetic'};
const call=(id,name,args)=>({id,type:'function',function:{name,arguments:JSON.stringify(args)}});
const network={request:async(path,options={})=>{
  if(path.startsWith('/v2/listings/'))return {id:session.listingId,revision:session.listingRevision,model:session.model,inputRate:'1000',outputRate:'2000'};
  if(path.endsWith('/stop')){stops++;session.state='settled';return {...session};}
  if(path.endsWith('/inference')){
    dispatches++;session.requestSequence++;if(process.env.ADR_NATIVE_PROGRESS_FILE)await writeFile(process.env.ADR_NATIVE_PROGRESS_FILE,JSON.stringify({dispatches}),{mode:0o600});
    if(dispatches===2){
      const results=new Map(options.body.messages.filter(m=>m.role==='tool').map(m=>[m.tool_call_id,m.content]));
      assert.match(results.get('read1')??'',/print\("before"\)/,'read returns fixture content');
      for(const name of ['ls1','find1','grep1'])assert.match(results.get(name)??'',/main\.py/,'built-in read returns actual results');
      assert.equal(approvals,0,'safe reads do not ask approval');
      assert.equal(await readFile(join(root,'main.py'),'utf8'),'print("before")\n');
      readsVerified=true;
    }
    const toolCalls=dispatches===1?[call('read1','read',{path:'main.py'}),call('ls1','ls',{path:'.'}),call('find1','find',{path:'.',pattern:'*.py'}),call('grep1','grep',{path:'.',pattern:'before'})]:!readOnly&&dispatches===2?[call('deny1','write',{path:'denied.txt',content:'denied change'}),call('blue1','write',{path:'index.html',content:'<body style="background:blue">synthetic website</body>\n'}),call('write1','write',{path:'main.py',content:'print("after")\n'}),call('write2','write',{path:'added.py',content:'assert 2 + 2 == 4\n'}),call('bash1','bash',{command:'if true; then\n  rm remove.txt\n  python3 added.py\nfi\ngit --version\nrg after main.py',timeout:120})]:[];
    return {requestId:options.body.requestId,text:toolCalls.length?'':'Synthetic coding complete.',thinking:'',toolCalls,usage:{inputTokens:8,outputTokens:8}};
  }
  if(statusUnavailable)throw Object.assign(Error('synthetic_status_unavailable'),{code:'marketplace_unavailable',status:503});return {...session};
}};
const {SandboxRuntime}=await import(entry('runtime.mjs'));
let buyer;const runtime=process.env.ADR_ACCEPTANCE_RUNTIME_PATHS?new SandboxRuntime(JSON.parse(await readFile(process.env.ADR_ACCEPTANCE_RUNTIME_PATHS,'utf8'))):await configuredRuntime();
try{
  buyer=await openCodingBuyer(network,id,{root,files:['main.py','remove.txt','large.txt','index.html','denied.txt','bom.txt'],runtime,trusted:true,profile,coordinator,approve:async(a,p)=>{approvals++;if(!coordinator&&a.name==='write'&&a.args?.path==='denied.txt')return false;return coordinator?coordinator.approve(a,p):true;}});
  if(ui)ui.start();const coding=()=>buyer.interactive({prompt:'Synthetic test: inspect and update the fixture, add a file, delete remove.txt and run Python, Git and ripgrep.',mode:process.argv.includes('--pty')?'interactive':'print',consoleOptions:process.argv.includes('--pty')?{}:{stdio:['ignore','ignore','inherit']}});if(ui)await ui.suspend(coding);else await coding();
  assert.equal(readsVerified,true,'actual runtime read results verified');
  if(readOnly){
    assert.equal(dispatches,2);assert.equal(approvals,0);
    assert.equal((await buyer.apply()).status,'unchanged','read-only turn changes no guest or host files');
    assert.equal(approvals,0);await buyer.close();
    console.log(JSON.stringify({status:'passed',automaticReads:4,approvals:0,bashCalls:0,filesUnchanged:true,paidInference:false}));
  } else {
  if(coordinator){
    const pid=coordinator.child?.pid;assert.ok(pid,'workspace preserves coding process');
    for(let cycle=1;cycle<=2;cycle++){console.log(`ADR_NATIVE_CONTINUE:${cycle}`);await ui.suspend(()=>buyer.interactive());assert.equal(coordinator.child?.pid,pid,'Continue must retain the same process');}
    console.log('ADR_NATIVE_DRAFT_TEST');
    const entering=ui.suspend(()=>buyer.interactive());await new Promise(r=>setTimeout(r,1800));await buyer.workspace();await entering;
    const draftHash=coordinator.lastAck.draftHash,agentId=coordinator.lastAck.agentId;
    assert.equal(draftHash,createHash('sha256').update('Synthetic draft line one\nline two').digest('hex'),'multiline draft retained while suspended');
    console.log('ADR_NATIVE_DRAFT_RESUME');
    const resumed=ui.suspend(()=>buyer.interactive());await new Promise(r=>setTimeout(r,1200));await buyer.workspace();await resumed;
    assert.equal(coordinator.lastAck.draftHash,draftHash,'draft survives same-process Continue');assert.equal(coordinator.lastAck.agentId,agentId,'agent remains identical');
  }
  assert.ok(dispatches>=3,'guest harness dispatched structured inference');const saved=await buyer.save();assert.equal(saved.resumeId,id);const state=JSON.parse(await readFile(join(homedir(),'.adr-v2','profiles',profile,'coding',id,'state.json'),'utf8'));assert.ok(Object.keys(state.resources).length>0,'private context must contain session records');
  if(idle){const started=Date.now();statusUnavailable=true;await assert.rejects(buyer.status(),e=>e.status===503);await new Promise(r=>setTimeout(r,35000));assert.ok(runtime.owned.size>0,'503 status polling must not remove the VM');assert.equal(buyer.lifecycle.paused,true);statusUnavailable=false;await buyer.status();assert.equal(buyer.lifecycle.paused,false);await new Promise(r=>setTimeout(r,Math.max(1,660000-(Date.now()-started))));assert.equal(dispatches,3,'idle never replays inference');await buyer.status();await buyer.save();const last=await readFile(join(homedir(),'.adr-v2','profiles',profile,'coding',id,'state.json'));const read=runtime.readCheckpoint.bind(runtime);runtime.readCheckpoint=async()=>{throw Object.assign(Error('synthetic'),{code:'runtime_command_failed'});};await assert.rejects(buyer.save(),/synthetic/);runtime.readCheckpoint=read;assert.deepEqual(await readFile(join(homedir(),'.adr-v2','profiles',profile,'coding',id,'state.json')),last);await buyer.save();console.log(JSON.stringify({status:'passed',idleSeconds:Math.floor((Date.now()-started)/1000),checkpointFailurePreserved:true,statusOutageRecovered:true,paidInference:false}));}
  const applied=await buyer.apply();assert.equal(applied.status,'applied');assert.equal(await readFile(join(root,'index.html'),'utf8'),'<body style="background:blue">synthetic website</body>\n');assert.equal(await readFile(join(root,'denied.txt'),'utf8'),'unchanged');assert.equal(await readFile(join(root,'bom.txt'),'utf8'),'\ufeffsynthetic UTF-8 BOM\n');assert.equal(await readFile(join(root,'main.py'),'utf8'),'print("after")\n');assert.equal(await readFile(join(root,'added.py'),'utf8'),'assert 2 + 2 == 4\n');await assert.rejects(readFile(join(root,'remove.txt')));
  const guest=[...runtime.owned][0];
  await runtime.run(guest,['node','-e',`require('node:fs').writeFileSync('/workspace/main.py','print("after teardown")\\n')`]);
  await buyer.save();await buyer.close();assert.equal(stops,1);
  const offlineApplied=await buyer.apply();assert.equal(offlineApplied.status,'applied');assert.equal(await readFile(join(root,'main.py'),'utf8'),'print("after teardown")\n');
  // Review and Apply still work after the ownership-enforced VM removal.
  assert.equal((await buyer.apply()).status,'unchanged');
  const {openSavedCodingWork}=await import(entry('saved-work.mjs'));
  const stoppedWork=await openSavedCodingWork(profile,id,{approve:async()=>true});assert.equal((await stoppedWork.apply()).status,'unchanged');
  const oldDispatches=dispatches;session={...session,id:randomUUID(),state:'ready',requestSequence:0};
  buyer=await openCodingBuyer(network,session.id,{root,files:['added.py','bom.txt','denied.txt','index.html','large.txt','main.py'],trusted:true,runtime,profile,resumeId:id,approve:async()=>true});assert.equal(dispatches,oldDispatches,'resume does not replay inference');await buyer.interactive({prompt:'Synthetic resumed follow-up.',mode:'print',consoleOptions:{stdio:['ignore','ignore','inherit']}});assert.equal(dispatches,oldDispatches+1);await buyer.close();assert.equal(stops,2);console.log(JSON.stringify({status:'passed',platform:'darwin-arm64',dispatches,approvals,guestTools:true,reviewedApply:true,privateSave:true,resumeNoReplay:true,teardown:true,paidInference:false}));
  }
}finally{ui?.stop();await buyer?.close();await rm(root,{recursive:true,force:true});await rm(join(homedir(),'.adr-v2','profiles',profile),{recursive:true,force:true});}
