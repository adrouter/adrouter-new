// Render-only marketplace metadata. Never attach this to model messages or tools.
export function estimateCredits(usage, rates) {
  if(!Number.isSafeInteger(usage?.inputTokens)||usage.inputTokens<0||!Number.isSafeInteger(usage?.outputTokens)||usage.outputTokens<0||![rates?.inputRate,rates?.outputRate].every(v=>/^(0|[1-9][0-9]{0,8})$/.test(v)))throw Error('marketplace_price_unavailable');
  return (BigInt(usage.inputTokens)*BigInt(rates.inputRate)+BigInt(usage.outputTokens)*BigInt(rates.outputRate)+999999n)/1000000n;
}
export class CodingDisplay {
  constructor(session,rates) {
    estimateCredits({inputTokens:0,outputTokens:0},rates);
    this.sessionId=session.id;this.rates=rates;this.total=BigInt(session.charged??'0');this.requests=new Set();this.pending=false;this.unknown=false;
  }
  complete(id,usage){if(!this.requests.has(id)){this.total+=estimateCredits(usage,this.rates);this.requests.add(id);}this.pending=false;}
  failed(code){this.pending=false;if(/unknown|incomplete|stream_invalid/.test(code??''))this.unknown=true;}
  view(){return {sessionId:this.sessionId,label:`Estimated ${this.total} test credits${this.pending?' · usage pending':this.unknown?' · unresolved usage excluded':''}`,rates:`Input ${this.rates.inputRate} / output ${this.rates.outputRate} test credits per 1M tokens`};}
}
export function inferenceErrorMessage(code,cancelled=false) {
  if(cancelled||['cancelled','runtime_cancelled'].includes(code))return 'Inference cancelled. No request was replayed.';
  const messages={session_request_limit:'Session request limit reached. Save your work and accept a new session.',session_not_active:'This session is no longer active. Save your work and accept a new session.',session_expired:'This session has expired. Save your work and accept a new session.',provider_output_bound_exceeded:'The requested output exceeds the provider limit. Review the accepted session limits.',provider_offline:'The provider is offline. Save your work and inspect the session.',provider_budget_exhausted:'Provider spending authority is exhausted. Save your work and inspect the session.',capability_mismatch:'The accepted listing does not support this thinking or tool request.',web_denied:'Web retrieval was denied.',action_approval_expired:'The action approval expired.'};
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
