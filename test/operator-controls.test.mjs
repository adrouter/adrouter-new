import test from 'node:test';
import assert from 'node:assert/strict';
import { runTui, providerFields } from '../src/tui.mjs';
import { run } from '../src/cli.mjs';
const config = { protocol:'2.0.0',product:'adr-v2',settlement:'test_credits',cashValue:false,admissions:false,privateOwnerEvaluation:true,supplyClasses:['authorized_api','self_hosted'],connectorProfile:'inference_connector_v1',maxNodeSessions:1,relay:'wss_single_instance',agentExecution:'buyer_vm_v1',capabilities:['allowance_v1','provider_budget_v1','cold_activation_v1'],activationDeadlineSeconds:120 };
const id = '11111111-1111-4111-8111-111111111111';
const evaluation = { id, sessionId:id, listingId:id, listingRevision:1, cancellationRequestId:id, provisional:true, version:'synthetic', sampleCount:1, elapsedMs:10, passed:false, recordedAt:1, freshUntil:Date.now()+60000, checks:{format:true,tools:true,usage:true,cancellation:false,offlineExecution:true} };
const listing = { id,nodeId:id,name:'Test',model:'test',supplyClass:'authorized_api',availability:'hot',inputRate:'1',outputRate:'2',rateDenominator:'1000000',connectorProfile:'inference_connector_v1',revision:1,publishedAt:1,ready:false,controlOnline:false,activationDeadlineSeconds:120,evaluation };
async function operate(choice, suspended=false) {
  const posts=[], pages=[]; let visits=0;
  const ui={start(){},stop(){},task:(_title,fn)=>fn(new AbortController().signal,()=>{}),page:async(title,lines)=>pages.push({title,lines}),
    menu:async title=>{
      if(title==='What would you like to do?')return ++visits===1?'admin':'exit';
      if(title==='Marketplace operator')return choice;
      if(['Listing suspension','Choose evaluation to review'].includes(title))return id;
      if(['Suspend listing?','Clear suspension?','Record independent cancellation review?'].includes(title))return true;
      throw new Error('Unexpected menu '+title);
    },form:async title=>title==='Independent cancellation review'?{reviewReference:'independent upstream evidence'}:{reason:'operator decision'}};
  const network={local:true,origin:'http://127.0.0.1:8790',request:async(path,options)=>{
    if(options.method==='POST'){posts.push({path,body:options.body});return {};}
    if(path.endsWith('/network/config'))return config;
    if(path.endsWith('/admin/nodes'))return [{id,name:'Test',status:'published',suspended}];
    if(path.endsWith('/admin/evaluations'))return [{nodeId:id,name:'Test',listingId:id}];
    if(path.endsWith('/listings/'+id))return listing;
    throw new Error('Unexpected request '+path);
  }};
  await runTui({}, {ui,network,store:{profile:'operator'}});
  assert.deepEqual(pages,[]);return posts;
}
test('operator suspension controls preserve explicit operator intent',async()=>{
  for(const suspended of [false,true])assert.deepEqual(await operate('suspension',suspended),[{path:`/v2/admin/nodes/${id}/suspension`,body:{suspended:!suspended,reason:'operator decision'}}]);
});
test('cancellation review submits the server-bound exact evaluation and evidence',async()=>{
  assert.deepEqual(await operate('cancellationReview'),[{path:`/v2/admin/evaluations/${id}/review`,body:{evaluationId:id,sessionId:id,requestId:id,reviewReference:'independent upstream evidence'}}]);
});
test('provider form and command creation omit deprecated permission metadata',async()=>{
  assert.ok(!providerFields.some(f=>f.name==='rightsReference'));
  let posted;
  await run(['--local','--json','provider','create','--name','Test','--model','test','--endpoint','https://example.test/infer'],{network:{request:async(_path,options)=>{posted=options.body;return posted;}},output:()=>{}});
  assert.equal('rightsReference' in posted,false);
});
