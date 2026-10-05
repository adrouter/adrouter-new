> **Active plan — 5 October 2026:** Execute the [single ADRv2 implementation plan](/Users/ahmadzuhri/antigravity/3days/PLAN.md) through all five steps as one coordinated client/Router release. It covers the confirmed configuration 409, one-request setup gate, durable result reporting, complete failure cleanup, per-model status/diagnostics, old-entry retirement and manual retest handoff. Router/client source implementation and focused verification are in progress; integrated installed/hosted release gates remain pending. The prior sections below remain historical context; their earlier ready/done labels do not certify this repair.

> **Historical alpha.38 blocker — 5 October 2026:** A new setup run reproduced HTTP 409 `connection_restart_required` before any model request. Router compares semantically identical configuration objects using order-sensitive JSON strings. The replacement specification requires a semantic comparison, one request per selected model, a strict all-pass publication gate, per-model status and full failure cleanup. The semantic comparison and integrated repair are now implemented in designated source; installed/hosted release acceptance is pending. Earlier readiness evidence below remains historical for alpha.38; do not claim the new setup path is ready until the fix and its gates pass. See `docs/provider-api-model-account-management-spec.md` in the designated client checkout.

# Plan: Manual live-test readiness and storage cleanup — 5 October 2026

## Goal
Deliver synchronized provider specifications, a self-contained operator-run Flash/Pro/Custom API test file and measured storage cleanup. This repository owns client installation and TUI. Current model coverage is sufficient; live reliability remains unproven.

## Context
Designated canonical implementation checkout, branch `codex/adrv2-reliability-20261001`. Private alpha.38 product source `2323c25c076d8911f37b9a520f8ac0514bfaf035`; Router product `10bc3c4ac5d2125093d9f16db48e807967267a2d`. Both local documentation heads matched fresh canonical GitHub feature-branch reads on 5 October. The launcher selects the retained alpha.38 installation. No runtime fix or deployment is planned. Earlier sections below preserve historical evidence.

## Research Summary
Pinned executable source and retained alpha.38 receipts establish the menu labels, model binding, native gates and recovery path. Fresh installed/source byte comparison and canonical GitHub branch reads passed. Docker's official pruning and Mac disk-space documentation supports explicit unused-image removal, selected builder-cache pruning and allocation measurement. The supplied manual-live-test plan governs this continuation; broader model completion is deferred.

## Constraints
Documentation and storage only. Preserve guest-only keys, valid role profiles, original projects, saved work, spending limits and unresolved liabilities. No inference, computer use, dependency update, rebuild or full 660-second rerun. A concrete DeepSeek-blocking runtime defect requires a new immutable artifact and affected release gates. Deployment/publication preflight is not invoked for this local/documentation task; npm authentication is explicitly deferred.

## Out of Scope
Agent-run live testing, public npm publication/promotion, unrelated session cleanup, hosted database/access-policy/protection mutations and legacy-client changes.

## Reversibility
Retain compressed alpha.36/.37/.38, selected alpha.38 installation, current/previous Router images and small source/hash/diagnostic receipts. Remove only manifested replaceable paths. Preserve every Docker volume/container, ownership-unverified guest, active/dirty implementation checkout and unique ignored data/captures. Recovery is from retained source/lockfiles, immutable packages and registry references.

## Step A: Specification and reproducible inputs
### Status
`done`
### Tasks
- [x] Replace both specifications with the DeepSeek-first reliability scope and separate implementation/readiness/live statuses.
- [x] Verify frozen artifact identities and source-backed shipped controls.
### Relevant Files
- docs/provider-api-model-account-management-spec.md in the designated and original client checkouts.
### Acceptance Criteria
- [x] Both specs agree; current catalog sufficient; manual operator acceptance is distinct from installed synthetic verification.
### Validation Results
Fresh canonical GitHub branch heads match local documentation heads; both implementation checkouts were clean before documentation edits. The retained verifier compared all 51,551 alpha.38 source/installed files and confirmed the tarball SHA-256. Provider profile recovery passed in the prior continuation; future sign-in/lock repair is conditional. No deployment or publishing is planned; renewed npm deferral recorded.

## Step B: Execution, accounting and lifecycle
### Status
`done`
### Tasks
- [x] Fence completion/teardown acknowledgements; unify Stop/retirement; expose execution, cleanup and accounting independently.
- [x] Refund funded minus charged minus unresolved reserved minus prior refunds exactly once; retain late reconciliation.
- [x] Exercise concurrency and transaction loading in disposable PostgreSQL.
### Relevant Files
- Router backend/src/marketplace/{service,store,relay,routes}.ts; client src/provider*.mjs and buyer lifecycle.
### Acceptance Criteria
- [x] Confirmed execution ends independently of liabilities; stale callbacks cannot affect newer runs.
### Validation Results
Retained alpha.38 lifecycle and paired Router PostgreSQL-backed receipt evidence passed. Current task preserves that evidence; no lifecycle code changes or full-suite rerun.

## Step C: Provider and buyer completion
### Status
`done`
### Tasks
- [x] Implement generated combined catalog, bundled auth/adapters, native settings and consistent 4096 output defaults.
- [x] Preserve Pi reasoning/tool metadata, actionable terminal state and exact selected-file Apply approvals.
### Acceptance Criteria
- [x] Adapter matrix covers every eligible provider; selected Apply/denial/conflict/recovery passes.
### Validation Results
Private alpha.38: source check passed 870 tests; installed native adapter matrix passed 644 required cases; provider-console v3 passed same-VM reconfiguration and two retained-credential cycles; actual no-key loopback/tunnel/redirect/binding/teardown passed; buyer PTY selected Apply, rejection, changed-original conflict and retained unselected changes passed. Full lifecycle passed with quick mode unset and 660-second idle, reconnect, saved resume, Stop, cancellation and unknown liabilities retained. Catalog inclusion (204 providers; 2,602 eligible models) is distinct from adapter and live verification.

