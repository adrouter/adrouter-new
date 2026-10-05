# ADRv2 detailed specification: strict setup, model status and failure recovery

Revision: **5 October 2026**. Status: **implemented and installed/hosted verified; independent paid acceptance pending**.

This replaces earlier setup, qualification, provider/listing UI, diagnostics and failure-cleanup requirements. The existing alpha.38 product is the baseline; its earlier synthetic acceptance does not establish that the changes below exist or that live acceptance passed. The current setup blocker must be fixed before another live setup attempt is recommended.

## 1. Non-negotiable user outcome

The provider flow is:

1. Choose an authorized API from the installed Pi library.
2. Enter limits.
3. Choose the models to offer.
4. Explicitly authorize **one model request per selected model** during setup.
5. Publish and become available only when every selected model has returned a valid response and Router has confirmed its result.
6. On the first failure, stop setup, stop the owned VM and associated execution, withdraw availability, and display a detailed failure report with an actual next action.

There is no Continue anyway, silent model substitution, silent removal of a failed model, partial publication, or automatic paid retry. Untested models stay Not tested. A failed or unconfirmed model cannot be sold to a buyer.

The current model range is sufficient. Keep the pinned Pi/OpenCode implementation and existing adapters; broad catalog expansion is deferred. Pi's authorized API providers are the default setup picker. Existing additional adapters and Custom API remain available through Advanced connection setup. Subscription-backed access is excluded.

Pi remains the buyer coding agent in a separate temporary VM. Providers perform inference only. Buyer commands/edits run in the buyer VM; original host files change only through separately reviewed Apply.

The operator performs the real live test independently. The agent may implement and run synthetic/local tests, prepare the test file and verify hosted metadata, but must not dispatch real upstream inference, enter keys or walk the operator through the live test.

## 2. Confirmed defects and accurate failure explanations

### 2.1 HTTP 409 connection_restart_required: confirmed configuration-comparison defect

The reported run `a4815984-dd5f-42d3-96df-aee6fee78533` belonged to node `e721ed92-40db-44f1-b22f-df0b080cbb0a`. Its metadata records guest readiness, then HTTP 409 `connection_restart_required`, followed by successful remote Stop, guest removal, broker cleanup and execution release. No qualification checks were created for this attempt. The node was subsequently observed as deleted.

Router's prepared-connection guard currently compares public configuration objects using `JSON.stringify`. The saved connection's key order was:

```text
kind, compat, headerNames, modelDefinitions
```

The same connection passed through Router's schema has this order:

```text
kind, headerNames, modelDefinitions, compat
```

An offline check against the actual schema returned semantic equality but unequal serialized strings. Consequently, saving model selection can be rejected even when the underlying API settings have not changed. The existing in-memory happy-path test does not cover this persisted-order case.

Required repair:

- Compare schema-normalized public configuration by semantic value, independent of object-key insertion order, including nested objects.
- Preserve meaningful array ordering unless that field is explicitly defined as a set.
- Keep the restart guard for actual changes to the API provider, supply class, endpoint, authentication method or required public connection fields while a VM is prepared.
- Permit model selection/confirmation within the same prepared VM when the connection is unchanged.
- Return the exact changed public field names for a genuine conflict; never expose secret values.
- Use failure phase `configure_models`, not generic `failure`.
- Add a PostgreSQL JSONB round-trip regression as well as a local semantic-comparison regression.

The current incident must be explained as:

> AdRouter rejected saving the selected models because its configuration comparison treated a different JSON key order as a settings change. No model request was sent. The provider VM was removed. Repeating the unchanged setup does not repair this bug.

Do not describe this error as a DeepSeek rejection, an invalid key, a token-limit problem or a generic instruction to restart.

### 2.2 Earlier Flash result-reporting failure: separate incident

The earlier alpha.38 run `07e1dfe2-4578-4115-829f-b883d40f9316` recorded Router renewal and status failures, followed by `qualification_complete / network_unavailable_outcome_unknown` for Flash. Its guest and execution were cleaned up, while check `bd811af7-78a7-4a08-b105-e0cc29ac7084` remained unconfirmed.

This identifies the failed network operation, not the underlying DNS/TLS/connection cause. The old client did not retain that lower-level cause or an exact durable completion report. Do not claim a confirmed upstream rejection or reconstruct usage that was not retained.

