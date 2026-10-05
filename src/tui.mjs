import { safeFailure, failureLines, failureSummary, readPrivateDiagnostic, exportFailure } from './failure-diagnostics.mjs';
import { pollLiveMenu } from './tui-polling.mjs';
import packageMetadata from '../package.json' with {type:'json'};
import { diagnoseProvider, diagnosisLines, retryProviderReports, retryProviderCleanup, providerEvidence, normalizeDiagnosis } from './provider-diagnose.mjs';
import { modelStatusLines, providerRow, visibleModelStatus } from './model-status.mjs';
import { connectionCapabilities } from './provider-models.mjs';
import {providerRequiresBudget} from './generated/provider-budget.mjs';
import { providerCanLaunch, providerDiagnostic, providerDiagnosticLines } from './provider-diagnostics.mjs';
import { providerCatalog as piCatalog } from './generated/provider-catalog.mjs';
import { validateBinding } from './provider-broker.mjs';
import { nativeFailureLines, providerFailureLines } from './coding-display.mjs';
import { connectorCatalog, resolveConnector, connectorReviewLines, CONNECTOR_PROTOCOL } from './connectors.mjs';
import { ProviderActivityMonitor, providerActivityLines, providerConnectionLabel } from './provider-activity.mjs';
import { recoverableStatusFailure } from './buyer-lifecycle.mjs';
import { MarketplaceDisplay } from './marketplace-display.mjs';
import { usdToMicrousd, formatUsd } from './money.mjs';
import { randomUUID } from 'node:crypto';
import { spawn } from 'node:child_process';
import { TerminalCoordinator } from './terminal-coordinator.mjs';
import { TerminalUI } from './tui-screen.mjs';
import { AuthStore, Network, ClientError, networkOrigin, safeText, authRecoveryCodes, loginHint } from './network.mjs';
import { MarketplaceDraft, MarketplaceListing, MarketplaceNetworkConfig, ProviderNodeDeletion } from './generated/validators.mjs';

export const accountingLines=s=>s?[`Execution: ${words(s.executionState??(s.stoppedAt?'stopped':s.state))}`,`Accounting: ${words(s.accountingState??s.state)}`,`Cleanup: ${words(s.cleanupState??'pending')}`,`Reserved ${s.funded} · Charged ${s.charged} · Refunded ${s.refunded} test credits`,`Unresolved liability: ${s.reserved}`,s.state==='settlement_pending'?'Receipt pending: upstream outcome is unresolved.':`Settlement: ${words(s.state)}`]:['Receipt pending: remote stop/accounting could not be confirmed. Inspect My sessions.'];
export const providerStatusLines = (s, now = Date.now()) => [...(s.diagnosticSaveFailed?['Diagnostic save failed · retained evidence may be incomplete']:[]),...providerDiagnosticLines(s.setupFailure),s.stopped ? 'Provider operation has stopped.' : 'Keep this TUI open.',
  `VM: ${s.stopped ? s.teardownVerified === false ? 'teardown unverified' : s.teardownVerified === true ? 'not running' : 'stopping' : s.guestReady ? 'ready' : 'starting'}`,
  `Backend: ${s.stopped ? 'offline' : s.backendConfirmedAt && now - s.backendConfirmedAt < 15000 && s.relayReady && s.relayLeaseUntil > now ? 'Hot · ready' : s.firstFailure ? 'reconnecting' : 'awaiting relay confirmation'}`,
  `State: ${words(s.runtimeState??s.state ?? (s.stopped?'stopped':'connecting'))}`,
  `Publication: ${words(s.publication ?? 'unknown')}`,
  `Relay: ${s.relayReady && s.relayLeaseUntil > now ? 'authenticated' : 'unconfirmed'}`,
  `Backend confirmation: ${s.backendConfirmedAt ? date(s.backendConfirmedAt) : 'unknown'}`,
  ...(s.qualification??[]).flatMap(q=>[`${q.model} · ${q.phase}: ${{pending:'Not tested',reserving:'Testing',running:'Testing',passed:'Passed',failed:'Failed',unknown:'Result unconfirmed'}[q.status]??q.status}`,...Object.entries(q.checks??{}).map(([phase,status])=>`  ${words(phase)}: ${status}`)]),
  ...(!s.setupFailure&&s.firstFailure?['Earlier diagnostic:',...providerDiagnosticLines(s.firstFailure)]:[]),
  ...(s.cleanupOutcomes??[]).map(o=>`Cleanup ${words(o.phase)}: ${o.status}${o.code?' · '+o.code:''}`),
  ...providerFailureLines(s.lastUpstreamFailure),
  ...(s.stopTrigger ? [`Stopped: ${words(s.stopTrigger.trigger)}`] : ['Refresh the listing to read backend readiness.'])];
