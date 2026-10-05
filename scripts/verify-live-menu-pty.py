"""Actual terminal input and five-second menu polling; synthetic read-only data."""
import os,sys,json,pty,subprocess,select,time,fcntl,termios,struct,re
from pathlib import Path
root=str(Path(os.environ.get('ADR_ACCEPTANCE_CLIENT_ROOT',Path(__file__).resolve().parents[1])).resolve())
code=r'''
import {pathToFileURL} from 'node:url';
const {runTui}=await import(pathToFileURL(process.argv[1]+'/src/tui.mjs'));
const config={protocol:'2.0.0',product:'adr-v2',settlement:'test_credits',cashValue:false,admissions:false,privateRehearsal:true,privateOwnerEvaluation:true,supplyClasses:['authorized_api','self_hosted'],connectorProfile:'inference_connector_v1',maxNodeSessions:1,relay:'wss_single_instance',agentExecution:'buyer_vm_v1',capabilities:['allowance_v1','provider_budget_v1','cold_activation_v1','single_request_setup_v1','model_status_v1'],activationDeadlineSeconds:120};
let reads=0,mutations=0;
const network={local:true,origin:'http://127.0.0.1:9',request:async(path,options={})=>{
 if(options.method&&options.method!=='GET'){mutations++;throw Error('synthetic_mutation_forbidden');}
 if(path==='/v2/network/config')return config;
 if(path==='/v2/providers/nodes'){reads++;return [{id:'00000000-0000-4000-8000-000000000001',name:'Fixture',ready:true,status:'published',models:['flash','pro'],modelStatuses:['flash','pro'].map(model=>({model,qualification:'passed',availability:'available',reason:'ready',confirmedAt:Date.now(),leaseUntil:Date.now()+30000}))}];}
 if(path==='/v2/listings/summary')return {at:Date.now(),totals:Object.fromEntries(['published','hot','cold','immediateHot','coldControlReady','activeServing','capacityHeld','occupied','qualified'].map(k=>[k,0])),listings:[]};
 throw Error('unexpected_synthetic_read');
}};
await runTui({}, {network,store:{profile:'provider'}});
console.log('ADR_PTY_RESULT='+JSON.stringify({reads,mutations}));
'''
for width in [40,80,132]:
 master,slave=pty.openpty();fcntl.ioctl(slave,termios.TIOCSWINSZ,struct.pack('HHHH',24,width,0,0));original=termios.tcgetattr(slave)
 process=subprocess.Popen(['node','--input-type=module','-e',code,root],stdin=slave,stdout=slave,stderr=slave,env={**os.environ,'TERM':'xterm-256color','NO_COLOR':'1','ADR_REDUCED_MOTION':'1'},start_new_session=True)
 transcript=bytearray()
 def pump(seconds):
  end=time.monotonic()+seconds
  while time.monotonic()<end:
   if select.select([master],[],[],min(.05,max(0,end-time.monotonic())))[0]:
    try:transcript.extend(os.read(master,65536))
    except OSError:return
 def wait_for(value):
  end=time.monotonic()+10
  while value not in transcript:
   if time.monotonic()>end:raise RuntimeError('pty_screen_timeout:'+value.decode())
   pump(.05)
 try:
  wait_for(b'What would you like to do?');os.write(master,b'My provider listings\r');wait_for(b'Select a connection.')
  pump(11)
  assert b'Status refresh failed' not in transcript and b'terminal_operation_busy' not in transcript
  os.write(master,b'\x1b');pump(.3);os.write(master,b'Exit\r');wait_for(b'ADR_PTY_RESULT=');process.wait(timeout=5)
  match=re.search(rb'ADR_PTY_RESULT=(\{[^\r\n]+\})',transcript);result=json.loads(match.group(1));assert result['reads']>=4 and result['mutations']==0 and process.returncode==0
  assert termios.tcgetattr(slave)==original
  print(json.dumps({'case':'installed-live-menu-pty','width':width,'status':'passed','backgroundReads':result['reads']-2,'secondsOpen':11,'terminalRestored':True,'paidInference':False}),flush=True)
 finally:
  if process.poll() is None:process.terminate();process.wait(timeout=5)
  os.close(master);os.close(slave)