Treat these two incidents separately in the UI, tests and documentation.

## 3. Exact provider setup and publication gate

### 3.1 Configuration before a model request

The ordinary wizard has four stages: **API**, **Limits**, **Models**, **Test and start**.

- API: select a supported authorized API and its necessary public fields. Custom API accepts its explicit endpoint and adapter.
- Limits: show cumulative token allowance, AdRouter-credit allowance, separate upstream spending authority and per-request output ceiling.
- Models: explicitly select one or more coding-capable models; unavailable selected models can always be deselected.
- Test and start: review the exact models, effective settings, number of model requests and maximum test exposure before authorizing any request.

Default output is **4,096 tokens**. A lower explicit limit remains respected. Effective limits are bounded by provider, model and platform policy. Display native limits separately. Unknown prices remain unknown; never create zero-price metadata to make setup pass.

Saving a connection, opening a screen, selecting models, discovery and refreshing status perform no model inference.

A temporary provider VM is necessary for guest-only credential entry and the authorized setup request. It is an unpublished setup environment until the gate passes. Preparing that VM must not advertise the connection as working.

Enter credentials only inside the provider guest. Ordinary Stop retains protected guest credentials. Disconnect API remains a separate credential-removal operation.

### 3.2 One request per selected model

The authorization screen must say:

> Test N selected models. At most N model requests. Stop on the first failure. Publish only if all models pass.

Tests execute sequentially in the displayed selection order. A failed first model means later models are not called. SDK retries and model fallbacks are disabled.

Each selected coding model receives one bounded streaming request containing a fixed harmless setup probe. The probe requests one deterministic function call, such as `adr_setup_probe` with `{value: "ready"}`, through the adapter's supported tool-choice mechanism. Validate the returned structured response locally; do not execute arbitrary provider-side tools. A valid tool response counts as a model response even when its text field is empty.

A passing probe requires:

- Exact accepted provider, endpoint, model and settings, including only documented aliases.
- A completed, well-formed response within the declared deadline and output bound.
- The requested valid probe response/tool call; an empty response or unsupported tool behavior is a failure for a coding offer.
- Valid authoritative usage sufficient for accounting.
- Router acknowledgement of this exact check's outcome.

Use the existing 120-second request ceiling, additionally bounded by current authority. Show elapsed time and deadline while waiting. Output truncation that prevents a valid probe is a specific failure, not a successful qualification.

**Remove the automatic second model request for a tool-result round trip from setup.** A tool-result round trip is tested later in the operator's buyer coding acceptance. Do not label a one-request setup probe as proof of a completed multi-turn conversation.

Add a negotiated `single_request_setup_v1` qualification policy. New client setup previews and Router publication validation use one `setup_probe` per selected model for this policy. Old-client check formats retain their existing interpretation. Do not weaken an old two-stage record into a new-policy success or claim unperformed round-trip evidence.

The current check/run/configuration binding and result must be explicit. New changes to connection identity invalidate relevant evidence. Tests from an old configuration must not qualify the new one.

### 3.3 Hard publication gate

Publication is blocked unless every currently selected model has an acknowledged passing setup probe under the accepted policy and configuration. Missing, failed, timed-out, cancelled or unconfirmed checks fail the gate.

After all probes pass, publish the exact offered models, authenticate the relay and obtain fresh backend readiness. Only then display Available or permit a buyer to reserve the offer.

A failed model is never silently deselected. The user may edit the stopped connection and explicitly authorize another bounded attempt. That is a new paid attempt, not an automatic retry.

## 4. Model status on every provider and listing screen

### 4.1 Status dimensions

| Dimension | States | Meaning |
|---|---|---|
| Qualification | Not tested; Testing; Passed; Failed; Result unconfirmed; Recheck required | Outcome of the applicable setup probe for this model/configuration. |
| Model availability | Available; Busy; Offline; Blocked; Unknown | Whether this provider can currently offer this model to a new buyer. |
| Provider runtime | Preparing; Testing; Connecting; Available; Busy; Reconnecting; Stopping; Stopped; Cleanup required | Current execution lifecycle, independent of accounting. |
| Cleanup | Not required; Pending; Succeeded; Failed | Confirmed resource cleanup, not inferred from a closed socket. |
| Accounting | Open; Pending reconciliation; Settled | Known charges/refunds and unresolved reservations. |

