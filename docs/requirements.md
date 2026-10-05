# MVP 1 requirements and blocker register

This is implementation scope, not evidence of deployed or released functionality.
The operator's implementation plan and MVP 1 sheet override the broader baseline.

Only `authorized_api` and `self_hosted` are eligible; every source uses
`inference_connector_v1`. Permission review covers the actual arrangement and endpoint,
not merely key possession. API wrappers do not make subscriptions eligible. Provider
credentials stay in a host broker. Model engines stay outside the connector VM.
Buyer tools run only in copied buyer workspaces. No provider-side buyer execution.

Apple Silicon acceptance comes first, followed by real Linux x86-64/KVM. The terminal
product has its own repository, executable, state and package identity. Mainnet,
consumer subscriptions, harness supply, buyer_byo_tool and guest GPU inference are
out of scope. Existing Web/CLI/Agent functionality remains compatible on legacy routes;
new marketplace client work belongs to this repository and Router browser handoffs.

## F01–F18 retained mapping

All rows below remain required unless tightened above. Current source is only the
initial contract and runtime feasibility layer; no row is certified complete.

| ID | Function | Implementation | Acceptance |
| --- | --- | --- | --- |
| F01 | Providers list available compute | Provider account, node registration, inventory proof, immutable listing revisions, capacity window, supported model configuration, tariffs and limits | Only admitted providers can publish; every purchasable listing has an active capacity record and versioned terms |
| F02 | Hot listings | Live outbound connector, readiness probes, current evaluation, atomic capacity reservation | Stale heartbeat removes immediate-purchase eligibility; successful purchase reaches a ready inference endpoint |
| F03 | Cold listings | Funded reservation triggers provider notification/daemon activation; visible activation deadline | No unfunded browsing action boots paid compute; missed activation deadline refunds buyer and releases inventory |
| F04 | Local provider VM and network connection | Signed runtime image, per-session connector VM, outbound-only session tunnel | Provider exposes no inbound management port and buyer cannot invoke a shell on provider hardware |
| F05 | Preliminary benchmark verification | Cached capability profile plus activation checks; first-use cold inventory can be explicitly provisional and certified after funding but before billable use | Failed/stale certification is not labeled verified; smoke test is not represented as a fresh full evaluation |
| F06 | Buyer VM ↔ provider VM through AdRouter | Buyer workspace VM → typed relay protocol → provider connector VM; inference-only messages | Session identity, limits and authorization enforced at each hop; no general network bridge |
| F07 | Sandbox both computers | Disposable buyer workspace copy, explicit file import/export, provider connector confinement, egress/resource restrictions | Escape/containment tests fail closed; no host home directory, wallet seed, SSH directory or Docker socket mounted |
| F08 | Either party may terminate | Immediate admission stop and best-effort upstream cancellation, bounded settlement, reviewed penalties | Stop never requires counterparty approval or waiting for a chain transaction |
| F09 | Deposits discourage disruption | Buyer prepaid spending cap; separately locked provider performance bond; disclosed startup/reservation charge | Normal PAYG completion does not lose a punitive deposit; collateral cannot secure unlimited concurrent commitments |
| F10 | Partial listing purchase | Allocate a bounded output quota or spending allowance and an appropriate concurrency slot from remaining capacity | Concurrent purchases cannot reserve more quota, concurrency, budget, or bond than exists |
| F11 | Early completion | Close session; bill governed usage/startup charges; refund remaining escrow | Repeated close/refund requests are idempotent and unused balances reconcile |
| F12 | Simpler non-harness supply | Endpoint connector for provider-owned local inference or specifically permitted upstream API supply | Provider credential remains on provider side; no buyer code or arbitrary proxy destination accepted |
| F13 | Random testing of unused live capacity | Opt-in, budget-capped idle evaluation queue; paid work preempts tests | Buyer is never billed for maintenance evaluation; no cold model is awakened solely for idle checks |
| F14 | Capability categorization | Domain scorecards, uncertainty, sample size, evaluation version, performance and freshness | Unsupported tests display unavailable; no invented global intelligence or model-authenticity guarantee |
| F15 | Provider incentives | Fulfilled paid usage, independently qualified buyers, reliability and measured quality; bounded fee rebates/points | Mere listings/views do not mint rewards; rewards are reversible during fraud review |
| F16 | Users choose compute | Search/filter/compare, visible startup delay and trust labels, exact listing selection or constrained auto-routing | Buyer price, region, model and privacy constraints are hard filters, not suggestions |
| F17 | Marketplace on Solana | USDC escrow, provider bond, final settlement/refund and receipt commitments | Devnet end-to-end first; real-money release requires security and jurisdictional sign-off |
| F18 | Future autonomous agents | Same machine-readable marketplace API and SDK, human-funded session caps, scoped agent credentials | Agent can consume/select within approved scope but cannot withdraw, expose seeds, or expand its own budget |

