const qualifications={not_tested:'Not tested',testing:'Testing',passed:'Passed',failed:'Failed',result_unconfirmed:'Result unconfirmed',recheck_required:'Recheck required'};
const availability={available:'Available',busy:'Busy',offline:'Offline',blocked:'Blocked',unknown:'Unknown'};
const clean=value=>String(value??'').replace(/[\x00-\x1f\x7f-\x9f\u202a-\u202e\u2066-\u2069]/g,'');
export function visibleModelStatus(value, {now=Date.now(),stale=false}={}) {
  const expired=value?.availability==='available'&&(stale||!Number.isFinite(value.confirmedAt)||now-value.confirmedAt>=15000||value.leaseUntil<=now);
  return {...value,qualification:qualifications[value?.qualification]??'Not tested',availability:expired||stale?'Unknown':availability[value?.availability]??'Unknown',reason:expired?'Status confirmation expired':stale?'Refresh failed; last confirmation retained':clean(value?.reason??'Status unavailable').replaceAll('_',' ')};
}
export function modelStatusLines(statuses,options={}) {
  if(!statuses?.length)return ['Model status: Unknown · Refresh to confirm'];
  const width=options.width??80;
  return statuses.flatMap(raw=>{const s=visibleModelStatus(raw,options);return width<70?[clean(s.model),`  ${s.qualification} · ${s.availability}`,`  ${s.reason}`]:[`${clean(s.model).slice(0,27).padEnd(28)} ${s.qualification.padEnd(19)} ${s.availability}`,`  ${s.reason}`];});
}
export function providerRow(node,options={}) {
  const statuses=node.modelStatuses??[],visible=statuses.map(s=>visibleModelStatus(s,options)),available=options.stale||!statuses.length||visible.some(s=>s.availability==='Unknown')?'Unknown':visible.filter(s=>s.availability==='Available').length;
  return `${clean(node.name)} [${String(node.id).slice(0,8)}] · ${node.cleanupState==='failed'?'Cleanup required':node.ready?(options.stale?'Last confirmed running':'Running'):node.status} · ${available}/${node.models?.length??statuses.length??1} available`;
}
