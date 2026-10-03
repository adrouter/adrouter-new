# adr-cli · AdRouter test-credit marketplace

Private Mac owner-evaluation implementation for the test-credit marketplace. Test credits have no
cash value and are independent of legacy AdRouter balances. The package remains
private; no candidate or alpha has been published from this work.

## Terminal application

Use Node 22.19 or newer. Run `node bin/adr-cli.mjs` for the branded TUI. Native
Safari opens only after the explicit sign-in action on macOS. Marketplace device
approval is separate from other AdRouter clients. Operator sign-in requests only
`marketplace:operator` and also requires a current owner/operator account role.
JSON command compatibility remains available with `--json`; see `--help`.

The TUI covers listing creation and operator suspension, hot/cold provider control,
provider cumulative budgets, marketplace account/session/receipt views, buyer
execution, runtime installation/verification, and operator evaluation/tariff and
uncertain-outcome reconciliation. Runtime paths selected or installed through the
TUI are saved as non-secret paths and reverified before reuse. Workspace import requires Python 3 for
anchored directory-descriptor reads on macOS and Linux.

For explicit ephemeral development only, start `npm run marketplace:local` in the
Router feature checkout's backend, then `node bin/adr-cli.mjs --local`. Development
identities are labeled; local approvals and grants establish no hosted authority.

## Repair sign-in

If a refresh outcome is uncertain, use `adr-cli --profile provider login --recover`
(or the same command for your buyer/operator/custom profile). Compare the code and
approve renewal in native Safari with the original account. Recovery retains the
installation ID, exact permissions, saved configuration and workload bindings.
Stop running work through its normal checkpoint/Stop controls before repair.

An uncertain refresh token is never replayed. Temporary failures can be retried;
Sign-out clears usable local authentication even while offline and attempts bounded
key-proven revocation independently. If unconfirmed, Manage installations opens Safari
to finish revocation after browser sign-in. A replacement installation can reclaim
an account-owned paused connection without resetting consumption or liabilities.

## Separate profiles

Use two terminals under the same backend owner account:

```sh
adr-cli --profile provider --network https://api-staging.adrouter.co
adr-cli --profile operator --network https://api-staging.adrouter.co
```

Choose Profile in the TUI to select default/buyer/provider/operator or a named profile.
Each named profile starts without credentials and requires its own Safari approval.
Private keys, refresh state and locks are isolated; credentials are never copied.
The default retains its original `~/.adr-v2/installation.json` location. Named
profiles use `~/.adr-v2/profiles/NAME/`; sign-out affects only the selected profile.
Keep provider operation open while using the operator terminal. Menus follow the
installation's granted scopes. `--profile operator login` requests operator scope;
`--profile provider login` requests provider scope only.

## Provider operation

