import test from 'node:test';
import assert from 'node:assert/strict';
import {providerRequiresBudget} from '../src/generated/provider-budget.mjs';
test('client uses the generated Router policy for missing, cached and tiered prices',()=>{
 const model={api:'openai-completions',endpoint:'http://127.0.0.1:11434/v1',priceVersion:'connection_definition_v2',price:{input:0,output:0,cacheRead:0,cacheWrite:0}};
 const node={connectorProtocol:'pi_native_v3',supplyClass:'self_hosted',nativeModels:[model]};
 assert.equal(providerRequiresBudget(node),false);
 for(const patch of [{supplyClass:'authorized_api'},{connectorProtocol:'pi_native_v1'},{nativeModels:[]},{nativeModels:[{...model,price:undefined}]},{nativeModels:[{...model,price:{input:0,output:0}}]},{nativeModels:[{...model,price:{...model.price,cacheWrite:1}}]},{nativeModels:[{...model,price:{...model.price,tiers:[{inputTokensAbove:100,cacheRead:1}]}}]},{nativeModels:[{...model,price:{...model.price,tiers:[{inputTokensAbove:100,input:null}]}}]}])assert.equal(providerRequiresBudget({...node,...patch}),true);
});