## Step D: Final verification and cleanup
### Status
`done`
### Objective
Finish manual-test readiness and remove only verified replaceable storage.
### Tasks
- [x] Verify clean implementation checkouts, canonical branch heads, alpha.38 launcher and all 51,551 installed package bytes.
- [x] Recheck deployed Router digest, readiness and unchanged private policy through read-only operations.
- [x] Synchronize both specs and write outputs/adr-live-test-2026-10-05/live-test-run.md with blank result fields and three disposable four-file fixtures.
- [x] Inventory absolute paths/Docker IDs, resolve dependencies and active use, then remove eligible candidates with recovery evidence.
- [x] Reverify alpha.36/.37/.38 hashes, retained runtime, source, profiles/saved work metadata and Docker volumes; measure savings and write cleanup receipt.
### Relevant Files
- docs/provider-api-model-account-management-spec.md in designated client and original client checkout.
- outputs/adr-live-test-2026-10-05/{live-test-run.md,cleanup-manifest.json,cleanup-receipt.md}.
### Expected Changes
Documentation and disposable fixtures only; removal of explicit eligible replaceable payloads.
### Do Not Modify
Runtime/API/dependencies, deployed artifacts, financial state, spending limits, credentials, saved work, volumes and ownership-unverified guests. Preserve dirty historical checkouts.
### Commands
Use retained byte verifier before documentation edits, tar member comparison afterward, deterministic local fixture tests, git diff --check, safe metadata inventory and read-only Router checks. Do not repeat the full 660-second suite or package/build for documentation changes.
### Acceptance Criteria
- [x] Ready for the operator’s independent live test, with all live results blank.
- [x] Both spec copies agree and menu/command references match shipped source.
- [x] Cleanup savings measured; retained recovery material and persistent data preserved.
### Validation Results
Before edits, installed/source comparison passed 51,551 files; SHA-256 8b674967848c4afdbafcca83fadb9353e800fac6e6ae203a07e86572b7e56a22. Both designated implementation checkouts were clean; fresh canonical GitHub feature heads matched. Prior native matrix, provider console, selected Apply and full 660-second lifecycle evidence is retained in outputs/adr-replacement-2026-10-04/private-delivery-receipt.json. No live inference dispatched.
### Findings / Notes
Implementation verified and ready-for-manual-test are distinct from live acceptance passed. Native Safari recovery succeeded in the previous continuation; recovery is conditional on a future sign-in failure. Ghostty automation restrictions do not block an independent manual test. Two old VMs remain ownership-unverified and preserved.

Final local readiness/cleanup validation on 5 October: 73 explicit paths and 41 unused Docker image identities removed; selected builder cache zero. Workspace allocation reduced 12.33 GiB; Docker allocation reduced 23.87 GiB; host free space increased 36.62 GiB at measurement. Alpha.13 active-use installation, unique ignored parity data/captures, 19 Docker volumes/history container and two ownership-unverified stopped VMs retained. Full 51,551-file source/installed comparison, alpha.36/.37 hashes, runtime hashes, profile/saved-work metadata and prior dirty statuses preserved. Three fixtures passed all nine local behavior stages; runbook shell/AppleScript syntax and links pass, with blank live results. Final authenticated Fly/readiness check passed after transient metadata/read failures; exact product digest, policy hash, relay and resources match. No paid inference, deployment, packaging or npm authentication occurred. Receipt: outputs/adr-live-test-2026-10-05/cleanup-receipt.md.

## Follow-up Work
The operator performs and fills in the independent runbook. Flash, Pro and Custom API live acceptance remain NOT RUN until observed. Any actual runtime defect requires a new immutable version and affected release gates. Broader provider completion is deferred.

## Decision Log
| Date | Decision | Rationale | Impact |
| --- | --- | --- | --- |
| 2026-10-04 | Skip npm authentication under explicit operator approval | Private delivery; current E401 acknowledged | Continue implementation; public publication remains out of scope |
| 2026-10-04 | Preserve prior plans below | Historical evidence and existing decisions | New replacement specification controls current work |
| 2026-10-05 | Manual test is operator-run; defer npm auth under renewed explicit approval | Documentation/storage task; no deployment/publication | No paid inference or computer use; retain live results blank |
| 2026-10-05 | Current catalog is sufficient | Flash and Pro are selectable in installed catalog | Broader coverage and incomplete catalog entries deferred |

---

# Plan: Provider setup and live-failure repair — 4 October 2026

## Goal
Deliver one immutable private client update from alpha.33, followed by a fresh operator connection and controlled live acceptance.

## Context
Canonical client base 81f27ee35adb533aa70e7b63e65ef223e2e3550a in this clean canonical clone. Preserve the original checkout, existing accounts/connections/guest credentials and liabilities. The supplied implementation plan authorizes the changes below.

## Research Summary
Inspected pinned Pi adapter source, client controller/TUI and existing Router pi-checks metadata/teardown contracts. No new route, migration, dependency or Router deployment is needed.

## Constraints
No inference on Save/Continue. Start explicitly authorizes bounded checks and publication. No automatic inference replay or financial reservation release. Diagnostics contain only allowlisted metadata. Keep current Fly image and Pages deployment.

## Out of Scope
Public publication, channel promotion, upstream key handling on the host, database changes, resetting existing connections or unrelated work.

## Reversibility
Preserve alpha.33 and its installation. Package a new unused version only from clean committed source; switch launcher only after installed verification.

## Step A: Specification and implementation
### Status
`done`
### Tasks
- [x] Update the existing provider API/model/account spec, retaining unrelated requirements.
- [x] Unify Pi setup; derive reasoning capabilities; expose run states and recovery.
- [x] Preserve phase/status/model/check failure evidence and separate readiness confirmations.
### Acceptance Criteria
- [x] Save/Continue cannot infer; active/reconnecting runs expose Stop/status; cleanup failure blocks relaunch.
- [x] Unknown responses are inspected without replay, and liabilities survive teardown.
### Validation Results
Final alpha.36 `npm run check`: 618 passed. Router marketplace tests: 76 passed; signed authentication checks and six contract checks passed. Coding provenance: 23,473 files; provider runtime: 12,375 files. Explicit Flash/Pro and HTTP rejection tests passed. A reproduced unlinked-lock observation race was fixed and covered by repeated concurrent credential updates. No Router route or database changes.


