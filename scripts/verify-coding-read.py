"""Actual read-only guest turn; retain only aggregate assertions as evidence."""
import os, pty, select, subprocess, time, termios, fcntl, struct, tempfile, json, shutil
master, slave = pty.openpty()
fcntl.ioctl(slave, termios.TIOCSWINSZ, struct.pack('HHHH', 32, 110, 0, 0))
before = termios.tcgetattr(slave)
progress_dir = tempfile.mkdtemp(prefix='adr-read-progress-')
progress = progress_dir + '/state.json'
process = subprocess.Popen(['node', 'scripts/verify-coding-mac.mjs', '--read-only', '--pty', '--host-approval'], stdin=slave, stdout=slave, stderr=slave, env={**os.environ, 'TERM': 'xterm-256color', 'ADR_NATIVE_PROGRESS_FILE': progress}, close_fds=True)
captured = b''; completed_at = None; returned = False; started = time.monotonic()
try:
    while time.monotonic() - started < 180:
        if select.select([master], [], [], .1)[0]:
            try: captured += os.read(master, 65536)
            except OSError: break
        assert len(captured) < 2*1024*1024, 'read_capture_limit'
        assert b'Approve this action once?' not in captured, 'automatic_read_requested_approval'
        try:
            with open(progress) as file: dispatches = json.load(file)['dispatches']
        except (FileNotFoundError, ValueError): dispatches = 0
        if dispatches >= 2 and completed_at is None: completed_at = time.monotonic()
        if completed_at and not returned and time.monotonic() - completed_at > 2:
            os.write(master, b'/workspace\r'); returned = True
        if process.poll() is not None: break
    code = process.wait(timeout=5)
    if code:
        for line in captured.splitlines():
            if line.startswith(b'{"nativeAcceptance":'): print(line.decode(), flush=True)
    assert code == 0, 'read_only_native_failed'
    assert returned and b'"filesUnchanged":true' in captured and b'"automaticReads":4' in captured, 'missing_read_assertions'
    after = termios.tcgetattr(slave)
    if after[3] & getattr(termios, 'PENDIN', 0): os.write(master, b'\n'); after = termios.tcgetattr(slave)
    assert before == after, 'read_terminal_not_restored'
    print(json.dumps({'status':'passed','actualGuestReadOnly':True,'automaticReads':4,'approvals':0,'bashCalls':0,'filesUnchanged':True,'terminalRestored':True,'paidInference':False}))
finally:
    if process.poll() is None:
        process.terminate()
        try: process.wait(timeout=15)
        except subprocess.TimeoutExpired: process.kill(); process.wait()
    os.close(master); os.close(slave); shutil.rmtree(progress_dir)
