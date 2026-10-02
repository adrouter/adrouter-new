import { visibleWidth, truncateToWidth, wrapTextWithAnsi } from '../coding-runtime/node_modules/@adrouter/tui/dist/utils.js';
import { spawnSync } from 'node:child_process';
import { renderBanner } from './brand.mjs';
import { fuzzyFilter } from './vendor/pi/fuzzy.mjs';
import { terminalInput } from './terminal-input.mjs';
import { safeText, ClientError } from './network.mjs';
import { readFile } from 'node:fs/promises';

const { version } = JSON.parse(await readFile(new URL('../package.json', import.meta.url), 'utf8'));
const clean = value => safeText(value).replace(/[\r\n\t]/g, ' ');
const clip = (value,width) => truncateToWidth(clean(value),Math.max(0,width),'').replace(/\x1b\[[0-9;]*m/g,'');
export { visibleWidth };
export function wrapText(value,width) {return safeText(value).split('\n').flatMap(line=>wrapTextWithAnsi(line.replaceAll('\t','    '),Math.max(1,width)).map(v=>truncateToWidth(v,Math.max(1,width),'').replace(/\x1b\[[0-9;]*m/g,'')));}
const styledWrap=(line,width)=>wrapTextWithAnsi(line.styled,Math.max(1,width)).map(styled=>({...line,text:styled.replace(/\x1b\[[0-9;]*m/g,''),styled}));
export function scrollRows(lines,capacity,offset) {
  offset=Math.max(0,Math.min(Math.max(0,lines.length-capacity),offset));
  const result=lines.slice(offset,offset+capacity);
  if(offset>0&&result.length)result[0]='↑';
  if(offset+capacity<lines.length&&result.length)result[result.length-1]='↓';
  return result;
}

// All untrusted labels and values are plain text. Only this renderer emits ANSI.
export function renderScreen({ title, subtitle = '', lines = [], details = [], focus = 0, footer = '', context = '', sidebar = [],actions=[],detailFocus=0 }, columns = 80, rows = 24, color = true) {
  if(sidebar.length && columns>=112 && !title.toLowerCase().includes('approv')) {
    const sideWidth=30,leftWidth=columns-sideWidth-3;
    const left=renderScreen({title,subtitle,lines,focus,footer,context,actions},leftWidth,rows,color).split('\r\n');
    const status=sidebar.slice(0,Math.max(0,rows-9)),description=details.flatMap(v=>wrapText(v,sideWidth)),room=Math.max(1,Math.min(8,rows-status.length-3));
    const side=[...status,...Array(Math.max(0,rows-2-status.length-room)).fill(''),'─'.repeat(sideWidth),...scrollRows(description,room,detailFocus)];
    return left.map((line,i)=>{const visible=visibleWidth(line);return line+' '.repeat(Math.max(1,leftWidth-visible))+'│ '+clip(side[i]??'',sideWidth);}).join('\r\n');
  }
  const width = Math.max(1, columns - 2); const height = Math.max(1, rows - 1);
  const blue = text => color ? `${/truecolor|24bit/.test(process.env.COLORTERM ?? '') ? '\x1b[38;2;63;101;245m' : '\x1b[38;5;63m'}${text}\x1b[0m` : text;
  const result = [];
  // The original panel is 16 rows; only show it when navigation still fits.
  if (width >= 68 && height >= 16 + Math.min(lines.length, 10) + 8) {
    result.push(...renderBanner(width, version, clean(context), color,
      /truecolor|24bit/.test(process.env.COLORTERM ?? '') ? 'truecolor' : '256color'));
  } else result.push(blue(clip(`adr v2 · v${version}`, width)), clip(context, width));
  result.push(blue('─'.repeat(width)), clip(title, width));
  if (subtitle) result.push(...wrapText(subtitle, width));
  result.push('');
  // A compact header must leave room to interact even after a terminal resize.
  if(actions.length&&result.at(-1)==='')result.pop();
  while (result.length > Math.max(1, height - Math.max(5,actions.length+3))) result.splice(0, 1);
  const description=details.flatMap(v=>wrapText(v,width));
  const pinned=scrollRows(description,Math.min(3,Math.max(0,height-result.length-3-actions.length)),detailFocus);
  const capacity = Math.max(1, height - result.length - 2 - pinned.length - actions.length);
  const offset = Math.max(0, Math.min(Math.max(0, lines.length - capacity), focus - Math.floor(capacity / 2)));
  for (const [index, line] of scrollRows(lines,capacity,offset).entries()) {
    const text = typeof line === 'object' ? line.text : line;
    const selected = typeof line === 'object' && line.selected;
    let rendered = color&&typeof line==='object'&&line.styled?truncateToWidth(line.styled,width,''):clip(text,width);
    if(color && typeof line==='object' && ['added','removed','heading'].includes(line.kind)) rendered=`\x1b[${line.kind==='added'?'32':line.kind==='removed'?'31':'36'}m${rendered}\x1b[0m`;
    result.push(selected && color ? `\x1b[7m${rendered+' '.repeat(Math.max(0,width-visibleWidth(rendered)))}\x1b[0m` : rendered);
  }
  while (result.length < height - 2 - pinned.length - actions.length) result.push('');
  result.push(...pinned);
  for(const action of actions){const text=clip(action.text,width);result.push(color&&action.selected?'\x1b[7m'+text+' '.repeat(Math.max(0,width-visibleWidth(text)))+'\x1b[0m':text);}
  result.push(blue('─'.repeat(width)), clip(footer, width));
  return result.slice(0, height).join('\r\n');
}

export class TerminalUI {
  constructor({ input = process.stdin, output = process.stdout, color = !process.env.NO_COLOR, reducedMotion = process.env.ADR_REDUCED_MOTION === '1' } = {}) {
    this.input = input; this.output = output; this.color = color && process.env.TERM !== 'dumb'; this.context = '';this.sidebar=[];this.reducedMotion=reducedMotion;
    this.resize = () => this.pending?.redraw?this.pending.redraw():this.draw();
    this.onKey = (text, key = {}) => {
      if (key.ctrl && key.name === 'c') { this.pending?.resolve(null); return; }
      this.pending?.key(text, key);
    };
  }
  start({borrowScreen=false} = {}) {
    if(this.started)return;
    if (this.terminated) throw new ClientError('cancelled');
    if (!this.input.isTTY || !this.output.isTTY) throw new ClientError('interactive_terminal_required');
    if(this.input===process.stdin){const captured=spawnSync('/bin/stty',['-g'],{stdio:[this.input,'pipe','ignore'],encoding:'utf8',timeout:1000});this.terminalState=captured.status===0?captured.stdout.trim():undefined;if(!this.terminalState||!/^[A-Za-z0-9_=;:-]+$/.test(this.terminalState))throw new ClientError('terminal_state_unavailable');}
    this.wasRaw = !!this.input.isRaw; this.wasPaused = this.input.isPaused(); this.wasFlowing = this.input.readableFlowing;
    this.releaseInput = terminalInput(this.input, this.onKey);
    this.input.setRawMode(true); this.input.resume();
    this.input.on('keypress', this.onKey); this.output.on('resize', this.resize);
    this.borrowScreen=borrowScreen;this.output.write((borrowScreen?'':'\x1b[?1049h')+'\x1b[?25l\x1b[?1000l\x1b[?1002l\x1b[?1003l\x1b[?1006l\x1b[?2004l'); this.started = true;
  }
  stop() {
    if (!this.started) return;
    this.pending?.resolve(null);
    this.input.removeListener('keypress', this.onKey); this.output.removeListener('resize', this.resize);
    this.releaseInput?.(); this.releaseInput = undefined;
    let restorationFailure;try{this.input.setRawMode(this.wasRaw);}catch{restorationFailure=new ClientError('terminal_restore_failed');}
    if(this.terminalState){const restored=spawnSync('/bin/stty',[this.terminalState],{stdio:[this.input,'ignore','ignore'],timeout:1000});if(restored.status!==0)restorationFailure=new ClientError('terminal_restore_failed');}
    // Fresh stdin has readableFlowing=null, not isPaused=true. Leaving it
    // resumed after removing the UI listener keeps an otherwise finished CLI alive.
    if (this.wasPaused || this.wasFlowing !== true) this.input.pause();
    this.output.write('\x1b[0m\x1b[?25h'+(this.borrowScreen?'':'\x1b[?1049l')); this.started = false;if(restorationFailure)throw restorationFailure;
  }
  terminate() { this.terminated = true; this.stop(); }
  draw(screen) {
    if (screen) this.screen = screen;
    if (this.started && this.screen) this.output.write('\x1b[0m\x1b[H\x1b[2J' + renderScreen({ ...this.screen, context: this.context, sidebar:this.sidebar }, this.output.columns || 80, this.output.rows || 24, this.color));
  }
  interact(key, draw) {
    if (this.terminated) return Promise.reject(new ClientError('cancelled'));
    if (this.pending) throw new ClientError('terminal_operation_busy');
    return new Promise(resolve => {
      const finish = value => { this.pending = null; resolve(value); };
      this.pending = { key: (text, press) => key(text, press, finish), resolve: finish };
      draw();
    });
  }
  async menu(title, options, { subtitle = '', lines = [], fixedActions=false, tick=false, footer='↑↓ Move  Enter Choose  Type to filter  Esc Back  Ctrl+C Cancel' } = {}) {
    let selected = 0; let search = '',previewFocus=0,detailFocus=0,fullDetails=false;
    options=options.filter(o=>!(typeof o==='object'&&o.value==='back'&&options.filter(v=>v.value!=='back').length===1));
    const items = options.map((item, index) => typeof item === 'string' ? { label: item, value: index } : item);
    const visible = () => fuzzyFilter(items, search, item => clean(`${item.label} ${item.detail ?? ''}`));
    const draw = () => {
      const choices = visible(); selected = Math.min(selected, Math.max(0, choices.length - 1));
      const bodyWidth=Math.max(1,(this.output.columns||80)-2-(this.sidebar.length&&(this.output.columns||80)>=112&&!fixedActions?33:0));
      const body = (typeof lines==='function'?lines():lines).flatMap(line => typeof line==='object'&&line.styled?styledWrap(line,bodyWidth):wrapText(typeof line==='object'?line.text:line,bodyWidth).map(text=>typeof line==='object'?{...line,text}:text));
      const start = body.length;
      const actions=[];choices.forEach((item, index) => (fixedActions?actions:body).push({ text: `${selected === index ? '›' : ' '} ${item.label}${item.disabled ? ' · unavailable' : ''}`, selected: selected === index }));
      if (!choices.length) body.push('No matching options. Backspace clears the search.');
      if(search)body.push(`Filter: ${search}`);
      const details=choices[selected]?.details??(choices[selected]?.detail?[choices[selected].detail]:[]);
      if(fullDetails){this.draw({title:'Full details',lines:details.flatMap(v=>wrapText(v,Math.max(1,(this.output.columns||80)-2))),focus:detailFocus,footer:'↑↓ / PgUp/PgDn Scroll  F / Enter / Esc Close details'});return;}
      this.draw({title,subtitle,lines:body,actions,focus:fixedActions?previewFocus:start+selected,detailFocus,details:fullDetails?[]:details,footer:footer+(details.length?'  F Full details · PgUp/PgDn Details':'')});
    };
    const interaction=this.interact((text, key, finish) => {
      const choices = visible();
      if(fullDetails){if(['escape','return'].includes(key.name)||text==='f')fullDetails=false;else if(['up','pageup'].includes(key.name))detailFocus=Math.max(0,detailFocus-(key.name==='up'?1:5));else if(['down','pagedown'].includes(key.name))detailFocus+=key.name==='down'?1:5;draw();return;}
      if (key.name === 'escape') { finish(null); return; }
      if(key.name==='pageup'||key.name==='pagedown'){const delta=key.name==='pageup'?-5:5;if(fixedActions)previewFocus=Math.max(0,previewFocus+delta);else detailFocus=Math.max(0,detailFocus+delta);}
      else if(text==='f'&&!fixedActions){fullDetails=!fullDetails;detailFocus=0;}
      else if (key.name === 'up') selected = (selected + choices.length - 1) % Math.max(1, choices.length);
      else if (key.name === 'down' || key.name === 'tab') selected = (selected + 1) % Math.max(1, choices.length);
      else if (key.name === 'return' && choices[selected]) {
        if (!choices[selected].disabled) { finish(choices[selected].value); return; }
      } else if (key.name === 'backspace') { search = search.slice(0, -1); selected = 0; }
      else if (key.ctrl && key.name === 'u') { search = ''; selected = 0; }
      else if (text && !key.ctrl && !key.meta && /^[\x20-\x7e]+$/.test(text)) { search = (search + text).slice(0, 80); selected = 0; }
      draw();
    }, draw);
    if(this.pending)this.pending.redraw=draw;const timer=tick?setInterval(draw,1000):undefined;
    try{return await interaction;}finally{clearInterval(timer);}
  }
  async form(title, fields, initial = {}, subtitle = '') {
    const values = Object.fromEntries(fields.map(f => [f.name, String(initial[f.name] ?? f.default ?? '')]));
    let selected = 0; let replace = true; let error = '';
    const draw = () => {
      const lines = [];
      fields.forEach((f, index) => lines.push({ text: `${selected === index ? '›' : ' '} ${f.label}: ${values[f.name]}${f.choices ? '  ‹ ›' : ''}`, selected: selected === index }));
      lines.push({ text: '  Continue →', selected: selected === fields.length }, '', fields[selected]?.help ?? 'Review your settings on the next screen.', error);
      this.draw({ title, subtitle, lines, focus: selected, footer: '↑↓ / Tab Move  ←→ Options  Type Edit  Ctrl+U Clear  Enter Next  Esc Back' });
    };
    const remember = () => Object.assign(initial, values);
    let result;
    this.output.write('\x1b[?2004h');
    try { result = await this.interact((text, key, finish) => {
      if (key.name === 'paste' && typeof text === 'string') text = text.replace(/[\r\n]+$/, '');
      if (key.name === 'escape') { finish(null); return; }
      const field = fields[selected];
      if (key.name === 'up' || (key.name === 'tab' && key.shift)) { selected = (selected + fields.length) % (fields.length + 1); replace = true; }
      else if (key.name === 'down' || key.name === 'tab') { selected = (selected + 1) % (fields.length + 1); replace = true; }
      else if (key.name === 'return') {
        if (selected < fields.length) { selected++; replace = true; }
        else {
          const invalid = fields.findIndex(f => f.validate && f.validate(values[f.name], values));
          if (invalid >= 0) { selected = invalid; error = `${fields[invalid].label}: ${fields[invalid].validate(values[fields[invalid].name], values)}`; replace = true; }
          else { finish(values); return; }
        }
      } else if (field?.choices && (key.name === 'left' || key.name === 'right')) {
        const index = field.choices.indexOf(values[field.name]);
        values[field.name] = field.choices[(index + (key.name === 'left' ? -1 : 1) + field.choices.length) % field.choices.length];
      } else if (field && !field.choices) {
        if (key.ctrl && key.name === 'u') { values[field.name] = ''; replace = false; }
        else if (key.name === 'backspace') { values[field.name] = values[field.name].slice(0, -1); replace = false; }
        else if (text && !key.ctrl && !key.meta && /^[\x20-\x7e]+$/.test(text)) {
          values[field.name] = ((replace ? '' : values[field.name]) + text).slice(0, field.maxLength ?? 120); replace = false;
        }
      }
      draw();
    }, draw); }
    finally { this.output.write('\x1b[?2004l'); remember(); }
    return result;
  }
  async page(title, lines, {footer='↑↓ Scroll  Enter / Esc Back',onCancel} = {}) {
    let offset = 0;
    const draw = () => this.draw({ title: typeof title === 'function' ? title() : title, lines: (typeof lines === 'function' ? lines() : lines).flatMap(line => wrapText(typeof line==='object'?line.text:line, Math.max(10, (this.output.columns || 80) - 2)).map(text=>typeof line==='object'?{...line,text}:text)), focus: offset, footer });
    const interaction = this.interact((_text, key, finish) => {
      if (['return', 'escape'].includes(key.name)) { finish(key.name==='escape'?null:true); return; }
      if (key.name === 'down' || key.name === 'pagedown') offset += key.name === 'pagedown' ? 10 : 1;
      if (key.name === 'up' || key.name === 'pageup') offset = Math.max(0, offset - (key.name === 'pageup' ? 10 : 1));
      draw();
    }, draw);
    if (this.pending) this.pending.redraw = draw;
    return interaction.then(async value=>{if(value===null)await onCancel?.();return value;});
  }
  async task(title, work, { lines = [], cancel = false, onKey } = {}) {
    if (this.terminated) throw new ClientError('cancelled');
    const abort = new AbortController();let stage=lines,frame=0;const startedAt=Date.now();
    const redraw=()=>this.draw({title,lines:[...stage,`${this.reducedMotion?'Waiting':['◐','◓','◑','◒'][frame++%4]} · ${Math.floor((Date.now()-startedAt)/1000)} seconds elapsed`],footer:cancel?'Esc / Ctrl+C Cancel':'Running'});
    this.draw({ title, lines, footer: cancel ? 'Esc / Ctrl+C Cancel' : 'Working…' });
    const pending = { resolve: () => { if (cancel||this.terminated) abort.abort(); }, key: (text, key) => { if (key.name === 'escape' && cancel) abort.abort(); else onKey?.(text, key); } };
    if (this.pending) throw new ClientError('terminal_operation_busy');
    this.pending = pending;
    const timer=setInterval(redraw,this.reducedMotion?1000:200);redraw();
    try { const result=await work(abort.signal,update=>{stage=update;redraw();});this.draw({title,lines:stage,footer:'Completed'});return result; }
    catch(e){this.draw({title,lines:stage,footer:abort.signal.aborted?'Cancelled':'Failed'});throw e;}
    finally {clearInterval(timer);if(this.pending===pending)this.pending=null;}
  }
  async suspend(work) {
    this.stop();
    let result,primary;try{result=await work();}catch(e){primary=e;}
    if(!this.terminated)try{this.start();}catch(e){if(primary)primary.restorationCode=e.code;else primary=e;}
    if(primary)throw primary;return result;
  }
}
