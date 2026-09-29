export class ProviderSetupError extends Error {
  constructor(code) { super(code); this.code = code; }
}

export function readHiddenKey(input = process.stdin, output = process.stdout) {
  if (!input.isTTY || !output.isTTY || typeof input.setRawMode !== 'function') {
    throw new ProviderSetupError('interactive_terminal_required');
  }
  output.write('Provider API key (hidden; memory only; Ctrl+C cancels): ');
  return new Promise((resolve, reject) => {
    let value = '';
    const previousRaw = Boolean(input.isRaw);
    const wasPaused = input.isPaused();
    const finish = (error) => {
      input.removeListener('data', onData);
      input.removeListener('end', onEnd);
      input.removeListener('error', onError);
      input.setRawMode(previousRaw);
      if (wasPaused) input.pause();
      output.write('\n');
      if (error) { value = ''; reject(new ProviderSetupError(error)); }
      else { const result = value; value = ''; resolve(result); }
    };
    const onEnd = () => finish('credential_entry_cancelled');
    const onError = () => finish('credential_entry_failed');
    const onData = chunk => {
      for (const char of chunk.toString('utf8')) {
        if (char === '\x03' || char === '\x04') { finish('credential_entry_cancelled'); return; }
        if (char === '\r' || char === '\n') {
          finish(/^[\x21-\x7e]{16,512}$/.test(value) ? null : 'credential_format_invalid'); return;
        }
        if (char === '\x7f' || char === '\b') value = value.slice(0, -1);
        else if (/^[\x21-\x7e]$/.test(char)) value += char;
        else { finish('credential_format_invalid'); return; }
        if (value.length > 512) { finish('credential_format_invalid'); return; }
      }
    };
    input.setRawMode(true);
    input.on('data', onData);
    input.once('end', onEnd);
    input.once('error', onError);
    input.resume();
  });
}
