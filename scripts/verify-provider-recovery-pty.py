"""Exact installed listing deletion and actionable recovery-error screens."""
import os,json,pty,subprocess,select,time,fcntl,termios,struct,re
from pathlib import Path
root=str(Path(os.environ['ADR_ACCEPTANCE_CLIENT_ROOT']).resolve())
code=r'''
import {pathToFileURL} from 'node:url';import {randomUUID} from 'node:crypto';
const {runTui}=await import(pathToFileURL(process.argv[1]+'/src/tui.mjs'));
const {TerminalUI}=await import(pathToFileURL(process.argv[1]+'/src/tui-screen.mjs'));
const scenario=process.argv[2],id=randomUUID(),node={id,name:'Synthetic old provider',status:'paused',availability:'hot',ready:false,leaseUntil:0,model:'synthetic',cleanupState:'succeeded'};
const config={protocol:'2.0.0',product:'adr-v2',settlement:'test_credits',cashValue:false,admissions:false,privateRehearsal:true,privateOwnerEvaluation:true,supplyClasses:['authorized_api','self_hosted'],connectorProfile:'inference_connector_v1',maxNodeSessions:1,relay:'wss_single_instance',agentExecution:'buyer_vm_v1',capabilities:['allowance_v1','provider_budget_v1','cold_activation_v1'],activationDeadlineSeconds:120};
let deleted=false,homes=0,lists=0,managed=0,posts=0;
const network={local:true,origin:'http://127.0.0.1:9',request:async(path,options={})=>{
 if(options.method==='POST'){posts++;if(scenario==='deleted'){deleted=true;return {id,status:'deleted',cleanupState:'succeeded',deletedAt:1};}node.cleanupState='pending';node.retirementRequestedAt=1;return {id,status:'paused',cleanupState:'pending'};}
 if(path.endsWith('/network/config'))return config;if(path==='/v2/providers/nodes')return deleted?[]:[node];
 if(path.endsWith('/'+id)||path.endsWith('/'+id+'?view=diagnostics'))return node;
 if(path.endsWith('/providers/budget'))return {remainingMicrousd:'0',outstandingMicrousd:'0'};
 throw Object.assign(Error('synthetic'),{code:'network_unavailable_outcome_unknown'});
}};
const ui=new TerminalUI({color:false}),menu=ui.menu.bind(ui),page=ui.page.bind(ui);
ui.menu=(title,items,options)=>{
 let value;if(title==='What would you like to do?')value=homes++===0?'providers':'exit';else if(title==='My provider listings')value=lists++===0?id:'back';else if(title===node.name)value=managed++===0?'delete':'back';else if(title==='Delete paused listing?')value=true;else throw Error('unexpected_pty_menu');
 const back=i=>i.value==='back'||i.label==='Back';const visible=[...items.filter(i=>!back(i)&&!i.action),...items.filter(i=>back(i)||i.action)];const index=visible.findIndex(i=>i.value===value);if(index<0||visible[index].disabled)throw Error('pty_action_unavailable');
 process.stdout.write('\nADR_PICK '+JSON.stringify({index})+'\n');return menu(title,items,options);
};
ui.page=(title,lines,options)=>{if(title==='Could not continue'&&scenario==='missing_evidence'&&(!lines.join(' ').includes('ownership could not be verified')||!lines.join(' ').includes('Marketplace operator')))throw Error('recovery_guidance_missing');process.stdout.write('\nADR_PAGE\n');return page(title,lines,options);};
await runTui({}, {ui,network,store:{profile:'provider'}});if(posts!==1)throw Error('delete_repeated');console.log('ADR_RECOVERY_PASSED');
'''
for width in [40,80,132]:
 for scenario in ['deleted','missing_evidence']:
  master,slave=pty.openpty();fcntl.ioctl(slave,termios.TIOCSWINSZ,struct.pack('HHHH',34,width,0,0));before=termios.tcgetattr(slave)
  child=subprocess.Popen(['node','--input-type=module','-e',code,root,scenario],stdin=slave,stdout=slave,stderr=slave,env={**os.environ,'TERM':'xterm-256color','NO_COLOR':'1','ADR_REDUCED_MOTION':'1'},start_new_session=True)
  captured=bytearray();offset=0;deadline=time.monotonic()+30
  def pump(seconds):
   end=time.monotonic()+seconds
   while time.monotonic()<end:
    if select.select([master],[],[],.05)[0]:
     try:captured.extend(os.read(master,65536))
     except OSError:return
  try:
   while child.poll() is None and time.monotonic()<deadline:
    pump(.1);data=bytes(captured);match=re.search(rb'ADR_PICK (\{[^\r\n]+\})|ADR_PAGE',data[offset:])
    if not match:continue
    offset+=match.end();pump(.2)
    if match.group(1):
     choice=json.loads(match.group(1));os.write(master,b'\x1b[B'*choice['index']+b'\r')
    else:os.write(master,b'\r')
   child.wait(timeout=3);pump(.1)
   text=' '.join(re.sub(r'\x1b\[[0-?]*[ -/]*[@-~]','',captured.decode(errors='replace')).split())
   assert child.returncode==0 and 'ADR_RECOVERY_PASSED' in text, 'recovery_pty_failed'
   assert ('Listing deleted' in text) if scenario=='deleted' else ('Could not continue' in text)
   assert termios.tcgetattr(slave)==before,'terminal_modes_not_restored'
   print(json.dumps({'caseId':'provider-recovery-pty','width':width,'scenario':scenario,'status':'passed','installed':True,'terminalRestored':True,'paidInference':False}),flush=True)
  finally:
   if child.poll() is None:
    child.kill();child.wait(timeout=5)
   os.close(master);os.close(slave)
