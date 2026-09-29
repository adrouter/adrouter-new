# AdRouter New

Development foundation for the AdRouter devnet inference marketplace. **This is
not a released marketplace client.** The package is private until release gates
are implemented and passed. No npm candidate or alpha release is available yet.

Current source includes Router-generated strict wire validators, pinned runtime
and guest-image identities, a Microsandbox adapter, explicit workspace imports,
reviewed export proposals, and a real two-VM synthetic inference feasibility test.
The test uses a deterministic local endpoint, not a model or a paid provider.

Marketplace APIs, authentication, production WSS relay, provider admission,
credential-broker integration, TUI, ledger, evaluation and devnet escrow remain to implement.
Existing AdRouter clients and hosted routes are unaffected.

## Enter a DeepSeek provider key

Run this yourself in an interactive terminal from the repository:

```sh
node bin/adrouter-new.mjs provider configure deepseek
```

Paste the key at the hidden prompt and press Enter. Ctrl+C cancels. The command
stores it at `~/.adrouter-new/providers/deepseek/api-key`, with file mode 0600
and directory mode 0700. This is a permission-protected local file, not encrypted
Keychain storage. It stays outside Git and both sandboxes. The command makes no
API call and never prints the key; do not put it in command arguments or chat.
Running the command again replaces this provider key atomically. The key is not
yet connected to a live broker or admitted marketplace listing.

## Develop

Use Node 22.14 or newer:

```sh
npm ci --ignore-scripts
npm run check
```

`adrouter-new --json doctor` verifies explicit runtime paths and hashes. Set
`ADROUTER_NEW_RUNTIME_EXECUTABLE`, `ADROUTER_NEW_RUNTIME_LIBRARY`, and
`ADROUTER_NEW_RUNTIME_HOME` to absolute paths for a dedicated runtime installation.
The matching Microsandbox 0.7.4 archive and binary/library hashes are in
`runtime/manifest.json`. The adapter never falls back to containers or host execution.
Do not select a shared runtime state directory for disposable feasibility tests.

```sh
node bin/adrouter-new.mjs --json doctor
npm run test:runtime
```

The runtime test requires Apple Silicon/Hypervisor.framework or Linux with real
read/write access to `/dev/kvm`. It downloads the pinned public Node OCI image when
missing, creates two bounded guests, and removes those guests after the run. It
writes metadata-only evidence to `output/runtime-feasibility.json`. Synthetic
credentials never come from the operator's environment. No actual provider secrets,
wallets or original project are imported. Do not confuse this test with installed
candidate, metered provider, Solana or release acceptance.

Local broker guests use deny-all networking plus exact host TCP ports under the
single-tenant profile. The runtime's multi-tenant profile forbids host access even
when a sandbox rule allows it. Offline guests retain that profile. Neither profile
opens general host/LAN access. Production broker authorization is still required.

Workspace imports accept explicit regular files only, reject hidden/sensitive paths,
symlinks, hard links and archives, and enforce size limits. Export proposals bind
reviewed contents to the original hashes. Approval is one-use and returns artifacts;
this foundation does not apply edits to original files. Host-side concurrent path
replacement still needs a descriptor-relative import design before adversarial release.

## Contract provenance

`src/generated/` is generated from committed Router source and generator revisions
recorded in `provenance.json`. Do not hand-edit generated files. In the owning Router
checkout, run:

```sh
node backend/scripts/generate-marketplace-contract.mjs /absolute/path/to/adrouter-new/src/generated --check
```

Remove `--check` only when intentionally regenerating from committed source. Local
integrity checks do not replace cross-repository drift verification. Initial wire
types are a foundation, not a claim that corresponding API routes are mounted.

## Scope and release

Only `authorized_api` and `self_hosted` using `inference_connector_v1` may launch.
Credentials remain provider-side; model engines stay outside the connector VM;
buyer tools stay inside the buyer VM. See [requirements](docs/requirements.md) for
F01–F18, B01–B52 and the acceptance map. Gates in `release-policy.json` are planned
requirements, not yet a working release pipeline.

Release requires clean immutable artifacts, actual Mac and Linux/KVM installed
candidate acceptance, devnet funding/refund evidence and recorded deployments.
Candidate precedes alpha; existing packages and stable/latest channels remain separate.

MIT. Microsandbox is an external Apache-2.0 runtime; Node container images carry
their upstream licenses. No legacy CLI code has been copied in this foundation.
