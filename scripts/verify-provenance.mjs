import { readFile } from 'node:fs/promises';
import { createHash } from 'node:crypto';
import assert from 'node:assert/strict';
const metadata = JSON.parse(await readFile(new URL('../src/generated/provenance.json', import.meta.url)));
assert.equal(metadata.repository, 'https://github.com/HappyCool121/adrouter-dashboard');
for (const revision of [metadata.revision, metadata.generatorRevision]) assert.match(revision, /^[a-f0-9]{40}$/);
for (const digest of [metadata.sourceSha256, metadata.generatorSha256, metadata.validatorsSha256]) assert.match(digest, /^[a-f0-9]{64}$/);
const bytes = await readFile(new URL('../src/generated/validators.mjs', import.meta.url));
assert.equal(createHash('sha256').update(bytes).digest('hex'), metadata.validatorsSha256);
// Full cross-repository drift verification is the Router generator's --check.
// This local check detects accidental projection corruption, not source trust.
console.log('generated validator integrity passed');
