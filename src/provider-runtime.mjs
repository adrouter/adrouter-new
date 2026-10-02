import {readFile,lstat} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {piCatalog} from './generated/pi-catalog.mjs';
const hash=b=>createHash('sha256').update(b).digest('hex');
export async function verifyProviderRuntime() {
 const base=new URL('../provider-runtime/',import.meta.url),metadata=JSON.parse(await readFile(new URL('provenance.json',base)));
 if(metadata.version!=='1.0.0'||metadata.revision!==piCatalog.revision||metadata.integrity!==piCatalog.integrity)throw Error('provider_runtime_pin_mismatch');
 for(const [path,digest]of Object.entries(metadata.files)){
  if(path.startsWith('/')||path.includes('\\')||path.split('/').some(p=>!p||p==='..'||p.startsWith('.env'))||!/^[a-f0-9]{64}$/.test(digest))throw Error('provider_runtime_manifest_invalid');
  const url=new URL(path,base),stat=await lstat(url);if(!stat.isFile()||stat.isSymbolicLink()||hash(await readFile(url))!==digest)throw Error('provider_runtime_integrity_mismatch');
 }
 for(const f of ['pi-native.mjs','pi-transport.mjs','pi-context.mjs','provider-broker.mjs','coding-wire.mjs','connectors.mjs','provider-setup.mjs','generated/connectors.mjs','generated/pi-catalog.mjs'])if(hash(await readFile(new URL(f,import.meta.url)))!==metadata.files[f])throw Error('provider_runtime_source_drift');
 if(hash(await readFile(new URL('guest/provider-console.mjs',import.meta.url)))!==metadata.files['provider-console.mjs'])throw Error('provider_console_source_drift');
 return {version:metadata.version,revision:metadata.revision,files:Object.keys(metadata.files).length};
}