A passed model can be Offline. A published listing can be Offline. A stopped session can have pending accounting. These combinations must be rendered honestly.

### 4.2 Authoritative derivation

Router computes model availability using the same current listing, qualification, lease, suspension, capacity and provider-limit conditions used for admission. Buyer-specific funding is separately checked at quote/acceptance.

- One accepted buyer occupies the shared VM slot, including between requests. Other models on that VM cannot appear available to another buyer during that reservation.
- Financial holds whose execution was released do not make a model Busy.
- Unreleased legacy execution is labelled Cleanup required, not falsely described as current inference.
- Unconfirmed completion is not Testing after execution ended.
- Historical successful checks remain historical; they do not override current configuration/run requirements.
- Runtime failures remain distinct from historical qualification results.

Visible operational views poll every five seconds, with one outstanding poll per view. Cancel or ignore replies for a previous node, network or profile. Positive readiness becomes stale after fifteen seconds or earlier lease expiry. On a failed poll, show Unknown and the last confirmed state/time instead of retaining a green Available claim. Preserve confirmed terminal facts while labelling freshness separately.

Status reads must never create a VM, test a model, reserve money or publish.

### 4.3 My provider listings

Every row shows name, short node ID, runtime state and available/selected model count. Opening or expanding it displays every selected model, not just the first.

```text
DeepSeek [short ID]          Failed — stopped       0/2 available

MODEL                 QUALIFICATION        AVAILABILITY
DeepSeek Flash        Result unconfirmed   Offline
DeepSeek Pro          Not tested           Offline

Reason: Flash's result could not be confirmed by AdRouter.
Cleanup: VM removed; relay closed; execution released.
Next action: Diagnose.
```

Use a visible ID to distinguish duplicate connection names. Fully retired connections disappear from ordinary provider views. Pending retirements belong to a distinct Cleanup required section with a count and recovery action.

### 4.4 Provider status and listing details

**Provider status must always exist**, including after reopening the client and when there is no in-memory controller.

Combine authoritative backend data, matching local lifecycle evidence and pending report state. If no controller is attached, say **No controller attached in this terminal**. Do not infer **VM not running** solely from a missing local object.

Owner details show each model's exact ID, adapter, output ceiling, reasoning setting, current check, last result/failure, freshness and relevant run/check IDs. Technical identifiers follow the explanation instead of replacing it.

Buyer marketplace rows and listing details show exact model, qualification, availability, safe reason and freshness. Refresh before quote/acceptance; disable unavailable actions with an explanation. Public listings must not expose private checks, liabilities, installation details or runtime paths.

Operator screens use the same status calculation and group sessions beneath their provider, with safe execution ownership, heartbeat, cleanup and accounting details.

## 5. Operational UI and navigation

Use compact headers showing role, network, loaded client version and connection identity. Do not allow a large banner to displace the model table, primary failure or actions at 80x24. Use stacked cards on narrow terminals. Status must remain understandable without color.

Order information as follows:

1. Current outcome: Available, Stopped after failure, or Cleanup required.
2. Exact failing operation/model and a plain-language reason.
3. Supported next action.
4. Per-model status.
5. Cleanup and accounting separately.
6. Technical details on demand.

Controls:

- Arrows navigate; Enter selects; Tab changes focus between content and actions.
- `/` activates filtering on operational provider/marketplace lists. Show the active filter; filter rows only.
- Status, Diagnose, Refresh, Stop, Retry cleanup, Delete and Back must not vanish because a filter is active.
- Esc while filtering clears/exits the filter. Otherwise Esc goes Back.
- Back must not stop a healthy provider.
- Stop is a distinct action. Exit/Ctrl+C while this terminal owns a provider offers Keep running and Stop and exit; default to Keep running.
- External termination signals attempt bounded cleanup and record the actual result without an interactive confirmation dependency.
- Refresh preserves focus, scroll, selections and drafts. No redraw selects Start, Delete or an approval automatically.

The user must never be sent to a control that is absent. Disabled actions must state their prerequisite. No generic unavailable label without a reason.

## 6. Exact failure report and recovery actions

### 6.1 Required report format

Every terminal failure presents:

