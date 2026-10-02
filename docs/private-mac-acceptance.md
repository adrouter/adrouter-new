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


## Two-account continuous rehearsal milestone

Configure `ADROUTER_MARKETPLACE_PRIVATE_BUYER_ID` to one verified account distinct
from `ADROUTER_MARKETPLACE_ACCEPTANCE_OWNER_ID`. General admissions stay false.
The configured buyer is buyer-only at approval, issuance, refresh and use. Request
buyer installation approval in native Safari with `adr-cli --profile buyer`.
Preserve provider/operator installation identities during private tarball replacement.

Apply the committed execution-capacity migration before replacing the staging API.
Drain and disable the sole relay before in-place replacement; keep Pages unchanged.
Never auto-release the historical uncertain session. After verified guest removal,
normal stop and cleared readiness/relay, an operator can use Release stopped execution
capacity with a teardown reference. This preserves its USD liability and settlement.

Run Router `scripts/verify-marketplace-continuous-mac.ts` against the exact installed
package. The actual hot guest must survive at least eleven minutes, handshake and serve
two sequential synthetic sessions without re-entering a credential, preserve multi-turn
workspace state, perform approved actions/export, and stop on foreground termination.
These checks are separate from a live two-account settled response and coding action.
Live key entry remains guest-only. Stop for required operator authentication.

## Provider lifecycle recovery gate

Run `scripts/verify-provider-lifecycle.py` with explicit `ADR_ACCEPTANCE_CLIENT_ROOT`,
`ADR_ACCEPTANCE_ROUTER_ROOT` and `ADR_ACCEPTANCE_RUNTIME_PATHS`. Use a new short
task-owned runtime home; the metadata file contains only pinned executable/library/home
paths. The gate uses actual Apple Silicon provider and coding guests, a local Router,
synthetic inference and one hidden synthetic key. It verifies duplicate rejection before
allocation, eleven-minute idle, checkpoints/continue, authenticated reconnect of the same
VM, reviewed apply, new-session saved-context resume without replay, explicit provider
Stop, obsolete cleanup rejection, and request cancellation while unknown liability stays
held. Its captured terminal bytes stay in memory. `ADR_PROVIDER_LIFECYCLE_QUICK=1` skips
the idle soak for diagnosis and does not satisfy the eleven-minute gate.

Use paired private client/Router artifacts for lifecycle acceptance. Each launch claims
its providerRunId before warming; runtime cleanup is run-scoped and explicit owner Stop
is node-scoped. Legacy empty cleanup cannot stop a fenced run. A second healthy run is
rejected; takeover is not automatic. Diagnostics in the provider profile contain bounded
lifecycle metadata, first failure and separate cleanup outcomes, never credentials,
checkpoint contents, prompts, responses or exception output. Temporary relay failure does
not extend buyer expiry or replay inference. Definitive policy/runtime failure still closes
the owned run. Full real two-account acceptance remains a separate operator gate.

## Generic gateway qualification (2 October 2026)

Record one row for each exact endpoint, model, version-1 connector settings,
capability set, listing revision, accepted session and immutable artifact SHA.
Record time, action, steps, expected/actual result and PASS/FAIL/NOT TESTED for
**each** gate below. Keep synthetic and operator live evidence separate. Never
record keys, prompts, tool results or raw upstream bodies in receipts.

| Gate | Expected evidence |
| --- | --- |
| Authentication/access | Validated HTTP status and failure code; operator checks entitlement and guest-only key entry |
| Text/stream | Complete UTF-8 SSE response; comments, empty deltas and final usage handled |
| Function tools | Exact complete calls; actual read/grep/find/ls fixture results, no approval or bash for reads |
| Reasoning | Manually enabled buyer thinking, supported control and reasoning_content continuation |
| Usage | Valid final input/output counts within accepted bounds; missing usage remains unresolved |
| Denied action | Deny selected initially, no mutation or command execution |
| Allowed action/Apply | Fresh approval, one execution; separately reviewed host application |
| Cancellation | Bound cancellation and independent cleanup; unknown outcome not replayed or zero-settled |
| Terminal | Arrows/Tab, details, resize, Unicode, mono/color, draft and same-process Continue |

The generic fake-gateway matrix covers all 80 valid connector combinations and
invalid combinations using synthetic credentials. It is not live gateway approval.
A ready VM, successful text response or another model's success does not qualify
streaming/tools/reasoning/usage for a different row. Unsupported auth/transport or
reasoning dialects need a separately scoped Router contract change.

### First live row: operator's Z.ai API bundle

- Endpoint: `https://api.z.ai/api/paas/v4/chat/completions`
- Model: `glm-5.3` (confirm the exact request ID and bundle entitlement with Z.ai)
- Connector: bearer, max_tokens, native usage, type thinking, reasoning history on
- Provider thinking: advertise only once verified; publish/qualify the revision
- Buyer: manually enable thinking before this model's inference
- Artifact/listing/session: record the actual tested identities at execution
- Current live outcome: **NOT TESTED**; the reported authentication cause and
  active bundle entitlement remain unverified. No additional account is required
  for implementation or synthetic acceptance.

For a 401, verify the entered key; for a 403, verify access/entitlement. These
statuses do not establish the precise reason by themselves. Check 402/429 quota
or credits separately and 400 request settings separately. Do not display raw
upstream errors or claim that changing thinking repairs authentication. The key
must be entered by the operator inside the guest, never through chat.

Protocol references checked on 2 October 2026:
[OpenRouter response/usage conventions](https://openrouter.ai/docs/api_reference/overview),
[stream/error conventions](https://openrouter.ai/docs/api_reference/errors-and-debugging),
[Z.ai bundle endpoint guidance](https://zcode.z.ai/en/docs/configuration),
[GLM-5.3 thinking](https://docs.z.ai/guides/llm/glm-5.3),
[Z.ai HTTP errors](https://docs.z.ai/api-reference/api-code).
These references inform synthetic fixtures and setup; they are not live acceptance.
Prior incomplete DeepSeek/MiMo outcomes and all other live combinations stay
NOT TESTED until individually exercised.
