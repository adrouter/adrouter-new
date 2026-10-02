import { connectorCatalog, connectorDescriptorSchema } from './generated/connectors.mjs';
export { connectorCatalog };
export const CONNECTOR_PROTOCOL=connectorCatalog.protocol;
export const upstreamFailureCodes=['provider_outcome_unknown','upstream_authentication_failed','upstream_invalid_model','upstream_rate_limited','upstream_malformed_response','upstream_timeout','upstream_failed_outcome_unknown','upstream_usage_missing','upstream_usage_invalid','upstream_parameter_rejected','pi_model_fallback_rejected'];
export function resolveConnector(node) {
  let value=node.connector;
  if(!value){const official=connectorCatalog.presets.find(p=>p.endpoint===node.endpoint);value=connectorCatalog.profiles.find(p=>p.id===(official?.profile??'openai-compatible-v1'));}
  if(!value||typeof value!=='object'||Object.keys(value).length!==connectorDescriptorSchema.required.length||Object.entries(connectorDescriptorSchema.properties).some(([key,schema])=>schema.enum?!schema.enum.includes(value[key]):'const' in schema?value[key]!==schema.const:typeof value[key]!==schema.type))throw Object.assign(Error('unsupported_connector_profile'),{code:'unsupported_connector_profile'});
  const profile=connectorCatalog.profiles.find(p=>p.id===value.id);
  if(value.id!=='openai-compatible-v1'&&Object.keys(profile).some(k=>profile[k]!==value[k]))throw Object.assign(Error('unsupported_connector_profile'),{code:'unsupported_connector_profile'});
  if(value.reasoningHistory&&value.thinking==='none')throw Object.assign(Error('unsupported_connector_profile'),{code:'unsupported_connector_profile'});
  return structuredClone(value);
}
export function connectorHeaders(profile,key) {
  if(profile.authentication==='none')return {};
  if(typeof key!=='string'||!key.length||key.length>4096||!/^[\x20-\x7e]+$/.test(key))throw Object.assign(Error('credential_format_invalid'),{code:'credential_format_invalid'});
  return profile.authentication==='bearer'?{authorization:`Bearer ${key}`}:{[profile.authentication==='api_key'?'api-key':'x-api-key']:key};
}

export function connectorReviewLines(node) {
  const profile=resolveConnector(node);
  return [`Authentication: ${profile.authentication}`,`Output limit: ${profile.outputTokenParameter}`,`Final usage: ${profile.streamingUsage}`,`Thinking control: ${profile.thinking}`,`Reasoning history: ${profile.reasoningHistory?'on · reasoning_content':'off'}`];
}
