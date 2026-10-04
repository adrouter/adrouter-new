**ADRv2 spec sheet — provider APIs, model selection, and account management**

Applies to the **Router backend and ADRv2 (`@adrouter/adr-cli`)**.

The required experience is:

**Provider connects an authorized API → selects models → sets token/credit limits → starts offering them. Buyer selects an offered model and uses the existing coding experience. Both can reliably sign in, refresh, switch accounts, and sign out.**

**1. Provider setup**

Provider configuration must follow Pi’s provider model: built-in providers plus custom endpoints using supported API protocols. Pi supports custom base URLs, authentication, headers, and model definitions; ADRv2 must expose those capabilities without restricting providers to its current catalog. [Pi custom endpoint configuration](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/models.md)

| Input | Required behavior |
|---|---|
| API provider | Choose a built-in provider or **Custom API**. A compatible endpoint must not require an ADRv2 code change merely because its vendor is absent from the catalog. |
| Endpoint and authentication | Use the selected Pi adapter’s configuration and authentication requirements. Built-in providers supply sensible defaults. Custom endpoints accept the appropriate base URL, protocol, and provider-specific settings. |
| Available models | Use endpoint discovery where supported, Pi’s catalog where applicable, or explicitly entered model IDs. An endpoint without a model-discovery API must remain configurable. |
| Models offered to buyers | The provider explicitly selects one or more models. Discovering additional models never publishes them automatically. |
| Provider limits | Set total tokens and total **AdRouter credits**. Maximum output tokens per request is available under token limits. |

The normal setup adds only **offered models and provider limits** to Pi-style connection configuration. Existing pricing and technical settings remain available without becoming a separate mandatory setup workflow. Known model metadata and tariffs are populated automatically; custom definitions support the metadata Pi requires.

“Any authorized API” means API access supported by Pi’s adapters, including compatible custom endpoints. A genuinely different wire protocol requires an adapter and must be identified clearly as unsupported until one exists.

Additional requirements:

- One saved connection supports multiple offered models with shared limits.
- The actual endpoint determines compatibility. Selecting a familiar provider name must not override a custom endpoint’s behavior.
- Streaming, tool calls, usage reporting, cancellation, and thinking settings must follow the selected adapter.
- Thinking starts off. If a model cannot honor that setting, the interface must say so before acceptance.
- Invalid configuration produces a specific, editable error while preserving the saved connection.
- Saving or editing a connection does not start paid inference. **Start** explicitly includes any chargeable qualification checks.
- **Connection saved → Continue setup** opens the remaining setup flow directly. Saving and continuing never authorize inference; **Start provider** explicitly authorizes bounded qualification and publication. Pi connections use this single setup/start flow.
- Pi setup and connection management have no provider-side thinking controls. Capabilities come from verified Pi model/adapter metadata; manually defined models without verified reasoning metadata do not advertise thinking support. Buyer thinking controls remain available where supported and start off.
- Only successfully qualified, explicitly published models become available to buyers. Readiness requires a functioning guest and authenticated relay.

**Setup, readiness, and failure recovery:** Show guest readiness, each selected model's tool and round-trip qualification, publication, authenticated relay readiness, fresh backend confirmation, and remaining allowances separately. Publication alone is not serving. Controller states are preparing, qualifying, connecting, serving, reconnecting, stopping, stopped, and cleanup required. Active and reconnecting runs retain status and Stop controls. A new launch requires verified teardown of the owned guest; failed cleanup remains recoverable and callbacks/cleanup are fenced by run identity.

Record the original failure before teardown. Each failure identifies its phase, allowlisted code, HTTP status when available, model/API and run/check identifiers, timestamp, and cleanup outcome. Distinguish failure, user cancellation, timeout, and cleanup failure. Never persist exception bodies, headers, credentials, or workload content. Failed activity polling reports unknown availability while retaining the safe failure reason and last successful timestamp.

After an uncertain control response, inspect existing run/check metadata before offering another action. Never automatically repeat paid inference or release financial reservations. Verify `deepseek-v4-pro` independently of Flash through the pinned Pi adapter with supported request settings, thinking off, tool round trips, usage evidence, and output limits. Custom endpoints retain their explicit protocol and compatibility settings. This repair uses existing Router APIs/check metadata and introduces no route or database migration.

