import readline from 'node:readline';
import { createInterface } from 'node:readline/promises';
import { ClientError, safeText } from './network.mjs';
export async function ask(label, fallback = '') {
  if (!process.stdin.isTTY || !process.stdout.isTTY) throw new ClientError('interactive_terminal_required');
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  try { const answer = await rl.question(`${safeText(label)}${fallback ? ` [${safeText(fallback)}]` : ''}: `); return answer.trim() || fallback; }
  finally { rl.close(); }
}
export function choose(title, choices) {
  if (!process.stdin.isTTY || !process.stdout.isTTY) throw new ClientError('interactive_terminal_required');
  return new Promise((resolve, reject) => {
    let selected = 0; let rendered = false;
    const input = process.stdin; const output = process.stdout; const raw = !!input.isRaw; const paused = input.readableFlowing !== true;
    readline.emitKeypressEvents(input); input.setRawMode(true); input.resume();
    const width = Math.max(16, output.columns ?? 80);
    output.write(`\n${safeText(title).slice(0, width - 1)}\n`);
    const draw = () => { if (rendered) output.write(`\x1b[${choices.length}A`); for (let i = 0; i < choices.length; i++) output.write(`\x1b[2K${i === selected ? '›' : ' '} ${safeText(choices[i]).slice(0, width - 4)}\n`); rendered = true; };
    const finish = (error) => { input.removeListener('keypress', keypress); input.setRawMode(raw); if (paused) input.pause(); error ? reject(new ClientError('cancelled')) : resolve(selected); };
    const keypress = (_str, key = {}) => {
      if ((key.ctrl && key.name === 'c') || key.name === 'escape') return finish(true);
      if (key.name === 'up') selected = (selected + choices.length - 1) % choices.length;
      if (key.name === 'down') selected = (selected + 1) % choices.length;
      if (key.name === 'return') return finish(false);
      draw();
    };
    input.on('keypress', keypress); draw();
  });
}
export function render(value, json = false) {
  if (json) { console.log(JSON.stringify(value)); return; }
  if (Array.isArray(value?.listings)) {
    console.log('\nCompute listings · test credits, no cash value');
    if (!value.listings.length) console.log('No published listings match. A provider must create and explicitly publish a listing.');
    for (const l of value.listings) console.log(safeText(`\n${l.name} · ${l.model}\n  ${l.supplyClass} · ${l.availability} · ${l.ready ? 'ready' : 'offline'}\n  Input ${l.inputRate} / output ${l.outputRate} credits per ${l.rateDenominator} tokens\n  ${l.id}`));
    if (value.nextCursor) console.log(`Next: market --after ${safeText(value.nextCursor)}`);
  } else console.log(safeText(JSON.stringify(value, null, 2)));
}
