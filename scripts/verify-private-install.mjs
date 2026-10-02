// Compare the immutable private tarball with its isolated installed files.
import {spawnSync,execFileSync} from 'node:child_process';
import {readFile,realpath} from 'node:fs/promises';
import {createHash} from 'node:crypto';
import {resolve} from 'node:path';
const [tarball,prefix]=process.argv.slice(2);if(!tarball||!prefix)throw Error('Pass exact private tarball and isolated install prefix');
const source=await realpath('.');if(execFileSync('git',['status','--porcelain'],{encoding:'utf8'}).trim())throw Error('clean_source_required');
const script=`import sys,tarfile,pathlib,hashlib,json\ntarball,prefix,source=sys.argv[1:]\ninstalled=pathlib.Path(prefix)/'node_modules/@adrouter/adr-cli'\ncount=0\nwith tarfile.open(tarball,'r:gz') as archive:\n for member in archive.getmembers():\n  if not member.isfile():\n   if member.issym() or member.islnk(): raise Exception('archive_link_rejected')\n   continue\n  relative=pathlib.PurePosixPath(member.name)\n  if relative.parts[0]!='package' or '..' in relative.parts:raise Exception('archive_path_rejected')\n  relative=pathlib.Path(*relative.parts[1:]);expected=archive.extractfile(member).read();target=installed/relative\n  if target.is_symlink() or not target.is_file() or target.read_bytes()!=expected:raise Exception('installed_bytes_mismatch:'+str(relative))\n  origin=pathlib.Path(source)/relative\n  if not origin.is_file() or origin.read_bytes()!=expected:raise Exception('source_bytes_mismatch:'+str(relative))\n  count+=1\nprint(json.dumps({'status':'passed','files':count,'sourceAndInstalledBytesMatch':True}))\n`;
const result=spawnSync('python3',['-c',script,resolve(tarball),resolve(prefix),source],{encoding:'utf8',maxBuffer:1024*1024});if(result.status!==0)throw Error(result.stderr);const comparison=JSON.parse(result.stdout);
const bytes=await readFile(tarball),pkg=JSON.parse(await readFile(resolve(prefix,'node_modules/@adrouter/adr-cli/package.json')));
if(pkg.name!=='@adrouter/adr-cli'||pkg.private!==true)throw Error('private_package_required');
console.log(JSON.stringify({...comparison,version:pkg.version,sourceCommit:execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim(),sha256:createHash('sha256').update(bytes).digest('hex'),integrity:'sha512-'+createHash('sha512').update(bytes).digest('base64')}));
