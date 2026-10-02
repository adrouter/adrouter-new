import { readFile, writeFile, mkdir, cp, rm, readdir } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, join } from 'node:path';
const hash=b=>createHash('sha256').update(b).digest('hex');
const root=resolve('.'),out=join(root,'provider-runtime');
const lock=JSON.parse(await readFile(join(root,'package-lock.json')));
const pin=lock.packages['node_modules/@earendil-works/pi-ai'];
const {piCatalog}=await import('../src/generated/pi-catalog.mjs');
if(pin?.version!=='1.0.0'||pin.integrity!==piCatalog.integrity)throw Error('pi_package_integrity_mismatch');
await rm(out,{recursive:true,force:true});await mkdir(out,{recursive:true});
for(const [path,entry]of Object.entries(lock.packages))if(path.startsWith('node_modules/')&&!entry.dev){if(entry.link)throw Error('provider_dependency_link_rejected');await mkdir(join(out,path,'..'),{recursive:true});await cp(join(root,path),join(out,path),{recursive:true,dereference:false});}
for(const f of ['pi-native.mjs','pi-transport.mjs','pi-context.mjs','provider-broker.mjs','coding-wire.mjs','connectors.mjs','provider-setup.mjs'])await cp(join(root,'src',f),join(out,f));
await cp(join(root,'src/guest/provider-console.mjs'),join(out,'provider-console.mjs'));
await mkdir(join(out,'generated'));for(const f of ['connectors.mjs','pi-catalog.mjs'])await cp(join(root,'src/generated',f),join(out,'generated',f));
const license=await (await fetch('https://raw.githubusercontent.com/earendil-works/pi/'+piCatalog.revision+'/LICENSE',{signal:AbortSignal.timeout(30000)})).text();
if(hash(license)!=='0457f5bcec3b3b211605dfb5d1a49042fd638f3686a410fe099c24a25af13c48')throw Error('pi_license_identity_mismatch');
await writeFile(join(out,'PI-LICENSE-MIT'),license);
const files={};async function inventory(dir,prefix=''){for(const e of await readdir(dir,{withFileTypes:true})){const name=prefix+e.name;if(e.isDirectory())await inventory(join(dir,e.name),name+'/');else if(e.isFile())files[name]=hash(await readFile(join(dir,e.name)));else throw Error('provider_runtime_symlink_rejected');}}
await inventory(out);await writeFile(join(out,'provenance.json'),JSON.stringify({package:piCatalog.package,version:pin.version,integrity:pin.integrity,revision:piCatalog.revision,lockSha256:hash(await readFile(join(root,'package-lock.json'))),files},null,2)+'\n');
console.log(JSON.stringify({package:piCatalog.package,version:pin.version,files:Object.keys(files).length}));
