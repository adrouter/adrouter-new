import { readFile } from 'node:fs/promises';
import { pathToFileURL } from 'node:url';
import { join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { command } from './acceptance/identity.mjs';
import { catalogMatrix,matrixCaseIds,tapCaseResults } from '../test/helpers/pi-matrix.mjs';
const source=fileURLToPath(new URL('../',import.meta.url));
const {piCatalog}=await import(pathToFileURL(join(source,'src/generated/pi-catalog.mjs')).href);
if(process.env.ADR_ACCEPTANCE_CLIENT_ROOT){
 const installed=await readFile(join(process.env.ADR_ACCEPTANCE_CLIENT_ROOT,'src/generated/pi-catalog.mjs'));
 if(!installed.equals(await readFile(join(source,'src/generated/pi-catalog.mjs'))))throw Error('installed_catalog_source_mismatch');
}
const matrix=catalogMatrix(piCatalog),output=await command(process.execPath,['test/helpers/run-pi-matrix.mjs'],{cwd:source,timeout:180000});
const result=JSON.parse(output);if(result.status==='passed')tapCaseResults(result.requiredCases.map((c,i)=>`ok ${i+1} - ${c.id}`).join('\n'),matrixCaseIds(matrix));const cases=result.requiredCases;
console.log(JSON.stringify({...result,providerApiPairs:new Set(matrix.map(c=>c.provider+'/'+c.api)).size,nativeFamilies:new Set(matrix.map(c=>c.api)).size,requiredCases:process.argv.includes('--summary')?cases.length:cases,paidInference:false}));if(result.status!=='passed')process.exitCode=1;
