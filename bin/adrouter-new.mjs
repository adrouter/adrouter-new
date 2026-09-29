#!/usr/bin/env node
import { SandboxRuntime } from '../src/runtime.mjs';

const args = process.argv.slice(2);
const json = args.includes('--json');
const command = args.filter(x => x !== '--json');
function report(value) { console.log(json ? JSON.stringify(value) : Object.entries(value).map(([k, v]) => `${k}: ${v}`).join('\n')); }
if (command.length === 1 && command[0] === 'doctor') {
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
  report({ status: 'development', usage: 'adrouter-new [--json] doctor', marketplace: 'not_released' });
  if (command.length) process.exitCode = 1;
}
