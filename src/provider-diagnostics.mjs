import { safeFailure, failureLines } from './failure-diagnostics.mjs';
// Metadata only. Never use exception messages, bodies, headers or guest output.
const label = (value, pattern = /^[a-zA-Z0-9_-]{1,80}$/) => typeof value === 'string' && pattern.test(value) ? value : null;
export const operationSources = Object.freeze({
  setup_reserve: 'router_control', setup_model_request: 'upstream_api', setup_response_validate: 'model_response_validation',
  setup_report_save: 'local_storage', setup_report_submit: 'router_reporting', setup_report_confirm: 'router_reporting',
  configure_models: 'router_configuration', publication: 'router_configuration',
  remote_stop: 'router_control', guest_removal: 'local_runtime', broker_cleanup: 'local_runtime',
  execution_release: 'router_reporting', check_execution_release: 'router_reporting', cleanup_failure_report: 'router_reporting',
  request:'upstream_api', diagnostic_save: 'local_storage', check_inspection: 'router_reporting'
});
const historicalOperations = Object.freeze({qualification_complete:'setup_report_submit', qualification_response_validation:'setup_response_validate',
  qualification_tool:'setup_model_request',qualification_roundtrip:'setup_model_request',qualification_setup_probe:'setup_model_request'});
const evidenceValues = ['not_sent','response_received','outcome_unknown'];
export function providerDiagnostic(phase, error = {}, context = {}, now = Date.now) {
  const detail=safeFailure(context.failureDiagnostic??error.failureDiagnostic);
  const status = detail?detail.statusCode:error.statusCode ?? error.status;
  const operation = label(context.operation ?? error.operation) ?? historicalOperations[phase] ?? label(phase);
  const code = /^[a-z][a-z0-9_]{0,79}$/.test(error.code??'')?error.code:operation==='setup_report_save'?'completion_report_save_failed':'provider_control_failed';
  const evidence = detail?(detail.responseEvidence!=='not_observed'?'response_received':detail.dispatchEvidence==='not_sent'?'not_sent':'outcome_unknown'):context.requestEvidence ?? error.requestEvidence ?? (context.requestId ? 'outcome_unknown' : 'not_sent');
  const transport = detail?.transportCategory ?? label(error.transportCause) ?? ({upstream_timeout:'timeout',network_timeout:'timeout',upstream_connection_failed:'connection',network_unavailable_outcome_unknown:'connection'}[code] ?? null);
  return { ...(detail?{failureDiagnostic:detail,transportCode:detail.transportCode}:{}), sessionId:label(context.sessionId??error.sessionId), operation, provenance:operationSources[operation] ?? 'local_runtime', transportCause:transport,
    elapsedMs:detail?detail.elapsedMs:Number.isSafeInteger(error.elapsedMs)&&error.elapsedMs>=0?error.elapsedMs:null,
    requestEvidence:evidenceValues.includes(evidence)?evidence:'outcome_unknown',
    changedFields:Array.isArray(error.changedFields)?error.changedFields.slice(0,32).filter(v=>/^(provider|connectorProtocol|supplyClass|fields|connection\.[a-zA-Z]+)$/.test(v)):[],
    phase: label(phase), code, statusCode: Number.isInteger(status) && status >= 100 && status <= 599 ? status : null,
    observedAt: Number.isSafeInteger(context.observedAt)?context.observedAt:now(),
    kind: /cancelled|operator_stop/.test(code) ? 'cancelled' : /timeout/.test(code) || error.name === 'TimeoutError' ? 'timeout' : 'failed',
    provider: label(context.provider), model: label(context.model, /^[a-zA-Z0-9_@/:. -]{1,256}$/), api: label(context.api, /^[a-zA-Z0-9_@/:.-]{1,160}$/),
    nodeId:label(context.nodeId),providerRunId: label(context.providerRunId), requestId: label(context.requestId ?? context.checkId),
    maxOutputTokens: Number.isSafeInteger(context.maxOutputTokens) ? context.maxOutputTokens : null };
}
export function capturedDiagnostic(value, binding = {}) {
  if (!value || typeof value !== 'object' || !label(value.code)) return null;
  const d = providerDiagnostic(value.phase ?? value.operation, value, {...value,...binding,requestEvidence:value.requestEvidence??'outcome_unknown',observedAt:value.observedAt ?? value.at}, () => null);
  return d;
}
export const setupResponseCodes = ['setup_probe_missing','setup_probe_wrong_tool','setup_probe_invalid_arguments','setup_response_truncated'];
export function setupProbeFailure(result) {
  if (result.nativeMessage?.stopReason === 'length') return 'setup_response_truncated';
  const calls = result.toolCalls;
  if (!Array.isArray(calls) || calls.length === 0) return 'setup_probe_missing';
  if (calls.length !== 1 || calls[0]?.function?.name !== 'adr_setup_probe') return 'setup_probe_wrong_tool';
  try { const args = JSON.parse(calls[0].function.arguments); if (!args || Array.isArray(args) || Object.keys(args).length !== 1 || args.value !== 'ready') return 'setup_probe_invalid_arguments'; }
  catch { return 'setup_probe_invalid_arguments'; }
  return null;
}
const explanations = Object.freeze({setup_probe_missing:'The model response did not contain the required setup probe.',setup_probe_wrong_tool:'The model called the wrong tool or called more than one tool.',setup_probe_invalid_arguments:'The setup probe arguments did not match the required value.',setup_response_truncated:'The model response ended at its output limit before completing the setup probe.'});
export function providerDiagnosticLines(d) {
  if (!d) return [];
  if(safeFailure(d.failureDiagnostic))return failureLines(d.failureDiagnostic);
  return [`${/^(qualification|configure_models)/.test(d.phase??d.operation??'')?'SETUP FAILED':'Operation'} — ${d.operation??d.phase??'operation unavailable'}`,`Cause: ${d.code??'Cause not captured'} · ${d.provenance??'source not captured'}`, ...(explanations[d.code]?[explanations[d.code]]:[]),`Model request: ${d.requestEvidence==='not_sent'?'No model request sent':d.requestEvidence==='response_received'?'Response received':'Outcome unknown'}`,`Transport: ${d.transportCause??'Transport cause not captured'}`, ...(Number.isSafeInteger(d.elapsedMs)?[`Elapsed: ${d.elapsedMs} ms`]:[]), ...(d.changedFields?.length?[`Changed settings: ${d.changedFields.join(', ')}`]:[]), `HTTP ${d.statusCode ?? 'unavailable'} · ${Number.isSafeInteger(d.observedAt??d.at)?new Date(d.observedAt??d.at).toISOString():'time unavailable'}`,
    ...(d.model ? [`Model: ${d.model} · API: ${d.api ?? 'unknown'}`] : []),
    ...(d.providerRunId ? [`Run: ${d.providerRunId}`] : []), ...(d.requestId||d.checkId ? [`Check/request: ${d.requestId??d.checkId}`] : [])];
}
export function providerCanLaunch(controller) {
  if (!controller) return true;
  const s = controller.status;
  return s.stopped === true && s.teardownVerified === true && !s.cleanupRequired && !s.recoveryPending;
}
