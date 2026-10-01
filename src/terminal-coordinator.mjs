import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { ClientError } from './network.mjs';

export function approvalLines(action) {
  const args = action.args ?? {};
  if (action.name === 'bash' || action.name === 'operator_command') return [`Command: ${args.command}`, 'Working directory: /workspace', `Timeout: ${args.timeout ?? 120} seconds`];
  if (action.changes) return action.changes.flatMap(c => [`${c.kind}: ${c.path}`, ...(c.diff ?? (c.content === null ? ['- File deleted'] : String(c.content).split('\n').map(l => `+ ${l}`)))]);
  if (['write', 'edit'].includes(action.name)) return [`File: ${args.path}`, ...(action.diff ?? [`- ${args.oldText ?? ''}`, `+ ${args.newText ?? args.content ?? ''}`])];
  return [action.name, JSON.stringify(args, null, 2)];
}
export class TerminalCoordinator {
  constructor(ui, record = () => {}) { this.ui = ui; this.record = record; this.tail = Promise.resolve(); this.reviewing = false; }
  approve(action, permission) {
    const pending = this.tail.then(async () => {
      if (Date.now() >= permission.expiresAt) return false;
      const attached = this.attached;
      this.reviewing = true;
      try {
        if (attached) { this.ui.input.removeListener('data', this.onData); this.ui.start(); }
        let details = false;
        for (;;) {
          const choice = await this.ui.menu('Approve this action once?', [
            {value:'deny',label:'Deny'}, {value:'allow',label:'Allow once'},
            {value:'details',label:details?'Collapse details':'Expand details'},
          ], {lines:[action.name, ...approvalLines(action).slice(0,10), ...(details ? [`Session: ${action.sessionId}`, `Tool call: ${action.toolCallId ?? 'host review'}`, `Content digest: ${permission.digest}`, `Expires: ${new Date(permission.expiresAt).toLocaleTimeString()}`] : [])]});
          if (choice === 'details') { details = !details;if(details)await this.ui.page('Full action details',[...approvalLines(action),`Session: ${action.sessionId}`,`Tool call: ${action.toolCallId??'host review'}`,`Content digest: ${permission.digest}`,`Expires: ${new Date(permission.expiresAt).toLocaleTimeString()}`]);continue; }
          return choice === 'allow' && Date.now() < permission.expiresAt;
        }
      } finally {
        if (attached) {
          try{this.ui.stop();}catch{this.record({phase:'terminal_restoration',code:'terminal_restore_failed'});}
          if (this.attached && !this.ui.terminated) {
            this.ui.input.setRawMode(true); this.ui.input.resume(); this.ui.input.on('data',this.onData);
            this.reviewing = false; this.resize(true);
          }
        }
        this.reviewing = false;
      }
    });
    this.tail = pending.catch(() => false); return pending;
  }
  send(frame) { if (this.child && !this.child.stdin.destroyed) this.child.stdin.write(JSON.stringify(frame)+'\n'); }
  resize(redraw=false) { this.send({columns:Math.max(2,this.ui.output.columns||80),rows:Math.max(2,this.ui.output.rows||24),redraw}); }
  async attach(executable, args, environment, signal) {
    if (this.attached || this.ui.started || !this.ui.input.isTTY) throw new ClientError('terminal_operation_busy');
    const input=this.ui.input,output=this.ui.output,raw=!!input.isRaw,flowing=input.readableFlowing;
    let lines='',outcome,primary;
    const captured=spawnSync('/bin/stty',['-g'],{stdio:[input,'pipe','ignore'],encoding:'utf8',timeout:1000});
    const terminalState=captured.status===0?captured.stdout.trim():undefined;
    if(!terminalState||!/^[A-Za-z0-9_=;:-]+$/.test(terminalState))throw new ClientError('terminal_state_unavailable');
    this.attached = true;
    this.child = spawn('python3',[fileURLToPath(new URL('./terminal-pty.py',import.meta.url))],{env:{PATH:'/opt/homebrew/bin:/usr/bin:/bin'},stdio:['pipe','pipe','ignore']});
    this.send({command:[executable,...args],environment,columns:Math.max(2,output.columns||80),rows:Math.max(2,output.rows||24)});
    this.onData=b=>{if(!this.reviewing)this.send({input:Buffer.from(b).toString('base64')});};
    const resize=()=>this.resize(),abort=()=>this.child?.kill('SIGTERM');
    input.setRawMode(true);input.resume();input.on('data',this.onData);output.on('resize',resize);signal?.addEventListener('abort',abort,{once:true});
    try {
      await new Promise((resolve,reject)=>{
        this.child.stdout.on('data',b=>{lines+=b;try{if(lines.length>262144)throw new ClientError('pty_frame_limit');let at;while((at=lines.indexOf('\n'))>=0){const frame=JSON.parse(lines.slice(0,at));lines=lines.slice(at+1);if(frame.output&&!this.reviewing)output.write(Buffer.from(frame.output,'base64'));if(Object.hasOwn(frame,'exitCode'))outcome=frame;}}catch(e){abort();reject(e);}});
        this.child.once('error',()=>reject(new ClientError('guest_console_failed')));
        this.child.once('close',()=>{if(this.reviewing)this.ui.pending?.resolve(null);this.record({phase:'console',...outcome,...(outcome?.exitCode!==0?{code:signal?.aborted?'runtime_cancelled':'guest_console_cancelled'}:{})});if(outcome?.exitCode===0)resolve();else reject(Object.assign(new ClientError(signal?.aborted?'runtime_cancelled':'guest_console_cancelled'),outcome));});
        if(signal?.aborted)abort();
      });
    } catch(e) { primary=e; }
    finally {
      this.attached=false;if(this.reviewing){this.ui.pending?.resolve(null);await this.tail.catch(()=>{});}signal?.removeEventListener('abort',abort);input.removeListener('data',this.onData);output.removeListener('resize',resize);
      try { input.setRawMode(raw);const restored=spawnSync('/bin/stty',[terminalState],{stdio:[input,'ignore','ignore'],timeout:1000});if(restored.status!==0)throw new ClientError('terminal_restore_failed');if(flowing!==true)input.pause();output.write('\x1b[0m\x1b[?25h');this.record({phase:'terminal_restoration',status:'succeeded'}); }
      catch(e) { this.record({phase:'terminal_restoration',code:'terminal_restore_failed'});primary??=new ClientError('terminal_restore_failed'); }
      this.child=undefined;
    }
    if(primary)throw primary;
  }
}
