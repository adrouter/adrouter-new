import test from 'node:test';
import assert from 'node:assert/strict';
import {EventEmitter} from 'node:events';
import {createServer} from 'node:http';
import xterm from '@xterm/headless';
import {pathToFileURL} from 'node:url';
import {join} from 'node:path';
const installed=process.env.ADR_ACCEPTANCE_CLIENT_ROOT;
const entry=file=>installed?pathToFileURL(join(installed,'src',file)).href:new URL('../src/'+file,import.meta.url).href;
const {TerminalUI,renderScreen,visibleWidth,wrapText}=await import(entry('tui-screen.mjs'));
const {TerminalCoordinator,reviewLines}=await import(entry('terminal-coordinator.mjs'));
const {connectorCatalog,resolveConnector,connectorHeaders}=await import(entry('connectors.mjs'));
const {upstreamBody,upstreamInference}=await import(entry('provider-broker.mjs'));
const {CodingDisplay,codingFooter}=await import(entry('coding-display.mjs'));
const {providerConnectionLabel}=await import(entry('provider-activity.mjs'));
const profiles=connectorCatalog.profiles;
const frame={type:'inference',requestId:'123e4567-e89b-42d3-a456-426614174000',protocol:'coding_v1',messages:[{role:'assistant',content:'',reasoning_content:'synthetic reasoning',tool_calls:[{id:'c',type:'function',function:{name:'read',arguments:'{}'}}]},{role:'tool',content:'synthetic',tool_call_id:'c'}],tools:[{type:'function',function:{name:'read',parameters:{}}}],maxOutputTokens:32,thinking:false,upstreamBudget:{inputBound:10000,reservedMicrousd:'100000',inputMicrousdPerMillion:'1',outputMicrousdPerMillion:'1'}};
test('DeepSeek, MiMo and generic bodies retain exact model, bounded controls and thinking history',()=>{
 for(const profile of profiles){const node={endpoint:'https://synthetic.example.test/v1/chat/completions',model:'Exact-Model',connector:profile};const plain=upstreamBody(node,frame);assert.equal(plain.model,node.model);assert.equal(plain[profile.outputTokenParameter],32);assert.equal('reasoning_content' in plain.messages[0],false);if(profile.thinking==='type'){assert.deepEqual(plain.thinking,{type:'disabled'});assert.equal(upstreamBody(node,{...frame,thinking:true}).messages[0].reasoning_content,'synthetic reasoning');}}
 const custom={...profiles[0],authentication:'x_api_key',outputTokenParameter:'max_completion_tokens',streamingUsage:'native',thinking:'reasoning_effort',reasoningHistory:true};const node={model:'other',connector:custom};assert.equal(resolveConnector(node).authentication,'x_api_key');assert.deepEqual(connectorHeaders(custom,'opaque with spaces'),{'x-api-key':'opaque with spaces'});assert.equal(upstreamBody(node,{...frame,thinking:true}).reasoning_effort,'medium');assert.equal('stream_options' in upstreamBody(node,frame),false);
 for(const connector of [{...custom,version:2},{...custom,authentication:'cookie'},{...custom,headers:{cookie:'bad'}}])assert.throws(()=>resolveConnector({connector}),/unsupported/);
 assert.throws(()=>connectorHeaders(custom,'bad\r\nheader'));assert.throws(()=>upstreamBody({connector:profiles[2]},{...frame,connector:profiles[1]}),/binding_mismatch/);
});
async function fixture(response,run){const seen=[];const server=createServer(async(req,res)=>{let body='';for await(const chunk of req)body+=chunk;seen.push({headers:req.headers,body:JSON.parse(body)});response(res);});server.listen(0,'127.0.0.1');await new Promise(r=>server.once('listening',r));const node={supplyClass:'self_hosted',endpoint:'http://127.0.0.1:'+server.address().port+'/v1/chat/completions',model:'synthetic',connector:profiles[2]};try{await run(node,seen);}finally{await new Promise(r=>server.close(r));}}
test('guest adapters distinguish bounded HTTP failures and never replay inference',async()=>{
 for(const [status,body,code] of [[401,{},'upstream_authentication_failed'],[429,{},'upstream_rate_limited'],[400,{error:{code:'invalid_model'}},'upstream_invalid_model'],[302,{},'upstream_failed_outcome_unknown'],[200,{},'upstream_malformed_response']])await fixture(res=>{res.writeHead(status,{'content-type':'application/json'});res.end(JSON.stringify(body));},async(node,seen)=>{await assert.rejects(upstreamInference(node,'synthetic opaque key',frame),e=>e.code===code);assert.equal(seen.length,1);assert.equal(seen[0].headers['api-key'],'synthetic opaque key');assert.equal(seen[0].headers.authorization,undefined);});
 await fixture(res=>{res.writeHead(200);res.flushHeaders();},async(node,seen)=>{await assert.rejects(upstreamInference(node,'synthetic', {...frame,deadlineUnixMs:Date.now()+40}),e=>e.code==='upstream_timeout');assert.equal(seen.length,1);});
});
test('streamed tools, reasoning and validated usage normalize for all three profiles without duplicate requests',async()=>{
 for(const profile of profiles)await fixture(res=>{res.writeHead(200,{'content-type':'text/event-stream'});res.end('data: '+JSON.stringify({choices:[{delta:{content:'synthetic',tool_calls:[{index:0,id:'c1',type:'function',function:{name:'read',arguments:'{"path":"a.js"}'}}]},finish_reason:'tool_calls'}]})+'\n\ndata: '+JSON.stringify({choices:[],usage:{prompt_tokens:10,completion_tokens:4}})+'\n\ndata: [DONE]\n\n');},async(node,seen)=>{node.connector=profile;const events=[];const result=await upstreamInference(node,'synthetic',frame,undefined,()=>{},e=>events.push(e));assert.equal(result.inputTokens,10);assert.equal(result.outputTokens,4);assert.equal(result.toolCalls[0].function.name,'read');assert.equal(seen.length,1);assert.ok(events.length>1);});
});
function uiFixture(color=true){const input=new EventEmitter();Object.assign(input,{isTTY:true,isRaw:false,readableFlowing:null,isPaused:()=>true,setRawMode(v){this.isRaw=v;},resume(){},pause(){}});const output=new EventEmitter(),chunks=[];Object.assign(output,{isTTY:true,columns:80,rows:24,write(data){chunks.push({data,columns:this.columns,rows:this.rows});}});const ui=new TerminalUI({input,output,color});ui.color=color;return {ui,input,output,chunks};}
async function screen(chunks){const terminal=new xterm.Terminal({cols:80,rows:24,allowProposedApi:true});for(const chunk of chunks){terminal.resize(chunk.columns,chunk.rows);await new Promise(r=>terminal.write(chunk.data,r));}return terminal;}
test('final terminal cells and inverse attributes stay correct through repeated arrows/Tab, expansion, scrolling and resize',async()=>{
 for(const color of [false,true]){
 const f=uiFixture(color),coordinator=new TerminalCoordinator(f.ui);coordinator.attached=true;coordinator.state='coding';coordinator.onData=()=>{};coordinator.setControl(async()=>{});
 const review=coordinator.approve({name:'bash',args:{command:'\tconst 界 = "é 👩‍💻";\n'+Array.from({length:40},(_,i)=>'echo '+i+' OLD_TRAILER').join('\n')},sessionId:'synthetic',root:'/workspace',snapshotRevision:'synthetic'},{expiresAt:Date.now()+10000,digest:'a'.repeat(64)});
 await new Promise(r=>setTimeout(r,10));for(let i=0;i<12;i++)f.ui.onKey('',{name:i%2?'down':'tab'});
 f.ui.onKey('',{name:'down'});f.ui.onKey('',{name:'down'});f.ui.onKey('',{name:'return'});await new Promise(r=>setTimeout(r,10));
 f.ui.onKey('',{name:'pagedown'});f.ui.onKey('',{name:'pagedown'});f.output.columns=46;f.output.rows=18;f.output.emit('resize');f.ui.onKey('',{name:'pageup'});
 const terminal=await screen(f.chunks),lines=Array.from({length:18},(_,i)=>terminal.buffer.active.getLine(terminal.buffer.active.baseY+i)?.translateToString(true)??'');
 assert.equal(lines.filter(l=>l.includes('Deny')).length>=1,true,JSON.stringify(lines));assert.equal(lines.filter(l=>l.includes('Allow once')).length,1);assert.equal(lines.filter(l=>l.includes('Collapse details')).length,1);assert.ok(lines.some(l=>l==='↓'));assert.ok(lines.every(l=>visibleWidth(l)<=46));
 const deny=lines.findIndex(l=>l.includes('› Deny'));assert.ok(deny>=0);assert.equal(Boolean(terminal.buffer.active.getLine(terminal.buffer.active.baseY+deny).getCell(0).isInverse()),color);
 f.ui.onKey('',{name:'return'});assert.equal(await review,false);terminal.dispose();
 }
});
test('cell widths, sidebar details and metadata footer remain safe and readable',()=>{
 for(const width of [1,5,20,80])for(const line of wrapText('界界 é 👩‍💻 long command',width))assert.ok(visibleWidth(line)<=width);
 const rendered=renderScreen({title:'Browse',sidebar:['Marketplace availability','Hot 1'],details:['Context '+Array(30).fill('details').join(' ')],lines:['choice'],footer:'F Full details'},120,24,false);assert.ok(rendered.indexOf('Marketplace availability')<rendered.indexOf('Context'));
 const unsafe=reviewLines({name:'bash',args:{command:'echo \x1b]0;injected\x07'}});assert.ok(unsafe.every(l=>!l.styled.includes('\x1b]')));
 const display=new CodingDisplay({id:'12345678-session',charged:'0'},{name:'Compute',model:'synthetic',inputRate:'1000',outputRate:'2000'});display.complete('one',{inputTokens:10,outputTokens:4});display.complete('one',{inputTokens:10,outputTokens:4});assert.match(codingFooter(display.view(),80),/S 12345678.*Compute\/synthetic.*I 10 O 4/);
});

