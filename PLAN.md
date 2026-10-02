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
`review`
### Tasks
- [ ] Bundle pinned fd and bound startup/build retrieval.
- [ ] Share workspace eligibility and contextual action diffs.
- [ ] Pin selected details; restore guest terminal modes and redraw.
- [ ] Add provider thinking controls and render-only credit/error displays.
- [ ] Remove marketplace presence prompts; wire provider stop shortcuts.
### Acceptance Criteria
- [ ] Explicit approvals, accepted session bindings, cancellation and no-replay invariants remain intact.
- [ ] No unrelated tracked/untracked work enters the release inputs.
### Validation Results
Not run for these changes.

## Step B: Final verification and cleanup
### Status
`todo`
### Tasks
- [ ] Run owning-project source, contract, authentication and runtime checks.
- [ ] Freeze clean commits and verify exact private artifact/provenance and installed native VM/PTY behavior.
- [ ] Preserve Pages and drain/replace the sole Router staging Machine if required.
- [ ] Record individual operator gates; live Review and Apply and thinking qualification remain pending until observed.
### Acceptance Criteria
- [ ] Reviewed host application succeeds; exclusions and conflicts do not damage originals.
- [ ] Native terminal controls survive approvals, Continue, resume and resize.
- [ ] Independent cleanup/accounting outcomes remain truthful.
### Validation Results
Not run for these changes.

## Follow-up Work
Operator-only guest key entry and final real-provider Review and Apply/thinking rerun after synthetic preparation.

## Decision Log
- 2 October: credits now, USD deferred; terminal background for tool output; provider thinking opt-in and buyer thinking initially off.
- 2 October: preserve the historical undetermined incident, 6 charged / 94 refunded / zero reservation and USD 0.002075 liability.
