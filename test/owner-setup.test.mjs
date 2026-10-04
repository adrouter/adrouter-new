import test from 'node:test';
import assert from 'node:assert/strict';
import { PassThrough } from 'node:stream';
import { generateKeyPairSync } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { usdToMicrousd, formatUsd } from '../src/money.mjs';
import { renderBanner, JELLYFISH_PIXELS } from '../src/brand.mjs';
import { TerminalUI, renderScreen } from '../src/tui-screen.mjs';
import { Network } from '../src/network.mjs';
import { listingLines } from '../src/tui.mjs';

test('USD authority round trips exact integer accounting without floating point', () => {
  for (const value of ['0', '1', '999999999999999', '10000000', '1234567']) assert.equal(usdToMicrousd(formatUsd(value).slice(4)), value);
  assert.equal(formatUsd('10000000'), 'USD 10.00');
  for (const value of ['1e2', '-1', '.5', '01', '0.0000001', '1000000000', 'Infinity']) assert.throws(() => usdToMicrousd(value));
});
test('legacy sprite and adaptive headers fit wide, narrow and resized terminals', async () => {
  assert.equal(JELLYFISH_PIXELS.length, 32); assert.ok(JELLYFISH_PIXELS.every(row => row.length === 30));
  const { version } = JSON.parse(await readFile(new URL('../package.json', import.meta.url)));
  for (const color of [false, true]) for (const mode of ['truecolor', '256color']) {
    const banner = renderBanner(90, version, 'provider · staging', color, mode);
    assert.equal(banner.length, 16); assert.ok(banner.join('\n').includes('adr v2'));
    assert.ok(banner.every(line => [...line.replace(/\x1b\[[0-9;]*m/g, '')].length <= 90));
    if (!color) assert.equal(banner.join('').includes('\x1b'), false);
  }
  for (const [columns, rows] of [[100,40],[80,24],[32,15],[12,8],[5,5]]) {
    const screen = renderScreen({ title:'Setup', context:'provider · staging', lines:Array.from({length:20}, (_,i) => ({text:`Option ${i}`, selected:i===10})), focus:10, footer:'Esc Back' }, columns, rows, false);
    assert.ok(screen.split('\r\n').length <= rows - 1);
    assert.ok(screen.split('\r\n').every(line => [...line].length <= columns - 2));
    if (columns >= 32) assert.ok(screen.includes(`v${version}`));
  }
});
test('Back and Ctrl+C preserve listing form edits for continuation', async () => {
  const input = new PassThrough(), output = new PassThrough(); input.isTTY=output.isTTY=true; input.setRawMode=v=>{input.isRaw=v;}; output.columns=80;output.rows=24;
  const ui = new TerminalUI({input,output,color:false}); ui.start();
  try {
    const draft = {name:'Original'};
    let pending = ui.form('Details',[{name:'name',label:'Name'}],draft);
    input.emit('keypress','Edited',{});input.emit('keypress','',{name:'escape'});assert.equal(await pending,null);assert.equal(draft.name,'Edited');
    pending = ui.form('Details',[{name:'name',label:'Name'}],draft);
    input.emit('keypress','Retained',{});input.emit('keypress','',{name:'c',ctrl:true});assert.equal(await pending,null);assert.equal(draft.name,'Retained');
  } finally {ui.stop();}
});
test('logout and bounded stop bypass disabled refresh using fresh proof, clear local authentication even when revocation fails', async () => {
  const keys=generateKeyPairSync('ed25519');
  const identity={origin:'https://api.example.test',privateKey:keys.privateKey.export({format:'jwk'}),publicKey:keys.publicKey.export({format:'jwk'}),access_token:'synthetic',installation_id:'fixture',expiresAt:1,refreshPending:true};
  let cleared=false; const calls=[];
  const store={read:async()=>identity,withLock:fn=>fn(),clear:async()=>{cleared=true;}};
  const network=new Network({origin:identity.origin,store,fetcher:async(url,options)=>{calls.push({url,options});return Response.json(url.endsWith('/revoke') ? {status:'revoked',installation_id:identity.installation_id} : {status:'stopped'});}});
  await network.request('/v2/providers/nodes/fixture/stop',{method:'POST',body:{}});
  await network.logout();assert.equal(cleared,true);assert.equal(calls.length,2);assert.ok(calls.every(c=>c.options.headers.DPoP));
  assert.ok(calls.every(c=>!c.url.includes('oauth')));
  cleared=false;network.fetcher=async()=>Response.json({code:'invalid_access_token'},{status:401});
  const result=await network.logout();assert.equal(result.revocationConfirmed,false);assert.equal(cleared,true);
  await assert.rejects(network.request('/v2/providers/nodes/fixture/publish',{method:'POST',body:{}}),/login_required/);
});
test('listing shows hot readiness only from backend-confirmed readiness', () => {
  assert.ok(!listingLines({availability:'hot',ready:false}).join('\n').includes('Hot · ready'));
  assert.ok(listingLines({availability:'hot',ready:true}).join('\n').includes('Hot · ready'));
});

test('built-in setup saves a provisional connection for guest preparation before final model selection',async()=>{
 const {runTui}=await import('../src/tui.mjs');let visits=0,picks=0,posted;
 const config={protocol:'2.0.0',product:'adr-v2',settlement:'test_credits',cashValue:false,admissions:false,privateRehearsal:false,privateOwnerEvaluation:true,supplyClasses:['authorized_api','self_hosted'],connectorProfile:'inference_connector_v1',maxNodeSessions:1,relay:'wss_single_instance',agentExecution:'buyer_vm_v1',capabilities:['allowance_v1','provider_budget_v1','cold_activation_v1','pi_native_v1','pi_native_v2','pi_native_v3'],activationDeadlineSeconds:120};
 const ui={start(){},stop(){},task:(_t,fn)=>fn(new AbortController().signal,()=>{}),page:async()=>{},menu:async(title,options)=>{
  if(title==='What would you like to do?')return ++visits===1?'create':'exit';if(title==='List compute · 1 of 3')return 'authorized_api';if(title==='Connection type')return 'builtin';if(title==='Review connection')return 'save';if(title==='Choose provider'){assert.ok(!options.some(o=>o.value==='custom'));return 'deepseek';}if(title==='Choose offered models'){const choices=options.filter(o=>!['continue','back','manual'].includes(o.value));return picks<2?choices[picks++].value:'continue';}return null;
 },form:async(title,fields)=>{assert.equal(title,'Shared provider limits');assert.equal(fields.some(f=>/key|endpoint|authentication|protocol/i.test(f.name)),false);return Object.fromEntries(fields.map(f=>[f.name,f.default]));}};
 const network={local:true,origin:'http://127.0.0.1:8790',request:async(path,options)=>{if(path.endsWith('/network/config'))return config;if(path==='/v2/providers/nodes'){posted=options.body;throw Object.assign(Error('synthetic stop before key entry'),{code:'synthetic_stop'});}throw Error('unexpected request');}};
 await runTui({}, {network,ui,store:{profile:'provider'}});assert.equal(posted.connectorProtocol,'pi_native_v3');assert.equal(posted.models.length,1);assert.equal(posted.modelsConfirmed,false);assert.equal(posted.totalTokens,'1000000');assert.equal('connector'in posted,false);assert.equal('endpoint'in posted,false);
});

test('self-hosted legacy connector retains exact namespaced model and all adapter settings across Back/Edit before creation',async()=>{
 const {runTui}=await import('../src/tui.mjs');let homeVisits=0,forms=0,reviews=0,posted;const errors=[];
 const config={protocol:'2.0.0',product:'adr-v2',settlement:'test_credits',cashValue:false,admissions:false,privateRehearsal:false,privateOwnerEvaluation:true,supplyClasses:['authorized_api','self_hosted'],connectorProfile:'inference_connector_v1',maxNodeSessions:1,relay:'wss_single_instance',agentExecution:'buyer_vm_v1',capabilities:['allowance_v1','provider_budget_v1','cold_activation_v1']};
 const expected={model:'vendor/exact-model:variant',endpoint:'https://gateway.example.test/custom/chat/completions',authentication:'x_api_key',outputTokenParameter:'max_completion_tokens',streamingUsage:'native',connectorThinking:'reasoning_effort',reasoningHistory:'on',thinking:'supported'};
 const ui={start(){},stop(){},task:(_t,fn)=>fn(new AbortController().signal,()=>{}),page:async(t,lines)=>errors.push(t),
  menu:async(title,options,settings)=>{
   if(title==='What would you like to do?')return ++homeVisits<=2?'create':'exit';
   if(title==='List compute · 1 of 3')return 'self_hosted';
   if(title==='List compute · 3 of 3'){const text=settings.lines.join('\n');for(const value of ['vendor/exact-model:variant','x_api_key','max_completion_tokens','native','reasoning_effort','reasoning_content'])assert.ok(text.includes(value));return ++reviews===1?'edit':'create';}return null;
  },form:async(title,fields,initial)=>{
   if(title!=='List compute · 2 of 3')return null;forms++;
   if(forms>1)for(const [key,value] of Object.entries(expected))assert.equal(initial[key],value);
   const values={...Object.fromEntries(fields.map(f=>[f.name,initial[f.name]??f.default??''])),name:'Synthetic gateway',...expected};
   if(forms===1){Object.assign(initial,values);return null;}return values;
  }};
 const network={local:true,origin:'http://127.0.0.1:8790',request:async(path,options)=>{if(path.endsWith('/network/config'))return config;if(path==='/v2/providers/nodes'){posted=options.body;throw Object.assign(Error('fixture stops before runtime'),{code:'synthetic_stop'});}throw Error('unexpected request');}};
 await runTui({}, {network,ui,store:{profile:'provider'}});assert.equal(forms,3);assert.equal(posted.model,expected.model);assert.equal(posted.endpoint,expected.endpoint);assert.equal(posted.connector.authentication,'x_api_key');assert.equal(posted.connector.reasoningHistory,true);assert.ok(posted.capabilities.includes('thinking_v1'));assert.equal('connectorThinking' in posted,false);
});
