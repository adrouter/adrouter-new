// Test output stays in memory. Only identifiers/statuses cross the guest boundary.
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { resolve } from 'node:path';
import {providerCatalog} from '../../src/generated/provider-catalog.mjs';
import {sdkCaseIds} from './sdk-matrix.mjs';
import { piCatalog } from '../../src/generated/pi-catalog.mjs';
import { catalogMatrix, matrixCaseIds } from './pi-matrix.mjs';
export function matrixReport(output,exitCode,expected) {
 const seen=new Map();let auxiliaryFailed=0,foreign=0,duplicate=false;
 for(const line of output.split('\n')){
  const match=/^(ok|not ok) \d+ - (.+)$/.exec(line);if(!match)continue;
  const id=match[2].split(' # ')[0],passed=match[1]==='ok'&&!/#\s*(SKIP|TODO)/i.test(match[2]);
  if(!/^(pi|sdk|sdk-family)\//.test(id)){if(!passed)auxiliaryFailed++;continue;}
  if(!expected.includes(id)){foreign++;continue;}
  if(seen.has(id))duplicate=true;seen.set(id,passed?'passed':'failed');
 }
 const cases=expected.map(id=>({id,status:seen.get(id)??'not_run'}));
 const passed=exitCode===0&&!auxiliaryFailed&&!foreign&&!duplicate&&cases.every(c=>c.status==='passed')&&!/^(# skipped [1-9]|# todo [1-9]|# cancelled [1-9]|# fail [1-9])/m.test(output);
 return {status:passed?'passed':'failed',requiredCases:cases,auxiliaryFailed,foreignCases:foreign,duplicateCases:duplicate,paidInference:false};
}
if(process.argv[1]&&resolve(process.argv[1])===fileURLToPath(import.meta.url)){
 const matrix=catalogMatrix(piCatalog),result=spawnSync(process.execPath,['--test','--test-reporter=tap',...['pi-native.test.mjs','sdk-native.test.mjs','sdk-families.test.mjs'].map(f=>fileURLToPath(new URL('../'+f,import.meta.url)))],{encoding:'utf8',maxBuffer:8*1024*1024,timeout:240000});
 console.log(JSON.stringify({...matrixReport(result.stdout??'',result.status,[...matrixCaseIds(matrix),...sdkCaseIds(providerCatalog)]),providerApiPairs:new Set(matrix.map(c=>c.provider+'/'+c.api)).size,nativeFamilies:new Set(matrix.map(c=>c.api)).size}));
 // The collector exits successfully so the caller can persist partial evidence.
 // The source/guest verifiers and CI must reject result.status !== passed.
}