**Credential persistence — confirmed preference:** API credentials remain saved in protected, persistent storage inside the provider VM. They survive ordinary stops and restarts. Plaintext credentials must never enter Router storage, host configuration, buyer environments, logs, or exports.

AdRouter sign-out preserves the saved connection but locks its use. **Disconnect API** is a separate action that removes its saved credential and disables serving through that connection. Removing the local credential must not be represented as revoking the key at the upstream provider.

**2. Provider limits and accounting**

**AdRouter credits are the primary credit unit.** Existing upstream USD spending controls remain separate and must not be described as equivalent to AdRouter credits.

| Rule | Required behavior |
|---|---|
| Shared allowance | Token and credit ceilings apply cumulatively across every offered model and buyer using the connection. |
| Token counting | Count input and output usage, including cache and reasoning categories without double-counting. |
| Admission | Before dispatch, account for consumed usage, active reservations, unresolved liabilities, and the new request’s maximum exposure. |
| Exhaustion | Stop admitting requests when either limit cannot cover the next request. Show which limit prevents continuation. |
| Persistence | Stop, restart, sign-out, recovery, re-enrollment, and listing edits never reset consumption or outstanding reservations. |
| Changes | Raising a limit requires an explicit provider action. Lowering it cannot erase usage or liabilities. |
| Qualification | Chargeable compatibility checks consume the same applicable allowances as buyer requests. |
| Uncertain outcomes | Preserve the reservation until reconciled. Never assume zero usage or replay an uncertain inference automatically. |

The provider sees **limit, consumed, reserved/unresolved, and remaining** amounts. Effective request limits must be visible before a buyer accepts a session.

Unknown prices or missing usage evidence must be reported accurately; they must never become invented zero-cost usage or a false “qualified” result.

**3. Buyer behavior**

The buyer’s coding workflow remains unchanged, with model selection reflecting provider offerings.

- Buyers see the models the provider explicitly offers through the configured connection.
- Each offer identifies the provider, model, availability, supported capabilities, credit rates, and effective limits.
- A session binds to the accepted connection, model, configuration revision, rates, and limits.
- The Router rejects requests for models outside that accepted offering, including requests from modified clients.
- No silent substitution of another model, endpoint, provider, or thinking mode is permitted.
- Changing models requires selecting another offer and accepting its terms through the existing session flow.
- Buyers never supply or receive the provider’s upstream credentials.
- Coding, tools, project isolation, action approvals, and reviewed application of changes retain their existing behavior.

Configuration changes invalidate affected qualification and stale quotes. Existing sessions retain their accepted terms where still enforceable; otherwise they stop with a clear reason.

**4. Login, logout, and account management**

AdRouter account authentication and upstream API authentication are separate. A failure in one must clearly identify which connection needs attention.

