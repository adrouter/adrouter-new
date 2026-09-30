# PTY acceptance only. Captured bytes stay in memory and contain synthetic data.
import os, pty, select, signal, subprocess, time, termios
master, slave = pty.openpty()
environment = {k: os.environ[k] for k in ['PATH', 'ADR_ACCEPTANCE_RUNTIME_PATHS', 'ADR_ACCEPTANCE_CLIENT_ROOT'] if k in os.environ}
process = subprocess.Popen(['node', 'scripts/verify-provider-console.mjs'], stdin=slave, stdout=slave, stderr=slave, env=environment, start_new_session=True)
before = termios.tcgetattr(slave)
synthetic = b'synthetic-acceptance-key-123456789'
captured = b''; sent_key = False; sent_return = False
deadline = time.monotonic() + 90
try:
    while time.monotonic() < deadline:
        if select.select([master], [], [], .2)[0]:
            try: chunk = os.read(master, 65536)
            except OSError: break
            if not chunk: break
            captured += chunk
            if b'Provider API key (hidden' in captured and not sent_key:
                os.write(master, synthetic + b'\r'); sent_key = True
            if b'Guest is ready. Press Ctrl+D' in captured and not sent_return:
                os.write(master, b'\x04'); sent_return = True
        if process.poll() is not None: break
    assert process.wait(timeout=3) == 0, 'synthetic_console_process_failed'
    assert sent_key and sent_return, 'guest_console_handoff_missing'
    assert termios.tcgetattr(slave) == before, 'terminal_modes_not_restored'
    assert synthetic not in captured, 'synthetic_key_was_echoed'
    assert b'synthetic_guest_console_and_teardown_passed' in captured, 'teardown_not_verified'
    print('Actual Mac PTY: hidden synthetic guest-only key, Ctrl+D return and owned guest teardown passed.')
finally:
    if process.poll() is None:
        os.killpg(process.pid, signal.SIGTERM)
        try: process.wait(timeout=15)
        except subprocess.TimeoutExpired: os.killpg(process.pid, signal.SIGKILL)
    os.close(master); os.close(slave)
