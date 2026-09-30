import test from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { SandboxRuntime, runtimeEnvironment } from '../src/runtime.mjs';

test('controller receives only explicit runtime environment', () => {
  assert.deepEqual(Object.keys(runtimeEnvironment('/tmp/runtime', '/tmp/lib')).sort(), ['MSB_HOME', 'MSB_LIBKRUNFW_PATH', 'PATH']);
});
test('unverified runtime and unowned sandbox fail closed', async () => {
  const runtime = new SandboxRuntime({ executable: '/tmp/msb', library: '/tmp/lib', home: '/tmp/state' });
  await assert.rejects(runtime.create({ image: 'node:22' }), /runtime_not_verified/);
  await assert.rejects(runtime.run('other-sandbox', ['true']), /sandbox_not_owned/);
  await assert.rejects(runtime.remove('other-sandbox'), /sandbox_not_owned/);
});
test('tampered runtime fails before execution', async () => {
  const dir = await mkdtemp(join(tmpdir(), 'adrnew-test-'));
  try {
    const executable = join(dir, 'msb');
    await writeFile(executable, 'not a trusted executable');
    const runtime = new SandboxRuntime({ executable, library: join(dir, 'lib'), home: join(dir, 'state') });
    await assert.rejects(runtime.verify(), /runtime_digest_mismatch/);
  } finally { await rm(dir, { recursive: true, force: true }); }
});

test('continuous guest omits maximum duration and keeps explicit idle watchdog touch',async()=>{
 const runtime=new SandboxRuntime({executable:'/tmp/msb',library:'/tmp/lib',home:'/tmp/state'});runtime.verified=true;
 const calls=[];runtime.call=async args=>{calls.push(args);return '';};
 const image='node@sha256:'+'a'.repeat(64);
 const name=await runtime.create({image,continuous:true});
 assert.equal(calls[0].includes('--max-duration'),false);assert.equal(calls[0][calls[0].indexOf('--idle-timeout')+1],'60s');
 await runtime.touch(name);assert.deepEqual(calls[1],['ping',name,'--touch']);
 await runtime.remove(name);
 await runtime.create({image,durationSeconds:540});assert.ok(calls.at(-1).includes('--max-duration'));
});
