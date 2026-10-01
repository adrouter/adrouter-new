"""Task-owned PTY transport. Only the host coordinator interprets control frames."""
import os, sys, json, pty, select, signal, fcntl, termios, struct, subprocess, base64
configuration = json.loads(sys.stdin.readline())
master, slave = pty.openpty()
def resize(columns, rows):
    fcntl.ioctl(master, termios.TIOCSWINSZ, struct.pack('HHHH', rows, columns, 0, 0))
resize(configuration['columns'], configuration['rows'])
child = subprocess.Popen(configuration['command'], stdin=slave, stdout=slave, stderr=slave,
                         env=configuration['environment'], start_new_session=True, close_fds=True)
os.close(slave)
def emit(value):
    sys.stdout.write(json.dumps(value)+'\n'); sys.stdout.flush()
def terminate(*_):
    try: os.killpg(child.pid, signal.SIGKILL)
    except ProcessLookupError: pass
signal.signal(signal.SIGTERM, terminate)
signal.signal(signal.SIGINT, terminate)
buffer = b''
try:
    while True:
        ready, _, _ = select.select([master, sys.stdin.buffer], [], [], .1)
        if master in ready:
            try: data = os.read(master, 65536)
            except OSError: break
            if not data: break
            emit({'output': base64.b64encode(data).decode()})
        if sys.stdin.buffer in ready:
            data = os.read(sys.stdin.fileno(), 65536)
            if not data: terminate(); break
            buffer += data
            if len(buffer) > 262144: terminate(); break
            while b'\n' in buffer:
                line, buffer = buffer.split(b'\n', 1)
                frame = json.loads(line)
                if 'input' in frame: os.write(master, base64.b64decode(frame['input']))
                elif 'columns' in frame:
                    if frame.get('redraw'): resize(max(2, frame['columns']-1), frame['rows'])
                    resize(frame['columns'], frame['rows'])
        if child.poll() is not None and not ready: break
    code = child.wait(timeout=5)
    emit({'exitCode': code if code >= 0 else None, 'signal': signal.Signals(-code).name if code < 0 else None})
finally:
    if child.poll() is None: terminate(); child.wait()
    os.close(master)