```text
SETUP FAILED — <precise operation>
Model: <exact model or 'No model request sent'>
Cause: <known cause; say when the cause was not captured>
Operation: <saving model selection / calling API / recording result / ...>
HTTP / transport: <safe status/category, if known>
Model request: Not sent / Response received / Outcome unknown
Cleanup: <each step and actual outcome>
Accounting: <known charge/refund/hold, independently>
Next action: <an available action with a clear effect>
Details: <node/run/check IDs and timestamp>
```

Do not use `Failure phase: failure` or `setup needs correction` as the whole explanation. Distinguish an internal AdRouter defect from user configuration, an upstream rejection and a Router transport failure.

Do not display the generic unknown-reservation warning for a run that created no check/reservation. Display actual accounting state.

### 6.2 Error/action mapping

| Failure | Explain | Supported next action |
|---|---|---|
| Internal configuration-comparison defect | AdRouter rejected unchanged settings; no model request sent | Install verified repair; do not recommend blind restart |
| Genuine prepared-connection change | Identify changed public fields and why the prepared guest cannot use them | Stop and explicitly prepare the saved new configuration |
| Upstream authentication rejection | The API rejected the credential, with safe status/code | Update credential inside guest; explicit new test |
| Invalid model or endpoint | Identify exact model/endpoint configuration mismatch | Edit configuration |
| No/empty/malformed response | Explain which response requirement failed | Diagnose; edit configuration or explicitly start a new attempt |
| Timeout | Identify whether it occurred during API inference, Router reporting or cleanup | Diagnose; no automatic inference retry |
| Rate limit | Identify upstream or Router rate limiting and known retry timing | Wait; explicit new inference only when appropriate |
| Spending limit | Show existing consumed/held/remaining allowance and required bound | Review limits; no automatic increase or reset |
| Result report unconfirmed | Model responded but Router did not confirm the report | Retry result report if exact metadata was saved |
| Old installation binding | Current installation cannot perform that bound operation | Supported owner/operator cleanup or explicit reclaim |
| Failed cleanup | Identify guest, relay or backend step not confirmed | Retry cleanup with verified ownership |

Only capture allowlisted transport causes, such as DNS, connection reset/refused, TLS failure, timeout, HTTP rejection or interrupted response. If unavailable, state **Transport cause not captured** rather than inventing one. Capture elapsed time and whether an HTTP response was received.

### 6.3 Diagnose command

Add `adr-cli --profile provider provider diagnose NODE_ID`, including `--json` output. It is read-only and must work without a live controller.

Correlate exact node/run/check identities across backend status, safe local lifecycle metadata and saved report metadata. Show current state, first causal failure, later cleanup failures, installation-binding status, and actions actually supported by this installation/role.

No secret values, arbitrary exception messages, headers, raw responses, prompts or tool arguments may enter diagnostics. A diagnostic export is an allowlisted metadata report, never a raw terminal capture.

## 7. Stop everything belonging to a failed run

On the first unrecoverable setup/model failure:

1. Block new inference and tool authority immediately.
2. Stop testing remaining models and mark them Not tested with the reason.
3. Ensure the failed run has no published/available offers.
4. Cancel the outstanding upstream operation if one exists.
5. Stop associated buyer execution and preserve its latest available checkpoint.
6. Remove the owned provider guest and close relay/broker resources.
7. Confirm backend withdrawal and release execution capacity after completion/teardown evidence.
8. Keep the TUI open on the failure report.

A first-model failure cannot proceed to the second model. If a later model fails, previously passed models stay historically Passed but the entire connection remains Offline; no partial publication.

Temporary status/report recovery does not authorize new dispatch. Do not extend expired authority. The buyer pauses new actions immediately on authority loss and closes local execution if authority remains unavailable beyond a bounded thirty-second window, preserving work without a model call.

If removal fails, show Cleanup required and block relaunch. Retain the cleanup controller and persist safe ownership metadata linking guest, runtime, node and run. Recovery must verify this evidence through supported runtime metadata before removing resources. Do not adopt older unidentified guests by name.

A stopped VM, closed socket or elapsed deadline does not establish an upstream billing outcome. Keep unknown charges separate. Refund known unused funding exactly once:

`funded - charged - unresolved_reserved - already_refunded`

Do not erase holds, reset budgets or fabricate zero usage to make the screen look clean.

## 8. Completion reporting must survive a lost response

Before sending the model check's completion report, atomically persist only its schema version, node/run/check/model/configuration binding, normalized usage, validation flags, payload digest and delivery state. Use validated owner-only paths and bounded data. Do not store response text or credentials.

