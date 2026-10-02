import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, rm } from 'node:fs/promises';
import { join } from 'node:path';
import { tmpdir } from 'node:os';
import { generateKeyPairSync, randomUUID } from 'node:crypto';
import { AuthStore, Network } from '../src/network.mjs';
import { BuyerLifecycle, backgroundOperation } from '../src/buyer-lifecycle.mjs';
import { SandboxRuntime, RuntimeError } from '../src/runtime.mjs';
import { ActionApproval } from '../src/buyer.mjs';
import { summaryLines, MarketplaceDisplay } from '../src/marketplace-display.mjs';
import { PassThrough } from 'node:stream';
import { TerminalUI, renderScreen } from '../src/tui-screen.mjs';
import { TerminalCoordinator } from '../src/terminal-coordinator.mjs';
const delay=ms=>new Promise(r=>setTimeout(r,ms));
test('independent loops continue while a slow status operation waits without overlapping itself',async()=>{
 let resolve,active=0,max=0,touches=0;const status=backgroundOperation(async()=>{active++;max=Math.max(max,active);await new Promise(r=>resolve=r);active--;},5,()=>{}),keepalive=backgroundOperation(async()=>{touches++;},5,()=>{});
 try{await delay(40);assert.equal(max,1);assert.ok(touches>=3);status.stop();resolve();await status.pending;}finally{status.stop();keepalive.stop();}
});
test('first failure and cleanup results retain only sanitized metadata',()=>{
 const l=new BuyerLifecycle();l.event('console',{code:'guest_console_failed',exitCode:1,signal:'SIGTERM',privatePrompt:'synthetic private content'});l.event('cleanup',{code:'cleanup_failed'});assert.equal(l.firstFailure.code,'guest_console_failed');assert.equal(JSON.stringify(l).includes('synthetic private content'),false);assert.equal(l.events.length,2);
});
test('controller reads preserve owned VM; uncertain effectful execution removes it and keeps first error',async()=>{
 const runtime=new SandboxRuntime({executable:'/tmp/msb',library:'/tmp/lib',home:'/tmp/state'}),name='adrnew-'+randomUUID();runtime.owned.add(name);let removes=0;
 runtime.call=async()=>{throw new RuntimeError('runtime_command_failed');};runtime.remove=async()=>{removes++;throw new RuntimeError('cleanup_failed');};
 await assert.rejects(runtime.readCheckpoint(name,['node','-e','synthetic']),/runtime_command_failed/);assert.equal(removes,0);assert.ok(runtime.owned.has(name));await assert.rejects(runtime.run(name,['node','-e','synthetic']),/runtime_command_failed/);assert.equal(removes,1);
});
test('parallel status/profile callers rotate refresh once; cross-process lock wait can be cancelled',async()=>{
 const home=await mkdtemp(join(tmpdir(),'adr-reliability-auth-'));const store=new AuthStore(home);const keys=generateKeyPairSync('ed25519');let refreshes=0,requests=0;
 try{await store.write({origin:'https://example.test',privateKey:keys.privateKey.export({format:'jwk'}),publicKey:keys.publicKey.export({format:'jwk'}),expiresAt:1,refresh_token:'synthetic',installation_id:'synthetic'});const n=new Network({origin:'https://example.test',store,fetcher:async url=>{if(url.endsWith('/token')){refreshes++;await delay(30);return Response.json({access_token:'synthetic',refresh_token:'synthetic-rotated',expires_in:3600});}requests++;return Response.json({ok:true});}});await Promise.all(Array.from({length:5},()=>n.request('/v2/me')));assert.equal(refreshes,1);assert.equal(requests,5);
 let unlock;const locked=store.withLock(()=>new Promise(r=>unlock=r));while(!unlock)await delay(1);const abort=new AbortController();const waiter=new AuthStore(home).withLock(()=>assert.fail('cancelled waiter executed'),{signal:abort.signal});abort.abort();await assert.rejects(waiter,/cancelled/);unlock();await locked;
 }finally{await rm(home,{recursive:true,force:true});}
});
test('one-shot approvals reject altered/reused/expired content and tool identities',()=>{
 const action={sessionId:'s',toolCallId:'t',name:'write',args:{content:'blue'}};const p=new ActionApproval(action),decision={id:p.id,digest:p.digest,allowOnce:true};assert.throws(()=>p.consume({...action,toolCallId:'other'},decision));p.consume(action,decision);assert.throws(()=>p.consume(action,decision));const expired=new ActionApproval(action);expired.expiresAt=1;assert.throws(()=>expired.consume(action,{id:expired.id,digest:expired.digest,allowOnce:true}));
});
test('approval queue defaults to denial, reviews one at a time and offers scrolling details',async()=>{
 let active=0,max=0;const ui={input:{removeListener(){},on(){},setRawMode(){},resume(){}},menu:async()=>{active++;max=Math.max(max,active);await delay(5);active--;return 'deny';}};const c=new TerminalCoordinator(ui);assert.deepEqual(await Promise.all([c.approve({name:'write',args:{content:'blue'}},{expiresAt:Date.now()+10000}),c.approve({name:'bash',args:{command:'pwd'}},{expiresAt:Date.now()+10000})]),[false,false]);assert.equal(max,1);
});
test('unavailable public display retains stale totals; responsive controls outrank sidebar',async()=>{
 const summary={at:Date.now(),totals:Object.fromEntries(['published','hot','cold','immediateHot','coldControlReady','activeServing','capacityHeld','occupied','qualified'].map(k=>[k,k==='published'?125:0])),listings:[]};let fail=false;const lines=[];const n={origin:'synthetic',request:async()=>{if(fail)throw Error();return summary;}};const d=new MarketplaceDisplay(()=>n,v=>lines.push(v));await d.poll();fail=true;await d.poll();assert.ok(lines[1].includes('Published: 125'));assert.ok(lines[1].some(l=>l.includes('STALE')));d.stop();assert.ok(summaryLines(null).includes('Unavailable'));
 const narrow=renderScreen({title:'Approve action',lines:[{text:'Allow once',selected:true}],sidebar:['Marketplace availability']},50,10,false);assert.ok(narrow.includes('Allow once'));assert.ok(!narrow.includes('Marketplace availability'));
});
test('resized import controls and form validation preserve values and focus',async()=>{
 const input=new PassThrough(),output=new PassThrough();input.isTTY=true;input.setRawMode=v=>input.isRaw=v;output.isTTY=true;output.columns=40;output.rows=10;let rendered='';output.on('data',b=>rendered+=b);const ui=new TerminalUI({input,output,color:false,reducedMotion:true});ui.start();
 try{const menu=ui.menu('Project import manifest',[{value:'continue',label:'Continue to import confirmation'},{value:'back',label:'Choose another directory'},{value:'cancel',label:'Cancel'}],{lines:Array(100).fill('fixture metadata')});output.rows=8;output.emit('resize');assert.ok(rendered.includes('Continue to import confirmation'));input.emit('keypress','',{name:'escape'});assert.equal(await menu,null);
 const values={root:'inaccessible'};const form=ui.form('Project',[{name:'root',label:'Project directory',validate:()=> 'Enter a readable directory.'}],values);input.emit('keypress','',{name:'return'});input.emit('keypress','',{name:'return'});assert.ok(rendered.includes('Project directory:'));input.emit('keypress','',{name:'escape'});await form;assert.equal(values.root,'inaccessible');
 }finally{ui.stop();}
});

