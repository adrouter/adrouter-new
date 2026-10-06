import test from 'node:test';
import assert from 'node:assert/strict';
import {randomUUID} from 'node:crypto';
import {spawnSync} from 'node:child_process';
import {mkdtemp,readFile,writeFile,rm} from 'node:fs/promises';
import {join} from 'node:path';
import {tmpdir} from 'node:os';
import {pathToFileURL} from 'node:url';
import {ProviderLifecycle} from '../src/provider-lifecycle.mjs';
const root=process.env.ADR_DIAGNOSTIC_CLIENT_ROOT;
const {retryProviderCleanup,deleteProviderListing,prepareProviderRecovery}=await import(root?pathToFileURL(root+'/src/provider-diagnose.mjs').href:new URL('../src/provider-diagnose.mjs',import.meta.url).href);
const image=JSON.parse(await readFile(new URL('../runtime/guest-images.json',import.meta.url)));

async function fixture({present=true,retire=false}={}){
 const directory=await mkdtemp(join(tmpdir(),'adr-orphan-recovery-'));
 const node={id:randomUUID(),installationId:randomUUID(),providerRunId:randomUUID(),status:'paused',ready:false,cleanupState:'pending',diagnosticCapabilities:{retryCleanup:true},nativeChecks:{},...(retire?{retirementRequestedAt:1}:{})};
 const name='adrnew-'+randomUUID(),origin='https://synthetic.example.test';
 const lifecycle=new ProviderLifecycle({nodeId:node.id,providerRunId:node.providerRunId,directory});
 lifecycle.pid=spawnSync(process.execPath,['-e','']).pid;lifecycle.ownership={nodeId:node.id,providerRunId:node.providerRunId,installationId:node.installationId,origin,guestName:name,createdAt:1};
 lifecycle.event('vm',{status:'ready'});lifecycle.fail({phase:'request',code:'upstream_failed_outcome_unknown',nodeId:node.id,providerRunId:node.providerRunId});await lifecycle.pending;
 let exists=present;const state={posts:[],removes:0,fail:null,wrongImage:false,changed:false,reads:0};
 const network={origin,request:async(path,o={})=>{
  if(o.method==='POST'){
   state.posts.push({path,body:o.body,key:o.key});
   if(path.endsWith('/delete')){node.retirementRequestedAt??=1;if(node.cleanupState==='succeeded')node.status='deleted';return {id:node.id,status:node.status,cleanupState:node.cleanupState,...(node.status==='deleted'?{deletedAt:2}:{})};}
   assert.equal(o.body.providerRunId,node.providerRunId);
   if(path.endsWith('/teardown')){if(state.fail==='teardown')throw Object.assign(Error('synthetic'),{code:'network_unavailable_outcome_unknown'});node.cleanupState='succeeded';if(node.retirementRequestedAt)node.status='deleted';return {providerRunId:node.providerRunId,cleanupState:'succeeded'};}
   if(state.fail==='stop')throw Object.assign(Error('synthetic'),{code:'network_unavailable_outcome_unknown'});
   return node;
  }
  if(path==='/v2/providers/nodes')return node.status==='deleted'?[]:[node];
  state.reads++;if(state.changed&&state.reads===3)node.providerRunId=randomUUID();return structuredClone(node);
 }};
 const runtime={owned:new Set(),verify:async()=>{},call:async()=>JSON.stringify(exists?[{name,state:'Stopped'}]:[]),inspect:async()=>({config:{manifest_digest:state.wrongImage?'wrong':image.node['linux-'+process.arch],network:{policy:{default_egress:'deny'}}}}),remove:async()=>{state.removes++;if(state.fail==='remove')throw Object.assign(Error('synthetic'),{code:'runtime_cleanup_failed'});exists=false;runtime.owned.delete(name);}};
 return {node,network,runtime,directory,lifecycle,state,options:{directory,runtime},close:()=>rm(directory,{recursive:true,force:true})};
}
for(const present of [true,false])test(`old run cleanup verifies ${present?'stopped':'absent'} guest and retains original diagnostic/identity`,async()=>{
 const f=await fixture({present});try{
  const result=await retryProviderCleanup(f.network,f.node.id,'provider',f.options);assert.equal(result.inferenceRequests,0);assert.equal(result.cleanupState,'succeeded');assert.equal(f.state.removes,present?1:0);
  const saved=JSON.parse(await readFile(f.lifecycle.path));assert.equal(saved.pid,f.lifecycle.pid);assert.deepEqual(saved.ownership,f.lifecycle.ownership);assert.equal(saved.terminalFailure.code,'upstream_failed_outcome_unknown');assert.ok(saved.events.some(e=>e.phase==='vm'&&e.status==='ready'));assert.deepEqual(saved.outcomes.map(o=>[o.phase,o.status]),[['remote_stop','succeeded'],['guest_removal','succeeded'],['execution_release','succeeded']]);
  await retryProviderCleanup(f.network,f.node.id,'provider',f.options);assert.equal(f.state.removes,present?1:0);
 }finally{await f.close();}
});
test('failed unclaimed replacement controller cannot shadow the old backend run',async()=>{
 const f=await fixture();let falseStops=0;try{const controller={status:{providerRunId:randomUUID(),stopped:true,teardownVerified:true},stop:async()=>falseStops++};await retryProviderCleanup(f.network,f.node.id,'provider',{...f.options,controller});assert.equal(falseStops,0);assert.equal(f.state.removes,1);assert.equal(f.state.posts[0].body.providerRunId,f.node.providerRunId);}finally{await f.close();}
});
for(const phase of ['stop','remove','teardown'])test(`failed ${phase} records independent cleanup outcome and can safely resume`,async()=>{
 const f=await fixture();try{
  f.state.fail=phase;await assert.rejects(retryProviderCleanup(f.network,f.node.id,'provider',f.options));
  const saved=JSON.parse(await readFile(f.lifecycle.path));assert.equal(saved.terminalFailure.code,'upstream_failed_outcome_unknown');assert.ok(saved.outcomes.some(o=>o.status==='failed'));
  f.state.fail=null;await retryProviderCleanup(f.network,f.node.id,'provider',f.options);assert.equal(f.node.cleanupState,'succeeded');assert.equal(f.state.removes,phase==='remove'?2:1);
 }finally{await f.close();}
});
for(const reason of ['live','missing','installation','image','superseded'])test(`recovery refuses ${reason} ownership and preserves newer work`,async()=>{
 const f=await fixture();try{
  if(reason==='live'){const x=JSON.parse(await readFile(f.lifecycle.path));x.pid=process.pid;await writeFile(f.lifecycle.path,JSON.stringify(x),{mode:0o600});}
  if(reason==='missing'){const x=JSON.parse(await readFile(f.lifecycle.path));x.ownership=null;await writeFile(f.lifecycle.path,JSON.stringify(x),{mode:0o600});}
  if(reason==='installation')f.node.installationId=randomUUID();if(reason==='image')f.state.wrongImage=true;if(reason==='superseded')f.state.changed=true;
  await assert.rejects(retryProviderCleanup(f.network,f.node.id,'provider',f.options));assert.equal(f.state.removes,0);assert.ok(!f.state.posts.some(p=>p.path.endsWith('/teardown')));
 }finally{await f.close();}
});
test('confirmed retirement completes through cleanup and keeps the exact delete intent key',async()=>{
 const f=await fixture({retire:true});try{const key=randomUUID();const result=await deleteProviderListing(f.network,f.node.id,'provider',{...f.options,key});assert.equal(result.status,'deleted');assert.equal(f.state.removes,1);assert.deepEqual(f.state.posts.filter(p=>p.path.endsWith('/delete')).map(p=>p.key),[key,key]);}finally{await f.close();}
});
test('restart first cleans the old run while pending retirement cannot launch another attempt',async()=>{
 const f=await fixture();try{await prepareProviderRecovery(f.network,f.node.id,'provider',f.options);assert.equal(f.node.cleanupState,'succeeded');const count=f.state.posts.length;f.node.retirementRequestedAt=1;await assert.rejects(prepareProviderRecovery(f.network,f.node.id,'provider',f.options),{code:'provider_retirement_pending'});assert.equal(f.state.posts.length,count);}finally{await f.close();}
});
