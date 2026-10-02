# Plan: Ghostty approval keyboard recovery — 1 October 2026

## Goal
Arrow keys navigate host Deny/Allow reviews after the guest enables enhanced keyboard protocols. Preserve the active alpha.14 session and fix forward with private alpha.15.

## Context
The operator reports that arrows populate the search filter while Tab works. TerminalCoordinator returns input ownership to a host TerminalUI using Node's legacy readline parser, while the guest uses Kitty/modifyOtherKeys event reports. Alpha.14 buyer quotes/deletion and real coding already work.

## Research Summary
Per-repository graph and executable handoff/input code were reviewed. The locked coding runtime already includes Pi's complete-sequence StdinBuffer and enhanced key decoder. Primary Kitty protocol documentation confirms press/repeat/release events and terminal mode negotiation.

## Constraints
Keep current provider/buyer sessions, Router deployment, identities, bounds and immutable alpha.14 bytes. Do not read private workload/credential content or execute commands from the diagnostic screenshot. No Router or database change is needed.

## Out of Scope
Terminal preference changes, broad UI redesign, new dependencies, public publication/promotion and automatic host approvals.

## Reversibility
Use a new private version and isolated prefix; retain alpha.14 and switch only the launcher. Running alpha.14 processes continue until the operator finishes and checkpoints them.

## Step A: Input ownership and decoding
### Status
`in_progress`
### Tasks
- [ ] Use the locked enhanced-key decoder with a fresh complete-sequence buffer per host UI ownership period.
- [ ] Ignore release events and terminal reports; preserve text, arrows, Tab, Enter, Escape and Ctrl+C.
- [ ] Remove raw listeners and buffered partial input on stop; retain guest forwarding and terminal restoration.
### Validation Results
Not run.

## Step B: Regression and private artifact
### Status
`todo`
### Tasks
- [ ] Test fragmented CSI/SS3/Kitty/modifyOtherKeys keys, key releases, terminal reports, text filtering and repeated handoffs.
- [ ] Exercise host approvals with real PTY bytes and the actual packaged guest; run full client checks and CI.
- [ ] Commit clean source, pack alpha.15 once, verify installed source/runtime bytes, and switch the isolated launcher.
### Validation Results
Not run.

## Step C: Final verification and cleanup
### Status
`todo`
### Tasks
- [ ] Confirm operator eleven-minute idle/apply/finish outcomes without interrupting the current session.
- [ ] Ask the operator to reopen the buyer on alpha.15 only after saving and finishing alpha.14; verify Ghostty arrow navigation.
- [ ] Record sanitized outcomes and remaining gates; retain all prior artifacts and provider operation.
### Validation Results
Not run.

## Follow-up Work
Final real host application/cleanup and Ghostty acceptance require operator UI choices.

## Decision Log
| Date | Decision | Rationale | Impact |
| --- | --- | --- | --- |
| 2026-10-01 | Reuse the pinned input decoder | Guest and host must interpret the same protocol | No parallel ad-hoc key parser |
| 2026-10-01 | New alpha.15 artifact | Alpha.14 is immutable and actively running | No session disruption or overwritten bytes |

## Validation checkpoint

The host now uses the pinned complete-sequence/enhanced-key decoder, ignores key
release and terminal replies, and disposes its input listener/buffer on ownership
release. All 89 client checks pass. Actual Apple Silicon guest PTY acceptance with
enhanced host approval keys passes seven reviews and four follow-ups in 33 seconds
using synthetic inference, with terminal restoration. The controlled adversarial
PTY gate also passes enhanced navigation/default denial and output suppression.
These checks do not replace the operator's separate real provider/idle acceptance.

## Alpha.16 continuation: project-directory paste

The operator found that plain paste cannot edit project-directory fields. The
alpha.15 enhanced decoder recognizes legacy keys but did not forward their
printable text; whole bracketed paste with a trailing newline was rejected by
the single-line field. Fix legacy text forwarding, permit trailing clipboard
line endings in single-line pastes without interpreting them as Enter, and enable
bracketed paste while a form owns the terminal. Preserve internal controls as
non-executable input, field limits, cancel drafts and approval authority.

