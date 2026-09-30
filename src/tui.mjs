import { usdToMicrousd, formatUsd } from './money.mjs';
import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { TerminalUI } from './tui-screen.mjs';
import { AuthStore, Network, ClientError, networkOrigin, safeText } from './network.mjs';
import { MarketplaceDraft, MarketplaceListing, MarketplaceNetworkConfig } from './generated/validators.mjs';

const item = (value, label, detail = '', disabled = false) => ({ value, label, detail, disabled });
const required = value => value.trim() ? '' : 'Please enter a value.';
const integer = (min, max) => value => /^(0|[1-9][0-9]*)$/.test(value) && Number.isSafeInteger(Number(value)) && Number(value) >= min && Number(value) <= max ? '' : `Enter a whole number from ${min} to ${max}.`;
const date = value => typeof value === 'number' ? new Date(value).toLocaleString() : '—';
const words = value => String(value ?? '—').replaceAll('_', ' ');
const problems = {
  marketplace_owner_only: 'Sign in with the configured owner account. Other accounts cannot use this private marketplace.',
  marketplace_access_disabled: 'Owner access is disabled. Revoke this installation in the dashboard if sign-out cannot refresh it.',
  login_required: 'Sign in to AdRouter to continue.',
  marketplace_admissions_disabled: 'This network is not accepting marketplace activity yet. Your settings have not enabled it.',
  client_disabled: 'Marketplace sign-in is disabled on this network until acceptance is enabled.',
  client_not_allowed: 'Marketplace sign-in is not available on this network yet.',
  invalid_network_response: 'This server did not return the marketplace API. Check the network or its deployed version.',
  node_suspended: 'An operator has suspended this listing. It must be cleared before you can republish.',
  provider_offline: 'The provider must start its hot VM before you can reserve this compute.',
  insufficient_test_credits: 'Your available test credits do not cover this quote.',
  capacity_unavailable: 'This provider is already serving another session. Choose another listing or try later.',
  quote_expired_or_used: 'The quote expired or was already used. Inspect your sessions before requesting another.',
  self_purchase_not_permitted: 'Choose another provider. Providers cannot purchase their own listing.',
  network_unavailable_outcome_unknown: 'The network result is unknown. Inspect your listings/sessions before submitting again. Paid requests are never replayed.',
  refresh_outcome_unknown_reenroll_required: 'A previous sign-in refresh had an unknown result. Revoke this installation through AdRouter before enrolling again.',
  auth_state_busy: 'This profile is busy. Use separate --profile provider and --profile operator terminals, or wait for the operation to finish.',
  private_owner_evaluation_required: 'Private acceptance is limited to the configured owner. Use the separately approved operator profile.',
  invalid_profile_name: 'Use a lowercase profile name starting with a letter, up to 32 letters, digits, underscores or hyphens.',
  activation_expired: 'Cold activation expired or the session closed. Start a new evaluation only after the provider is available.',
  cancelled: 'Operation cancelled. Check sessions for any unsettled work before starting another.',
  evaluation_cleanup_required: 'Cleanup could not be confirmed. Inspect Evaluation sessions and stop the session; keep uncertain liabilities for review.',
  runtime_download_failed: 'The pinned runtime download failed. Retry Runtime setup; partial installation files were removed.',
  runtime_absolute_paths_required: 'Choose the pinned VM executable, library and a dedicated runtime directory in Runtime setup.',
  runtime_directory_path_too_long: 'The runtime directory is too long for Unix sockets. In Runtime setup choose a dedicated private path shorter than 54 bytes, such as /tmp/adr-vm-YOURNAME.',
  runtime_digest_mismatch: 'The selected runtime does not match the pinned release. Choose the verified Microsandbox files.',
  evaluation_required: 'This listing needs current operator qualification before purchase.',
  provider_budget_exhausted: 'The provider cumulative spending authority is exhausted or held for uncertain work.',
  qualified_tariff_required: 'An operator must qualify a current upstream tariff before dispatch.',
};
export const errorLines = error => {
  const candidate=error?.code ?? error?.message;
  const code = /^[a-z0-9_]{1,100}$/.test(candidate ?? '') ? candidate : 'operation_failed';
  return [problems[code] ?? `Unable to complete this operation: ${words(code)}.`, '', `Reference: ${code}`];
};
export function listingLines(l) {
  return [l.name, `Model: ${l.model}`, `Supply: ${words(l.supplyClass)} · ${l.availability}`, `Availability: ${l.ready ? 'Hot · ready' : l.controlOnline && l.availability === 'cold' ? 'Cold · control online · 120 seconds to activate' : 'Offline'}`, `Input: ${l.inputRate} test credits / 1M tokens`, `Output: ${l.outputRate} test credits / 1M tokens`, 'Test credits have no cash value.', l.evaluation ? `Evaluation: ${l.evaluation.passed ? 'qualified' : 'provisional'} · ${l.evaluation.sampleCount} samples · ${l.evaluation.elapsedMs} ms` : 'Evaluation: not available', `Published: ${date(l.publishedAt)}`];
}
export const providerFields = [
  { name: 'name', label: 'Listing name', validate: required, help: 'A public name that helps buyers identify your compute.' },
  { name: 'model', label: 'Request model ID', validate: required, help: 'Exact upstream request ID. Defaults come from the selected setup preset.' },
  { name: 'endpoint', label: 'API endpoint', maxLength: 2048, validate: value => { try { const u = new URL(value); return u.username || u.password || u.search || u.hash || !['https:', 'http:'].includes(u.protocol) ? 'Use an endpoint URL with no credentials, query or fragment.' : ''; } catch { return 'Enter a valid API endpoint URL.'; } }, help: 'Public endpoint metadata only. Never paste an API key here.' },
  { name: 'supplyClass', label: 'Supply type', choices: ['authorized_api', 'self_hosted'], default: 'authorized_api', help: 'Authorized API capacity or your own inference engine. Subscription supply is excluded.' },
  { name: 'availability', label: 'Availability', choices: ['hot', 'cold'], default: 'hot', help: 'Hot warms a VM now. Cold keeps control online; you have 120 seconds to activate after a reservation.' },
  { name: 'inputRate', label: 'Input test credits / 1M', default: '1000', validate: integer(0, 999999999), help: 'Editable marketplace test-credit price; this is not your upstream USD cost.' },
  { name: 'outputRate', label: 'Output test credits / 1M', default: '1000', validate: integer(0, 999999999), help: 'Editable marketplace test-credit price; no cash settlement.' },
];

