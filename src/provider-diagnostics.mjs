// Metadata only. Never use exception messages, bodies, headers or guest output.
const label = (value, pattern = /^[a-zA-Z0-9_-]{1,80}$/) => typeof value === 'string' && pattern.test(value) ? value : null;
export function providerDiagnostic(phase, error = {}, context = {}, now = Date.now) {
  const status = error.statusCode ?? error.status;
  const code = label(error.code) ?? 'provider_control_failed';
  return { phase: label(phase), code, statusCode: Number.isInteger(status) && status >= 100 && status <= 599 ? status : null,
    observedAt: now(), kind: /cancelled|operator_stop/.test(code) ? 'cancelled' : /timeout/.test(code) || error.name === 'TimeoutError' ? 'timeout' : 'failed',
    provider: label(context.provider), model: label(context.model, /^[a-zA-Z0-9_@/:. -]{1,256}$/), api: label(context.api),
    providerRunId: label(context.providerRunId), requestId: label(context.requestId),
    maxOutputTokens: Number.isSafeInteger(context.maxOutputTokens) ? context.maxOutputTokens : null };
}
export function providerDiagnosticLines(d) {
  if (!d) return [];
  return [`Failure phase: ${d.phase} · ${d.kind ?? 'failed'} · ${d.code}`, `HTTP ${d.statusCode ?? 'unavailable'} · ${Number.isSafeInteger(d.observedAt??d.at)?new Date(d.observedAt??d.at).toISOString():'time unavailable'}`,
    ...(d.model ? [`Model: ${d.model} · API: ${d.api ?? 'unknown'}`] : []),
    ...(d.providerRunId ? [`Run: ${d.providerRunId}`] : []), ...(d.requestId ? [`Check/request: ${d.requestId}`] : [])];
}
export function providerCanLaunch(controller) {
  if (!controller) return true;
  const s = controller.status;
  return s.stopped === true && s.teardownVerified === true && !s.cleanupRequired && !s.recoveryPending;
}
