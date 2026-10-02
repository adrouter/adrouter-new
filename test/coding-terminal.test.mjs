import test from 'node:test';
import assert from 'node:assert/strict';
import { EventEmitter } from 'node:events';
import { renderScreen, TerminalUI } from '../src/tui-screen.mjs';
import { TerminalModes, approvalLines } from '../src/terminal-coordinator.mjs';
test('selected details stay immediately above the navigation divider at different sizes',()=>{
 for(const [columns,rows] of [[80,24],[120,40],[48,12]]) {
  const result=renderScreen({title:'Sessions',lines:Array.from({length:100},(_,i)=>`session ${i}`),focus:70,details:['Session: 12345678-1234-1234-1234-123456789abc'],footer:'navigation'},columns,rows,false).split('\r\n');
  assert.match(result.at(-3),/Session: 12345678/);assert.match(result.at(-2),/^─+$/);assert.equal(result.at(-1),'navigation');
 }
});
test('host review borrows the screen and restores guest mouse/paste modes',()=>{
 const input=new EventEmitter();Object.assign(input,{isTTY:true,isRaw:false,readableFlowing:null,isPaused:()=>true,setRawMode(v){this.isRaw=v;},resume(){},pause(){}});
 let output='';const stream=new EventEmitter();Object.assign(stream,{isTTY:true,columns:80,rows:24,write(v){output+=v;}});
 const ui=new TerminalUI({input,output:stream});ui.start({borrowScreen:true});ui.stop();
 assert.doesNotMatch(output,/\x1b\[\?1049[hl]/);
 const modes=new TerminalModes();modes.observe(Buffer.from('\x1b[?100'));modes.observe(Buffer.from('6h\x1b[?2004h\x1b[?25l'));
 assert.match(modes.restore(),/\x1b\[\?1006h/);assert.match(modes.restore(),/\x1b\[\?2004h/);
 assert.equal(input.isRaw,false);
});
test('command approval preserves line breaks and indentation',()=>{
 assert.deepEqual(approvalLines({name:'bash',args:{command:'first\n\tsecond'}}).slice(0,3),['Command:','  first','      second']);
});