test('provider status uses current polled readiness and marks unavailable data without cached lease guesses',()=>{
 assert.equal(providerConnectionLabel(null),'unknown availability · last confirmed');
 assert.equal(providerConnectionLabel({stale:true,connectionFresh:true}),'unknown availability · last confirmed');
 assert.equal(providerConnectionLabel({connectionFresh:true}),'fresh');
 assert.equal(providerConnectionLabel({connectionFresh:false}),'offline');
});

test('short resized menus retain the selected action instead of replacing it with overflow arrows',()=>{
 const lines=Array.from({length:100},(_,i)=>({text:`${i===70?'›':' '} session ${i}`,selected:i===70}));
 for(const rows of [5,6,8,10,12,24])for(const columns of [20,48,120]){
  const value=renderScreen({title:'Sessions',lines,focus:70,details:['Session: synthetic','Listing: synthetic','Description '.repeat(40)],footer:'Enter Choose'},columns,rows,false);
  assert.ok(value.includes('› session 70'),`selected action hidden at ${columns}x${rows}`);
  assert.ok(value.split('\r\n').every(line=>visibleWidth(line)<=columns));
 }
});

test('very short approval screens keep the action controls visible',()=>{
 const actions=[{text:'› Deny',selected:true},{text:'  Allow once'},{text:'  Expand details'}];
 for(const rows of [5,6,8,12]){
  const value=renderScreen({title:'Approve',lines:Array.from({length:40},(_,i)=>'preview '+i),actions,focus:20},48,rows,false);
  for(const action of actions)assert.ok(value.includes(action.text.trim()));
  assert.ok(value.split('\r\n').length<=rows-1);
 }
});

