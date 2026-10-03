// Invoked only by explicit --phase hosted-auth. Uses installed normal auth APIs.
// No direct credential-file reads, TTL edits, refresh retries or browser capture.
import assert from 'node:assert/strict';
import { mkdtemp } from 'node:fs/promises';
import { tmpdir, homedir } from 'node:os';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { digest } from './report.mjs';
import { command, fail } from './identity.mjs';
export const rolePaths={provider:'/v2/providers/me',buyer:'/v2/me',operator:'/v2/admin/me'};
export const accountHash = profile => digest(String(profile.userId));
export function assertAuthMetadata(metadata,expected,role) {
 if(metadata.installationId&&digest(String(metadata.installationId))!==expected.installationSha256)throw fail('original_installation_mismatch');
 if(metadata.scope&&metadata.scope!==`marketplace:${role}`)throw fail('exact_scope_required');
}
export function normalAuthObserver(network,observe) {
  const original=network.send.bind(network);
  network.send=async(path,options={})=>{
    // Metadata already passed through the public Network interface. Private key,
    // access token and refresh token values are never extracted by the verifier.
    if(options.identity)observe({installationId:options.identity.installation_id,scope:options.identity.scope,expiresAt:options.identity.expiresAt});
    const result=await original(path,options);
    if(path==='/v1/oauth/token'&&result?.installation_id)observe({installationId:result.installation_id,scope:result.scope,expiresAt:Date.now()+result.expires_in*1000,ttlSeconds:result.expires_in,refresh:true});
    return result;
  };
  return network;
}
export async function waitUntil(timestamp,{signal,progress=()=>{}}={}) {
  if(!Number.isFinite(timestamp))throw fail('normal_expiry_unobservable');
  while(Date.now()<timestamp){signal?.throwIfAborted();progress();await new Promise((resolve,reject)=>{
    const done=()=>{signal?.removeEventListener('abort',abort);resolve();};
    const timer=setTimeout(done,Math.min(30000,timestamp-Date.now()));
    const abort=()=>{clearTimeout(timer);signal?.removeEventListener('abort',abort);reject(fail('interrupted'));};signal?.addEventListener('abort',abort,{once:true});
  });}
}
export async function checkRoleAccess(network,role,signal) {
  await network.request(rolePaths[role],{signal});
  for(const [other,path] of Object.entries(rolePaths))if(other!==role){let denied=false;try{await network.request(path,{signal});}catch(e){denied=e.status===403&&e.code==='installation_not_allowed';}if(!denied)throw fail('role_isolation_failed');}
}
export function validateAuthConfig(config) {
  if(!config||Object.keys(config).sort().join(',')!=='roles'||Object.keys(config.roles??{}).sort().join(',')!=='buyer,operator,provider')throw fail('auth_config_invalid');
  for(const [role,c]of Object.entries(config.roles))if(Object.keys(c).sort().join(',')!==(role==='provider'?'accountSha256,bindingsSha256,installationSha256':'accountSha256,installationSha256')||!Object.values(c).every(v=>/^[a-f0-9]{64}$/.test(v)))throw fail('auth_config_invalid');
  return config;
}
export function authExpectationHash(config) {
 validateAuthConfig(config);
 // Account/installation identities bind hosted role/refresh/revocation evidence.
 // Provider configuration is reviewed separately for live qualification.
 return digest(JSON.stringify(['provider','buyer','operator'].map(role=>[role,config.roles[role].accountSha256,config.roles[role].installationSha256])));
}
export async function hostedAuth({clientRoot,config,signal,record,confirm,approval,recoverBroken=false,databaseWorkdir,progress=()=>{}}) {
  validateAuthConfig(config);
  const {Network,AuthStore}=await import(pathToFileURL(join(clientRoot,'src/network.mjs')).href);
  const origin='https://api-staging.adrouter.co',make=(home,role,observe)=>normalAuthObserver(new Network({origin,store:new AuthStore(home,role)}),observe);
  const metadata={},clients={};
  const bindings=async n=>digest(JSON.stringify((await n.request('/v2/providers/nodes',{signal})).map(n=>({id:n.id,installationId:n.installationId,provider:n.provider,models:n.models})).sort((a,b)=>a.id.localeCompare(b.id))));
  for(const role of ['provider','buyer','operator']){
    let observed={},refreshes=0;
    const observe=m=>{assertAuthMetadata(m,config.roles[role],role);if(m.installationId)observed={...observed,...m};if(m.refresh)refreshes++;};
    const n=clients[role]=make(homedir(),role,observe);
    let profile;
    try{profile=await n.request(rolePaths[role],{signal});}
    catch(e){
      if(!recoverBroken||!['invalid_access_token','refresh_outcome_unknown_reenroll_required'].includes(e.code))throw e;
      if(observed.installationId)assertAuthMetadata(observed,config.roles[role],role);
      // A refresh-pending profile may fail before any send. recoverLogin's normal
      // signed send exposes metadata to this observer before recovery is initiated.
      await n.recoverLogin(approval,signal);profile=await n.request(rolePaths[role],{signal});
    }
    assert.equal(accountHash(profile),config.roles[role].accountSha256,'original_account_mismatch');
    assert.equal(digest(String(observed.installationId)),config.roles[role].installationSha256,'original_installation_mismatch');
    assert.equal(observed.scope,`marketplace:${role}`,'exact_scope_required');
    if(role==='provider')assert.equal(await bindings(n),config.roles.provider.bindingsSha256,'provider_bindings_changed');
    metadata[role]={...observed};
    await record(`${role}.identity`,{accountMatch:true,installationMatch:true,accountSha256:config.roles[role].accountSha256,installationSha256:config.roles[role].installationSha256,scope:observed.scope,bindingsPreserved:true,...(role==='provider'?{bindingsSha256:config.roles.provider.bindingsSha256}:{})});
    await checkRoleAccess(n,role,signal);await record(`${role}.access`,{positive:true,negative:true});
    for(let boundary=1;boundary<=2;boundary++){
      const before=refreshes;await waitUntil(observed.expiresAt+1000,{signal,progress});
      const profiles=await Promise.all(Array.from({length:3},()=>n.request(rolePaths[role],{signal})));
      assert.equal(refreshes,before+1,'concurrent_refresh_not_serialized');
      assert.ok(profiles.every(p=>accountHash(p)===config.roles[role].accountSha256));
      assert.equal(digest(String(observed.installationId)),config.roles[role].installationSha256);
      assert.equal(observed.scope,`marketplace:${role}`);assert.ok(observed.ttlSeconds>0);
      await record(`${role}.refresh-${boundary}`,{normalExpiry:true,concurrentReads:3,refreshes:1,ttlSeconds:observed.ttlSeconds,installationMatch:true,accountMatch:true});
    }
  }
  for(const role of ['buyer','provider','operator','buyer']){
    const reopened=make(homedir(),role,()=>{}),profile=await reopened.request(rolePaths[role],{signal});assert.equal(accountHash(profile),config.roles[role].accountSha256);
  }
  assert.equal(await bindings(clients.provider),config.roles.provider.bindingsSha256);
  await record('profile-switch-reopen',{switches:4,originalAccounts:true,bindingsPreserved:true});
  // Disposable homes are separate from the evidence directory and real profiles.
  // On interruption retain them for normal key-proven logout, never delete sign-in.
  for(const mode of ['webui','expiry']){
    const home=await mkdtemp(join(tmpdir(),'adr-hosted-disposable-'));let observed={};
    const n=make(home,'buyer',m=>{if(m.installationId)observed={...observed,...m};});
    progress(`Disposable ${mode} home: ${home}. Retain until normal logout succeeds.`);
    await n.login(approval,signal);const profile=await n.request(rolePaths.buyer,{signal});
    assert.equal(accountHash(profile),config.roles.buyer.accountSha256);assert.equal(observed.scope,'marketplace:buyer');
    const id=observed.installationId;if(!/^[a-f0-9-]{36}$/.test(id??''))throw fail('disposable_identity_missing');
    if(mode==='webui'){
      if(!await confirm(`Revoke only disposable buyer ${id} in native Safari /installations, reload, and confirm it is hidden.`))continue;
      await record('disposable.webui-revoke',{operatorObservedReloadHidden:true,disposable:true});
      let rejected=false;try{await n.request(rolePaths.buyer,{signal});}catch(e){rejected=e.status===401&&['invalid_access_token','installation_revoked'].includes(e.code);}if(!rejected)throw fail('revoked_protected_request_accepted');
      await record('disposable.protected-reject',{rejected:true});await n.logout();await n.logout();
      await record('disposable.logout',{signedOut:true,repeatedLogout:true});
    }else{
      if(!databaseWorkdir)continue;
      const count=async()=>{
        const sql=`select count(*)::integer as remaining from router.machine_access_tokens where installation_id='${id}'::uuid`;
        const rows=JSON.parse(await command('supabase',['--workdir',databaseWorkdir,'db','query','--linked','--output-format','json',sql],{signal}));
        const row=Array.isArray(rows)?rows[0]:rows.rows?.[0];if(row?.remaining===null||!/^\d+$/.test(String(row?.remaining))||!Number.isSafeInteger(Number(row?.remaining)))throw fail('cleanup_unobservable');return Number(row.remaining);
      };
      assert.ok(await count()>0,'disposable_access_not_observed');await waitUntil(observed.expiresAt+1000,{signal,progress});
      const deadline=Date.now()+10*60*1000;
      while(await count()>0){if(Date.now()>deadline)throw fail('scheduled_cleanup_not_observed');await waitUntil(Date.now()+30000,{signal,progress});}
      await record('disposable.expiry-cleanup',{normalExpiry:true,scheduledCleanupObserved:true,ttlUnmodified:true});
      await n.logout();await n.logout();await record('disposable.expired-logout',{keyProvenLogout:true,repeatedLogout:true});
    }
  }
  if(await confirm('Confirm safe installed-client observations of actionable temporary, recovery-required and revoked states. Answer no if any state could not be observed safely.'))await record('recovery-states',{operatorObservedTemporary:true,operatorObservedRecovery:true,operatorObservedRevoked:true});
}
