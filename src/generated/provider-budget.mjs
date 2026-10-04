// Generated from committed Router budget policy. Do not edit.
// Shared with the client by the committed-contract generator. Fail closed when
// pricing or provenance is absent; zero base rates alone do not prove free use.
export function providerRequiresBudget(node                         )          {
  if (node.connectorProtocol !== 'pi_native_v3' || node.supplyClass !== 'self_hosted' ||
      !Array.isArray(node.nativeModels) || node.nativeModels.length === 0) return true;
  const keys = ['input', 'output', 'cacheRead', 'cacheWrite'];
  return !node.nativeModels.every(model => {
    if (!model || typeof model !== 'object' || model.unavailableReason ||
        typeof model.api !== 'string' || !model.api || typeof model.endpoint !== 'string' || !model.endpoint ||
        typeof model.priceVersion !== 'string' || !model.priceVersion ||
        !model.price || typeof model.price !== 'object') return false;
    const rates = model.price;
    if (!keys.every(key => typeof rates[key] === 'number' && rates[key] === 0)) return false;
    if (rates.tiers !== undefined && !Array.isArray(rates.tiers)) return false;
    return (rates.tiers ?? []).every((tier                         ) =>
      tier && typeof tier.inputTokensAbove === 'number' && Number.isFinite(tier.inputTokensAbove) && tier.inputTokensAbove >= 0 &&
      keys.every(key => (Object.hasOwn(tier, key) ? tier[key] : rates[key]) === 0));
  });
}
