"""Actual packaged guest TUI, follow-ups, extended console/VM lifetime, teardown.

Captures only synthetic fixture content in memory. Evidence is aggregate metadata.
"""
import os, pty, termios, subprocess, select, time, json, fcntl, struct
master, slave = pty.openpty();fcntl.ioctl(slave,termios.TIOCSWINSZ,struct.pack('HHHH',32,110,0,0));before=termios.tcgetattr(slave)
duration = 330 if '--long' in __import__('sys').argv else 5
command=['node','scripts/verify-coding-mac.mjs','--pty','--host-approval']
p=subprocess.Popen(command,stdin=slave,stdout=slave,stderr=slave,env={**os.environ,'TERM':'xterm-256color'},close_fds=True)
buffer=b'';answers=0;followups=0;started=time.monotonic();quit_sent=False;ready_at=None;reviews=0;last_review=0
try:
 while time.monotonic()-started<duration+180:
  if select.select([master],[],[],.1)[0]:
   try: buffer+=os.read(master,65536)
   except OSError: break
   if len(buffer)>2*1024*1024:buffer=buffer[-1024*1024:]
  if b'Approve this action once?' in buffer and b'\xe2\x80\xba Deny' in buffer and time.monotonic()-last_review>.3:
   reviews+=1;last_review=time.monotonic()
   if '--enhanced' in __import__('sys').argv:
    sequence=b'\x1b[13;1u' if b'File: denied.txt' in buffer else b'\x1b[1;1:1B\x1b[1;1:3B\x1b[13;1u'
   else:sequence=b'\r' if b'File: denied.txt' in buffer else b'\x1b[B\r'
   os.write(master,sequence);buffer=b''
  if b'Synthetic coding complete.' in buffer:
   answers+=1;buffer=b''
   if ready_at is None:ready_at=time.monotonic()
   if followups<4:
    os.write(master,('Synthetic follow-up %d\r'%(followups+1)).encode());followups+=1
  if ready_at is not None and followups==4 and answers>=5 and time.monotonic()-started>=duration and not quit_sent:
   os.write(master,b'/quit\r');quit_sent=True
  if p.poll() is not None: break
 assert p.wait(timeout=15)==0, 'actual_guest_tui_failed'
 assert reviews>=4,'host_reviews_incomplete'
 assert followups==4 and answers>=5 and quit_sent,'guest_followups_incomplete'
 after=termios.tcgetattr(slave)
 # Darwin sets PENDIN when returning to canonical mode: it is pending-input
 # state, not a terminal mode (Apple sys/termios.h). A fresh synthetic newline
 # exercises the normal kernel retype path before comparing every mode/CC byte.
 pending_retype=bool(after[3] & getattr(termios,'PENDIN',0))
 if pending_retype: os.write(master,b'\n');after=termios.tcgetattr(slave)
 assert before==after,'terminal_modes_not_restored:'+repr([(i,a,b) for i,(a,b) in enumerate(zip(before,after)) if a!=b])
 print(json.dumps({'status':'passed','actualGuestTui':True,'followups':followups,'answers':answers,'elapsedSeconds':round(time.monotonic()-started),'extendedConsole':duration>120,'beyondFiveMinutes':duration>300,'terminalRestored':True,'paidInference':False,'hostInlineReviews':reviews,'pendingInputRetyped':pending_retype,'enhancedKeyboard':'--enhanced' in __import__('sys').argv}))
finally:
 if p.poll() is None:
  p.terminate()
  try:p.wait(timeout=15)
  except subprocess.TimeoutExpired:p.kill();p.wait()
 os.close(master);os.close(slave)
