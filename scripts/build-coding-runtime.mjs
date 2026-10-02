// Reproducible extraction from committed source; never copy a working checkout,
// legacy installation, credentials, browser state or user session directories.
import { execFileSync, spawn } from 'node:child_process';
import { mkdtemp, mkdir, readFile, writeFile, cp, rm, readdir, lstat } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join, resolve } from 'node:path';
import { createHash } from 'node:crypto';
const revision='be7c53dc0b63fb90b70bd6cb7cad4d5713cc0d1a';
const source=resolve(process.argv[2]??'../adrouterCLI');
const output=resolve('coding-runtime');
const work=await mkdtemp(join(tmpdir(),'adr-coding-source-'));
const hash=b=>createHash('sha256').update(b).digest('hex');
const run=(command,args)=>new Promise((resolveRun,reject)=>{const p=spawn(command,args,{cwd:work,env:{PATH:process.env.PATH,HOME:work,TMPDIR:work,CI:'true'},stdio:'inherit'});p.once('error',reject);p.once('exit',n=>n===0?resolveRun():reject(Error('coding_build_failed')));});
async function download(url) {
  const response=await fetch(url,{signal:AbortSignal.timeout(30000),redirect:'follow'});
  if(!response.ok)throw Error('coding_tool_download_failed');
  const chunks=[];let length=0;
  for await(const chunk of response.body){length+=chunk.length;if(length>32*1024*1024)throw Error('coding_tool_download_limit');chunks.push(chunk);}
  return Buffer.concat(chunks);
}
try {
  const archive=execFileSync('git',['-C',source,'archive',revision],{maxBuffer:128*1024*1024});
  const file=join(work,'source.tar');await writeFile(file,archive);execFileSync('/usr/bin/tar',['-xf',file,'-C',work]);await rm(file);
  const adaptations=[];
  const patch=async(path,from,to)=>{const p=join(work,path),before=await readFile(p,'utf8');if(!before.includes(from))throw Error(`pinned_adaptation_mismatch:${path}`);const after=before.replace(from,to);await writeFile(p,after);adaptations.push({path,beforeSha256:hash(before),afterSha256:hash(after)});};
  // No built-in catalog/auth selection survives into the guest model registry.
  await patch('packages/coding-agent/src/core/model-registry.ts','private loadBuiltInModels(): Model<Api>[] {','private loadBuiltInModels(): Model<Api>[] { return []; }\n\tprivate unusedLegacyModels(): Model<Api>[] {');
  // Both main execution and extensions/children re-enter this package's guest
  // entrypoint. There is no old CLI executable/installation prerequisite.
  await patch('packages/coding-agent/bundled/pi-subagents-0.68.0/src/runs/shared/pi-spawn.ts','return { command: "adrouter", args };','return { command: process.execPath, args: ["/workspace/.adr-runtime/guest/coding-entry.mjs", "--child", ...args] };');
  await patch('packages/coding-agent/src/core/agent-session.ts', 'signal: this._bashAbortController.signal,', 'signal: (globalThis as any).__adrCodingBridge ? AbortSignal.any([this._bashAbortController.signal, AbortSignal.timeout(120000)]) : this._bashAbortController.signal,');
  // Commands have a bounded default independent of the console lifetime.
  await patch('packages/coding-agent/src/core/tools/bash.ts','if (timeout === undefined) return undefined;','if (timeout === undefined) timeout = 120;\n\tif (timeout > 600) throw new Error("Command timeout exceeds 600 seconds");');
  await patch('packages/coding-agent/src/core/agent-session.ts','const authorizer = this._toolAuthorizer;','const authorizer = (globalThis as any).__adrCodingAuthorize ?? this._toolAuthorizer;');
  // Operator shell shortcuts use the same host review boundary as model commands.
  await patch('packages/coding-agent/src/core/agent-session.ts', 'this._bashAbortController = new AbortController();', `if ((globalThis as any).__adrCodingBridge) { const permission = await (globalThis as any).__adrCodingBridge("operator_command", {command,timeout:120}); if (!permission.allow) throw new Error("Action denied by user."); }\n\t\tthis._bashAbortController = new AbortController();`);

  await patch('packages/coding-agent/bundled/btw-23017e9/index.ts','child = spawn("adrouter", args, {','child = spawn(process.execPath, ["/workspace/.adr-runtime/guest/coding-entry.mjs", "--child", ...args], {');
  await patch('packages/coding-agent/src/utils/clipboard.ts','export async function copyToClipboard(text: string): Promise<void> {','export async function copyToClipboard(text: string): Promise<void> { if ((globalThis as any).__adrCodingBridge) { await (globalThis as any).__adrCodingBridge("clipboard", {text}); return; }');
  await patch('packages/coding-agent/src/modes/interactive/interactive-mode.ts','private async handleShareCommand(): Promise<void> {','private async handleShareCommand(): Promise<void> { if ((globalThis as any).__adrCodingBridge) { const result = await (globalThis as any).__adrCodingBridge("share", {sessionFile:this.session.sessionFile}); this.showWarning(result.message); return; }');
  await patch('packages/coding-agent/src/modes/interactive/interactive-mode.ts','private async openExternalEditor(): Promise<void> {','private async openExternalEditor(): Promise<void> { if ((globalThis as any).__adrCodingBridge) { const result=await (globalThis as any).__adrCodingBridge("editor",{text:this.editor.getText()});this.editor.setText(result.text);return; }');
  await patch('packages/coding-agent/src/modes/interactive/interactive-mode.ts','if (text === "/ads" || text.startsWith("/ads ")) {','if (text === "/ads" || text.startsWith("/ads ")) { this.showWarning("Sponsorship is excluded from marketplace coding."); this.editor.setText(""); return;');
  await patch('packages/coding-agent/src/modes/interactive/interactive-mode.ts','if (text === "/login" || text.startsWith("/login ")) {','if (text === "/login" || text.startsWith("/login ")) { this.showWarning("Marketplace authentication is managed by the host profile."); this.editor.setText(""); return;');
  await patch('packages/coding-agent/bundled/pi-web-access-0.29.0/ssrf-protection.ts','const fetchImpl = options.fetch ?? fetch;','if ((globalThis as any).__adrCodingBridge) return fetch(url.toString(), init);\n\tconst fetchImpl = options.fetch ?? fetch;');
  const skill='packages/coding-agent/bundled/adroutercli/skills/adroutercli/docs/SKILL.md';
  await patch(skill,await readFile(join(work,skill),'utf8'),await readFile(resolve('src/guest/marketplace-skill.md'),'utf8'));
  await patch('packages/coding-agent/src/core/slash-commands.ts','\t{\n\t\tname: "ads",\n\t\tdescription: "Show or change AdRouter sponsorship preference",\n\t\targumentHint: "[status|on|off]",\n\t},\n','');
  await patch('packages/coding-agent/src/core/slash-commands.ts','\t{ name: "login", description: "Configure provider authentication", argumentHint: "<provider>" },\n','');
  await patch('packages/coding-agent/src/core/slash-commands.ts','\t{ name: "logout", description: "Remove provider authentication" },\n','');
  await patch('packages/agent/src/presence.ts','public start(taskId: string = globalThis.crypto.randomUUID()): void {','public start(taskId: string = globalThis.crypto.randomUUID()): void { if ((globalThis as any).__adrCodingBridge) { this.stop(); return; }');
  await patch('packages/coding-agent/src/utils/tools-manager.ts','export async function ensureTool(tool: "fd" | "rg", silent: boolean = false): Promise<string | undefined> {','export async function ensureTool(tool: "fd" | "rg", silent: boolean = false): Promise<string | undefined> { if ((globalThis as any).__adrCodingBridge) { const path = getToolPath(tool); if (!path) throw new Error("marketplace_tool_missing:" + tool); return path; }');
  await patch('packages/coding-agent/src/modes/interactive/components/custom-editor.ts','private renderCostStatus(meta: EditorMetadata, width: number): string {','private renderCostStatus(meta: EditorMetadata, width: number): string { if ((globalThis as any).__adrCodingBridge) return truncateToWidth((globalThis as any).__adrCodingDisplay?.label ?? "Listing cost unavailable", width, "…");');
  await patch('packages/coding-agent/src/modes/interactive/interactive-mode.ts','if (stats.cost > 0 || cacheWaste.missedTokens > 0) {','if ((globalThis as any).__adrCodingBridge) { const value=(globalThis as any).__adrCodingDisplay; info += "\\n" + (value ? value.label + " · " + value.rates : "Listing cost unavailable"); }\n\t\tif (!(globalThis as any).__adrCodingBridge && (stats.cost > 0 || cacheWaste.missedTokens > 0)) {');
  await patch('packages/coding-agent/src/modes/interactive/theme/dark.json','"toolPendingBg": "#282832"','"toolPendingBg": ""');
  await patch('packages/coding-agent/src/modes/interactive/theme/dark.json','"toolSuccessBg": "#283228"','"toolSuccessBg": ""');
  await patch('packages/coding-agent/src/modes/interactive/theme/dark.json','"toolErrorBg": "#3c2828"','"toolErrorBg": ""');
  {const path='packages/coding-agent/src/modes/interactive/theme/light.json';const before=await readFile(join(work,path),'utf8');const theme=JSON.parse(before);for(const key of ['toolPendingBg','toolSuccessBg','toolErrorBg'])theme.vars[key]='';await patch(path,before,JSON.stringify(theme,null,2)+'\n');}
  await run('npm',['ci','--ignore-scripts','--no-audit','--no-fund']);
  await run('npm',['run','build']);
  if(process.argv.includes('--verify')) {
    await run('npm',['run','test','--workspace','@adrouter/cli','--','test/session-manager','test/compaction.test.ts','test/skills.test.ts','test/prompt-templates.test.ts','test/extensions-runner.test.ts','test/trust-manager.test.ts','test/rpc-jsonl.test.ts','test/custom-editor-render.test.ts','test/tools.test.ts','test/resource-loader.test.ts']);
    await run('npm',['run','test','--workspace','@adrouter/tui']);
    await run('npm',['run','test','--workspace','@adrouter/agent-core','--','test/presence.test.ts','test/agent-loop.test.ts','test/agent.test.ts']);
  }
  await rm(output,{recursive:true,force:true});await mkdir(join(output,'node_modules/@adrouter'),{recursive:true});
  for(const [directory,name] of [['ai','ai'],['agent','agent-core'],['tui','tui'],['coding-agent','cli']]) {
    const from=join(work,'packages',directory),to=join(output,'node_modules/@adrouter',name);await mkdir(to,{recursive:true});
    for(const f of ['dist','package.json'])await cp(join(from,f),join(to,f),{recursive:true});
    await cp(join(from,'README.md'),join(to,'README.md')).catch(e=>{if(e.code!=='ENOENT')throw e;});
  }
  // Retain the pinned dependency closure, resolving only task-owned workspace
  // symlinks. Native clipboard is replaced by an explicit host bridge.
  const lock=JSON.parse(await readFile(join(work,'package-lock.json')));
  for(const [path,entry] of Object.entries(lock.packages)) {
    if(!path.startsWith('node_modules/')||entry.dev||entry.link||path.includes('/@adrouter/'))continue;
    const from=join(work,path);try{if((await lstat(from)).isDirectory())await cp(from,join(output,path),{recursive:true,dereference:true});}catch(e){if(e.code!=='ENOENT')throw e;}
  }
  await cp(join(work,'LICENSE'),join(output,'LICENSE'));
  for(const f of ['THIRD_PARTY_NOTICES.md','BUNDLED_SOURCES.json'])await cp(join(work,'packages/coding-agent',f),join(output,f));
  await mkdir(join(output,'guest'));for(const f of ['coding-entry.mjs','coding-provider.mjs','coding-controls.mjs','workspace-snapshot.mjs','coding-preview.mjs'])await cp(resolve('src/guest',f),join(output,'guest',f));
  for(const file of ['workspace-policy.mjs','coding-display.mjs'])await cp(resolve('src',file),join(output,file));
  await cp(resolve('node_modules/ignore'),join(output,'node_modules/ignore'),{recursive:true,dereference:true});
  await cp(resolve('src/coding-wire.mjs'),join(output,'guest/coding-wire.mjs'));
  // Ripgrep is part of the development payload, pinned independently of the
  // base image. Verify the upstream release digest before extracting any byte.
  for(const [arch,target,digest] of [['arm64','aarch64-unknown-linux-gnu','2b661c6ef508e902f388e9098d9c4c5aca72c87b55922d94abdba830b4dc885e'],['x64','x86_64-unknown-linux-musl','1c9297be4a084eea7ecaedf93eb03d058d6faae29bbc57ecdaf5063921491599']]) {
    const name=`ripgrep-15.1.0-${target}`,url=`https://github.com/BurntSushi/ripgrep/releases/download/15.1.0/${name}.tar.gz`;
    const bytes=await download(url);if(hash(bytes)!==digest)throw Error('ripgrep_digest_mismatch');
    const archive=join(work,`${arch}.tar.gz`);await writeFile(archive,bytes);await mkdir(join(output,'tools',arch),{recursive:true});
    for(const file of ['rg','LICENSE-MIT']){const data=execFileSync('/usr/bin/tar',['-xOzf',archive,`${name}/${file}`],{maxBuffer:16*1024*1024});await writeFile(join(output,'tools',arch,file),data,{mode:file==='rg'?0o700:0o600});}
  }
  for(const [arch,target,digest] of [['arm64','aarch64-unknown-linux-gnu','66f297e404400a3358e9a0c0b2f3f4725956e7e4435427a9ae56e22adbe73a68'],['x64','x86_64-unknown-linux-musl','2b6bfaae8c48f12050813c2ffe1884c61ea26e750d803df9c9114550a314cd14']]) {
    const name=`fd-v10.3.0-${target}`,bytes=await download(`https://github.com/sharkdp/fd/releases/download/v10.3.0/${name}.tar.gz`);
    if(hash(bytes)!==digest)throw Error('fd_digest_mismatch');
    const archive=join(work,`fd-${arch}.tar.gz`);await writeFile(archive,bytes);
    for(const file of ['fd','LICENSE-MIT','LICENSE-APACHE']) {const data=execFileSync('/usr/bin/tar',['-xOzf',archive,`${name}/${file}`],{maxBuffer:16*1024*1024});await writeFile(join(output,'tools',arch,file==='fd'?file:'fd-'+file),data,{mode:file==='fd'?0o700:0o600});}
  }
  const files={};const walk=async(dir='')=>{for(const e of await readdir(join(output,dir),{withFileTypes:true})){const p=dir?`${dir}/${e.name}`:e.name;if(e.name==='.npmignore'){await rm(join(output,p));continue;}if(e.isDirectory())await walk(p);else if(e.isFile())files[p]=hash(await readFile(join(output,p)));else throw Error('coding_payload_link_rejected');}};await walk();
  const metadata={schemaVersion:1,repository:'https://github.com/adrouter/adrouterCLI',revision,archiveSha256:hash(archive),adaptations,prunedMetadata:['**/.npmignore'],files};
  await writeFile(join(output,'provenance.json'),JSON.stringify(metadata,null,2)+'\n');
  console.log(`Pinned coding runtime built: ${revision}, ${Object.keys(files).length} files`);
} finally {await rm(work,{recursive:true,force:true});}