Pi exposes interactive login and logout as ordinary user actions. ADRv2 must provide equally accessible controls while preserving its installation identity and role boundaries. [Pi authentication behavior](https://github.com/earendil-works/pi/blob/main/packages/coding-agent/docs/providers.md)

**Account controls must remain accessible when authentication is expired, broken, revoked, or offline.** Opening them must not depend on a successful authenticated profile request.

| Action | Required behavior |
|---|---|
| **Sign in** | Complete the existing browser approval flow, using native Safari for Google authentication. Show the account, network, and role being approved. Cancellation returns safely to the TUI. |
| **Automatic refresh** | Refresh valid sessions without interrupting normal use. Concurrent processes must not independently rotate the same refresh state. |
| **Refresh / repair sign-in** | Recover through browser approval when ordinary refresh is unavailable or uncertain. Preserve the installation binding, account, scopes, connections, and accounting when recovery is possible. |
| **Sign out** | Stop local activity for the selected profile and clear its usable local authentication, even when refresh is broken or Router is unreachable. |
| **Switch account/profile** | Clearly identify the destination account, network, and role. Credentials and permissions must never leak between profiles. |
| **Manage installations** | Inspect and revoke account-owned installations through an accessible authenticated management flow. |
| **Sign in again** | Restore access to the same account’s saved connections and records. A new installation must be able to reclaim paused connections through ownership-checked rebinding. |

Sign-out has two distinct results: **local sign-out** and **server revocation**. When Router is reachable, revocation must work without a healthy access or refresh token. When confirmation is unavailable, local sign-out still completes and the interface states **“Signed out locally; server revocation unconfirmed.”** Fresh account authentication must provide a way to finish revocation.

Further requirements:

- Refresh repair must not require reinstalling the CLI, deleting files, resetting the database, or recreating listings.
- Revoked installations or missing installation keys lead to guided fresh enrollment.
- Logout preserves saved connections, credentials in the locked provider vault, coding work, receipts, consumed limits, and unresolved liabilities.
- Signing back in never automatically starts serving or spends money.
- Logout or profile switching stops new dispatches under the departing profile. Interrupted work retains truthful accounting and recovery state.
- An uncertain refresh response enters a recoverable state; it must not create an endless retry loop.
- Authentication writes are atomic, refresh is serialized, and interrupted local state has a supported recovery action.
- User-facing errors explain the next action. Technical error codes remain available in diagnostics.

**5. Router and client contract requirements**

- Router must support built-in and custom connection metadata, offered model sets, configuration revisions, qualification state, and cumulative limits. Credentials remain guest-only.
- Account ownership must survive installation replacement. Execution authority remains bound to a currently authorized installation and provider run.
- Provider/model permissions and budgets are enforced by Router, independently of TUI validation.
- Buyer, provider, and operator scopes remain separate.
- Every signed body-bearing authentication route must receive the required body-digest middleware, including **`POST /v1/installation/reauthorize`**.
- Regression tests must exercise the **actual production application wiring**. A harness that installs middleware globally cannot establish that the deployed route is wired correctly.
- Existing connections, identities, usage, receipts, and liabilities must remain readable and recoverable through any contract migration.

**6. Acceptance criteria**

The operator creates a fresh connection for the controlled rerun. Existing connections, credentials, installations, saved work, and liabilities remain preserved. Keep live acceptance **failed/incomplete** until that rerun succeeds; synthetic success cannot close it. Preserve alpha.33 and deliver the next unused immutable private version from clean committed source, verify installed bytes and actual Mac VM/PTY gates before switching the launcher. Retain the current Router image, Pages deployment, private access policy, and spending controls.

The fresh-setup checklist covers Pro qualification, custom API setup, buyer coding, rejected then approved Apply, eleven-minute idle, same-VM reconnect without replay, Stop/teardown, restart, and retained credentials. Inject HTTP rejection, transport loss, timeout, failed polling, lost qualification/publication responses, stale callbacks, and failed cleanup; assert actionable diagnostics, preserved reservations, and no automatic inference replay.

| Scenario | Pass condition |
|---|---|
| Built-in provider | A real authorized API completes setup, qualification, serving, and shutdown through the installed provider VM. The requested DeepSeek configuration is verified against the actual endpoint. |
| Custom endpoint | A compatible API absent from ADRv2’s catalog works without adding a vendor-specific allowlist entry. Manual model IDs work when discovery is unavailable. |
| Multiple models | One connection offers at least two models; buyers select either, and unauthorized model requests are rejected. |
| Credential persistence | Restarting the provider reuses the saved credential. Another account cannot use it. Disconnect removes it. |
| Limits | Usage across models and buyers consumes the same allowance. Qualification, concurrency, restarts, recovery, and unknown outcomes cannot bypass it. |
| Authentication | Buyer, provider, and operator each complete login, two natural refreshes, profile switching, recovery, and logout with preserved role isolation. |
| Failure recovery | Expired tokens, uncertain refresh, browser cancellation, revoked installations, offline logout, and interrupted local state all have working TUI recovery paths. |
| Production route regression | Valid recovery proofs succeed through production middleware; tampered, replayed, or wrongly scoped requests fail. Recovery preserves the expected bindings. |
| Buyer lifecycle | Streaming, coding tools, Stop, teardown, provider restart, and a second session work with accurate usage and no replay. |
| Delivery evidence | Checks and relevant hosted acceptance identify the exact Router and ADRv2 artifacts tested. Results from an unchanged baseline do not certify changed artifacts. |
