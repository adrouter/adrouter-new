import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { mkdtemp, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { runTui } from '../src/tui.mjs';
import { run } from '../src/cli.mjs';
import { AuthStore, Network } from '../src/network.mjs';

const id = randomUUID();
const config = {protocol:'2.0.0',product:'adr-v2',settlement:'test_credits',cashValue:false,admissions:false,privateRehearsal:true,privateOwnerEvaluation:true,supplyClasses:['authorized_api','self_hosted'],connectorProfile:'inference_connector_v1',maxNodeSessions:1,relay:'wss_single_instance',agentExecution:'buyer_vm_v1',capabilities:['allowance_v1','provider_budget_v1','cold_activation_v1'],activationDeadlineSeconds:120};

for (const confirm of [false,true]) test(`provider deletion ${confirm ? 'confirms and returns to refreshed listings' : 'cancels without a request'}`, async () => {
  let homes=0,views=0,managed=0,deleted=false; const posts=[],pages=[];
  const network={local:true,origin:'http://127.0.0.1:8790',request:async(path,options={})=>{
    if(options.method==='POST'){posts.push({path,body:options.body,key:options.key});deleted=true;return {id,status:'deleted',deletedAt:1};}
    if(path.endsWith('/network/config'))return config;
    if(path==='/v2/providers/nodes')return deleted?[]:[{id,name:'synthetic paused listing',status:'paused'}];
    if(path==='/v2/providers/nodes/'+id)return {id,name:'synthetic paused listing',status:'paused',model:'synthetic',availability:'hot',ready:false,leaseUntil:0};
    if(path.endsWith('/providers/budget'))return {remainingMicrousd:'100',outstandingMicrousd:'2075'};
    throw Error('unexpected synthetic request');
  }};
  const ui={start(){},stop(){},task:(_t,w)=>w(new AbortController().signal,()=>{}),page:async(title)=>pages.push(title),menu:async(title,options)=>{
    if(title==='What would you like to do?')return homes++===0?'providers':'exit';
    if(title==='My provider listings'){if(views++===0)return id;if(confirm)assert.ok(!options.some(o=>o.value===id));return 'back';}
    if(title==='synthetic paused listing'){assert.equal(options.find(o=>o.value==='delete').disabled,false);return managed++===0?'delete':'back';}
    if(title==='Delete paused listing?'){assert.equal(options[0].value,false);assert.equal(options[0].label,'Cancel');return confirm;}
    throw Error('unexpected synthetic screen');
  }};
  await runTui({}, {ui,network,store:{profile:'provider'}});
  assert.equal(posts.length,confirm?1:0);
  if(confirm){assert.equal(posts[0].path,`/v2/providers/nodes/${id}/delete`);assert.deepEqual(posts[0].body,{confirm:true});assert.match(posts[0].key,/^[a-f0-9-]{36}$/);assert.ok(pages.includes('Listing deleted'));}
});

test('provider delete CLI requires explicit confirmation and sends the exact confirmed action', async () => {
  const calls=[],network={request:async(path,options)=>{calls.push({path,...options});return {id,status:'deleted',deletedAt:1};}};
  await assert.rejects(run(['--local','--json','provider','delete',id],{network,output:()=>{}}),/confirmation_required/);assert.equal(calls.length,0);
  await run(['--local','--json','provider','delete',id,'--confirm-delete'],{network,output:()=>{}});
  assert.equal(calls.length,1);assert.equal(calls[0].path,`/v2/providers/nodes/${id}/delete`);assert.deepEqual(calls[0].body,{confirm:true});
});

test('paused node deletion keeps cleanup proof without refreshing disabled installation access', async () => {
  const home=await mkdtemp(join(tmpdir(),'adr-delete-cleanup-')),store=new AuthStore(home);let sends=0;
  try {
    await store.write({origin:'https://example.test',expiresAt:1,refreshPending:true,scope:'marketplace:provider'});
    const network=new Network({origin:'https://example.test',store});network.send=async(path,options)=>{sends++;assert.equal(path,`/v2/providers/nodes/${id}/delete`);assert.ok(options.identity);return {id,status:'deleted',deletedAt:1};};
    await network.request(`/v2/providers/nodes/${id}/delete`,{method:'POST',body:{confirm:true},key:randomUUID()});assert.equal(sends,1);
  } finally {await rm(home,{recursive:true,force:true});}
});
