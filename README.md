# adr-cli · adr-v2

Runnable terminal surface for listing permitted inference capacity and browsing
listings. Uses test credits with no cash value. This package is private and has
not been published. Existing clients and credential directories are not imported.

## Run locally

Use Node 22.14 or newer. Start the explicit development backend from the Router
feature checkout:

```sh
cd /Users/ahmadzuhri/antigravity/3days/.worktrees/router-v2-mvp1/backend
npm run marketplace:local
```

It binds `127.0.0.1:8790` and begins with empty, ephemeral inventory. This local
entrypoint is separate from the hosted service; it has explicit development actors
and never loads a database or seeds real usage.

In another terminal:

```sh
cd /Users/ahmadzuhri/antigravity/3days/adrouter_release/adrouter-new
node bin/adr-cli.mjs --local --actor provider
```

The arrow-key menu offers **Choose compute** and **List compute**. Enter only
public listing metadata. A draft needs source review before publication. Local
review can be exercised in a separate terminal:

```sh
node bin/adr-cli.mjs --local --actor admin admin pending
node bin/adr-cli.mjs --local --actor admin admin approve NODE_ID --review local-test-only
node bin/adr-cli.mjs --local --actor provider provider publish NODE_ID
node bin/adr-cli.mjs --local market
node bin/adr-cli.mjs --local market inspect LISTING_ID
```

Replace the IDs with returned identifiers. Local approval is synthetic development
state and does not establish permission to resell any upstream service.

Noninteractive creation and browsing:

```sh
node bin/adr-cli.mjs --local --actor provider --json provider create \
  --name 'My permitted compute' --model MODEL_ID \
  --endpoint https://PROVIDER_HOST/v1/chat/completions \
  --supply authorized_api --rights AGREEMENT_REFERENCE \
  --input-rate 1000 --output-rate 2000
node bin/adr-cli.mjs --local --json market --model MODEL_ID
```

Only `authorized_api` and `self_hosted` are accepted. Rates are integer test-credit
units per million tokens. Published revisions are immutable; pausing removes a
listing from discovery. Public listings exclude endpoints, owner identity and
credentials. Unknown metadata fields are rejected.

## Hosted sign-in and lifecycle

After the Router migration and deployment have been approved and completed:

```sh
node bin/adr-cli.mjs --network https://api-staging.adrouter.co login
node bin/adr-cli.mjs whoami
node bin/adr-cli.mjs market
node bin/adr-cli.mjs logout
```

The CLI prints a browser approval URL and comparison code. Open it in native
Safari and complete Google sign-in yourself. Marketplace installations have buyer
and provider scopes distinct from legacy clients. The installation key and rotating
authentication material use mode-0600 storage under `~/.adr-v2`; upstream provider
keys are never stored there. Refresh and paid requests are not replayed after an
unknown network outcome. An interrupted refresh is marked uncertain on disk; resolve/revoke that installation before re-enrollment. A process interrupted while holding auth.lock requires operator recovery after confirming no other adr-cli process is running. Logout revokes the installation before clearing local state.

## Foreground provider serving

Use the pinned Microsandbox runtime with absolute `ADROUTER_NEW_RUNTIME_EXECUTABLE`,
`ADROUTER_NEW_RUNTIME_LIBRARY`, and `ADROUTER_NEW_RUNTIME_HOME` paths. Select a
dedicated runtime home. `doctor` verifies executable/library identities.

```sh
node bin/adr-cli.mjs --local --actor provider provider serve NODE_ID --max-calls 1 --max-output 1024
```

Run this yourself with an approved endpoint and bounded upstream-spending authority.
The hidden prompt holds the API key only in foreground memory. Re-enter it after
restart. Self-hosted loopback engines without authentication may use `--no-key`.
No existing saved provider key is read or migrated. Provider mode does not inspect
the working directory.

The host connects outbound to the WSS relay. A separate connector VM receives a
one-use capability for one exact request. Only the fixed broker adds upstream
authentication. Model engines remain outside the VM. Redirects, arbitrary headers,
credentialed URLs, private remote destinations and provider-side tools are rejected.
A serving invocation is limited to 1–30 calls, explicit output bounds and nine
minutes. Stop with Ctrl+C. Cold activation and sandboxed evaluation are not integrated.

## Test-credit sessions

```sh
node bin/adr-cli.mjs --local --actor admin admin grant --user local-buyer --amount 1000
node bin/adr-cli.mjs --local connect LISTING_ID --budget 100 --max-output 1024
node bin/adr-cli.mjs --local sessions
node bin/adr-cli.mjs --local session inspect SESSION_ID
node bin/adr-cli.mjs --local session stop SESSION_ID
node bin/adr-cli.mjs --local receipts
```

Accepting a quote requires a separate confirmation or `--accept`. The provider must
be online. One session occupies a node. Each inference reserves its worst-case
charge before dispatch; uncertain outcomes retain the liability for operator
reconciliation. Stop/expiry release known unused credits once. `session resume`
restores status and ordered events without replaying inference or tool actions.

The bounded inference HTTP/relay path exists, but the buyer agent and coding tools
are **not yet integrated into the terminal**. `connect` reserves a session; it does
not start an agent. The network reports `agentExecution: not_enabled`.

## Verification and limits

```sh
npm ci --ignore-scripts
npm run check
node bin/adr-cli.mjs --local --json doctor
```

The generated contract is pinned to committed Router source. Verify cross-repository
consistency with the Router generator's `--check`; never edit `src/generated` by hand.
Runtime/image identities remain in `runtime/manifest.json` and `runtime/guest-images.json`.
`npm run test:runtime` is the existing real two-VM synthetic feasibility test, not
live-provider or release acceptance. The new broker path still needs actual VM,
provider, Linux/KVM and separate-host staging acceptance.

Workspace import/export helpers remain a feasibility layer with one-use review.
They do not yet implement the planned full buyer execution, additions/deletions or
race-resistant host application. Pi components have not been vendored. No runtime
installer, automated benchmark, diagnostics exporter or release pipeline is claimed.

MIT. Microsandbox is an external Apache-2.0 runtime; Node images retain upstream
licenses. Package ownership and publication require separate release checks.