export async function runTui(options = {}, dependencies = {}) {
  const ui = dependencies.ui ?? new TerminalUI(); let store = dependencies.store ?? new AuthStore(undefined, options.profile ?? 'default');
  let network = dependencies.network; let config; let runtimeConfig; const providersRunning = new Map(); const setupDrafts = new Map(); const limitDrafts = new Map(); let currentProviderId;
  const actor = role => { if (network.local) network.actor = role; };
  const get = async (path, publicAccess = false) => {
    const value = await ui.task('Loading AdRouter', () => network.request(`/v2${path}`, { public: publicAccess }));
    if (path === '/network/config' && (!MarketplaceNetworkConfig(value) || !['allowance_v1','provider_budget_v1','cold_activation_v1'].every(c => value.capabilities.includes(c)))) throw new ClientError('network_contract_mismatch');
    if (path.startsWith('/listings')) {
      const listings = Array.isArray(value.listings) ? value.listings : [value];
      if (!listings.every(MarketplaceListing)) throw new ClientError('listing_contract_mismatch');
    }
    return value;
  };
  const post = (path, body = {}, key = randomUUID()) => ui.task('Saving your choice', () => network.request(`/v2${path}`, { method: 'POST', body, key }));
  const confirm = async (title, lines, label = 'Confirm') => await ui.menu(title, [item(false, 'Back'), item(true, label)], { lines }) === true;
  const attempt = async work => { try { return await work(); } catch (error) { await ui.page('Could not continue', errorLines(error)); return null; } };

  async function signIn(operator = false) {
    let verification;
    const openSafari = (_text, key) => {
      if (key.name !== 'o' || !verification || process.platform !== 'darwin') return;
      // Only an explicit O key opens native Safari; no browser session is inspected.
      const child = spawn('/usr/bin/open', ['-a', 'Safari', verification], { stdio: 'ignore' });
      child.on('error', () => {});
    };
    return ui.task('Sign in to AdRouter', async (signal, update) => {
      const result = await network.login(value => {
        if (value.status === 'approval_required') {
          verification = value.verificationUrl;
          update(['Approve this installation in your browser.', `Comparison code: ${value.comparisonCode}`, '', verification, '', operator ? 'Check the same code before approving operator access.' : 'Check the same code before approving provider access.', process.platform === 'darwin' ? 'Press O to open native Safari.' : 'Open the link in your browser.', 'Waiting for your approval…']);
        }
      }, signal, { operator });
      return result;
    }, { cancel: true, onKey: openSafari, lines: ['Requesting a browser approval code…'] });
  }
  async function spendingBudget(setup = false) {
    actor('provider'); const b = await get('/providers/budget');
    const choice = await ui.menu('Cumulative upstream spending', [item('edit', 'Set total authority'), ...(setup ? [item('keep', 'Use current cap', '', BigInt(b.remainingMicrousd) <= 0n)] : []), item('back', 'Back')], { lines: [`Total: ${formatUsd(b.totalMicrousd)}`, `Consumed: ${formatUsd(b.consumedMicrousd)}`, `Outstanding: ${formatUsd(b.outstandingMicrousd)}`, `Remaining: ${formatUsd(b.remainingMicrousd)}`, 'This cap spans every listing, installation and restart.', 'The separate USD 10 acceptance ceiling includes outstanding liabilities. Test credits are separate.'] });
    if (choice !== 'edit') return choice === 'keep';
    const values = await ui.form('Provider total authority', [{ name: 'totalUsd', label: 'Total USD', default: formatUsd(b.totalMicrousd).slice(4), validate: value => { try { usdToMicrousd(value); return ''; } catch { return 'Enter USD with up to six decimal places.'; } } }]);
    if (!values || !await confirm('Confirm cumulative authority', [`Total authority: ${formatUsd(usdToMicrousd(values.totalUsd))}`, 'Consumed and uncertain spending stay deducted.'], 'Confirm total authority')) return;
    await post('/providers/budget', { totalMicrousd: usdToMicrousd(values.totalUsd), expectedRevision: b.revision, confirmIncrease: true });
    return true;
  }
  async function runtimeSetup() {
    const choice=await ui.menu('Runtime setup',[item('install','Install pinned runtime'),item('existing','Verify an existing runtime'),item('back','Back')]);
    if(!choice||choice==='back')return;
    if(choice==='install') { const {installRuntime}=await import('./runtime-install.mjs');runtimeConfig=await ui.task('Downloading and verifying runtime',signal=>installRuntime({signal}),{cancel:true});await ui.page('Runtime installed',['Pinned executable and library verified.']);return; }

    const values = await ui.form('Runtime setup', [
      { name: 'executable', label: 'Microsandbox executable', maxLength: 2048, validate: required },
      { name: 'library', label: 'libkrunfw library', maxLength: 2048, validate: required },
      { name: 'home', label: 'Dedicated runtime home', maxLength: 2048, validate: required },
    ], runtimeConfig ?? { executable: process.env.ADROUTER_NEW_RUNTIME_EXECUTABLE ?? '', library: process.env.ADROUTER_NEW_RUNTIME_LIBRARY ?? '', home: process.env.ADROUTER_NEW_RUNTIME_HOME ?? '' }, 'Absolute paths. Pinned identities are verified before any guest starts.');
    if (!values) return;
    const { SandboxRuntime } = await import('./runtime.mjs');
    const identity = await ui.task('Checking runtime', () => new SandboxRuntime(values).verify());
    const { saveRuntimeConfig } = await import('./runtime-install.mjs');
    runtimeConfig = await saveRuntimeConfig(values);
    await ui.page('Runtime verified', [`Microsandbox ${identity.version}`, identity.platform, 'Only these non-secret paths are saved. Binary hashes are checked before reuse.']);
  }
  async function launch(node, preparedBounds) {
    const savedBounds = limitDrafts.get(node.id) ?? {}; limitDrafts.set(node.id, savedBounds);
    const bounds = preparedBounds ?? await ui.form(node.availability === 'cold' ? 'Start cold provider control' : 'Start hot provider VM', [
      { name: 'maxCalls', label: 'Maximum requests', default: '5', validate: integer(1, 30) },
      { name: 'maxOutputTokens', label: 'Output tokens / request', default: '1024', validate: integer(1, 8192) },
    ], savedBounds, 'One concurrent session. VM lifetime: at most nine minutes. Enter your API key only in the VM console.');
    if (!bounds) return;
    Object.assign(savedBounds, bounds);
    const { startProvider } = await import('./provider.mjs');
    if (!await confirm('Launch this VM?', [node.name, `Endpoint: ${node.endpoint}`, `Model: ${node.model}`, `Maximum requests: ${bounds.maxCalls}`, `Maximum output per request: ${bounds.maxOutputTokens}`, 'Publish your listing and qualify its current tariff before your private evaluation.', 'The terminal will attach directly to the guest. Ctrl+C stops it.'], node.availability === 'cold' ? 'Start cold control' : 'Launch hot VM')) return;
    const result = await ui.suspend(() => startProvider(network, node.id, { maxCalls: Number(bounds.maxCalls), maxOutputTokens: Number(bounds.maxOutputTokens), runtimeConfig, notify: value => { if (value.status === 'activation_required' && currentProviderId === node.id) ui.pending?.resolve('refresh'); } }));
    providersRunning.set(node.id, result);
    await ui.page('Provider operation started', ['Keep this TUI open.', `VM: ${result.status.guestReady ? 'ready' : 'not started'}`, `Backend: ${result.status.relayReady ? 'Hot · ready' : 'awaiting relay confirmation'}`, 'Refresh the listing to read backend readiness.']);
  }
  async function createListing() {
    actor('provider');
    const draftKey = `${store.profile ?? 'default'}:${network.origin}`;
    const savedDraft = setupDrafts.get(draftKey);
    const preset = savedDraft ? 'resume' : await ui.menu('List compute · 1 of 3', [item('deepseek', 'DeepSeek Flash · official API', 'Prefill your selected test provider. Uses the documented deepseek-flash request ID.'), item('custom', 'Other authorized API'), item('self', 'Self-hosted inference')], { subtitle: 'Keys stay with you. Only public listing metadata is submitted.' });
    if (!preset) return;
    // Operator-selected test configuration, not a claim about general model capabilities.
    let draft = savedDraft ?? (preset === 'deepseek' ? { name: 'DeepSeek Flash - hot compute', model: 'deepseek-flash', endpoint: 'https://api.deepseek.com/chat/completions', supplyClass: 'authorized_api' } : { supplyClass: preset === 'self' ? 'self_hosted' : 'authorized_api' });
    setupDrafts.set(draftKey, draft);
    for (;;) {
      const edited = await ui.form('List compute · 2 of 3', providerFields, draft, 'Defaults are editable. Only public listing metadata is submitted.');
      if (!edited) return;
      Object.assign(draft, edited);
      if (!MarketplaceDraft(draft)) { await ui.page('Check listing fields', ['Use printable metadata and integer test-credit prices.']); continue; }
      const decision = await ui.menu('List compute · 3 of 3', [item('edit', 'Edit details'), item('create', 'Create draft and configure provider'), item('cancel', 'Cancel')], { lines: [draft.name, `${draft.model} · ${draft.availability}`, draft.endpoint, `Supply: ${words(draft.supplyClass)}`, `Input ${draft.inputRate} / output ${draft.outputRate} test credits per 1M tokens`, '', 'Publish your listing and qualify its current tariff before your private evaluation.'] });
      if (decision === 'edit') continue;
      if (decision !== 'create') return;
      const node = await post('/providers/nodes', draft);
      setupDrafts.delete(draftKey);
      await guidedProvider(node);
      await manageNode(node.id, true); return;
    }
  }
  async function guidedProvider(node) {
    // A server draft is already durable; Back never deletes it.
    const { configuredRuntime } = await import('./provider.mjs');
    const { SandboxRuntime } = await import('./runtime.mjs');
    let verified = false;
    while (!verified) {
      try {
        await ui.task('Verify provider VM runtime', async () => (runtimeConfig ? new SandboxRuntime(runtimeConfig) : await configuredRuntime()).verify());
        verified = true;
      } catch {
        if (!await confirm('Set up the lightweight VM', ['Your listing draft is saved.', 'Install or verify the pinned runtime before setting provider limits.'], 'Configure runtime')) return;
        await runtimeSetup();
        if (!runtimeConfig) return;
      }
    }
    const bounds = limitDrafts.get(node.id) ?? {}; limitDrafts.set(node.id, bounds);
    const edited = await ui.form('Provider limits', [
      { name: 'maxCalls', label: 'Maximum requests', default: '5', validate: integer(1, 30) },
      { name: 'maxOutputTokens', label: 'Output tokens / request', default: '1024', validate: integer(1, 8192) },
    ], bounds, 'One concurrent session · maximum VM lifetime nine minutes.');
    if (!edited) return;
    Object.assign(bounds, edited);
    const budget = await get('/providers/budget');
    if (!await confirm('Cumulative provider spending', [`Remaining: ${formatUsd(budget.remainingMicrousd)}`, 'Consumed and outstanding amounts persist across retries and restarts.', 'The independent USD 10 acceptance ceiling also applies.'], 'Review or set spending cap')) return;
    if (!await spendingBudget(true)) return;
    if (BigInt((await get('/providers/budget')).remainingMicrousd) <= 0n) { await ui.page('Spending cap required', ['Set a cap with remaining authority before launching the provider.']); return; }
    node = await get(`/providers/nodes/${node.id}`);
    if (node.suspended) { await ui.page('Listing suspended', ['An operator must clear suspension before you can republish.']); return; }
    if (node.status !== 'published') {
      if (!await confirm('Publish this listing?', [node.name, node.endpoint, node.model, 'Publication exposes listing metadata.', ...(config?.admissions === false ? ['Ordinary purchases remain disabled on this network.'] : []), 'Provider credentials will be entered only inside the guest.'], 'Publish')) return;
      await post(`/providers/nodes/${node.id}/publish`);
      node = await get(`/providers/nodes/${node.id}`);
    }
    if (!node.tariffQualified) {
      await ui.page('Qualify the current tariff', ['Publish your listing and qualify its current tariff before your private evaluation.', 'Your listing is published. In the separate operator profile, choose Qualify upstream tariff.', 'Then choose Continue setup from My provider listings.']); return;
    }
    await launch(node, bounds);
  }
  async function manageNode(id, created = false) {
    for (;;) {
      const node = await get(`/providers/nodes/${id}`);
      if (providersRunning.get(node.id)?.status.stopped) providersRunning.delete(node.id);
      currentProviderId = node.id;
      const selection = await ui.menu(created ? 'Your listing is drafted' : node.name, [
        item('setup', 'Continue setup', 'Runtime → limits → publication → tariff → guest → relay', providersRunning.has(node.id)),
        item('launch', node.availability === 'cold' ? 'Start cold control' : 'Launch hot VM', 'Keep this TUI open while providing.', providersRunning.has(node.id)),
        ...(providersRunning.get(node.id)?.status.activation.length ? [item('activate', 'Activate reserved buyer session', 'Launch the VM and enter the key before the 120-second deadline.')] : []),
        item('publish', 'Publish listing', 'Exposes listing metadata as a new immutable revision.', node.suspended),
        item('pause', 'Pause listing'), item('stop', 'Stop serving and close sessions'), item('refresh', 'Refresh status'), item('back', 'Back'),
      ], { lines: [`Model: ${node.model}`, `Suspended: ${node.suspended ? 'yes' : 'no'} · Listing: ${node.status}`, `VM: ${providersRunning.get(node.id)?.status.guestReady ? 'ready' : 'not running'}`, `Backend: ${node.ready ? 'Hot · ready' : node.availability === 'cold' && Number(node.leaseUntil) > Date.now() ? 'cold · control online' : 'offline'}`, `Listing reference: ${node.id}`] });
      currentProviderId = undefined; created = false;
      if (!selection || selection === 'back') return;
      await attempt(async () => {
        if (selection === 'setup') await guidedProvider(node);
        else if (selection === 'launch') await guidedProvider(node);
        else if (selection === 'activate') await ui.suspend(() => providersRunning.get(node.id).warm());
        else if (selection === 'stop' && providersRunning.has(node.id)) { await providersRunning.get(node.id).stop(); providersRunning.delete(node.id); }
        else if (selection !== 'refresh' && await confirm(`${words(selection)} listing?`, [node.name, selection === 'stop' ? 'Known unused credits are released; unknown outcomes remain held.' : 'This changes the public availability of this listing.'])) await post(`/providers/nodes/${node.id}/${selection}`);
      });
    }
  }
  async function providers() {
    actor('provider');
    for (;;) {
      const nodes = await get('/providers/nodes');
      const selected = await ui.menu('My provider listings', [...nodes.map(n => item(n.id, `${n.name} · ${n.suspended ? 'suspended · ' : ''}${n.status}`)), item('new', '+ List new compute'), item('back', 'Back')], { subtitle: nodes.length ? 'Select a listing to launch, publish, pause or stop.' : 'You have no listings yet.' });
      if (!selected || selected === 'back') return;
      await attempt(() => selected === 'new' ? createListing() : manageNode(selected));
    }
  }
  async function buy(listing) {
    actor('buyer');
    const bounds = await ui.form('Choose a bounded test session', [
      { name: 'budget', label: 'Maximum test credits', default: '100', validate: integer(1, 1000000), help: 'The server reserves this ceiling, then refunds known unused credits.' },
      { name: 'output', label: 'Maximum output tokens', default: '1024', validate: integer(1, 8192) },
      { name: 'duration', label: 'Session seconds', default: '300', validate: integer(60, 600) },
    ], {}, listing.name);
    if (!bounds) return;
    const quote = await post('/quotes', { listingId: listing.id, maximumCharge: bounds.budget, maxOutputTokens: Number(bounds.output), durationSeconds: Number(bounds.duration) });
    if (!await confirm('Review your quote', [...listingLines(listing), '', `Maximum reserved: ${quote.maximumCharge} test credits`, `Output limit: ${quote.maxOutputTokens} tokens`, `Session duration: ${quote.durationSeconds} seconds`, `Quote expires: ${date(quote.expiresAt)}`, `Cold activation deadline: ${quote.activationDeadlineSeconds || 0} seconds. Expired activation refunds the reservation.`], 'Accept and reserve test credits')) return;
    const session = await post('/sessions', { quoteId: quote.id, accept: true }, `accept_${quote.id}`);
    await sessionDetail(session.id);
  }
  async function browse() {
    actor('buyer'); let filters = { model: '', supplyClass: 'any', availability: 'any' }; let cursor;
    for (;;) {
      const query = new URLSearchParams();
      for (const [key, value] of Object.entries(filters)) if (value && value !== 'any') query.set(key, value);
      if (cursor) query.set('after', cursor);
      const result = await get(`/listings?${query}`, true);
      const selection = await ui.menu('Browse available compute', [item('filters', 'Search and filters'), ...result.listings.map(l => item(l.id, `${l.name} · ${l.ready ? 'ready' : 'offline'}`, `${l.model} · ${l.inputRate}/${l.outputRate} test credits per 1M tokens`)), ...(result.nextCursor ? [item('next', 'Next page')] : []), item('refresh', 'Refresh from first page'), item('back', 'Back')], { subtitle: result.listings.length ? 'Select compute to inspect its price and reserve access.' : 'No published listings match. Try changing filters or return after a provider publishes.' });
      if (!selection || selection === 'back') return;
      if (selection === 'filters') { const edited = await ui.form('Compute filters', [{ name: 'model', label: 'Model contains', help: 'Leave blank for every model.' }, { name: 'supplyClass', label: 'Supply', choices: ['any', 'authorized_api', 'self_hosted'] }, { name: 'availability', label: 'Availability', choices: ['any', 'hot', 'cold'] }], filters); if (edited) filters = edited; cursor = undefined; }
      else if (selection === 'next') cursor = result.nextCursor;
      else if (selection === 'refresh') cursor = undefined;
      else await attempt(async () => {
        const listing = await get(`/listings/${selection}`, true);
        const action = await ui.menu('Compute details', [item('buy', 'Get a test-credit quote', listing.ready ? 'Review exact limits before reserving.' : 'The provider must start before a quote can be accepted.', !config?.admissions || !(listing.ready || (listing.availability === 'cold' && listing.controlOnline))), item('back', 'Back')], { lines: listingLines(listing) });
        if (action === 'buy') await buy(listing);
      });
    }
  }
  async function buyerAgent(session) {
    const input = await ui.form('Buyer workspace', [
      { name: 'root', label: 'Workspace directory', default: process.cwd(), validate: required },
      { name: 'files', label: 'Files to import (comma separated)', help: 'Explicit relative paths. No secrets, hidden files, symlinks or archives.', validate: required },
      { name: 'prompt', label: 'Coding task', maxLength: 32000, validate: required },
    ]);
    if (!input || !await confirm('Start isolated buyer VM?', ['Tools run only in a disposable VM without network.', 'Each command or mutation needs a separate approval.', 'Export creates a reviewed snapshot; original files remain unchanged.'])) return;
    const { runBuyer } = await import('./buyer.mjs');
    const abort = new AbortController();
    const result = await runBuyer(network, session.id, { ...input, files: input.files.split(',').map(x => x.trim()), runtimeConfig, signal: abort.signal,
      approve: (action, permission) => confirm('Approve this action once?', [action.name, JSON.stringify(action.args ?? action.changes, null, 2), `Approval expires: ${date(permission.expiresAt)}`], 'Allow once'),
      activity: (title, work) => ui.task(title, work, { cancel: true }),
      progress: async value => { if (value.status === 'answer' && value.text) await ui.page('Agent response', [value.text]); },
    });
    await ui.page('Reviewed workspace exported', [result.directory, result.manifest, 'The manifest lists additions, modifications and deletions.']);
  }
  async function sessionDetail(id) {
    for (;;) {
      const session = await get(`/sessions/${id}`);
      const choice = await ui.menu('Test-credit session', [item('agent', 'Start buyer coding agent', 'Select files, approve tools and export a reviewed workspace.', !['ready','active'].includes(session.state)), item('events', 'Activity and recovery'), item('stop', 'Stop and release unused credits'), item('refresh', 'Refresh'), item('back', 'Back')], { lines: [`Status: ${words(session.state)}`, `Reserved access: ${session.funded} · Charged: ${session.charged}`, `Unresolved liability: ${session.reserved} · Refunded: ${session.refunded}`, `Expires: ${date(session.expiresAt)}`, `Reference: ${session.id}`, '', 'Reconnect restores status. Paid requests and tool actions are never replayed.'] });
      if (!choice || choice === 'back') return;
      if (choice === 'agent') await buyerAgent(session);
      if (choice === 'events') { const events = await get(`/sessions/${id}/events`); await ui.page('Session activity', events.length ? events.map(e => `${date(e.at)} · ${words(e.type)}`) : ['No activity yet.']); }
      if (choice === 'stop' && await confirm('Stop session?', ['Known unused credits will be returned. Unknown inference outcomes stay held.'])) await post(`/sessions/${id}/stop`);
    }
  }
  async function sessions() {
    actor('buyer');
    const values = await get('/sessions');
    const choice = await ui.menu('My sessions', [...values.map(s => item(s.id, `${words(s.state)} · ${s.charged}/${s.funded} credits · ${s.id.slice(0, 8)}`)), item('back', 'Back')], { subtitle: values.length ? 'Inspect, recover status or stop a session.' : 'No sessions yet. Browse compute to get a quote.' });
    if (choice && choice !== 'back') await sessionDetail(choice);
  }
  async function receipts() {
    actor('buyer'); const values = await get('/receipts');
    await ui.page('Receipts · test credits only', values.length ? values.flatMap(r => [`${date(r.at)} · ${words(r.state)}`, `Funded ${r.funded} · Charged ${r.charged} · Refunded ${r.refunded}`, `Reason: ${words(r.reason)}`, `Session: ${r.sessionId}`, '']) : ['No settled receipts yet.', 'Receipts appear after session settlement. Test credits have no cash value.']);
  }
  async function admin() {
    actor('admin');
    const choice = await ui.menu('Marketplace operator', [item('suspension', 'Manage listing suspension'), item('cancellationReview', 'Review evaluation cancellation'), ...(network.local ? [item('grant', 'Grant local test credits')] : []), item('allowance','Manage marketplace allowances'), item('evaluation', 'Evaluation queue'), item('evaluationSessions', 'Evaluation sessions'), item('tariff', 'Qualify upstream tariff'), item('reconcile', 'Reconcile uncertain requests'), item('back', 'Back')], { subtitle: network.local ? 'Local fixtures only.' : 'Requires a separately approved marketplace operator installation.' });
    if (choice === 'evaluationSessions') {
      const sessions = await get('/admin/evaluation-sessions');
      const id = await ui.menu('Evaluation sessions', [...sessions.map(s => item(s.id, `${s.state} · ${s.id}`, `Evaluation only · reserved ${s.funded} · charged ${s.charged}`)), item('back', 'Back')]);
      if (id && id !== 'back' && await confirm('Stop evaluation session?', ['Known unused allowance is released. Unknown upstream liability stays reserved.'])) await post(`/admin/evaluation-sessions/${id}/stop`);
    } else if(choice==='allowance') {
      const policies=await get('/admin/allowances');const id=await ui.menu('Marketplace policies',[...policies.map(p=>item(p.id,p.id==='platform'?'Platform':p.ownerId,`Daily ${p.dailyLimit} · Monthly ${p.monthlyLimit} · Held ${p.held}`)),item('back','Back')]);if(!id||id==='back')return;
      const policy=policies.find(p=>p.id===id);
      const values=await ui.form('Separate marketplace limits',[{name:'dailyLimit',label:'Daily test credits',default:policy.dailyLimit,validate:integer(0,999999999999999)},{name:'monthlyLimit',label:'Monthly test credits',default:policy.monthlyLimit,validate:integer(0,999999999999999)},{name:'reviewReference',label:'Change reference',validate:required}]);
      if(values&&await confirm('Update marketplace limits?', ['Legacy balances and limits remain separate.',JSON.stringify(values,null,2)]))await post(`/admin/allowances/${id}`,{...values,expectedRevision:policy.revision});
    } else if(choice==='reconcile') {
      const requests=await get('/admin/requests');const id=await ui.menu('Uncertain requests',[...requests.map(r=>item(r.id,r.id,`Held upstream: ${r.upstreamReserved} micro-USD`)),item('back','Back')]);
      if(!id||id==='back')return;
      const evidence=await ui.form('Verified upstream outcome',[{name:'inputTokens',label:'Verified input tokens',validate:integer(0,262144)},{name:'outputTokens',label:'Verified output tokens',validate:integer(0,8192)},{name:'reviewReference',label:'Evidence reference',validate:required}]);
      if(evidence&&await confirm('Settle verified outcome?', ['Never infer zero usage from a timeout. This does not replay inference.']))await post(`/admin/requests/${id}/resolve`,{inputTokens:Number(evidence.inputTokens),outputTokens:Number(evidence.outputTokens),reviewReference:evidence.reviewReference});
    } else if(choice==='tariff') {
      const nodes=await get('/admin/evaluations');const id=await ui.menu('Choose provider',[...nodes.map(n=>item(n.nodeId,n.name)),item('back','Back')]);if(!id||id==='back')return;
      const tariff=await ui.form('Qualified upstream tariff',[{name:'version',label:'Tariff version',validate:required},{name:'inputMicrousdPerMillion',label:'Input micro-USD per million tokens (cache miss)',validate:integer(0,999999999999999)},{name:'outputMicrousdPerMillion',label:'Output micro-USD per million tokens',validate:integer(0,999999999999999)},{name:'reviewReference',label:'Qualification evidence',validate:required}]);
      if(tariff&&await confirm('Qualify tariff for 24 hours?', [JSON.stringify(tariff,null,2)]))await post(`/admin/nodes/${id}/tariff`,{...tariff,qualifiedUntil:Date.now()+86400000});
    } else if (choice === 'evaluation') {
      const nodes = await get('/admin/evaluations');
      const id = await ui.menu('Evaluation queue', [...nodes.map(n=>item(n.nodeId,n.name,n.qualified?'Qualified':'Evaluation needed')),item('back','Back')]);
      if (!id || id==='back') return;
      const values = await ui.form('Evaluation budget', [{name:'maximumCharge',label:'Maximum test credits',default:'100',validate:integer(1,1000000)}]);
      if (!values || !await confirm('Run budgeted evaluation?', ['Provider upstream authority is reserved. Generated code runs in an offline disposable VM.', 'Result remains provisional until upstream cancellation evidence is reviewed.'])) return;
      const { evaluateNode } = await import('./evaluation.mjs');
      const result = await ui.task('Private owner evaluation', (signal, update) => evaluateNode(network, id, { ...values, runtimeConfig, signal, progress: value => update([words(value.status), ...(value.remainingSeconds ? [`Activate the provider within ${value.remainingSeconds} seconds.`] : []), ...(value.sessionId ? [`Evaluation session: ${value.sessionId}`] : []), 'Esc cancels. Uncertain upstream charges remain reserved.']) }), { cancel: true }); await ui.page('Evaluation result',[JSON.stringify(result,null,2)]);
    } else if (choice === 'suspension') {
      const nodes = await get('/admin/nodes');
      const id = await ui.menu('Listing suspension', [...nodes.map(n => item(n.id, n.name, n.suspended ? 'Suspended' : words(n.status))), item('back', 'Back')]);
      if (!id || id === 'back') return;
      const node = nodes.find(n => n.id === id);
      const reason = await ui.form(node.suspended ? 'Clear suspension' : 'Suspend listing', [{ name: 'reason', label: 'Operator reason', validate: required }]);
      if (reason && await confirm(node.suspended ? 'Clear suspension?' : 'Suspend listing?', ['The listing stays paused until its provider explicitly republishes.', 'Sessions stop; uncertain charges remain reserved.'])) await post(`/admin/nodes/${id}/suspension`, { suspended: !node.suspended, reason: reason.reason });
    } else if (choice === 'cancellationReview') {
      const nodes = await get('/admin/evaluations');
      const id = await ui.menu('Choose evaluation to review', [...nodes.map(n => item(n.nodeId, n.name)), item('back', 'Back')]);
      if (!id || id === 'back') return;
      const node = nodes.find(n => n.nodeId === id);
      const listing = await get(`/listings/${node.listingId}`, true), evaluation = listing.evaluation;
      if (!evaluation?.cancellationRequestId) { await ui.page('Cancellation evidence unavailable', ['This listing has no recorded evaluation cancellation to review.']); return; }
      const evidence = await ui.form('Independent cancellation review', [{ name: 'reviewReference', label: 'Upstream evidence reference', validate: required }], {}, 'Use a different approved operator installation from the evaluation runner. Reconcile usage from independent upstream evidence first.');
      if (evidence && await confirm('Record independent cancellation review?', [`Session: ${evaluation.sessionId}`, `Request: ${evaluation.cancellationRequestId}`, 'A closed connection alone does not prove computation or billing stopped.'])) await post(`/admin/evaluations/${id}/review`, { evaluationId: evaluation.id, sessionId: evaluation.sessionId, requestId: evaluation.cancellationRequestId, reviewReference: evidence.reviewReference });
    } else if (choice === 'grant') {
      const input = await ui.form('Grant local test credits', [{ name: 'userId', label: 'Local account', default: 'local-buyer', choices: ['local-buyer', 'local-provider'] }, { name: 'amount', label: 'Test credits', default: '1000', validate: integer(1, 1000000) }]);
      if (input && await confirm('Grant test credits?', [`${input.amount} test credits to ${input.userId}`, 'No cash value.'])) await post('/admin/grants', input);
    }
  }
  async function selectProfile() {
    if (providersRunning.size) { await ui.page('Provider is running', ['Keep this profile open and start another terminal with adr-cli --profile operator. Stop providers before switching profiles.']); return; }
    const chosen = await ui.menu('Choose profile', [item('default', 'Default', 'Preserves the original installation'), item('provider', 'Provider', 'Independent provider installation and refresh state'), item('operator', 'Operator', 'Independent operator approval'), item('custom', 'Named profile'), item('back', 'Back')]);
    if (!chosen || chosen === 'back') return;
    let profile = chosen;
    if (chosen === 'custom') { const value = await ui.form('New or existing profile', [{ name: 'profile', label: 'Profile name', validate: value => /^[a-z][a-z0-9_-]{0,31}$/.test(value) ? '' : 'Use up to 32 lowercase letters, digits, underscores or hyphens.' }]); if (!value) return; profile = value.profile; }
    const next = new AuthStore(store.home, profile);
    const origin = (await next.read())?.origin ?? network.origin;
    store = next; network = new Network({ origin, local: network.local, actor: options.actor ?? 'buyer', store });
    config = await get('/network/config', true);
    ui.context = `${store.profile} · ${network.local ? 'LOCAL · test credits' : network.origin}`;
  }
  let terminating = false;
  const terminate = () => { terminating = true; ui.pending?.resolve(null); ui.terminate(); };
  process.once('SIGTERM', terminate); process.once('SIGINT', terminate);
  ui.start();
  try {
    if (!network) {
      let origin = options.network; let local = !!options.local;
      if (local && !origin) origin = 'http://127.0.0.1:8790';
      if (!origin) origin = (await store.read())?.origin;
      if (!origin) {
        const choice = await ui.menu('Welcome to AdRouter', [item('staging', 'Sign in to AdRouter staging'), item('custom', 'Choose another network'), item('local', 'Local development', 'Uses the loopback test marketplace; no real sign-in or money.'), item('exit', 'Exit')]);
        if (!choice || choice === 'exit') return;
        local = choice === 'local'; origin = local ? 'http://127.0.0.1:8790' : 'https://api-staging.adrouter.co';
        if (choice === 'custom') { const input = await ui.form('Choose network', [{ name: 'origin', label: 'HTTPS API origin', default: origin, maxLength: 2048, validate: v => { try { networkOrigin(v); return ''; } catch { return 'Use an HTTPS origin with no path or credentials.'; } } }]); if (!input) return; origin = input.origin; }
      }
      network = new Network({ origin, local, actor: options.actor ?? 'buyer', store });
    }
    ui.context = `${store.profile ?? 'default'} · ${network.local ? 'LOCAL · test credits' : network.origin}`;
    config = await attempt(() => get('/network/config', true));
    for (;;) {
      if (terminating) return;
      if (!network.local && !(await store.read())) {
        const selection = await ui.menu('Sign in to AdRouter', [item('login', store.profile === 'operator' ? 'Approve operator in browser' : 'Continue in browser', 'Approve this profile with the comparison code.'), ...(store.profile === 'operator' ? [] : [item('operatorLogin', 'Sign in as operator', 'Separate approval; current owner/operator role required.')]), item('profiles', 'Choose profile'), item('diagnostics', 'Network status'), item('exit', 'Exit')], { subtitle: config?.admissions === false ? (config.privateOwnerEvaluation ? 'Private owner evaluation only. Ordinary purchases are disabled.' : 'This network has marketplace admissions disabled.') : 'Your installation is separate from other AdRouter clients.' });
        if (!selection || selection === 'exit') return;
        if (selection === 'profiles') await attempt(selectProfile);
        else if (selection === 'login') await attempt(() => signIn(store.profile === 'operator'));
        else if (selection === 'operatorLogin') await attempt(() => signIn(true));
        else await ui.page('Network status', [network.origin, `Marketplace: ${config ? (config.admissions ? 'accepting' : 'disabled') : 'unavailable'}`]);
        continue;
      }
      const scope = network.local ? ['marketplace:buyer', 'marketplace:provider', 'marketplace:operator'] : String((await store.read())?.scope ?? '').split(' ');
      const selection = await ui.menu('What would you like to do?', [
        item('browse', 'Browse compute', 'Find listings, compare prices and reserve bounded test-credit access.'),
        ...(scope.includes('marketplace:provider') ? [item('create', 'List compute', 'Guided publication and hot/cold provider operation.'), item('providers', 'My provider listings'), item('budget', 'Provider spending budget')] : []),
        ...(scope.includes('marketplace:buyer') ? [item('sessions', 'My sessions'), item('receipts', 'Receipts')] : []), item('account', 'Account and sign-in'), item('profiles', 'Choose profile'), item('runtime', 'Runtime setup'), item('status', 'Network and diagnostics'),
        ...(scope.includes('marketplace:operator') ? [item('admin', network.local ? 'Local test operator' : 'Marketplace operator')] : []), item('exit', 'Exit'),
      ], { subtitle: `${network.local ? 'Local development identity · ' : ''}Test credits have no cash value.` });
      if (!selection || selection === 'exit') return;
      await attempt(async () => {
        if (selection === 'profiles') await selectProfile();
        else if (selection === 'budget') await spendingBudget();
        else if (selection === 'browse') await browse(); else if (selection === 'create') await createListing();
        else if (selection === 'providers') await providers(); else if (selection === 'sessions') await sessions();
        else if (selection === 'receipts') await receipts(); else if (selection === 'runtime') await runtimeSetup();
        else if (selection === 'admin') await admin();
        else if (selection === 'account') {
          actor('buyer'); const operator = !network.local && (await store.read())?.scope?.includes('marketplace:operator'); const profile = await get(operator ? '/admin/me' : scope.includes('marketplace:buyer') ? '/me' : '/providers/me');
          const action = await ui.menu('Account', [item('logout', network.local ? 'Return to welcome' : 'Sign out and revoke installation'), item('back', 'Back')], { lines: [`Account: ${profile.userId}`, `Permissions: ${profile.roles.join(', ')}`, `Available: ${profile.account.available} · Held: ${profile.account.held} · Earned: ${profile.account.earned}`, 'All balances are test credits with no cash value.'] });
          if (action === 'logout' && await confirm('Sign out?', ['Hosted sign-out revokes the installation before clearing local state.'])) await ui.task('Signing out', () => network.logout());
        } else if (selection === 'status') {
          config = await get('/network/config', true);
          await ui.page('Network and implementation status', [network.origin, `Admissions: ${config.admissions ? 'enabled' : 'disabled'}`, `Private owner evaluation: ${config.privateOwnerEvaluation ? 'enabled for designated owner' : 'disabled'}`, `Relay: ${words(config.relay)}`, `Buyer agent: ${words(config.agentExecution)}`, 'Provider: guest-only key entry; cold activation deadline 120 seconds.', 'Evaluation results remain provisional until every qualification check is verified. Reviewed export preserves host originals.', 'Runtime acceptance and actual provider acceptance are separate gates.']);
        }
      });
    }
  } finally {
    process.removeListener('SIGTERM', terminate); process.removeListener('SIGINT', terminate);
    const cleanup = await Promise.allSettled([...providersRunning.values()].map(p => p.stop())); ui.stop();
    if (cleanup.some(r => r.status === 'rejected' || r.value?.status === 'cleanup_required')) throw new ClientError('provider_cleanup_required');
  }
}
