export function sdkCaseIds(catalog){
 const providers=catalog.providers.filter(p=>p.models.some(m=>m.adapter?.id==='@ai-sdk/openai-compatible'));
 const adapters=[...new Set(catalog.providers.flatMap(p=>p.models.filter(m=>m.adapter?.kind==='sdk').map(m=>m.adapter.id)))];
 return [...providers.map(p=>`sdk/${p.id}/stream-tool-roundtrip-usage-cancellation`),...adapters.map(id=>`sdk-family/${id}/pinned-stream-usage`)];
}
