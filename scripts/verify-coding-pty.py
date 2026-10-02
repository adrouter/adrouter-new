"""Actual packaged guest TUI, follow-ups, extended console/VM lifetime, teardown.

Captures only synthetic fixture content in memory. Evidence is aggregate metadata.
"""
import os, pty, termios, subprocess, select, time, json, fcntl, struct, tempfile, shutil
if '--color' in __import__('sys').argv: os.environ.pop('NO_COLOR',None)
master, slave = pty.openpty();fcntl.ioctl(slave,termios.TIOCSWINSZ,struct.pack('HHHH',32,110,0,0));before=termios.tcgetattr(slave)
duration = 330 if '--long' in __import__('sys').argv else 5
command=['node','scripts/verify-coding-mac.mjs','--pty','--host-approval']
progress_dir=tempfile.mkdtemp(prefix='adr-native-progress-');progress_file=progress_dir+'/state.json'
p=subprocess.Popen(command,stdin=slave,stdout=slave,stderr=slave,env={**os.environ,'TERM':'xterm-256color','ADR_NATIVE_PROGRESS_FILE':progress_file},close_fds=True)
buffer=b'';answers=0;followups=0;started=time.monotonic();quit_sent=False;ready_at=None;reviews=0;last_review=0;cycles=0;cycle_requested=False;cycle_sent_at=0;cycle_followup=False;draft_sent=False;draft_at=None;resized=False;mouse_exercised=False;added_style=False;removed_style=False;command_card=False;indented_command=False;last_dispatch=0;cycle_baseline=0
try:
 while time.monotonic()-started<duration+180:
  if select.select([master],[],[],.1)[0]:
   try: buffer+=os.read(master,65536)
   except OSError: break
   added_style=added_style or b'\x1b[32m+print' in buffer
   removed_style=removed_style or b'\x1b[31m-print' in buffer
   command_card=command_card or b'Working directory: /workspace' in buffer
   indented_command=indented_command or b'  python3 added.py' in buffer
   if len(buffer)>2*1024*1024:buffer=buffer[-1024*1024:]
  if b'Approve this action once?' in buffer and b'\xe2\x80\xba Deny' in buffer and time.monotonic()-last_review>.3:
   reviews+=1;last_review=time.monotonic()
   if '--enhanced' in __import__('sys').argv:
    sequence=b'\x1b[13;1u' if b'File: denied.txt' in buffer else b'\x1b[1;1:1B\x1b[1;1:3B\x1b[13;1u'
   else:sequence=b'\r' if b'File: denied.txt' in buffer else b'\x1b[B\r'
   os.write(master,sequence);buffer=b''
  if b'ADR_NATIVE_DRAFT_TEST' in buffer and not draft_sent:
   draft_at=time.monotonic();buffer=b''
  if draft_at is not None and not draft_sent and time.monotonic()-draft_at>.6:
   os.write(master,b'\x1b[200~Synthetic draft line one\nline two\x1b[201~');draft_sent=True
  try:
   with open(progress_file) as progress: dispatched=json.load(progress)['dispatches']
  except (FileNotFoundError,ValueError): dispatched=0
  for cycle in [1,2]:
   marker=('ADR_NATIVE_CONTINUE:%d'%cycle).encode()
   if marker in buffer and cycles<cycle:
    cycles=cycle;cycle_requested=True;cycle_followup=False;cycle_sent_at=time.monotonic();cycle_baseline=dispatched;buffer=b''
  if cycle_requested and not cycle_followup and time.monotonic()-cycle_sent_at>.7:
   os.write(master,('Synthetic Continue cycle %d\r'%cycles).encode());cycle_followup=True
  if cycle_requested and cycle_followup and dispatched>cycle_baseline and time.monotonic()-cycle_sent_at>1.5:
   buffer=b'';os.write(master,b'/workspace\r');cycle_requested=False
  if not cycle_requested and cycles==0 and dispatched>=3 and dispatched>last_dispatch:
   answers+=1;last_dispatch=dispatched;buffer=b''
   if ready_at is None:ready_at=time.monotonic()
   if followups<4:
    if not mouse_exercised:
     os.write(master,b'\x1b[<64;10;5M\x1b[<65;10;5M\x1b[<0;10;5M\x1b[<32;20;5M\x1b[<0;20;5m');mouse_exercised=True
    if not resized:
     fcntl.ioctl(slave,termios.TIOCSWINSZ,struct.pack('HHHH',24,82,0,0));os.kill(p.pid,__import__('signal').SIGWINCH);resized=True
    os.write(master,('Synthetic follow-up %d\r'%(followups+1)).encode());followups+=1
  if ready_at is not None and followups==4 and answers>=5 and time.monotonic()-started>=duration and not quit_sent and cycles==0:
   os.write(master,b'/workspace\r');quit_sent=True
  if p.poll() is not None: break
 assert p.wait(timeout=15)==0, 'actual_guest_tui_failed:'+buffer.decode('utf8','replace')[-6500:]
 assert resized and mouse_exercised,'native_controls_not_exercised'
 assert command_card and indented_command,'formatted_command_not_presented'
 if 'NO_COLOR' not in os.environ: assert added_style and removed_style,'diff_highlighting_not_presented'
 assert draft_sent,'multiline_draft_not_exercised'
 assert cycles==2,'same_process_continue_cycles_missing'
 assert reviews>=4,'host_reviews_incomplete'
 assert followups==4 and answers>=5 and quit_sent,'guest_followups_incomplete'
 after=termios.tcgetattr(slave)
 # Darwin sets PENDIN when returning to canonical mode: it is pending-input
 # state, not a terminal mode (Apple sys/termios.h). A fresh synthetic newline
 # exercises the normal kernel retype path before comparing every mode/CC byte.
 pending_retype=bool(after[3] & getattr(termios,'PENDIN',0))
 if pending_retype: os.write(master,b'\n');after=termios.tcgetattr(slave)
 assert before==after,'terminal_modes_not_restored:'+repr([(i,a,b) for i,(a,b) in enumerate(zip(before,after)) if a!=b])
 print(json.dumps({'status':'passed','actualGuestTui':True,'followups':followups,'answers':answers,'elapsedSeconds':round(time.monotonic()-started),'extendedConsole':duration>120,'beyondFiveMinutes':duration>300,'terminalRestored':True,'paidInference':False,'hostInlineReviews':reviews,'sameProcessContinueCycles':cycles,'multilineDraftPreserved':draft_sent,'resized':resized,'scrollAndSelectionInputExercised':mouse_exercised,'diffGreenRed':added_style and removed_style,'formattedCommandCard':command_card and indented_command,'pendingInputRetyped':pending_retype,'enhancedKeyboard':'--enhanced' in __import__('sys').argv}))
finally:
 if p.poll() is None:
  p.terminate()
  try:p.wait(timeout=15)
  except subprocess.TimeoutExpired:p.kill();p.wait()
 os.close(master);os.close(slave);shutil.rmtree(progress_dir)