Choose a preset and edit public metadata. The DeepSeek preset uses the documented `deepseek-flash` request identifier. The official DeepSeek connector disables
thinking explicitly because the marketplace wire contract carries text/tools,
not reasoning history (see [DeepSeek thinking mode](https://api-docs.deepseek.com/guides/thinking_mode)). Test-credit prices are separate from USD upstream
cost. Explicit publication and a qualified, versioned upstream tariff are required.

The guided flow verifies or installs the runtime, sets limits and budget, publishes
the listing, checks tariff qualification, then attaches the guest console and confirms
relay readiness. Publish your listing and qualify its current tariff before your private evaluation.
Publication exposes listing metadata; ordinary purchases remain disabled on this private network.
Operator suspension stops serving; clearing it leaves the listing paused until you republish. Back/Cancel retain
in-progress form values during the session; submitted drafts remain on the backend.
The original jellyfish panel uses a compact `adr v2` header when space is limited.

Set a cumulative spending cap explicitly in USD (up to six decimal places). It covers all your nodes, installations
and restarts. Consumed spending and uncertain liabilities are never reset by a
restart or timeout. Increases require confirmation and a matching revision.
The independent USD 10 ceiling is only for live acceptance testing.

Hot setup warms a pinned VM after publication and tariff qualification. The terminal attaches
directly to hidden input inside that VM. After key entry, press Ctrl+D when the
guest says it is ready to return to the dashboard. The host JavaScript application
never reads the upstream key. Credentialed HTTP and TLS run in the guest; the host
forwards encrypted bytes to the one approved destination. There is no general
CONNECT proxy. Keys are never placed in files, argv, environment or snapshots.

Cold operation keeps control online. A reservation raises an activation choice in
the provider dashboard with a 120-second deadline. Launch the guest and enter the
key before that deadline. Expiry releases credits without an inference charge.
Keep the foreground TUI open. Back returns to its menu while serving continues;
Stop or Exit tears down owned guests. Version-2 connections retain their credential
disk; a freshly authorized restart reuses it. Version-1 connections remain memory-only.

Paused listings expose **Delete paused listing** in My provider listings. Cancel
is the default; confirmed deletion is permanent and cannot be republished. All
linked sessions and accounting must finish first. Receipts and immutable listing
history remain, and deletion does not reset spending or uncertain liabilities.
The command equivalent is `adr-cli --profile provider provider delete NODE_ID --confirm-delete`.

Browse and quote review refresh current network policy. Diagnostics shows public
admissions and private buyer rehearsal separately; approved private buyers can
reserve hot listings while public admissions remain disabled.

## Buyer execution and export

Select workspace files and accept bounded access. Tools run exclusively in a
pinned offline buyer VM. Each mutation, command and export requires a fresh,
action-bound approval. Model requests go through the marketplace relay. Unknown
paid outcomes are held for reconciliation and never automatically replayed.

Export creates a fresh private directory containing the complete selected
workspace and a reviewed manifest of additions, modifications and deletions.
Original host files are preserved. Conflicting or changed originals, symlinks,
path escapes, credentials and oversized inputs are rejected. This implementation
exports a snapshot; it does not apply changes over the original checkout.

## Evaluation and release status

With ordinary admissions closed, the server-configured owner can evaluate their
own approved listing through separately scoped operator endpoints. Normal
self-purchase remains rejected. Evaluation sessions, receipts and charges are
marked separately and do not count as buyer acceptance or provider earnings.

Operator evaluation uses budgeted marketplace inference and a separate offline
VM for generated code. Reports bind the exact session and immutable listing revision, with version,
settled sample count, elapsed time, freshness and any cancellation request ID.
The runner waits up to the disclosed cold-activation deadline, supports Esc/Cancel,
and makes one bounded cancellation attempt after tool and offline-code checks.
Unknown outcomes retain their allowance and USD liabilities across restarts. Automatic reports remain **provisional** until upstream cancellation
is independently verified and recorded with an evidence reference. Ordinary buyers
cannot purchase an unqualified or stale listing. Repeat/idle evaluation is off;
each run requires explicit budget confirmation and available node capacity.

Local checks and synthetic Apple Silicon VM execution do not establish live
provider acceptance. This milestone needs separate browser approvals, a real key entered only inside the guest, and reviewed
upstream cancellation/billing evidence. The cumulative live ceiling is USD 10.

Linux x86-64/KVM, separate hosts, ordinary beta accounts, registry candidates and
alpha promotion are deferred for this private milestone. They remain mandatory
release gates in `release-policy.json`; `private: true` and publication disabled
remain intact. Solana, mainnet and `latest` are out of scope.

See [private acceptance and rollout](docs/private-mac-acceptance.md) for the exact
procedure, recovery boundaries and remaining operator steps.

## Validation

`npm run check` checks all JavaScript source, generated Router validators, the
separate Pi 0.85.1 provenance lock, and unit tests. Router owns the marketplace
contract and generator; commit that source before regenerating this client's
validators. Do not hand-edit generated files.

The runtime scripts use only the explicitly supplied non-secret paths
`ADROUTER_NEW_RUNTIME_EXECUTABLE`, `ADROUTER_NEW_RUNTIME_LIBRARY` and
`ADROUTER_NEW_RUNTIME_HOME`:

- `node scripts/verify-buyer-runtime.mjs`: actual VM tools, approvals and export with synthetic inference.
- `node scripts/verify-egress-runtime.mjs`: guest TLS to the fixed upstream without a key or inference; deny unapproved destinations.
- `npm run test:runtime`: retained synthetic two-VM feasibility test, not release acceptance.

Pi fuzzy search and bounded tool-output truncation are generated from the locked
0.85.1 source revision; their MIT license is included. `scripts/vendor-pi.mjs`
reproduces the selected components without importing Pi credentials or host tools.

Owner-only acceptance checks the configured active owner during approval, token issuance,
refresh and authenticated use. Stop/pause and signed revocation remain available
when acceptance or client policy is disabled, while installation ownership and
proof verification remain required. Ordinary marketplace admissions remain closed.


## Continuous hot providers and private buyers

Hot listings default to continuous foreground serving. Keep the provider terminal open.
A 60-second VM idle watchdog is touched every 20 seconds; shutdown, terminal closure,
suspension or an unrecoverable runtime/authentication failure tears down the owned guest. Temporary relay loss keeps the healthy VM running and reconnects with fresh authentication; request cancellation and uncertain inference affect only that request, with unknown charges held. There
is no continuous-mode lifetime request cutoff. Cold serving and `provider serve --bounded`
retain evaluation limits. Each separately accepted buyer session permits five dispatched
inferences, including tool continuations and uncertain outcomes.

Use `--profile buyer` for the distinct private account. It requests only
`marketplace:buyer`; provider/operator profiles and existing installations remain separate.
With general admissions disabled, Browse can offer a private rehearsal only when the
server advertises that capability. Acknowledge provisional qualification, accept the
100-credit / 300-second / 1,024-output-token quote, then verify the guest handshake.
The handshake consumes no upstream inference. Success opens workspace selection and a
coding session automatically. Follow-up tasks keep the same isolated workspace and
conversation; commands, mutations and reviewed snapshot export still need fresh approval.

Inference uses a 120-second absolute deadline capped by session expiry. The client
allows 135 seconds for outcome and cleanup. Unknown requests are never replayed.
Operator capacity release requires stopped execution, reviewed guest-teardown evidence,
cleared readiness and relay disconnection; unresolved liabilities remain reserved.
Private rehearsal evidence does not establish full provider qualification or public release.


## Private live coding

The negotiated VM coding runtime and its exact install/test/recovery procedure are in [the private live coding guide](docs/live-coding-rollout.md). It reuses the pinned legacy harness without requiring a legacy installation. Existing buffered sessions keep their bounds; coding quotes support up to 60 minutes and 100 shared inference dispatches. Public publication and real payment transactions remain gated.


### Private alpha.19 saved work and coding terminal

Saved coding work offers Review, Apply, Export and interrupted-application recovery without a running VM or a new compute purchase. Host approval binds the immutable snapshot revision, canonical root identity and original-file hashes. Existing unversioned-root checkpoints require explicit project confirmation and baseline validation. Changes in host originals remain conflicts.

`/workspace` opens host review after the current response completes. Continue coding retains the same agent, draft and transcript. Inline tool approval remains host controlled; commands and diffs retain formatting and added/removed markers. Compute expiry disables inference while saved work remains reviewable.

Recognized official DeepSeek Flash supply refreshes conservative tariff qualification automatically from bounded official evidence. Owner refresh is available in provider controls or `provider tariff-refresh NODE_ID --duration 3600`. Custom supply keeps manual qualification. Accepted session tariffs and capabilities remain immutable; thinking is provider opt-in and starts off for buyers. This private alpha version does not enable npm publication or public admissions.


## Private alpha.20

Stopped sessions can be hidden from My sessions and restored from Deleted. This changes buyer-account visibility only; saved work, receipts, holds and pending settlement remain available. Stop active sessions separately. The CLI supports `sessions --view deleted` and `session delete|restore SESSION_ID`.

Authorized API and Self-hosted are the supply choices. Router-owned generated presets offer DeepSeek and MiMo with editable exact model IDs; Custom OpenAI-compatible setup exposes bounded authentication, output-token, streaming-usage and thinking controls. The provider enters the opaque key only inside the guest. Accepted connector/tariff/capability settings remain bound to the session. Unknown outcomes are held without replay or guessed settlement.

Host approvals keep Deny/Allow/Details below the scrollable preview, default to Deny and reset their owned terminal cells on repaint. Page Up/Page Down scroll previews or contextual descriptions; F opens full contextual details. The pinned runtime supplies tool syntax highlighting and cell widths, with monochrome support. Provider activity polls every five seconds while visible, with uptime each second; legacy usage totals show unavailable.

Private alpha.21 fixes forward from the retained alpha.20 artifact: provider connection labels use current owner-scoped activity instead of a cached node lease. Current activity owns active session references. Uppercase F opens details while lowercase f remains available for filtering.

Private alpha.22 also preserves the selected list row on short terminal windows; descriptions collapse first, and action visibility takes precedence when there is insufficient room for both overflow markers.

### Authorized Chat Completions gateways

Choose **OpenAI-compatible API gateway** and enter the full Chat Completions URL
and exact model ID (including a namespace such as `vendor/model`). Setup preserves
both values and reviews the authentication header, output-token field, final-usage
mode, thinking control and reasoning-history setting before creating a listing.
Back and Edit retain those settings. Keys are entered only inside the provider VM;
setup validation does not send an inference request.

The version-1 subset supports `bearer`, `api_key`, `x_api_key` or `none` authentication;
`max_tokens` or `max_completion_tokens`; `include_usage` or native final usage;
and `none`, `type` or `reasoning_effort` thinking controls. Coding requires text SSE,
function tools and actual final input/output token counts. Reasoning history uses
`reasoning_content`; structured/signed reasoning envelopes are unsupported and fail
closed. Missing usage, incomplete tools and partial streams never authorize tools
or invent accounting. The client sends one request, follows no redirects and makes
no automatic model/endpoint fallback or inference retry. A gateway's own routing
and retry behavior requires separate evidence.

Capability qualification is specific to the endpoint, exact model and settings.
Advertise only verified capabilities, publish explicitly and qualify the tariff.
Thinking stays a manual provider opt-in and starts off for buyers. Provider screens
show the last request's validated HTTP status and failure code in memory, without
raw response bodies. Authentication and access errors require checking the key and
entitlement; changing thinking is not an authentication fix. Use the checklist in
[private acceptance](docs/private-mac-acceptance.md) before live qualification.


### Native metered API connections

New authorized-API setup uses the Router projection of pinned `@earendil-works/pi-ai@1.0.0`
(revision `a13d35a742c6ef8462812a28fbe1d8c8b7431c32`). Select a metered provider and one or
more models, then shared cumulative token/test-credit limits and per-request output limits.
Choose Built-in provider or Custom API, explicitly select offered models, and set shared
AdRouter credit/token limits. Compatible custom endpoints use supported Pi adapters; manual
model definitions work without discovery. Advanced settings contain URL, adapter, secret
header names, compatibility overrides and credit rates. Header values and API keys are
entered only in the guest and stored on its account/connection-specific disk. Saving
performs no inference. Metadata-only discovery never selects or publishes extra models.

Start runs bounded streaming, tool and final-usage checks under both shared allowances and
the independent upstream spending guard, then publishes immutable model listings. One node
and guest provide one execution slot across all selected models. A buyer's accepted model and
rates remain fixed for that session. Restarting or correcting saved configuration does not
reset consumed/outstanding allowances. Unknown checks and inference remain reserved; verified
teardown releases execution only. Simulated USD is informational and uses versioned catalog
prices separately from test credits and upstream spending authority.

Native `pi_native_v2` / `pi_context_v1` negotiation retains native tool data and opaque reasoning
signatures through a replay whitelist. Legacy single-model/self-hosted connections remain
supported. Older clients receive a compatibility error when attempting a native connection.
Version-1 records remain readable. Custom gateways are supported through the six
implemented Pi protocols; a different protocol requires its adapter. Subscription
capacity, OAuth and IAM supply remain excluded.

Account, Sign in, Repair, Sign out, Switch profile and Manage installations remain
accessible without a successful profile request. Sign-out locks the retained vault;
Disconnect API deletes guest credentials and disables serving without claiming upstream
key revocation. Neither login nor recovery automatically starts serving. Host diagnostics
and exports never include the credential disk.

Build the provider payload with `npm run provider:build`; it copies the locked dependency
closure and MIT attribution, and records file hashes. `verifyProviderRuntime()` checks installed
bytes before preparing a native guest. Router's `generate-pi-catalog.mjs` owns catalog generation;
its normal contract generator emits the client projection from committed source. Upgrades
require explicit package, integrity, revision, catalog and fixture updates.