Validate actual raw typing, plain/bracketed/fragmented pastes, spaces, newline
handling, field replacement/append, rejection of multi-line/control payloads and
real PTY form entry. Re-run full client checks and package/provenance; build one
immutable private alpha.16 and switch its isolated prefix without disturbing
running sessions or the provider. No Router change is needed.

### Alpha.16 local validation

Legacy printable characters now reach text fields. Forms temporarily enable
bracketed paste and strip only trailing CR/LF from clipboard input; internal
control/multiline input remains rejected and cannot submit a form or approve an
action. All 95 checks pass. Real PTY plain and fragmented bracketed directory
paste, spaces, newline handling, numeric fields, default denial and terminal
restoration pass; enhanced approval PTY still passes. Installation and final
Ghostty project-path confirmation remain pending.


# Plan: Provider and coding-agent acceptance fixes — 2 October 2026

## Goal
Resolve the operator's alpha.17 findings and prepare an immutable private alpha.18 acceptance installation.

## Context
The operator confirmed automatic read, Deny, approved edit and command, eleven-minute idle, checkpoint saving and saved-context resume. Review and Apply failed. FD startup, terminal handoff, thinking controls and cost display need corrections. The operator explicitly waived npm login for this local live acceptance on 2 October; this is not standing publication policy.

## Research Summary
Source confirms missing bundled fd, export/host eligibility disagreement, legacy presence prompts, zero legacy USD display, hardcoded non-thinking listing capabilities and collapsed inference errors. Existing workspace/coding tests pass but miss the export disagreement. Fly, Pages, canonical GitHub branches/access and linked Supabase metadata access passed; Router rulesets API reports an account-plan limitation.

## Constraints
Preserve unrelated operator edits, all prior artifacts/identities/checkpoints, Pages, access/spending bounds and unresolved liabilities. No credential or checkpoint-content inspection, migrations, database reset, inference replay, publication or promotion. Source/runtime generation uses checked-in helpers and pinned committed inputs.

## Out of Scope
USD/devnet settlement, legacy-client changes, public access and unrelated refactoring.

## Reversibility
Use clean isolated source commits and a new private version. Preserve old installations and the recovery image. Switch the launcher only after installed VM/PTY acceptance.

## Step A: Scoped implementation
### Status
`done`
### Tasks
- [x] Bundle pinned fd and bound startup/build retrieval.
- [x] Share workspace eligibility and contextual action diffs.
- [x] Pin selected details; restore guest terminal modes and redraw.
- [x] Add provider thinking controls and render-only credit/error displays.
- [x] Remove marketplace presence prompts; wire provider stop shortcuts.
### Acceptance Criteria
- [x] Explicit approvals, accepted session bindings, cancellation and no-replay invariants remain intact.
- [x] No unrelated tracked/untracked work enters the release inputs.
### Validation Results
Owning-project source checks passed; client 112 tests and Router 49 marketplace/6 contract cases, authentication, typecheck/build passed.

## Step B: Final verification and cleanup
### Status
`review`
### Tasks
- [x] Run owning-project source, contract, authentication and runtime checks.
- [x] Freeze clean commits and verify exact private artifact/provenance and installed native VM/PTY behavior.
- [x] Preserve Pages and drain/replace the sole Router staging Machine if required.
- [ ] Record individual operator gates; live Review and Apply and thinking qualification remain pending until observed.
### Acceptance Criteria
- [ ] Reviewed host application succeeds; exclusions and conflicts do not damage originals.
- [ ] Native terminal controls survive approvals, Continue, resume and resize.
- [ ] Independent cleanup/accounting outcomes remain truthful.
### Validation Results
Installed 347-second enhanced PTY and 660-second provider lifecycle passed with synthetic inference. Ten serving modules matched; same staging Machine/closed admissions and 28 current Pages records verified. Operator live UI/Review and Apply/thinking rerun remains pending.

## Follow-up Work
Operator-only guest key entry and final real-provider Review and Apply/thinking rerun after synthetic preparation.

## Decision Log
- 2 October: credits now, USD deferred; terminal background for tool output; provider thinking opt-in and buyer thinking initially off.
- 2 October: preserve the historical undetermined incident, 6 charged / 94 refunded / zero reservation and USD 0.002075 liability.


# Plan: Private alpha.19 acceptance repairs — 2 October 2026

