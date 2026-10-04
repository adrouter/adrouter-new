export class ProviderSetupError extends Error {
  constructor(code) { super(code); this.code = code; }
}

export function readHiddenKey(input = process.stdin, output = process.stdout, prompt = 'Provider API key (hidden; memory only; Ctrl+C cancels): ', {allowEmpty=false,json=false}={}) {
  const maximum=json?16384:4096;
  const valid=value=>allowEmpty&&!value.length||value.length<=maximum&&(json?(()=>{try{const parsed=JSON.parse(value);return parsed&&typeof parsed==='object'&&!Array.isArray(parsed);}catch{return false;}})():/^[\x20-\x7e]{1,4096}$/.test(value));
  if (!input.isTTY || !output.isTTY || typeof input.setRawMode !== 'function') {
    throw new ProviderSetupError('interactive_terminal_required');
  }
  output.write(prompt);
  return new Promise((resolve, reject) => {
    let value = '', escape = '', paste = '', pasting = false, finished = false;
    let escapeTimer;
    const previousRaw = Boolean(input.isRaw);
    const wasPaused = input.isPaused();
    const finish = (error) => {
      if(finished)return;finished=true;clearTimeout(escapeTimer);
      input.removeListener('data', onData);
      input.removeListener('end', onEnd);
      input.removeListener('error', onError);
      input.setRawMode(previousRaw);
      if (wasPaused) input.pause();
      output.write('\n');
      output.write('\x1b[?2004l');paste='';
      if (error) { value = ''; reject(new ProviderSetupError(error)); }
      else { const result = json?JSON.stringify(JSON.parse(value)):value; value = ''; resolve(result); }
    };
    const onEnd = () => finish('credential_entry_cancelled');
    const onError = () => finish('credential_entry_failed');
    const onData = chunk => {
      for (const char of chunk.toString('utf8')) {
        if (char === '\x03' || char === '\x04') { finish('credential_entry_cancelled'); return; }
        if(char==='\x1b'||escape){
          escape+=char;clearTimeout(escapeTimer);
          if(escape==='\x1b[200~'&&!pasting){pasting=true;paste='';escape='';continue;}
          if(escape==='\x1b[201~'&&pasting){pasting=false;value+=paste.replace(/[\r\n]+$/,'');paste='';escape='';if(!valid(value)){finish('credential_format_invalid');return;}continue;}
          if(!['\x1b[200~','\x1b[201~'].some(s=>s.startsWith(escape))){finish('credential_format_invalid');return;}
          escapeTimer=setTimeout(()=>finish('credential_entry_cancelled'),250);continue;
        }
        if(pasting){paste+=char;if(paste.length>maximum+2){finish('credential_format_invalid');return;}continue;}
        if (char === '\r' || char === '\n') {
          finish(valid(value) ? null : 'credential_format_invalid'); return;
        }
        if (char === '\x7f' || char === '\b') value = value.slice(0, -1);
        else if (/^[\x20-\x7e]$/.test(char)) value += char;
        else { finish('credential_format_invalid'); return; }
        if (value.length > maximum) { finish('credential_format_invalid'); return; }
      }
    };
    input.setRawMode(true);
    output.write('\x1b[?2004h');
    input.on('data', onData);
    input.once('end', onEnd);
    input.once('error', onError);
    input.resume();
  });
}
