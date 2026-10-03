# Staged private artifact acceptance

This tooling is supplemental verification source in `adrouter/adrouter-new`. It does not replace the packaged client, switch the launcher, enroll an installation in CI, or call a paid provider during preparation. Router regression source lives in `HappyCool121/adrouter-dashboard`.

Run `node scripts/acceptance-runner.mjs --help` from the verifier checkout. `prepare` is the default. Each invocation requires a new evidence directory. Phases never advance automatically. Exit 0 means the requested phase completed; exit 2 means mandatory gates remain incomplete; exit 1 means a failure or interruption. The report separates synthetic compatibility, hosted authentication, readiness and live acceptance.

## Changed product artifacts

Pass `--artifact-manifest /absolute/acceptance-manifest.json` for a new frozen artifact.
The receipt contains exactly `productCommit`, `baselineVerifierCommit`, `routerCommit`,
`version`, `artifactSha256`, `deployment`, `flyDigest`, and `pagesSourceCommit`. Router
and client commits, installed bytes and hashes are checked independently. Pages can
remain on its previous source while the API advances. A changed artifact cannot use
`--reuse-baseline`. The Router regression gate launches the actual production app with
all canonical migrations in a disposable database and runs the installed guest credential
disk test. Full coding/660-second lifecycle gates run anew.

## Historical alpha.31 preparation example

The baseline is product `da3eba1b950d5aca5713028448a1ed3a843879c0`, supplemental verifier `ff1a11816527783f7d72ee84eb60e9c84bc09275`, Router/WebUI product `3b3964f07653c6cc9f17c3c1cedf8d284eddfa94`, and the alpha.31 artifact SHA-256 in `scripts/acceptance/baseline.mjs`. Product and supplemental verifier identities remain separate. A later verifier commit can retain this baseline only while product inputs remain identical. Router tests have their own commit/tree identity. The runner also hashes current verification source and rejects a source change during execution.

Example on the recorded operator workspace:

```sh
adr_workspace_root=/Users/ahmadzuhri/antigravity/3days
node scripts/acceptance-runner.mjs \
  --client-root "$adr_workspace_root/outputs/adr-auth-recovery-2026-10-03/install-alpha31/node_modules/@adrouter/adr-cli" \
  --router-root "$adr_workspace_root/.reliability/router-ux" \
  --runtime-paths "$adr_workspace_root/outputs/adr-auth-recovery-2026-10-03/runtime-paths.json" \
  --tarball "$adr_workspace_root/outputs/adr-auth-recovery-2026-10-03/artifacts/adrouter-adr-cli-0.1.0-alpha.31.tgz" \
  --evidence "$adr_workspace_root/outputs/adr-verification-2026-10-03/prepare-FRESH" \
  --pages-cli "$adr_workspace_root/router/webui/node_modules/.bin/wrangler" \
  --database-workdir "$adr_workspace_root/outputs/adr-acceptance-repairs-2026-10-02/database-preflight" \
  --reuse-baseline "$adr_workspace_root/outputs/adr-auth-recovery-2026-10-03"
```

Use explicit absolute paths; an existing evidence directory is refused. The artifact verifier compares the complete tarball inventory, every installed byte, baseline committed product source, current product inputs and runtime provenance. It never rebuilds or changes versions to resolve a mismatch. Normal platform CLIs verify fresh Fly Machine/image identity, Pages deployment/Git integration, the active linked Supabase project/migration and canonical GitHub access. No database migration is applied. All five platform authentication checks are required before implementation and rechecked before release mutation. This is private verification, with publication disabled.

The source and guest matrices derive every selectable provider/API pair and serialization variant from the generated catalog. Synthetic public fields include Azure resource names and Cloudflare account IDs. Real pinned factories log in in API-key mode, with a synthetic `sk-` key so OpenAI's adapter does not select its subscription-token behavior. All six API family fixtures check authentication, endpoint/model/output serialization, fragmented streams and tool arguments, validated tools, tool-result continuation, subsequent turns, final usage, failure/cancellation and no replay. Additional fixtures retain opaque reasoning signatures and cache/reasoning accounting.

`verify-pi-guest.mjs` runs the tests in an actual installed Mac provider guest with networking disabled. It requires every matrix case identifier to pass exactly once and rejects skips, duplicates, missing cases and any suite failure. Source CI runs the same identifier validation on macOS and Linux; it does not establish Linux/KVM acceptance.

Coding and full 660-second lifecycle gates can reuse the recorded alpha.31 evidence when artifact/runtime/product identities and relevant client/Router verifier helpers match. Changed auth, relay, runtime or packaged inputs invalidate reuse and require a corrective immutable artifact and the affected actual-VM gates. Omit `--reuse-baseline` to run those full gates. The hidden-key/return/teardown/terminal gate runs again. A fresh two-file coding fixture and `live-checklist.md` are generated in the evidence directory.

## Explicit hosted authentication

