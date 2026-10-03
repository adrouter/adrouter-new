import {digest} from '../scripts/acceptance/report.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import { normalAuthObserver, checkRoleAccess, validateAuthConfig, waitUntil, assertAuthMetadata, authExpectationHash } from '../scripts/acceptance/hosted-auth.mjs';
test('normal interface observer extracts metadata only and never records credential values',async()=>{
 const observed=[],n=normalAuthObserver({send:async()=>({installation_id:'fixture',scope:'marketplace:buyer',expires_in:600,access_token:'private-access',refresh_token:'private-refresh'})},m=>observed.push(m));
 await n.send('/v1/oauth/token',{identity:{installation_id:'fixture',scope:'marketplace:buyer',expiresAt:123,privateKey:'private-key'}});
 assert.equal(observed.length,2);assert.equal(observed[1].ttlSeconds,600);assert.equal(JSON.stringify(observed).includes('private-'),false);
});
test('negative access accepts only actual scope rejection, never network errors or wrong positives',async()=>{
 await checkRoleAccess({request:async p=>{if(p!=='/v2/me')throw Object.assign(Error(),{status:403,code:'installation_not_allowed'});}},'buyer');
 for(const request of [async()=>({}),async()=>{throw Object.assign(Error(),{status:503,code:'network_unavailable'});}])await assert.rejects(checkRoleAccess({request},'buyer'));
});
test('auth config and expiry fail closed; abort does not change expiry or retry a credential',async()=>{
 assert.throws(()=>validateAuthConfig({roles:{buyer:{token:'secret'}}}));await assert.rejects(waitUntil(NaN));
 const abort=new AbortController();abort.abort();await assert.rejects(waitUntil(Date.now()+600000,{signal:abort.signal}));
});

test('recovery validates the original installation before its normal signed send, even when the initial read failed before send',async()=>{
 let sends=0;const expected={installationSha256:digest('original')};
 const n=normalAuthObserver({send:async()=>{sends++;return {};}},m=>assertAuthMetadata(m,expected,'provider'));
 await assert.rejects(n.send('/v1/installation/reauthorize',{identity:{installation_id:'wrong',scope:'marketplace:provider'}}));assert.equal(sends,0);
 await n.send('/v1/installation/reauthorize',{identity:{installation_id:'original',scope:'marketplace:provider'}});assert.equal(sends,1);
 await assert.rejects(n.send('/v1/installation/reauthorize',{identity:{installation_id:'original',scope:'marketplace:buyer'}}));assert.equal(sends,1);
});

test('hosted evidence cannot qualify a different installation or account in a later live phase',()=>{
 const c={roles:Object.fromEntries(['provider','buyer','operator'].map(role=>[role,{accountSha256:digest(role),installationSha256:digest(role+'installation'),...(role==='provider'?{bindingsSha256:digest('bindings')}:{})}]))};
 const before=authExpectationHash(c),changed=structuredClone(c);changed.roles.buyer.installationSha256=digest('new');assert.notEqual(authExpectationHash(changed),before);changed.roles.buyer=c.roles.buyer;changed.roles.operator.accountSha256=digest('new-account');assert.notEqual(authExpectationHash(changed),before);
 assert.equal(authExpectationHash(JSON.parse(JSON.stringify(c))),before);
});