## B01–B52 retained register

All gates remain open until explicit evidence is recorded. B07 has been narrowed to
connector compatibility; GPU passthrough is not an MVP dependency.

| ID | Priority | Failure | Mitigation and gate | Owner |
| --- | --- | --- | --- | --- |
| B01 | P0 | Seller lacks permission to sell upstream capacity | Inventory-class legal/contract review; written permission where necessary; reject disallowed supply | Product/legal |
| B02 | P0 | Business depends on evading subscription/automation limits | Do not build evasion; prove sufficient owned or authorized supply first | Founder |
| B03 | P0 | No buyers at sustainable prices | Run real paid or credible price-tested tasks and compare like-for-like alternatives | Product |
| B04 | P0 | Relay, benchmarks, support and refunds consume the marketplace margin | Contribution-margin model and measured pilot costs; cap subsidies and minimum economical session size | Product/finance |
| B05 | P0 | Malicious provider can see or retain buyer data | Honest trust labels, non-sensitive pilot, contracts/data policy; separate confidential-inference design if required | Security/legal |
| B06 | P0 | Provider or buyer escapes sandbox or reaches host secrets | Independent containment review, patched images, scoped mounts, host hardening and red-team tests | Systems/security |
| B07 | P0 | Connector/runtime/endpoint combination does not work inside the promised boundary | Certify the inference_connector_v1 endpoint boundary on Apple Silicon and Linux/KVM; guest GPU inference is deferred | Systems |
| B08 | P0 | Smart-contract authorization/arithmetic/account bug loses funds | Minimal contract, adversarial tests, independent review, capped exposure and incident controls | Chain/security |
| B09 | P0 | Operator oracle can fabricate usage or unjustly slash bonds | Publish trust model, separate keys, bounded amounts/destinations, checkpoints, review/appeal, audit log | Backend/security |
| B10 | P0 | Funds become indefinitely locked on missing parties/operator | Permissionless governed expiry, bounded claim/dispute windows, deterministic fallback tests | Chain |
| B11 | P0 | Unknown payment/custody/token-service classification | Determine entity and serving jurisdictions; specialist legal assessment before mainnet | Legal |
| B12 | P0 | Sanctions, AML, age or provider-identity obligations not met | Jurisdiction-specific onboarding and controls; wallet ownership is not sufficient identity evidence | Legal/ops |
| B13 | P0 | Privacy/cross-border obligations incompatible with peer hosting | Data-flow map, applicable agreements and retention/location controls; exclude unsupported sensitive workloads | Legal/security |
| B14 | P0 | Existing simulated wallet or ad savings become unbacked cash liabilities | Separate legacy analytics/promotional credit/real-money ledgers; no automatic conversion | Backend/finance |
| B15 | P1 | Cold machine is offline or asleep and cannot receive activation | Always-on control daemon or human acceptance with explicit deadline; automatic refund on no-show | Systems/ops |
| B16 | P1 | Cold startup too slow or costly | Pre-stage images/weights, measure actual load time, minimum disclosed fee and per-listing deadlines | Systems/product |
| B17 | P1 | NAT, firewall, ISP/CGNAT or relay connectivity failure | Outbound authenticated relay, reconnect bounds and region-aware admission | Network |
| B18 | P1 | Provider overbooks quota, rate limits or collateral | Transactional reservations, capacity heartbeats, tested concurrent limits and bond allocation | Backend |
| B19 | P1 | Electricity, thermal throttling, upstream limits or device sleep invalidate availability | Scheduling, health metrics, stale-state demotion and reliability-based limits | Provider ops |
| B20 | P1 | No comparable meter across tokenizers, caching, hidden reasoning or upstream APIs | Canonical permitted tariff per profile; explicit unsupported surcharges and normalization tests | Metering |
| B21 | P1 | Buyer withholds acknowledgment; provider bills undelivered work | Chosen delivery contract, small unpaid windows, signed operator receipts and bounded disputes | Backend/product |
| B22 | P1 | Budget overshoot during concurrent streams/cancel | Worst-case per-request reservation; atomic ledger; limit output before dispatch | Backend |
| B23 | P1 | Unsupported tools, JSON, multimodal, context or thinking behavior | Capability conformance suite and hard routing filters; do not equate compatibility labels with equivalence | Protocol |
| B24 | P1 | Retry repeats a command, payment or partially emitted response | Idempotency, separate inference/tools, explicit replay policy and manual recovery after ambiguity | Backend/clients |
| B25 | P1 | Model identity or configuration substitution | Declared-versus-observed labeling, versioned manifests and drift tests; do not promise cryptographic identity | Evaluation |
| B26 | P1 | Benchmark gaming, contamination or recognizing probes | Fresh holdouts, production-shaped checks, observed-task evidence and honest uncertainty | Evaluation |
| B27 | P1 | Invalid adaptive rankings or misleading certainty | Fixed comparable anchors, justified sequential method, domain coverage and inconclusive result | Evaluation/statistics |
| B28 | P1 | Benchmark API does not provide required logprobs | Capability probing; compatible task protocols; no silent reinterpretation of official scores | Evaluation |
| B29 | P1 | Dataset/tool/model licensing or gated access prevents tests/hosting | Asset-specific permission register; replace unavailable assets or exclude the track | Legal/evaluation |
| B30 | P1 | Executing generated benchmark code compromises infrastructure | Separate evaluator sandbox, no network/secrets, strict CPU/memory/time limits | Security/evaluation |
| B31 | P1 | Evaluation costs or idle tests consume sellable capacity | Opt-in budgets, paid-traffic preemption, cached revision scores and separate test-cost ledger | Evaluation/ops |
| B32 | P1 | Wash trading, fake buyers, referrals or advertising impressions farm rewards | Delayed/reversible capped rewards, linkage checks, manual review and no raw-listing payouts | Fraud/product |
| B33 | P1 | Cancellation fees deter buyers or bonds deter small providers | Distinguish normal completion from breach, publish maximum loss, tune economics with real pilot demand | Product |
| B34 | P1 | Program/RPC outage, duplicate events or stale finality | Multiple monitored RPC paths as needed, finality policy, idempotent indexer and reconciliation | Chain/ops |
| B35 | P1 | Wrong cluster, counterfeit mint, decimals or account rent surprise | Pin program/mint/cluster, integer arithmetic, explicit fee/rent policy and wallet transaction explanation | Chain/clients |
| B36 | P1 | Token issuer freeze/depeg or inability to acquire gas | Exposure limits, explicit asset risks, bounded gas sponsorship, no instant-refund guarantee | Finance/chain |
| B37 | P1 | Signing/upgrade key compromise or supply-chain tampering | Separate/revocable keys, multi-party controls, signed/pinned builds, SBOMs and rollback | Security |
| B38 | P1 | Prompt injection/SSRF/malware/abuse turns network into an open proxy | Typed inference-only protocol, egress controls, host-service allowlists, quotas and abuse process | Security/ops |
| B39 | P1 | Existing clients/repos drift or backward compatibility breaks | Versioned protocol, capability negotiation, baseline contract tests and staged feature flags | Clients/backend |
| B40 | P1 | Docs claim endpoints/features not active in source/deployment | Establish executable contract source of truth and test documentation against deployment | Engineering |
| B41 | P1 | Cross-platform installer privileges, signing or microVM prerequisites fail | One certified launch profile; setup doctor; signed updates; no insecure fallback | Systems/clients |
| B42 | P1 | Lost artifacts, corrupt snapshots or conflicting patch application | Copy-first workspace, protected artifact store, manifest checks and review/conflict workflow | Clients |
| B43 | P1 | Agents leak seeds or autonomously increase spending | No wallet keys in VM; narrow expiring session capabilities; human approval for new funding authority | Security/agents |
| B44 | P1 | Too many services/roles for available team | Modular core plus relay/worker, dependency-based milestones and smallest usable vertical slice | Engineering lead |
| B45 | P1 | Dispute/support costs exceed revenue or resolution capacity | Objective policies, evidence minimization, bounded exposure and staffed operator queue | Ops/product |
| B46 | P1 | Model/output/IP misuse, tax and liability allocation unclear | Provider/buyer terms, model license checks, records/invoices and jurisdiction-specific advice | Legal/finance |
| B47 | P2 | End-to-end encryption conflicts with trusted relay metering | Keep MVP trust explicit; research attested meters or different settlement evidence before changing claims | Security/research |
| B48 | P2 | P2P routing loses relay evidence and increases connectivity exposure | Defer direct P2P; design fallback and separate proof/receipt scheme first | Network/security |
| B49 | P2 | Moving state across providers causes context/tool/cache errors | Session pinning; explicit export/restart; no invisible migration | Protocol/agents |
| B50 | P2 | Reputation is portable but leaks private relationships or is Sybil-prone | Minimal public aggregates, no sensitive transaction details, revocable claims and explicit confidence | Privacy/fraud |
| B51 | P2 | Native token, NFTs, exclusivity or financing add speculative/regulatory scope | Defer until the compute market has demonstrated demand and positive economics | Product/legal |
| B52 | P2 | Enterprise SLAs and confidential workloads exceed peer-device guarantees | Exclude from initial claims; certified provider tiers and separately validated confidentiality later | Product/security |

