import { MarketplaceDraft, MarketplaceListing, MarketplaceNetworkConfig, MarketplaceQuoteRequest } from './generated/validators.mjs';
import { randomUUID } from 'node:crypto';
import { Network, AuthStore, ClientError } from './network.mjs';
import { ask, choose, render } from './terminal.mjs';
import { SandboxRuntime } from './runtime.mjs';

const booleanOptions = new Set(['json', 'local', 'accept', 'help', 'no-key', 'operator']);
const valueOptions = new Set(['profile', 'network', 'actor', 'name', 'model', 'endpoint', 'supply', 'availability', 'input-rate', 'output-rate', 'budget', 'max-output', 'duration', 'after', 'idempotency-key', 'review', 'user', 'amount', 'max-calls']);
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
  return { words, options };
}
export const usage = `adr-cli — adr-v2 compute marketplace (test credits, no cash value)

  adr-cli [--profile default|provider|operator|NAME] [--network HTTPS_ORIGIN | --local] [--json] [command]
  login [--operator] | logout | whoami
  market [--model TEXT] [--supply authorized_api|self_hosted] [--after CURSOR]
  market inspect LISTING_ID
  connect LISTING_ID --budget UNITS [--accept]
  sessions | session inspect|resume|stop SESSION_ID | receipts
  provider create | listings | inspect NODE_ID | publish NODE_ID | pause NODE_ID | stop NODE_ID | serve NODE_ID
  doctor

Provider create flags: --name --model --endpoint --supply
  --availability hot|cold --input-rate UNITS --output-rate UNITS
Public metadata only. Never put an API key in flags, a URL or listing text.
Provider serving: provider serve NODE_ID --max-calls 1 --max-output 1024
  Requires the pinned VM runtime and hidden guest-only credential entry.
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
  return { name: values.name, model: values.model, endpoint: values.endpoint, supplyClass: values.supply, availability: values.availability, inputRate: values['input-rate'], outputRate: values['output-rate'] };
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
  const origin = o.network ?? (local ? 'http://127.0.0.1:8790' : (await store.read())?.origin);
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
    try { output(await network.login(output, abort.signal, { operator: o.operator || store.profile === 'operator' })); } finally { process.removeListener('SIGINT', cancel); }
  } else if (command === 'logout') output(await network.logout());
  else if (command === 'whoami') { const scope = String((await store.read())?.scope ?? ''); output(await get(scope.includes('marketplace:operator') ? '/admin/me' : scope.includes('marketplace:provider') && !scope.includes('marketplace:buyer') ? '/providers/me' : '/me')); }
  else if (command === 'market') {
    if (sub === 'inspect') output(await get(`/listings/${requireId(id)}`, true));
    else if (!sub) {
      const query = new URLSearchParams(); for (const [flag, name] of [['model', 'model'], ['supply', 'supplyClass'], ['availability', 'availability'], ['after', 'after']]) if (o[flag]) query.set(name, o[flag]);
      output(await get(`/listings?${query}`, true));
    } else throw new ClientError('unknown_command');
  } else if (command === 'provider') {
    if (sub === 'create') output(await post('/providers/nodes', await draft(o, json)));
    else if (sub === 'listings') output(await get('/providers/nodes'));
    else if (sub === 'inspect') output(await get(`/providers/nodes/${requireId(id)}`));
    else if (['publish', 'pause', 'stop'].includes(sub)) output(await post(`/providers/nodes/${requireId(id)}/${sub}`));
    else if (sub === 'serve') {
      requireId(id);
      if (json && !o['no-key']) throw new ClientError('interactive_terminal_required');
      const { serveProvider } = await import('./provider.mjs');
      output(await serveProvider(network, id, { maxCalls: Number(o['max-calls'] ?? '5'), maxOutputTokens: Number(o['max-output'] ?? '1024'), noKey: !!o['no-key'], notify: output }));
    } else if (sub === 'benchmark') throw new ClientError('sandboxed_evaluation_not_integrated');
    else throw new ClientError('unknown_command');
  } else if (command === 'connect') {
    const listingId = requireId(sub);
    const quote = await post('/quotes', { listingId, maximumCharge: o.budget ?? '1000', maxOutputTokens: Number(o['max-output'] ?? '1024'), durationSeconds: Number(o.duration ?? '300') }); output({ quote });
    let accept = !!o.accept;
    if (!accept && !json && process.stdin.isTTY) accept = await choose('Reserve this bounded test-credit quote?', ['Cancel', 'Accept quote']) === 1;
    if (!accept) { output({ status: 'quote_not_accepted', quoteId: quote.id }); return; }
    output(await post('/sessions', { quoteId: quote.id, accept: true }, `accept_${quote.id}`));
  } else if (command === 'sessions') output(await get('/sessions'));
  else if (command === 'session') {
    if (sub === 'stop') output(await post(`/sessions/${requireId(id)}/stop`));
    else if (sub === 'inspect' || sub === 'resume') output({ session: await get(`/sessions/${requireId(id)}`), events: await get(`/sessions/${requireId(id)}/events`), ...(sub === 'resume' ? { recovery: 'state_restored_no_inference_or_tool_replay' } : {}) });
    else throw new ClientError('unknown_command');
  } else if (command === 'receipts') output(await get('/receipts'));
  else if (command === 'admin') {
    if (!local) throw new ClientError('browser_operator_auth_required');
    if (sub === 'nodes') output(await get('/admin/nodes'));
    else if (sub === 'suspend' || sub === 'unsuspend') output(await post(`/admin/nodes/${requireId(id)}/suspension`, { suspended: sub === 'suspend', reason: o.review ?? 'local-development-only' }));
    else if (sub === 'grant') output(await post('/admin/grants', { userId: o.user, amount: o.amount }));
    else throw new ClientError('unknown_command');
  } else if (command === 'doctor') {
    let runtime; try { runtime = await (await (await import('./provider.mjs')).configuredRuntime()).verify(); } catch (e) { runtime = { status: 'unavailable', code: e.code ?? 'runtime_unavailable' }; }
    output({ product: 'adr-v2', runtime, network: network ? await get('/network/config', true) : 'not_configured', credentials: 'provider_keys_memory_only', releaseAcceptance: false });
  } else throw new ClientError('unknown_command');
}
