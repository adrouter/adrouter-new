import { createHash } from 'node:crypto';
import { readFile, writeFile, rename, lstat, realpath } from 'node:fs/promises';
import { join } from 'node:path';
export const phases = ['prepare', 'hosted-auth', 'live'];
export const preparationGates = ['artifact', 'runtime', 'hosted-metadata', 'catalog-source', 'catalog-guest', 'router-regressions', 'coding', 'lifecycle', 'guest-console'];
export const authGates = ['provider.identity', 'buyer.identity', 'operator.identity', 'provider.access', 'buyer.access', 'operator.access', 'provider.refresh-1', 'provider.refresh-2', 'buyer.refresh-1', 'buyer.refresh-2', 'operator.refresh-1', 'operator.refresh-2', 'profile-switch-reopen', 'recovery-states', 'disposable.webui-revoke', 'disposable.protected-reject', 'disposable.logout', 'disposable.expiry-cleanup', 'disposable.expired-logout'];
export const liveGates = ['live.bounds', 'live.installations', 'live.qualification', 'live.readiness', 'live.coding-tools', 'live.refresh-followup', 'live.stop-teardown', 'live.restart', 'live.second-session', 'live.final-teardown'];
export const gateIds = [...preparationGates, ...authGates, ...liveGates];
export const digest = bytes => createHash('sha256').update(bytes).digest('hex');
export const safeCode = error => ['cancelled','interrupted'].includes(error?.code) ? error.code : /^[a-z][a-z0-9_]{0,79}$/.test(error?.code ?? '') ? error.code : 'verification_failed';
const exact = (value, keys) => value && typeof value === 'object' && !Array.isArray(value) && Object.keys(value).every(k => keys.includes(k));
const hex = value => /^[a-f0-9]{64}$/.test(value ?? '');
export function evidenceReference(path, sha256) {
  if (!/^[a-zA-Z0-9_./-]+$/.test(path) || path.startsWith('/') || path.split('/').some(x => !x || x === '..' || x === '.') || !hex(sha256)) throw Object.assign(Error(), { code: 'evidence_reference_invalid' });
  return { path, sha256 };
}
export function newReport(phase, identities) {
  if (!phases.includes(phase)) throw Object.assign(Error(), { code: 'phase_invalid' });
  return { schemaVersion: 1, phase, startedAt: new Date().toISOString(), finishedAt: null, interrupted: false, errorCode: null, identities, gates: gateIds.map(id => ({ id, status: 'not_run', observedAt: null, code: null, evidence: [] })), verdicts: {} };
}
export function verdicts(report) {
  const passed = ids => ids.every(id => report.gates.find(g => g.id === id)?.status === 'passed');
  const syntheticCompatibility = passed(['artifact','runtime','catalog-source','catalog-guest','router-regressions','coding','lifecycle','guest-console']);
  const hostedAuthentication = passed(authGates);
  const readiness = syntheticCompatibility && passed(['hosted-metadata']) && hostedAuthentication && report.errorCode===null;
  return { syntheticCompatibility: syntheticCompatibility ? 'passed' : 'incomplete', hostedAuthentication: hostedAuthentication ? 'passed' : 'incomplete', readiness: readiness ? 'ready' : 'incomplete', liveAcceptance: report.finishedAt!==null && !report.interrupted && readiness && passed(liveGates) ? 'passed' : 'incomplete' };
}
export function validateReport(report) {
  if (!exact(report, ['schemaVersion','phase','startedAt','finishedAt','interrupted','errorCode','identities','gates','verdicts']) || report.schemaVersion !== 1 || !phases.includes(report.phase) || typeof report.interrupted !== 'boolean') throw Object.assign(Error(), { code: 'report_invalid' });
  if(report.errorCode!==null&&!/^[a-z][a-z0-9_]{0,79}$/.test(report.errorCode??''))throw Object.assign(Error(),{code:'report_error_invalid'});
  if (!exact(report.identities, ['productCommit','baselineVerifierCommit','verifierCommit','verifierTreeSha256','routerCommit','routerVerifierCommit','routerVerifierTreeSha256','version','artifactSha256','runtimeSha256','librarySha256','providerRuntimeSha256','codingRuntimeSha256','catalogSha256','deployment','authExpectationsSha256']) || Object.keys(report.identities).length!==16 || !Object.values(report.identities).every(v => typeof v === 'string' && /^[a-zA-Z0-9_.:-]{1,128}$/.test(v))) throw Object.assign(Error(), { code: 'report_identity_invalid' });
  if(report.startedAt===null)throw Object.assign(Error(),{code:'report_timestamp_invalid'});
  for (const date of [report.startedAt, report.finishedAt]) if (date !== null && (!/^\d{4}-\d\d-\d\dT[\d:.]+Z$/.test(date ?? '') || !Number.isFinite(Date.parse(date)))) throw Object.assign(Error(), { code: 'report_timestamp_invalid' });
  if (!Array.isArray(report.gates) || report.gates.length !== gateIds.length || new Set(report.gates.map(g => g.id)).size !== gateIds.length) throw Object.assign(Error(), { code: 'report_cases_invalid' });
  for (const g of report.gates) {
    if (!exact(g, ['id','status','observedAt','code','evidence']) || !gateIds.includes(g.id) || !['passed','failed','not_run','not_applicable'].includes(g.status) || !Array.isArray(g.evidence) || (g.code !== null && !/^[a-z][a-z0-9_]{0,79}$/.test(g.code ?? ''))) throw Object.assign(Error(), { code: 'report_gate_invalid' });
    // All current gates are mandatory; N/A cannot close readiness.
    if (g.status === 'not_applicable' && !g.code) throw Object.assign(Error(), { code: 'report_na_unjustified' });
    if (g.status === 'passed' && (!g.evidence.length || !Number.isFinite(Date.parse(g.observedAt)))) throw Object.assign(Error(), { code: 'report_evidence_missing' });
    if(g.status==='failed'&&(!g.code||!Number.isFinite(Date.parse(g.observedAt))))throw Object.assign(Error(),{code:'report_failure_invalid'});
    if (g.status === 'not_run' && (g.evidence.length || g.observedAt !== null || g.code !== null)) throw Object.assign(Error(), { code: 'report_unobserved_gate' });
    for (const e of g.evidence) { if (!exact(e,['path','sha256'])) throw Object.assign(Error(),{code:'evidence_reference_invalid'}); evidenceReference(e.path,e.sha256); }
  }
  if(report.gates.find(g=>g.id==='runtime')?.status==='passed'&&['runtimeSha256','librarySha256','providerRuntimeSha256','codingRuntimeSha256','catalogSha256'].some(k=>!hex(report.identities[k])))throw Object.assign(Error(),{code:'report_runtime_identity_missing'});
  if(report.gates.some(g=>authGates.includes(g.id)&&g.status==='passed')&&!hex(report.identities.authExpectationsSha256))throw Object.assign(Error(),{code:'report_auth_identity_missing'});
  const expected = verdicts(report);
  if (JSON.stringify(report.verdicts) !== JSON.stringify(expected)) throw Object.assign(Error(), { code: 'report_verdict_invalid' });
  return report;
}
export async function checkpoint(directory, report) {
  report.verdicts = verdicts(report); validateReport(report);
  await writeFile(join(directory, 'report.tmp'), JSON.stringify(report, null, 2) + '\n', { mode: 0o600 });
  await rename(join(directory, 'report.tmp'), join(directory, 'report.json'));
}
export async function verifyEvidence(directory, report) {
  validateReport(report);
  for (const g of report.gates) for (const e of g.evidence) {const path=join(directory,e.path);if(!(await lstat(path)).isFile()||(await lstat(path)).isSymbolicLink()||!(await realpath(path)).startsWith((await realpath(directory))+'/')||digest(await readFile(path))!==e.sha256)throw Object.assign(Error(),{code:'evidence_integrity_mismatch'});}
  return report;
}

