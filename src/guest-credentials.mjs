// Guest-only Pi CredentialStore; never imported by host UI or diagnostics.
import {open,rename,unlink,mkdir,lstat,readdir,readFile} from 'node:fs/promises';
import {constants} from 'node:fs';
import {join} from 'node:path';
import {randomUUID,createHash} from 'node:crypto';
import {setTimeout as delay} from 'node:timers/promises';
const fail=()=>Object.assign(Error('guest_credential_store_unavailable'),{code:'guest_credential_store_unavailable'});
export class GuestCredentialStore {
  constructor(directory='/credentials'){this.directory=directory;}
  file(provider){return join(this.directory,createHash('sha256').update(provider).digest('hex')+'.json');}
  async ready(){await mkdir(this.directory,{recursive:true,mode:0o700});const s=await lstat(this.directory);if(!s.isDirectory()||s.isSymbolicLink()||s.uid!==process.getuid())throw fail();}
  async envelope(path){let f;try{f=await open(path,constants.O_RDONLY|constants.O_NOFOLLOW|constants.O_NONBLOCK);const s=await f.stat();if(!s.isFile()||s.nlink!==1||s.uid!==process.getuid()||(s.mode&0o077)||s.size>65536)throw fail();return JSON.parse(await f.readFile('utf8'));}catch(e){if(e.code==='ENOENT')return undefined;throw fail();}finally{await f?.close();}}
  async read(provider,{signal}={}){signal?.throwIfAborted();await this.ready();const stored=await this.envelope(this.file(provider));if(stored&&stored.providerId!==provider)throw fail();return stored?.credential;}
  async list({signal}={}){await this.ready();const result=[];for(const name of await readdir(this.directory)){signal?.throwIfAborted();if(!/^[a-f0-9]{64}\.json$/.test(name))continue;const stored=await this.envelope(join(this.directory,name));if(stored?.providerId&&['api_key','oauth'].includes(stored.credential?.type))result.push({providerId:stored.providerId,type:stored.credential.type});}return result;}
  async locked(provider,work,{signal}={}) {
    await this.ready();const path=this.file(provider)+'.lock',deadline=Date.now()+5000;
    const boot=await readFile('/proc/sys/kernel/random/boot_id','utf8').catch(()=>`host-${process.pid}`);let lock;
    while(!lock){signal?.throwIfAborted();try{lock=await open(path,constants.O_CREAT|constants.O_EXCL|constants.O_WRONLY|constants.O_NOFOLLOW,0o600);await lock.writeFile(JSON.stringify({pid:process.pid,boot}));await lock.sync();}
      catch(e){if(e.code!=='EEXIST'||Date.now()>deadline)throw fail();let handle;
        try{handle=await open(path,constants.O_RDONLY|constants.O_NOFOLLOW|constants.O_NONBLOCK);const before=await handle.stat();if(!before.isFile()||before.nlink!==1||before.size>256||before.uid!==process.getuid())throw fail();const previous=JSON.parse(await handle.readFile('utf8'));let stale=typeof previous.boot==='string'&&previous.boot!==boot;
          if(!stale&&Number.isSafeInteger(previous.pid)&&previous.pid>0)try{process.kill(previous.pid,0);}catch(error){stale=error.code==='ESRCH';}
          if(stale){const current=await lstat(path);if(current.ino===before.ino&&current.dev===before.dev)await unlink(path);}
        }catch(error){if(error.code!=='ENOENT'&&!(error instanceof SyntaxError))throw error;}finally{await handle?.close();}
        await delay(25,undefined,{signal});}}
    try{return await work();}finally{await lock.close();await unlink(path);}
  }
  async sync(){const dir=await open(this.directory,constants.O_RDONLY);try{await dir.sync();}finally{await dir.close();}}
  async modify(provider,fn,options={}){return this.locked(provider,async()=>{const previous=await this.read(provider,options),value=await fn(previous);if(value===undefined)return previous;const path=this.file(provider),temp=path+'.'+randomUUID()+'.tmp';let f;try{f=await open(temp,constants.O_CREAT|constants.O_EXCL|constants.O_WRONLY|constants.O_NOFOLLOW,0o600);await f.writeFile(JSON.stringify({providerId:provider,credential:value}));await f.sync();await f.close();f=null;await rename(temp,path);await this.sync();return value;}finally{await f?.close();await unlink(temp).catch(e=>{if(e.code!=='ENOENT')throw e;});}},options);}
  async delete(provider,options={}){return this.locked(provider,async()=>{await unlink(this.file(provider)).catch(e=>{if(e.code!=='ENOENT')throw e;});await this.sync();},options);}
  async recoverStartup(){await this.ready();for(const name of await readdir(this.directory))if(/^[a-f0-9]{64}\.json(?:\.lock|\.[a-f0-9-]{36}\.tmp)$/.test(name))await unlink(join(this.directory,name));await this.sync();}
  async disconnect(){await this.ready();for(const name of await readdir(this.directory))if(/^[a-f0-9]{64}\.json(?:\.lock|\.[a-f0-9-]{36}\.tmp)?$/.test(name))await unlink(join(this.directory,name));await this.sync();}
}
