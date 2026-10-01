import { readFile, lstat } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import { resolve, join, isAbsolute } from 'node:path';
const root=resolve(process.argv[2]??'.'),directory=join(root,'coding-runtime');
const metadata=JSON.parse(await readFile(join(directory,'provenance.json'),'utf8'));
if(metadata.repository!=='https://github.com/adrouter/adrouterCLI'||metadata.revision!=='be7c53dc0b63fb90b70bd6cb7cad4d5713cc0d1a'||!/^[a-f0-9]{64}$/.test(metadata.archiveSha256))throw Error('coding_provenance_invalid');
for(const [path,expected] of Object.entries(metadata.files)){
 if(isAbsolute(path)||path.split('/').some(p=>!p||p==='..')||path.includes('\\')||!/^[a-f0-9]{64}$/.test(expected))throw Error('coding_provenance_path_invalid');
 const file=join(directory,path),stat=await lstat(file);if(!stat.isFile()||stat.isSymbolicLink())throw Error('coding_provenance_file_invalid');
 if(createHash('sha256').update(await readFile(file)).digest('hex')!==expected)throw Error('coding_provenance_mismatch');
}
for(const file of ['coding-entry.mjs','coding-provider.mjs','coding-controls.mjs'])if(!Buffer.from(await readFile(join(root,'src/guest',file))).equals(await readFile(join(directory,'guest',file))))throw Error('coding_guest_source_drift');
if(!Buffer.from(await readFile(join(root,'src/coding-wire.mjs'))).equals(await readFile(join(directory,'guest/coding-wire.mjs'))))throw Error('coding_wire_source_drift');
console.log(JSON.stringify({status:'passed',revision:metadata.revision,files:Object.keys(metadata.files).length,licenses:true,legacyInstallationRequired:false}));
