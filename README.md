# adr-cli · AdRouter test-credit marketplace

Private Mac owner-evaluation implementation for the test-credit marketplace. Test credits have no
cash value and are independent of legacy AdRouter balances. The package remains
private; no candidate or alpha has been published from this work.

## Terminal application

Use Node 22.14 or newer. Run `node bin/adr-cli.mjs` for the branded TUI. Native
Safari opens only after the explicit sign-in action on macOS. Marketplace device
approval is separate from other AdRouter clients. Operator sign-in requests only
`marketplace:operator` and also requires a current owner/operator account role.
JSON command compatibility remains available with `--json`; see `--help`.

The TUI covers listing creation and source review, hot/cold provider control,
provider cumulative budgets, marketplace account/session/receipt views, buyer
execution, runtime installation/verification, and operator evaluation/tariff and
uncertain-outcome reconciliation. Runtime paths selected or installed through the
TUI are saved as non-secret paths and reverified before reuse. Workspace import requires Python 3 for
anchored directory-descriptor reads on macOS and Linux.

For explicit ephemeral development only, start `npm run marketplace:local` in the
Router feature checkout's backend, then `node bin/adr-cli.mjs --local`. Development
identities are labeled; local approvals and grants establish no hosted authority.

## Separate profiles

Use two terminals under the same backend owner account:

```sh
adr-cli --profile provider --network https://api-staging.adrouter.co
adr-cli --profile operator --network https://api-staging.adrouter.co
```

Choose Profile in the TUI to select default/provider/operator or a named profile.
Each named profile starts without credentials and requires its own Safari approval.
Private keys, refresh state and locks are isolated; credentials are never copied.
The default retains its original `~/.adr-v2/installation.json` location. Named
profiles use `~/.adr-v2/profiles/NAME/`; sign-out affects only the selected profile.
Keep provider operation open while using the operator terminal. Menus follow the
installation's granted scopes. `--profile operator login` requests operator scope;
`--profile provider login` requests provider scope only.

## Provider operation

Choose a preset, edit public metadata, and supply a non-secret authorization
reference. The DeepSeek preset uses the documented `deepseek-flash` request identifier. The official DeepSeek connector disables
thinking explicitly because the marketplace wire contract carries text/tools,
not reasoning history (see [DeepSeek thinking mode](https://api-docs.deepseek.com/guides/thinking_mode)). Test-credit prices are separate from USD upstream
cost. Source approval and a qualified, versioned upstream tariff are required.

The guided flow verifies or installs the runtime, sets limits, waits for source approval,
publishes the listing, and then attaches the guest console. Back/Cancel retain
in-progress form values during the session; submitted drafts remain on the backend.
The original jellyfish panel uses a compact `adr v2` header when space is limited.

Set a cumulative spending cap explicitly in USD (up to six decimal places). It covers all your nodes, installations
and restarts. Consumed spending and uncertain liabilities are never reset by a
restart or timeout. Increases require confirmation and a matching revision.
The independent USD 10 ceiling is only for live acceptance testing.

Hot setup warms a pinned VM before publication or readiness. The terminal attaches
directly to hidden input inside that VM. After key entry, press Ctrl+D when the
guest says it is ready to return to the dashboard. The host JavaScript application
never reads the upstream key. Credentialed HTTP and TLS run in the guest; the host
forwards encrypted bytes to the one approved destination. There is no general
CONNECT proxy. Keys are never placed in files, argv, environment or snapshots.

Cold operation keeps control online. A reservation raises an activation choice in
the provider dashboard with a 120-second deadline. Launch the guest and enter the
key before that deadline. Expiry releases credits without an inference charge.
Keep the foreground TUI open. Back returns to its menu while serving continues;
Stop or Exit tears down owned guests. A later start requires key entry again.

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
provider acceptance. This milestone needs the non-secret supply reference,
separate browser approvals, a real key entered only inside the guest, and reviewed
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
