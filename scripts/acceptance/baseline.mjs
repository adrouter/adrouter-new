// Immutable identities from docs/adr-auth-recovery-alpha31-2026-10-03.md.
export let baseline = Object.freeze({
 productCommit:'da3eba1b950d5aca5713028448a1ed3a843879c0',
 baselineVerifierCommit:'ff1a11816527783f7d72ee84eb60e9c84bc09275',
 routerCommit:'3b3964f07653c6cc9f17c3c1cedf8d284eddfa94',
 version:'0.1.0-alpha.31',
 artifactSha256:'a31a71614ceecd47e788bc974250782779731ccd942da850ba36a15a85da1f2c',
 deployment:'abfaca46-e61c-4487-9360-8d6364e734f8',
 flyDigest:'sha256:919c3215e8476be4b86fed10c7272b9265b9c0690564e9dcf60966bfc01bfa11'
});

// New private artifacts supply immutable identities through a separate receipt.
// Earlier alpha.31 evidence is never reused for changed product bytes.
export function configureBaseline(value) {
 const required=['productCommit','baselineVerifierCommit','routerCommit','version','artifactSha256','deployment','flyDigest','pagesSourceCommit'];
 if(!value||Object.keys(value).sort().join(',')!==required.sort().join(','))throw Error('artifact_manifest_invalid');
 for(const key of ['productCommit','baselineVerifierCommit','routerCommit','pagesSourceCommit'])if(!/^[a-f0-9]{40}$/.test(value[key]))throw Error('artifact_manifest_invalid');
 if(!/^0\.1\.0-alpha\.[0-9]+$/.test(value.version)||!/^[a-f0-9]{64}$/.test(value.artifactSha256)||!/^sha256:[a-f0-9]{64}$/.test(value.flyDigest)||!/^[a-f0-9-]{36}$/.test(value.deployment))throw Error('artifact_manifest_invalid');
 baseline=Object.freeze({...value});return baseline;
}
