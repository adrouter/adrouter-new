import { MarketplaceListingSummary } from './generated/validators.mjs';
export function summaryLines(summary, stale = false) {
  if (!summary) return ['Marketplace availability','Unavailable'];
  const t=summary.totals;
  return ['Marketplace availability',stale?'STALE · last confirmed data':`Updated ${new Date(summary.at).toLocaleTimeString()}`,
    `Published: ${t.published}`,`Hot / cold: ${t.hot} / ${t.cold}`,`Hot available now: ${t.immediateHot}`,`Cold control ready: ${t.coldControlReady}`,`Serving: ${t.activeServing}`,`Occupied: ${t.occupied}`,`Unresolved holds: ${t.capacityHeld}`,`Qualified: ${t.qualified}`,'',
    ...summary.listings.map(l=>`${l.name.slice(0,16)} · ${l.capacityHeld?'held':l.activeServing?'serving':l.immediateHot?'hot ready':l.coldControlReady?'cold control':'offline'}`),
    '', 'Cold control requires activation.', 'Qualification is separate.'];
}
export class MarketplaceDisplay {
  constructor(network,update) {this.network=network;this.update=update;}
  async poll() {
    if(this.pending)return this.pending;
    const network=this.network();
    if(this.origin!==network.origin){this.origin=network.origin;this.summary=undefined;}
    const abort=new AbortController();this.abort=abort;
    this.pending=(async()=>{try{const value=await network.request('/v2/listings/summary',{public:true,signal:AbortSignal.any([abort.signal,AbortSignal.timeout(10000)])});if(!MarketplaceListingSummary(value))throw Error('summary_contract_mismatch');if(network!==this.network()||this.stopped)return;this.summary=value;this.update(summaryLines(value));}catch{if(network===this.network()&&!this.stopped)this.update(summaryLines(this.summary,true));}})();
    try{return await this.pending;}finally{this.pending=undefined;}
  }
  start(){this.stopped=false;void this.poll();this.timer=setInterval(()=>void this.poll(),20000);}
  stop(){this.stopped=true;clearInterval(this.timer);this.abort?.abort();}
}
