# Actual task-owned PTY/VM gate. Captured bytes and synthetic key stay in memory.
import os, pty, select, subprocess, time, termios, signal
master, slave = pty.openpty()
before = termios.tcgetattr(slave)
env = {k: os.environ[k] for k in ['PATH', 'ADR_ACCEPTANCE_CLIENT_ROOT', 'ADR_ACCEPTANCE_RUNTIME_PATHS', 'ADR_ACCEPTANCE_ROUTER_ROOT', 'ADR_PROVIDER_LIFECYCLE_QUICK'] if k in os.environ}
router = env['ADR_ACCEPTANCE_ROUTER_ROOT']
process = subprocess.Popen([router+'/backend/node_modules/.bin/tsx', 'scripts/verify-marketplace-provider-lifecycle-mac.ts'], cwd=router+'/backend', stdin=slave, stdout=slave, stderr=slave, env=env, start_new_session=True)
synthetic = b'synthetic-lifecycle-key-123456789'
captured = b''; entries = 0; returned = False; reported = set(); deadline = time.monotonic()+1200
try:
    while time.monotonic() < deadline:
        if select.select([master], [], [], .2)[0]:
            try: chunk = os.read(master, 65536)
            except OSError: break
            captured += chunk
            assert len(captured) < 4*1024*1024, 'bounded_capture_exceeded'
            assert synthetic not in captured, 'synthetic_key_echoed'
            if b'Provider API key (hidden' in captured and not entries:
                os.write(master, synthetic+b'\r'); entries += 1
            if b'Guest is ready. Press Ctrl+D' in captured and not returned:
                os.write(master, b'\x04'); returned = True
            for line in captured.splitlines():
                if line.startswith(b'provider_lifecycle_') and line not in reported:
                    print(line.decode(), flush=True); reported.add(line)
        if process.poll() is not None: break
    result = process.wait(timeout=3)
    if result:
        # Only controlled test assertion/error identifiers, never captured frames.
        for line in captured.splitlines():
            if line.startswith((b'Error:', b'AssertionError')):
                print(line.decode()[:160], flush=True)
    assert result == 0, 'provider_lifecycle_native_gate_failed'
    assert entries == 1 and returned, 'one_key_handoff_required'
    assert b'provider_lifecycle_request_cancel_vm_survives_unknown_held' in captured
    after = termios.tcgetattr(slave)
    stable_before = list(before); stable_after = list(after)
    stable_before[3] &= ~termios.PENDIN; stable_after[3] &= ~termios.PENDIN
    assert stable_before == stable_after, 'terminal_modes_not_restored'
    if after != before:
        os.write(master, b'\n'); time.sleep(.05)
        assert termios.tcgetattr(slave) == before, 'pending_input_state_not_completed'
    print('provider_lifecycle_pty_one_key_and_terminal_restoration_passed', flush=True)
finally:
    if process.poll() is None:
        os.killpg(process.pid, signal.SIGTERM)
        try: process.wait(timeout=30)
        except subprocess.TimeoutExpired: os.killpg(process.pid, signal.SIGKILL); process.wait()
    os.close(master); os.close(slave)