## Step B: Private artifact and installed acceptance
### Status
`done`
### Tasks
- [x] Run client/provenance and relevant Router tests; exercise Pro and Flash independently.
- [x] Commit clean source, package once, verify isolated installation bytes.
- [x] Run actual Mac VM/PTY, eleven-minute idle, reconnect, teardown/restart gates and switch launcher.
### Acceptance Criteria
- [x] Exact new installation passes synthetic installed gates; prior bytes/identities remain.
### Validation Results
Private alpha.36 built once from clean commit `62712e24572eb698ffb7d4488adc5f810ebbbe3e`; all 35,918 installed files match tarball/source. Exact installed Mac gates passed: 408 Pi matrix cases, eight custom/credential guest tests, credential persistence/hidden-key PTY, 355-second buyer coding PTY, and 660-second provider lifecycle including same-VM reconnect, Stop, unknown liabilities and teardown. Seventeen installed host regressions passed. Launcher atomically switched from alpha.33 to alpha.36. All eight task runtime inventories are empty.

## Step C: Final verification and cleanup
### Status
`done`
### Tasks
- [x] Review final diff; reconcile spec and evidence; remove temporary instrumentation.
- [x] Provide fresh-setup checklist for real Pro/custom/buyer/Apply/reconnect/Stop/restart acceptance.
### Acceptance Criteria
- [x] Live acceptance stays failed/incomplete until the controlled operator rerun succeeds.
### Validation Results
Diff reviewed and task instrumentation confined to synthetic verifiers. Specification and dated receipt/checklist reconciled. Hosted metadata confirms unchanged Fly image and Pages deployment. Real-provider acceptance remains failed/incomplete until operator rerun. Evidence: `../../outputs/adr-provider-repair-2026-10-04/validation-alpha36.json` and `../../docs/adr-provider-repair-2026-10-04.md`.

## Follow-up Work
Final compatibility review found older manual definitions can retain an unsupported thinking flag. Alpha.36 derives saved flags from verified model/API metadata and rejects unverified advertised capabilities before guest preparation. Alpha.34/35 remain immutable and unselected.
Alpha.34 was packed once and retained, but final review found control timeout/cancellation ambiguity. Alpha.35 also fixes the reproduced released-lock observation race (unlinked lock handles are retried, live locks remain protected). Fix forward to alpha.35; alpha.34 is not selected for the launcher.
Operator enters real credentials only in the provider guest; real paid acceptance remains separate from synthetic checks.

## Decision Log
| Date | Decision | Rationale | Impact |
| --- | --- | --- | --- |
| 2026-10-04 | User explicitly waived npm authentication | Private packaging only | No registry publication |
| 2026-10-04 | Fly identity/exact registry manifest, Pages, GitHub and Supabase database access passed | Kickoff preflight | Preserve deployed images/pages |
| 2026-10-04 | User waived subsequent Fly registry transport recheck | Private client packaging/testing/launcher switch only | No Fly or Pages mutation |

---

# Plan: ADRv2 connection and account specification — 3 October 2026

## Goal
Implement the approved provider API/model/account specification and deliver the private Mac buyer/provider flow. Scope in this repository: Connection setup, guest credential volumes, account controls, and installed acceptance.

## Context
User approved the attached implementation plan. Canonical starting inputs are Router 3b3964f07653c6cc9f17c3c1cedf8d284eddfa94 and client ff1a11816527783f7d72ee84eb60e9c84bc09275. Isolated canonical clones preserve original dirty verification work. Earlier plans below remain historical intent.

## Research Summary
Pi models/providers documentation inspected; implementation must use pinned Pi 1.0.0 executable interfaces. Existing pi_native_v1 has catalog-only selection and memory-only credentials. Production reauthorize needs body digest wiring. No dependency upgrade or SQL migration is planned.

## Constraints
Preserve guest-only secrets, paused-by-default recovery, shared liabilities, uncertain outcomes, role separation, coding approvals, runtime pins, prior artifacts, and immutable versions. Never replay unknown inference or initialize unknown historical usage to zero. Contract generation follows a committed Router contract. All five platform preflight checks passed after operator login; Router protection endpoints remain plan-limited 403.

## Out of Scope
Public npm publication, promotion, Linux/KVM qualification, database mutations/reset, Pages upload, unrelated cleanup, protection and access-policy changes.

## Reversibility
Add version-aware contracts and owner-checked lifecycle operations. Retain v1 readers and prior installs. Deploy only clean committed artifacts and replace the existing sole-relay Machine in place.

## Step A: Contracts, accounting, and authentication
### Status
`in_progress`
### Tasks
- [ ] Implement expanded pi_native_v2 configuration and strict model/endpoint/revision bindings.
- [ ] Preserve transactional cumulative allowance admission, expose remaining values, invalidate stale qualification/quotes.
- [ ] Add paused owner rebind/disconnect, fence old runs, and production signed-body recovery tests.
### Acceptance Criteria
- [ ] Custom endpoints work without vendor allowlists; unknown prices/usage fail accurately.
- [ ] Substitutions, cross-account access, replay and tampering fail; liabilities survive recovery.
### Validation Results
Router full typecheck/test/build and OpenAPI validation passed; production app authentication passed with all three roles using a full canonical disposable schema. 76 marketplace tests and contract validation passed. Hosted acceptance remains pending.