On a report transport failure:

- Read the existing check's authoritative state.
- If already settled, use that recorded outcome.
- Otherwise retry only the identical completion report.
- Allow at most three delivery attempts within forty-five seconds. This window does not extend execution authority or delay an explicit Stop.
- Do not replay an uncertain refresh-token exchange or treat authentication rejection as an ordinary transport retry.
- Retain the report if delivery cannot be confirmed.

Router settles a check at most once, returns the original result for identical duplicates and rejects conflicting report payloads. Completion reporting for an already authorized check remains possible after Stop/retirement without granting new inference, publication or restart authority.

A user-triggered **Retry result report** contacts Router only. It does not call the provider API, launch a guest, continue tests or publish. After recovery of a stopped run, another paid attempt still requires explicit Start.

If no exact saved report exists, say so and disable report recovery. The earlier Flash attempt's missing usage must not be reconstructed.

## 9. Backend status interfaces and compatibility

Router owns one model-status projection used by provider, activity, listing and operator views.

Negotiate additive status fields with `X-Adr-Model-Status: 1`. Existing clients receive their existing response shape. Add `modelStatuses` to provider projections and `modelStatus` to individual listings, with:

- Exact model and configuration identity.
- Qualification policy/state and last applicable check time.
- Availability state, reason code and observation/validity timestamps.
- Owner/operator-only progress, safe failure references and cleanup detail.

Public responses exclude private check IDs, installation bindings, liabilities and runtime paths. Current status and admission use the same capacity/readiness conditions. New screens must not maintain a separate readiness policy.

Add the single-request setup policy to authoritative contracts and publication checks. One successful new-policy probe is not re-labelled as legacy two-call/round-trip verification. Generate client validators after committing Router contract inputs and update OpenAPI. Preserve role separation and existing request-proof/body-digest enforcement.

Use existing JSONB records for new status/report metadata; no database reset or schema migration is planned for this work.

## 10. Buyer and operator behavior retained

Buyer flow remains: select exact offer, accept its bounds, choose/review the workspace, run Pi in the buyer VM, approve intended commands/edits, return through `/workspace`, review changes and apply explicitly selected files.

Rejecting Apply changes no host file. Selecting one file applies only that file. Recheck original hashes and retain application journals and unselected changes. Review/Apply/Export remain available from saved work after compute or financial settlement stops. No automatic application to host originals is permitted during failure cleanup.

Operator views expose exact model/session/run, freshness, execution, cleanup and accounting. Supported controls are Halt buyer session, Halt provider, complete verified cleanup and retire listing. Controls for a connection bound to an older installation must offer the correct operator/owner path, not a menu that predictably produces an unexplained not_found.

Ordinary Stop preserves credentials. Delete retires a connection after verified cleanup while retaining necessary financial evidence and saved work. Disconnect API is separate and never a troubleshooting shortcut.

## 11. Remove the obsolete provider entries

The user authorized removal of obsolete provider entries. Requery the account and build an explicit removal manifest immediately before mutation; do not infer the target from a duplicate name.

The previously identified working-test connection was `bdabdac3-82e0-4ca7-a82b-6b77c9c90872`. Preserve it if it still exists and remains the intended current connection. The subsequently reported node `e721ed92-40db-44f1-b22f-df0b080cbb0a` was observed as deleted; do not instruct the operator to restart that ID. Never select an arbitrary replacement or start a new paid connection automatically.

For the ten previously inventoried obsolete entries, verify owner/run, use the operator Stop path, match recorded guest-removal or authoritative execution-release evidence, complete supported teardown, retire the listing and verify removal from ordinary views. Do not erase associated financial holds.

If new entries appeared after the authorized inventory, leave them unchanged until their intended role is established. Preserve credentials, saved work and the two older ownership-unverified VMs. The normal provider screen must not accumulate retired entries; genuine pending cleanup remains in a separate labelled section.

## 12. Required verification

### Configuration and one-request gate

- Reproduce the actual unchanged `{kind, compat, headerNames, modelDefinitions}` ordering case through schema validation and a PostgreSQL JSONB round trip.
- Object-key order changes pass; real endpoint/provider/authentication changes still reject with exact field names.
- Confirm model selection in the same prepared VM does not launch another VM.
- N selected models cause at most N upstream model requests, one each, in sequence.
- First failure prevents later requests and all publication.
- Valid structured tool response is accepted as the requested response; empty, malformed, truncated, substituted or unusable response fails explicitly.
- No hidden round-trip request, SDK retry, fallback model or automatic new attempt.
- Backend independently enforces the qualification policy and gate.