test('host broker only approves validated completed calls, rejects tampering/reuse and survives transient status',async()=>{
 const {openCodingBuyer}=await import('../src/coding-buyer.mjs');
 const {realpath,writeFile}=await import('node:fs/promises');
 const root=await realpath(await mkdtemp(join(tmpdir(),'adr-broker-fixture-'))),profile='test-'+randomUUID().slice(0,8),id=randomUUID();await writeFile(join(root,'index.html'),'red');
 const images=JSON.parse(await (await import('node:fs/promises')).readFile(new URL('../runtime/guest-images.json',import.meta.url)));
 const session={id,protocol:'coding_v1',state:'ready',handshakeStatus:'succeeded',expiresAt:Date.now()+3600000,requestLimit:100,requestSequence:0,maxOutputTokens:100,contextWindowTokens:32768,model:'synthetic',listingId:randomUUID(),listingRevision:1};
 let configuration,dispatches=0,statusFail=false,approve=0,removes=0;
 const runtime={owned:new Set(),verify:async()=>{},create:async()=>{const name='adrnew-'+randomUUID();runtime.owned.add(name);return name;},run:async(_n,cmd)=>{const match=cmd[2]?.match(/fs.writeFileSync\('\/tmp\/adr-coding.json',("(?:\\.|[^"\\])*"),\{mode:0o600\}\)/);if(match)configuration=JSON.parse(JSON.parse(match[1]));return '';},readCheckpoint:async(_name,cmd)=>JSON.stringify(cmd[2]?.includes('coding-preview')?{before:'red',after:'blue'}:cmd[2]?.includes('workspaceSnapshot')?{files:{'index.html':'blue'},excluded:{}}:{}),touch:async()=>{},inspect:async()=>({config:{manifest_digest:images.coding[`linux-${process.arch}`],mounts:[],network:{policy:{default_egress:'deny'}}}}),remove:async name=>{removes++;runtime.owned.delete(name);}};
 const network={request:async(path)=>{if(path.startsWith('/v2/listings/'))return {id:session.listingId,revision:session.listingRevision,model:session.model,inputRate:'1000',outputRate:'2000'};if(path.endsWith('/stop'))return {...session,state:'settled'};if(path.endsWith('/inference')){dispatches++;return {requestId:randomUUID(),text:'',toolCalls:[{id:'blue',type:'function',function:{name:'write',arguments:'{"path":"index.html","content":"blue"}'}}],usage:{inputTokens:1,outputTokens:1}};}if(statusFail)throw Object.assign(Error('synthetic'),{code:'network_unavailable_outcome_unknown'});return {...session};}};
 let buyer;
 try{buyer=await openCodingBuyer(network,id,{root,files:['index.html'],profile,runtime,approve:async()=>{approve++;return true;},intervals:{status:100000,checkpoint:100000,keepalive:100000}});
 const send=async(path,body)=>{const r=await fetch(configuration.control.replace('host.microsandbox.internal','127.0.0.1')+path,{method:'POST',headers:{authorization:'Bearer '+configuration.capability,'content-type':'application/json'},body:JSON.stringify(body)});return {status:r.status,body:await r.text()};};
 assert.equal((await send('/approval',{name:'write',toolCallId:'invented',args:{path:'index.html',content:'blue'}})).status,400);assert.equal(approve,0);
 statusFail=true;assert.equal((await send('/inference',{})).status,400);assert.equal(dispatches,0);assert.equal(removes,0);assert.equal(buyer.lifecycle.paused,true);statusFail=false;
 assert.equal((await send('/inference',{})).status,200);assert.equal(dispatches,1);
 assert.equal((await send('/approval',{name:'write',toolCallId:'blue',args:{path:'index.html',content:'altered'}})).status,400);assert.equal(approve,0);
 assert.equal((await send('/approval',{name:'write',toolCallId:'blue',args:{path:'index.html',content:'blue'}})).status,200);assert.equal(approve,1);
 assert.equal((await send('/approval',{name:'write',toolCallId:'blue',args:{path:'index.html',content:'blue'}})).status,400);assert.equal(approve,1);
 const first=await buyer.close(),again=await buyer.close();assert.deepEqual(first,again);assert.equal(removes,1);assert.equal(first.firstFailure.code,'network_unavailable_outcome_unknown');
 buyer=await openCodingBuyer(network,id,{root,files:['index.html'],profile,runtime,intervals:{status:100000,checkpoint:100000,keepalive:100000}});
 assert.equal((await send('/inference',{})).status,200);const headless=await send('/approval',{name:'write',toolCallId:'blue',args:{path:'index.html',content:'blue'}});assert.equal(headless.status,400);assert.ok(headless.body.includes('action_approval_required'));assert.equal(buyer.lifecycle.approvalRequired,true);assert.equal(approve,1,'headless request never manufactures a review decision');
 }finally{await buyer?.close();await rm(root,{recursive:true,force:true});await rm(join((await import('node:os')).homedir(),'.adr-v2','profiles',profile),{recursive:true,force:true});}
});

test('terminal restoration and console cleanup never replace the original failure',async()=>{
 const input=new PassThrough(),output=new PassThrough(),ui=new TerminalUI({input,output});ui.stop=()=>{};ui.start=()=>{throw Object.assign(Error('secondary'),{code:'terminal_restore_failed'});};const first=Object.assign(Error('first'),{code:'guest_console_failed'});await assert.rejects(ui.suspend(async()=>{throw first;}),e=>e===first&&e.restorationCode==='terminal_restore_failed');
 const runtime=new SandboxRuntime({executable:'/not-an-executable',library:'/tmp/lib',home:'/tmp/state'}),name='adrnew-'+randomUUID(),events=[];runtime.owned.add(name);runtime.remove=async()=>{throw new RuntimeError('cleanup_failed');};await assert.rejects(runtime.attachConsole(name,['node'],{stdio:'ignore',onOutcome:o=>events.push(o)}),/guest_console_failed/);assert.equal(events[0].code,'guest_console_failed');assert.equal(events.find(e=>e.phase==='guest_removal').code,'cleanup_failed');
});

test('import Back/Esc retains directory, failed paths stay editable and explicit Cancel releases reservation',async()=>{
 const {runTui}=await import('../src/tui.mjs'),{realpath,writeFile}=await import('node:fs/promises');const root=await realpath(await mkdtemp(join(tmpdir(),'adr-import-ui-'))),id=randomUUID();await writeFile(join(root,'index.html'),'synthetic');
 const config={protocol:'2.0.0',product:'adr-v2',settlement:'test_credits',cashValue:false,admissions:false,privateRehearsal:true,privateOwnerEvaluation:true,supplyClasses:['authorized_api','self_hosted'],connectorProfile:'inference_connector_v1',maxNodeSessions:1,relay:'wss_single_instance',agentExecution:'buyer_vm_v1',capabilities:['allowance_v1','provider_budget_v1','cold_activation_v1','coding_v1'],activationDeadlineSeconds:120,codingLimits:{durationSeconds:3600,requestLimit:100}};
 const session={id,protocol:'coding_v1',state:'ready',expiresAt:Date.now()+3600000,requestLimit:100,requestSequence:0,funded:'100',reserved:'0',charged:'0',refunded:'0'};let home=0,detail=0,forms=0,manifests=0,stops=0;const pages=[];
 const ui={start(){},stop(){},task:(_title,work)=>work(new AbortController().signal,()=>{}),page:async(title,lines)=>pages.push({title,lines}),form:async(title,fields,values)=>{assert.equal(title,'Choose a project');if(forms++)assert.ok([root,root+'/missing'].includes(values.root));values.root=forms===1?root+'/missing':root;return {...values};},menu:async(title,options,context)=>{
  if(title==='What would you like to do?')return home++===0?'sessions':'exit';if(title==='My sessions')return id;if(title==='Test-credit session')return detail++===0?'agent':'back';if(title==='Project import manifest'){assert.deepEqual(options.map(o=>o.label),['Continue to import confirmation','Choose another directory','Cancel']);assert.ok(context.lines.some(l=>l.includes(root)));return ['back',null,'continue','cancel'][manifests++];}if(title==='Import this project?')return false;throw Error('unexpected screen');}};
 const network={local:true,origin:'http://127.0.0.1:8790',request:async(path,options={})=>{if(path.endsWith('/network/config'))return config;if(path.endsWith('/listings/summary'))throw Error('synthetic unavailable');if(path.endsWith('/stop')){stops++;return {...session,state:'refunded',refunded:'100'};}if(path==='/v2/sessions')return [session];if(path==='/v2/sessions/'+id)return session;throw Error('unexpected operation');}};
 try{await runTui({}, {ui,network,store:{profile:'buyer'}});assert.equal(stops,1);assert.equal(manifests,4);assert.equal(forms,5);assert.ok(pages.some(p=>p.title==='Project directory needs attention'));assert.ok(pages.some(p=>p.title==='Reservation cancelled'&&p.lines.some(l=>l.includes('Refunded: 100'))));}finally{await rm(root,{recursive:true,force:true});}
});

test('recoverable coding entry/status failures keep the VM and mark accounting unavailable until rechecked',async()=>{
 const {runTui}=await import('../src/tui.mjs'),{realpath,writeFile}=await import('node:fs/promises');const root=await realpath(await mkdtemp(join(tmpdir(),'adr-pause-ui-'))),id=randomUUID();await writeFile(join(root,'index.html'),'synthetic');
 const config={protocol:'2.0.0',product:'adr-v2',settlement:'test_credits',cashValue:false,admissions:false,privateRehearsal:true,privateOwnerEvaluation:true,supplyClasses:['authorized_api','self_hosted'],connectorProfile:'inference_connector_v1',maxNodeSessions:1,relay:'wss_single_instance',agentExecution:'buyer_vm_v1',capabilities:['allowance_v1','provider_budget_v1','cold_activation_v1','coding_v1'],activationDeadlineSeconds:120,codingLimits:{durationSeconds:3600,requestLimit:100}};
 const session={id,protocol:'coding_v1',state:'ready',expiresAt:Date.now()+3600000,requestLimit:100,requestSequence:7,funded:'100',reserved:'1',charged:'7',refunded:'0'};let homes=0,details=0,entries=0,statuses=0,menus=0,closes=0;const pages=[];
 const unavailable=()=>Object.assign(Error('synthetic'),{code:'network_unavailable_outcome_unknown'});
 const buyer={lifecycle:{event(){}},interactive:async()=>{if(entries++===0)throw unavailable();},save:async()=>({resumeId:id,savedAt:Date.now()}),status:async()=>{if(statuses++===0)throw unavailable();return session;},changes:async()=>({changes:[]}),close:async()=>{closes++;return {status:'closed',outcomes:[{phase:'remote_stop',status:'succeeded',session:{...session,state:'settled'}}]};}};
 const ui={start(){},stop(){},suspend:work=>work(),task:(_t,work)=>work(new AbortController().signal,()=>{}),page:async(title,lines)=>pages.push({title,lines}),form:async(_t,_f,values)=>{values.root=root;return values;},menu:async(title,options,context)=>{
  if(title==='What would you like to do?')return homes++===0?'sessions':'exit';if(title==='My sessions')return id;if(title==='Test-credit session')return details++===0?'agent':'back';if(title==='Project import manifest')return 'continue';if(['Import this project?','Launch isolated coding VM?'].includes(title))return true;if(title==='Coding workspace'){assert.equal(closes,0,'recoverable entry must not tear down VM');if(menus++===0){assert.ok(context.lines.some(l=>l.includes('status unavailable')));assert.ok(context.lines.some(l=>l.includes('Dispatches: unavailable')));assert.ok(context.lines.some(l=>l.includes('Charged: unavailable')));return 'continue';}assert.ok(context.lines.some(l=>l.includes('Dispatches: 7/100')));return 'finish';}if(title==='Finish with saved work')return 'save';throw Error('unexpected screen '+title);}};
 const network={local:true,origin:'http://127.0.0.1:8790',request:async path=>{if(path.endsWith('/network/config'))return config;if(path.endsWith('/listings/summary'))throw unavailable();if(path==='/v2/sessions')return [session];if(path==='/v2/sessions/'+id)return session;throw Error('unexpected operation');}};
 try{await runTui({}, {ui,network,store:{profile:'synthetic'},openCodingBuyer:async()=>buyer,savedCodingContexts:async()=>[],pendingApplications:async()=>[]});assert.equal(entries,2);assert.equal(closes,1);assert.ok(pages.some(p=>p.title==='Coding paused'));}finally{await rm(root,{recursive:true,force:true});}
});

test('nested instructions and project-local configuration appear in executable-resource review',async()=>{
 const {projectManifest}=await import('../src/workspace.mjs'),{realpath,writeFile,mkdir}=await import('node:fs/promises');const root=await realpath(await mkdtemp(join(tmpdir(),'adr-resources-fixture-')));
 try{await mkdir(join(root,'src'));await mkdir(join(root,'.adrouter'));await writeFile(join(root,'src','AGENTS.md'),'Synthetic instructions');await writeFile(join(root,'.adrouter','settings.json'),'{}');await writeFile(join(root,'index.html'),'synthetic');const manifest=await projectManifest(root);assert.deepEqual(manifest.files.filter(f=>f.resource).map(f=>f.path),['.adrouter/settings.json','src/AGENTS.md']);}finally{await rm(root,{recursive:true,force:true});}
});

test('binary assets are excluded before import and never decoded into corrupt host changes',async()=>{
 const {projectManifest,importWorkspace}=await import('../src/workspace.mjs'),{realpath,writeFile,readFile}=await import('node:fs/promises');const root=await realpath(await mkdtemp(join(tmpdir(),'adr-binary-fixture-'))),binary=Buffer.from([0x89,0x50,0x4e,0x47,0,0xff]);
 try{await writeFile(join(root,'index.html'),'synthetic UTF-8');await writeFile(join(root,'asset.png'),binary);const manifest=await projectManifest(root);assert.deepEqual(manifest.files.map(f=>f.path),['index.html']);assert.equal(manifest.exclusions.counts.binary,1);await assert.rejects(importWorkspace(root,['asset.png']),/workspace_binary_file_rejected/);assert.deepEqual(await readFile(join(root,'asset.png')),binary);}finally{await rm(root,{recursive:true,force:true});}
});

test('503 status and interrupted response bodies remain recoverable; confirmed auth errors do not',async()=>{
 const {recoverableStatusFailure}=await import('../src/buyer-lifecycle.mjs');
 const service=new Network({origin:'http://127.0.0.1:8790',local:true,fetcher:async()=>Response.json({code:'marketplace_unavailable'},{status:503})});await assert.rejects(service.request('/v2/sessions/synthetic'),e=>e.status===503&&recoverableStatusFailure(e));
 const interrupted=new Network({origin:'http://127.0.0.1:8790',local:true,fetcher:async()=>new Response(new ReadableStream({start(c){c.error(new DOMException('synthetic','AbortError'));}}))});await assert.rejects(interrupted.request('/v2/sessions/synthetic'),e=>e.code==='network_unavailable_outcome_unknown'&&recoverableStatusFailure(e));
 const revoked=new Network({origin:'http://127.0.0.1:8790',local:true,fetcher:async()=>Response.json({code:'installation_revoked'},{status:401})});await assert.rejects(revoked.request('/v2/sessions/synthetic'),e=>e.status===401&&!recoverableStatusFailure(e));
});

test('cancelled late VM creation is awaited and scoped cleanup is retried before startup returns',async()=>{
 const {openCodingBuyer}=await import('../src/coding-buyer.mjs'),{realpath,writeFile}=await import('node:fs/promises');const root=await realpath(await mkdtemp(join(tmpdir(),'adr-startup-cancel-'))),profile='test-'+randomUUID().slice(0,8),id=randomUUID(),abort=new AbortController();await writeFile(join(root,'index.html'),'synthetic');let release,copy,removes=0,stops=0;
 const session={id,protocol:'coding_v1',state:'ready',handshakeStatus:'succeeded',expiresAt:Date.now()+3600000,requestLimit:100,requestSequence:0,maxOutputTokens:100,contextWindowTokens:32768,model:'synthetic',listingId:randomUUID(),listingRevision:1};
 const runtime={owned:new Set(),verify:async()=>{},create:async options=>{copy=options.copyDirectory;const name='adrnew-'+randomUUID();runtime.owned.add(name);await new Promise(r=>release=r);return name;},remove:async name=>{removes++;if(removes===1)throw new RuntimeError('synthetic_cleanup_failure');runtime.owned.delete(name);}};
 const network={request:async path=>{if(path.endsWith('/stop')){stops++;return {...session,state:'settled'};}return session;}};
 let rejected;
 try{const pending=openCodingBuyer(network,id,{root,files:['index.html'],profile,runtime,signal:abort.signal}).catch(e=>{rejected=e;});while(!release)await delay(5);abort.abort();release();await pending;assert.equal(rejected.code,'cancelled');assert.equal(rejected.lifecycleOutcome.firstFailure.code,'cancelled');assert.equal(runtime.owned.size,0);assert.equal(removes,2);assert.equal(stops,1);await assert.rejects((await import('node:fs/promises')).lstat(copy),e=>e.code==='ENOENT');}finally{await rm(root,{recursive:true,force:true});await rm(join((await import('node:os')).homedir(),'.adr-v2','profiles',profile),{recursive:true,force:true});}
});

test('termination cancels a non-cancellable UI task rather than allowing startup to continue',async()=>{
 const input=new PassThrough(),output=new PassThrough();input.isTTY=true;input.setRawMode=v=>input.isRaw=v;output.isTTY=true;output.columns=80;output.rows=24;const ui=new TerminalUI({input,output});ui.start();const pending=ui.task('Startup',signal=>new Promise(resolve=>signal.addEventListener('abort',()=>resolve('cancelled'))),{cancel:false});ui.terminate();assert.equal(await pending,'cancelled');assert.equal(input.isRaw,false);
});

test('hot private compute remains quotable after failed or stale startup policy; real gates explain denial',async()=>{
 const {runTui,quoteAccess}=await import('../src/tui.mjs');const id=randomUUID();
 const config={protocol:'2.0.0',product:'adr-v2',settlement:'test_credits',cashValue:false,admissions:false,privateRehearsal:true,privateOwnerEvaluation:true,supplyClasses:['authorized_api','self_hosted'],connectorProfile:'inference_connector_v1',maxNodeSessions:1,relay:'wss_single_instance',agentExecution:'buyer_vm_v1',capabilities:['allowance_v1','provider_budget_v1','cold_activation_v1','coding_v1'],activationDeadlineSeconds:120,codingLimits:{durationSeconds:3600,requestLimit:100}};
 const listing={id,nodeId:randomUUID(),name:'synthetic hot compute',model:'synthetic',supplyClass:'authorized_api',availability:'hot',inputRate:'1000',outputRate:'1000',rateDenominator:'1000000',connectorProfile:'inference_connector_v1',revision:1,publishedAt:1,ready:true,controlOnline:true,activationDeadlineSeconds:120,evaluation:null};
 assert.equal(quoteAccess(config,listing).disabled,false);assert.match(quoteAccess(null,listing).detail,/policy is unavailable/);assert.match(quoteAccess({...config,privateRehearsal:false},listing).detail,/private buyer rehearsal is not enabled/);assert.match(quoteAccess(config,{...listing,ready:false,availability:'cold'}).detail,/Cold buyer activation/);
 for(const initial of ['failed','disabled']){
  let configs=0,homes=0,browses=0,checked=false,quotes=0;
  const network={local:true,origin:'http://127.0.0.1:8790',request:async(path,options={})=>{if(path.endsWith('/network/config')){configs++;if(configs===1){if(initial==='failed')throw Object.assign(Error('synthetic'),{code:'network_unavailable_outcome_unknown'});return {...config,privateRehearsal:false};}return config;}if(path.endsWith('/listings/summary'))throw Error('unavailable');if(path==='/v2/listings/'+id)return listing;if(path.startsWith('/v2/listings?'))return {listings:[listing],nextCursor:null};if(options.method==='POST'){quotes++;throw Error('no reservation authorized');}throw Error('unexpected request');}};
  const ui={start(){},stop(){},task:(_t,w)=>w(new AbortController().signal,()=>{}),page:async()=>{},menu:async(title,options)=>{if(title==='What would you like to do?')return homes++===0?'browse':'exit';if(title==='Browse available compute')return browses++===0?id:'back';if(title==='Compute details'){const buy=options.find(o=>o.value==='buy');assert.equal(buy.disabled,false);checked=true;return 'back';}throw Error('unexpected screen');}};
  await runTui({}, {ui,network,store:{profile:'buyer'}});assert.equal(checked,true);assert.ok(configs>=3);assert.equal(quotes,0);
 }
});