## Goal
Prepare immutable private alpha.19 with compute-independent saved work, stable inline host approvals and workspace transitions, readable tools, and automatic recognized-provider tariff qualification.

## Context
The operator supplied per-gate alpha.18 failures and explicitly requested implementation and private rollout. Use clean canonical clones `.reliability/client-ux` and `.reliability/router-ux`, branch `codex/adrv2-reliability-20261001`. Preserve earlier plan sections and unrelated original-checkout work.

## Research Summary
Kickoff Fly/app, Pages/project, canonical GitHub refs/push access, and linked active Supabase database query pass. Normal Fly registry authentication resolved the recovery-image lookup; index/platform digests match alpha.18. npm identity/scope checks fail E401 under the retained private-install waiver; no public publisher is enabled. Official DeepSeek pricing identifies peak cache-miss Flash input/output rates. Current Apply exports from the VM and live-status authorizes host actions; tariff renewal also compares inference to the node's latest tariff.

## Constraints
No schema migration, public publication, admissions expansion, inference replay, guessed settlement, secrets inspection or legacy source changes. Preserve identities, checkpoints, project, limits, original 6/94/zero reservation and USD 0.002075 liability; latest pending settlement remains separate. Generate contracts and runtime through owning committed sources/builders. Keep snapshot approvals bound to root identity, revision, original hashes and content.

## Out of Scope
Unrelated UI, legacy clients, public channels, payment reconciliation and database resets.

## Reversibility
Add checkpoint version support, preserve earlier immutable snapshots/installations and Fly recovery image. Freeze clean commits, replace the same drained staging Machine and switch launcher only after installed acceptance.

## Step A: Saved coding work independent of compute
### Status
`in_progress`
### Tasks
- [ ] Version immutable snapshots with root identity/revision; legacy project confirmation and baseline validation.
- [ ] Local Review/Apply/Export and journal recovery without session authority; preserve conflict/denial/one-use checks.
- [ ] Save before workspace departure/teardown and show actual compute versus saved-work availability.
### Relevant Files
Client `src/coding-buyer.mjs`, `src/workspace.mjs`, `src/tui.mjs`, workspace tests.
### Acceptance Criteria
- [ ] Running, expired, removed and pending-settlement compute all permit reviewed saved host application.
- [ ] Denial, changed originals, legacy confirmation, interrupted/repeated application are covered.
### Validation Results
Not run.

## Step B: Persistent coding terminal and readable presentation
### Status
`todo`
### Tasks
- [ ] Persistent agent/process and host-only approval panel with bounded suspend/resume acknowledgements.
- [ ] `/workspace`, existing exit workflow, same-process Continue and full runtime redraw/mode restoration.
- [ ] Green/red diffs, bordered formatted commands, stable tool/status styling and monochrome support.
### Relevant Files
Client terminal coordinator/PTY, guest entry/controls, reproducible runtime builder, native verifiers.
### Acceptance Criteria
- [ ] Draft/transcript survive approval/workspace cycles; guest output/input cannot authorize or overwrite approvals.
- [ ] Exact installed native controls are independently accepted.
### Validation Results
Not run.

## Step C: Qualification and consolidated setup
### Status
`todo`
### Tasks
- [ ] Server-owned allowlist and bounded fresh official pricing retrieval, 24-hour expiry and owner refresh.
- [ ] Cover quote acceptance plus requested duration; retain manual path and immutable accepted bindings.
- [ ] Commit Router contract before regenerating client validators; consolidate missing prerequisites and accurate thinking explanations.
### Relevant Files
Router marketplace service/routes/store/contracts/tests; client setup/TUI.
### Acceptance Criteria
- [ ] Renewal, failed evidence, unsupported endpoints, duration coverage and active-session tariff stability pass.
### Validation Results
Not run.

## Step D: Final verification and private rollout
### Status
`todo`
### Tasks
- [ ] Retry regression waits for injected failure and successful subsequent touch; green macOS/Ubuntu CI.
- [ ] Client source/provenance and affected Router marketplace/auth/contracts/typecheck/build.
- [ ] Freeze clean alpha.19 bytes, compare installed files and run Apple Silicon VM/PTY/660-second acceptance.
- [ ] Preserve Pages, drain sole relay, replace same staging Machine and verify serving modules/policy.
- [ ] Switch launcher after installed acceptance; append individual reliability outcomes and final real-provider handoff.
### Acceptance Criteria
- [ ] Real-provider/buyer gates have separate PASS/FAIL/NOT TESTED entries with action/steps/expected/actual/transition/time/session/code.
- [ ] Synthetic gates never close live UI gates; unresolved liabilities unchanged.
### Validation Results
Not run.

