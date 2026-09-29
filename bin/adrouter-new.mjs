#!/usr/bin/env node
import { SandboxRuntime } from '../src/runtime.mjs';
import { readHiddenKey, saveDeepSeekKey } from '../src/provider-setup.mjs';

const args = process.argv.slice(2);
const json = args.includes('--json');
const command = args.filter(x => x !== '--json');
function report(value) { console.log(json ? JSON.stringify(value) : Object.entries(value).map(([k, v]) => `${k}: ${v}`).join('\n')); }
if (command.join(' ') === 'provider configure deepseek') {
  try {
    if (json) throw Object.assign(new Error(), { code: 'interactive_terminal_required' });
    await saveDeepSeekKey(await readHiddenKey());
    console.log('DeepSeek key saved locally. No API request was made.');
  } catch (error) {
    const allowed = new Set(['interactive_terminal_required', 'credential_entry_cancelled', 'credential_entry_failed', 'credential_format_invalid', 'credential_directory_unsafe', 'credential_file_unsafe']);
    report({ status: 'not_configured', code: allowed.has(error.code) ? error.code : 'credential_setup_failed' });
    process.exitCode = 1;
  }
} else if (command.length === 1 && command[0] === 'doctor') {
  try {
    const runtime = new SandboxRuntime({
      executable: process.env.ADROUTER_NEW_RUNTIME_EXECUTABLE,
      library: process.env.ADROUTER_NEW_RUNTIME_LIBRARY,
      home: process.env.ADROUTER_NEW_RUNTIME_HOME,
    });
    const identity = await runtime.verify();
    report({ status: 'runtime_verified', ...identity, marketplace: 'not_released' });
  } catch (error) {
    report({ status: 'not_ready', code: error.code ?? 'runtime_unavailable', marketplace: 'not_released' });
    process.exitCode = 1;
  }
} else {
  report({ status: 'development', usage: 'adrouter-new [--json] doctor | provider configure deepseek', marketplace: 'not_released' });
  if (command.length) process.exitCode = 1;
}
