import json,os,pty,select,subprocess,tempfile,threading,time,termios,fcntl,struct
from http.server import BaseHTTPRequestHandler,HTTPServer
# Explicit source or installed-package path; no real profiles are opened.
package=os.environ['ADR_ACCEPTANCE_CLIENT_ROOT']
fixture=tempfile.mkdtemp(prefix='adr-tui-fixture-',dir='/tmp')
config=dict(protocol='2.0.0',product='adr-v2',settlement='test_credits',cashValue=False,admissions=False,privateOwnerEvaluation=True,privateRehearsal=False,supplyClasses=['authorized_api','self_hosted'],connectorProfile='inference_connector_v1',maxNodeSessions=1,relay='wss_single_instance',agentExecution='buyer_vm_v1',capabilities=['allowance_v1','provider_budget_v1','cold_activation_v1','private_owner_evaluation_v1'],activationDeadlineSeconds=120)
class Handler(BaseHTTPRequestHandler):
 def do_GET(self):
  self.send_response(200);self.send_header('content-type','application/json');self.end_headers();self.wfile.write(json.dumps(config).encode())
 def log_message(self,*a): pass
server=HTTPServer(('127.0.0.1',0),Handler);threading.Thread(target=server.serve_forever,daemon=True).start()
script=f"import {{run}} from {json.dumps(package+'/src/cli.mjs')};import {{AuthStore}} from {json.dumps(package+'/src/network.mjs')};await run(['--local','--network','http://127.0.0.1:{server.server_port}','--profile','provider'],{{store:new AuthStore({json.dumps(fixture)},'provider')}});"
master,slave=pty.openpty();fcntl.ioctl(slave,termios.TIOCSWINSZ,struct.pack('HHHH',32,100,0,0));before=termios.tcgetattr(slave)
p=subprocess.Popen(['node','--input-type=module','-e',script],stdin=slave,stdout=slave,stderr=slave,env={'PATH':os.environ['PATH'],'TERM':'xterm-256color'})
captured=b'';stage=0;deadline=time.monotonic()+15
try:
 while time.monotonic()<deadline:
  if select.select([master],[],[],.1)[0]:
   chunk=os.read(master,65536);captured+=chunk
  if stage==0 and b'What would you like to do?' in captured:
   os.write(master,b'\x1b[B'*8+b'\r');stage=1;captured=b''
  elif stage==1 and b'Choose profile' in captured and b'Default' in captured:
   os.write(master,b'\x1b');stage=2;captured=b''
  elif stage==2 and b'What would you like to do?' in captured:
   os.write(master,b'\x1b[B'*8+b'\r');stage=3;captured=b''
  elif stage==3 and b'Choose profile' in captured and b'Default' in captured:
   os.write(master,b'\x1b[B'*3+b'\r');stage=4;captured=b''
  elif stage==4 and b'operator' in captured and b'What would you like to do?' in captured:
   os.write(master,b'\x03');stage=5
  if p.poll() is not None:break
 assert p.wait(timeout=2)==0 and stage==5,'tui_navigation_failed'
 after=termios.tcgetattr(slave);assert before==after,'terminal_modes_not_restored'
 print('Explicit client artifact: actual PTY profile selector, Back/Cancel and terminal restoration passed.')
finally:
 if p.poll() is None:
  p.terminate()
  try:p.wait(timeout=2)
  except subprocess.TimeoutExpired:p.kill();p.wait()
 os.close(master);os.close(slave);server.shutdown()
 import shutil;shutil.rmtree(fixture)