## Follow-up Work
Operator guest-only key entry and live UI/thinking/host-file verification after exact installed and hosted preparation.

## Decision Log
- 2 October: retain standing deployment authority and exact private npm-login waiver.
- 2 October: preserve Pages deployment b02ef6ec and Git Provider No; feature-branch pushes only.
- 2 October: no runtime-ownership bypass; host saved-work review is independent of inference authorization.

### Alpha.19 validation checkpoint

120 client tests pass, paired contracts match committed Router c603f9a, runtime provenance passes, and generated adaptations preserve the legacy source pin. Actual Apple Silicon source diagnostics passed seven inline reviews, two same-process Continue cycles, multiline draft/agent identity retention, host-file results before/after teardown and saved-context resume without inference replay. Repeated diagnostics exposed an intermittent suspend/input failure; the builder now guards late input and defers workspace suspension past the input callback. Repeated exact installed acceptance is required before launcher selection. No public version, tag, channel or deployment has been changed.

### Exact alpha.19 installed acceptance checkpoint

Product commit 748793d84a7dccc8b983ce897fbba19bd61d08ad is frozen separately from this verifier follow-up. The private tarball SHA-256 is c09566aeef4c7daecc97bb6eee9efe60e95be90da5789c7523d0092ec913c773; all 23,527 installed files match. Client macOS and Ubuntu CI run 36970531479 is green. Installed native PTY passed seven inline reviews, two same-process Continue cycles, multiline draft preservation, verified Apply before/after teardown and saved-context resume. The 355-second installed PTY pass extends beyond five minutes. Separate installed monochrome and color controls runs pass resizing, scroll/selection input, green/red diffs and formatted multiline command cards. The control verifier observes metadata-only dispatch counters so intentionally scrolled transcripts are not mistaken for missing responses. The first viewport-dependent controls run timed out and is not acceptance evidence. A captured earlier coding_busy exception was fixed with a bounded completion wait and a nonfatal warning. Eleven-minute provider lifecycle and rollout remain in progress; live real-provider UI gates remain NOT TESTED.


### Alpha.19 final execution outcome — 2 October 2026

Private implementation, exact artifact installation and authorized staging rollout are complete. Client product 748793d84a7dccc8b983ce897fbba19bd61d08ad, verifier f4100eb11eb63bc1bca725e3bd97227bc6668a6e, final Router ff57999304e60ce7002b32461ecb176a24d5593a and contract 60b4456c58dbdf6c094dbbed61806a9bbd0bbab1 remain separate identities. Both product/verifier macOS and Ubuntu CI and final Router CI pass. Client 123 checks, Router 55 marketplace cases, auth/contracts/typecheck/build, locked runtime and installed provenance pass. All 23,527 installed files match the immutable alpha.19 tarball, including repeat verification before launcher selection.

Installed Apple Silicon 355-second PTY and separate color/monochrome controls passes cover repeated host reviews, same-process Continue, multiline draft/agent retention, resize, scroll/selection input, formatted command cards, green/red diffs, verified host-file application before/after teardown and saved-context resume without replay. The actual installed 660-second lifecycle gate passes idle, same-VM reconnect, checkpoint/new-session resume, explicit Stop, cancellation with uncertainty held and owned cleanup. These remain synthetic-inference checks.

The retained alpha.18 provider stopped normally; guest and broker cleanup were independently verified. The latest buyer session's verified teardown permitted separate operator execution-capacity release while settlement remained pending. Same staging Machine d8d2d26c057308 now serves the final digest, with eleven compiled modules matching. Pages/deployment/Git integration and all 28 asset records are preserved. Financial digests across 15 sessions and two pending requests match; no replay, reconciliation, guessed settlement, schema migration, publication, signing or secret change occurred. Alpha.19 is selected for new terminals, and all retained profiles authenticate.

