#!/usr/bin/env node
import { run } from '../src/cli.mjs';
import { ClientError } from '../src/network.mjs';
try { await run(process.argv.slice(2)); }
catch (error) {
  const code = error instanceof ClientError ? error.code : 'operation_failed';
  const result = { status: 'error', code };
  if (process.argv.includes('--json')) console.log(JSON.stringify(result)); else console.error(`adr-cli: ${code}`);
  process.exitCode = 1;
}
