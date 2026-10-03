import { writeFile, mkdir, readFile } from 'node:fs/promises';
import { join } from 'node:path';
import { pathToFileURL } from 'node:url';
import { digest } from './report.mjs';
import { fail } from './identity.mjs';
import { normalAuthObserver, rolePaths, accountHash, validateAuthConfig, waitUntil } from './hosted-auth.mjs';
export const defectiveSource='export function sumRange(start, end) {\n  let sum = 0;\n  for (let n = start; n < end; n++) sum += n;\n  return sum;\n}\n';
export const fixtureTests="import test from 'node:test';\nimport assert from 'node:assert/strict';\nimport { sumRange } from './sum-range.mjs';\ntest('inclusive positive range', () => assert.equal(sumRange(1, 3), 6));\ntest('single element', () => assert.equal(sumRange(4, 4), 4));\ntest('negative through positive', () => assert.equal(sumRange(-2, 2), 0));\ntest('empty range', () => assert.equal(sumRange(3, 1), 0));\n";
export async function prepareLiveFixture(directory,catalog) {
 const provider=catalog.providers.find(p=>p.id==='deepseek'),model=provider?.models.find(m=>m.id==='deepseek-flash'&&!m.unavailableReason);
 if(!model||model.api!=='openai-completions')throw fail('deepseek_catalog_binding_changed');
 await mkdir(join(directory,'coding-fixture'),{mode:0o700});
 await writeFile(join(directory,'coding-fixture/sum-range.mjs'),defectiveSource);await writeFile(join(directory,'coding-fixture/sum-range.test.mjs'),fixtureTests);
 await writeFile(join(directory,'live-checklist.md'),`# DeepSeek execution checklist\n\nThis file prepares a later explicitly requested live run. Thinking stays off.\n\n1. Finish prepare and every hosted-auth gate; inspect report.json.\n2. Review the saved DeepSeek connection: deepseek-flash / ${model.api}, selected model only, accepted provider installation.\n3. Set explicit cumulative provider USD budget, shared token/test-credit allowance, output ceiling and dispatch limit in normal controls. Include two qualification dispatches for each Start and restart. Preserve consumed and outstanding values.\n4. Open accepted provider and buyer installations in separate native terminals. Key entry occurs only inside the provider guest.\n5. Start is paid: qualification can consume upstream budget before any buyer connects. The operator enters the key and chooses Start. The verifier never does either action.\n6. Require settled tool and roundtrip qualification for this configuration, then backend-confirmed readiness.\n7. Connect the buyer to the two-file fixture. Approve only intended guest read/edit/test tools. Correct the inclusive-range defect and run all four unchanged tests in the buyer guest. Host Apply has its separate approval.\n8. Wait through a normal access refresh and complete a follow-up without replaying prior inference or tools.\n9. Stop and confirm first buyer/provider guest teardown and terminal restoration; preserve unresolved liabilities.\n10. Recheck remaining run bounds, restart under operator control, qualify and establish a second distinct session. Stop and verify final owned-guest teardown.\n\nA partial observation leaves its gate incomplete. A DeepSeek pass does not qualify another provider.\n`);
 return {provider:'deepseek',model:model.id,api:model.api,thinking:false,files:2,tests:4,knownDefect:'exclusive_end',testsSha256:digest(fixtureTests)};
}
const amount=value=>{if(!/^(0|[1-9][0-9]{0,18})$/.test(String(value)))throw fail('live_bound_invalid');return BigInt(value);};
export function checkLiveBounds(node,budget,run) {
 if(Object.keys(run).sort().join(',')!=='dispatchLimit,maxOutputTokens,maximumMicrousd,maximumTestCredits,maximumTokens,nodeId'||!Number.isSafeInteger(run.dispatchLimit)||run.dispatchLimit<7||!Number.isSafeInteger(run.maxOutputTokens)||run.maxOutputTokens<1)throw fail('live_bound_invalid');
 if(node.provider!=='deepseek'||!['pi_native_v1','pi_native_v2'].includes(node.connectorProtocol)||node.models?.length!==1||node.models[0]!=='deepseek-flash'||node.nativeModels?.[0]?.api!=='openai-completions')throw fail('live_connection_mismatch');
 const a=node.sharedAllowance,remainingTokens=amount(a.totalTokens)-amount(a.consumedTokens)-amount(a.outstandingTokens),remainingCredits=amount(a.testCredits)-amount(a.consumedCredits)-amount(a.outstandingCredits),remainingUsd=amount(budget.remainingMicrousd);
 if(remainingTokens<=0n||remainingCredits<=0n||remainingUsd<=0n||remainingTokens>amount(run.maximumTokens)||remainingCredits>amount(run.maximumTestCredits)||remainingUsd>amount(run.maximumMicrousd)||Number(node.maxOutputTokens)>run.maxOutputTokens)throw fail('configure_enforced_run_bounds_first');
 if(remainingTokens<BigInt(4*(8192+Math.min(512,run.maxOutputTokens))))throw fail('qualification_allowance_insufficient');
 return {model:'deepseek-flash',api:'openai-completions',thinking:false,dispatchLimit:run.dispatchLimit,maxOutputTokens:run.maxOutputTokens,maximumMicrousd:String(run.maximumMicrousd),maximumTokens:String(run.maximumTokens),maximumTestCredits:String(run.maximumTestCredits)};
}
export async function liveAcceptance({clientRoot,authConfig,run,signal,record,confirm,prompt,progress=()=>{}}) {
 validateAuthConfig(authConfig);if(!/^[a-f0-9-]{36}$/.test(run.nodeId??''))throw fail('live_node_id_invalid');
 const {Network,AuthStore}=await import(pathToFileURL(join(clientRoot,'src/network.mjs')).href);
 const meta={},clients={};for(const role of ['provider','buyer','operator']){
  clients[role]=normalAuthObserver(new Network({origin:'https://api-staging.adrouter.co',store:new AuthStore(undefined,role)}),m=>{meta[role]={...meta[role],...m};});
  const profile=await clients[role].request(rolePaths[role],{signal});
  if(accountHash(profile)!==authConfig.roles[role].accountSha256||digest(String(meta[role].installationId))!==authConfig.roles[role].installationSha256||meta[role].scope!==`marketplace:${role}`)throw fail('live_installation_mismatch');
 }
 const nodePath='/v2/providers/nodes/'+run.nodeId,inspect=()=>clients.provider.request(nodePath,{signal}),budget=()=>clients.provider.request('/v2/providers/budget',{signal});
 const initial=await inspect();if(initial.installationId!==meta.provider.installationId)throw fail('live_provider_binding_mismatch');await record('live.bounds',checkLiveBounds(initial,await budget(),run));await record('live.installations',{accepted:true,originalAccountMatch:true,scopesMatch:true});
 const configHash=n=>digest(JSON.stringify([n.provider,n.models,n.fields,n.connection,n.nativeModels,n.maxOutputTokens,n.inputRate,n.outputRate,n.nativeRevision]));
 const binding=configHash(initial);let firstSession,firstRun,totalDispatches=0;
 const session=async (id,remainingDispatches)=>{if(!/^[a-f0-9-]{36}$/.test(id))throw fail('live_session_id_invalid');const s=await clients.buyer.request('/v2/sessions/'+id,{signal});if(s.nodeId!==run.nodeId||s.model!=='deepseek-flash'||s.provider!=='deepseek'||s.api!=='openai-completions'||s.maxOutputTokens>run.maxOutputTokens||s.requestLimit>remainingDispatches||amount(s.funded)>amount(run.maximumTestCredits)||s.installationId!==meta.buyer.installationId||s.providerInstallationId!==meta.provider.installationId)throw fail('live_session_binding_mismatch');return s;};
 for(let cycle=1;cycle<=2;cycle++){
  if(!await confirm(`Cycle ${cycle}: review remaining bounds, ${cycle===1?'enter the key only inside the provider guest':'reuse the saved guest credential without entering it again'} and choose Start. Start pays for native qualification. Confirm tool and roundtrip checks completed.`))return;
  const n=await inspect();if(configHash(n)!==binding)throw fail('live_configuration_changed');
  const checks=Object.values(n.nativeChecks??{}).filter(c=>c.model==='deepseek-flash'&&c.providerRunId===n.providerRunId&&c.nativeRevision===n.nativeRevision&&c.state==='settled'&&c.passed===true);
  if(!['tool','roundtrip'].every(phase=>checks.some(c=>c.phase===phase)))throw fail('live_qualification_unobservable');
  if(n.ready!==true||n.status!=='published'||Number(n.leaseUntil)<=Date.now())throw fail('live_backend_not_ready');
  totalDispatches+=checks.length;if(totalDispatches>=run.dispatchLimit)throw fail('live_dispatch_limit_reached');
  if(cycle===1){firstRun=n.providerRunId;await record('live.qualification',{settledTool:true,settledRoundtrip:true,configurationFixed:true,configurationSha256:binding,nativeRevision:n.nativeRevision,providerRunSha256:digest(String(n.providerRunId))});await record('live.readiness',{backendConfirmed:true});}
  else {if(n.providerRunId===firstRun)throw fail('live_restart_not_observed');await record('live.restart',{newRun:true,configurationFixed:true});}
  const remainingDispatches=run.dispatchLimit-totalDispatches-(cycle===1?3:0);
  const id=(await prompt(`Enter only the accepted cycle ${cycle} buyer session UUID: `)).trim(),s=await session(id,remainingDispatches);if(cycle===2&&id===firstSession)throw fail('live_second_session_required');firstSession??=id;
  const authorityHash=value=>digest(JSON.stringify([value.model,value.provider,value.api,value.endpoint,value.nativeRevision,value.configurationDigest,value.inputRate,value.outputRate,value.tariffId,value.priceVersion,value.maxOutputTokens,value.requestLimit,value.providerInstallationId,value.installationId]));const acceptedAuthority=authorityHash(s);
  if(!await confirm(`Cycle ${cycle}: complete buyer coding with approved tools and run all four unchanged fixture tests in the buyer guest. Confirm observed success; do not paste model or tool output.`))return;
  const completed=await session(id,remainingDispatches);if(authorityHash(completed)!==acceptedAuthority)throw fail('live_accepted_authority_changed');if(Number(completed.requestSequence??0)<1||completed.thinking===true||completed.state!=='active')throw fail('live_coding_unobservable');
  if(cycle===1){await record('live.coding-tools',{operatorObservedApprovedTools:true,operatorObservedTests:4,completedRequest:true,sessionSha256:digest(id),acceptedAuthoritySha256:acceptedAuthority});
    const before=meta.buyer.expiresAt;await waitUntil(before+1000,{signal,progress});await clients.buyer.request(rolePaths.buyer,{signal});
    if(meta.buyer.expiresAt<=before)throw fail('live_refresh_not_observed');
    if(!await confirm('Complete a follow-up in the buyer guest after that normal refresh; confirm no inference or tool action was replayed.'))return;
    if(Number((await session(id,remainingDispatches)).requestSequence)<=Number(completed.requestSequence))throw fail('live_followup_unobservable');await record('live.refresh-followup',{normalRefresh:true,newRequest:true,operatorObservedNoReplay:true});
  }else await record('live.second-session',{distinctSession:true,completedRequest:true,sessionSha256:digest(id),acceptedAuthoritySha256:acceptedAuthority});
  if(!await confirm(`Stop cycle ${cycle} through normal controls and confirm both owned guests were removed and both terminals restored. Do not release unknown financial liabilities.`))return;
  const stopped=await inspect(),end=await session(id,remainingDispatches);if(authorityHash(end)!==acceptedAuthority)throw fail('live_accepted_authority_changed');if(stopped.ready||!end.executionReleasedAt&&!['settled','refunded'].includes(end.state))throw fail('live_execution_teardown_unconfirmed');
  totalDispatches+=Number(end.requestSequence??0);if(totalDispatches>run.dispatchLimit)throw fail('live_dispatch_limit_exceeded');
  await record(cycle===1?'live.stop-teardown':'live.final-teardown',{backendStopped:true,operatorObservedBuyerGuestRemoved:true,operatorObservedProviderGuestRemoved:true,operatorObservedTerminalRestoration:true,dispatches:totalDispatches});
  if(cycle===1)checkLiveBounds(stopped,await budget(),run);
 }
}
