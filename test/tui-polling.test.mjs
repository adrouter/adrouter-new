import test from 'node:test';
import assert from 'node:assert/strict';
import {PassThrough} from 'node:stream';
import {setTimeout as delay} from 'node:timers/promises';
import {pathToFileURL} from 'node:url';
import {join} from 'node:path';
const moduleUrl=name=>process.env.ADR_ACCEPTANCE_CLIENT_ROOT?pathToFileURL(join(process.env.ADR_ACCEPTANCE_CLIENT_ROOT,'src',name)):new URL('../src/'+name,import.meta.url);
const {TerminalUI}=await import(moduleUrl('tui-screen.mjs'));
const {pollLiveMenu}=await import(moduleUrl('tui-polling.mjs'));
const {providerRow}=await import(moduleUrl('model-status.mjs'));
const intervalMs=process.env.ADR_POLLING_REAL_INTERVAL==='1'?5000:20;
async function until(check,timeout=15000){const end=Date.now()+timeout;while(!check()){if(Date.now()>end)throw Error('poll_fixture_timeout');await delay(5);}}
function fixture(columns=80){
 const input=new PassThrough(),output=new PassThrough();input.isTTY=output.isTTY=true;input.setRawMode=value=>{input.isRaw=value;};output.columns=columns;output.rows=24;
 let text='';output.on('data',b=>{text=(text+b).slice(-100000);});
 const ui=new TerminalUI({input,output,color:false,reducedMotion:true});ui.start();
 return {ui,get text(){return text;},close(){ui.stop();input.destroy();output.destroy();}};
}
for(const width of [40,80,132])test(`background polling leaves the real ${width}-column menu in control and preserves focus`,async()=>{
 const f=fixture(width);let calls=0,active=0,maximum=0,tasks=0;
 const task=f.ui.task.bind(f.ui);f.ui.task=(...args)=>{tasks++;return task(...args);};
 const load=async()=>{calls++;active++;maximum=Math.max(maximum,active);await delay(8);active--;return {revision:calls};};
 const menu=pollLiveMenu(f.ui,'My provider listings',load,value=>[
  ...(value.revision>1?[{value:'new',label:'Another provider'}]:[]),{value:'provider',label:'DeepSeek · 2/2 available'},
  {value:'refresh',label:'Refresh',action:true},{value:'back',label:'Back',action:true}],{intervalMs});
 try{
  await until(()=>!!f.ui.pending?.redraw);const owner=f.ui.pending;f.ui.onKey('',{name:'down'});
  await until(()=>calls>=3&&active===0,intervalMs*4+1000);
  assert.equal(f.ui.pending,owner);assert.equal(tasks,1);assert.equal(maximum,1);
  assert.doesNotMatch(f.text,/Status refresh failed|terminal_operation_busy/);
  f.ui.onKey('',{name:'return'});assert.equal(await menu,'refresh');
 }finally{f.close();await menu;}
});
test('real transport failures become Unknown without falsely reporting zero available models',async()=>{
 const f=fixture();let calls=0;
 const model={model:'deepseek-flash',qualification:'passed',availability:'available',confirmedAt:Date.now(),leaseUntil:Date.now()+30000};
 const node={id:'fixture',name:'DeepSeek',ready:true,models:['deepseek-flash'],modelStatuses:[model]};
 const menu=pollLiveMenu(f.ui,'My providers',async()=>{if(++calls>1)throw Error('synthetic transport');return node;},(value,stale)=>[{value:'provider',label:providerRow(value,{stale})},{value:'back',label:'Back',action:true}],{intervalMs:20});
 try{await until(()=>f.text.includes('Status refresh failed'));assert.match(f.text,/Unknown\/1 available/);assert.doesNotMatch(f.text,/0\/1 available/);f.ui.pending.resolve(null);await menu;}finally{f.close();}
});
test('leaving the menu aborts its outstanding read and ignores the obsolete result',async()=>{
 const f=fixture();let calls=0,aborted=false;
 const load=signal=>++calls===1?Promise.resolve([]):new Promise((resolve,reject)=>signal.addEventListener('abort',()=>{aborted=true;reject(signal.reason);},{once:true}));
 const menu=pollLiveMenu(f.ui,'Providers',load,()=>[{value:'back',label:'Back',action:true}],{intervalMs:20});
 try{await until(()=>calls===2);f.ui.pending.resolve(null);await menu;await until(()=>aborted);assert.equal(f.ui.pending,null);const before=calls;await delay(50);assert.equal(calls,before);}finally{f.close();}
});
