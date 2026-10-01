"""Actual packaged guest TUI, follow-ups, extended console/VM lifetime, teardown.

Captures only synthetic fixture content in memory. Evidence is aggregate metadata.
"""
import os, pty, termios, subprocess, select, time, json
master, slave = pty.openpty();before=termios.tcgetattr(slave)
duration = 330 if '--long' in __import__('sys').argv else 5
command=['node','scripts/verify-coding-mac.mjs','--pty']
p=subprocess.Popen(command,stdin=slave,stdout=slave,stderr=slave,env={**os.environ,'TERM':'xterm-256color'},close_fds=True)
buffer=b'';answers=0;followups=0;started=time.monotonic();quit_sent=False;ready_at=None
try:
 while time.monotonic()-started<duration+180:
  if select.select([master],[],[],.1)[0]:
   try: buffer+=os.read(master,65536)
   except OSError: break
   if len(buffer)>2*1024*1024:buffer=buffer[-1024*1024:]
  if b'Synthetic coding complete.' in buffer:
   answers+=1;buffer=b''
   if ready_at is None:ready_at=time.monotonic()
   if followups<4:
    os.write(master,('Synthetic follow-up %d\r'%(followups+1)).encode());followups+=1
  if ready_at is not None and followups==4 and answers>=5 and time.monotonic()-started>=duration and not quit_sent:
   os.write(master,b'/quit\r');quit_sent=True
  if p.poll() is not None: break
 assert p.wait(timeout=15)==0, 'actual_guest_tui_failed'
 assert followups==4 and answers>=5 and quit_sent,'guest_followups_incomplete'
 after=termios.tcgetattr(slave)
 assert before==after,'terminal_modes_not_restored'
 print(json.dumps({'status':'passed','actualGuestTui':True,'followups':followups,'answers':answers,'elapsedSeconds':round(time.monotonic()-started),'extendedConsole':duration>120,'beyondFiveMinutes':duration>300,'terminalRestored':True,'paidInference':False}))
finally:
 if p.poll() is None:
  p.terminate()
  try:p.wait(timeout=15)
  except subprocess.TimeoutExpired:p.kill();p.wait()
 os.close(master);os.close(slave)
