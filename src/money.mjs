// Exact decimal conversion; never route accounting through floating point.
export function usdToMicrousd(value) {
  if (!/^(0|[1-9][0-9]*)(\.[0-9]{1,6})?$/.test(value)) throw new Error('invalid_usd');
  const [whole, fraction = ''] = value.split('.');
  const amount = BigInt(whole) * 1000000n + BigInt(fraction.padEnd(6, '0'));
  if (amount > 999999999999999n) throw new Error('invalid_usd');
  return amount.toString();
}
export function formatUsd(value) {
  const amount = BigInt(value);
  const fraction = (amount % 1000000n).toString().padStart(6, '0').replace(/0+$/, '').padEnd(2, '0');
  return `USD ${amount / 1000000n}.${fraction}`;
}
