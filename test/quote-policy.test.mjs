import test from 'node:test';
import assert from 'node:assert/strict';
import { randomUUID } from 'node:crypto';
import { runTui } from '../src/tui.mjs';

const id=randomUUID();
const config={protocol:'2.0.0',product:'adr-v2',settlement:'test_credits',cashValue:false,admissions:false,privateRehearsal:true,privateOwnerEvaluation:true,supplyClasses:['authorized_api','self_hosted'],connectorProfile:'inference_connector_v1',maxNodeSessions:1,relay:'wss_single_instance',agentExecution:'buyer_vm_v1',capabilities:['allowance_v1','provider_budget_v1','cold_activation_v1'],activationDeadlineSeconds:120};
const listing={id,nodeId:randomUUID(),name:'synthetic hot listing',model:'synthetic',supplyClass:'authorized_api',availability:'hot',inputRate:'1000',outputRate:'1000',rateDenominator:'1000000',connectorProfile:'inference_connector_v1',revision:1,publishedAt:1,ready:true,controlOnline:true,activationDeadlineSeconds:120,evaluation:null,capabilities:[]};

for(const initial of ['failed','stale'])for(const change of ['none','disabled','purchase','offline'])test(`buyer quote refreshes ${initial} startup policy and handles ${change} at request boundary`,async()=>{
  let configs=0,homes=0,browses=0,inspections=0;const posts=[],pages=[];let disabledBuyReason;
  const network={local:true,origin:'http://127.0.0.1:8790',request:async(path,options={})=>{
    if(path.endsWith('/network/config')){
      configs++;if(configs===1){if(initial==='failed')throw Object.assign(Error('synthetic'),{code:'network_unavailable_outcome_unknown'});return {...config,privateRehearsal:false};}
      if(configs>=5&&change==='disabled')return {...config,privateRehearsal:false};
      if(configs>=5&&change==='purchase')return {...config,admissions:true};
      return config;
    }
    if(path==='/v2/listings/'+id){inspections++;return inspections>1&&change==='offline'?{...listing,ready:false,controlOnline:false}:listing;}
    if(path.startsWith('/v2/listings?'))return {listings:[listing],nextCursor:null};
    if(options.method==='POST'){posts.push({path,body:options.body});assert.equal(path,'/v2/quotes');return {id:randomUUID(),maximumCharge:'100',maxOutputTokens:128,durationSeconds:300,expiresAt:Date.now()+60000};}
    throw Error('unexpected synthetic request');
  }};
  const ui={start(){},stop(){},task:(_t,w)=>w(new AbortController().signal,()=>{}),page:async(_title,lines)=>pages.push(lines.join('\n')),form:async title=>{assert.equal(title,'Choose a bounded test session');return {budget:'100',output:'128',duration:'300'};},menu:async(title,options)=>{
    if(title==='What would you like to do?')return homes++===0?'browse':'exit';
    if(title==='Browse available compute')return browses++===0?id:'back';
    if(title==='Compute details'){const buy=options.find(o=>o.value==='buy');if(change==='offline'){assert.equal(buy.disabled,true);disabledBuyReason=buy.detail;return 'back';}assert.equal(buy.disabled,false);return 'buy';}
    if(title==='Private rehearsal · provisional qualification')return true;
    if(title==='Review your quote')return false;
    throw Error('unexpected synthetic screen');
  }};
  await runTui({}, {ui,network,store:{profile:'buyer'}});
  assert.ok(configs>=(change==='offline'?4:5));assert.equal(posts.length,change==='none'?1:0);
  if(change==='none')assert.deepEqual(posts[0].body,{listingId:id,maximumCharge:'100',maxOutputTokens:128,durationSeconds:300,mode:'private_rehearsal',acknowledgeProvisional:true});
  else if(change==='offline')assert.match(disabledBuyReason,/offline/i);
  else assert.ok(pages.some(p=>p.includes(change==='disabled'?'private_rehearsal_disabled':change==='purchase'?'quote_policy_changed':'provider_offline')));
});