## Step B: Client connection and account lifecycle
### Status
`todo`
### Tasks
- [ ] Expose built-in/custom configuration, explicit model selection and advanced metadata settings.
- [ ] Persist credentials only on verified account/connection guest disk volumes; Stop retains, logout locks, disconnect deletes guest credential.
- [ ] Make account/repair/installation controls available offline; serialize atomic auth state and recover orphaned locks.
- [ ] Extend staged acceptance with exact new artifact identities.
### Acceptance Criteria
- [ ] Restart reuses credentials only after fresh owner/installation authorization, without automatically serving.
- [ ] Offline logout clears usable local state and accurately reports unconfirmed revocation.
### Validation Results
Client check passed 598 tests. Pinned coding runtime rebuilt with retained suites. Actual guest disk test passed synthetic persistence, owner denial, replacement binding and Disconnect. Installed artifact/PTY and hosted/live gates remain pending.

## Step C: Final verification and cleanup
### Status
`todo`
### Tasks
- [ ] Review complete diffs and preserve unrelated verification work.
- [ ] Run owning full checks, freeze new private artifact, verify hashes and isolated installation.
- [ ] Recheck platform access, deploy clean Router image with scan and in-place sole-relay replacement, preserve Pages.
- [ ] Run hosted auth, full 660-second Mac lifecycle and bounded DeepSeek flow; switch launcher after acceptance.
- [ ] Record synthetic, hosted and real-provider outcomes separately; remove only task-created temporary debugging files.
### Acceptance Criteria
- [ ] Installed Mac and hosted Router pass live buyer/provider coding, reviewed apply, Stop/restart and second session.
### Validation Results
Not run. Existing alpha.31 evidence cannot certify new bytes.

## Follow-up Work
Operator guest-only DeepSeek key entry and any sequential Safari approvals occur after preparation. Calculate exposure within existing limits first.

## Corrective private artifact

Alpha.32 was frozen and installed for acceptance, but is not activated. Its installed header-edit check found retained secret headers still forwarded after removal, and its lifecycle gate found the legacy guest missing the credential-store module. Alpha.33 fixes both, synchronizes local sign-out metadata durably, and shows the endpoint in the Start review. The quick actual lifecycle rerun passes; the full installed gate will run again for alpha.33. Alpha.32 bytes and failed evidence remain retained. Router source/deployment is unchanged.

## Decision Log
| Date | Decision | Rationale | Impact |
| --- | --- | --- | --- |
| 2026-10-03 | Isolated canonical clones and additive implementation | Preserve dirty verification work and existing plans | Exact clean release inputs |
| 2026-10-03 | Preserve Pages abfaca46-e61c-4487-9360-8d6364e734f8 and migration 20261003025031 | Existing UI flows and JSONB suffice | No Pages/database mutation |

---

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


### Private alpha.22 short-window fix forward
A final short-window regression reproduced a hidden selected list row at eight terminal rows: description rows and overflow markers consumed the available viewport. Reserve at least three content rows when space allows, collapse narrow contextual previews, and prioritize selected content over markers when fewer than three rows exist. Retain alpha.20/alpha.21 immutable products. The new alpha.22 product repeats exact installed gates; Router source remains 62c95b216601104b8931b7c4eb90a22ec606fd17.


### Final alpha.22 execution outcome — 2 October 2026
Implementation and private preparation/rollout are complete. Final client product 23ee6a441e267f5dd5a60496b16e9b7e18335827, Router 62c95b216601104b8931b7c4eb90a22ec606fd17 and contract 45b44a7d57ff3a7d6cde5a9b8b167d1a7776a2a8 are separate identities. Alpha.20/21 are retained immutable predecessors; alpha.22 fixes short-window selection and approval space. Source/CI pass on macOS/Ubuntu; final client 131 checks, Router 60 marketplace cases/auth/six contracts/typecheck/build, disposable PostgreSQL/pgTAP and provenance pass. All 23,531 installed files were reverified before launcher selection. Exact installed color/mono/adversarial PTY, eight final-cell/API cases and actual 660-second provider lifecycle pass with synthetic inference.

The retained provider stopped normally with separately successful guest removal and broker cleanup; no active buyer session was interrupted. The sole staging Machine was relay-disabled/drained, advisory lease released and replaced in place. Thirteen serving modules were verified before relay restoration and again afterward. Exactly one relay lease, private access/closed admissions, Machine resources/ports/idle settings and Pages deployment/assets remain. Session/request digests across 17 sessions and two pending requests match. No schema migration, public publication/promotion, signing, remote-secret change or financial reconciliation occurred. The launcher selects isolated alpha.22; profiles and old saved work/artifacts remain.

Steps A/B: done. Step C implementation, synthetic installed acceptance, private staging rollout and launcher: done; operator DeepSeek/MiMo UI acceptance remains review. Alpha.19 functional Apply/thinking outcomes are operator-reported live PASS with timestamps/session associations unconfirmed; rendering/highlighting remain separately open. Final alpha.22 real-provider gates remain NOT TESTED until operator evidence is supplied. See the appended workspace reliability receipt and outputs/adr-alpha20-2026-10-02 metadata.


# Plan: ADRv2 UI, automatic reads and general authorized API gateways — 2 October 2026

## Goal

Complete the requested UI and read-tool repairs, and make the existing custom OpenAI-compatible Chat Completions path usable and verifiable for authorized API gateways beyond GLM. Use GLM-5.3 on the operator's Z.ai API bundle as the first live acceptance case. This continuation supersedes conflicting UI defaults in earlier plan sections while preserving their history.

## Context

- Owning checkout: `/Users/ahmadzuhri/antigravity/3days/.reliability/client-ux`; canonical repository: `https://github.com/adrouter/adrouter-new`; branch: `codex/adrv2-reliability-20261001`. At planning, the clean local commit and freshly queried GitHub branch both resolve to `5eee85cba671fa66d4e7482d2569877fea9e0eac`. Reverify before implementation.
- The inspected package declares private version `0.1.0-alpha.22`. Its generic version-1 connector already supports custom endpoints/models, four authentication modes, two output-token fields, two usage modes and three thinking-control modes. This plan extends setup, diagnostics and qualification around that existing interface; it does not claim those combinations are already qualified.
- The read failure was reproduced with a read-only check: the pinned runtime passes `toolCall.name` and validated `args`, but `reviewedRead` expects `toolName` and `arguments`. Converting those fields permits the same allowed project path. The native verifier currently requests reads without checking their returned contents.
- Confirmed preferences: raise the description pane's top edge to the main horizontal blue divider; keep Back last; match approvals to the embedded coding agent; leave thinking manually controlled. The operator identified the GLM product as a 20-million-credit bundle on Z.ai. Its active entitlement and the live authentication cause remain unverified.

