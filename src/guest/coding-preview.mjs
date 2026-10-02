import { readFile, lstat } from 'node:fs/promises';
import { checkWorkspacePath } from '../workspace-policy.mjs';
import { stripBom, detectLineEnding, normalizeToLF, restoreLineEndings, applyEditsToNormalizedContent } from '../node_modules/@adrouter/cli/dist/core/tools/edit-diff.js';
export async function codingPreview(action) {
  let path=action.args.path;
  if(path.startsWith('/workspace/'))path=path.slice(11);
  checkWorkspacePath(path);
  const full='/workspace/'+path;
  let before='';
  try {const s=await lstat(full);if(!s.isFile()||s.isSymbolicLink()||s.nlink!==1||s.size>2097152)throw Error('coding_path_rejected');before=await readFile(full,'utf8');}
  catch(e){if(e.code!=='ENOENT'||action.name!=='write')throw e;}
  let after=action.args.content;
  if(action.name==='edit') {
    const {bom,text}=stripBom(before),ending=detectLineEnding(text);
    const edits=action.args.edits??[{oldText:action.args.oldText,newText:action.args.newText}];
    after=bom+restoreLineEndings(applyEditsToNormalizedContent(normalizeToLF(text),edits,path).newContent,ending);
  }
  return {before,after};
}
