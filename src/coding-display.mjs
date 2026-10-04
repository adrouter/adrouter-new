import {formatUsd} from './money.mjs';
// Render-only marketplace metadata. Never attach this to model messages or tools.
export function estimateCredits(usage, rates) {
  if(!Number.isSafeInteger(usage?.inputTokens)||usage.inputTokens<0||!Number.isSafeInteger(usage?.outputTokens)||usage.outputTokens<0||![rates?.inputRate,rates?.outputRate].every(v=>/^(0|[1-9][0-9]{0,8})$/.test(v)))throw Error('marketplace_price_unavailable');
  return (BigInt(usage.inputTokens)*BigInt(rates.inputRate)+BigInt(usage.outputTokens)*BigInt(rates.outputRate)+999999n)/1000000n;
}
export class CodingDisplay {
  constructor(session,rates) {
    estimateCredits({inputTokens:0,outputTokens:0},rates);
    this.sessionId=session.id;this.computeName=rates.name??'Compute';this.model=rates.model??'unavailable';this.inputTokens=0;this.outputTokens=0;this.rates=rates;this.total=BigInt(session.charged??'0');this.requests=new Set();this.pending=false;this.unknown=false;this.native=['pi_native_v1','pi_native_v2','pi_native_v3'].includes(session.connectorProtocol);this.simulated=session.simulatedMicrousd===undefined?null:session.simulatedMicrousd;this.priceVersion=session.priceVersion;
  }
  complete(id,usage,settlement){if(!this.requests.has(id)){if(this.native){this.simulated=settlement?.simulatedMicrousd===null||settlement?.simulatedMicrousd===undefined?null:(BigInt(this.simulated??'0')+BigInt(settlement.simulatedMicrousd)).toString();}this.total+=estimateCredits(usage,this.rates);this.requests.add(id);this.inputTokens+=usage.inputTokens;this.outputTokens+=usage.outputTokens;}this.pending=false;}
  failed(code){this.pending=false;if(/unknown|incomplete|stream_invalid|upstream_timeout|upstream_malformed_response/.test(code??''))this.unknown=true;}
  view(){return {sessionId:this.sessionId,computeName:this.computeName,model:this.model,inputTokens:this.inputTokens,outputTokens:this.outputTokens,completedRequests:this.requests.size,label:`Estimated ${this.total} test credits${this.pending?' · usage pending':this.unknown?' · unresolved usage excluded':''}${this.native?' · Simulated USD '+(this.simulated===null?'unknown':formatUsd(this.simulated)):''}`,rates:`Input ${this.rates.inputRate} / output ${this.rates.outputRate} test credits per 1M tokens`};}
}
export function inferenceErrorMessage(code,cancelled=false) {
  if(cancelled||['cancelled','runtime_cancelled'].includes(code))return 'Inference cancelled. No request was replayed.';
  const messages={upstream_authentication_failed:'The upstream rejected authentication or access. Check the provider HTTP status and verify the key and entitlement in the provider guest.',upstream_invalid_model:'The upstream rejected the configured model. Verify its exact ID and access; no model was substituted.',upstream_rate_limited:'The upstream rate or quota limit was reached. Inspect provider limits before making another request.',upstream_malformed_response:'The upstream response was incomplete or unsupported. Usage remains unresolved; no request was replayed.',upstream_timeout:'The upstream timed out. Its outcome may be unknown; no request was replayed.',session_request_limit:'Session request limit reached. Save your work and accept a new session.',session_not_active:'This session is no longer active. Save your work and accept a new session.',session_expired:'This session has expired. Save your work and accept a new session.',provider_output_bound_exceeded:'The requested output exceeds the provider limit. Review the accepted session limits.',provider_offline:'The provider is offline. Save your work and inspect the session.',provider_budget_exhausted:'Provider spending authority is exhausted. Save your work and inspect the session.',capability_mismatch:'The accepted listing does not support this thinking or tool request.',web_denied:'Web retrieval was denied.',action_approval_expired:'The action approval expired.'};
  if(messages[code])return messages[code];
  if(/unknown|incomplete|stream_invalid/.test(code??''))return 'The inference outcome is unknown. Reconcile the session before continuing; no request was replayed.';
  return `Inference could not complete (${/^[a-z0-9_]{1,80}$/.test(code??'')?code:'coding_bridge_rejected'}). Check the session status; no request was replayed.`;
}

export function thinkingExplanation({accepted=false,providerEnabled=false,modelSupported=null}={}) {
  if(modelSupported===false)return 'This model is unsupported for thinking by this connector.';
  if(!providerEnabled&&modelSupported===true)return 'The provider disabled thinking. Enable support and publish a new listing, then accept a new session.';
  if(!accepted)return 'The accepted session lacks thinking support. Accept a new session with thinking enabled by the provider.';
  return 'Thinking is available in this session and starts off. Choose a thinking level to enable it.';
}

export function codingFooter(value,width=80) {
  if(!value)return 'Session metadata unavailable';
  const compact=width<100;
  return `${compact?'S':'Session'} ${compact?value.sessionId.slice(0,8):value.sessionId} · ${value.computeName}/${value.model} · ${compact?'I':'Input'} ${value.inputTokens} ${compact?'O':'Output'} ${value.outputTokens} · ${value.label}`;
}

// Request metadata only, never an upstream response body or message.
export function nativeFailureLines(failure) {
  if(!failure?.provider||!failure?.model)return [];
  const label=(value,pattern)=>String(value??'unknown').replace(pattern,'').slice(0,256)||'unknown';
  return [`Provider ${label(failure.provider,/[^a-z0-9-]/gi)} / ${label(failure.model,/[^a-z0-9_@/:. -]/gi)}`,
    `Native API ${label(failure.api,/[^a-z0-9-]/gi)} · maximum output ${Number.isSafeInteger(failure.maxOutputTokens)&&failure.maxOutputTokens>0?failure.maxOutputTokens:'unknown'} tokens`];
}
export function providerFailureLines(failure) {
  if(!failure)return [];
  const guidance={
    400:'Check the documented model and request settings; status alone does not identify the rejected parameter.',
    401:'Verify the guest-entered key with the gateway. Status alone does not establish why credentials were rejected.',
    402:'Verify gateway credit and bundle entitlement with the provider.',
    403:'Verify gateway permissions and model entitlement. Status alone does not identify the access restriction.',
    404:'Verify the full Chat Completions URL and exact model ID.',
    429:'Check gateway rate and quota limits before another request.',
  };
  const status=failure.statusCode;
  const native=nativeFailureLines(failure);
  return [...native,`Last upstream failure: ${failure.requestId}`,`HTTP ${status??'unavailable'} · ${failure.code} · ${new Date(failure.observedAt).toISOString()}`,
    guidance[status]??(status>=500?'The gateway reported a server failure. Inspect its service status before another request.':status>=300&&status<400?'Redirects are not followed. Verify the exact approved endpoint.':inferenceErrorMessage(failure.code)),
    'No automatic retry or endpoint/model switch was made. Unknown usage stays unresolved.'];
}
