import { readFile, readdir, lstat } from 'node:fs/promises';
import { join } from 'node:path';
import ignore from 'ignore';
import { workspacePathReason } from '../workspace-policy.mjs';

export async function workspaceSnapshot(root, selected = []) {
  const files = Object.create(null), tracked = new Set(selected);
  const excluded = {private:0,generated:0,ignored:0,links:0,oversize:0,binary:0};
  let total = 0;
  const walk = async (directory = '', inherited = []) => {
    const matchers = [...inherited];
    for (const name of ['.gitignore','.ignore']) {
      const p = directory ? `${directory}/${name}` : name;
      const s = await lstat(join(root,p)).catch(e => {if(e.code==='ENOENT')return null;throw e;});
      if (!s) continue;
      if (!s.isFile() || s.isSymbolicLink() || s.nlink !== 1 || s.size > 2097152) throw Error('workspace_ignore_rejected');
      matchers.push({base:directory,filter:ignore().add(await readFile(join(root,p),'utf8'))});
    }
    for (const entry of await readdir(join(root,directory),{withFileTypes:true})) {
      const p = directory ? `${directory}/${entry.name}` : entry.name;
      const reason = workspacePathReason(p);
      if (reason) {excluded[reason]++;continue;}
      const s = await lstat(join(root,p));
      if (s.isSymbolicLink() || (s.isFile() && s.nlink !== 1)) {
        if (tracked.has(p)) throw Error('export_link');
        excluded.links++;continue;
      }
      let ignored = false;
      for (const m of matchers) {
        const state = m.filter.test((m.base ? p.slice(m.base.length+1) : p)+(s.isDirectory()?'/':''));
        if (state.ignored) ignored=true;
        if (state.unignored) ignored=false;
      }
      // Explicitly imported files remain tracked even when a new ignore rule
      // hides them; hiding a file must not turn it into a host deletion.
      if (ignored && !tracked.has(p) && ![...tracked].some(v=>v.startsWith(p+'/'))) {excluded.ignored++;continue;}
      if (s.isDirectory()) {await walk(p,matchers);continue;}
      if (!s.isFile()) {excluded.links++;continue;}
      if (s.size > 2097152) {if(tracked.has(p))throw Error('export_limit');excluded.oversize++;continue;}
      let text;
      try {text=new TextDecoder('utf-8',{fatal:true,ignoreBOM:true}).decode(await readFile(join(root,p)));if(text.includes('\0'))throw Error();}
      catch {if(tracked.has(p))throw Error('export_binary');excluded.binary++;continue;}
      total+=s.size;if(total>134217728)throw Error('workspace_total_limit');
      files[p]=text;if(Object.keys(files).length>5000)throw Error('workspace_selection_invalid');
    }
  };
  await walk();return {files,excluded};
}
