"""Real PTY regression. Only synthetic field values are captured in memory."""
import os,pty,termios,fcntl,struct,subprocess,select,time,json,sys
master,slave=pty.openpty();fcntl.ioctl(slave,termios.TIOCSWINSZ,struct.pack('HHHH',28,110,0,0));before=termios.tcgetattr(slave)
p=subprocess.Popen(['node','scripts/verify-form-paste.mjs'],stdin=slave,stdout=slave,stderr=slave,env={**os.environ,'TERM':'xterm-256color'},close_fds=True)
buffer=b'';stage=0;at=0;start=time.monotonic();plain='--plain' in sys.argv
try:
 while time.monotonic()-start<15:
  if select.select([master],[],[],.02)[0]:
   try:buffer+=os.read(master,65536)
   except OSError:break
  if stage==0 and b'Paste project directory' in buffer:
   assert b'\x1b[?2004h' in buffer,'bracketed_paste_not_enabled'
   path=b'/tmp/synthetic project-1/sub_dir.index'
   if plain:os.write(master,path)
   else:
    for part in [b'\x1b[20',b'0~',path,b'\r\n',b'\x1b[201~']:os.write(master,part);time.sleep(.01)
   stage=1;at=time.monotonic();buffer=b''
  elif stage==1 and time.monotonic()-at>.1:
   assert b'Paste numeric limit' not in buffer,'paste_submitted_form'
   os.write(master,b'\r\r');stage=2;buffer=b''
  elif stage==2 and b'Paste numeric limit' in buffer:
   os.write(master,b'\x1b[200~1024\r\n\x1b[201~');stage=3;at=time.monotonic();buffer=b''
  elif stage==3 and time.monotonic()-at>.1:
   assert b'Paste cannot approve' not in buffer,'numeric_paste_submitted_form'
   os.write(master,b'\r\r');stage=4;buffer=b''
  elif stage==4 and b'Paste cannot approve' in buffer:
   os.write(master,b'\x1b[200~Allow once\r\x1b[201~');stage=5;at=time.monotonic();buffer=b''
  elif stage==5 and time.monotonic()-at>.1:
   assert p.poll() is None,'paste_created_decision'
   os.write(master,b'\r');stage=6
  if p.poll() is not None:break
 assert p.wait(timeout=5)==0 and stage==6,'form_paste_failed'
 after=termios.tcgetattr(slave)
 if after[3]&getattr(termios,'PENDIN',0):os.write(master,b'\n');after=termios.tcgetattr(slave)
 assert before==after,'terminal_modes_not_restored'
 print(json.dumps({'status':'passed','realPty':True,'plainPath':plain,'fragmentedBracketedPath':not plain,'lineEndingsDoNotSubmit':True,'pasteCannotApprove':True,'terminalRestored':True}))
finally:
 if p.poll() is None:p.terminate();p.wait(timeout=5)
 os.close(master);os.close(slave)
