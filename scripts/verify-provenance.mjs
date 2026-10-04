import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const metadata = JSON.parse(await readFile(new URL('../src/generated/provenance.json', import.meta.url)));
assert.equal(metadata.repository, 'https://github.com/HappyCool121/adrouter-dashboard');
for (const revision of [metadata.revision, metadata.generatorRevision]) assert.match(revision, /^[a-f0-9]{40}$/);
for (const digest of [metadata.sourceSha256, metadata.generatorSha256, metadata.validatorsSha256]) assert.match(digest, /^[a-f0-9]{64}$/);
const bytes = await readFile(new URL('../src/generated/validators.mjs', import.meta.url));
assert.equal(createHash('sha256').update(bytes).digest('hex'), metadata.validatorsSha256);
if(metadata.connectorsSha256)assert.equal(createHash('sha256').update(await readFile(new URL('../src/generated/connectors.mjs',import.meta.url))).digest('hex'),metadata.connectorsSha256);
// Full cross-repository drift verification is the Router generator's --check.
// This local check detects accidental projection corruption, not source trust.
console.log('generated validator integrity passed');

const pi = JSON.parse(await readFile(new URL('../pi-provenance.lock.json', import.meta.url)));
assert.equal(pi.version, '0.85.1'); assert.equal(pi.revision, 'd981de1229ef899957bbe968bc8dcda02a21f477');
for (const [path, entry] of Object.entries(pi.files)) assert.equal(createHash('sha256').update(await readFile(new URL(`../src/vendor/pi/${path}`, import.meta.url))).digest('hex'), entry.outputSha256);
console.log('Pi component provenance passed');

if(metadata.piProjectionSha256)assert.equal(createHash('sha256').update(await readFile(new URL('../src/generated/pi-catalog.mjs',import.meta.url))).digest('hex'),metadata.piProjectionSha256);

assert.equal(createHash('sha256').update(await readFile(new URL('../src/generated/provider-catalog.mjs',import.meta.url))).digest('hex'),metadata.providerProjectionSha256);

if(metadata.providerBudgetProjectionSha256)assert.equal(createHash('sha256').update(await readFile(new URL('../src/generated/provider-budget.mjs',import.meta.url))).digest('hex'),metadata.providerBudgetProjectionSha256);
