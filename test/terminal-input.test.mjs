import test from 'node:test';
import assert from 'node:assert/strict';
import { PassThrough } from 'node:stream';
import { TerminalUI } from '../src/tui-screen.mjs';
import { terminalInput } from '../src/terminal-input.mjs';

const tick = () => new Promise(resolve => setTimeout(resolve, 1));
function fixture() {
  const input = new PassThrough(), output = new PassThrough(); let rendered = '';
  input.isTTY = output.isTTY = true; input.setRawMode = value => input.isRaw = value;
  output.columns = 100; output.rows = 28; output.on('data', b => rendered += b);
  return { input, output, ui: new TerminalUI({input,output,color:false,reducedMotion:true}), text: () => rendered };
}
const choices = [{value:'deny',label:'Deny'},{value:'allow',label:'Allow once'},{value:'details',label:'Expand details'}];

for (const down of ['\x1b[B','\x1bOB','\x1b[1;1B','\x1b[1;1:1B','\x1b[1;1:2B']) test('approval arrows navigate without filtering: '+JSON.stringify(down), async () => {
  const {input,ui,text}=fixture();ui.start();
  try {
    const pending=ui.menu('Approve this action once?',choices);
    for(const char of down){input.write(char);await tick();}
    input.write('\x1b[1;1:3B');await tick(); // release must not move a second time
    input.write('\x1b[13;1u');
    assert.equal(await pending,'allow');assert.ok(!text().includes('Filter:'));assert.ok(!text().includes('No matching options'));
  } finally {ui.stop();}
});

test('terminal reports never filter or approve; Kitty text, clear and Tab retain their meaning', async () => {
  const {input,ui,text}=fixture();ui.start();
  try {
    const pending=ui.menu('Approve this action once?',choices);
    for(const raw of ['\x1b[?7u','\x1b[0;117;17m','\x1b[<0;117;17m','\x1b[1;1R','\x1b[13;1:3u'])for(const char of raw){input.write(char);await tick();}
    assert.ok(!text().includes('Filter:'));assert.ok(!text().includes('No matching options'));
    input.write('\x1b[97;1u');await tick();assert.ok(text().includes('Filter: a'));
    input.write('\x1b[117;5u');await tick();input.write('\t\r');assert.equal(await pending,'allow');
  } finally {ui.stop();}
});

test('a stopped host decoder neither consumes guest input nor leaks a partial sequence into the next review', async () => {
  const {input,ui}=fixture();ui.start();input.write('\x1b[1;');ui.stop();
  assert.equal(input.listenerCount('data'),0);
  input.resume();const forwarded=[];const guest=b=>forwarded.push(b.toString());input.on('data',guest);input.write('guest');await tick();input.removeListener('data',guest);
  assert.deepEqual(forwarded,['guest']);ui.start();
  try {const pending=ui.menu('Approve this action once?',choices);input.write('\x1b[A\r');assert.equal(await pending,'details');}
  finally {ui.stop();}
});

test('enhanced Ctrl+C and Escape cancel safely, release events never create decisions', async () => {
  for(const key of ['\x1b[99;5u','\x1b[27;1u']){
    const {input,ui}=fixture();ui.start();
    try {const pending=ui.menu('Approve this action once?',choices);input.write(key);assert.equal(await pending,null);}finally{ui.stop();}
  }
  const input=new PassThrough(),events=[];const release=terminalInput(input,(_t,key)=>events.push(key.name));
  input.write('\x1b[1;1:3A\x1b[13;1:3u');await tick();assert.deepEqual(events,[]);release();
});
