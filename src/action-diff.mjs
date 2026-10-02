import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { execFile } from 'node:child_process';
import { promisify } from 'node:util';
const execute = promisify(execFile);
export async function actionDiff(before, after) {
  const directory=await mkdtemp(join(tmpdir(),'adr-action-diff-'));
  try {
    await writeFile(join(directory,'before'),before,{mode:0o600});
    await writeFile(join(directory,'after'),after,{mode:0o600});
    let output='';
    try {output=(await execute('/usr/bin/diff',['-u','-L','before','-L','after',join(directory,'before'),join(directory,'after')],{timeout:10000,maxBuffer:8*1024*1024})).stdout;}
    catch(e){if(e.code!==1)throw Error('action_diff_failed');output=e.stdout;}
    return output.trimEnd().split('\n').filter((line,index)=>index>=2 && line);
  } finally {await rm(directory,{recursive:true,force:true});}
}
