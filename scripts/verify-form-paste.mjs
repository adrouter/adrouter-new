import assert from 'node:assert/strict';
import { TerminalUI } from '../src/tui-screen.mjs';
const ui=new TerminalUI();ui.start();
try{
  const path=await ui.form('Paste project directory',[{name:'root',label:'Project directory',default:'/old',maxLength:4096}]);
  assert.equal(path.root,'/tmp/synthetic project-1/sub_dir.index');
  const numeric=await ui.form('Paste numeric limit',[{name:'limit',label:'Limit',default:'100',validate:v=>/^\d+$/.test(v)?'':'integer'}]);
  assert.equal(numeric.limit,'1024');
  const allowed=await ui.menu('Paste cannot approve',[{value:false,label:'Deny'},{value:true,label:'Allow once'}]);
  assert.equal(allowed,false);
}finally{ui.stop();}
console.log(JSON.stringify({status:'passed',projectPathPaste:true,numericPaste:true,pasteCannotApprove:true,paidInference:false}));
