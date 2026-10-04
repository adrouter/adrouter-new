# AdRouter New

Follow ../../AGENTS.md and ../AGENTS.md. This repository is explicitly authorized by
the V2 MVP 1 plan at https://github.com/adrouter/adrouter-new. Router contracts come
from https://github.com/HappyCool121/adrouter-dashboard; this repository does not
own or widen them. Preserve legacy repositories, packages and identities.

Only authorized_api and self_hosted supply, using inference_connector_v1. No
provider-side buyer tools, arbitrary proxying, upstream credential export or
subscription capacity. Model engines stay outside the connector sandbox.

Use Node 22 or newer and the npm lockfile. Run npm test and npm run check.
Generated contracts and release evidence are produced by scripts, never edited.
Runtime tests require actual microVMs; mocks cannot satisfy platform acceptance.
Package remains private until the release gates are implemented and satisfied.
Publish immutable candidate first, retain the draft release through acceptance,
then alpha only. No mainnet and no latest promotion.

## Marketplace coding UI

ADRv2 coding has no presence/“Are you still there?” checkpoint. Preserve host action approvals, accepted session expiry/request limits, spending enforcement and provider keepalive. Pi thinking capabilities come from verified model/adapter metadata, with no provider setup toggle; buyer thinking remains opt-in and initially off. Cost display uses accepted listing test-credit rates; sponsorship and USD settlement never enter model/tool context.