export function catalogModelsForConnection(provider,connection) {
  if(connection?.kind!=='custom')return piCatalog.providers.find(p=>p.id===provider)?.models??[];
  if(!connection.baseUrl)return [];
  const matches=piCatalog.providers.flatMap(p=>p.models).filter(m=>{
    try{return new URL(m.baseUrl).href.replace(/\/$/,'')===new URL(connection.baseUrl).href.replace(/\/$/,'')&&(!connection.api||m.api===connection.api||connection.api==='openai-completions'&&m.api==='sdk:@ai-sdk/openai-compatible');}catch{return false;}
  });
  return [...new Map(matches.map(m=>[m.id,m])).values()];
}
const item = (value, label, detail = '', disabled = false) => ({ value, label, action:['status','diagnose','retryReport','cleanup','pause','stop','delete','setup','refresh','new','filters','next','back'].includes(value), detail:Array.isArray(detail)?detail.join(' '):detail, details:Array.isArray(detail)?detail:undefined, disabled });
const required = value => value.trim() ? '' : 'Please enter a value.';
const integer = (min, max) => value => /^(0|[1-9][0-9]*)$/.test(value) && Number.isSafeInteger(Number(value)) && Number(value) >= min && Number(value) <= max ? '' : `Enter a whole number from ${min} to ${max}.`;
const date = value => typeof value === 'number' ? new Date(value).toLocaleString() : '—';
const words = value => String(value ?? '—').replaceAll('_', ' ');
const problems = {
  listing_contract_mismatch:'Router returned incompatible listing data. This is an AdRouter software error; changing the model or API key will not fix it.',
  provider_catalog_upgrade_required:'This connection and client use different pinned provider catalogs. Update the client, then edit and save the stopped connection before setup.',
  provider_terminal_cleanup_required:'Finish cleanup of this terminal’s current provider VM before preparing another connection.',
  provider_model_metadata_required:'This provider has no selectable model with complete source-backed pricing and coding metadata. Add verified metadata through Custom API setup.',
  sdk_compatibility_unsupported:'This SDK adapter cannot serialize the explicit compatibility overrides. Remove unsupported overrides or choose the matching implemented adapter.',
  model_setting_unsupported:'The selected adapter cannot serialize that model setting. Review the model’s supported settings; no alternative was selected.',
  pi_reasoning_metadata_unverified: 'This saved model advertises unverified thinking support. Edit and save the connection to derive capabilities from Pi metadata before Start.',
  pi_setup_required: 'Open the provider connection in the TUI and choose Continue setup, then Start provider to authorize qualification.',
  node_delete_requires_paused: 'Pause this listing before deleting it. A serving listing cannot be deleted.',
  node_delete_requires_settlement: 'This listing still has unfinished sessions or accounting. Finish settlement before deleting it; held amounts remain unchanged.',
  node_deleted: 'This listing has been permanently deleted and cannot be restored or republished.',
  network_policy_unavailable: 'Network policy is unavailable. Refresh Network and diagnostics, then try again.',
  private_rehearsal_disabled: 'This network has purchases disabled and private buyer rehearsal is not enabled.',
  cold_private_rehearsal_unavailable: 'Cold buyer activation is unavailable in private rehearsal. Ask the provider to warm the listing.',
  node_already_connected: 'This provider already has a current run. Keep its terminal open; the second start was rejected.',
  provider_run_contract_required: 'This private provider requires the matching updated Router lifecycle contract.',
  provider_run_superseded: 'This provider run is obsolete. Its cleanup cannot stop the current run.',
  quote_policy_changed: 'Network policy or listing capabilities changed while you reviewed the session. Open the listing again and review the current limits.',
  workspace_binary_file_rejected:'Project file: the private snapshot format supports UTF-8 text. Binary assets remain on the host.',
  workspace_directory_inaccessible:'Project directory: enter a readable directory path. Your entered value is retained.',
  workspace_directory_required:'Project directory: choose a directory, rather than a file.',
  workspace_root_symlink_rejected:'Project directory: use the canonical directory path without symlink components.',
  workspace_import_empty:'Project directory: no eligible files remain after exclusions. Choose another directory.',
  workspace_selection_invalid:'Project directory: import between 1 and 5000 eligible files.',
  workspace_total_limit:'Project directory: eligible files exceed the 128 MiB import limit. Choose a smaller project.',
  action_approval_required:'This action needs host approval. Headless coding cannot open a native approval dialog.',
  model_discovery_unavailable: 'This endpoint does not provide supported model discovery. Add the exact model ID and its verified metadata manually.',
  pi_thinking_off_unsupported: 'The endpoint returned thinking while thinking was off. Edit the adapter settings or choose a model that supports thinking off.',
  provider_token_allowance_exhausted: 'The remaining shared token allowance cannot cover this request. Consumed usage and unresolved reservations still count.',
  provider_credit_allowance_exhausted: 'The remaining shared AdRouter credit allowance cannot cover this request.',
  provider_shared_history_unavailable: 'Historical allowance usage is unavailable. Reconcile it before serving; it cannot be reset to zero.',
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
  handshake_failed: 'The provider guest handshake failed. Known unused credits were returned.',
  handshake_required: 'Complete the provider guest handshake before coding.',
  session_request_limit: 'The session inference allowance is exhausted. Inspect its authoritative dispatch limit before accepting another.',
  marketplace_buyer_scope_only: 'Use the Buyer profile to request buyer permission only.',
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
export function listingLines(l,options={}) {
  return [...modelStatusLines(l.modelStatus?[l.modelStatus]:[],options),l.name, `Model: ${l.model}`, `Supply: ${words(l.supplyClass)} · ${l.availability}`, `Runtime connection: ${l.ready ? 'Hot · ready' : l.controlOnline && l.availability === 'cold' ? 'Cold · control online · 120 seconds to activate' : 'Offline'}`, `Input: ${l.inputRate} test credits / 1M tokens`, `Output: ${l.outputRate} test credits / 1M tokens`, 'Test credits have no cash value.', l.nativeQualified ? 'Setup probe: passed; buyer tool round trip awaits acceptance' : l.evaluation ? `Evaluation: ${l.evaluation.passed ? 'qualified' : 'provisional'} · ${l.evaluation.sampleCount} samples · ${l.evaluation.elapsedMs} ms` : 'Evaluation: not available', `Published: ${date(l.publishedAt)}`];
}
export function quoteAccess(config,listing) {
  if(!config)return {disabled:true,code:'network_policy_unavailable',detail:problems.network_policy_unavailable};
  if(!config.admissions&&!config.privateRehearsal)return {disabled:true,code:'private_rehearsal_disabled',detail:problems.private_rehearsal_disabled};
  if(listing.modelStatus&&visibleModelStatus(listing.modelStatus).availability!=='Available')return {disabled:true,code:'model_unavailable',detail:visibleModelStatus(listing.modelStatus).reason};
  if(listing.ready)return {disabled:false,detail:'Review exact limits before reserving.'};
  if(listing.availability==='cold'&&config.privateRehearsal&&!config.admissions)return {disabled:true,code:'cold_private_rehearsal_unavailable',detail:problems.cold_private_rehearsal_unavailable};
  if(config.admissions&&listing.availability==='cold'&&listing.controlOnline)return {disabled:false,detail:'Review activation and session limits before reserving.'};
  return {disabled:true,code:'provider_offline',detail:'The provider must start its VM and authenticated relay before you can reserve compute.'};
}

export const providerFields = [
  { name: 'name', label: 'Listing name', validate: required, help: 'A public name that helps buyers identify your compute.' },
  { name: 'model', label: 'Request model ID', validate: required, help: 'Exact model ID, including any namespace (vendor/model). No model substitution is performed.' },
  { name: 'endpoint', label: 'API endpoint', maxLength: 2048, validate: value => { try { const u = new URL(value); return u.username || u.password || u.search || u.hash || !['https:', 'http:'].includes(u.protocol) ? 'Use an endpoint URL with no credentials, query or fragment.' : ''; } catch { return 'Enter a valid API endpoint URL.'; } }, help: 'Full Chat Completions URL; no suffix is guessed. Public metadata only, never an API key.' },
  { name: 'supplyClass', label: 'Supply type', choices: ['authorized_api', 'self_hosted'], default: 'authorized_api', help: 'Authorized API capacity or your own inference engine. Subscription supply is excluded.' },
  { name: 'availability', label: 'Availability', choices: ['hot', 'cold'], default: 'hot', help: 'Hot warms a VM now. Cold keeps control online; you have 120 seconds to activate after a reservation.' },
  { name: 'thinking', label: 'Thinking support', choices: ['off','supported'], default:'off', help:'Advertise supported thinking only for a compatible upstream connector. Buyers start with thinking off.' },
  { name: 'inputRate', label: 'Input test credits / 1M', default: '1000', validate: integer(0, 999999999), help: 'Editable marketplace test-credit price; this is not your upstream USD cost.' },
  { name: 'outputRate', label: 'Output test credits / 1M', default: '1000', validate: integer(0, 999999999), help: 'Editable marketplace test-credit price; no cash settlement.' },
];

export async function runTui(options = {}, dependencies = {}) {
  const ui = dependencies.ui ?? new TerminalUI(); let store = dependencies.store ?? new AuthStore(undefined, options.profile ?? 'default');
  let network = dependencies.network; let config; let runtimeConfig; const providersRunning = new Map(); const setupDrafts = new Map(); const limitDrafts = new Map(); const deletionKeys = new Map(); let currentProviderId;let verifiedIdentity,identityAt=0,identityError,authState='signed_out',identityGeneration=0;
  let interruptRequested=false;
  ui.onInterrupt=()=>{interruptRequested=true;ui.pending?.resolve(null);};
  const requestExit=async()=>{
    if(![...providersRunning.values()].some(p=>!p.status.stopped))return true;
    const choice=await ui.menu('Provider is running',[item('keep','Keep running'),item('stopExit','Stop and exit')],{fixedActions:true,lines:['This terminal owns a provider. Stop is explicit.']});
    return choice==='stopExit';
  };
  const pollingMenu=(title,load,choices,options={})=>{
    const selectedNetwork=network,selectedProfile=store.profile;
    return pollLiveMenu(ui,title,load,choices,{...options,isCurrent:()=>network===selectedNetwork&&store.profile===selectedProfile});
  };
  const pruneProviders = () => { for (const [id,controller] of providersRunning) if (providerCanLaunch(controller)) providersRunning.delete(id); };
  const trackProvider = (id,controller) => {
    providersRunning.set(id,controller);
    void controller.done.then(()=>{if(providersRunning.get(id)!==controller)return;ui.pending?.redraw?.();});
    return controller;
  };
  const stopProvider = async id => {
    const controller=providersRunning.get(id);if(!controller)return;
    await (controller.status.cleanupRequired && controller.retryCleanup ? controller.retryCleanup() : controller.stop());
    if (!providerCanLaunch(controller)) await ui.page('Provider cleanup required',providerStatusLines(controller.status));
  };
  const readAuth=async()=>{try{return await store.read();}catch(error){if(error.code!=='state_unavailable')throw error;return {scope:'',unavailable:true};}};
  const display=new MarketplaceDisplay(()=>network,lines=>{ui.sidebar=lines;if(!ui.pending||ui.started)ui.draw?.();});
  const clearIdentity=()=>{identityGeneration++;authState='signed_out';verifiedIdentity=undefined;identityAt=0;identityError=undefined;ui.context=`Signed out · ${store.profile} · ${network.origin}`;};
  const refreshIdentity=async scope=>{
    if(network.local){ui.context=`Local identity · ${store.profile} · ${network.origin}`;return;}
    if(authState==='checking'||verifiedIdentity&&Date.now()-identityAt<60000)return;
    const generation=identityGeneration,identityNetwork=network;
    authState='checking';
    try{const value=await identityNetwork.request(scope.includes("marketplace:operator")?"/v2/admin/me":scope.includes("marketplace:buyer")?"/v2/me":"/v2/providers/me",{signal:AbortSignal.timeout(5000)});if(generation!==identityGeneration)return;authState='signed_in';verifiedIdentity=value;identityError=undefined;identityAt=Date.now();ui.context=`${value.email??"Email unavailable"} · ${store.profile}/${value.roles.join(",")} · ${network.origin}`;}catch(error){if(generation!==identityGeneration)return;authState=error.code==='installation_revoked'?'revoked':authRecoveryCodes.has(error.code)?'recovery_required':'temporarily_unavailable';verifiedIdentity=undefined;identityAt=0;identityError=error;ui.context=`Sign-in needs attention · ${store.profile} · ${network.origin}`;}
  };
  const actor = role => { if (network.local) network.actor = role; };
  const read = async (path, publicAccess = false, signal) => {
    const value = await network.request(`/v2${path}`, { public: publicAccess, signal });
    if (path === '/network/config' && (!MarketplaceNetworkConfig(value) || !['allowance_v1','provider_budget_v1','cold_activation_v1'].every(c => value.capabilities.includes(c)))) throw new ClientError('network_contract_mismatch');
    if (path.startsWith('/listings')) {
      const listings = Array.isArray(value.listings) ? value.listings : [value];
      if (!listings.every(MarketplaceListing)) throw new ClientError('listing_contract_mismatch');
    }
    return value;
  };
  const get = (path,publicAccess=false) => ui.task('Loading AdRouter',signal=>read(path,publicAccess,signal));
  const post = (path, body = {}, key = randomUUID()) => ui.task('Saving your choice', () => network.request(`/v2${path}`, { method: 'POST', body, key }));
  const confirm = async (title, lines, label = 'Confirm') => await ui.menu(title, [item(false, 'Back'), item(true, label)], { lines }) === true;
  const attempt = async work => { try { return await work(); } catch (error) { if(authRecoveryCodes.has(error.code)){verifiedIdentity=undefined;identityAt=0;identityError=error;authState=error.code==='installation_revoked'?'revoked':'recovery_required';ui.context=`Sign-in needs attention · ${store.profile} · ${network.origin}`;} await ui.page('Could not continue', errorLines(error)); return null; } };

  async function signIn(operator = false, recovering = false) {
    pruneProviders();
    if ([...providersRunning.values()].some(p=>!p.status.stopped||p.status.teardownVerified!==true)) { await ui.page('Stop running work before sign-in repair', ['Use Stop to checkpoint and tear down the provider guest first. Remote cleanup may remain unconfirmed while sign-in is broken.']); return; }
    if (operator && !recovering && store.profile !== 'operator') {
      store = new AuthStore(store.home, 'operator');
      network = new Network({origin:network.origin,local:network.local,store});
      clearIdentity();
      if (await readAuth()) return;
    }
    let verification;
    const openSafari = (_text, key) => {
      if (key.name !== 'o' || !verification || process.platform !== 'darwin') return;
      // Only an explicit O key opens native Safari; no browser session is inspected.
      const child = spawn('/usr/bin/open', ['-a', 'Safari', verification], { stdio: 'ignore' });
      child.on('error', () => {});
    };
    return ui.task('Sign in to AdRouter', async (signal, update) => {
      const notify = value => {
        if (value.status === 'approval_required') {
          verification = value.verificationUrl;
          const permission = operator ? 'operator' : store.profile === 'buyer' ? 'buyer-only' : store.profile === 'provider' ? 'provider' : 'buyer and provider';
          update(['Approve this installation in your browser.', `Comparison code: ${value.comparisonCode}`, '', verification, '', `Check the same code before approving ${permission} access.`, process.platform === 'darwin' ? 'Press O to open native Safari.' : 'Open the link in your browser.', 'Waiting for your approval…']);
        }
      };
      const result = recovering ? await network.recoverLogin(notify, signal) : await network.login(notify, signal, { operator });
      clearIdentity();
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
  async function launch(node, preparedBounds, reviewed=false) {
    const savedBounds = limitDrafts.get(node.id) ?? {}; limitDrafts.set(node.id, savedBounds);
    const bounds = preparedBounds ?? await ui.form(node.availability === 'cold' ? 'Start cold provider control' : 'Start hot provider VM', [
      { name: 'maxCalls', label: 'Maximum requests', default: '5', validate: integer(1, 30) },
      { name: 'maxOutputTokens', label: 'Output tokens / request', default: '4096', validate: integer(1, 8192) },
    ], savedBounds, node.availability === 'hot' ? 'One concurrent session. Hot serving continues while this terminal stays open. Enter your API key only in the VM console.' : 'One concurrent session. Cold guests run for at most nine minutes. Enter your API key only in the VM console.');
    if (!bounds) return;
    Object.assign(savedBounds, bounds);
    const { startProvider } = await import('./provider.mjs');
    if (!reviewed && !await confirm('Launch this VM?', [node.name, `Endpoint: ${node.endpoint}`, `Models: ${node.models?.join(', ')??node.model}`, `Maximum requests: ${bounds.maxCalls}`, `Maximum output per request: ${bounds.maxOutputTokens}`, 'Publish your listing and qualify its current tariff before your private evaluation.', 'The terminal will attach directly to the guest. Ctrl+C stops it.'], node.availability === 'cold' ? 'Start cold control' : 'Launch hot VM')) return;
    const result = await ui.suspend(() => startProvider(network, node.id, { maxCalls: Number(bounds.maxCalls), maxOutputTokens: Number(bounds.maxOutputTokens), runtimeConfig, notify: value => {
      if (value.status === 'activation_required' && currentProviderId === node.id) ui.pending?.resolve('refresh');
      if (ui.screen?.title?.startsWith('Provider operation')) ui.pending?.redraw?.();
    } }));
    trackProvider(node.id,result);
    await ui.page(() => result.status.cleanupRequired ? 'Provider operation needs cleanup' : result.status.stopped ? 'Provider operation stopped' : 'Provider operation started', () => providerStatusLines(result.status),{footer:'Enter / Esc Back · Use Stop to close the provider',onCancel:()=>undefined});
  }
  async function createListing() {
    actor('provider');
    const draftKey = `${store.profile ?? 'default'}:${network.origin}`;
    const savedDraft = setupDrafts.get(draftKey);
    const supply=savedDraft?'resume':await ui.menu('List compute · 1 of 3',[item('authorized_api','Authorized API','Metered API-key providers from the pinned Pi catalog.'),item('self_hosted','Self-hosted','Your own public endpoint or reviewed loopback inference engine.'),item('back','Back')]);
    if(!supply||supply==='back')return;
    if(supply==='authorized_api')return createNativeListing();
    if(supply==='self_hosted'&&config?.capabilities?.includes('pi_native_v3'))return createNativeListing(undefined,'self_hosted');
    const preset=savedDraft?'resume':supply==='authorized_api'?await ui.menu('Choose authorized API',[...connectorCatalog.presets.map(p=>item(p.id,p.name)),item('custom','OpenAI-compatible API gateway','Full Chat Completions URL and exact model ID; streaming, function tools and final token usage are required.'),item('back','Back')]):'self';
    if(!preset||preset==='back')return;
    const selectedPreset=connectorCatalog.presets.find(p=>p.id===preset);
    let draft=savedDraft??{supplyClass:supply,...(selectedPreset?{name:selectedPreset.name+' - hot compute',model:selectedPreset.model,endpoint:selectedPreset.endpoint}:{}),connector:structuredClone(connectorCatalog.profiles.find(p=>p.id===(selectedPreset?.profile??'openai-compatible-v1')))};
    setupDrafts.set(draftKey, draft);
    for (;;) {
      draft.thinking??=draft.capabilities?.includes('thinking_v1')?'supported':'off';
      const adapterFields=draft.connector.id==='openai-compatible-v1'?[
        {name:'authentication',label:'Authentication',choices:['bearer','api_key','x_api_key','none'],help:'Bearer Authorization, api-key, x-api-key, or no header. Keys are entered only in the provider guest.'},
        {name:'outputTokenParameter',label:'Output token parameter',choices:['max_tokens','max_completion_tokens'],help:'Use the output limit field documented by your gateway.'},
        {name:'streamingUsage',label:'Streaming usage',choices:['include_usage','native'],help:'Request include_usage or use native final token counts. Missing usage stays unresolved.'},
        {name:'connectorThinking',label:'Thinking controls',choices:['none','type','reasoning_effort'],help:'Match the documented wire setting. Provider support and buyer thinking remain manual.'},
        {name:'reasoningHistory',label:'Reasoning history',choices:['off','on'],help:'Only reasoning_content history is supported. Structured or signed reasoning is not qualified.'},
      ]:[];
      const fields=[...providerFields.map(f=>f.name==='model'&&selectedPreset?{...f,choices:undefined,help:'Exact editable model ID. Preset choices: '+selectedPreset.models.join(', ')}:f),...adapterFields];
      const formDraft={...draft,...draft.connector,thinking:draft.thinking,connectorThinking:draft.connector.thinking,reasoningHistory:draft.connector.reasoningHistory?'on':'off'};
      const edited = await ui.form('List compute · 2 of 3', fields, formDraft, 'Use verified streaming, function tools and final usage. Exact endpoint/model are retained; no inference probe is sent.');
      const {thinking,authentication,outputTokenParameter,streamingUsage,connectorThinking,reasoningHistory,...metadata}=edited??formDraft;
      for(const field of providerFields)if(field.name!=='thinking')draft[field.name]=metadata[field.name];
      if(adapterFields.length)Object.assign(draft.connector,{authentication,outputTokenParameter,streamingUsage,thinking:connectorThinking,reasoningHistory:reasoningHistory==='on'});
      draft.thinking=thinking;
      if (!edited) return;
      delete draft.thinking;draft.capabilities=['coding_v1','streaming_v1','tools_v1',...(thinking==='supported'?['thinking_v1']:[])];draft.contextWindowTokens=32768;
      if(thinking==='supported'&&draft.connector?.thinking==='none'){await ui.page('Thinking controls required',['Select a compatible thinking control before advertising support.']);return;}
      try{resolveConnector(draft);validateBinding(draft);}catch(e){await ui.page('Check gateway settings',errorLines(e));continue;}
      if (!MarketplaceDraft(draft)) { await ui.page('Check listing fields', ['Use printable metadata and integer test-credit prices.']); continue; }
      const decision = await ui.menu('List compute · 3 of 3', [item('edit', 'Edit details'), item('create', 'Create draft and configure provider'), item('cancel', 'Cancel')], { lines: [draft.name, `${draft.model} · ${draft.availability}`, draft.endpoint, ...connectorReviewLines(draft), `Thinking: ${draft.capabilities.includes('thinking_v1')?'supported (buyer opt-in)':'off'}`, `Supply: ${words(draft.supplyClass)}`, `Input ${draft.inputRate} / output ${draft.outputRate} test credits per 1M tokens`, '', 'Publish your listing and qualify its current tariff before your private evaluation.'] });
      if (decision === 'edit') continue;
      if (decision !== 'create') return;
      const node = await post('/providers/nodes', draft);
      setupDrafts.delete(draftKey);
      await guidedProvider(node);
      await manageNode(node.id, true); return;
    }
  }
  async function createNativeListing(existing,supplyClass=existing?.supplyClass??'authorized_api') {
    if(!config?.capabilities?.includes('pi_native_v3'))throw new ClientError('pi_native_client_required');
    const draftKey='native:'+store.profile+':'+network.origin;
    const state=setupDrafts.get(draftKey)??{provider:existing?.provider,models:existing?.models??[],discoveredModels:existing?.discoveredModels??[],connection:structuredClone(existing?.connection??{kind:'builtin',modelDefinitions:[],headerNames:[]}),limits:existing?{...existing,...existing.fields,maxOutputTokens:String(existing.maxOutputTokens)}:{}};setupDrafts.set(draftKey,state);
    if(!state.provider){let kind='custom';
      if(supplyClass!=='self_hosted'){
        const eligible=piCatalog.providers.filter(p=>p.models.some(m=>!m.unavailableReason&&!m.api?.startsWith('sdk:')));
        const api=await ui.menu('API · 1 of 4',[...eligible.map(p=>item(p.id,p.name)),item('advanced','Advanced connection setup','Additional adapters and Custom API'),item('back','Back')]);
        if(!api||api==='back')return;
        if(api==='advanced'){kind=await ui.menu('Advanced connection setup',[item('builtin','Additional provider adapters'),item('custom','Custom API'),item('back','Back')]);if(!kind||kind==='back')return;}
        else{kind='builtin';state.provider=api;}
      }
      state.connection.kind=kind;
      if(kind==='builtin'){if(!state.provider)state.provider=await ui.menu('Additional provider adapters',[...piCatalog.providers.map(p=>item(p.id,p.name)),item('back','Back')]);if(!state.provider||state.provider==='back'){state.provider=undefined;return;}}
      else {const value=await ui.form('Custom API',[{name:'provider',label:'Connection provider ID',validate:v=>/^[a-z][a-z0-9-]{0,63}$/.test(v)?'':'Use a lowercase identifier.'},{name:'baseUrl',label:supplyClass==='self_hosted'?'API base URL (HTTPS or loopback HTTP)':'HTTPS API base URL',maxLength:2048,validate:v=>{try{const u=new URL(v);return (u.protocol==='https:'||supplyClass==='self_hosted'&&u.protocol==='http:'&&['127.0.0.1','[::1]'].includes(u.hostname)&&Number(u.port)>=1024)&&!u.username&&!u.password&&!u.search&&!u.hash?'':'Use HTTPS, or an explicit loopback HTTP port for your self-hosted engine.';}catch{return 'Enter an HTTPS base URL.';}}},{name:'api',label:'Inference adapter',choices:['openai-completions','openai-responses','anthropic-messages','google-generative-ai','mistral-conversations','azure-openai-responses','pi-messages',...Object.entries(piCatalog.adapters).filter(([,a])=>!a.piApi).map(([id])=>'sdk:'+id)],default:'openai-completions'}]);if(!value)return;state.provider=value.provider;Object.assign(state.connection,{baseUrl:value.baseUrl,api:value.api});if(supplyClass==='self_hosted'){const authentication=await ui.menu('Self-hosted authentication',[item('none','No API key'),item('api_key','API key entered inside guest'),item('back','Back')]);if(!authentication||authentication==='back')return;state.connection.authentication=authentication;}}
    }
    const baseProvider=piCatalog.providers.find(p=>p.id===state.provider)??{name:state.provider,models:[],fields:[]},provider={...baseProvider,models:catalogModelsForConnection(state.provider,state.connection),fields:state.connection.kind==='custom'?(piCatalog.adapters[state.connection.api?.slice(4)]?.fields??[]).map(name=>({name,label:name.replaceAll('_',' '),pattern:name.endsWith('BASE_URL')?'^https://[^\\s?#@]+$':'^[a-zA-Z0-9][a-zA-Z0-9_.-]{0,127}$'})):baseProvider.fields},selected=new Set(state.models),deferSelection=false;
    if(deferSelection&&!selected.size){const initial=provider.models.find(m=>!m.unavailableReason);if(!initial)throw new ClientError('provider_model_metadata_required');selected.add(initial.id);}
    const values=await ui.form('Limits · 2 of 4',[{name:'name',label:'Connection name',default:provider.name,validate:required},...provider.fields.map(f=>({...f,validate:v=>new RegExp(f.pattern).test(v)?'':'Enter the provider identifier.'})),{name:'totalTokens',label:'Total tokens across offered models',default:'1000000',validate:integer(1,999999999999)},{name:'testCredits',label:'Total AdRouter credits',default:'10000',validate:integer(1,999999999)},{name:'maxOutputTokens',label:'Maximum output per request',default:'4096',validate:integer(128,8192)}],state.limits,'Limits are cumulative. Consumed usage and unresolved reservations survive restarts.');if(!values)return;Object.assign(state.limits,values);
    for(;!deferSelection;){
      const known=[...provider.models,...state.connection.modelDefinitions.filter(m=>!provider.models.some(x=>x.id===m.id)).map(m=>({...m,name:m.name??m.id,api:m.api??state.connection.api}))];
      const action=await ui.menu('Models · 3 of 4',[item('continue',`Continue with ${selected.size} models`,'Only selected models can be published.',!selected.size||known.some(m=>selected.has(m.id)&&m.unavailableReason)),item('manual','Add model by ID','Use this when discovery is unavailable or the model is absent.'),...state.discoveredModels.filter(id=>!known.some(m=>m.id===id)).map(id=>item('discovered:'+id,id,'Discovered model; define verified metadata before offering.')),...known.map(m=>item(m.id,`${selected.has(m.id)?'[x]':'[ ]'} ${m.name}`,m.unavailableReason??`${m.id} · ${m.api}`,!!m.unavailableReason&&!selected.has(m.id))),item('back','Back')]);
      if(!action||action==='back')return;if(action==='continue'){if(!selected.size||known.some(m=>selected.has(m.id)&&m.unavailableReason))continue;break;}
      if(action==='manual'||action.startsWith('discovered:')){
        const values=await ui.form('Manual model definition',[{name:'id',label:'Exact model ID',default:action.startsWith('discovered:')?action.slice(11):'',maxLength:256,validate:required},{name:'contextWindow',label:'Context tokens',default:'32768',validate:integer(4096,131072)},{name:'maxTokens',label:'Maximum output tokens',default:'4096',validate:integer(128,8192)},...['input','output','cacheRead','cacheWrite'].map(name=>({name,label:`${name} USD per million tokens`,validate:v=>v.trim()!==''&&Number.isFinite(Number(v))&&Number(v)>=0?'':'Enter the verified rate; unknown is not zero.'}))]);if(!values)continue;
        state.connection.modelDefinitions=state.connection.modelDefinitions.filter(m=>m.id!==values.id);state.connection.modelDefinitions.push({id:values.id,contextWindow:Number(values.contextWindow),maxTokens:Number(values.maxTokens),cost:Object.fromEntries(['input','output','cacheRead','cacheWrite'].map(k=>[k,Number(values[k])])),thinking:'none'});selected.add(values.id);
      }else if(selected.has(action))selected.delete(action);else if(selected.size<16)selected.add(action);state.models=[...selected];
    }
    state.limits.inputRate??='1000';state.limits.outputRate??='3000';
    const choice=await ui.menu('Review connection',[item('save','Save connection','Saving performs no inference.'),item('advanced','Advanced settings','Endpoint, adapter, header names and compatibility.'),item('back','Back')]);if(!choice||choice==='back')return;
    if(choice==='advanced'){
      const advanced=await ui.form('Advanced connection settings',[{name:'baseUrl',label:'Base URL (blank uses built-in default)',maxLength:2048},{name:'api',label:'API protocol (blank uses model default)'},{name:'headers',label:'Secret header names, comma separated',help:'Values are entered only inside the provider guest.'},{name:'compat',label:'Pi compatibility settings JSON',default:'{}',maxLength:4096,validate:v=>{try{return typeof JSON.parse(v)==='object'&&!Array.isArray(JSON.parse(v))?'':'Enter a JSON object.';}catch{return 'Enter a JSON object.';}}}],{baseUrl:state.connection.baseUrl??'',api:state.connection.api??'',headers:state.connection.headerNames.join(','),compat:JSON.stringify(state.connection.compat??{}),inputRate:state.limits.inputRate,outputRate:state.limits.outputRate});if(!advanced)return;Object.assign(state.connection,{...(advanced.baseUrl?{baseUrl:advanced.baseUrl}:{}),...(advanced.api?{api:advanced.api}:{}),headerNames:advanced.headers.split(',').map(v=>v.trim()).filter(Boolean),compat:JSON.parse(advanced.compat)});if(!await confirm('Save connection?',['No inference will run until you choose Start.'],'Save'))return;
    }
    const fields=Object.fromEntries(provider.fields.map(f=>[f.name,values[f.name]]));
    const payload={connectorProtocol:'pi_native_v3',supplyClass,modelsConfirmed:true,name:values.name,provider:state.provider,models:[...selected],fields,connection:connectionCapabilities(state.provider,state.connection),totalTokens:values.totalTokens,testCredits:values.testCredits,maxOutputTokens:Number(values.maxOutputTokens),inputRate:state.limits.inputRate,outputRate:state.limits.outputRate};
    if(existing&&!await confirm('Save provider changes?',[`Shared limit: ${payload.totalTokens} tokens / ${payload.testCredits} AdRouter credits`,'Usage and liabilities remain. Changes require qualification again.'],'Save changes'))return;
    const node=await post(existing?`/providers/nodes/${existing.id}/native`:'/providers/nodes',existing?{...payload,expectedRevision:existing.nativeRevision??0,confirmIncrease:true}:payload);setupDrafts.delete(draftKey);const next=await ui.menu('Connection saved',[item('continue','Continue setup','Prepare the guest; Start provider separately authorizes bounded qualification and publication.'),item('back','Back')],{lines:['No inference has run. Your connection is saved.']});if(next==='continue')await guidedProvider(node);if(!existing)await manageNode(node.id,true);
  }
  async function guidedNativeProvider(node) {
    if(node.suspended)throw new ClientError('node_suspended');
    if(!providerCanLaunch(providersRunning.get(node.id))){await ui.page('Provider operation',()=>providerStatusLines(providersRunning.get(node.id).status));return;}
    const budget=await get('/providers/budget');
    if(providerRequiresBudget(node)&&BigInt(budget.remainingMicrousd)<=0n&&!await spendingBudget(true))return;
    const startProvider=dependencies.startProvider ?? (await import('./provider.mjs')).startProvider;
    let controller, updateProgress;
    const notify=()=>{if(controller && providersRunning.get(node.id)===controller){updateProgress?.(providerStatusLines(controller.status));ui.pending?.redraw?.();}};
    try {
      controller=await ui.suspend(()=>startProvider(network,node.id,{prepareOnly:true,maxOutputTokens:node.maxOutputTokens,runtimeConfig,notify}));
      trackProvider(node.id,controller);
      node=await get(`/providers/nodes/${node.id}`);
      if(node.modelsConfirmed===false){
        const available=catalogModelsForConnection(node.provider,node.connection),selected=new Set(node.models??[]),definitions=node.connection?.modelDefinitions??[];
        const candidates=[...available,...definitions.filter(m=>!available.some(v=>v.id===m.id))];
        for(;;){
          const choice=await ui.menu('Choose models from prepared guest',[item('discover','Discover models','Uses guest credentials without inference.'),...candidates.map(m=>item(m.id,`${selected.has(m.id)?'[x]':'[ ]'} ${m.name??m.id}`,m.unavailableReason??m.id,!!m.unavailableReason&&!selected.has(m.id))),item('continue',`Offer ${selected.size} selected models`,'',!selected.size||candidates.some(m=>selected.has(m.id)&&m.unavailableReason)),item('back','Cancel setup')],{lines:['One provider VM is prepared. No inference has run.']});
          if(!choice||choice==='back'){await controller.stop({trigger:'setup_cancelled'});return;}
          if(choice==='discover'){try{const result=await controller.discover();await ui.page('Discovered model IDs',result.models);}catch(error){await ui.page('Model discovery unavailable',[...errorLines(error),'Select an exact catalog model, or edit the saved connection to add source-backed metadata.']);}continue;}
          if(choice==='continue'){if(!selected.size||candidates.some(m=>selected.has(m.id)&&m.unavailableReason))continue;break;}
          if(selected.has(choice))selected.delete(choice);else if(selected.size<16)selected.add(choice);
        }
        const configuration=Object.fromEntries(['connectorProtocol','supplyClass','name','provider','models','fields','connection','inputRate','outputRate','totalTokens','testCredits','maxOutputTokens'].map(k=>[k,node[k]]));
        configuration.models=[...selected];configuration.modelsConfirmed=true;
        await controller.configure(configuration);node=await get(`/providers/nodes/${node.id}`);
      }
      const action=await ui.menu('Test and start',[item('start','Start provider','One setup probe per model. Stop on first failure. Publish only if all pass.'),item('back','Back')],{lines:[`Test ${node.models.length} selected models. At most ${node.models.length} model requests. Stop on the first failure. Publish only if all models pass.`, 'Request deadline: 120 seconds, bounded by current authority.',node.name,node.endpoint,...node.models.map(m=>'• '+m),...(node.nativeModels??[]).map(m=>`Reasoning ${m.model}: ${m.defaultSettings?.reasoning??'off'} · Effective output ${m.maxOutputTokens}; native ${m.nativeLimits?.maxOutputTokens??'unknown'}`),`Shared allowance: ${node.sharedAllowance.totalTokens} tokens · ${node.sharedAllowance.testCredits} AdRouter credits`,`Output per request: ${node.maxOutputTokens}`,...(node.qualificationAllowance?[`Qualification allowance: up to ${node.qualificationAllowance.requests} requests, ${node.qualificationAllowance.maxTokens} tokens and ${node.qualificationAllowance.maxTestCredits} test credits`]:[]),`Provider ID: ${node.id}`,node.connection?.authentication==='none'?'No API key is required for this self-hosted connection.':'API key is saved only in the isolated provider guest vault and survives Stop.','Compatibility checks consume shared limits and upstream spending authority.']});
      if(action!=='start'){await controller.stop({trigger:'setup_cancelled'});return;}
      await ui.task('Checking selected models',async(signal,update)=>{
        updateProgress=update;const cancel=()=>void controller.stop({trigger:'setup_cancelled',error:new ClientError('cancelled')});
        signal.addEventListener('abort',cancel,{once:true});
        try { if(signal.aborted){cancel();throw new ClientError('cancelled');}return await controller.start(); }
        finally { signal.removeEventListener('abort',cancel);updateProgress=undefined; }
      },{cancel:true,lines:providerStatusLines(controller.status)});
    }catch(error){
      controller??=error.controller;if(controller)trackProvider(node.id,controller);
      await controller?.stop({trigger:'setup_failed',error});
      await ui.page('Setup failed',[...errorLines(error),...providerDiagnosticLines(controller?.status.setupFailure??providerDiagnostic('preparing',error)),...(controller?providerStatusLines(controller.status):[]),controller?.status.qualification?.some(q=>q.requestId)?'Current check accounting is shown separately from earlier holds.':'No model request sent. Your configuration is saved.']);
    }
  }
  async function guidedProvider(node) {
    if(['pi_native_v1','pi_native_v2','pi_native_v3'].includes(node.connectorProtocol))return guidedNativeProvider(node);
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
      { name: 'maxOutputTokens', label: 'Output tokens / request', default: '4096', validate: integer(1, 8192) },
    ], bounds, 'One concurrent session · Hot serving continues while this terminal stays open. Cold/evaluation guests remain bounded.');
    if (!edited) return;
    Object.assign(bounds, edited);
    const budget = await get('/providers/budget');
    if(providerRequiresBudget(node)&&BigInt(budget.remainingMicrousd)<=0n&&!await spendingBudget(true))return;
    if(providerRequiresBudget(node)&&BigInt((await get('/providers/budget')).remainingMicrousd)<=0n){await ui.page('Spending cap required',['Set a cap with remaining authority before launching.']);return;}
    node=await get(`/providers/nodes/${node.id}`);
    if(node.suspended){await ui.page('Listing suspended',['An operator must clear suspension before you can republish.']);return;}
    if(node.tariffQualification?.mode==='automatic'){
      await post(`/providers/nodes/${node.id}/tariff/refresh`,{durationSeconds:3600});
      node=await get(`/providers/nodes/${node.id}`);
    }
    if (!node.tariffQualified) {
      if(config.capabilities?.includes('coding_v1')) {
        const tariff=await ui.form('Review upstream tariff',[{name:'version',label:'Tariff version',validate:required},{name:'inputMicrousdPerMillion',label:'Input micro-USD per million tokens (peak/cache miss)',validate:integer(0,999999999999999)},{name:'outputMicrousdPerMillion',label:'Output micro-USD per million tokens',validate:integer(0,999999999999999)},{name:'reviewReference',label:'Official pricing URL or review reference',validate:required}]);
        if(!tariff||!await confirm('Qualify your supply tariff?',[node.model,node.endpoint,JSON.stringify(tariff,null,2),'Use current conservative rates. Understating a rate does not reduce upstream billing.'],'Confirm reviewed tariff'))return;
        await post(`/providers/nodes/${node.id}/tariff`,{...tariff,qualifiedUntil:Date.now()+86400000});node=await get(`/providers/nodes/${node.id}`);
      }else {await ui.page('Qualify the current tariff', ['Your listing is published. In the separate operator profile, choose Qualify upstream tariff.','Then choose Continue setup from My provider listings.']);return;}
    }
    const decision=await ui.menu('Review provider setup',[
      ...(node.status!=='published'?[item('publish','Publish and Start')]:[item('start','Start provider')]),item('back','Back'),
    ],{lines:[`Test ${node.models.length} selected models. At most ${node.models.length} model requests. Stop on the first failure. Publish only if all models pass.`, 'Request deadline: 120 seconds, bounded by current authority.',node.name,node.endpoint,node.model,`Requests: ${bounds.maxCalls} · Output tokens: ${bounds.maxOutputTokens}`,`Thinking: ${node.capabilities?.includes('thinking_v1')?'supported · buyer starts off':'provider disabled'}`,`Tariff: ${node.tariffQualified?'qualified':'manual qualification required'}`,`Qualification expires: ${node.tariffQualification?.qualifiedUntil?date(node.tariffQualification.qualifiedUntil):'unknown'}`,`Session coverage: ${node.tariffQualification?.coversDurationSeconds??'unknown'} seconds`,'Provider keys are entered only in the guest.']});
    if(decision==='publish'){await post(`/providers/nodes/${node.id}/publish`);node=await get(`/providers/nodes/${node.id}`);}
    if(['publish','start'].includes(decision))await launch(node,bounds,true);
  }
  async function manageNode(id, created = false) {
    for (;;) {
      const node = await get(`/providers/nodes/${id}`);
      const evidence=await providerEvidence(node,store.profile,{origin:network.origin});
      const exactReports=evidence.reduce((sum,e)=>sum+e.pending.length,0);
      const recovery=evidence.length?normalizeDiagnosis(await get(`/providers/nodes/${id}?view=diagnostics`),evidence):null;
      const bindingCurrent=network.local||(await readAuth())?.installation_id===node.installationId;
      const busy = !providerCanLaunch(providersRunning.get(node.id));
      const native = ['pi_native_v1','pi_native_v2','pi_native_v3'].includes(node.connectorProtocol);
      currentProviderId = node.id;
      const exposure=await get('/providers/budget');
      const monitor=new ProviderActivityMonitor(network,node.id,()=>ui.pending?.redraw?.());await monitor.start();
      let selection;try{selection = await ui.menu(created ? 'Your listing is drafted' : node.name, [
        ...(['pi_native_v1','pi_native_v2','pi_native_v3'].includes(node.connectorProtocol)?[item('editNative','Edit provider configuration',bindingCurrent?'Pause and stop serving before changing models or limits.':'Older installation: use operator cleanup or reclaim after verified teardown.',!bindingCurrent||!['draft','paused'].includes(node.status)||busy)]:[]),
        item('failureDetails','Failure details','Inspect/export retained inference evidence; no model request.'),item('status','Provider status'),item('diagnose','Diagnose','Read owned run/check metadata; no model request.'),item('retryReport','Retry result report',exactReports?'Deliver only saved exact reports; no VM or inference.':'No exact completion report saved.',!exactReports),
        item('setup', 'Test and start', bindingCurrent?'Authorizes a new bounded model attempt. All models must pass.':'Older installation: use operator cleanup or reclaim the paused connection.', busy||!bindingCurrent),
        ...(node.cleanupState==='failed'||node.cleanupState==='pending'||providersRunning.get(node.id)?.status.cleanupRequired?[item('cleanup','Retry cleanup','Verify creation evidence and current run before teardown.',!providersRunning.get(node.id)?.status.cleanupRequired&&!recovery?.recoveryActions.includes('retry_verified_cleanup'))]:[]),
        ...(!native?[item('launch', node.availability === 'cold' ? 'Start cold control' : 'Launch hot VM', 'Keep this TUI open while providing.', busy)]:[]),
        ...(providersRunning.get(node.id)?.status.activation?.length ? [item('activate', 'Activate reserved buyer session', 'Launch the VM and enter the key before the 120-second deadline.')] : []),
        ...(!native?[item('publish', 'Publish listing', 'Exposes listing metadata as a new immutable revision.', node.suspended)]:[]),
        ...(node.tariffQualification?.mode==='automatic'?[item('tariffRefresh','Refresh official tariff')]:[]),
        ...(!native?[item('thinking','Configure thinking support','Stop serving and pause before changing capabilities.')]:[]),
        ...(node.activeSessionId?[item('endBuyer','End buyer session',bindingCurrent?'Keep this healthy provider VM available after confirmed completion.':'Older installation: use Marketplace operator → Provider sessions and cleanup.',!bindingCurrent)]:[]),
        item('pause', 'Pause listing'), item('stop', 'Stop serving and close sessions'),
        item('delete',node.status==='paused'?'Delete paused listing':'Delete listing','Stop execution and retire the listing. Credentials and outstanding liabilities remain.'),
        ...(['pi_native_v2','pi_native_v3'].includes(node.connectorProtocol)?[item('discover','Discover endpoint models','Uses saved guest authentication; no inference or automatic publication.',busy),item('rebind','Reclaim paused connection','Authorize this installation without resetting usage.'),item('disconnect','Disconnect API','Remove the saved guest credential and disable serving.')]:[]),
        item('refresh', 'Refresh status'), item('back', 'Back'),
      ], { tick:true,lines:()=>[...providerActivityLines(monitor.view()),...(providersRunning.has(node.id)?providerStatusLines(providersRunning.get(node.id).status):[]),`Models: ${node.models?.join(', ')??node.model}`, `Suspended: ${node.suspended ? 'yes' : 'no'} · Listing: ${node.status}`, providersRunning.has(node.id)?`VM: ${providersRunning.get(node.id).status.guestReady?'ready':providersRunning.get(node.id).status.teardownVerified?'removed':'unconfirmed'}`:'No controller attached in this terminal', `Backend connection: ${providerConnectionLabel(monitor.view())}`, `Activity: ${providersRunning.get(node.id)?.status.calls??0} dispatched requests`, ...(node.sharedAllowance?[`Shared tokens: ${node.sharedAllowance.consumedTokens} consumed · ${node.sharedAllowance.outstandingTokens} held / ${node.sharedAllowance.totalTokens}`,`AdRouter credits: ${node.sharedAllowance.consumedCredits} consumed · ${node.sharedAllowance.outstandingCredits} reserved/unresolved / ${node.sharedAllowance.testCredits}`,`Remaining: ${node.allowanceSummary?.remainingTokens??'unknown'} tokens · ${node.allowanceSummary?.remainingCredits??'unknown'} AdRouter credits`,...(node.allowanceSummary?.exhaustionReason?[node.allowanceSummary.exhaustionReason]:[])]:[]),`Remaining upstream authority: ${formatUsd(exposure.remainingMicrousd)}`, `Outstanding exposure: ${formatUsd(exposure.outstandingMicrousd)}`, `Provider: ${node.id}`,`Listing: ${node.listingId??'not published'}`,`Thinking: ${node.capabilities?.includes('thinking_v1')?'supported':'off'}`],footer:'↑↓ Move  Enter Choose  Esc Back · Stop is a separate action' });}finally{monitor.stop();}
      currentProviderId = undefined; created = false;
            if (!selection || selection === 'back') return;
      if(selection==='status'){
        const visibleMonitor=new ProviderActivityMonitor(network,node.id,()=>ui.pending?.redraw?.());
        try{await visibleMonitor.start();await ui.page('Provider status',()=>[...(providersRunning.has(node.id)?providerStatusLines(providersRunning.get(node.id).status):['No controller attached in this terminal']),...providerActivityLines(visibleMonitor.view())]);}finally{visibleMonitor.stop();}continue;
      }
      if(selection==='failureDetails'){const result=await diagnoseProvider(network,node.id,store.profile);const d=result.diagnosis;await failureDetails(d.primaryFailure?.failureDiagnostic,d.cleanupOutcomes);continue;}
      if(selection==='diagnose'){const result=await diagnoseProvider(network,node.id,store.profile);const controller=providersRunning.get(node.id);await ui.page('Provider diagnosis',diagnosisLines(result,{controllerAttached:!!controller&&controller.status.providerRunId===result.node.providerRunId}));continue;}
      if(selection==='retryReport'){await attempt(()=>providersRunning.get(node.id)?.retryResultReports?providersRunning.get(node.id).retryResultReports():retryProviderReports(network,node.id,store.profile));continue;}
      if(selection==='cleanup'){await attempt(()=>providersRunning.has(node.id)?stopProvider(node.id):retryProviderCleanup(network,node.id,store.profile));continue;}
      if(selection==='discover'){await attempt(async()=>{const {startProvider}=await import('./provider.mjs');let controller;try{controller=await ui.suspend(()=>startProvider(network,node.id,{prepareOnly:true,runtimeConfig,maxOutputTokens:node.maxOutputTokens}));trackProvider(node.id,controller);const result=await ui.task('Discovering endpoint models',()=>controller.discover());await controller.stop();if(!providerCanLaunch(controller))throw new ClientError('provider_cleanup_required');await createNativeListing({...node,discoveredModels:result.models});}catch(error){controller??=error.controller;if(controller)trackProvider(node.id,controller);throw error;}finally{await controller?.stop();}});continue;}
      if(selection==='rebind'){await attempt(()=>post(`/providers/nodes/${node.id}/rebind`,{expectedInstallationId:node.installationId}));continue;}
      if(selection==='disconnect'){if(await confirm('Disconnect API?',['This removes the saved guest credential and disables serving. It does not revoke the upstream key.'],'Disconnect'))await attempt(async()=>{if(providersRunning.has(node.id)){await stopProvider(node.id);if(!providerCanLaunch(providersRunning.get(node.id)))return;}const {disconnectProviderApi}=await import('./provider.mjs');await ui.task('Removing guest credential',()=>disconnectProviderApi(network,node.id,{runtimeConfig}));});continue;}
      if(selection==='editNative'){await attempt(()=>createNativeListing(node));continue;}
      if(selection==='tariffRefresh'){await attempt(()=>post(`/providers/nodes/${node.id}/tariff/refresh`,{durationSeconds:3600}));continue;}
      if(selection==='thinking'){
        if(providersRunning.has(node.id)||!['draft','paused'].includes(node.status)||node.ready||Number(node.providerRunLeaseUntil)>Date.now()){await ui.page('Stop serving first',['Stop the provider run and pause the listing before changing thinking support.']);continue;}
        const edited=await ui.form('Thinking support',[{name:'thinking',label:'Thinking support',choices:['off','supported']}],{thinking:node.capabilities?.includes('thinking_v1')?'supported':'off'},'Buyers start with thinking off. Enabling support requires a compatible upstream; publish a new revision explicitly afterward.');
        if(edited)await attempt(()=>post(`/providers/nodes/${node.id}/capabilities`,{thinkingEnabled:edited.thinking==='supported'}));
        continue;
      }
      if(selection==='endBuyer'){await post(`/providers/nodes/${node.id}/sessions/${node.activeSessionId}/stop`,{});continue;}
      if (selection === 'delete') {
        const confirmed = await ui.menu('Delete paused listing?', [item(false, 'Cancel'), item(true, 'Delete permanently')], { lines: [node.name, 'This listing will disappear permanently from My provider listings and cannot be republished.', 'Existing receipts and accounting history remain available.', 'Execution cleanup must finish; unresolved accounting is retained.'] }) === true;
        if (!confirmed) continue;
        if(providersRunning.has(node.id))await stopProvider(node.id);
        if (!deletionKeys.has(node.id)) deletionKeys.set(node.id, randomUUID());
        const deleted = await attempt(async () => {
          const result = await post(`/providers/nodes/${node.id}/delete`, { confirm: true }, deletionKeys.get(node.id));
          if (!ProviderNodeDeletion(result) || result.id !== node.id) throw new ClientError('invalid_network_response');
          return result;
        });
        if (deleted?.status==='paused') { await ui.page('Listing cleanup pending',['The listing is withdrawn. Stop or retry cleanup in its owning provider terminal. Outstanding liabilities remain.']);continue;}
        if (deleted) {
          deletionKeys.delete(node.id); limitDrafts.delete(node.id);
          await ui.page('Listing deleted', ['The paused listing has been permanently removed. Existing receipts and accounting history are retained.']);
          return;
        }
        // A lost response is never blindly retried. Refresh the provider view;
        // the retained key is reused only after a new explicit confirmation.
        if (!(await get('/providers/nodes')).some(value => value.id === node.id)) return;
        continue;
      }
      await attempt(async () => {
        if (selection === 'setup') await guidedProvider(node);
        else if (selection === 'launch') await guidedProvider(node);
        else if (selection === 'activate') await ui.suspend(() => providersRunning.get(node.id).warm());
        else if (selection === 'stop' && providersRunning.has(node.id)) { await stopProvider(node.id); }
        else if (selection !== 'refresh' && await confirm(`${words(selection)} listing?`, [node.name, selection === 'stop' ? 'Known unused credits are released; unknown outcomes remain held.' : 'This changes the public availability of this listing.'])) await post(`/providers/nodes/${node.id}/${selection}`, selection === 'stop' ? {scope:'node',trigger:'operator_stop'} : {});
      });
    }
  }
  async function providers() {
    actor('provider');
    for (;;) {
      const nodes = await get('/providers/nodes');
      const selected=await pollingMenu('My provider listings',signal=>read('/providers/nodes',false,signal),(values,stale)=>[...values.filter(n=>!n.retirementRequestedAt).map(n=>item(n.id,providerRow(n,{stale}),modelStatusLines(n.modelStatuses,{stale}))),...(values.some(n=>n.retirementRequestedAt)?[{value:'cleanupSection',label:'Cleanup required',disabled:true,action:true},...values.filter(n=>n.retirementRequestedAt).map(n=>item(n.id,providerRow(n,{stale}),modelStatusLines(n.modelStatuses,{stale})))]:[]),item('new','+ List new compute'),item('refresh','Refresh'),item('back','Back')],{subtitle:'Select a connection. / filters rows; actions stay visible.'});
      if (!selected || selected === 'back') return;
      await attempt(() => selected === 'new' ? createListing() : selected==='refresh'?undefined:manageNode(selected));
    }
  }
  async function buy(listing) {
    actor('buyer');config=await get('/network/config',true);
    let access=quoteAccess(config,listing);if(access.disabled)throw new ClientError(access.code);
    const coding=!!config?.capabilities?.includes('coding_v1')&&listing.capabilities?.includes('coding_v1');
    const bounds = await ui.form('Choose a bounded test session', [
      { name: 'budget', label: 'Maximum test credits', default: '100', validate: integer(1, 1000000), help: 'The server reserves this ceiling, then refunds known unused credits.' },
      { name: 'output', label: 'Maximum output tokens', default: String(Math.min(4096,listing.maxOutputTokens??8192)), validate: integer(1,listing.maxOutputTokens??8192) },
      ...(listing.connectorProtocol==='pi_native_v3'?[{name:'reasoning',label:'Reasoning mode',default:listing.defaultSettings?.reasoning??'off',choices:listing.supportedSettings?.reasoning??['off']}]:[]),
      { name: 'duration', label: 'Session seconds', default: coding?'3600':'300', validate: integer(60,coding?3600:600) },
    ], {}, listing.name);
    if (!bounds) return;
    const privateMode = !config.admissions && config.privateRehearsal;
    if (privateMode && !await confirm('Private rehearsal · provisional qualification', ['This provider has provisional qualification. This session does not establish full acceptance.', 'Coding quotes disclose your chosen time, output and credit limits. Main prompts, compaction, BTW and subagents share the allowance.'], 'Acknowledge and request private session')) return;
    const mode = privateMode ? { mode: 'private_rehearsal', acknowledgeProvisional: true } : {};
    config=await get('/network/config',true);listing=await get(`/listings/${listing.id}`,true);
    access=quoteAccess(config,listing);if(access.disabled)throw new ClientError(access.code);
    if(privateMode!==(!config.admissions&&config.privateRehearsal)||coding!==(!!config.capabilities?.includes('coding_v1')&&listing.capabilities?.includes('coding_v1')))throw new ClientError('quote_policy_changed');
    resolveConnector(listing);
    const quote = await post('/quotes', { ...(['pi_native_v1','pi_native_v2','pi_native_v3'].includes(listing.connectorProtocol)?{connectorProtocol:listing.connectorProtocol}:listing.connector?{connectorProtocol:CONNECTOR_PROTOCOL}:{}), ...(bounds.reasoning?{modelSettings:{reasoning:bounds.reasoning}}:{}),listingId: listing.id, maximumCharge: bounds.budget, maxOutputTokens: Number(bounds.output), durationSeconds: Number(bounds.duration), ...(coding?{protocol:'coding_v1',requestLimit:100}:{}), ...mode });
    if (!await confirm('Review your quote', [...listingLines(listing), '', `Maximum reserved: ${quote.maximumCharge} test credits`, `Output limit: ${quote.maxOutputTokens} tokens`,...(quote.modelSettings?[`Reasoning mode: ${quote.modelSettings.reasoning}`]:[]), `Session duration: ${quote.durationSeconds} seconds`, `Shared inference dispatches: ${quote.requestLimit??5}`, `Quote expires: ${date(quote.expiresAt)}`, `Cold activation deadline: ${quote.activationDeadlineSeconds || 0} seconds. Expired activation refunds the reservation.`], 'Accept and reserve test credits')) return;
    const session = await post('/sessions', { quoteId: quote.id, accept: true, ...mode }, `accept_${quote.id}`);
    if (privateMode) {
      try { const ready = await ui.task('Verify provider guest handshake', signal => network.request(`/v2/sessions/${session.id}/handshake`, { method: 'POST', body: {}, signal }), { cancel: true }); await buyerAgent(ready, listing); }
      finally { await post(`/sessions/${session.id}/stop`); }
    } else await sessionDetail(session.id);
  }
  async function browse() {
    actor('buyer');config=await get('/network/config',true); let filters = { model: '', supplyClass: 'any', availability: 'any' }; let cursor;
    for (;;) {
      const query = new URLSearchParams();
      for (const [key, value] of Object.entries(filters)) if (value && value !== 'any') query.set(key, value);
      if (cursor) query.set('after', cursor);
      const result = await get(`/listings?${query}`, true);
      const selection = await pollingMenu('Browse available compute',signal=>read(`/listings?${query}`,true,signal),(result,stale)=>[item('filters', 'Search and filters'), ...result.listings.map(l => item(l.id, `${l.name} · ${l.model} · ${visibleModelStatus(l.modelStatus,{stale}).availability}`, [`Listing: ${l.id}`,`Provider: ${l.nodeId}`,`${l.model} · ${l.inputRate}/${l.outputRate} test credits per 1M tokens`,...modelStatusLines(l.modelStatus?[l.modelStatus]:[],{stale}),`Thinking: ${l.capabilities?.includes('thinking_v1')?'supported':'off'}`])), ...(result.nextCursor ? [item('next', 'Next page')] : []), item('refresh', 'Refresh from first page'), item('back', 'Back')], { subtitle: result.listings.length ? 'Select compute to inspect its price and reserve access.' : 'No published listings match. Try changing filters or return after a provider publishes.' });
      if (!selection || selection === 'back') return;
      if (selection === 'filters') { const edited = await ui.form('Compute filters', [{ name: 'model', label: 'Model contains', help: 'Leave blank for every model.' }, { name: 'supplyClass', label: 'Supply', choices: ['any', 'authorized_api', 'self_hosted'] }, { name: 'availability', label: 'Availability', choices: ['any', 'hot', 'cold'] }], filters); if (edited) filters = edited; cursor = undefined; }
      else if (selection === 'next') cursor = result.nextCursor;
      else if (selection === 'refresh') cursor = undefined;
      else await attempt(async () => {
        const listing = await get(`/listings/${selection}`, true);
        config=await get('/network/config',true);const access=quoteAccess(config,listing);
        const action = await pollingMenu('Compute details',signal=>read(`/listings/${selection}`,true,signal),(value,stale)=>{const current=stale?{disabled:true,detail:'Refresh failed; availability Unknown.'}:quoteAccess(config,value);return [item('buy','Get a test-credit quote',current.detail,current.disabled),item('back','Back')];},{lines:(value,stale)=>listingLines(value,{stale})});
        if (action === 'buy') await buy(await get(`/listings/${selection}`,true));
      });
    }
  }
  async function buyerAgent(session, selectedListing) {
    if(session.protocol==='coding_v1')return codingAgent(session,selectedListing);
    const input = await ui.form('Buyer workspace', [
      { name: 'root', label: 'Workspace directory', default: process.cwd(), validate: required },
      { name: 'files', label: 'Files to import (comma separated)', help: 'Explicit relative paths. No secrets, hidden files, symlinks or archives.', validate: required },
      { name: 'prompt', label: 'Coding task', maxLength: 32000, validate: required },
    ]);
    if (!input || !await confirm('Start isolated buyer VM?', ['Tools run only in a disposable VM without network.', 'Each command or mutation needs a separate approval.', 'Export creates a reviewed snapshot; original files remain unchanged.'])) return;
    const listing = selectedListing ?? await get(`/listings/${session.listingId}`, true);
    const { openBuyer } = await import('./buyer.mjs');
    const abort = new AbortController();
    const buyer = await openBuyer(network, session.id, { ...input, files: input.files.split(',').map(x => x.trim()), runtimeConfig, signal: abort.signal,
      approve: (action, permission) => confirm('Approve this action once?', [action.name, JSON.stringify(action.args ?? action.changes, null, 2), `Approval expires: ${date(permission.expiresAt)}`], 'Allow once'),
      activity: (title, work) => ui.task(title, work, { cancel: true }),
      progress: async value => { if (value.status === 'answer' && value.text) await ui.page('Agent response', [value.text]); },
    });
    try {
      await buyer.prompt(input.prompt);
      for (;;) {
        const current = await buyer.status();
        const remaining = Math.max(0,Number(current.requestLimit??5)-Number(current.requestSequence??0));
        const choice = await ui.menu('Coding session', [item('prompt','Follow-up task','Continue in the same isolated workspace.',!remaining || current.expiresAt<=Date.now()),item('export','Review and export workspace'),item('finish','Finish session')], { lines: [`${listing.name} · ${listing.model}`,`Expires: ${date(current.expiresAt)}`,`Remaining inference requests: ${remaining}`,`Handshake: ${words(current.handshakeStatus??'not_required')}`] });
        if (!choice || choice==='finish')break;
        if(choice==='export') { const result=await buyer.export(); await ui.page('Reviewed workspace export',[result.directory,result.manifest]); }
        if(choice==='prompt') { const next=await ui.form('Follow-up coding task',[{name:'prompt',label:'Task',maxLength:32000,validate:required}]); if(next)await buyer.prompt(next.prompt); }
      }
    } finally { await buyer.close(); }
  }

  async function applySelected(work) {
    const review=await work.review(),selected=new Set();
    for(;;){
      const action=await ui.menu('Select files to apply',[
        ...review.changes.map((c,i)=>item(`file:${i}`,`${selected.has(c.path)?'[x]':'[ ]'} ${c.kind}: ${c.path}`)),
        item('apply',`Review and approve ${selected.size} selected files`,'',!selected.size),item('back','Cancel')
      ],{lines:['No files are selected initially. Unselected changes remain in saved work.',`Snapshot: ${review.snapshotRevision??'current'}`]});
      if(!action||action==='back')return {status:'denied',completed:[]};
      if(action==='apply')return work.apply([...selected]);
      const index=Number(action.slice(5)),change=review.changes[index];
      if(!change)continue;
      await ui.page(`${change.kind}: ${change.path}`,review.diffs[index]);
      if(selected.has(change.path))selected.delete(change.path);else selected.add(change.path);
    }
  }

  async function codingAgent(session,listing) {
    const input={root:process.cwd()};let manifest,trusted=false,resumeId='new';
    const {openCodingBuyer,savedCodingContexts,pendingApplications}=await import('./coding-buyer.mjs');
    const cancelReservation=async()=>{
      const stopped=await post(`/sessions/${session.id}/stop`);
      await ui.page('Reservation cancelled',[`Refunded: ${stopped.refunded??'pending'} test credits`,`Held: ${stopped.reserved??'unresolved'} test credits`,stopped.state==='settlement_pending'?'Accounting pending: uncertain upstream outcome remains held.':`Status: ${words(stopped.state)}`]);
    };
    const {projectManifest}=await import('./workspace.mjs');
    for(;;){
      const projectSelection=await ui.form('Choose a project',[{name:'root',label:'Project directory',maxLength:4096,validate:required}],input);
      if(!projectSelection){await cancelReservation();return;}
      try{manifest=await ui.task('Prepare reviewed project manifest',()=>projectManifest(input.root));}
      catch(e){await ui.page('Project directory needs attention',[`Project directory: ${input.root}`,...errorLines(e)]);continue;}
      const contexts=await (dependencies.savedCodingContexts??savedCodingContexts)(store.profile,manifest.root);
      let selected;
      for(;;){
        const resources=manifest.files.filter(f=>f.resource);
        selected=await ui.menu('Review project and launch',[
          item('launch','Import and launch new coding conversation'),...contexts.map(c=>item(c.id,`Import and resume ${date(c.savedAt)}`)),
          ...(resources.length?[item('trust',`Resource trust: ${trusted?'enabled':'off'}`)]:[]),item('back','Choose another directory'),item('cancel','Cancel reservation'),
        ],{lines:[`Canonical project: ${manifest.root}`,`Files: ${manifest.files.length} · Bytes: ${manifest.totalBytes}`,`Resources: ${resources.map(f=>f.path).join(', ')||'none'}`,`Resource trust: ${trusted?'enabled':'off'}`,...manifest.exclusions.categories,'Reads stay in the reviewed VM project. Commands, edits and host application require host approval.']});
        if(selected==='trust'){trusted=!trusted;continue;}break;
      }
      if(!selected||selected==='cancel'){await cancelReservation();return;}
      if(selected==='back'){trusted=false;continue;}
      resumeId=selected==='launch'?'new':selected;break;
    }
    let buyer,interrupted,location='Changes remain in the VM.',saved,discard=false;
    const coordinator=new TerminalCoordinator(ui,o=>buyer?.lifecycle.event(o.phase,o));
    try {
      buyer=await ui.task('Start coding development VM',signal=>(dependencies.openCodingBuyer??openCodingBuyer)(network,session.id,{signal,root:manifest.root,files:manifest.files.map(f=>f.path),runtimeConfig,trusted,profile:store.profile,confirmProject:p=>confirm('Confirm legacy checkpoint project',[p.root,'Validate original-file hashes before restoring context.'],'Use this project'),coordinator,approve:(a,p)=>coordinator.approve(a,p),...(resumeId!=='new'?{resumeId}:{})}));
      const applications=await (dependencies.pendingApplications??pendingApplications)(store.profile,manifest.root);
      interrupted=applications.length?await ui.menu('Interrupted application',[item('skip','Start coding without recovery'),...applications.map(a=>item(a.journal,a.operationId,`${a.completed} files confirmed complete`))],{lines:['Recover exact reviewed contents. Changed host originals are preserved.']}):undefined;
      if(interrupted==='skip')interrupted=undefined;
      let enterCoding=!interrupted,lastSession=session;
      for(;;){
        if(enterCoding){try{await ui.suspend(()=>buyer.interactive());}catch(e){if(e.restorationCode)buyer.lifecycle.event('terminal_restoration',{code:e.restorationCode});if(e.restorationCode)throw e;await ui.page('Coding paused',[...errorLines(e),'Inference is unavailable. Review, Apply and Export remain available for saved coding work.']);}enterCoding=false;}
        try{saved=await ui.task('Save private coding checkpoint',()=>buyer.save());location=`Saved privately: ${saved.resumeId} · ${date(saved.savedAt)}`;}
        catch(e){await ui.page('Checkpoint could not be updated',[...errorLines(e),'The last successful checkpoint remains available.']);}
        let current,statusUnavailable=false;try{current=await buyer.status();lastSession=current;}catch{current=lastSession;statusUnavailable=true;}
        const action=await ui.menu('Coding workspace',[item('failureDetails','Failure details','Inspect/export retained evidence; no model request.'),item('continue','Continue coding','Requires current accepted session authority.',!!buyer.lifecycle.closing||statusUnavailable||!!current.stoppedAt||!['ready','active'].includes(current.state)),item('apply','Review and Apply'),item('export','Review and export snapshot'),...(interrupted?[item('recover','Recover interrupted application')]:[]),item('finish','Finish session')],{lines:[location,...(buyer.lifecycle.diagnosticSaveFailed?['Diagnostic save failed · retained evidence may be incomplete']:[]),...(buyer.lifecycle.failureDiagnostic?[failureSummary(buyer.lifecycle.failureDiagnostic)]:[]),...(current.stoppedAt?[`Stopped: ${words(current.stopReason??current.state)}`,`Cleanup: ${words(current.cleanupState??'pending')}`]:[]),...(statusUnavailable?['Session status unavailable · inference and mutations paused.']:[]),`Accepted time remaining: ${Math.max(0,Math.floor((current.expiresAt-Date.now())/1000))} seconds`,`Dispatches: ${statusUnavailable?'unavailable':current.requestSequence??0}/${current.requestLimit}`,`Reserved allowance: ${current.funded??'unknown'} · Charged: ${statusUnavailable?'unavailable':current.charged??'unknown'} test credits`,`Held liability: ${statusUnavailable?'unavailable':current.reserved??'unknown'} · Refunded: ${statusUnavailable?'unavailable':current.refunded??'unknown'}`,'Host application requires separate content review.']});
        if(action==='continue'){enterCoding=true;continue;}
        if(['apply','recover','export'].includes(action)){
          try{
            const result=action==='apply'?await applySelected(buyer):await buyer[action==='recover'?'recover':action](...(action==='recover'?[interrupted]:[]));
            if(result.status==='interrupted'){interrupted=result.journal;location='Host application encountered a conflict; saved VM work is preserved.';}
            if(result.status==='applied'){interrupted=undefined;location='Reviewed changes applied to the host; checkpoint saved privately.';}
            await ui.page('Workspace result',[result.status??'exported',location,...(result.directory?[result.directory]:[]),...(result.completed??[]),...(result.excluded?[`Excluded generated/private/ignored files: ${Object.values(result.excluded).reduce((a,b)=>a+b,0)}`]:[])]);
          }catch(e){await ui.page('Saved-work recovery',[...errorLines(e),location,'Review, Apply and Export use the last saved snapshot. Further inference requires active compute.']);}
          continue;
        }
        if(action==='failureDetails'){await failureDetails(buyer.lifecycle.failureDiagnostic,buyer.lifecycle.events.filter(e=>e.phase==='diagnostic_save'&&e.code).map(e=>({phase:e.phase,status:'failed',code:e.code})));continue;}
        if(!action||action==='finish'){
          let changes;try{changes=await buyer.changes();}catch(e){await ui.page('Changes could not be inspected',errorLines(e));continue;}
          const finish=await ui.menu('Finish with saved work',[item('apply','Review and Apply'),item('save','Save and finish'),item('discard','Discard VM work and finish'),item('back','Back')],{lines:[location,`Unapplied changes: ${changes.changes.length}`,...changes.changes.map(c=>`${c.kind}: ${c.path}`)]});
          if(finish==='apply'){try{const result=await applySelected(buyer);location=words(result.status);if(result.status==='interrupted')interrupted=result.journal;}catch(e){await ui.page('Application not completed',errorLines(e));}continue;}
          if(finish==='save'){try{await buyer.save();break;}catch(e){if(buyer.lifecycle.closing&&saved)break;await ui.page('Save failed; session remains open',errorLines(e));continue;}}
          if(finish==='discard'&&await confirm('Discard private VM work?',['This deletes this session checkpoint. Previously saved contexts and host files are preserved.'],'Discard and finish')){discard=true;break;}
        }
      }
    }finally{
      if(buyer){if(discard)await buyer.discard();const result=await buyer.close();await ui.page('Session completion',[`Cleanup: ${words(result.status)}`,...result.outcomes.map(o=>`${words(o.phase)}: ${o.status}`),...accountingLines(result.outcomes.find(o=>o.phase==='remote_stop')?.session)]);}
    }
  }

  async function savedWork(){
    const {savedCodingContexts,pendingApplications}=await import('./coding-buyer.mjs');
    const {openSavedCodingWork}=await import('./saved-work.mjs');
    const contexts=await savedCodingContexts(store.profile);
    const choice=await ui.menu('Saved coding work',[...contexts.map(c=>item(c.id,`Checkpoint ${date(c.savedAt)}`,c.root)),item('back','Back')],{lines:['Review, Apply and Export require no running VM or new session. Resume coding requires a newly accepted session.']});
    if(!choice||choice==='back')return;
    const coordinator=new TerminalCoordinator(ui);
    const work=await openSavedCodingWork(store.profile,choice,{approve:(a,p)=>coordinator.approve(a,p),confirmProject:p=>confirm('Confirm legacy checkpoint project',[p.root,'Original-file hashes will be validated before review.'],'Use this project')});
    for(;;){
      const journals=await pendingApplications(store.profile,work.workspace.root);
      const action=await ui.menu('Saved workspace',[item('review','Review changes'),item('apply','Review and Apply'),item('export','Export reviewed snapshot'),...journals.map(j=>item(j.journal,'Recover interrupted application',j.operationId)),item('back','Back')],{lines:[work.workspace.root,`Snapshot: ${work.snapshotRevision}`,'Saved work is available independently of compute and settlement.']});
      if(!action||action==='back')return;
      if(action==='review'){const review=await work.review();await ui.page('Saved changes',review.changes.flatMap((c,i)=>[`${c.kind}: ${c.path}`,...review.diffs[i].map(text=>({text,kind:text.startsWith('+')?'added':text.startsWith('-')?'removed':'heading'}))]));}
      else await attempt(async()=>{const result=await (action==='apply'?applySelected(work):action==='export'?work.export():work.recover(action));await ui.page('Saved-work result',[result.status??'exported',result.directory??'',...(result.completed??[]),...(result.code?[result.code]:[])]);});
    }
  }

  async function failureDetails(diagnostic,outcomes=[]) {
    for(;;){const choice=await ui.menu('Failure details',[item('exportDiagnostic','Export private diagnostic JSON','Metadata only; no model request.',!safeFailure(diagnostic)),item('back','Back')],{lines:failureLines(diagnostic,outcomes)});
      if(!choice||choice==='back')return;
      if(choice==='exportDiagnostic')await attempt(async()=>{const {mkdir}=await import('node:fs/promises'),{join}=await import('node:path');const directory=join(await store.directory(),'failure-exports');await mkdir(directory,{mode:0o700}).catch(e=>{if(e.code!=='EEXIST')throw e;});const path=await exportFailure(directory,diagnostic,outcomes);await ui.page('Private diagnostic export',[path,'Request metadata and cleanup outcomes only.']);});
    }
  }
  async function buyerFailure(id,remote) {
    const remoteDiagnostic=safeFailure(remote)&&remote.sessionId===id?remote:null;
    try {const {join}=await import('node:path'),{lstat}=await import('node:fs/promises');const base=join(await store.directory(),'coding');const st=await lstat(base);if(!st.isDirectory()||st.isSymbolicLink()||st.uid!==process.getuid()||(st.mode&0o077))return {failureDiagnostic:remoteDiagnostic,outcomes:[]};
      const local=await readPrivateDiagnostic(join(base,id),'lifecycle.json'),d=safeFailure(local.failureDiagnostic??local.firstFailure?.failureDiagnostic);return {failureDiagnostic:remoteDiagnostic??(d?.sessionId===id?d:null),outcomes:[...(local.outcomes??[]),...(local.events??[]).filter(e=>e.phase==='diagnostic_save'&&e.code).map(e=>({phase:'diagnostic_save',status:'failed',code:e.code}))]};
    }catch{return {failureDiagnostic:remoteDiagnostic,outcomes:[]};}
  }
  async function sessionDetail(id) {
    for (;;) {
      const session = await get(`/sessions/${id}`);
      const evidence=await buyerFailure(id,session.failureDiagnostic);
      const choice = await ui.menu('Test-credit session', [item('failureDetails','Failure details','Inspect/export retained evidence; no model request.'),item('agent', 'Start buyer coding agent', 'Select files, approve tools and export a reviewed workspace.', !['ready','active'].includes(session.state)), item('events', 'Activity and recovery'), item('stop', 'Stop and release unused credits'), ...(!session.buyerDeletedAt?[item('delete','Stop and delete session','Retires after confirmed cleanup. Saved work and outstanding liabilities remain.')]:[]), item('refresh', 'Refresh'), item('back', 'Back')], { lines: [...(evidence.failureDiagnostic?[failureSummary(evidence.failureDiagnostic)]:[]),`Execution: ${words(session.executionState??(session.stoppedAt?'stopped':session.state))}`,`Reason: ${words(session.stopReason??'none')}`,`Accounting: ${words(session.accountingState??session.state)}`, `Reserved access: ${session.funded} · Charged: ${session.charged}`, `Unresolved liability: ${session.reserved} · Refunded: ${session.refunded}`, `Expires: ${date(session.expiresAt)}`, `Reference: ${session.id}`, '', 'Reconnect restores status. Paid requests and tool actions are never replayed.'] });
      if (!choice || choice === 'back') return;
      if(choice==='failureDetails'){await failureDetails(evidence.failureDiagnostic,evidence.outcomes);continue;}
      if(['delete','restore'].includes(choice)){await post(`/sessions/${id}/${choice}`,{});return;}
      if (choice === 'agent') await buyerAgent(session);
      if (choice === 'events') { const events = await get(`/sessions/${id}/events`); await ui.page('Session activity', events.length ? events.map(e => `${date(e.at)} · ${words(e.type)}`) : ['No activity yet.']); }
      if (choice === 'stop' && await confirm('Stop session?', ['Known unused credits will be returned. Unknown inference outcomes stay held.'])) await post(`/sessions/${id}/stop`);
    }
  }
  async function sessions() {
    actor('buyer');let deleted=false;
    for(;;){
      const values=await get('/sessions'+(deleted?'?view=deleted':''));
      const choice=await ui.menu(deleted?'Deleted sessions':'My sessions',[item('view',deleted?'My sessions':'Deleted'),...values.map(s=>item(s.id,`${words(s.executionState??(s.stoppedAt?'stopped':s.state))} · ${s.charged}/${s.funded} credits · ${s.id.slice(0,8)}`,[`Session: ${s.id}`,`Listing: ${s.listingId}`,`Execution: ${words(s.executionState??(s.stoppedAt?'stopped':s.state))}`,`Accounting: ${words(s.accountingState??s.state)}`,`Cleanup: ${words(s.cleanupState??'pending')}`,`Expires: ${date(s.expiresAt)}`])),item('back','Back')],{subtitle:deleted?'Retired sessions retain saved work and accounting references.':'Inspect execution or stop and retire a session.'});
      if(!choice||choice==='back')return;if(choice==='view'){deleted=!deleted;continue;}await sessionDetail(choice);
    }
  }
  async function receipts() {
    actor('buyer'); const values = await get('/receipts');
    await ui.page('Receipts · test credits only', values.length ? values.flatMap(r => [`${date(r.at)} · ${words(r.state)}`, `Funded ${r.funded} · Charged ${r.charged} · Refunded ${r.refunded}`, `Reason: ${words(r.reason)}`, `Session: ${r.sessionId}`, '']) : ['No settled receipts yet.', 'Receipts appear after session settlement. Test credits have no cash value.']);
  }
  async function admin() {
    actor('admin');
    const choice = await ui.menu('Marketplace operator', [item('sessions','Provider sessions and cleanup'),item('suspension', 'Manage listing suspension'), item('cancellationReview', 'Review evaluation cancellation'), ...(network.local ? [item('grant', 'Grant local test credits')] : []), item('allowance','Manage marketplace allowances'), item('evaluation', 'Evaluation queue'), item('evaluationSessions', 'Evaluation sessions'), item('tariff', 'Qualify upstream tariff'), item('capacity','Release stopped execution capacity'), item('reconcile', 'Reconcile uncertain requests'), item('back', 'Back')], { subtitle: network.local ? 'Local fixtures only.' : 'Requires a separately approved marketplace operator installation.' });
    if(choice==='sessions') {
      const nodes=await get('/admin/nodes');
      const id=await pollingMenu('Provider groups',signal=>read('/admin/nodes',false,signal),(nodes,stale)=>[...nodes.filter(n=>n.status!=='deleted').map(n=>item(n.id,`${n.name} · ${n.id}`,modelStatusLines(n.modelStatuses,{stale}))),item('back','Back')]);if(!id||id==='back')return;
      const node=nodes.find(n=>n.id===id),sessions=(await get('/admin/sessions')).filter(s=>s.nodeId===id);
      const action=await ui.menu('Provider execution',[item('halt','Halt provider'),item('delete','Delete listing'),...sessions.map(s=>item(s.id,`${words(s.executionState)} · ${s.id}`,`Cleanup ${words(s.cleanupState)} · Accounting ${words(s.accountingState)} · Held ${s.reserved}`)),item('back','Back')],{lines:[`Provider: ${node.ownerId}`,`Run: ${node.providerRunId??'none'}`,`Last heartbeat: ${date(node.connectionUpdatedAt)}`,'Unresolved accounting is retained after execution cleanup.']});
      if(!action||action==='back')return;
      if(action==='halt'||action==='delete'){if(await confirm(action==='halt'?'Halt provider?':'Stop and retire listing?',['The provider must confirm guest teardown. Credentials and liabilities remain.']))await post(`/admin/nodes/${id}/${action==='halt'?'stop':'delete'}`,action==='delete'?{confirm:true}:{});}
      else {const session=sessions.find(s=>s.id===action);if(await confirm('Halt buyer session?',[`Session: ${session.id}`,`Execution: ${words(session.executionState)}`,`Cleanup: ${words(session.cleanupState)}`,`Accounting: ${words(session.accountingState)}`]))await post(`/admin/sessions/${session.id}/stop`);}
    } else if (choice === 'evaluationSessions') {
      const sessions = await get('/admin/evaluation-sessions');
      const id = await ui.menu('Evaluation sessions', [...sessions.map(s => item(s.id, `${s.state} · ${s.id}`, `Evaluation only · reserved ${s.funded} · charged ${s.charged}`)), item('back', 'Back')]);
      if (id && id !== 'back' && await confirm('Stop evaluation session?', ['Known unused allowance is released. Unknown upstream liability stays reserved.'])) await post(`/admin/evaluation-sessions/${id}/stop`);
    } else if(choice==='allowance') {
      const policies=await get('/admin/allowances');const id=await ui.menu('Marketplace policies',[...policies.map(p=>item(p.id,p.id==='platform'?'Platform':p.ownerId,`Daily ${p.dailyLimit} · Monthly ${p.monthlyLimit} · Held ${p.held}`)),item('back','Back')]);if(!id||id==='back')return;
      const policy=policies.find(p=>p.id===id);
      const values=await ui.form('Separate marketplace limits',[{name:'dailyLimit',label:'Daily test credits',default:policy.dailyLimit,validate:integer(0,999999999999999)},{name:'monthlyLimit',label:'Monthly test credits',default:policy.monthlyLimit,validate:integer(0,999999999999999)},{name:'reviewReference',label:'Change reference',validate:required}]);
      if(values&&await confirm('Update marketplace limits?', ['Legacy balances and limits remain separate.',JSON.stringify(values,null,2)]))await post(`/admin/allowances/${id}`,{...values,expectedRevision:policy.revision});
    } else if(choice==='capacity') {
      const requests=await get('/admin/requests');const id=await ui.menu('Stopped execution capacity',[...requests.map(r=>item(r.sessionId,r.sessionId,`Unresolved request ${r.id}`)),item('back','Back')]);
      if(!id||id==='back')return;
      const evidence=await ui.form('Verified guest teardown',[{name:'teardownEvidenceReference',label:'Teardown evidence reference',validate:required}]);
      if(evidence&&await confirm('Release execution capacity?', ['Verify the provider guest was removed, readiness cleared and relay disconnected.', 'The unresolved request and financial reservations remain held.'], 'Confirm verified teardown')) await post(`/admin/sessions/${id}/release-execution`,{...evidence,guestTeardownVerified:true});
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
  async function signOut() {
    if(!await confirm('Sign out?', ['Stop local activity and lock saved provider credentials. Saved work, connections and accounting remain.','Server revocation will be attempted independently of access or refresh health.'],'Sign out'))return;
    for(const provider of providersRunning.values())await provider.stop({trigger:'sign_out'}).catch(()=>{});
    pruneProviders();
    const result=await ui.task('Signing out locally',()=>network.logout());clearIdentity();
    await ui.page('Signed out',[result.message??'Signed out.']);
  }
  async function manageInstallations() {
    let url=network.origin==='https://api-staging.adrouter.co'?'https://app-staging.adrouter.co/installations':undefined;
    if(!url){const value=await ui.form('Installation management',[{name:'origin',label:'Dashboard HTTPS origin',validate:v=>{try{networkOrigin(v);return '';}catch{return 'Enter the trusted dashboard HTTPS origin.';}}}]);if(!value)return;url=networkOrigin(value.origin)+'/installations';}
    const action=await ui.menu('Manage installations',[item('open','Open in Safari'),item('back','Back')],{lines:[url,'Sign in to view and revoke account-owned installations. This can finish an unconfirmed server revocation.']});
    if(action==='open'){if(process.platform==='darwin'){const child=spawn('/usr/bin/open',['-a','Safari',url],{stdio:'ignore'});child.on('error',()=>{});}else await ui.page('Open in your browser',[url]);}
  }
  async function accountControls() {
    const action=await ui.menu('Account',[item('login','Sign in'),item('recover','Repair sign-in'),item('repairLock','Repair interrupted local state'),item('logout','Sign out'),item('profiles','Switch profile'),item('installations','Manage installations'),item('back','Back')],{lines:[`Profile: ${store.profile}`,`Network: ${network.origin}`,`Account: ${verifiedIdentity?.email??verifiedIdentity?.userId??'Not currently verified'}`,`Sign-in: ${words(authState)}`]});
    if(action==='login')await signIn(store.profile==='operator');
    else if(action==='recover')await signIn(store.profile==='operator',true);
    else if(action==='repairLock'){try{await store.repairLock?.();}catch(error){if(error.code!=='auth_lock_owner_unknown')throw error;if(!await confirm('Repair interrupted lock?',['Close every other terminal using this profile first. The interrupted lock has no identifiable owner. Saved authentication and work are preserved.'],'Other clients are closed; repair'))return;await store.repairLock({confirmUnknown:true});}await ui.page('Local state checked',['Use Repair sign-in for an interrupted refresh. Live process locks are never removed.']);}
    else if(action==='logout')await signOut();
    else if(action==='profiles')await selectProfile();
    else if(action==='installations')await manageInstallations();
  }
  async function selectProfile() {
    const chosen = await ui.menu('Choose profile', [item('default', 'Default', 'Preserves the original installation'), item('provider', 'Provider', 'Independent provider installation and refresh state'), item('buyer', 'Buyer', 'Independent buyer-only installation and refresh state'), item('operator', 'Operator', 'Independent operator approval'), item('custom', 'Named profile'), item('back', 'Back')]);
    if (!chosen || chosen === 'back') return;
    let profile = chosen;
    if (chosen === 'custom') { const value = await ui.form('New or existing profile', [{ name: 'profile', label: 'Profile name', validate: value => /^[a-z][a-z0-9_-]{0,31}$/.test(value) ? '' : 'Use up to 32 lowercase letters, digits, underscores or hyphens.' }]); if (!value) return; profile = value.profile; }
    if(profile===store.profile)return;
    for(const provider of providersRunning.values())await provider.stop({trigger:'profile_switch'});pruneProviders();if(providersRunning.size){await ui.page('Provider cleanup required',['Finish provider cleanup before switching profiles.']);return;}
    const next = new AuthStore(store.home, profile);
    const origin = ((await next.read())?.origin ?? await next.readSelection?.()) ?? network.origin;
    clearIdentity();store = next; network = new Network({ origin, local: network.local, actor: options.actor ?? 'buyer', store });
    config = await attempt(()=>get('/network/config', true));
    ui.context = `${store.profile} · ${packageMetadata.version} · ${network.local ? 'LOCAL · test credits' : network.origin}`;
  }
  let terminating = false;
  const terminate = () => { terminating = true; ui.pending?.resolve(null); ui.terminate(); };
  process.once('SIGTERM', terminate); process.once('SIGINT', terminate);
  ui.start();
  try {
    if (!options.profile && !dependencies.store && !(await readAuth())) {
      const role=await ui.menu('Choose your role', [item('buyer','Buyer'),item('provider','Provider'),item('operator','Operator'),item('exit','Exit')]);
      if (!role || role==='exit') return;
      store=new AuthStore(store.home,role);
    }
    if (!network) {
      let origin = options.network; let local = !!options.local;
      if (local && !origin) origin = 'http://127.0.0.1:8790';
      if (!origin) origin = ((await readAuth())?.origin ?? await store.readSelection?.());
      if (!origin) {
        const choice = await ui.menu('Welcome to AdRouter', [item('staging', 'Sign in to AdRouter staging'), item('custom', 'Choose another network'), item('local', 'Local development', 'Uses the loopback test marketplace; no real sign-in or money.'), item('exit', 'Exit')]);
        if (!choice || choice === 'exit') return;
        local = choice === 'local'; origin = local ? 'http://127.0.0.1:8790' : 'https://api-staging.adrouter.co';
        if (choice === 'custom') { const input = await ui.form('Choose network', [{ name: 'origin', label: 'HTTPS API origin', default: origin, maxLength: 2048, validate: v => { try { networkOrigin(v); return ''; } catch { return 'Use an HTTPS origin with no path or credentials.'; } } }]); if (!input) return; origin = input.origin; }
      }
      network = new Network({ origin, local, actor: options.actor ?? 'buyer', store });
    }
    ui.context = `${store.profile ?? 'default'} · ${packageMetadata.version} · ${network.local ? 'LOCAL · test credits' : network.origin}`;
    config = await attempt(() => get('/network/config', true));display.start();
    for (;;) {
      if (terminating) return;
      if(interruptRequested){interruptRequested=false;if(await requestExit())return;continue;}
      if (!network.local && !(await readAuth())) {clearIdentity();
        const selection = await ui.menu('Sign in to AdRouter', [item('login', store.profile === 'operator' ? 'Approve operator in browser' : 'Continue in browser', 'Approve this profile with the comparison code.'), ...(store.profile === 'operator' ? [] : [item('operatorLogin', 'Sign in as operator', 'Separate approval; current owner/operator role required.')]), item('account','Account and sign-in'), item('installations','Manage installations'), item('profiles', 'Choose profile'), item('diagnostics', 'Network status'), item('exit', 'Exit')], { subtitle: config?.admissions === false ? (config.privateOwnerEvaluation ? config.privateRehearsal ? 'Private two-account rehearsal and owner evaluation. Ordinary purchases are disabled.' : 'Private owner evaluation only. Ordinary purchases are disabled.' : 'This network has marketplace admissions disabled.') : 'Your installation is separate from other AdRouter clients.' });
        if (!selection || selection === 'exit') {if(await requestExit())return;continue;}
        if(selection==='account')await attempt(accountControls);
        else if(selection==='installations')await attempt(manageInstallations);
        else if (selection === 'profiles') await attempt(selectProfile);
        else if (selection === 'login') await attempt(() => signIn(store.profile === 'operator'));
        else if (selection === 'operatorLogin') await attempt(() => signIn(true));
        else await ui.page('Network status', [network.origin, `Marketplace: ${config ? (config.admissions ? 'accepting' : 'disabled') : 'unavailable'}`]);
        continue;
      }
      const scope = network.local ? ['marketplace:buyer', 'marketplace:provider', 'marketplace:operator'] : String((await readAuth())?.scope ?? '').split(' ');
      await Promise.race([refreshIdentity(scope),new Promise(resolve=>setTimeout(resolve,100))]);
      if (['temporarily_unavailable','recovery_required','revoked'].includes(authState)) {
        const code = identityError instanceof ClientError ? identityError.code : 'network_unavailable';
        const selection = await ui.menu('Sign-in needs attention', [
          item('retry', 'Check sign-in again'),
          ...(authRecoveryCodes.has(code) ? [item('recover', 'Repair sign-in in browser', 'Keeps this installation and its provider/session bindings.')] : []),
          item('account','Account and sign-in'),item('installations','Manage installations'),item('logout','Sign out'),...(providersRunning.size?[item('stopProviders','Stop running providers')]:[]),
          item('profiles', 'Choose profile'), item('saved', 'Saved coding work'), item('exit', 'Exit'),
        ], { lines: [code, loginHint(code) || 'The network or account is unavailable. Retry after connectivity or access is restored.', 'Your saved work and provider records are preserved.'] });
        if (!selection || selection === 'exit') {if(await requestExit())return;continue;}
        await attempt(async () => {
          if (selection === 'recover') await signIn(scope.includes('marketplace:operator'), true);
          else if(selection==='account')await accountControls();
          else if(selection==='installations')await manageInstallations();
          else if(selection==='logout')await signOut();
          else if (selection === 'profiles') await selectProfile();
          else if (selection === 'saved') await savedWork();
          else if (selection === 'stopProviders') { for (const provider of providersRunning.values()) await provider.stop({ trigger: 'auth_recovery' }); pruneProviders(); }
        });
        continue;
      }
      const selection = await ui.menu('What would you like to do?', [
        item('browse', 'Browse compute', 'Find listings, compare prices and reserve bounded test-credit access.'),
        ...(scope.includes('marketplace:provider') ? [item('create', 'List compute', 'Guided publication and hot/cold provider operation.'), item('providers', 'My provider listings'), item('budget', 'Provider spending budget')] : []),
        ...(scope.includes('marketplace:buyer') ? [item('sessions', 'My sessions'),item('saved','Saved coding work'), item('receipts', 'Receipts')] : []), item('account', 'Account and sign-in'), item('profiles', 'Choose profile'), item('runtime', 'Runtime setup'), item('status', 'Network and diagnostics'),
        ...(scope.includes('marketplace:operator') ? [item('admin', network.local ? 'Local test operator' : 'Marketplace operator')] : []), item('exit', 'Exit'),
      ], { subtitle: `${network.local ? 'Local development identity · ' : ''}Test credits have no cash value.` });
      if (!selection || selection === 'exit') {if(await requestExit())return;continue;}
      await attempt(async () => {
        if (selection === 'profiles') await selectProfile();
        else if (selection === 'budget') await spendingBudget();
        else if (selection === 'browse') await browse(); else if (selection === 'create') await createListing();
        else if (selection === 'providers') await providers(); else if (selection === 'sessions') await sessions();
        else if(selection==='saved')await savedWork();else if (selection === 'receipts') await receipts(); else if (selection === 'runtime') await runtimeSetup();
        else if (selection === 'admin') await admin();
        else if(selection==='account')await accountControls(); else if (selection === 'status') {
          config = await attempt(()=>get('/network/config', true));
          await ui.page('Network and implementation status', [network.origin, `Public admissions: ${config.admissions ? 'enabled' : 'disabled'}`, `Private buyer rehearsal: ${config.privateRehearsal ? 'enabled · hot listings can be reserved by the approved buyer' : 'disabled'}`, `Private owner evaluation: ${config.privateOwnerEvaluation ? 'enabled for designated owner' : 'disabled'}`, `Relay: ${words(config.relay)}`, `Buyer agent: ${words(config.agentExecution)}`, 'Provider: guest-only key entry; cold activation deadline 120 seconds.', 'Evaluation results remain provisional until every qualification check is verified. Reviewed export preserves host originals.', 'Runtime acceptance and actual provider acceptance are separate gates.']);
        }
      });
    }
  } finally {
    display.stop();process.removeListener('SIGTERM', terminate); process.removeListener('SIGINT', terminate);
    const cleanup = await Promise.allSettled([...providersRunning.values()].map(p => p.stop({trigger:'tui_exit'}))); ui.stop();
    if (cleanup.some(r => r.status === 'rejected' || r.value?.status === 'cleanup_required')) throw new ClientError('provider_cleanup_required');
  }
}
