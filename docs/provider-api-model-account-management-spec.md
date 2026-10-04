# ADRv2 replacement specification: reliable API hosting and buyer coding

## 1. Required outcome and scope

**A provider connects an authorized API, offers selected models from one local VM, and serves a buyer running Pi in a separate temporary coding VM. The buyer completes useful work, reviews the changes, applies selected files, and ends the session cleanly.**

Confirmed decisions:

- Include eligible API providers from **both Pi and OpenCode’s provider catalogs**.
- Keep **Pi as the buyer’s coding agent**.
- Use **DeepSeek for the first live acceptance**, testing Flash and Pro independently.
- Set the default maximum output to **4,096 tokens**, including qualification.
- Delete the operator’s old failed or abandoned ADRv2 sessions and remove their execution resources. Restoring those sessions is not required.
- Preserve API credentials, valid login installations, original project files and independently saved work.
- Keep unresolved financial liabilities separate from execution. They must not falsely occupy a provider VM or appear as an active buyer.

Replace the entire [existing spec sheet](/Users/ahmadzuhri/antigravity/3days/adrouter_release/adrouter-new/docs/provider-api-model-account-management-spec.md) and synchronize its authoritative copy in the designated client checkout. Remove obsolete requirements that contradict this specification.

Implementation owners:

- Client: [designated client repository](/Users/ahmadzuhri/antigravity/3days/.reliability/client-spec), canonical `adrouter/adrouter-new`. Continue from local HEAD `537d31e`, which contains the alpha.36 product changes.
- Router: [designated Router repository](/Users/ahmadzuhri/antigravity/3days/.reliability/router-spec), canonical `HappyCool121/adrouter-dashboard`, baseline `ef3d80d`.

Both designated checkouts were clean during planning. Fresh GitHub reads confirmed the canonical repositories and access. The launcher selects alpha.36; that does not establish which version an already-running terminal has loaded.

### Defects this implementation must resolve

| Current behavior verified in source | Required correction |
|---|---|
| Provider setup and buyer quotes default to 1,024 output tokens. | Default both to 4,096. |
| Qualification independently caps output at 512 tokens. | Use the model’s effective configured output ceiling; no hidden 512-token qualification cap. |
| Provider support uses a fixed Pi-only catalog and six protocol families. | Generate the combined eligible catalog and implement its required adapters. |
| Thinking is reduced to a boolean; some models are rejected because thinking cannot be disabled. | Preserve supported upstream settings and required reasoning modes. |
| A stopped session with unresolved inference can continue reserving execution capacity. | Release execution automatically after confirmed guest completion or teardown. |
| A known terminal session becomes a generic “status unavailable” error in the buyer UI. | Display its actual terminal state and cause. |
| Stop can retain the entire session allowance while only part is unresolved. | Refund known unused allowance; retain the unresolved request hold. |
| Session deletion only changes visibility. | Complete execution cleanup and retire the session. |
| Operator controls lack a complete ordinary-session Stop/Delete workflow. | Add scoped inspection, halt, cleanup and retirement controls. |
| Apply approves the whole proposed change set. | Allow the buyer to select files and approve their exact changes. |

These findings establish implementation gaps. They do **not** establish the original live Pro rejection’s cause.

## 2. Provider product specification

### Provider catalog and adapters

“Supported provider” means an eligible API connection can be configured and executed through an implemented adapter. Showing its name in a menu is insufficient.

