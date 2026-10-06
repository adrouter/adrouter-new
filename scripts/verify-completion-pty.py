"""Installed completion-accounting renderer; synthetic display values only."""
import os, json, pty, subprocess, select, time, fcntl, termios, struct, re
from pathlib import Path

root=str(Path(os.environ['ADR_ACCEPTANCE_CLIENT_ROOT']).resolve())
code=r'''
import {pathToFileURL} from 'node:url';
const {TerminalUI}=await import(pathToFileURL(process.argv[1]+'/src/tui-screen.mjs'));
const {accountingLines}=await import(pathToFileURL(process.argv[1]+'/src/tui.mjs'));
const state=process.argv[2],summary=state==='stop_failed'?null:{state,executionState:'stopped',cleanupState:'succeeded',accountingState:state==='settled'?'settled':'pending_reconciliation',funded:'100',charged:'6',refunded:state==='settled'?'94':'68',reserved:state==='settled'?'0':'26'};
const ui=new TerminalUI({color:false});ui.start();try{await ui.page('Session completion',accountingLines(summary));}finally{ui.stop();}
console.log('ADR_COMPLETION_PASSED');
'''
for width in [40,80,132]:
 for state in ['settled','settlement_pending','stop_failed']:
  master,slave=pty.openpty();fcntl.ioctl(slave,termios.TIOCSWINSZ,struct.pack('HHHH',30,width,0,0));before=termios.tcgetattr(slave)
  child=subprocess.Popen(['node','--input-type=module','-e',code,root,state],stdin=slave,stdout=slave,stderr=slave,env={**os.environ,'TERM':'xterm-256color','NO_COLOR':'1','ADR_REDUCED_MOTION':'1'},start_new_session=True)
  captured=bytearray()
  def pump(seconds):
   end=time.monotonic()+seconds
   while time.monotonic()<end:
    if select.select([master],[],[],.05)[0]:
     try:captured.extend(os.read(master,65536))
     except OSError:return
  try:
   end=time.monotonic()+10
   while b'Session completion' not in captured:
    if time.monotonic()>end:raise RuntimeError('completion_screen_timeout')
    pump(.1)
   pump(.3)
   text=re.sub(r'\x1b\[[0-?]*[ -/]*[@-~]','',captured.decode(errors='replace'))
   # Terminal wrapping may split phrases; inspect normalized visible whitespace.
   text=' '.join(text.split())
   if state=='stop_failed':
    assert 'could not be confirmed' in text and 'My sessions' in text
    assert 'Charged 0' not in text and 'Refunded 0' not in text
   else:
    assert 'Charged 6' in text and ('Refunded 94' if state=='settled' else 'Refunded 68') in text
    assert ('Unresolved liability: 0' if state=='settled' else 'Unresolved liability: 26') in text
    if state=='settlement_pending':assert 'upstream outcome is unresolved' in text
   os.write(master,b'\r');pump(.2);child.wait(timeout=5)
   assert child.returncode==0 and termios.tcgetattr(slave)==before
   print(json.dumps({'caseId':'completion-accounting-pty','width':width,'state':state,'status':'passed','installed':True,'terminalRestored':True,'paidInference':False}),flush=True)
  finally:
   if child.poll() is None:
    child.terminate()
    try:child.wait(timeout=5)
    except subprocess.TimeoutExpired:child.kill();child.wait(timeout=5)
   os.close(master);os.close(slave)
