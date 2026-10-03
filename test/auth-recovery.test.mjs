import test from 'node:test';
import assert from 'node:assert/strict';
import {generateKeyPairSync} from 'node:crypto';
import {mkdtemp,rm,writeFile} from 'node:fs/promises';
import {tmpdir} from 'node:os';
import {join} from 'node:path';
import {AuthStore,Network,ClientError} from '../src/network.mjs';
import {parseArgs} from '../src/cli.mjs';
import {runTui} from '../src/tui.mjs';
const id='11111111-1111-4111-8111-111111111111';
const tokens=()=>({access_token:'adr_at_'+'a'.repeat(43),refresh_token:'adr_rt_'+'r'.repeat(43),installation_id:id,scope:'marketplace:provider',expires_in:600,refresh_expires_in:86400,token_type:'DPoP',client_kind:'marketplace'});
async function fixture(fn){const home=await mkdtemp(join(tmpdir(),'adr-auth-recovery-'));try{const store=new AuthStore(home,'provider'),keys=generateKeyPairSync('ed25519');await store.write({origin:'https://example.test',...tokens(),expiresAt:1,privateKey:keys.privateKey.export({format:'jwk'}),publicKey:keys.publicKey.export({format:'jwk'})});await fn(store);}finally{await rm(home,{recursive:true,force:true});}}
test('recovery and operator flags cannot change another profile or command',()=>{
 for(const args of [['--recover'],['whoami','--recover'],['login','--recover','--operator'],['login','--operator','--profile','buyer']])assert.throws(()=>parseArgs(args));
 assert.equal(parseArgs(['login','--operator']).options.profile,'operator');
 assert.equal(parseArgs(['login','--recover','--profile','buyer']).options.profile,'buyer');
});
test('only documented complete tokens with exact identity and scopes are accepted',()=>{
 const n=new Network({origin:'https://example.test'});n.validateTokens(tokens(),id,'marketplace:provider');
 for(const change of [{token_type:'Bearer'},{client_kind:'cli'},{refresh_expires_in:0},{expires_in:1.5},{scope:'marketplace:buyer'},{scope:'marketplace:provider marketplace:provider'},{installation_id:'22222222-2222-4222-8222-222222222222'}])assert.throws(()=>n.validateTokens({...tokens(),...change},id,'marketplace:provider'));
});
test('lost body and malformed success never permit refresh replay',async()=>{
 for(const response of [()=>Response.json({...tokens(),client_kind:'cli'}),()=>new Response(new ReadableStream({start(c){c.error(Error('lost'));}}))])await fixture(async store=>{
 let calls=0;const n=new Network({origin:'https://example.test',store,fetcher:async()=>{calls++;return response();}});
 await assert.rejects(n.request('/v2/providers/me'));assert.equal((await store.read()).refreshPending,true);
 await assert.rejects(n.request('/v2/providers/me'),/refresh_outcome_unknown/);assert.equal(calls,1);
 });
});
test('failed replacement persistence retains the original uncertain state',async()=>fixture(async store=>{
 const write=store.write.bind(store);store.write=async value=>{if(value.refreshPending===false&&!value.refreshError)throw Error('synthetic disk failure');await write(value);};
 const original=await store.read();const n=new Network({origin:'https://example.test',store,fetcher:async()=>Response.json({...tokens(),refresh_token:'adr_rt_'+'s'.repeat(43)})});
 await assert.rejects(n.request('/v2/providers/me'));const saved=await store.read();assert.equal(saved.refreshPending,true);assert.equal(saved.refresh_token,original.refresh_token);
}));
test('proven rate rejection permits retry and logout preserves network selection',async()=>fixture(async store=>{
 const n=new Network({origin:'https://example.test',store,fetcher:async()=>Response.json({code:'rate_limited'},{status:429})});
 await assert.rejects(n.request('/v2/providers/me'),/rate_limited/);assert.equal((await store.read()).refreshPending,false);
 n.fetcher=async()=>Response.json({status:'revoked',installation_id:id});await n.logout();assert.equal(await store.read(),null);assert.equal(await store.readSelection(),'https://example.test');
}));
test('unidentifiable locks are reported without removal',async()=>fixture(async store=>{
 const path=join(await store.directory(),'auth.lock');await writeFile(path,'',{mode:0o600});await assert.rejects(store.withLock(()=>{}, {timeoutMs:1}),/auth_lock_owner_unknown/);
}));
test('failed identity reaches recovery without loading account page',async()=>{
 const menus=[];const ui={start(){},stop(){},task:(_t,fn)=>fn(new AbortController().signal,()=>{}),page:async()=>{},menu:async(title,items)=>{menus.push({title,items});return 'exit';}};
 const network={origin:'https://example.test',local:false,request:async path=>{if(path.endsWith('/network/config'))return {};throw new ClientError('invalid_access_token');}};
 await runTui({}, {ui,network,store:{profile:'provider',read:async()=>({scope:'marketplace:provider'})}});
 assert.equal(menus[0].title,'Sign-in needs attention');for(const action of ['retry','recover','logout','profiles','saved','exit'])assert.ok(menus[0].items.some(x=>x.value===action||x.id===action));
});
