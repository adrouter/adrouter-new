"""Hash-bound application using root/directory descriptors, with durable recovery.

Private journal contents are workload data, never release evidence. Every affected
original is checked before the first write and again immediately before replacement.
Recovery reports already completed writes and refuses changed originals.
"""
import os, sys, json, hashlib, base64, stat, uuid

O_DIR = os.O_RDONLY | os.O_DIRECTORY | os.O_NOFOLLOW
def digest(b): return hashlib.sha256(b).hexdigest()
def parts(path):
    values = path.split('/')
    if not path or path.startswith('/') or any(p in ('', '.', '..') or '\\' in p or '\0' in p for p in values): raise ValueError('apply_path_rejected')
    return values
def parent(root, path, create=False):
    values = parts(path); fd = os.dup(root)
    try:
        for p in values[:-1]:
            if create:
                try: os.mkdir(p, 0o700, dir_fd=fd)
                except FileExistsError: pass
            nxt = os.open(p, O_DIR, dir_fd=fd); os.close(fd); fd = nxt
        return fd, values[-1]
    except: os.close(fd); raise
def original(root, change):
    try: fd, name = parent(root, change['path'])
    except FileNotFoundError:
        if change['before'] is None: return None, 0o600
        raise ValueError('apply_conflict')
    try:
        try: f = os.open(name, os.O_RDONLY | os.O_NOFOLLOW | os.O_NONBLOCK, dir_fd=fd)
        except FileNotFoundError:
            if change['before'] is None: return None, 0o600
            raise ValueError('apply_conflict')
        try:
            s = os.fstat(f)
            if not stat.S_ISREG(s.st_mode) or s.st_nlink != 1 or s.st_size > 2097152: raise ValueError('apply_file_rejected')
            data = b''
            while True:
                b = os.read(f, 65536)
                if not b: break
                data += b
                if len(data) > 2097152: raise ValueError('apply_file_rejected')
            return data, stat.S_IMODE(s.st_mode)
        finally: os.close(f)
    finally: os.close(fd)
def save(path, value):
    tmp = path + '.' + str(uuid.uuid4())
    f = os.open(tmp, os.O_WRONLY | os.O_CREAT | os.O_EXCL | os.O_NOFOLLOW, 0o600)
    try: os.write(f, json.dumps(value).encode()); os.fsync(f)
    finally: os.close(f)
    os.replace(tmp, path)
    d = os.open(os.path.dirname(path), O_DIR)
    try: os.fsync(d)
    finally: os.close(d)
def run(request):
    journal = request['journal']; root_path = request['root']
    if os.path.realpath(root_path) != root_path: raise ValueError('apply_root_rejected')
    root = os.open(root_path, O_DIR); s = os.fstat(root)
    if str(s.st_dev) != request['identity']['dev'] or str(s.st_ino) != request['identity']['ino']: raise ValueError('apply_root_changed')
    state = {'schemaVersion':1,'operationId':request['id'],'root':root_path,'status':'preparing','completed':[],'changes':request['changes']}
    if request.get('recover'):
        f=os.open(journal,os.O_RDONLY|os.O_NOFOLLOW)
        try:
            st=os.fstat(f)
            if not stat.S_ISREG(st.st_mode) or st.st_nlink!=1 or st.st_uid!=os.getuid() or st.st_mode & 0o077: raise ValueError('apply_journal_rejected')
            state=json.loads(os.read(f,32*1024*1024))
        finally: os.close(f)
        if state['operationId']!=request['id'] or state['root']!=root_path or state['changes']!=request['changes']: raise ValueError('apply_journal_mismatch')
    try:
        for c in request['changes']:
            parts(c['path']); data, mode = original(root,c); actual = None if data is None else digest(data)
            if c['path'] in state['completed']:
                if actual != c['after']: raise ValueError('apply_recovery_conflict')
            elif actual != c['before']:
                # A crash may occur between rename and the next journal fsync.
                if request.get('recover') and actual==c['after']: state['completed'].append(c['path'])
                else: raise ValueError('apply_conflict')
            if c['content'] is not None and digest(c['content'].encode())!=c['after']: raise ValueError('apply_digest_mismatch')
        state['status']='applying'; save(journal,state)
        for c in request['changes']:
            if c['path'] in state['completed']: continue
            data, mode = original(root,c)
            if (None if data is None else digest(data)) != c['before']: raise ValueError('apply_conflict')
            fd, name = parent(root,c['path'],True)
            try:
                if c['content'] is None: os.unlink(name,dir_fd=fd)
                else:
                    temp='.adr-apply-'+str(uuid.uuid4()); f=os.open(temp,os.O_WRONLY|os.O_CREAT|os.O_EXCL|os.O_NOFOLLOW,mode,dir_fd=fd)
                    try:
                        os.write(f,c['content'].encode()); os.fsync(f)
                    finally: os.close(f)
                    again,_=original(root,c)
                    if (None if again is None else digest(again))!=c['before']:
                        os.unlink(temp,dir_fd=fd); raise ValueError('apply_conflict')
                    os.replace(temp,name,src_dir_fd=fd,dst_dir_fd=fd)
                os.fsync(fd)
            finally: os.close(fd)
            state['completed'].append(c['path']); save(journal,state)
        state['status']='complete'; save(journal,state)
        return {'status':'applied','completed':state['completed'],'operationId':state['operationId']}
    except Exception as e:
        state['status']='interrupted';state['code']=str(e) if isinstance(e,ValueError) else 'apply_io_failed';save(journal,state)
        return {'status':'interrupted','code':state['code'],'completed':state['completed'],'operationId':state['operationId']}
    finally: os.close(root)
try: print(json.dumps(run(json.load(sys.stdin))))
except Exception as e: print(json.dumps({'status':'rejected','code':str(e) if isinstance(e,ValueError) else 'apply_io_failed','completed':[]}));sys.exit(1)
