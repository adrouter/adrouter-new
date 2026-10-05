// Metadata only. Never use exception messages, bodies, headers or guest output.
const label = (value, pattern = /^[a-zA-Z0-9_-]{1,80}$/) => typeof value === 'string' && pattern.test(value) ? value : null;
export function providerDiagnostic(phase, error = {}, context = {}, now = Date.now) {
  const status = error.statusCode ?? error.status;
  const code = label(error.code) ?? 'provider_control_failed';
  return { provenance:/configure|publication/.test(phase)?'router_configuration':/complete|report|inspection/.test(phase)?'router_reporting':/^qualification_/.test(phase)?'upstream_api':/auth/.test(code)?'authentication':/cleanup|removal|teardown/.test(phase)?'cleanup':'local_runtime', transportCause:label(error.transportCause), elapsedMs:Number.isSafeInteger(error.elapsedMs)?error.elapsedMs:null, requestEvidence:context.requestEvidence??error.requestEvidence??(context.requestId?'outcome_unknown':'not_sent'), changedFields:Array.isArray(error.changedFields)?error.changedFields.filter(v=>/^(provider|connectorProtocol|supplyClass|fields|connection\.[a-zA-Z]+)$/.test(v)):[], phase: label(phase), code, statusCode: Number.isInteger(status) && status >= 100 && status <= 599 ? status : null,
    observedAt: now(), kind: /cancelled|operator_stop/.test(code) ? 'cancelled' : /timeout/.test(code) || error.name === 'TimeoutError' ? 'timeout' : 'failed',
    provider: label(context.provider), model: label(context.model, /^[a-zA-Z0-9_@/:. -]{1,256}$/), api: label(context.api),
    providerRunId: label(context.providerRunId), requestId: label(context.requestId),
    maxOutputTokens: Number.isSafeInteger(context.maxOutputTokens) ? context.maxOutputTokens : null };
}
export function providerDiagnosticLines(d) {
  if (!d) return [];
  return [`${/^(qualification|configure_models)/.test(d.phase??d.operation??'')?'SETUP FAILED':'Operation'} — ${d.phase??d.operation??'operation unavailable'}`,`Cause: ${d.code??'Cause not captured'} · ${d.provenance??'source not captured'}`,`Model request: ${d.requestEvidence==='not_sent'?'No model request sent':d.requestEvidence==='response_received'?'Response received':'Outcome unknown'}`,`Transport: ${d.transportCause??'Transport cause not captured'}`, ...(Number.isSafeInteger(d.elapsedMs)?[`Elapsed: ${d.elapsedMs} ms`]:[]), ...(d.changedFields?.length?[`Changed settings: ${d.changedFields.join(', ')}`]:[]), `HTTP ${d.statusCode ?? 'unavailable'} · ${Number.isSafeInteger(d.observedAt??d.at)?new Date(d.observedAt??d.at).toISOString():'time unavailable'}`,
    ...(d.model ? [`Model: ${d.model} · API: ${d.api ?? 'unknown'}`] : []),
    ...(d.providerRunId ? [`Run: ${d.providerRunId}`] : []), ...(d.requestId||d.checkId ? [`Check/request: ${d.requestId??d.checkId}`] : [])];
}
export function providerCanLaunch(controller) {
  if (!controller) return true;
  const s = controller.status;
  return s.stopped === true && s.teardownVerified === true && !s.cleanupRequired && !s.recoveryPending;
}
