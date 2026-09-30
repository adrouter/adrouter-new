# Private Mac acceptance and hosted rollout

Scope: current Apple Silicon Mac, existing backend owner, separate provider and
operator installations. Ordinary marketplace purchases remain disabled. Linux,
separate hosts, ordinary beta accounts, npm candidate publication and alpha
promotion are future gates, not waived release requirements.

## Source and local validation

Use the supplied Router feature checkout and this client repository. Run Router
backend typecheck/tests/build, contract checks and OpenAPI validation; WebUI
typecheck/tests/hosted-configuration checks/build; client `npm run check`; and the
Router contract generator with `--check`. Commit authoritative contracts before
regenerating client validators. Preserve Pi provenance and generated assets.

Run migrations, pgTAP, lint/advisors and PostgreSQL concurrency checks only in a
new task-owned disposable database. Never reset the operator database. The
private evaluation, normal purchase and runtime/installation cases require
separate evidence. Passing synthetic inference is not real-provider acceptance.

The pinned runtime installer saves only executable/library/state paths. Reuse
rechecks hashes/version. Unix socket paths require a short private state directory;
installer defaults use `~/.adr-v2-runtime/state`. Do not reuse another person's
runtime directory. Failed/cancelled downloads remove their partial install.

For exact artifact acceptance, commit source, pack once, record source SHA and
SHA-512 integrity, and install that private tarball into an isolated prefix.
Do not publish it. Run the Router `scripts/verify-marketplace-mac.ts` with
`ADR_ACCEPTANCE_CLIENT_ROOT` set to the installed package and
`ADR_ACCEPTANCE_RUNTIME_PATHS` set to a task-created JSON containing only pinned
runtime paths. It exercises actual hot/cold provider, buyer and offline guests
with synthetic inference and records provisional results. Client
`scripts/verify-provider-console.py` verifies hidden synthetic guest key entry,
Ctrl+D and teardown. Its real-key counterpart is always an operator action.
`scripts/verify-tui-pty.py` with the same `ADR_ACCEPTANCE_CLIENT_ROOT` checks the
actual terminal profile selector, Back/Cancel, clean process exit and terminal modes
using isolated synthetic profile state.

## Hosted sequence

1. Review and commit all deployment inputs. Record exact source commits and private
   package integrity. Reverify canonical GitHub refs/protections; never push backups.
2. Preserve dashboard Pages before any Router push. Recheck that its project has
   no Git source (historically direct-upload). Keep its recorded deployment unchanged
   while applying migrations/API gates; never enable automatic deployments. If this
   has changed, stop and establish a preservation mechanism first.
3. Reconcile hosted `adrouter-main` (`aqyiwlanxdhkwwlwiias`) migration history. Review
   and dry-run only pending additive migrations, then apply those exact committed
   files. Do not rewrite applied history or use the historical inactive staging DB.
4. Build the exact clean Router commit for `adrouter-staging`. Record the immutable
   image digest and recovery image before replacing the application. Keep
   `ADROUTER_MARKETPLACE_ADMISSIONS=false`, acceptance and relay off for health
   verification; deploy matching WebUI bytes only after API health succeeds.
5. Enable the configured owner only with `ADROUTER_MARKETPLACE_ACCEPTANCE_TESTING=true`
   and `ADROUTER_MARKETPLACE_ACCEPTANCE_OWNER_ID` equal to the verified active backend
   owner ID. Enable the marketplace client policy for approval, and the single relay.
   Keep admissions false. These are explicit rollout steps, not default config.
   A relay-enabled replacement must wait for the old relay to drain and release its
   dedicated advisory-lock connection. Do not use overlapping relay-enabled
   blue/green Machines. Retain one Machine and record its identity.
6. In separate `--profile provider` and `--profile operator` terminals, have the
   operator approve each installation in native Safari. Stop whenever authentication
   is required. Never ask for credentials in chat or inspect browser sessions.
7. Create and explicitly publish the listing without a permission reference or source review.
   Publication exposes listing metadata; ordinary purchases remain disabled. Qualify a current conservative
   cache-miss/peak tariff from [DeepSeek pricing](https://api-docs.deepseek.com/quick_start/pricing/).
   Set cumulative provider authority at or below the remaining acceptance budget.
8. Enter the real key directly inside the provider guest. Run explicit hot/cold
   evaluation with bounded test credits. The independent USD 10 ceiling includes
   consumed and outstanding liability across retries/restarts. Do not automatically
   replay any uncertain inference. Stop when the allowance or cap is exhausted.
9. Automatic reports stay provisional. Review upstream computation/billing evidence
   for the exact cancelled request, settle it through the reconciliation endpoint,
   then use a different operator installation or browser principal to record the
   independent cancellation review. Transport closure alone is insufficient.
10. Retain configured owner access after testing, stop owned guests, pause their listings and record sanitized
    outcomes. Retain unresolved accounting. On failure stop new work, drain the relay,
    restore recorded application artifacts, and preserve migration history.

## Evaluation evidence and cleanup

Evaluation reports bind session ID, listing ID/revision and settled samples. A
cancellation attempt may leave a provisional report with settlement pending.
The server supplies its cancellation request ID; reviews cannot substitute another
run or revision. Ordinary self-purchase remains rejected even for an operator.
Evaluation charges do not accrue ordinary provider earnings or establish traction.

Esc/Ctrl+C cancel evaluation; its cleanup stops the session and removes owned
buyer/offline guests. The provider tears down on cancellation, disconnect, operator
suspension or deadline. Unknown charges stay reserved until upstream evidence is
reviewed. A failed cleanup is reported explicitly and must be reconciled before a
new run. Evaluation Sessions supports inspection/stopping after an uncertain start.
No artifact or source test asserts Linux/KVM or full release readiness.