## Boundary acceptance map

| Check | Required evidence | Current coverage |
| --- | --- | --- |
| 1. Authorized API hot/cold | Admission, activation, governed inference/refund | Schema only |
| 2. Self-hosted hot/cold | Endpoint, engine activation, capacity/refund | Schema only |
| 3. Subscription and harness supply rejected | Every admission surface | Schema unit tests only |
| 4. API-shaped subscription wrappers rejected | Actual source review | Not implemented |
| 5. Future/unknown classes rejected | API, DB, SDK, evaluator, relay | Generated validator tests only |
| 6. Unsupported connector profile rejected | Every admission surface | Schema unit tests only |
| 7. Destinations/headers rejected | Broker and relay boundaries | Envelope tests; fixture broker |
| 8. Remote commands/browser/provider tools rejected | Production protocol | Envelope tests only |
| 9. Seeded credentials excluded | Buyer/relay/log/export/receipt/chain | Local synthetic wire fixture passed; receipt/chain pending |
| 10. Revocation before dispatch | Fresh authorization and scope separation | Not implemented |
| 11. Partial purchase/cancellation | Atomic capacity and spending | Not implemented |
| 12. Early stop/refund | Finalized devnet funding and recovery | Not implemented |

## Baseline provenance

Baseline specification SHA-256: `ae7e6277b0a30da833350bada9d7507e806618752c1ff642752e60052fb7a953`.
The baseline table is retained with the stated overrides; original references and
proposals do not establish current provider authorization or deployment status.


