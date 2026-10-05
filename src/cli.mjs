import { diagnoseProvider, diagnosisLines, retryProviderReports, retryProviderCleanup } from './provider-diagnose.mjs';
import { MarketplaceDraft, MarketplaceListing, MarketplaceNetworkConfig, MarketplaceQuoteRequest, ProviderNodeDeletion } from './generated/validators.mjs';
import { randomUUID } from 'node:crypto';
import { Network, AuthStore, ClientError } from './network.mjs';
import { ask, choose, render } from './terminal.mjs';
import { SandboxRuntime } from './runtime.mjs';

const booleanOptions = new Set(['json', 'local', 'accept', 'help', 'recover', 'no-key', 'operator', 'private-rehearsal', 'acknowledge-provisional', 'bounded','coding','trust','confirm-delete']);
const valueOptions = new Set(['profile', 'network', 'actor', 'name', 'model', 'endpoint', 'supply', 'availability', 'input-rate', 'output-rate', 'budget', 'max-output', 'duration', 'after', 'idempotency-key', 'review', 'user', 'amount', 'max-calls','workspace','mode','resume','prompt','context-window','thinking']);
export function parseArgs(args) {
  const options = {}; const words = [];
  for (let i = 0; i < args.length; i++) {
    const word = args[i];
    if (!word.startsWith('--')) { words.push(word); continue; }
    const name = word.slice(2);
    if (Object.hasOwn(options, name)) throw new ClientError('duplicate_option');
    if (booleanOptions.has(name)) options[name] = true;
    else if (valueOptions.has(name) && args[i + 1] && !args[i + 1].startsWith('--')) options[name] = args[++i];
    else throw new ClientError('unknown_or_missing_option');
  }
  if (options.recover && (words[0] !== 'login' || options.operator || options.local)) throw new ClientError('recover_requires_login_without_operator_or_local');
  if (options.operator && words[0] !== 'login') throw new ClientError('operator_requires_login');
  if (options.operator && options.profile && options.profile !== 'operator') throw new ClientError('operator_requires_operator_profile');
  if (options.operator) options.profile = 'operator';
  return { words, options };
}
export const usage = `adr-cli — adr-v2 compute marketplace (test credits, no cash value)

  adr-cli [--profile default|buyer|provider|operator|NAME] [--network HTTPS_ORIGIN | --local] [--json] [command]
  login [--operator] [--recover] | logout | whoami
  Examples: adr-cli --profile buyer; adr-cli --profile provider; adr-cli --profile operator
  Repair: adr-cli --profile provider login --recover (browser approval; keeps bound listings)
  market [--model TEXT] [--supply authorized_api|self_hosted] [--after CURSOR]
  market inspect LISTING_ID
  connect LISTING_ID --budget UNITS [--accept]
  sessions [--view deleted] | session inspect|resume|stop|delete|restore SESSION_ID | receipts
  provider create | listings | inspect NODE_ID | publish NODE_ID | pause NODE_ID | stop NODE_ID | serve NODE_ID
  provider capabilities NODE_ID --thinking off|supported
  provider delete NODE_ID --confirm-delete
  doctor

Provider create flags: --name --model --endpoint --supply
  --availability hot|cold --input-rate UNITS --output-rate UNITS
  --coding --thinking off|supported (buyer thinking starts off)
Public metadata only. Never put an API key in flags, a URL or listing text.
Provider serving: provider serve NODE_ID --max-output 4096
  Hot listings serve continuously in the foreground; --bounded retains evaluation limits.
Provider deletion: permanently removes a paused listing after all linked work settles.
  Receipts and accounting history remain. Deletion cannot restore or republish a listing.
Private connect: --private-rehearsal --acknowledge-provisional --budget 100 --accept
  Requires the pinned VM runtime and hidden guest-only credential entry.
Coding: code SESSION_ID --workspace PATH --trust [--mode print|json|rpc] [--prompt TASK] [--resume SAVED_ID]
Connect coding: connect LISTING_ID --coding --duration 3600 --max-calls 100
Local development: --local --actor buyer|provider|admin
Local admin: admin nodes | suspend|unsuspend NODE_ID --review REFERENCE | grant --user local-buyer --amount UNITS
Use --idempotency-key KEY to recover a mutation after an uncertain response.
No command opens your browser or deploys a service.`;
async function draft(options, json) {
  const fields = [['name', 'Listing name'], ['model', 'Exact upstream model'], ['endpoint', 'Endpoint URL (no credentials)'], ['supply', 'Supply class', 'authorized_api'], ['availability', 'Availability', 'hot'], ['input-rate', 'Input credits per million tokens', '1000'], ['output-rate', 'Output credits per million tokens', '1000']];
  const values = {};
  for (const [name, label, fallback] of fields) {
    if (options[name] !== undefined) values[name] = options[name];
    else if (json || !process.stdin.isTTY) { if (fallback) values[name] = fallback; else throw new ClientError(`missing_${name.replaceAll('-', '_')}`); }
    else values[name] = await ask(label, fallback);
  }
  if(options.thinking!==undefined&&!['off','supported'].includes(options.thinking))throw new ClientError('invalid_thinking_setting');
  if(options.thinking==='supported'&&!options.coding)throw new ClientError('thinking_requires_coding');
  return { name: values.name, model: values.model, endpoint: values.endpoint, supplyClass: values.supply, availability: values.availability, inputRate: values['input-rate'], outputRate: values['output-rate'],...(options.coding?{capabilities:['coding_v1','streaming_v1','tools_v1',...(options.thinking==='supported'?['thinking_v1']:[])],contextWindowTokens:Number(options['context-window']??32768)}:{}) };
}
export async function run(args, dependencies = {}) {
  const { words, options: o } = parseArgs(args); const json = !!o.json;
  const output = dependencies.output ?? (value => render(value, json));
  if (o.help || words[0] === 'help') { output({ usage }); return; }
  if (!words.length && !json && process.stdin.isTTY && process.stdout.isTTY) {
    const { runTui } = await import('./tui.mjs');
    return runTui(o, dependencies);
  }
  const store = dependencies.store ?? new AuthStore(undefined, o.profile ?? 'default');
  const local = !!o.local;
  const origin = o.network ?? (local ? 'http://127.0.0.1:8790' : ((await store.read())?.origin ?? await store.readSelection?.()));
  if (!origin && words[0] !== 'doctor') throw new ClientError('network_required_use_login_with_network_or_local');
  const network = dependencies.network ?? (origin ? new Network({ origin, local, actor: o.actor ?? 'buyer', store }) : null);
  const get = async (path, publicAccess = false) => {
    const value = await network.request(`/v2${path}`, { public: publicAccess });
    if (path === '/network/config' && !MarketplaceNetworkConfig(value)) throw new ClientError('network_contract_mismatch');
    if (path.startsWith('/listings?') || path === '/listings') {
      if (!Array.isArray(value.listings) || value.listings.some(l => !MarketplaceListing(l))) throw new ClientError('listing_contract_mismatch');
    } else if (path.startsWith('/listings/') && !MarketplaceListing(value)) throw new ClientError('listing_contract_mismatch');
    return value;
  };
  const post = (path, body = {}, key = o['idempotency-key'] ?? randomUUID()) => {
    if (path === '/providers/nodes' && !MarketplaceDraft(body)) throw new ClientError('invalid_listing_metadata');
    if (path === '/quotes' && !MarketplaceQuoteRequest(body)) throw new ClientError('invalid_quote_bounds');
    return network.request(`/v2${path}`, { method: 'POST', body, key });
  };
  const command = words[0]; const sub = words[1]; const id = words[2];
  const requireId = value => { if (!value || !/^[a-f0-9-]{36}$/i.test(value)) throw new ClientError('identifier_required'); return encodeURIComponent(value); };
  if (!command) {
    if (json || !process.stdin.isTTY) { output({ product: 'adr-v2', ...await get('/network/config', true), usage }); return; }
    const config = await get('/network/config', true); output({ product: 'adr-v2', network: network.origin, settlement: config.settlement, cashValue: false, admissions: config.admissions });
    for (;;) {
      const selection = await choose('adr-cli', ['Choose compute', 'List compute', 'My provider listings', 'Sessions and receipts', 'Account', 'Exit']);
      if (selection === 5) return;
      try {
        if (selection === 0) {
          const market = await get('/listings', true); output(market);
          if (market.listings.length) { const selected = await choose('Inspect compute', [...market.listings.map(l => `${l.name} · ${l.model}`), 'Back']); if (selected < market.listings.length) output(await get(`/listings/${market.listings[selected].id}`, true)); }
        } else if (selection === 1) {
          output({ notice: 'List permitted inference access. API keys are entered only inside the guest. Publish your listing and qualify its current tariff before your private evaluation.' });
          const input = await draft(o, false); output(input);
          if (await choose('Create this draft?', ['Create draft', 'Back']) === 0) output(await post('/providers/nodes', input));
        } else if (selection === 2) {
          const nodes = await get('/providers/nodes'); output(nodes);
          if (nodes.length) { const selected = await choose('Manage listing', [...nodes.map(n => `${n.name} · ${n.status}`), 'Back']); if (selected < nodes.length) {
            const action = await choose(nodes[selected].name, ['Inspect', 'Publish draft', 'Pause listing', 'Back']);
            if (action < 3) output(action === 0 ? nodes[selected] : await post(`/providers/nodes/${nodes[selected].id}/${action === 1 ? 'publish' : 'pause'}`));
          } }
        } else if (selection === 3) { output(await get('/sessions')); output(await get('/receipts')); }
        else output(await get('/me'));
      } catch (e) { output({ status: 'error', code: e instanceof ClientError ? e.code : 'operation_failed' }); }
    }
  }
  if (command === 'login') {
    const abort = new AbortController(); const cancel = () => abort.abort(); process.once('SIGINT', cancel);
    try { output(o.recover ? await network.recoverLogin(output, abort.signal) : await network.login(output, abort.signal, { operator: o.operator || store.profile === 'operator' })); } finally { process.removeListener('SIGINT', cancel); }
  } else if (command === 'logout') output(await network.logout());
  else if (command === 'whoami') { const scope = String((await store.read())?.scope ?? ''); output(await get(scope.includes('marketplace:operator') ? '/admin/me' : scope.includes('marketplace:provider') && !scope.includes('marketplace:buyer') ? '/providers/me' : '/me')); }
  else if (command === 'market') {
    if (sub === 'inspect') output(await get(`/listings/${requireId(id)}`, true));
    else if (!sub) {
      const query = new URLSearchParams(); for (const [flag, name] of [['model', 'model'], ['supply', 'supplyClass'], ['availability', 'availability'], ['after', 'after']]) if (o[flag]) query.set(name, o[flag]);
      output(await get(`/listings?${query}`, true));
    } else throw new ClientError('unknown_command');
  } else if (command === 'provider') {
    if(sub==='diagnose'){const result=await diagnoseProvider(network,requireId(id),store.profile);output(json?{...result.node,localReports:result.evidence.map(e=>({providerRunId:e.providerRunId,pendingReports:e.pending.length,firstFailure:e.local.firstFailure,outcomes:e.local.outcomes}))}:diagnosisLines(result).join('\n'));}
    else if(sub==='retry-cleanup')output(await retryProviderCleanup(network,requireId(id),store.profile));
    else if(sub==='retry-result-report')output(await retryProviderReports(network,requireId(id),store.profile));
    else if (sub === 'create') output(await post('/providers/nodes', await draft(o, json)));
    else if (sub === 'capabilities') {if(!['off','supported'].includes(o.thinking))throw new ClientError('invalid_thinking_setting');output(await post(`/providers/nodes/${requireId(id)}/capabilities`,{thinkingEnabled:o.thinking==='supported'}));}
    else if (sub === 'listings') output(await get('/providers/nodes'));
    else if (sub === 'inspect') output(await get(`/providers/nodes/${requireId(id)}`));
    else if (sub === 'tariff-refresh') output(await post(`/providers/nodes/${requireId(id)}/tariff/refresh`,{durationSeconds:Number(o.duration??3600)}));
    else if (['publish', 'pause', 'stop'].includes(sub)) output(await post(`/providers/nodes/${requireId(id)}/${sub}`, sub === 'stop' ? {scope:'node',trigger:'operator_stop'} : {}));
    else if (sub === 'delete') {
      const nodeId = requireId(id);
      if (!o['confirm-delete']) throw new ClientError('node_delete_confirmation_required');
      const result = await post(`/providers/nodes/${nodeId}/delete`, { confirm: true });
      if (!ProviderNodeDeletion(result) || result.id !== id) throw new ClientError('invalid_network_response');
      output(result);
    }
    else if (sub === 'serve') {
      requireId(id);
      if (json && !o['no-key']) throw new ClientError('interactive_terminal_required');
      const { serveProvider } = await import('./provider.mjs');
      output(await serveProvider(network, id, { maxCalls: Number(o['max-calls'] ?? '5'), maxOutputTokens: Number(o['max-output'] ?? '4096'), noKey: !!o['no-key'], ...(o.bounded ? {continuous:false} : {}), notify: output }));
    } else if (sub === 'benchmark') throw new ClientError('sandboxed_evaluation_not_integrated');
    else throw new ClientError('unknown_command');
  } else if (command === 'connect') {
    const listingId = requireId(sub);
    const listing=await get(`/listings/${listingId}`,true);
    const mode = o['private-rehearsal'] ? { mode: 'private_rehearsal', acknowledgeProvisional: !!o['acknowledge-provisional'] } : {};
    const quote = await post('/quotes', { ...(['pi_native_v1','pi_native_v2','pi_native_v3'].includes(listing.connectorProtocol)?{connectorProtocol:listing.connectorProtocol,...(o.thinking?{modelSettings:{reasoning:o.thinking}}:{})}:listing.connector?{connectorProtocol:'openai_compatible_v1'}:{}), listingId, maximumCharge: o.budget ?? (o['private-rehearsal'] ? '100' : '1000'), maxOutputTokens: Number(o['max-output'] ?? '4096'), durationSeconds: Number(o.duration ?? (o.coding?'3600':'300')), ...(o.coding?{protocol:'coding_v1',requestLimit:Number(o['max-calls']??100)}:{}), ...mode }); output({ quote });
    let accept = !!o.accept;
    if (!accept && !json && process.stdin.isTTY) accept = await choose('Reserve this bounded test-credit quote?', ['Cancel', 'Accept quote']) === 1;
    if (!accept) { output({ status: 'quote_not_accepted', quoteId: quote.id }); return; }
    const session = await post('/sessions', { quoteId: quote.id, accept: true, ...mode }, `accept_${quote.id}`);
    output(session);
    if(o['private-rehearsal'])output(await post(`/sessions/${session.id}/handshake`));
  } else if (command === 'code') {
    const sessionId=requireId(sub),{projectManifest}=await import('./workspace.mjs'),{openCodingBuyer}=await import('./coding-buyer.mjs');
    if(!o.workspace)throw new ClientError('workspace_required');const manifest=await projectManifest(o.workspace);
    if(!o.trust)throw new ClientError('reviewed_workspace_trust_required');
    const interactive=(o.mode??'interactive')==='interactive';let ui,coordinator;
    if(interactive&&process.stdin.isTTY&&process.stdout.isTTY){const {TerminalUI}=await import('./tui-screen.mjs'),{TerminalCoordinator}=await import('./terminal-coordinator.mjs');ui=new TerminalUI();coordinator=new TerminalCoordinator(ui);}
    const buyer=await openCodingBuyer(network,sessionId,{root:manifest.root,files:manifest.files.map(f=>f.path),trusted:true,profile:o.profile??'buyer',resumeId:o.resume,coordinator,...(coordinator?{approve:(a,p)=>coordinator.approve(a,p)}:{})});
    try{if(ui)ui.start();const code=()=>buyer.interactive({prompt:o.prompt??'',mode:o.mode??'interactive'});if(ui)await ui.suspend(code);else await code();output({...await buyer.save(),...(buyer.lifecycle.approvalRequired?{status:'approval_required'}:{})});}finally{ui?.stop();output(await buyer.close());}
  } else if (command === 'sessions') output(await get('/sessions'+(o.view==='deleted'?'?view=deleted':'')));
  else if (command === 'session') {
    if (['delete','restore'].includes(sub)) output(await post(`/sessions/${requireId(id)}/${sub}`,{}));
    else if (sub === 'stop') output(await post(`/sessions/${requireId(id)}/stop`));
    else if (sub === 'inspect' || sub === 'resume') output({ session: await get(`/sessions/${requireId(id)}`), events: await get(`/sessions/${requireId(id)}/events`), ...(sub === 'resume' ? { recovery: 'state_restored_no_inference_or_tool_replay' } : {}) });
    else throw new ClientError('unknown_command');
  } else if (command === 'receipts') output(await get('/receipts'));
  else if (command === 'admin') {

    if (sub==='sessions')output(await get('/admin/sessions'));
    else if(sub==='session')output(await get(`/admin/sessions/${requireId(id)}`));
    else if(sub==='stop-session')output(await post(`/admin/sessions/${requireId(id)}/stop`,{}));
    else if(sub==='stop-provider')output(await post(`/admin/nodes/${requireId(id)}/stop`,{}));
    else if(sub==='delete-listing'){if(!o['confirm-delete'])throw new ClientError('confirmation_required');output(await post(`/admin/nodes/${requireId(id)}/delete`,{confirm:true}));}
    else if (sub === 'nodes') output(await get('/admin/nodes'));
    else if (sub === 'suspend' || sub === 'unsuspend') output(await post(`/admin/nodes/${requireId(id)}/suspension`, { suspended: sub === 'suspend', reason: o.review ?? 'local-development-only' }));
    else if (sub === 'grant' && local) output(await post('/admin/grants', { userId: o.user, amount: o.amount }));
    else throw new ClientError('unknown_command');
  } else if (command === 'doctor') {
    let runtime; try { runtime = await (await (await import('./provider.mjs')).configuredRuntime()).verify(); } catch (e) { runtime = { status: 'unavailable', code: e.code ?? 'runtime_unavailable' }; }
    output({ product: 'adr-v2', runtime, network: network ? await get('/network/config', true) : 'not_configured', credentials: 'provider_keys_memory_only', releaseAcceptance: false });
  } else throw new ClientError('unknown_command');
}
