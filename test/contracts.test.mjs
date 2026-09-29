import test from 'node:test';
import assert from 'node:assert/strict';
import * as v from '../src/generated/validators.mjs';

const request = { type: 'inference', sessionId: 'test-session', requestId: 'r1', bindingRevision: 'b1', sequence: 1, deadlineUnixMs: 2000000000000, messages: [{ role: 'user', content: 'hello' }], maxOutputTokens: 32, tools: [], upstreamBudget: { reservedMicrousd: '100', inputBound: 8192, tariffVersion: 'synthetic-v1', inputMicrousdPerMillion: '1000', outputMicrousdPerMillion: '2000' } };
test('allowlists reject subscription, future and unknown classes and profiles', () => {
  for (const supplyClass of ['authorized_api', 'self_hosted']) assert.equal(v.SourcePolicy({ supplyClass, connectorProfile: 'inference_connector_v1', policyVersion: 'mvp1-v1' }), true);
  for (const value of ['buyer_byo_tool', 'consumer_subscription', 'harness_locked', 'wrapper', 'future', null, 1]) assert.equal(v.SupplyClass(value), false);
  assert.equal(v.ConnectorProfile('provider_shell'), false);
});
test('inference envelope forbids destinations, authentication and execution fields', () => {
  assert.equal(v.InferenceRequest(request), true);
  for (const [key, value] of Object.entries({ url: 'http://127.0.0.1', headers: { authorization: 'seeded-fixture' }, command: 'id', providerCode: 'code' })) assert.equal(v.InferenceRequest({ ...request, [key]: value }), false);
  assert.equal(v.InferenceRequest({ ...request, maxOutputTokens: 8193 }), false);
  assert.equal(v.InferenceRequest({ ...request, messages: [{ role: 'user', content: 'x'.repeat(65537) }] }), false);
});
test('money crosses the wire as canonical integer decimal strings', () => {
  for (const value of ['0', '42', '9007199254740993']) assert.equal(v.Money(value), true);
  for (const value of [0, 0.1, '-1', '01', '1e3', '1.5', '100000000000000000000']) assert.equal(v.Money(value), false);
});