export function validateSyntheticResult(result,expected) {
 if(!exact(result,['status','requiredCases','auxiliaryFailed','foreignCases','duplicateCases','paidInference','providerApiPairs','nativeFamilies','platform'])||!['passed','failed'].includes(result.status)||result.paidInference!==false||typeof result.duplicateCases!=='boolean'||!['auxiliaryFailed','foreignCases','providerApiPairs','nativeFamilies'].every(k=>Number.isSafeInteger(result[k])&&result[k]>=0)||result.platform!==undefined&&result.platform!=='darwin-arm64')throw Object.assign(Error(),{code:'synthetic_result_invalid'});
 if(!Array.isArray(result.requiredCases)||result.requiredCases.length!==expected.length||new Set(result.requiredCases.map(c=>c.id)).size!==expected.length)throw Object.assign(Error(),{code:'synthetic_cases_invalid'});
 for(const c of result.requiredCases)if(!exact(c,['id','status'])||Object.keys(c).length!==2||!expected.includes(c.id)||!['passed','failed','not_run'].includes(c.status))throw Object.assign(Error(),{code:'synthetic_cases_invalid'});
 if(result.status==='passed'&&(result.auxiliaryFailed||result.foreignCases||result.duplicateCases||result.requiredCases.some(c=>c.status!=='passed')))throw Object.assign(Error(),{code:'synthetic_success_invalid'});
 return result;
}
