import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
import { readFile, readdir, lstat, mkdtemp, rm, realpath } from 'node:fs/promises';
import { join, isAbsolute } from 'node:path';
import { tmpdir } from 'node:os';
import { pathToFileURL } from 'node:url';
import { baseline } from './baseline.mjs';
import { digest } from './report.mjs';
export const execute = promisify(execFile);
export const fail = code => Object.assign(Error(code), { code });
export async function command(file,args,options={}) {
  try { return (await execute(file,args,{encoding:'utf8',timeout:60000,maxBuffer:8*1024*1024,...options})).stdout; }
  catch(error) { throw fail(error.name==='AbortError'?'interrupted':'verification_command_failed'); }
}
export async function treeFiles(root) {
  const files=[];
  async function walk(relative='') {for(const entry of await readdir(join(root,relative),{withFileTypes:true})){
    const name=relative?relative+'/'+entry.name:entry.name;
    if(entry.name.startsWith('.env')||entry.name==='.dev.vars')throw fail('secret_path_rejected');
    if(entry.isSymbolicLink())throw fail('artifact_symlink_rejected');
    if(entry.isDirectory())await walk(name);else if(entry.isFile())files.push(name);else throw fail('artifact_file_invalid');
  }}
  await walk();return files.sort();
}
export async function verifierIdentity(sourceRoot) {
  const commit=(await command('git',['-C',sourceRoot,'rev-parse','HEAD'])).trim();
  await command('git',['-C',sourceRoot,'merge-base','--is-ancestor',baseline.baselineVerifierCommit,commit]);
  const remote=(await command('git',['-C',sourceRoot,'remote','get-url','origin'])).trim();
  if(!['https://github.com/adrouter/adrouter-new.git','https://github.com/adrouter/adrouter-new'].includes(remote))throw fail('canonical_client_required');
  const entries=[];for(const dir of ['scripts','test'])for(const file of await treeFiles(join(sourceRoot,dir)))entries.push([dir+'/'+file,digest(await readFile(join(sourceRoot,dir,file)))]);
  return {verifierCommit:commit,verifierTreeSha256:digest(JSON.stringify(entries))};
}
export async function verifyArtifact({clientRoot,tarball,sourceRoot,signal}) {
  if(![clientRoot,tarball,sourceRoot].every(isAbsolute))throw fail('absolute_identity_paths_required');
  if(await realpath(clientRoot)===await realpath(sourceRoot))throw fail('installed_artifact_required');
  const packageJson=JSON.parse(await readFile(join(clientRoot,'package.json'),'utf8'));
  if(packageJson.name!=='@adrouter/adr-cli'||packageJson.version!==baseline.version||packageJson.private!==true)throw fail('artifact_version_mismatch');
  const productPaths=['src','bin','runtime','package.json','package-lock.json','pi-provenance.lock.json','release-policy.json','README.md','LICENSE'];
  const productDiff=(await command('git',['-C',sourceRoot,'diff','--name-only',baseline.productCommit,'--',...productPaths])).trim();
  const untracked=(await command('git',['-C',sourceRoot,'ls-files','--others','--exclude-standard','--',...productPaths])).trim();
  if(productDiff||untracked)throw fail('working_product_source_changed');
  const bytes=await readFile(tarball);if(digest(bytes)!==baseline.artifactSha256)throw fail('artifact_digest_mismatch');
  const list=await command('tar',['-tzf',tarball],{signal});
  for(const name of list.trim().split('\n'))if(!name.startsWith('package/')||name.includes('\\')||name.split('/').includes('..'))throw fail('artifact_archive_invalid');
  const temporary=await mkdtemp(join(tmpdir(),'adr-artifact-'));
  try{
    await command('tar',['-xzf',tarball,'-C',temporary],{signal});const files=await treeFiles(join(temporary,'package'));
    if(JSON.stringify(await treeFiles(clientRoot))!==JSON.stringify(files))throw fail('installed_inventory_mismatch');
    for(const file of files){signal?.throwIfAborted();const stat=await lstat(join(clientRoot,file));if(!stat.isFile()||stat.isSymbolicLink()||!Buffer.from(await readFile(join(clientRoot,file))).equals(await readFile(join(temporary,'package',file))))throw fail('installed_artifact_mismatch');}
    // Package allowlisted source must still be baseline product source, not verifier source.
    for(const prefix of ['src','bin'])for(const file of files.filter(f=>f.startsWith(prefix+'/'))){
      if(!Buffer.from(await readFile(join(sourceRoot,file))).equals(await readFile(join(clientRoot,file))))throw fail('working_product_source_changed');
      const committed=await execute('git',['-C',sourceRoot,'show',baseline.productCommit+':'+file],{encoding:'buffer',maxBuffer:8*1024*1024});
      if(!committed.stdout.equals(await readFile(join(clientRoot,file))))throw fail('product_source_mismatch');
    }
    return {files:files.length,artifactSha256:baseline.artifactSha256,productCommit:baseline.productCommit,version:baseline.version};
  }finally{await rm(temporary,{recursive:true,force:true});}
}
export async function verifyRuntime({clientRoot,runtimePaths,signal}) {
  const paths=JSON.parse(await readFile(runtimePaths,'utf8'));
  if(Object.keys(paths).sort().join(',')!=='executable,home,library')throw fail('runtime_paths_invalid');
  const {SandboxRuntime}=await import(pathToFileURL(join(clientRoot,'src/runtime.mjs')).href);
  const runtime=new SandboxRuntime(paths),verified=await runtime.verify({signal});
  const {verifyProviderRuntime}=await import(pathToFileURL(join(clientRoot,'src/provider-runtime.mjs')).href);await verifyProviderRuntime();
  return {runtimeSha256:verified.executableSha256,librarySha256:verified.librarySha256,providerRuntimeSha256:digest(await readFile(join(clientRoot,'provider-runtime/provenance.json'))),codingRuntimeSha256:digest(await readFile(join(clientRoot,'coding-runtime/provenance.json'))),catalogSha256:digest(await readFile(join(clientRoot,'src/generated/pi-catalog.mjs')))};
}
export async function verifyRouter(routerRoot) {
  const remote=(await command('git',['-C',routerRoot,'remote','get-url','origin'])).trim();
  const commit=(await command('git',['-C',routerRoot,'rev-parse','HEAD'])).trim();
  if(remote!=='https://github.com/HappyCool121/adrouter-dashboard.git')throw fail('router_baseline_mismatch');
  await command('git',['-C',routerRoot,'merge-base','--is-ancestor',baseline.routerCommit,commit]);
  const allowed=path=>path==='PLAN.md'||/^backend\/scripts\/[^/]+\.test\.ts$/.test(path)||['backend/scripts/verify-auth-recovery.ts','backend/scripts/verify-auth-recovery-disposable.mjs'].includes(path);
  const changed=(await command('git',['-C',routerRoot,'status','--porcelain','--untracked-files=all'])).trimEnd().split('\n').filter(Boolean).map(line=>line.slice(3));
  const committed=(await command('git',['-C',routerRoot,'diff','--name-only',baseline.routerCommit])).trim().split('\n').filter(Boolean);
  if([...changed,...committed].some(path=>!allowed(path)))throw fail('router_product_changed');
  const entries=[];for(const file of await treeFiles(join(routerRoot,'backend/scripts')))if(/\.(ts|mjs)$/.test(file))entries.push([file,digest(await readFile(join(routerRoot,'backend/scripts',file)))]);
  return {routerVerifierCommit:commit,routerVerifierTreeSha256:digest(JSON.stringify(entries))};
}