## Inference interruption evidence — 6 October 2026

Provider inference failures retain their original stable code independently of buyer Stop, deadline expiry, provider connection loss and authority loss. Request/session/provider-run identifiers, accepted model/API, elapsed time, a bounded phase timeline, allowlisted transport codes, HTTP status and separate dispatch/response evidence travel in optional `failure_diagnostics_v1` metadata. Expanded buyer/session/provider views require `X-Adr-Failure-Diagnostics: 1`; providers send expanded relay metadata only after capability negotiation. Historical absence stays unavailable. Missing response headers do not prove a request was not sent.

Router stores evidence in existing request/session JSON records; no hosted schema migration or financial reconciliation is part of this repair. A primary provider failure cannot become cancellation merely because execution is subsequently stopped. Unknown inference remains held and is never replayed or zero-settled. Forged request/session/run/model bindings and unrestricted metadata fields are rejected. Public listing projections remain unchanged.

Buyer coding/session and provider workspaces expose summary plus Failure details. A private JSON export uses retained metadata without inference. Owner-only atomic profile records retain the primary failure and bounded timeline through teardown/reopening; cleanup and diagnostic-save failures remain separate. Prompts, responses, tool arguments/results, project files, credentials, headers, SDK messages, stacks and financial data are excluded.

The observed Flash/Pro failures belong to node 87fb7693-3462-4a5d-8c85-bccfc0f22f57, run 2f84c8e5-d5da-4e54-9ac8-0b6a814a8109. Metadata confirms first Flash and third Pro failures at 27/20 ms without recorded headers. Synthetic restricted-transport baseline requests pass; the initiating live cause remains unresolved until fresh diagnostic evidence demonstrates it. Private alpha.46 preparation and operator-only real acceptance remain distinct gates.

6 October: immutable alpha.46 failed its installed legacy provider startup gate because a static coding-wire import pulled Ajv into the dependency-free legacy guest. Preserve alpha.46 unselected. Alpha.47 fixes forward by loading failure validation only when reading a buyer error stream; runtime generation and exact installed gates must run again. The initiating live failure remains unresolved.
