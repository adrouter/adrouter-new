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
