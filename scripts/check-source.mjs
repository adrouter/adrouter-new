import { readdir } from 'node:fs/promises';
import { join } from 'node:path';
import { execFileSync } from 'node:child_process';
async function check(directory) {
  for(const entry of await readdir(directory,{withFileTypes:true})) {
    const path=join(directory,entry.name);
    if(entry.isDirectory())await check(path);
    else if(entry.name.endsWith('.mjs'))execFileSync(process.execPath,['--check',path],{stdio:'pipe'});
  }
}
await check('src');await check('bin');await check('scripts');
console.log('All JavaScript sources parse');