## Research Summary

- Router owns the connector schema/catalog and accepted bindings. The inspected version-1 shape can express the planned generic setup without a Router change. Preserve its generated client projection.
- [OpenRouter's API reference](https://openrouter.ai/docs/api_reference/overview) supplies a useful gateway compatibility example: namespaced model IDs, SSE comments and a final usage chunk with a nonempty choices array. Use public protocol examples as synthetic fixtures, not evidence of a live-qualified gateway.
- [OpenRouter error documentation](https://openrouter.ai/docs/api_reference/errors-and-debugging) distinguishes HTTP failures from errors inside an already-started response. Preserve partial-output uncertainty and do not add automatic client retries.
- [Z.ai configuration guidance](https://zcode.z.ai/en/docs/configuration) routes API resource bundles through the standard API endpoint. [GLM-5.3 documentation](https://docs.z.ai/guides/llm/glm-5.3) requires thinking enabled; [Z.ai errors](https://docs.z.ai/api-reference/api-code) distinguishes credential failures, forbidden access and quota failures. These are separate diagnostic branches, not a proven explanation of the operator's failure.
- Fresh DeepSeek documentation retrieval timed out. Retain the existing source-backed preset and regression fixtures; recheck official documentation before making a new live compatibility claim. No SDK/library upgrade is planned; use the pinned runtime's source as the library-behavior reference.

## Constraints

- Keep implementation in this client repository. Preserve public routes, Router connector descriptors, generated validators/catalogs, accepted-session bindings and hosted schemas. No new dependency or protocol version is planned.
- General support means the documented Chat Completions subset below, with no gateway-hostname or model-name allowlist in the custom path. Listing publication and existing tariff/capability qualification remain explicit.
- Keys are entered only by the operator inside the provider guest. Preserve endpoint validation, destination binding, resource limits, host approvals and separate host Apply. Never forward credentials to diagnostic output or model context.
- Preserve accepted spending controls, actual usage requirements, unknown liabilities and no client-side inference replay. A gateway's internal routing/retry behavior is separate and must not be described as verified by a single client request.
- Keep all earlier plan sections and immutable artifacts. Execution checkpoints below distinguish source, immutable artifacts, installed synthetic acceptance and pending operator live checks.

## Out of Scope

Responses/Anthropic protocols, arbitrary headers or JSON-body injection, custom executable adapters, automatic model/endpoint fallback, automatic thinking enforcement, subscription-capacity eligibility, legacy-client changes, new model catalogs, public publication/promotion and database or Router deployments. Proprietary reasoning formats requiring additional wire fields are not silently treated as compatible.

## Reversibility

Separate UI/read repairs, generic setup and diagnostics into reviewable commits. Preserve the connector version, pinned legacy source and previous private installations. Generate runtime artifacts through the builder and use a new immutable private version for delivery; never replace alpha.22 bytes.

---

## Step A: UI consistency and automatic project reads

### Status

`done`

### Objective

Complete the original UI and permission repairs across all providers.

### Tasks

- [x] Calculate a shared blue-divider row for the main and description panes. Give descriptions the remaining pane height, remove their arrow-only overflow rows, and retain scrolling/Full details. Narrow layouts must keep the selected action and footer visible.
- [x] Keep Back visible and last, including single-action menus and filtered results. Exclude it from fuzzy ranking and append it after matching actions.
- [x] Use one compact approval card in the existing borrowed lower-screen area: embedded-agent theme/spacing, one tool/path heading, formatted command or contextual diff, Deny selected initially, Allow once and expandable technical details. Preserve expiry, bound actions, input ownership and draft/conversation restoration.
- [x] Normalize the real read authorization context into the read guard's expected shape at the guest bridge. Permit built-in read/grep/find/ls within the allowed project; retain containment and protected-path/link checks. Write/edit/bash/operator commands and host Apply still require fresh approval.
- [x] Strengthen runtime regression checks to inspect actual read results and verify zero approvals, zero bash calls and unchanged files during a read-only turn.

### Relevant Files

`src/tui-screen.mjs`, `src/tui.mjs`, `src/terminal-coordinator.mjs`, `src/tool-presentation.mjs`, `src/guest/coding-controls.mjs`, `src/guest/coding-read-policy.mjs`, the runtime builder, coding tests and native verifiers.

### Expected Changes

Modify owned render/bridge source and meaningful regressions; regenerate the coding payload through its builder during implementation.

### Do Not Modify

Approval authority, provider lifecycle ownership, original host files, legacy CLI source or generated runtime bytes by hand.

### Commands

```sh
node --test test/coding-ui.test.mjs test/coding-terminal.test.mjs test/alpha20.test.mjs
```

### Acceptance Criteria

- [x] Description alignment, Back ordering, long previews, Unicode, color/monochrome and resizing preserve usable controls.
- [x] The real runtime returns expected fixture contents; denied mutations make no changes and approved actions execute once.

### Validation Results

PASS: 142 client checks; exact installed read-only PTY returns all four built-in read results, excludes runtime/private/link results, makes zero approval/bash calls and leaves files unchanged. Installed color (356 seconds), monochrome and final-cell gates pass seven reviews, denied/approved effects, details, resizing, Unicode and same-process Continue.

---

## Step B: General gateway setup and compatibility contract

### Status

`done`

### Objective

Make the existing custom connector a clear, provider-independent setup path.

### Tasks

- [x] Describe the custom choice as an OpenAI-compatible API gateway. Accept its full Chat Completions URL and preserve the exact model ID, including namespaced IDs; do not guess endpoint suffixes or substitute models.
- [x] Explain and validate the existing settings: `bearer`, `api_key`, `x_api_key`, or `none`; `max_tokens` or `max_completion_tokens`; `include_usage` or `native`; `none`, `type`, or `reasoning_effort`; reasoning history on/off. Preserve current generic defaults and named preset values.
- [x] Show those public settings with the endpoint/model in the final setup review and retain them when going Back/Edit. Run connector and endpoint validation before creating a draft or launching a VM; no credential entry or inference probe occurs during form validation.
- [x] Explain that coding requires text streaming, function tools and trustworthy final token usage. The current reasoning-history dialect is `reasoning_content`; gateways requiring structured/signed reasoning blocks remain unqualified for that feature.
- [x] Keep capability selection and thinking manual. Advertise only capabilities verified for the chosen gateway/model, and retain existing explicit publication, accepted revisions and tariff qualification.

### Relevant Files

`src/tui.mjs`, `src/connectors.mjs`, `src/provider-broker.mjs`, `test/provider-setup.test.mjs`, `test/contracts.test.mjs`, `README.md`, `docs/private-mac-acceptance.md`.

### Expected Changes

Modify setup labels/help/review, reuse existing validation, and document the supported protocol subset. No public API/type/schema addition.

### Do Not Modify

`src/generated/`, Router source-owned descriptors/catalogs, existing listing/session revisions or tariff policy.

### Commands

```sh
node --test test/provider-setup.test.mjs test/contracts.test.mjs test/alpha20.test.mjs
```

### Acceptance Criteria

- [x] A non-GLM synthetic gateway with a namespaced model is configured, reviewed and retained accurately without source edits or a provider-specific preset.
- [x] Unsupported settings/combinations and unsafe endpoints fail before VM launch; existing DeepSeek/MiMo configurations retain their behavior.

### Validation Results

PASS: generic namespaced endpoint/model setup survives Back/Edit and reviews all public connector settings. All 80 valid version-1 combinations and invalid settings/endpoints pass synthetic tests; named preset regressions and existing contracts pass. No new live gateway is qualified by these tests.

---

## Step C: Gateway transport coverage and actionable errors

### Status

`done`

### Objective

Verify observable protocol behavior across connector settings and improve failure diagnosis without widening the Router wire contract.

### Tasks

- [x] Add a table-driven fake-gateway suite covering every permitted connector combination and rejecting invalid combinations. Assert exact authentication headers, model IDs, output limits, usage controls and thinking/history behavior using synthetic credentials only.
- [x] Cover SSE comments/keepalives, split UTF-8 and CRLF boundaries, empty initial deltas, fragmented tool calls, final usage with empty or nonempty choices, supported reasoning continuation, cancellation and output/usage bounds. Fix source parsing defects demonstrated by these fixtures.
- [x] Reject incomplete/invalid tool calls, missing or invalid usage, truncated streams and unsupported reasoning envelopes without executing tools or inventing usage. Preserve tool execution only after a validated complete response.
- [x] Add clear messages for the existing authentication/access, model, rate/quota, malformed-response, timeout and unknown-outcome codes. Do not infer exact provider reasons from status alone or display raw upstream messages/headers/bodies.
- [x] On the provider host, correlate the existing validated `/timing` and `/failed` messages by request ID and expose an in-memory `lastUpstreamFailure` status containing only request ID, nullable HTTP status, existing error code and observation time. Show it in the provider screen with status-appropriate recovery guidance. Do not add Router fields or persist response bodies.
- [x] Exercise 400/401/402/403/404/429/5xx, redirects, missing HTTP status, HTML error pages and errors after partial output. Assert one outbound inference request, no automatic endpoint/model switching and unchanged uncertain-accounting behavior.

### Relevant Files

`src/provider-broker.mjs`, `src/coding-wire.mjs`, `src/provider.mjs`, `src/coding-display.mjs`, `src/tui.mjs`, `test/alpha20.test.mjs`, `test/coding.test.mjs`, `test/provider-lifecycle.test.mjs`; add `test/gateway-compatibility.test.mjs` during implementation.

### Expected Changes

Extend source regressions and client-only error/status presentation. The sole new status shape is local to the provider controller; the connector schema, failure-code enum and Router protocol remain unchanged.

### Do Not Modify

Financial settlement, tariffs, transport credentials, accepted targets, failure-code enums or retry policy.

### Commands

```sh
node --test test/gateway-compatibility.test.mjs test/alpha20.test.mjs test/coding.test.mjs test/provider-lifecycle.test.mjs
```

### Acceptance Criteria

- [x] Tests cover a generic gateway independently of GLM and named presets, including actual request headers/body and assembled stream/tool results.
- [x] An HTTP 401 and 403 remain distinguishable in provider diagnostics without claiming whether a key is expired or model access is denied.
- [x] Missing usage/partial failures remain unresolved, and diagnostic output contains no synthetic secret or workload content.

### Validation Results

PASS: exact headers/body, byte-fragmented UTF-8/CRLF, SSE comments, empty deltas, fragmented tools, both final-usage shapes, unsupported reasoning, bounds, partial failures and cancellation are covered. Provider status correlates 401/403/null safely without raw response content or replay.

---

## Step D: Reusable qualification and GLM live setup

### Status

`review`

### Objective

Make acceptance repeatable for any configured authorized gateway and diagnose the reported GLM failure.

### Tasks

- [x] Extend the existing private-acceptance guide with a checklist keyed by endpoint, exact model, connector settings, capability set, listing revision and artifact SHA. Record synthetic coverage separately from live outcomes for text, tools, reasoning, usage, approvals and cancellation.
- [ ] Use GLM-5.3 on the confirmed Z.ai API bundle as the first live row: `https://api.z.ai/api/paas/v4/chat/completions`, bearer authentication, `max_tokens`, native usage, `type` thinking, reasoning history on and manually enabled buyer thinking before inference.
- [ ] Inspect privacy-safe metadata for the reported failed request. Distinguish rejected credentials from forbidden access, quota and request-parameter failures. The operator verifies entitlement and enters the raw key inside the guest; changing thinking is not presented as a fix for authentication.
- [ ] Run the same small synthetic-project scenario for each later selected gateway using its existing authorized listing and bounded session. Additional real gateways/credentials are operator-supplied inputs; implementation and synthetic acceptance do not require purchasing or configuring accounts.
- [x] Mark additional live combinations NOT TESTED until actually exercised. Documentation examples, a ready guest, successful text generation or another model's success do not qualify a gateway's coding/thinking/usage capabilities.

### Relevant Files

`docs/private-mac-acceptance.md`, `README.md`, existing installed VM/PTY verifiers and privacy-safe acceptance receipts produced during execution.

### Expected Changes

Add a provider-independent acceptance checklist and scoped outcomes, preserving earlier reports. No new registry, model catalog or persistent qualification API.

### Do Not Modify

Keys, bundle accounting, existing tariffs or subscription eligibility. Do not assert that a bundle is free to consume or that the authentication issue is solved before live evidence.

### Acceptance Criteria

- [ ] The procedure can be repeated using any compatible authorized endpoint/model without a GLM-specific executable path.
- [ ] GLM outcomes distinguish authentication, streaming/tools, reasoning, usage, read-only operation and approved/denied effects. External blockers remain explicitly recorded.

### Validation Results

The reusable checklist and exact Z.ai bundle setup row are prepared. The operator supplied upstream_authentication_failed without a request ID/HTTP status, so credential versus access cause and active entitlement remain unverified. All final live gates remain NOT TESTED; keys must be entered by the operator only inside the guest.

---

## Step E: Final verification and cleanup

### Status

`review`

### Objective

Deliver verified private client bytes and an honest, reproducible compatibility record.

### Tasks

- [x] At execution kickoff, before any implementation/build associated with private installation, complete all five platform-authentication checks under the current release procedure. This documentation-only planning update requires no deployment preflight.
- [x] Reverify clean canonical input and branch; rebuild the coding runtime from the pinned committed legacy source using the explicit source path below. Preserve its licenses/adaptations/provenance.
- [x] Run full client checks and provenance verification, then pack a new unused immutable private version from the clean product commit. Verify exact isolated-install bytes.
- [x] Run installed Apple Silicon VM/PTY gates with `ADR_ACCEPTANCE_CLIENT_ROOT` pointing to that installation. Require actual read-content assertions, approval outcomes, final terminal cells and existing lifecycle preservation checks.
- [x] Review the final diff, remove temporary debugging, update affected documentation and record any remaining limitations. No Router deployment is needed for this client-only scope; preserve hosted API/Pages/database identities.
- [x] Switch the launcher after installed acceptance. Retain previous artifacts, profiles and saved work; loaded processes retain their own version.
- [ ] Complete operator-led live GLM checks separately and keep other gateway claims scoped to evidence.

### Relevant Files

Runtime builder/provenance scripts, client test suite, package/release metadata, installed acceptance verifiers, this plan and existing private-release guidance.

### Expected Changes

Generate a new runtime/private artifact through existing tooling during execution and record source/artifact/install identities separately. No generated file is hand-edited.

### Do Not Modify

Old artifacts/tags/channels, remote secrets, existing release protections, hosted schemas, admissions or unrelated checkouts.

### Commands

Run from the owning client repository after execution preflight:

```sh
node scripts/build-coding-runtime.mjs /Users/ahmadzuhri/antigravity/3days/adrouter_release/adrouterCLI --verify
npm run check
npm run coding:verify
```

After freezing, packing and byte-verifying the isolated installation, run `npm run coding:mac` and `npm run coding:pty` against that installation with the documented runtime prerequisites. Packaging and launcher replacement follow `docs/adrv2/deployment-workflows.md` in the consolidation workspace.

### Acceptance Criteria

- [x] Full relevant source, generic-gateway, installed-runtime and terminal checks pass for the exact product.
- [x] Original UI/read requests remain covered and existing providers retain their behavior.
- [x] Private delivery, synthetic compatibility and individual live outcomes are independently recorded; no blanket gateway-support or live-pass claim.

### Validation Results

PASS: exact alpha.25 private artifact/install/provenance, 142 client checks, macOS/Ubuntu product CI, 12 installed final-cell/API cases, adversarial enhanced-key PTY, read-only content/protected-path checks, 356-second color and separate monochrome controls, and actual 660-second lifecycle. Launcher selected after final comparison of all 23,531 installed files. Operator live GLM/Ghostty checks remain NOT TESTED.

## Follow-up Work

Apply the same acceptance checklist to additional operator-selected gateways as they are supplied. Gateways requiring unsupported reasoning, authentication or transport dialects need a separately scoped Router-owned contract extension before advertising that capability. Preserve the prior incomplete DeepSeek/MiMo live outcomes until independently completed.

## Decision Log

| Date | Decision | Rationale | Impact |
| --- | --- | --- | --- |
| 2026-10-02 | Broaden the plan to general authorized Chat Completions gateways | Operator explicitly requested the expansion | Generic setup, transport tests, errors and reusable qualification become required work |
| 2026-10-02 | Reuse the version-1 connector and current public contracts | Existing settings cover the defined compatibility subset | Client-only implementation; no Router/database rollout |
| 2026-10-02 | GLM is the first live case; other gateways remain individually qualified | Existing Z.ai bundle is the confirmed live input | No claim of universal compatibility or requirement to obtain new credentials for synthetic preparation |
| 2026-10-02 | Keep thinking manual | Operator chose setup guidance only | No mandatory-thinking capability or automatic toggle |
| 2026-10-02 | Raise description pane; retain Back last; use embedded approval styling | Explicit clarified UI choices | Supersedes earlier bottom-pinned description and hidden-Back defaults |
| 2026-10-02 | Repair the read context conversion and test returned contents | Source inspection and read-only reproduction explain the failure | Automatic safe reads restored without weakening mutation approvals |

### Execution kickoff and source progress — 2 October 2026

Latest UI/read/general-gateway continuation is the active scope. Canonical client
GitHub branch freshly matches 5eee85cba671fa66d4e7482d2569877fea9e0eac; pre-existing
PLAN.md additions are preserved. Five-platform kickoff checks passed for Fly
app/Machine/registry, Pages project/deployment/Git integration, active linked
Supabase SELECT 1 and GitHub push/ref access. npm identity/scope E401 retains the
explicit private-install waiver; package publication remains disabled. GitHub
reports no main protection/rulesets; none changed. Fly Machine is stopped and
preserved; no hosted mutation is required.

Steps A–C source implementation and targeted regressions are in progress. Exact
runtime build, full validation, private artifact/installation and installed native
acceptance remain pending. Step D operator live outcomes remain NOT TESTED.

### Source freeze checkpoint — 2 October 2026

UI/read, setup and transport/diagnostics are separate commits 4438745, 3d3d5f8 and
021c74b. Full client check passes 140 tests; locked runtime build and provenance
pass 23,471 files. Source actual PTY passes seven host reviews, four follow-ups,
two same-process Continue cycles, multiline draft retention, resizing and terminal
restoration. Actual read-only PTY passes four built-in read-content assertions,
zero approvals/bash and unchanged files. Two non-TTY read-only verifier attempts
exited with guest_console_cancelled; diagnostic output passed and the dedicated
actual-PTY gate is the acceptance path. Do not record the failed attempts as passes.

All 80 valid generic connector combinations, invalid settings, exact headers/body,
byte-fragmented UTF-8/CRLF, tools, final usage shapes, unsupported reasoning,
partial errors, cancellation and no-replay checks pass. Provider diagnostics retain
only request ID, nullable HTTP status, existing code and observation time in memory.
Operator-supplied upstream_authentication_failed alone cannot distinguish 401/403;
no request ID/status was supplied and no private workload was inspected. GLM's
live cause, entitlement and every live qualification gate remain NOT TESTED.

Private alpha.23 is the new unused delivery version. No hosted source, schemas,
access gates, public versions, tags or channels are changed. Exact packaging,
installed acceptance and launcher selection remain pending.

### Private alpha.24 narrow-preview fix forward

Alpha.23 product d4125a6844659b9070a96d0a203d13d98cca1159 and tarball are retained
immutably. Installed-byte comparison passed 23,531 files. Final inspection found
that the narrow layout still replaced description text rows with overflow arrows.
Remove those markers while retaining PageUp/PageDown and Full details. The wide
layout and approval/list overflow behavior stay separate. New alpha.24 repeats
exact installed acceptance; the launcher has not changed.

### Private alpha.25 recursive-read correction

Alpha.24 artifact and its successful 660-second lifecycle, installed read-only,
final-cell/adversarial checks and green macOS/Ubuntu CI remain predecessor evidence.
Long/short coding controls exposed a real read defect: grep searched the embedded
runtime and filled its match limit before finding the synthetic project file.
The same broad search sometimes passed because traversal order differed. Those
stalled/failed controls runs are not acceptance evidence.

The pinned builder now excludes .adr-runtime from recursive grep/find and applies
the same synchronous path/link guard to each grep/find/ls result. Direct read
policy is unchanged; no legacy source or generated runtime is edited by hand.
Native fixtures check actual project contents plus exclusion of synthetic private
files, symlinks and hard links. The verifier reports fixed assertion/error metadata
and fails immediately on a synthetic inference error instead of waiting silently.
Raw diagnostic fixture output was removed from the verifier.

Locked runtime build/provenance and 142 client checks pass. Corrected source PTY
has reached nine dispatches/seven approvals and repeated Continue; final completion
and exact alpha.25 installation/acceptance remain pending. Old artifacts remain
unselected and immutable. No hosted change or real inference occurred.


### Final private implementation and installation — 2 October 2026

Selected alpha.25 at 19:37 SGT after final byte verification. Product source is
4e46c720ed367665ae797e2fc8ab877bdf2b5aa3; tarball SHA-256 is
9d17404318a5a11ef1e5504f8b9e4fb50b96aa8dc6b08eb7f057da97544ede9e.
All 23,531 installed files match. Pinned runtime provenance covers 23,471 files;
legacy source remains be7c53dc0b63fb90b70bd6cb7cad4d5713cc0d1a.
[Product CI](https://github.com/adrouter/adrouter-new/actions/runs/37000690748)
is green on macOS and Ubuntu. Final source suite passes 142 checks.

Installed native read-only, final cells/API, adversarial approvals, 356-second color,
monochrome and 660-second provider lifecycle gates pass with synthetic inference.
Verified behaviors include protected recursive reads, default denial, approved
one-time effects, host Apply before/after teardown, same-process Continue, draft
retention, terminal restoration, idle without replay, same-VM reconnect,
saved-context resume, explicit Stop and cancellation with unknown usage held.
Task-owned coding/lifecycle VM inventories are empty. One orphaned synthetic VM
from an interrupted predecessor run was removed from its dedicated task home.

Alpha.23/24 and all earlier artifacts remain immutable; alpha.22 remains available
at its prior prefix. Loaded user processes were not stopped. The launcher now
selects the isolated alpha.25 prefix. Router Machine/image/stopped state, Pages
b02ef6ec/source 1985053/Git Provider No, hosted schema and access policy are preserved.
No public version/tag/channel, real inference, settlement or credential change
occurred. npm's private-install waiver remains limited to this acceptance scope.

Steps A–C are done. Step D and the operator portion of E remain review: the reported
GLM error is not diagnosed beyond the existing combined authentication/access code.
A new real request is needed to obtain the validated HTTP status; bundle entitlement,
GLM coding/thinking/usage and native Ghostty operator outcomes remain NOT TESTED.
Metadata-only individual outcomes and artifact/launcher identities are recorded in
`../../outputs/adr-gateway-2026-10-02/acceptance-status.json` and adjacent receipts.
