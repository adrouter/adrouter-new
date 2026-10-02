import { safeText } from './network.mjs';
import { highlightCode, getLanguageFromPath, initTheme } from '../coding-runtime/node_modules/@adrouter/cli/dist/modes/interactive/theme/theme.js';
initTheme('dark',false);
export function presentToolLine(text,{kind,path,command=false,title=false}={}) {
  text=safeText(text).replaceAll('\t','    ');
  const color=kind==='added'?32:kind==='removed'?31:title?36:undefined;
  const highlighted=highlightCode(text,command?'bash':getLanguageFromPath(path??''))[0]??text;
  const styled=color?`\x1b[${color}m${text}\x1b[0m`:highlighted;
  return {text,kind,styled};
}