test('description starts at the shared divider and never consumes rows with arrow-only markers',()=>{
 for(const rows of [8,24,48])for(const color of [false,true]){
  const rendered=renderScreen({title:'Browse',sidebar:['Status','Hot 1'],details:Array.from({length:100},(_,i)=>'Description '+i),lines:[{text:'› Choose',selected:true}],footer:'Enter Choose',detailFocus:3},120,rows,color).replace(/\x1b\[[0-9;]*m/g,'').split('\r\n');
  const divider=rendered.findIndex(l=>l.startsWith('─'));
  assert.ok(divider>=0);assert.match(rendered[divider],/│ ─+$/);assert.match(rendered[divider+1],/│ Description 3$/);
  assert.ok(rendered.every(l=>!/[│] [↑↓]$/.test(l)));assert.ok(rendered.some(l=>l.includes('› Choose')));assert.ok(rendered.some(l=>l.includes('Enter Choose')));
 }
});
test('Back remains last with one action and with filters that match no actions',async()=>{
 const f=uiFixture();f.ui.start();try{
  for(const options of [[{value:'back',label:'Back'},{value:'start',label:'Start'}],[{value:'one',label:'One'},{value:'back',label:'Back'},{value:'two',label:'Two'}]]){
   const pending=f.ui.menu('Actions',options);assert.match(f.ui.screen.lines.at(-1).text,/Back$/);
   f.ui.onKey('zzzz',{});assert.equal(f.ui.screen.lines.filter(l=>l.text?.includes('Back')).length,1);
   f.ui.onKey('',{name:'return'});assert.equal(await pending,'back');
  }
 }finally{f.ui.stop();}
});

test('Back is last in confirmations while cancellation stays selected by default',async()=>{
 const f=uiFixture();f.ui.start();try{const pending=f.ui.menu('Confirm',[{value:false,label:'Back'},{value:true,label:'Confirm'}]);assert.equal(f.ui.screen.lines.at(-1).text,'› Back');f.ui.onKey('',{name:'return'});assert.equal(await pending,false);}finally{f.ui.stop();}
});


test('narrow description previews use content rows while details remain scrollable',async()=>{
 for(const color of [false,true]){
  const f=uiFixture(color);f.ui.start();try{
   const pending=f.ui.menu('Choose',[{value:'one',label:'One',details:Array.from({length:20},(_,i)=>'Description '+i)},{value:'back',label:'Back'}]);
   f.ui.onKey('',{name:'pagedown'});
   const value=renderScreen(f.ui.screen,80,24,color).replace(/\x1b\[[0-9;]*m/g,'').split('\r\n');
   assert.ok(value.includes('Description 5'));assert.ok(value.includes('Description 6'));assert.ok(value.includes('Description 7'));assert.ok(!value.some(l=>l==='↑'||l==='↓'));
   f.ui.onKey('F',{});assert.equal(f.ui.screen.title,'Full details');f.ui.onKey('F',{});assert.equal(f.ui.screen.title,'Choose');f.ui.onKey('',{name:'escape'});await pending;
  }finally{f.ui.stop();}
 }
});