Step A implementation/regressions: done. Step B and C implementation/source/synthetic validation: done; operator live behavior remains review. Step D preparation, installation and rollout: done; real-provider acceptance remains review. Every real-provider/operator gate stays NOT TESTED until supplied evidence; no blanket acceptance signoff. The preserved npm waiver applies only to private acceptance. See the appended reliability receipt and outputs/adr-acceptance-repairs-2026-10-02/acceptance-status.json for individual pending gates.

Release-order deviation: the relay was restored before the hash parser completed comparison. The hashes had been retrieved; omitted zero exit code/literal newline handling caused parser rejection. Corrected comparison matched all eleven modules. The provider remained paused and admissions closed; financial digests stayed unchanged. This is not recorded as a pre-restore verification pass.


# Plan: Private alpha.20 acceptance repairs and general API support — 2 October 2026

## Goal
Implement the supplied alpha.20 plan for client terminal, guest adapters, generated contracts and private artifact.

## Context
Continue the clean designated canonical clones on codex/adrv2-reliability-20261001. Preserve prior plan sections. Alpha.19 Apply and thinking are operator-reported live PASS; approval rendering and highlighting remain open. Missing timestamps/session associations remain unconfirmed.

## Research Summary
Kickoff authenticated Fly app/registry/recovery image, Pages project/deployment/Git Provider No, active Supabase project and linked SELECT 1, canonical GitHub refs/push access passed. npm E401 retains the explicit private-install waiver; publication disabled. Router protection lookup is plan-limited and unchanged. Official MiMo first-call documentation specifies api-key, max_completion_tokens and reasoning_content continuation; exact current model/thinking/pricing documentation requires verification.

## Constraints
No schema migration, database reset, public publication, promotion, expanded admissions, financial reconciliation, inference replay or secret inspection. Preserve running provider, identities, saved work, limits, holds and liabilities. Generate contracts from committed Router source and runtime through the pinned builder.

## Out of Scope
Legacy source, public channels, participant data and unrelated UI or infrastructure.

## Reversibility
Use additive JSON metadata and negotiated connector fields. Preserve alpha.19 shapes and old artifacts. Build once from clean commits; rollout drains/replaces the sole existing Machine and preserves Pages.

## Step A: Contracts, persistence and supply adapters
### Status
`in_progress`
### Tasks
- [ ] Buyer-owned idempotent stopped-session delete/restore and Deleted view, visibility only.
- [ ] Versioned bounded Router connector descriptors and accepted immutable bindings; reject unsupported profiles before launch.
- [ ] Owner-scoped provider activity and official DeepSeek/MiMo qualification.
- [ ] Guest-only opaque keys, adapter thinking/tools/usage/errors and generic synthetic coverage.
### Relevant Files
Router backend/src/marketplace, backend/scripts/generate-marketplace-contract.mjs; client src/provider-broker.mjs, src/guest, src/generated, test.
### Expected Changes
Add source-owned contracts, JSON metadata and bounded adapters; generate validators.
### Do Not Modify
Legacy clients, schema, account identities, financial authority, ignored secrets.
### Commands
Owning Router typecheck/tests/contracts/build and client npm run check.
### Acceptance Criteria
- [ ] Ownership/duplicates/active rejection and persistence preserve accounting.
- [ ] Old/new clients, immutable sessions, distinct failures and no replay pass.
### Validation Results
Not run.

## Step B: Terminal and navigation
### Status
`todo`
### Tasks
- [ ] Clear full approval panel, reset attributes, cell-width layout, fixed controls/default Deny.
- [ ] Pinned highlighter for approvals/transcript, safe controls, monochrome.
- [ ] Lower sidebar descriptions, compact/full details, overflow arrows, contextual Back and buyer footer.
- [ ] Provider metrics every five seconds and uptime each second while visible.
### Relevant Files
Client src/terminal.mjs, src/tui-screen.mjs, src/tui.mjs, src/terminal-coordinator.mjs, scripts/build-coding-runtime.mjs and regression verifiers.
### Expected Changes
Scoped presentation changes and final-cell/attribute tests.
### Do Not Modify
Approval expiry/action bindings, coding process, provider navigation/Stop distinction.
### Commands
Client npm run check; npm run coding:verify; targeted terminal regressions.
### Acceptance Criteria
- [ ] Repeated arrows/Tab/details/scroll/resize/Unicode and color/mono retain correct final cells and actions.
- [ ] Same-process Continue and status refresh preserve terminal state.
### Validation Results
Not run.

