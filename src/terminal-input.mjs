import { StdinBuffer } from '../coding-runtime/node_modules/@adrouter/tui/dist/stdin-buffer.js';
import { parseKey, isKeyRelease, decodePrintableKey } from '../coding-runtime/node_modules/@adrouter/tui/dist/keys.js';

// The guest can leave enhanced keyboard reporting enabled during host review.
// Reuse its locked decoder, with an independent buffer for each ownership turn.
export function terminalInput(input, onKey) {
  const buffer = new StdinBuffer({ timeout: 50 });
  const sequence = raw => {
    if (isKeyRelease(raw)) return;
    const parsed = parseKey(raw);
    const text = decodePrintableKey(raw);
    // Mouse, color, device and keyboard-negotiation reports are not user text.
    if (!parsed && (text === undefined || raw.startsWith('\x1b'))) return;
    const parts = (parsed ?? '').split('+'), name = parts.pop();
    onKey(text, {
      name: name === 'enter' ? 'return' : name,
      ctrl: parts.includes('ctrl'), shift: parts.includes('shift'),
      meta: parts.includes('alt') || parts.includes('super'), sequence: raw,
    });
  };
  buffer.on('data', sequence);
  buffer.on('paste', text => onKey(text, { name: 'paste', sequence: text }));
  const data = chunk => buffer.process(chunk);
  input.on('data', data);
  return () => { input.removeListener('data', data); buffer.destroy(); buffer.removeAllListeners(); };
}
