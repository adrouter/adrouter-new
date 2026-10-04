import { piCatalog } from './generated/pi-catalog.mjs';

export function verifiedThinking(provider, model, api) {
  const known = piCatalog.providers.find(p=>p.id===provider)?.models.find(m=>m.id===model);
  return !!known && !known.unavailableReason && (!api || api===known.api) && known.capabilities.includes('thinking_v1');
}

export function connectionCapabilities(provider, connection) {
  return {...connection, modelDefinitions: connection.modelDefinitions.map(model=>({...model,
    thinking: model.thinking??(verifiedThinking(provider, model.id, model.api??connection.api) ? 'optional' : 'none')}))};
}
