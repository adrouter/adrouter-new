# Actual foreground PTY acceptance; all capture remains memory-only and synthetic.
import os,pty,select,subprocess,time,termios
master,slave=pty.openpty();before=termios.tcgetattr(slave)
env={k:os.environ[k] for k in ['PATH','ADR_ACCEPTANCE_CLIENT_ROOT','ADR_ACCEPTANCE_RUNTIME_PATHS','ADR_ACCEPTANCE_ROUTER_ROOT'] if k in os.environ}
router=env['ADR_ACCEPTANCE_ROUTER_ROOT']
p=subprocess.Popen([router+'/backend/node_modules/.bin/tsx','scripts/verify-marketplace-continuous-mac.ts'],cwd=router+'/backend',stdin=slave,stdout=slave,stderr=slave,env=env,start_new_session=True)
synthetic=b'synthetic-continuous-key-123456789';capture=b'';key_entries=0;returned=False;reported=set();deadline=time.monotonic()+780
try:
 while time.monotonic()<deadline:
  if select.select([master],[],[],.2)[0]:
   try:chunk=os.read(master,65536)
   except OSError:break
   capture+=chunk
   assert synthetic not in capture,'synthetic_key_echoed'
   if b'Provider API key (hidden' in capture and not key_entries:os.write(master,synthetic+b'\r');key_entries+=1
   if b'Guest is ready. Press Ctrl+D' in capture and not returned:os.write(master,b'\x04');returned=True
   for line in capture.splitlines():
    if line.startswith(b'continuous_') and line not in reported:print(line.decode(),flush=True);reported.add(line)
  if p.poll() is not None:break
 assert p.wait(timeout=3)==0,'continuous_acceptance_failed'
 assert key_entries==1 and returned,'one_key_handoff_missing'
 expected=b'continuous_eleven_minutes_six_requests_one_key_foreground_teardown_passed'
 assert expected in capture,'continuous_gate_missing'
 after=termios.tcgetattr(slave)
 # Darwin marks queued-input retyping as transient PENDIN state after the
 # guest handoff. Complete that pending input event; never reset terminal flags.
 stable_before=list(before);stable_after=list(after)
 stable_before[3]&=~termios.PENDIN;stable_after[3]&=~termios.PENDIN
 assert stable_after==stable_before,'terminal_modes_not_restored'
 if after!=before:
  os.write(master,b'\n');time.sleep(.05)
  assert termios.tcgetattr(slave)==before,'pending_input_state_not_completed'
 print('continuous_pty_one_key_terminal_restoration_passed',flush=True)
finally:
 if p.poll() is None:
  p.terminate()
  try:p.wait(timeout=20)
  except subprocess.TimeoutExpired:p.kill();p.wait()
 os.close(master);os.close(slave)
