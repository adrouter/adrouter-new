import { ProviderActivity } from './generated/validators.mjs';
export function providerActivityLines(v) {
  if(!v)return ['Provider activity unavailable'];
  const total=value=>value===null?'unavailable (legacy)':String(value);
  return [`Run uptime: ${v.runStartedAt===null?'unavailable':Math.max(0,Math.floor((Date.now()-v.runStartedAt)/1000))+'s'}`,`Connection: ${v.stale?'unavailable · last confirmed':v.connectionFresh?'fresh':'offline'}${v.connectionUpdatedAt===null?'':` · ${Math.max(0,Math.floor((Date.now()-v.connectionUpdatedAt)/1000))}s ago`}`,...v.activeSessions.map(s=>`Buyer ${s.buyerId} · Session ${s.sessionId}`),`Completed: ${total(v.completedRequests)} · Pending: ${v.pendingRequests}`,`Input: ${total(v.inputTokens)} · Output: ${total(v.outputTokens)}`,...(v.totalsSince!==null?[`Validated totals since ${new Date(v.totalsSince).toLocaleString()}`]:[])];
}
export class ProviderActivityMonitor {
  constructor(network,nodeId,redraw){this.network=network;this.nodeId=nodeId;this.redraw=redraw;this.stale=true;}
  view(){return this.value?{...this.value,stale:this.stale}:null;}
  async poll(){if(this.pending||this.stopped)return;this.pending=true;try{const value=await this.network.request(`/v2/providers/nodes/${this.nodeId}/activity`,{signal:AbortSignal.any([this.abort.signal,AbortSignal.timeout(10000)])});if(!ProviderActivity(value))throw Error('activity_contract_mismatch');if(!this.stopped){this.value=value;this.stale=false;}}catch{this.stale=true;}finally{this.pending=false;if(!this.stopped)this.redraw();}}
  async start(){this.stopped=false;this.abort=new AbortController();await this.poll();this.timer=setInterval(()=>void this.poll(),5000);}
  stop(){this.stopped=true;clearInterval(this.timer);this.abort.abort();}
}

export function providerConnectionLabel(activity) {
  if(!activity||activity.stale)return 'unavailable · last confirmed';
  return activity.connectionFresh?'fresh':'offline';
}
