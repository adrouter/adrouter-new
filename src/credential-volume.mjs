import {createHash} from 'node:crypto';
import {lstat} from 'node:fs/promises';
import {join} from 'node:path';
import {ClientError} from './network.mjs';
const fail=code=>{throw new ClientError(code);};
// Deterministic owner/connection identity survives same-owner installation replacement.
// No credential bytes or directory mount ever cross this host boundary.
export async function credentialVolume(network,runtime,node,{create=true}={}) {
  const [account,current,identity]=await Promise.all([network.request('/v2/providers/me'),network.request(`/v2/providers/nodes/${node.id}`),network.local?null:network.store.read()]);
  if(account.userId!==node.ownerId||current.ownerId!==account.userId||(!network.local&&current.installationId!==identity?.installation_id)||current.id!==node.id)fail('credential_volume_not_authorized');
  const name='adrvault-'+createHash('sha256').update(JSON.stringify([network.origin,account.userId,node.id])).digest('hex').slice(0,48);
  const directory=join(runtime.home,'volumes',name),path=join(directory,'disk.raw');
  let exists=true;try{await lstat(directory);}catch(e){if(e.code==='ENOENT')exists=false;else throw e;}
  if(!exists){if(!create)fail('credential_volume_missing');await runtime.call(['volume','create',name,'--kind','disk','--size','256M']);}
  for(const p of [join(runtime.home,'volumes'),directory,path]){const st=await lstat(p);if(st.isSymbolicLink()||st.uid!==process.getuid()||(p===path?!st.isFile()||st.nlink!==1:!st.isDirectory()))fail('credential_volume_unsafe');}
  const metadata=await runtime.call(['volume','inspect',name]);
  if(!/^Kind:\s+disk$/m.test(metadata)||!/^Format:\s+raw$/m.test(metadata)||!/^Filesystem:\s+ext4$/m.test(metadata)||!metadata.split('\n').some(line=>line.replace(/^Path:\s*/,'').trim()===path))fail('credential_volume_unsafe');
  const volume={name,path,ownerId:account.userId,connectionId:node.id};runtime.credentialVolumes??=new Map();runtime.credentialVolumes.set(name,volume);return volume;
}
