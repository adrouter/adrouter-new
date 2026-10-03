import { createHash } from 'node:crypto';
export const nativeFamilies = ['openai-completions','openai-responses','azure-openai-responses','anthropic-messages','google-generative-ai','mistral-conversations'];
const stable = value => JSON.stringify(value && typeof value === 'object' && !Array.isArray(value) ? Object.fromEntries(Object.keys(value).sort().map(k=>[k,JSON.parse(stable(value[k]))])) : value, (_k,v)=>v===undefined?null:v);
export function catalogMatrix(catalog) {
  const matrix=[];
  for(const p of [...catalog.providers].sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0)) {
    const seen=new Set();
    for(const model of [...p.models].sort((a,b)=>a.id<b.id?-1:a.id>b.id?1:0)) {
      if(model.unavailableReason)continue;
      if(!nativeFamilies.includes(model.api))throw Error('matrix_family_unsupported');
      // Endpoint, custom headers, thinking maps and compat all affect serialization.
      const settings=stable({api:model.api,baseUrl:model.baseUrl,compat:model.compat,headers:model.headers,reasoning:model.reasoning,thinkingLevelMap:model.thinkingLevelMap});
      if(seen.has(settings))continue;seen.add(settings);
      const variant=createHash('sha256').update(settings).digest('hex').slice(0,12);
      const fields=Object.fromEntries((p.fields??[]).map(f=>[f.name, f.name==='CLOUDFLARE_ACCOUNT_ID'?'a'.repeat(32):f.name==='AZURE_OPENAI_RESOURCE_NAME'?'fixture-resource':(()=>{throw Error('matrix_public_field_unknown');})()]));
      matrix.push({id:`pi/${p.id}/${model.api}/${variant}`,provider:p.id,api:model.api,model:model.id,descriptor:model,fields});
    }
  }
  if(new Set(matrix.map(c=>c.api)).size!==nativeFamilies.length)throw Error('matrix_family_missing');
  return matrix;
}
export const matrixCaseIds = matrix => matrix.flatMap(c=>[`${c.id}/text`,`${c.id}/tools`]);
export function assertCaseResults(expected, results) {
  const seen=new Set();
  for(const c of results){if(!expected.includes(c.id)||seen.has(c.id)||c.status!=='passed')throw Error('matrix_case_failed_or_duplicate');seen.add(c.id);}
  if(seen.size!==expected.length)throw Error('matrix_case_missing');
}
export function tapCaseResults(output, expected) {
  // Node's TAP reporter is used explicitly in host and guest; skip/todo are failures.
  const results=[];
  for(const line of output.split('\n')){
    const m=/^(ok|not ok) \d+ - (pi\/\S+)(.*)$/.exec(line);
    if(m)results.push({id:m[2],status:m[1]==='ok'&&!/#\s*(SKIP|TODO)/i.test(m[3])?'passed':'failed'});
  }
  assertCaseResults(expected,results);
  if(/^(not ok|# fail [1-9]|# cancelled [1-9]|# skipped [1-9]|# todo [1-9])/m.test(output))throw Error('matrix_suite_failed');
  return results;
}
