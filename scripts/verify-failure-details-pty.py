"""Installed terminal details/export at three widths; synthetic metadata only."""
import os, json, pty, subprocess, select, time, fcntl, termios, struct, tempfile, shutil
from pathlib import Path
root=str(Path(os.environ['ADR_ACCEPTANCE_CLIENT_ROOT']).resolve())
code=r'''
import {pathToFileURL} from 'node:url';
const {runTui}=await import(pathToFileURL(process.argv[1]+'/src/tui.mjs'));
const id='00000000-0000-4000-8000-000000000001',run='00000000-0000-4000-8000-000000000002',request='00000000-0000-4000-8000-000000000003';
const failureDiagnostic={schemaVersion:1,requestId:request,sessionId:id,providerRunId:run,model:'deepseek-flash',api:'openai-completions',phase:'tunnel',code:'upstream_failed_outcome_unknown',elapsedMs:27,statusCode:null,transportCategory:'dns',transportCode:'ENOTFOUND',dispatchEvidence:'outcome_unknown',responseEvidence:'not_observed',timeline:[{phase:'preparation',elapsedMs:0},{phase:'tunnel',elapsedMs:20}]};
const session={id,state:'settlement_pending',executionState:'stopped',cleanupState:'succeeded',accountingState:'pending_reconciliation',stoppedAt:Date.now(),expiresAt:Date.now()+3600000,funded:'100',reserved:'1',charged:'0',refunded:'99',listingId:run,failureDiagnostic};
let reads=0,mutations=0;
const network={local:true,origin:'http://127.0.0.1:9',request:async(path,options={})=>{reads++;if(options.method&&options.method!=='GET'){mutations++;throw Error('mutation_forbidden');}if(path==='/v2/network/config')return {capabilities:[],privateRehearsal:true};if(path==='/v2/sessions')return [session];if(path==='/v2/sessions/'+id)return session;throw Error('unexpected_read');}};
await runTui({}, {network,store:{profile:'buyer',directory:async()=>process.argv[2]}});
console.log('ADR_DETAILS_RESULT='+JSON.stringify({reads,mutations}));
'''
for width in [40,80,132]:
 directory=tempfile.mkdtemp(prefix='adr-details-',dir='/private/tmp');master,slave=pty.openpty();fcntl.ioctl(slave,termios.TIOCSWINSZ,struct.pack('HHHH',30,width,0,0));before=termios.tcgetattr(slave)
 child=subprocess.Popen(['node','--input-type=module','-e',code,root,directory],stdin=slave,stdout=slave,stderr=slave,env={**os.environ,'TERM':'xterm-256color','NO_COLOR':'1','ADR_REDUCED_MOTION':'1'},start_new_session=True)
 captured=bytearray()
 def pump(seconds):
  end=time.monotonic()+seconds
  while time.monotonic()<end:
   if select.select([master],[],[],.05)[0]:
    try:captured.extend(os.read(master,65536))
    except OSError:return
 def wait_for(value):
  end=time.monotonic()+10
  while value not in captured:
   if time.monotonic()>end:raise RuntimeError('details_screen_timeout:'+value.decode())
   pump(.05)
 try:
  wait_for(b'What would you like to do?');os.write(master,b'My sessions\r');pump(.3);os.write(master,b'00000000\r');wait_for(b'Test-credit session');os.write(master,b'Failure details\r');wait_for(b'Failure details');pump(.3);os.write(master,b'Export private diagnostic JSON\r');wait_for(b'Private diagnostic export');pump(.3)
  exports=list(Path(directory,'failure-exports').glob('*.json'));assert len(exports)==1
  value=json.loads(exports[0].read_text());assert value['failureDiagnostic']['requestId']=='00000000-0000-4000-8000-000000000003';assert 'funded' not in json.dumps(value) and 'charged' not in json.dumps(value);assert exports[0].stat().st_mode&0o777==0o600
  os.write(master,b'\x1b');pump(.2);os.write(master,b'\x1b');pump(.2);os.write(master,b'\x1b');pump(.2);os.write(master,b'\x1b');pump(.2);os.write(master,b'Exit\r');wait_for(b'ADR_DETAILS_RESULT=');child.wait(timeout=5)
  assert child.returncode==0 and b'"mutations":0' in captured and termios.tcgetattr(slave)==before
  print(json.dumps({'caseId':'failure-details-pty','width':width,'status':'passed','installed':True,'detailsNavigation':True,'privateExport':True,'financialDataExcluded':True,'terminalRestored':True,'paidInference':False}),flush=True)
 finally:
  if child.poll() is None:child.terminate();child.wait(timeout=5)
  os.close(master);os.close(slave);shutil.rmtree(directory)
