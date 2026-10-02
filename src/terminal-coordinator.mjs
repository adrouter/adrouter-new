import { presentToolLine } from './tool-presentation.mjs';
import { spawn, spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { renderScreen } from './tui-screen.mjs';
import { ClientError } from './network.mjs';

export function approvalLines(action) {
  const args = action.args ?? {};
  if (action.name === 'bash' || action.name === 'operator_command') return ['┌─ Command ─',...String(args.command??'').split('\n').map(line=>'│ '+line.replaceAll('\t','    ')), '└────────────', 'Working directory: /workspace', `Timeout: ${args.timeout ?? 120} seconds`];
  if (action.changes) return action.changes.flatMap(c => [`${c.kind}: ${c.path}`, ...(c.diff ?? (c.content === null ? ['- File deleted'] : String(c.content).split('\n').map(l => `+ ${l}`)))]);
  if (['write', 'edit'].includes(action.name)) return [`${action.name} · ${args.path}`, ...(action.diff ?? [`- ${args.oldText ?? ''}`, `+ ${args.newText ?? args.content ?? ''}`])];
  return [action.name, ...JSON.stringify(args, null, 2).split('\n')];
}
export const reviewLines=action=>approvalLines(action).map((text,index)=>presentToolLine(text,{kind:text.startsWith('+')?'added':text.startsWith('-')?'removed':text.startsWith('@@')?'heading':undefined,path:action.args?.path,command:['bash','operator_command'].includes(action.name)&&text.startsWith('│ '),title:index===0}));
export class TerminalModes {
  constructor(){this.states=new Map();this.tail='';}
  observe(bytes){const text=this.tail+bytes.toString('utf8');for(const m of text.matchAll(/\x1b\[\?(1049|1000|1002|1003|1006|2004|25)([hl])/g))this.states.set(m[1],m[2]);this.tail=text.slice(-80);}
  restore(){return '\x1b[0m'+[...this.states].filter(([k])=>k!=='1049').map(([k,v])=>`\x1b[?${k}${v}`).join('');}
}
export class TerminalCoordinator {
  constructor(ui,record=()=>{}){this.ui=ui;this.record=record;this.tail=Promise.resolve();this.state='workspace';this.reviewing=false;}
  setControl(control){this.control=control;}
  async transition(operation){if(this.control)await this.control(operation);}
  workspace(){if(this.state!=='coding')throw new ClientError('terminal_operation_busy');this.state='workspace';this.detachWait?.();}
  close(){this.state='closed';this.child?.kill('SIGTERM');this.detachWait?.();this.ui.pending?.resolve(null);}
  approve(action,permission){
    const pending=this.tail.then(async()=>{
      if(Date.now()>=permission.expiresAt)return false;
      const inline=this.attached&&this.state==='coding',modes=this.modes?.restore();let draw,ownedStart;
      this.reviewing=true;
      const expiry=setTimeout(()=>this.ui.pending?.resolve(null),Math.max(1,permission.expiresAt-Date.now()));
      try{
        if(inline){
          this.ui.input.removeListener('data',this.onData);
          await this.transition('suspend');this.state='approval';
          this.ui.start({borrowScreen:true});
          draw=this.ui.draw;
          this.ui.draw=screen=>{
            if(screen)this.ui.screen=screen;
            if(!this.ui.started||!this.ui.screen)return;
            const rows=Math.max(2,this.ui.output.rows||24),height=Math.min(rows,Math.max(14,Math.floor(rows*.55)));
            const start=Math.min(ownedStart??rows,rows-height+1);ownedStart=start;
            this.ui.output.write('\x1b[0m'+Array.from({length:rows-start+1},(_,i)=>`\x1b[${start+i};1H\x1b[2K`).join('')+`\x1b[${rows-height+1};1H`+renderScreen({...this.ui.screen,context:'Host approval · conversation above',sidebar:[]},this.ui.output.columns||80,height,this.ui.color));
          };
        }
        let details=false;
        for(;;){
          const choice=await this.ui.menu('Approve this action once?',[
            {value:'deny',label:'Deny'},{value:'allow',label:'Allow once'},{value:'details',label:details?'Collapse details':'Expand details'},
          ],{fixedActions:true,compact:true,footer:'↑↓ / Tab Action  Enter Choose  PgUp/PgDn Preview  Esc Deny',lines:[...reviewLines(action),...(details?[`Project: ${action.root??'/workspace'}`,`Snapshot: ${action.snapshotRevision??'live tool'}`,`Content digest: ${permission.digest}`]:[])]});
          if(choice==='details'){details=!details;continue;}
          return choice==='allow'&&Date.now()<permission.expiresAt;
        }
      }finally{
        clearTimeout(expiry);
        if(inline){
          if(draw)this.ui.draw=draw;
          this.ui.stop();
          if(this.attached&&this.state!=='closed'&&!this.ui.terminated){
            this.ui.input.setRawMode(true);this.ui.input.resume();this.ui.output.write(modes??'');
            this.state='resuming';await this.transition('resume');this.state='coding';
            this.ui.input.on('data',this.onData);
          }
        }
        this.reviewing=false;
      }
    });this.tail=pending.catch(()=>false);return pending;
  }
  send(frame){if(this.child&&!this.child.stdin.destroyed)this.child.stdin.write(JSON.stringify(frame)+'\n');}
  resize(){this.send({columns:Math.max(2,this.ui.output.columns||80),rows:Math.max(2,this.ui.output.rows||24)});}
  async attach(executable,args,environment,signal){
    if(this.attached||this.ui.started||!this.ui.input.isTTY||this.state==='closed')throw new ClientError('terminal_operation_busy');
    const input=this.ui.input,output=this.ui.output,raw=!!input.isRaw,flowing=input.readableFlowing;
    const captured=spawnSync('/bin/stty',['-g'],{stdio:[input,'pipe','ignore'],encoding:'utf8',timeout:1000});
    const terminalState=captured.status===0?captured.stdout.trim():undefined;
    if(!terminalState||!/^[A-Za-z0-9_=;:-]+$/.test(terminalState))throw new ClientError('terminal_state_unavailable');
    const continuing=!!this.child;this.attached=true;
    if(!this.child){
      this.modes=new TerminalModes();let lines='',outcome;
      this.child=spawn('python3',[fileURLToPath(new URL('./terminal-pty.py',import.meta.url))],{env:{PATH:'/opt/homebrew/bin:/usr/bin:/bin'},stdio:['pipe','pipe','ignore']});
      this.exit=new Promise((resolve,reject)=>{
        this.child.stdout.on('data',b=>{lines+=b;try{if(lines.length>262144)throw new ClientError('pty_frame_limit');let at;while((at=lines.indexOf('\n'))>=0){const frame=JSON.parse(lines.slice(0,at));lines=lines.slice(at+1);if(frame.output){const bytes=Buffer.from(frame.output,'base64');if(['coding','resuming'].includes(this.state)){this.modes.observe(bytes);output.write(bytes);}}if(Object.hasOwn(frame,'exitCode'))outcome=frame;}}catch(e){this.close();reject(e);}});
        this.child.once('error',()=>reject(new ClientError('guest_console_failed')));
        this.child.once('close',()=>{this.state='closed';this.child=undefined;this.ui.pending?.resolve(null);this.record({phase:'console',...outcome});if(outcome?.exitCode===0)resolve();else reject(Object.assign(new ClientError(signal?.aborted?'runtime_cancelled':'guest_console_cancelled'),outcome));});
      });this.exit.catch(()=>{});
      this.send({command:[executable,...args],environment,columns:Math.max(2,output.columns||80),rows:Math.max(2,output.rows||24)});
    }
    this.onData=b=>{if(this.state==='coding'&&!this.reviewing)this.send({input:Buffer.from(b).toString('base64')});};
    const resize=()=>this.resize(),abort=()=>this.close();let primary;
    input.setRawMode(true);input.resume();input.on('data',this.onData);output.on('resize',resize);signal?.addEventListener('abort',abort,{once:true});
    try{
      this.state=continuing?'resuming':'coding';
      const detached=new Promise(r=>this.detachWait=r);
      if(continuing){this.resize();await this.transition('resume');this.state='coding';}
      if(signal?.aborted)this.close();
      await Promise.race([this.exit,detached]);
    }catch(e){primary=e;this.close();}
    finally{
      this.attached=false;this.detachWait=undefined;signal?.removeEventListener('abort',abort);input.removeListener('data',this.onData);output.removeListener('resize',resize);
      if(this.reviewing){this.ui.pending?.resolve(null);await this.tail.catch(()=>{});}
      try{input.setRawMode(raw);const result=spawnSync('/bin/stty',[terminalState],{stdio:[input,'ignore','ignore'],timeout:1000});if(result.status!==0)throw Error();if(flowing!==true)input.pause();output.write('\x1b[0m\x1b[?25h\x1b[?1000l\x1b[?1002l\x1b[?1003l\x1b[?1006l\x1b[?2004l\x1b[<u\x1b[?1049l');this.record({phase:'terminal_restoration',status:'succeeded'});}catch{primary??=new ClientError('terminal_restore_failed');}
    }
    if(primary)throw primary;
  }
}
