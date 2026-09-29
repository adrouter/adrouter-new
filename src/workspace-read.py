# Anchored directory descriptors prevent symlink/parent substitution during reads.
# Python 3 is checked as a host prerequisite. No shell, environment or key access.
import os, sys, stat, json, base64
root, path, device, inode = sys.argv[1:]
fds = []
try:
    fd = os.open(root, os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW)
    fds.append(fd)
    root_stat = os.fstat(fd)
    if root_stat.st_dev != int(device) or root_stat.st_ino != int(inode): raise ValueError()
    parts = path.split('/')
    if any(p in ('', '.', '..') for p in parts): raise ValueError()
    for part in parts[:-1]:
        fd = os.open(part, os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW, dir_fd=fd)
        fds.append(fd)
    file = os.open(parts[-1], os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK, dir_fd=fd)
    fds.append(file)
    before = os.fstat(file)
    if not stat.S_ISREG(before.st_mode) or before.st_nlink != 1 or before.st_size > 2*1024*1024: raise ValueError()
    data = b''
    while len(data) <= before.st_size:
        part = os.read(file, min(65536, before.st_size + 1 - len(data)))
        if not part: break
        data += part
    after = os.fstat(file)
    current = os.stat(parts[-1], dir_fd=fd, follow_symlinks=False)
    identity = lambda s: (s.st_dev,s.st_ino,s.st_size,s.st_mtime_ns,s.st_ctime_ns)
    if len(data) != before.st_size or identity(before) != identity(after) or identity(after) != identity(current): raise ValueError()
    print(base64.b64encode(data).decode('ascii'))
except Exception:
    sys.exit(1)
finally:
    for fd in reversed(fds): os.close(fd)
