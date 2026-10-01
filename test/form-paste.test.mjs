import test from 'node:test';
import assert from 'node:assert/strict';
import { PassThrough } from 'node:stream';
import { TerminalUI } from '../src/tui-screen.mjs';
const tick=()=>new Promise(r=>setTimeout(r,1));
function fixture(){
  const input=new PassThrough(),output=new PassThrough();let rendered='';
  input.isTTY=output.isTTY=true;input.setRawMode=v=>input.isRaw=v;output.columns=90;output.rows=24;output.on('data',b=>rendered+=b);
  const ui=new TerminalUI({input,output,color:false,reducedMotion:true});ui.start();
  return {input,ui,text:()=>rendered};
}
const field={name:'root',label:'Project directory',maxLength:4096};
const pasted=value=>'\x1b[200~'+value+'\x1b[201~';

for(const bracketed of [false,true])test(`project path paste preserves ordinary characters and spaces (${bracketed?'bracketed':'plain'})`,async()=>{
  const {input,ui,text}=fixture();const values={root:'/old/project'};
  try{
    const form=ui.form('Choose a project',[field],values);const path='/tmp/my project-1/sub_dir.index';
    input.write(bracketed?pasted(path):path);input.write('\r\r');assert.deepEqual(await form,{root:path});assert.equal(values.root,path);
    assert.ok(text().includes('\x1b[?2004h'));assert.ok(text().includes('\x1b[?2004l'));
  }finally{ui.stop();}
});

test('fragmented bracketed path paste strips terminal line endings without advancing or submitting',async()=>{
  const {input,ui}=fixture();let finished=false;
  try{
    const form=ui.form('Choose a project',[field],{root:'/old'}).then(v=>{finished=true;return v;});
    for(const part of ['\x1b[20','0~','/tmp/my ','project','\r','\n','\x1b[20','1~']){input.write(part);await tick();}
    assert.equal(finished,false);input.write('/child');input.write('\r');await tick();assert.equal(finished,false);input.write('\r');assert.equal((await form).root,'/tmp/my project/child');
  }finally{ui.stop();}
});

test('paste appends after typed text, field limits and cancel preserve editable draft',async()=>{
  const {input,ui,text}=fixture();const values={root:'/old'};
  try{
    const form=ui.form('Choose a project',[{...field,maxLength:12}],values);input.write('/tmp/');input.write(pasted('abcdefghijk'));input.write('\x1b');
    assert.equal(await form,null);assert.equal(values.root,'/tmp/abcdefg');assert.ok(text().endsWith('\x1b[?2004l'));
  }finally{ui.stop();}
});

test('internal multiline and escape content in paste cannot navigate, execute or approve',async()=>{
  const {input,ui}=fixture();let finished=false;
  try{
    const form=ui.form('Choose a project',[field],{root:'/safe'}).then(v=>{finished=true;return v;});
    input.write(pasted('/tmp/path\nother'));input.write(pasted('/tmp/path\x1b[13;1u'));await tick();assert.equal(finished,false);input.write('\r\r');assert.equal((await form).root,'/safe');
    const approval=ui.menu('Approve this action once?',[{value:false,label:'Deny'},{value:true,label:'Allow once'}]);input.write(pasted('Allow once\r'));await tick();input.write('\r');assert.equal(await approval,false);
  }finally{ui.stop();}
});

test('ordinary typed menu filtering and numeric field input are retained',async()=>{
  const {input,ui,text}=fixture();
  try{
    const menu=ui.menu('Choose',[{value:1,label:'One'},{value:2,label:'Two'}]);input.write('Two');assert.ok(text().includes('Filter: Two'));input.write('\r');assert.equal(await menu,2);
    const form=ui.form('Limit',[{name:'limit',label:'Limit',default:'100',validate:v=>/^\d+$/.test(v)?'':'integer'}]);input.write('1024\r\r');assert.equal((await form).limit,'1024');
  }finally{ui.stop();}
});
