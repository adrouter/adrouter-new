# Installed macOS TUI acceptance with task-owned synthetic credentials.
# Captured terminal bytes stay in memory; this does not claim hosted approval.
import json, os, pty, select, subprocess, tempfile, time, termios, fcntl, struct, shutil
root=os.environ['ADR_ACCEPTANCE_CLIENT_ROOT']
fixture=tempfile.mkdtemp(prefix='adr-auth-pty-',dir='/tmp')
script="""
import {AuthStore,Network} from ROOT_NETWORK;
import {runTui} from ROOT_TUI;
import {generateKeyPairSync} from 'node:crypto';
const store=new AuthStore(FIXTURE,'provider'),keys=generateKeyPairSync('ed25519');
const id='11111111-1111-4111-8111-111111111111';
await store.write({origin:'https://synthetic.example.test',installation_id:id,scope:'marketplace:provider',expiresAt:1,refreshPending:true,privateKey:keys.privateKey.export({format:'jwk'}),publicKey:keys.publicKey.export({format:'jwk'})});
let recovered=false;
const network=new Network({origin:'https://synthetic.example.test',store,fetcher:async(url,options)=>{
 if(url.endsWith('/installation/reauthorize'))return Response.json({device_code:'adr_dc_'+'d'.repeat(43),user_code:'ABCD-EFGH',verification_uri_complete:'https://approval.example.test/connect?code=ABCD-EFGH',expires_in:60,interval:5});
 if(url.endsWith('/oauth/token')){const body=JSON.parse(options.body);if(body.grant_type==='refresh_token')throw Error('uncertain_refresh_replayed');recovered=true;return Response.json({access_token:'adr_at_'+'a'.repeat(43),refresh_token:'adr_rt_'+'r'.repeat(43),installation_id:id,scope:'marketplace:provider',token_type:'DPoP',client_kind:'marketplace',expires_in:600,refresh_expires_in:86400});}
 if(url.endsWith('/installation/revoke'))return Response.json({status:'revoked',installation_id:id});
 if(url.endsWith('/providers/me'))return Response.json({userId:'synthetic',roles:['provider'],account:{available:'0',held:'0',earned:'0'}});
 if(url.endsWith('/network/config'))return Response.json({protocol:'2.0.0',product:'adr-v2',settlement:'test_credits',cashValue:false,admissions:false,privateOwnerEvaluation:true,privateRehearsal:false,supplyClasses:['authorized_api','self_hosted'],connectorProfile:'inference_connector_v1',maxNodeSessions:1,relay:'wss_single_instance',agentExecution:'buyer_vm_v1',capabilities:['allowance_v1','provider_budget_v1','cold_activation_v1','private_owner_evaluation_v1'],activationDeadlineSeconds:120});
 return Response.json({});
}});
await runTui({profile:'provider'},{store,network});
if(!recovered||(await store.read())!==null||(await store.readSelection())!==network.origin)throw Error('auth_pty_state_mismatch');
console.log('auth_recovery_logout_state_passed');
""".replace('ROOT_NETWORK',json.dumps(root+'/src/network.mjs')).replace('ROOT_TUI',json.dumps(root+'/src/tui.mjs')).replace('FIXTURE',json.dumps(fixture))
master,slave=pty.openpty();fcntl.ioctl(slave,termios.TIOCSWINSZ,struct.pack('HHHH',36,120,0,0));before=termios.tcgetattr(slave)
p=subprocess.Popen(['node','--input-type=module','-e',script],stdin=slave,stdout=slave,stderr=slave,env={'PATH':os.environ['PATH'],'TERM':'xterm-256color'})
stage=0;capture=b'';safari=False;reported=-1;deadline=time.monotonic()+40
try:
 while time.monotonic()<deadline:
  if stage!=reported:print('auth_pty_stage',stage,flush=True);reported=stage
  if select.select([master],[],[],.1)[0]:
   try:capture+=os.read(master,65536)
   except OSError:break
  if stage==0 and b'Sign-in needs attention' in capture:
   os.write(master,b'\x1b[B\r');stage=1;capture=b''
  elif stage==1 and b'ABCD-EFGH' in capture:
   safari=b'Press O to open native Safari' in capture;stage=2
  elif stage==2 and b'What would you like to do?' in capture:
   os.write(master,b'\x1b[B'*4+b'\r');stage=3;capture=b''
  elif stage==3 and b'Account and sign-in' in capture and b'Available:' in capture:
   os.write(master,b'\r');stage=4;capture=b''
  elif stage==3 and b'Account' in capture and b'Available:' in capture:
   os.write(master,b'\r');stage=4;capture=b''
  elif stage==4 and b'Sign out?' in capture:
   # Back is rendered last, but is still the default selected item.
   os.write(master,b'\x1b[A\r');stage=5;capture=b''
  elif stage==5 and b'Sign in to AdRouter' in capture:
   os.write(master,b'\x03');stage=6
  if p.poll() is not None:break
 if p.poll() is None:raise AssertionError('auth_recovery_pty_timeout_at_stage_'+str(stage))
 assert p.returncode==0 and stage==6,'auth_recovery_pty_failed_at_stage_'+str(stage)
 assert safari,'native_safari_handoff_control_missing'
 assert b'auth_recovery_logout_state_passed' in capture,'state_verification_missing'
 assert termios.tcgetattr(slave)==before,'terminal_modes_not_restored'
 print('Installed PTY: uncertain-refresh recovery, Safari handoff control, confirmed logout, network preservation and terminal restoration passed.')
finally:
 if p.poll() is None:
  p.terminate()
  try:p.wait(timeout=3)
  except subprocess.TimeoutExpired:p.kill();p.wait()
 os.close(master);os.close(slave);shutil.rmtree(fixture)