- Generate the catalog from pinned upstream Pi provider definitions and OpenCode’s provider configuration/catalog sources.
- Record upstream versions, source revisions, dependency integrity and catalog digest.
- At planning time, the latest releases resolve to [Pi 1.0.2](https://github.com/earendil-works/pi/releases/tag/v1.0.2) and [OpenCode 1.18.34](https://github.com/anomalyco/opencode/releases/tag/v1.18.34). Recheck once when implementation begins, then freeze the selected versions for the artifact.
- Include metered API access and authorized self-hosted inference endpoints. Exclude subscription-backed coding plans and consumer-session credentials.
- Treat providers offering both subscriptions and metered APIs as separate authentication/endpoint configurations; exclude the subscription path without excluding the legitimate API path.
- Include cloud API authentication, such as supported Bedrock and Vertex credentials. A single printable API-key field cannot represent every supported API.
- Restrict the coding marketplace to models with the necessary text and tool capabilities. Image-only, embedding-only and other non-coding models must not be advertised as coding offers.

Use Pi’s adapter where it supports the exact connection. For additional OpenCode providers, use the corresponding pinned SDK adapter behind the same ADRv2 inference interface. OpenCode itself is not installed as another buyer agent. OpenCode documents SDK-backed providers and configurable custom endpoints. [OpenCode provider documentation](https://opencode.ai/docs/providers/)

The adapter interface must cover:

- Connection configuration and credential requirements.
- Model discovery where available.
- Supported model settings and serialization.
- Streaming text and tool calls.
- Native conversation metadata needed for subsequent requests.
- Usage normalization and cancellation.
- Safe error classification.

Bundle adapters with the immutable runtime. Do not download arbitrary provider packages during a live session.

Catalog generation must fail when an eligible provider lacks an adapter mapping. Produce a coverage report with separate columns for catalog inclusion, adapter tests and live verification.

### Custom APIs

Provide **Custom API** alongside the generated provider list.

- Accept an explicit endpoint and supported protocol/adapter.
- Support required public fields such as region, resource, deployment and project identifiers.
- Collect secret values, including secret headers and service credentials, inside the provider guest.
- Use discovery when available; permit exact model IDs when discovery is unavailable.
- Resolve model capabilities, limits and pricing from upstream metadata or a maintained, source-backed catalog supplement.
- Keep endpoint-specific compatibility settings attached to that connection. A familiar vendor name must not override an explicitly configured endpoint.

Custom APIs speaking an implemented protocol must work without adding a vendor allowlist entry. A genuinely new protocol requires an adapter implementation.

Missing metadata must produce a precise setup diagnosis. Unknown usage or pricing must never become fabricated zero usage or zero cost.

### Provider setup flow

1. Sign in using the existing provider profile.
2. Select an API provider or Custom API.
3. Enter the required public connection fields.
4. Prepare the single local provider VM.
5. Enter or reuse credentials inside the guest.
6. Discover or select models and choose the subset to offer.
7. Set cumulative token and AdRouter-credit limits and the per-request output ceiling.
8. Review the prepared VM, selected models, effective limits and qualification allowance.
9. Set the marketplace display name; show the persistent unique provider ID.
10. Select **Start provider**, explicitly authorizing bounded qualification and publication.
11. Qualify each selected model independently, connect the authenticated relay and obtain fresh backend readiness confirmation.

Saving or continuing setup does not authorize inference. Cancelled setup leaves an editable connection and completes owned-VM cleanup.

The provider’s operating controls are model selection, limits, naming, Start and Stop. Model capabilities and reasoning behavior come from upstream metadata. Existing test-credit pricing policy remains system-controlled and visible; remove provider-facing capability and price-policy switches from the ordinary setup flow.

### Model settings and output limits

- Default output ceiling: **4,096 tokens**.
- The effective ceiling is the minimum of the selected provider limit, supported model limit and advertised platform limit.
- Display any platform restriction separately from the model’s native limit.
- Respect an explicitly chosen lower limit.
- Qualification must use the same adapter configuration and effective output setting that buyers will use.
- Do not increase token or monetary limits automatically to make a test pass.

Replace boolean-only thinking handling with supported model settings:

- Buyers see only settings supported by the accepted model.
- Start with thinking off where supported.
- For reasoning-required models, use and disclose the supported native mode before acceptance.
- Preserve reasoning effort levels rather than mapping every enabled setting to `medium`.
- Preserve required native reasoning/tool metadata across turns.
- Do not silently change the model, endpoint or reasoning setting.

DeepSeek requires reasoning history to be retained in relevant tool conversations; the adapter and round-trip tests must exercise that requirement. [DeepSeek thinking and tool-call documentation](https://api-docs.deepseek.com/guides/thinking_mode/)

### Qualification and readiness

For every selected model, show distinct results for:

- Configuration and credentials.
- Streaming response.
- Tool-call generation.
- Tool-result round trip.
- Final usage evidence.
- Publication.
- Relay authentication.
- Backend readiness.

Flash passing never qualifies Pro.

A failed model must not be silently substituted or removed. Offer an explicit action to correct its configuration or exclude it from the proposed offering. Reuse valid qualification evidence only when its exact binding remains valid.

An unknown qualification outcome is inspected by its existing check ID. It is never automatically repeated.

A provider becomes available only after guest readiness, relay authentication and fresh backend confirmation agree on the current run.

### VM ownership and provider controls

- Each provider terminal owns at most **one provider VM**, including during setup, discovery, reconnect and cleanup.
- One VM can offer multiple selected models.
- Retain one active buyer session and one inference execution slot per provider VM.
- Starting another connection in the same terminal requires completing the current VM’s teardown.
- Different terminals cannot claim the same provider run or credential volume concurrently.
- Reconnect reuses the same VM and run when healthy.
- Restart requires confirmed teardown of the previous owned VM.
- Ordinary Stop preserves the protected credential volume.
- **Disconnect API** remains a separate credential-removal action.

Expose three distinct controls:

| Action | Effect |
|---|---|
| End buyer session | Stop that buyer’s execution; keep a healthy provider VM available for another buyer. |
| Stop provider | Withdraw availability, stop current work, close relay and remove the owned VM. |
| Delete listing | Stop its execution and retire the offering from the marketplace. |

Reaching a provider limit stops new admission, cancels work that can no longer remain authorized, and completes provider shutdown. The UI identifies the exhausted limit.

## 3. Buyer, lifecycle and operator specification

### Buyer workflow

1. Browse current offers with provider name/ID, model, availability, capabilities, rates and effective limits.
2. Select an offer.
3. Review and accept session duration, request allowance, output ceiling and maximum charge.
4. Choose a host workspace directory.
5. Review the import manifest.
6. Copy the approved workspace into a temporary buyer VM.
7. Run Pi in that VM, routing inference through Router to the selected provider VM.
8. Render tool permissions in the coding terminal while the host retains approval authority.
9. Perform edits and commands inside the VM workspace.
10. Return to workspace review when coding ends or pauses.
11. Select which files to apply, inspect their changes and explicitly approve application.
12. Finish the session and verify cleanup.

The buyer never receives upstream credentials. The provider VM never runs buyer tools or receives authority over the buyer’s original project.

Preserve the existing workspace exclusions and path protections. Do not copy secrets, ignored private files or unrelated host directories into the VM.

### Review and Apply

- Display added, modified and deleted files with content diffs.
- Provide file-level selection, initially with no files selected.
- Approve exactly the selected paths and contents.
- Bind approval to workspace identity, snapshot revision and content digest.
- Rejecting Apply leaves all originals unchanged.
- Recheck original-file hashes immediately before applying.
- A changed original produces a conflict requiring a fresh review.
- Preserve the existing recoverable application journal.
- Applying selected files leaves unselected VM changes available for later review or export.

Review, Apply and Export remain available from saved work after compute ends. They must not require a live provider, an active marketplace session or completed financial settlement.

### Separate execution, cleanup and accounting

Expose independent status for:

| Dimension | States |
|---|---|
| Provider runtime | Preparing, qualifying, connecting, available, busy, reconnecting, stopping, stopped, cleanup required |
| Buyer execution | Preparing, active, paused, stopping, stopped |
| Cleanup | Pending, succeeded, failed |
| Accounting | Open, pending reconciliation, settled |

Transport unavailability is a freshness condition, not a replacement for the last known state.

A session that is authoritatively stopped must show **Stopped**, its reason and available work-recovery actions. “Status unavailable” is reserved for a failed status read.

Do not count financially unresolved requests as currently executing after their execution has ended.

### Stop and automatic capacity release

Use one idempotent stop mechanism for buyer Finish, provider halt, operator halt, expiry, exhaustion and cancellation:

1. Revoke further dispatch and tool authority for the affected session.
2. Record the stop reason.
3. Cancel any active provider request.
4. Wait for the current provider guest to confirm its execution handler has finished.
5. Release execution capacity transactionally.
6. Complete buyer VM cleanup and preserve the reviewed/saved workspace outcome.
7. Return known unused funding while retaining unresolved request reservations.

The execution-completion acknowledgement must be bound to the provider run, relay generation, session, request and dispatch sequence.

If acknowledgement is unavailable:

- Keep the provider unavailable for another dispatch.
- Attempt bounded local cancellation and owned-guest teardown.
- Release capacity after verified teardown.
- Retain a cleanup controller and a clear recovery action if teardown fails.
- Never claim cleanup succeeded solely because a socket closed or a timer expired.

A late acknowledgement from an old run must not stop or release a newer run.

### Accounting behavior

At Stop, calculate:

`refundable = funded − charged − unresolved_reserved − already_refunded`

Return that known unused amount exactly once. Do not release the unresolved reservation.

For the reported shape—100 funded, 0 charged and 14 unresolved—the intended result is **86 refunded, 14 held**, with execution stopped after cleanup confirmation.

When authoritative usage later arrives:

- Settle the request once.
- Refund any remaining unused portion of its reservation.
- Append accounting entries.
- Never overwrite an immutable receipt or ledger entry.

Consumed usage and outstanding holds continue counting against their applicable budgets. Creating another session, connection or installation must not erase them.

### Error handling and recovery

Every failure must identify:

- Phase and safe error code.
- Whether dispatch occurred.
- Known result versus unknown outcome.
- HTTP status where available.
- Model, adapter, session/request and run/check identifiers.
- Last successful status time.
- Execution and cleanup outcome.
- Available next action.

Distinguish:

- Local validation and budget rejection before dispatch.
- Authentication or model-entitlement failure.
- Unsupported request parameters.
- Rate limiting.
- Output/context limit exhaustion.
- Malformed tool output with known usage.
- Interrupted streams or missing final usage.
- User cancellation.
- Request timeout.
- Authentication refresh failure.
- Provider/Router connectivity loss.
- Guest teardown failure.

Valid usage evidence must still be accounted for when the response fails a tool-format check. A formatting failure must not automatically become an unknown billing outcome.

Safe status reads may retry. Inference and tool execution must not automatically replay after an uncertain outcome. An explicit new request receives a new ID and retains the earlier liability.

### Authentication

Retain the working three-role login implementation.

- Refresh credentials without losing the active connection or conversation.
- Serialize refresh across processes sharing a profile.
- Keep sign-in repair and sign-out accessible when a normal profile request fails.
- Preserve role/account isolation.
- Stop dispatch under a departing profile.
- Never restart serving automatically after sign-in.
- Use native Safari for any required Google authentication; the operator completes authentication.

### Operator controls and old-session cleanup

The operator interface must provide:

- Provider-grouped listings and sessions.
- Current execution owner and run.
- Last heartbeat and relay freshness.
- Active request versus unresolved accounting.
- Safe failure and cleanup metadata.
- Halt session.
- Halt provider.
- Delete listing.
- Complete or retry failed cleanup.

A halted listing remains paused until explicitly started again. Clearing suspension does not publish it.

For this task, cleanup authorization covers the operator’s pre-existing failed or abandoned ADRv2 acceptance sessions, including the reported failures:

- Inventory identifiers and execution state without reading private workload contents.
- Stop and fence their execution.
- Remove their owned temporary VMs and stale runtime resources.
- Release confirmed execution capacity.
- Retire them from normal session and marketplace flows.
- Preserve only accounting references needed for outstanding liabilities, along with independently saved work and credentials.

No restoration or migration of broken sessions is required. No blanket database reset, account deletion or deletion of unrelated users’ sessions is included.

## 4. Implementation and contract changes

### Catalog and inference contract

Introduce negotiated `pi_native_v3` for the combined adapter catalog and model settings while retaining `pi_context_v1` as the buyer conversation format.

Add:

- `GET /v2/network/provider-catalog`.
- Catalog source revisions and digest.
- Adapter identity and version.
- Public connection-field schema and guest credential-method descriptors.
- Native model limits, supported settings, capabilities and metadata provenance.
- Accepted model settings in quotes, sessions and inference frames.

Keep `inference_connector_v1` as the connector profile. Unsupported client/server combinations must produce an actionable upgrade error before qualification or dispatch.

Generate client catalog/contracts from committed Router definitions. Do not hand-edit generated files.

Transport changes must support each adapter’s required authentication and inference paths while retaining endpoint restrictions, bounded traffic and disabled SDK inference retries.

### Lifecycle and operator interfaces

Extend session/activity responses with explicit execution, cleanup, status freshness and safe failure fields. Keep accounting fields independently readable.

Add:

- Provider-scoped session Stop.
- Run-scoped teardown acknowledgement.
- Relay execution-completion acknowledgements.
- Operator session listing, inspection and Stop.
- Operator provider Stop and listing retirement.

Use the existing `/sessions/:id/stop` and `/sessions/:id/delete` surfaces for the revised buyer behavior. Deletion completes stop/retirement rather than merely changing visibility.

Reuse existing JSONB records and execution-release fields. The planned changes do not require a database reset or a schema migration. Populate the existing required execution-release evidence fields from validated lifecycle acknowledgements.

Update PostgreSQL transaction loading and activity predicates alongside service logic. In-memory tests alone cannot verify capacity release or accounting correctness.

### Ordered implementation

1. **Replace the specification and establish reproducible inputs.** Preserve unrelated checkout changes; freeze upstream catalog/adapters; record implementation work in the owning plans without replacing the cumulative workspace plan.
2. **Repair execution and accounting.** Implement stop acknowledgements, automatic capacity release, partial unused-credit refunds, truthful status and operator cleanup. Cover races in PostgreSQL-backed tests.
3. **Complete provider configuration.** Generate the combined catalog, implement missing adapter/auth paths, propagate native settings and apply the 4,096 default consistently.
4. **Complete the buyer flow.** Preserve Pi/tool metadata, improve actionable failures and add selected-file Apply.
5. **Build and deploy paired immutable artifacts.** Verify the installed client and hosted Router before handing over the real-key step.
6. **Clean up old failed sessions and run fresh DeepSeek acceptance.** Fix any remaining failure and repeat only the affected validation plus the unfinished acceptance steps.

Before deployment implementation, run the required Fly, Pages, Supabase, GitHub and npm checks in the execution context and collect failures into one handoff. The previous npm and registry exceptions are not assumed to cover this delivery.

Use the standing deployment authority. Preserve private access/spending policies, Pages, and the sole-relay drain/in-place replacement procedure. Deliver the next unused immutable private client version; public npm publication and promotion are outside this task.

## 5. Verification and completion gates

### Automated verification

Run the relevant client checks, Router typecheck/build, marketplace/auth/contract suites and PostgreSQL-backed lifecycle/accounting tests.

Required regression coverage:

- 4,096 defaults reach setup, qualification, quotes, relay and guest serialization.
- No implicit 512-token qualification ceiling remains.
- Every eligible catalog provider maps to a bundled adapter.
- Subscription authentication paths are excluded without excluding metered APIs.
- Cloud and multi-field credentials remain guest-only.
- Native settings, reasoning history, tool IDs and usage survive round trips.
- Exact model binding permits only documented aliases and rejects substitution.
- Stop, expiry, limits, provider halt and operator halt all revoke execution.
- Confirmed cleanup releases capacity while unresolved money remains held.
- Partial refunds and later reconciliation are idempotent.
- Stale callbacks cannot affect a new run.
- Failed cleanup remains visible and recoverable.
- Known terminal status is not rendered as failed polling.
- Reconnect never replays inference or tools.
- Selected-file Apply, denial, conflicts and interrupted application behave correctly.
- Scope checks prevent cross-account inspection or mutation.

Use actual installed Mac VM/PTY gates for provider setup, retained credentials, coding permissions, Apply, reconnect and teardown. Repeat the full eleven-minute lifecycle gate for the changed lifecycle implementation.

### Fresh live DeepSeek acceptance

Use the final installed artifact and verified hosted Router.

1. Confirm buyer, provider and operator profiles work.
2. Create a fresh DeepSeek connection and enter the key only inside its guest.
3. Select Flash and Pro explicitly; verify the exact upstream model IDs.
4. Confirm 4,096 output tokens and existing spending authority.
5. Start once and record separate qualification results for both models.
6. For each model, complete at least five sequential buyer turns, including at least two tool-result round trips.
7. Make a real VM workspace edit and run a command through the coding permission UI.
8. Reject Apply and verify original files are unchanged.
9. Select and approve a subset of changes; verify only those files change.
10. Finish the buyer session and start another buyer on the same healthy provider VM.
11. Leave the provider idle for eleven minutes, then complete another request.
12. Interrupt and restore the relay while idle; verify same-VM reconnect and no replay.
13. Verify natural authentication refresh during continued operation.
14. Halt an active request; confirm execution cleanup, accurate liability status and eventual capacity availability.
15. Stop the provider; verify guest removal and backend withdrawal separately.
16. Restart with retained credentials, explicitly Start again, complete another buyer session and Stop.
17. Exercise operator halt and deletion on task-owned acceptance records.
18. Confirm no abandoned task VM or stale execution owner remains.

Also test the Custom API configuration path against the same authorized DeepSeek endpoint using explicit adapter/model configuration. This verifies that path without requiring another provider’s key.

If a live case fails, retain its safe diagnostic evidence, correct the failure and continue from a new explicit test action. Never silently repeat an uncertain request.

### Definition of done

Completion requires:

- The replacement spec is saved in place and its copies agree.
- The eligible combined provider catalog has implemented adapter coverage.
- Fresh Flash **and** Pro buyer coding pass.
- Follow-ups, permissions and selected-file application work.
- Buyer Finish allows a subsequent buyer.
- Reconnect works without replay.
- Stop and operator halt end execution reliably.
- Old failed sessions no longer occupy runtime capacity or clutter normal flows.
- Credentials survive ordinary provider restart.
- Outstanding liabilities remain accurate and separate.
- Evidence identifies the exact client artifact and deployed Router tested.

Report catalog coverage, adapter-test coverage and live-provider coverage separately. DeepSeek is the first live proof; other providers become live-qualified when tested with their own authorized connections.
