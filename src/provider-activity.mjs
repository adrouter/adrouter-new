import { modelStatusLines } from './model-status.mjs';
import { providerDiagnostic, providerDiagnosticLines } from './provider-diagnostics.mjs';
import { ProviderActivity } from './generated/validators.mjs';
export function providerActivityLines(v) {
  if(!v)return ['Provider activity unavailable'];
  if(!v.activeSessions)return ['Availability: unknown',...providerDiagnosticLines(v.failure),'Last successful poll: none'];
  const total=value=>value===null?'unavailable (legacy)':String(value);
  return [...modelStatusLines(v.modelStatuses,{stale:v.stale}),...providerDiagnosticLines(v.failure),`Last successful poll: ${v.lastSuccessfulAt?new Date(v.lastSuccessfulAt).toISOString():'none'}`,`Run uptime: ${v.runStartedAt===null?'unavailable':Math.max(0,Math.floor((Date.now()-v.runStartedAt)/1000))+'s'}`,`Connection: ${v.stale?'unknown availability · last confirmed':v.connectionFresh?'fresh':'offline'}${v.connectionUpdatedAt===null?'':` · ${Math.max(0,Math.floor((Date.now()-v.connectionUpdatedAt)/1000))}s ago`}`,...v.activeSessions.map(s=>`Buyer ${s.buyerId} · Session ${s.sessionId}`),`Completed: ${total(v.completedRequests)} · Pending: ${v.pendingRequests}`,`Input: ${total(v.inputTokens)} · Output: ${total(v.outputTokens)}`,...(v.totalsSince!==null?[`Validated totals since ${new Date(v.totalsSince).toLocaleString()}`]:[])];
}
export class ProviderActivityMonitor {
  constructor(network,nodeId,redraw){this.network=network;this.nodeId=nodeId;this.redraw=redraw;this.stale=true;}
  view(){return {...this.value,stale:this.stale||Date.now()-(this.lastSuccessfulAt??0)>=15000,failure:this.failure,lastSuccessfulAt:this.lastSuccessfulAt};}
  async poll(){if(this.pending||this.stopped)return;this.pending=true;try{const value=await this.network.request(`/v2/providers/nodes/${this.nodeId}/activity`,{signal:AbortSignal.any([this.abort.signal,AbortSignal.timeout(10000)])});if(!ProviderActivity(value))throw Object.assign(Error('activity_contract_mismatch'),{code:'activity_contract_mismatch'});if(!this.stopped){this.value=value;this.stale=false;this.lastSuccessfulAt=Date.now();this.failure=undefined;}}catch(error){if(!this.stopped){this.stale=true;this.failure=providerDiagnostic('activity_poll',error);}}finally{this.pending=false;if(!this.stopped)this.redraw();}}
  async start(){this.stopped=false;this.abort=new AbortController();await this.poll();this.timer=setInterval(()=>void this.poll(),5000);}
  stop(){this.stopped=true;clearInterval(this.timer);this.abort?.abort();}
}

export function providerConnectionLabel(activity) {
  if(!activity||activity.stale)return 'unknown availability · last confirmed';
  return activity.connectionFresh?'fresh':'offline';
}
