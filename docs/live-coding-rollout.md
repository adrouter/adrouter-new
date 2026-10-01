# Private ADRv2 coding rollout

This is a private Apple Silicon preparation and acceptance path. It does not
publish npm channels, qualify Linux/KVM, open general admissions, execute chain
payments, or establish adoption/revenue. Real two-account acceptance remains a
separate operator test after installation and staging verification.

## Retained-feature acceptance matrix

The reproducible source is `adrouter/adrouterCLI` at
`be7c53dc0b63fb90b70bd6cb7cad4d5713cc0d1a`. `npm run coding:build` extracts only
committed source, applies the recorded marketplace adaptations, builds it, runs
377 retained coding checks and the upstream TUI suite, and records every packaged
file hash, adaptation and license in `coding-runtime/provenance.json`. The old CLI
installation is not used by the coding guest.

| Retained behavior | Implementation and verification |
| --- | --- |
| Read/edit/write/bash/grep/find/ls, diffs and bounded output | Pinned tool definitions and mutation queue; retained tools tests; actual guest read/write/bash/Python/Git/ripgrep and reviewed add/modify/delete application |
| Cancellation and fresh approvals | Pinned process-group shell teardown/presence; host action digests and one-use approval; runtime cancellation, denial and cleanup tests |
| Streaming, fragmented tool calls, supported thinking | Negotiated `coding_v1`; SSE and NDJSON parsers; final schema/name/snapshot validation; byte-fragmentation and relay/HTTP tests |
| Multiline editor, file references, completion, history, queued follow-ups | Pinned InteractiveMode and TUI; editor/autocomplete/history tests; actual guest PTY and follow-up acceptance |
| Keybindings, themes, terminal restoration | Pinned TUI resources; complete TUI suite and exact actual PTY terminal comparison |
| Save/resume, new/name, tree, fork/clone, import/export | Pinned SessionManager/AgentSessionRuntime; tree/context/file-operation tests; private snapshots and actual resume without paid/tool replay |
| Manual/automatic compaction | Pinned compaction algorithms/extensions; retained compaction tests; the registered marketplace stream shares the session dispatch/budget ceiling |
| Trust, instructions, skills, templates, settings, extension discovery/reload | Reviewed manifest import; pinned resource loader/trust/skills/templates/extension tests; trusted project resources execute only inside the VM |
| Subagents, chains, parallel, BTW and cache diagnostics | Retained bundled manifests and registration checks; guest entrypoint adaptations; host child grants enforce three children and one mutation-capable child; inference queues in one session slot |
| Web retrieval | Retained parser/cache behind credential-free host retrieval with DNS/redirect/private-address checks and fresh approval |
| Print, JSON and RPC | `code SESSION_ID --workspace PATH --trust --mode print|json|rpc`; pinned mode implementations; retained RPC JSONL checks and actual guest print acceptance |
| Presence | Pinned session presence boundaries; acknowledgements remain separate from tool approval; headless modes report attention-required |
| Clipboard and external editor | Explicit narrow host bridges; content-bound approval before host access |
| Explicit sharing | `/share` reviews private conversation content, then asks separately before creating a secret GitHub gist; no automatic sharing |
| Additional dependencies | Approved npm registry broker; fixed public origin, integrity-preserving tarballs, bounded retrieval, no host credential forwarding; install scripts default disabled |
| Review and Apply, export and recovery | Hash-bound proposals, anchored directory descriptors, all-original preflight, per-write recheck and durable private journal; add/modify/delete, denial and conflict tests |

Images remain unavailable on the current connector. Thinking is enabled only for
a listing declaring its supported thinking capability. Paid search remains
disabled without separately configured credentials, tariff and spending authority.
Marketplace authentication does not grant access to a search provider.

## Install and test

The preparation receipt records the exact private tarball, source SHA and
integrity. Install that artifact through its isolated prefix; do not install an
npm alias or publish it. Existing provider/buyer installations retain their
independent authentication and profile state.

```sh
# Terminal 1
adr-cli --profile provider --network https://api-staging.adrouter.co

# Terminal 2
adr-cli --profile buyer --network https://api-staging.adrouter.co
```

Provider: choose List compute, confirm the exact supply/model/endpoint, credit
prices and cumulative upstream cap, publish metadata, review its current
conservative tariff, and start the guest. Enter the provider credential only in
that guest console. The provider dashboard stays open while serving. Hot · Ready
requires the guest, authenticated relay and fresh backend lease together.

Buyer: browse the hot listing, review its capabilities/pricing, explicitly accept
the bounded coding quote, and complete its no-inference handshake. Choose the
project, review the import manifest, approve reviewed executable resources, then
enter the coding interface. Quote duration and all inference purposes share the
accepted time/dispatch/credit allowance. Renewal and provider changes always need
fresh acceptance.

For live acceptance, inspect a project, edit multiple files, add/delete files,
run tests, send follow-ups, exercise a skill and bundled extensions, and use
Review and Apply. Also exercise save/resume, cancellation, provider disconnect,
receipts and remaining balances. Record only source/artifact/deployment and
listing/session/request identities plus outcomes; never prompts, outputs, keys
or private project contents in workspace evidence.

## Private storage and recovery

Coding snapshots and journals are private under
`~/.adr-v2/profiles/<profile>/coding/`. They contain workload content and must not
be copied into release receipts. Resume restores context and workspace artifacts
without replay. Expired/uncertain marketplace authority needs reconciliation or
a new explicitly accepted quote. Changed host originals cause a conflict.

Interrupted application reports its completed files and private journal. Use
Recover interrupted application only after reviewing the exact journal-bound
contents. Recovery never overwrites an unrelated intervening edit.

On failure, stop new coding admissions and drain execution. Preserve unresolved
financial reservations, including the historical USD 0.002075 liability; never
replay its request. Drain the single relay before restoring the receipt's prior
immutable staging image. Keep migrations, Pages and protected policies intact.
The receipt records both package and application recovery identities.