Only run when profile acceptance/recovery is requested. Reuse the prepare arguments with `--phase hosted-auth`, a new `--evidence`, `--prior-report /absolute/prepare/report.json`, and `--auth-config /absolute/auth-expectations.json`. Add `--recover-broken` only when repair of broken existing profiles is requested. Repair uses normal installed-client recovery with the original account and installation, one native Safari approval at a time. A healthy profile is reused; a revoked/missing profile is not silently replaced.

The non-secret expectations file has exactly this structure. Replace the placeholders with SHA-256 hashes of original approved metadata. Obtain account/installation IDs from normal `whoami` and the WebUI's installation metadata; do not read credential files. Keep this file local rather than pasting account data into chat.

```json
{
  "roles": {
    "provider": { "accountSha256": "HASH", "installationSha256": "HASH", "bindingsSha256": "HASH" },
    "buyer": { "accountSha256": "HASH", "installationSha256": "HASH" },
    "operator": { "accountSha256": "HASH", "installationSha256": "HASH" }
  }
}
```

Account and installation hashes use the UUID string without a newline. The provider binding hash uses `JSON.stringify` of the normal `/v2/providers/nodes` response projected to `{id, installationId, provider, models}` and sorted by node ID. It excludes keys, workload and accounting values. This verifies saved provider bindings rather than treating a newly selected account as successful recovery.

The phase checks all three exact role scopes, positive and negative read access, two natural access expiries with concurrent reads, profile switching/reopening, and original bindings. It never changes hosted TTL or stored expiry. Temporary/recovery/revoked UI observations require explicit operator observation; an unobservable state stays incomplete.

Two buyer installations enroll normally in separate disposable homes. For the first, revoke only that installation in native Safari `/installations`, reload and observe hiding; the runner tests protected rejection and repeated normal logout. For the second, the runner waits for normal expiry and observes scheduled access cleanup using only an aggregate count for that disposable installation, then tests key-proven expired-token logout. It never invokes cleanup, deletes hosted token rows, or changes real refresh state. Disposable homes are printed to the operator terminal for recovery and kept outside the report directory. Interrupted or declined controls leave credentials available for normal logout; finish cleanup through normal APIs before removing those homes.

No credential or approval URL is saved in reports. Safari receives the current normal enrollment URL; the comparison code is displayed only in the operator terminal. The verifier observes sanitized metadata through the installed Network interface and does not inspect real credential files.

## Explicit DeepSeek live acceptance

Only run when paid execution is requested. Add `--phase live`, a fresh `--evidence`, the completed hosted-auth `--prior-report`, `--auth-config`, and `--run-config /absolute/run-bounds.json`. The run file contains exactly `nodeId`, `dispatchLimit`, `maxOutputTokens`, `maximumMicrousd`, `maximumTokens` and `maximumTestCredits`. Choose explicit integer bounds; dispatch limit must allow at least seven dispatches across two qualifications, coding and refresh follow-up. Review the saved DeepSeek connection and enforce the run spending/output caps through normal controls before invoking live acceptance. Existing consumption and outstanding liabilities remain part of remaining authority.

The runner refuses incomplete preparation/authentication, changed identities, unexpected model/API selection, excess remaining authority, insufficient qualification allowance or unaccepted installations. It observes all three role installations again. Follow the generated checklist in separate provider and buyer terminals. The operator enters the key inside the provider guest and chooses Start. **Start is paid**, including qualification before a buyer connects. The verifier never presses Start, enters a key, approves a tool or dispatches inference.

Set buyer `--max-calls` so the first session reserves dispatch room for the second qualification and session. The runner checks each accepted request limit against the remaining total dispatch ceiling. Backend state must confirm both qualification checks for the current run/revision and actual readiness. Accepted sessions must retain their model, API, tariff, rates, installations and bounds. Operator attestations identify observed guest tool/test success and terminal/guest teardown; backend checks establish request progression, normal refresh, Stop, distinct restart and second session. Never paste model or tool output into the verifier. A missing or safely unobservable subcase remains incomplete. If a boundary fails, stop through normal controls, retain evidence and uncertain liabilities, and do not replay inference or tools. A DeepSeek pass does not qualify other providers.

## Evidence and interruption

`report.json` is atomically checkpointed after completed gates. It contains only identities, case/gate IDs, statuses, sanitized error codes, timestamps, hashes and relative evidence references. The validator rejects unknown fields, duplicate/missing gates, unjustified N/A, success without evidence and invented verdicts. Account/installation expectation hashes bind hosted gates to the same three profiles in live acceptance; substituting another account or installation is refused. Evidence hashes are checked before carrying gates into a later phase, and incomplete/interrupted prior runs cannot authorize live testing. SIGINT/SIGTERM retain completed evidence and leave unfinished gates incomplete. Live acceptance cannot pass an unfinished or interrupted report.

Verifier-only files remain outside the package allowlist. Product changes require a new immutable tarball and installed verification; Router changes require an independently verified API deployment. Preserve all alpha.31 release evidence. If a focused test demonstrates a product defect, follow the owning repository's corrective-release path rather than weakening identity checks or overwriting alpha.31.
