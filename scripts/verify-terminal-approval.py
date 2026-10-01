import os,pty,termios,fcntl,struct,subprocess,select,time,json,sys
master,slave=pty.openpty();fcntl.ioctl(slave,termios.TIOCSWINSZ,struct.pack('HHHH',28,110,0,0));before=termios.tcgetattr(slave)
p=subprocess.Popen(['node','scripts/verify-terminal-approval.mjs'],stdin=slave,stdout=slave,stderr=slave,env={**os.environ,'TERM':'xterm-256color'},close_fds=True)
buffer=b'';review_at=None;denied=False;start=time.monotonic()
try:
 while time.monotonic()-start<15:
  if select.select([master],[],[],.05)[0]:
   try:buffer+=os.read(master,65536)
   except OSError:break
  if b'Approve this action once?' in buffer and review_at is None:review_at=time.monotonic();buffer=b''
  if review_at is not None and not denied and time.monotonic()-review_at>2:
   assert b'GUEST_UNTRUSTED_REDRAW' not in buffer,'guest_overwrote_host_review'
   if '--enhanced' in sys.argv:
    for part in [b'\x1b[1;',b'1:1B',b'\x1b[1;1:3B',b'\x1b[1;1:1A',b'\x1b[1;1:3A',b'\x1b[<0;117;17m',b'\x1b[13;1u']:
     os.write(master,part);time.sleep(.01)
   else:os.write(master,b'\r')
   denied=True;buffer=b''
  if p.poll() is not None:break
 code=p.wait(timeout=5)
 assert code==0 and denied,'controlled_pty_approval_failed: code='+str(code)+' reviewSeen='+str(review_at is not None)+' denied='+str(denied)
 assert b'"guestDecisionIgnored":true' in buffer,'missing_approval_result'
 after=termios.tcgetattr(slave)
 if after[3]&getattr(termios,'PENDIN',0):os.write(master,b'\n');after=termios.tcgetattr(slave)
 assert before==after,'terminal_not_restored'
 print(json.dumps({'status':'passed','realControlledPty':True,'guestOutputSuppressed':True,'guestDecisionIgnored':True,'denied':True,'terminalRestored':True,'enhancedKeyboard': '--enhanced' in sys.argv}))
finally:
 if p.poll() is None:p.terminate();p.wait(timeout=5)
 os.close(master);os.close(slave)
