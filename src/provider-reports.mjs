import { createHash, randomUUID } from 'node:crypto';
import { constants } from 'node:fs';
import { open, writeFile, rename, unlink, lstat, readdir } from 'node:fs/promises';
import { dirname, join } from 'node:path';
import { ClientError } from './network.mjs';

export const SETUP_POLICY = 'single_request_setup_v1';
export function reportDigest(value) {
  const ordered = v => Array.isArray(v) ? v.map(ordered) : v && typeof v === 'object' ? Object.fromEntries(Object.entries(v).sort(([a], [b]) => a.localeCompare(b)).map(([k, x]) => [k, ordered(x)])) : v;
  return createHash('sha256').update(JSON.stringify(ordered(value))).digest('hex');
}
const uuid = v => typeof v === 'string' && /^[a-f0-9-]{36}$/i.test(v);
export function completionPayload(value) {
  if (!uuid(value?.id) || !['streaming','tools','completed'].every(k => typeof value[k] === 'boolean')) throw new ClientError('completion_report_invalid');
  const usage = {};
  for (const key of ['input','output','cacheRead','cacheWrite','reasoning', ...(value.usage?.cacheWrite1h === undefined ? [] : ['cacheWrite1h'])]) {
    const v = value.usage?.[key];
    if (!(key === 'reasoning' && v === null) && (!Number.isSafeInteger(v) || v < 0 || v > 1048576)) throw new ClientError('completion_report_invalid');
    usage[key] = v;
  }
  return { id:value.id, usage, streaming:value.streaming, tools:value.tools, completed:value.completed };
}
// Only accounting/control metadata is stored. The response itself is never saved.
export class ProviderReports {
  constructor(lifecycle) { this.lifecycle = lifecycle; this.directory = dirname(lifecycle.path); }
  async save(binding, input, delivery = 'pending') {
    const payload = completionPayload(input);
    if (!uuid(binding.nodeId) || !uuid(binding.providerRunId) || !uuid(binding.installationId)) throw new ClientError('completion_binding_invalid');
    const value = { schemaVersion:1, nodeId:binding.nodeId, providerRunId:binding.providerRunId, installationId:binding.installationId, nativeRevision:binding.nativeRevision ?? 0, payload, digest:reportDigest(payload), delivery };
    await this.lifecycle.prepare();
    const path = join(this.directory, 'report-' + payload.id + '.json'), temporary = path + '.' + randomUUID() + '.tmp';
    try { await writeFile(temporary, JSON.stringify(value), { flag:'wx', mode:0o600 }); await rename(temporary,path); }
    finally { await unlink(temporary).catch(e => { if(e.code!=='ENOENT')throw e; }); }
    return value;
  }
  async pending() {
    await this.lifecycle.prepare(); const values=[];
    for (const name of (await readdir(this.directory)).filter(n=>/^report-[a-f0-9-]{36}\.json$/.test(n)).slice(0,32)) {
      const file=await open(join(this.directory,name),constants.O_RDONLY|constants.O_NOFOLLOW|constants.O_NONBLOCK);
      try {
        const stat=await file.stat(); if(!stat.isFile()||stat.uid!==process.getuid()||stat.nlink!==1||(stat.mode&0o077)||stat.size>8192)throw new ClientError('completion_report_unsafe');
        const value=JSON.parse(await file.readFile('utf8'));
        if(value.nodeId!==this.lifecycle.nodeId||value.providerRunId!==this.lifecycle.providerRunId||reportDigest(completionPayload(value.payload))!==value.digest)throw new ClientError('completion_report_invalid');
        if(value.delivery!=='confirmed')values.push(value);
      }finally{await file.close();}
    }
    return values;
  }
  async confirm(record) {
    const started=Date.now();
    try { await this.save(record,record.payload,'confirmed'); }
    catch(error) { throw Object.assign(error,{operation:'setup_report_save',elapsedMs:Date.now()-started}); }
  }
  async deliver(network, record, { signal, now=Date.now } = {}) {
    const expires=now()+45000;
    for(let attempt=0;attempt<3&&now()<expires;attempt++) {
      signal?.throwIfAborted();
      try {
        const result=await network.request(`/v2/providers/nodes/${record.nodeId}/pi-checks/complete`,{method:'POST',body:record.payload,signal:signal?AbortSignal.any([signal,AbortSignal.timeout(Math.min(10000,expires-now()))]):AbortSignal.timeout(Math.min(10000,expires-now()))});
        if(typeof result?.passed!=='boolean')throw new ClientError('invalid_network_response');
        await this.confirm(record); return result;
      } catch(error) {
        if(signal?.aborted)throw error;
        if(!['network_unavailable_outcome_unknown','invalid_network_response'].includes(error.code)&&!(error.status>=500))throw error;
        try {
          const node=await network.request(`/v2/providers/nodes/${record.nodeId}?view=diagnostics`,{signal:AbortSignal.timeout(Math.min(5000,Math.max(1,expires-now())))});
          const check=node.nativeChecks?.[record.payload.id];
          if(check?.state==='settled'&&check.reportDigest===record.digest&&check.installationId===record.installationId&&check.providerRunId===record.providerRunId){await this.confirm(record);return {passed:check.passed};}
          if(check?.state==='settled'&&check.reportDigest!==record.digest)throw new ClientError('pi_report_conflict');
        } catch(inspectError) { if(inspectError.operation==='setup_report_save'||inspectError.code==='pi_report_conflict'||inspectError.status===401||inspectError.status===403)throw inspectError; }
        if(attempt===2)throw error;
      }
    }
    throw new ClientError('result_report_unconfirmed');
  }
}
