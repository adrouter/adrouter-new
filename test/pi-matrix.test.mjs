import test from 'node:test';
import assert from 'node:assert/strict';
import { piCatalog } from '../src/generated/pi-catalog.mjs';
import { catalogMatrix, matrixCaseIds, assertCaseResults, tapCaseResults } from './helpers/pi-matrix.mjs';
test('matrix covers every selectable pair, every serialization variant and required public fields deterministically',()=>{
 const matrix=catalogMatrix(piCatalog),pairs=new Set(matrix.map(c=>`${c.provider}/${c.api}`));
 const expected=new Set(piCatalog.providers.flatMap(p=>p.models.filter(m=>!m.unavailableReason).map(m=>`${p.id}/${m.api}`)));
 assert.deepEqual(pairs,expected);assert.equal(new Set(matrix.map(c=>c.id)).size,matrix.length);
 assert.deepEqual(catalogMatrix({...piCatalog,providers:[...piCatalog.providers].reverse().map(p=>({...p,models:[...p.models].reverse()}))}),matrix);
 for(const c of matrix){assert.equal(c.descriptor.unavailableReason,null);for(const field of piCatalog.providers.find(p=>p.id===c.provider).fields)assert.match(c.fields[field.name],new RegExp(field.pattern));}
 const extra=structuredClone(piCatalog);extra.providers[0].models.push({...extra.providers[0].models[0],id:'unavailable-fixture',unavailableReason:'fixture'});assert.deepEqual(catalogMatrix(extra),matrix);
});
test('guest evidence fails missing, duplicate, skipped, failed or invented cases',()=>{
 const expected=matrixCaseIds(catalogMatrix(piCatalog)),results=expected.map(id=>({id,status:'passed'}));assertCaseResults(expected,results);
 for(const changed of [results.slice(1),[...results,results[0]],results.map((c,i)=>i?c:{...c,status:'skipped'}),[...results,{id:'invented',status:'passed'}]])assert.throws(()=>assertCaseResults(expected,changed));
 const tap=expected.map((id,i)=>`ok ${i+1} - ${id}`).join('\n')+'\n# fail 0';assert.equal(tapCaseResults(tap,expected).length,expected.length);
 for(const changed of [tap.replace('ok 1','not ok 1'),tap.replace(expected[0],expected[0]+' # SKIP unavailable'),tap+'\n# fail 1'])assert.throws(()=>tapCaseResults(changed,expected));
});

test('partial synthetic execution reports completed cases and leaves unfinished cases not_run',async()=>{
 const {matrixReport}=await import('./helpers/run-pi-matrix.mjs');const expected=['pi/p/api/variant/text','pi/p/api/variant/tools'];
 const partial=matrixReport('ok 1 - '+expected[0],null,expected);assert.equal(partial.status,'failed');assert.deepEqual(partial.requiredCases,[{id:expected[0],status:'passed'},{id:expected[1],status:'not_run'}]);
 const complete='ok 1 - '+expected[0]+'\nok 2 - '+expected[1];assert.equal(matrixReport(complete,0,expected).status,'passed');
 for(const output of [complete+'\nok 3 - '+expected[0],complete+'\nnot ok 4 - auxiliary failure',complete.replace('ok 1','not ok 1'),complete+'\n# skipped 1'])assert.equal(matrixReport(output,0,expected).status,'failed');
});
