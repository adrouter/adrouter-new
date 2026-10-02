import { lstatSync, realpathSync } from 'node:fs';
import { resolve, relative, join } from 'node:path';
import { checkWorkspacePath } from '../workspace-policy.mjs';
export function reviewedRead(request,root='/workspace') {
  if(!['read','grep','find','ls'].includes(request.toolName))return {allow:false,reason:'This read requires an explicit reviewed tool.'};
  try{
    const path=request.arguments?.path??'.';if(typeof path!=='string'||path.includes('\0')||path.includes('\\'))throw Error();
    const full=resolve(root,path),rel=relative(root,full);
    if(rel==='..'||rel.startsWith('../')||full!==root&&!full.startsWith(root+'/'))throw Error();
    if(rel){checkWorkspacePath(rel);if(rel.split('/').includes('.adr-runtime'))throw Error();}
    if(realpathSync(root)!==root)throw Error();
    let current=root;
    for(const part of rel?rel.split('/'):[]){current=join(current,part);const stat=lstatSync(current);if(stat.isSymbolicLink()||stat.isFile()&&stat.nlink!==1)throw Error();}
    return {allow:true};
  }catch{return {allow:false,reason:'Automatic reads stay within the reviewed VM project.'};}
}