## Step C: Final verification and cleanup
### Status
`todo`
### Tasks
- [ ] Full owning-project checks and disposable PostgreSQL persistence.
- [ ] Verify alpha.20 unused; freeze clean recorded commits, pack once, isolate install and verify bytes/provenance.
- [ ] Installed VM/PTY and eleven-minute idle acceptance.
- [ ] Reverify preflight, preserve Pages, drain/replace/verify same Machine before relay restore.
- [ ] Activate launcher after verification and append individual reliability outcomes.
- [ ] Review final diff, remove temporary debugging and record limitations.
### Acceptance Criteria
- [ ] Private artifact and hosted source identities verified independently.
- [ ] Operator live gates remain separate from synthetic outcomes; unnamed second provider requires later live qualification.
### Validation Results
Not run.

## Follow-up Work
Operator-led DeepSeek/MiMo UI acceptance after private artifact and hosted verification.

## Decision Log
| Date | Decision | Rationale | Impact |
| --- | --- | --- | --- |
| 2026-10-02 | Stopped-session deletion changes buyer visibility only | Explicit supplied plan | Restore preserves saved work and accounting |
| 2026-10-02 | Authorized API / Self-hosted top-level choices; general OpenAI-compatible adapters | Explicit supplied plan | Custom exact models and bounded settings |
| 2026-10-02 | Retain Back with multiple actions and buyer thinking initially off | Explicit supplied defaults | Predictable navigation and capability use |


### Alpha.20 source validation checkpoint
Implementation steps A/B are complete for local source. Client check passed 128 tests; runtime builder and provenance passed 23,471 files. Final-cell/attribute regressions use the pinned @xterm/headless 5.5.0 dev dependency, explicitly scoped to terminal verification. Router typecheck/full tests/60 marketplace cases/auth/6 contracts/build pass; OpenAPI validates with 90 warnings. Disposable PostgreSQL and pgTAP passed seven persistence/concurrency cases, including buyer delete/restore across restart without changing held budget. Source CI, exact installed artifact/native acceptance and hosted replacement remain pending. MiMo official pricing retrieval parsed the current real-time overseas cache-miss/output row; this is evidence retrieval, not live-provider qualification.

Alpha.20 runtime rebuilt through the checked-in builder. Final source validation is repeated after the final scoped review; all changes are limited to this plan. Private tarball/installation and operator live acceptance remain separate.

### Alpha.20 Pages preservation and release input
Pre-push authenticated project metadata retains adrouter-dashboard, Git Provider No, deployment b02ef6ec-e125-439a-b31d-94d274e7ea9f/source 1985053. Push only codex/adrv2-reliability-20261001 to the explicit canonical GitHub URL. Preserve Pages settings/deployment/assets and closed admissions; no WebUI upload is planned. Final artifact is built from the committed clean release input; native acceptance and hosted replacement remain separate.

### Alpha.20 frozen product and verifier follow-up
Product 04d85dbaf2a49526b986b02453ecec5af3a0a2ae packed once; 23,531 files match the isolated installation. Source CI passes on macOS/Ubuntu. Helpers now explicitly load the installed product for final-cell/attribute and adversarial controlled-PTY checks. These verifier-only changes do not replace alpha.20 product bytes. Native lifecycle soak and hosted replacement remain pending.


### Private alpha.21 fix forward
Final review found that the provider menu combined current activity polling with an old node lease snapshot, which could display offline alongside a fresh connection. Preserve alpha.20 tarball/install/source as an immutable tested predecessor; use new private alpha.21 bytes for the correction. Backend connection labels now derive from polled activity, and active session references come from that same response. Lowercase f retains filter behavior; uppercase F opens available details. Router source/image remains 62c95b216601104b8931b7c4eb90a22ec606fd17. Repeat exact installed acceptance for the new product and record predecessor gates separately.

Plan-only correction: e9dfe574d26bf2219cbc0ca9d52caa08a68ae377 accidentally replaced this file with test text. This follow-up restores every previous plan section and appends the fix-forward decision. PLAN.md is excluded from the immutable package; product bytes are unchanged.