### Status and UI

- Mixed model states; passed but offline; published but busy; expired/stale evidence.
- Lost polling, reopened terminal, no local controller and late callbacks.
- Consistent rows/details/quotes and safe public/private projections.
- Operational actions survive filtering; Back does not stop healthy execution; explicit Exit/Stop behavior.
- 80x24, narrow and wide terminal layouts, monochrome output and stable focus/scroll.

### Recovery, cleanup and accounting

- Lost completion request and lost completion response; identical/conflicting duplicate reports.
- Exactly one upstream request despite reporting retries.
- Stop/process interruption after report persistence; recovery after Stop/retirement.
- Missing historical report, authentication failure and uncertain refresh.
- Guest-removal failure, verified retry and stale teardown unable to affect a newer run.
- Partial refunds, held liabilities, late settlement and retirement with preserved accounting, including disposable PostgreSQL races.
- Buyer checkpoint preservation, rejected/selected Apply and changed-original conflict behavior.

Run actual installed Mac VM/PTY gates for changed setup, reporting and lifecycle behavior using synthetic transport. Use real-provider credentials only in the operator's independent test.

## 13. Delivery and acceptance boundary

Implement in the designated canonical client and Router checkouts. Preserve unrelated source/documentation work. Complete required platform preflight before deployment/private delivery, carrying forward the explicit npm-authentication deferral and existing deployment authority.

Fix the confirmed setup comparison defect before polishing status presentation. Then implement the one-request gate, statuses/failure reports, report recovery and scoped old-entry cleanup. Do not expand catalog coverage or change spending/access policies.

Commit authoritative Router inputs before generating client contracts. Build the next unused immutable private client; never overwrite alpha.38. Deploy Router changes through the sole-relay drain and in-place replacement procedure. Preserve Pages, database history, existing protected gates and retained recovery artifacts. Verify exact installed and serving identities and run affected release checks.

Update both spec copies and the standalone manual live-test file at `outputs/adr-live-test-2026-10-05/live-test-run.md`. Mark old alpha.38 setup instructions as affected by the confirmed blocker until a fixed version is verified. The revised runbook must describe one request per selected model, the exact new statuses/actions and blank logging fields.

Completion requires a demonstrated synthetic failure that produces a specific diagnosis, no later model request, no publication, confirmed teardown and correct separate accounting; plus a passing multi-model setup with exactly one probe per model and consistent status across screens.

The final handoff is **implementation verified and ready for an independent manual retest**. Real Flash/Pro/Custom API acceptance is not claimed until the operator records it. No agent-run paid inference or interactive live-test walkthrough is authorized.

## 14. Verified private delivery — 5 October 2026

Private `@adrouter/adr-cli 0.1.0-alpha.43` is installed and selected. Product source is `521efa1dde33ca0458b3f376c4146a28aee4fb8f`; tarball SHA-256 is `ec82e30796c7053216b9c1b39de560ea6407e89dfafee4bd5d770e8d45dd3c68`. Router product `feb7a897dc0954ecb5c59d82326a39b13bf0f459` serves on the existing sole Machine with verified platform digest `sha256:c0add06c7bbd05a8c6b8e7d47e7fbda1f1a74aa282815ecce513cccdc029fc56`.

All 875 client source tests, 87 marketplace tests, six contracts and 11 disposable PostgreSQL cases passed. Actual installed Mac gates passed for 644 native/SDK cases, retained guest credentials, fail-fast/one-probe/report-loss behavior, coding selected Apply and the full 660-second lifecycle. Serving bytes, sole relay, private policy/resources and 28 Pages comparisons passed. The ten authorized obsolete nodes were retired with financial evidence preserved; the intended connection and newer excluded node remain.

The [consolidated delivery receipt](../../../outputs/adr-integrated-2026-10-05/delivery-receipt.json) owns exact identities and results. The [manual retest file](../../../outputs/adr-live-test-2026-10-05/live-test-run.md) owns operator actions and blank real-provider results. Synthetic acceptance is not paid Flash/Pro/Custom API acceptance. No real key was entered and no paid inference was dispatched by the agent.
