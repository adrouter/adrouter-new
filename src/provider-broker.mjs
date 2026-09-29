import { request as httpsRequest } from 'node:https';
import { request as httpRequest } from 'node:http';
import { isIP } from 'node:net';
import { lookup } from 'node:dns';
import { ClientError } from './network.mjs';

export function publicAddress(address) {
  if (address.includes(':')) return /^[23]/.test(address) && !/^(2001:(0:|db8:)|2002:)/i.test(address) && !address.includes('.');
  const octets = address.split('.').map(Number);
  if (octets.length !== 4 || octets.some(v => !Number.isInteger(v) || v < 0 || v > 255)) return false;
  const [a, b] = octets;
  return !(a === 0 || a === 10 || a === 127 || a >= 224 || (a === 100 && b >= 64 && b <= 127) || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && (b === 168 || b === 0)) || (a === 198 && (b === 18 || b === 19)));
}
export function validateBinding(node) {
  const url = new URL(node.endpoint);
  const loopback = ['127.0.0.1', '[::1]'].includes(url.hostname);
  if (url.username || url.password || url.search || url.hash || !(url.protocol === 'https:' || (node.supplyClass === 'self_hosted' && loopback && url.protocol === 'http:'))) throw new ClientError('endpoint_not_permitted');
  const address = url.hostname.replace(/^\[|\]$/g, '');
  if (isIP(address) && !publicAddress(address) && !(node.supplyClass === 'self_hosted' && loopback)) throw new ClientError('endpoint_address_rejected');
  return { url, loopback: node.supplyClass === 'self_hosted' && loopback };
}
// Fixed approved endpoint, model and headers. Neither relay nor guest can choose
// a URL, header, redirect, tool or arbitrary proxy target. DNS is checked at the
// connection's lookup, not in an earlier rebindable preflight.
export function upstreamInference(node, key, frame, signal) {
  const { url, loopback } = validateBinding(node);
  const bytes = JSON.stringify({ model: node.model, messages: frame.messages, max_tokens: frame.maxOutputTokens, stream: false });
  return new Promise((resolve, reject) => {
    const fail = () => reject(new ClientError('upstream_failed_outcome_unknown'));
    const request = (url.protocol === 'https:' ? httpsRequest : httpRequest)(url, {
      method: 'POST', signal, timeout: 40000,
      headers: { 'content-type': 'application/json', 'content-length': Buffer.byteLength(bytes), ...(key ? { authorization: `Bearer ${key}` } : {}) },
      lookup(hostname, options, callback) {
        lookup(hostname, options, (error, addresses, family) => {
          if (error) { callback(error, addresses, family); return; }
          const all = Array.isArray(addresses) ? addresses.map(a => a.address) : [addresses];
          if (!loopback && !all.every(publicAddress)) { callback(new Error('endpoint_address_rejected'), '', 4); return; }
          callback(null, addresses, family);
        });
      },
    }, response => {
      if (response.statusCode !== 200) { response.resume(); fail(); return; }
      const chunks = []; let size = 0;
      response.on('data', chunk => { size += chunk.length; if (size > 1024 * 1024) { response.destroy(); fail(); } else chunks.push(chunk); });
      response.once('error', fail);
      response.once('end', () => {
        try {
          const data = JSON.parse(Buffer.concat(chunks).toString('utf8'));
          const text = data.choices?.[0]?.message?.content;
          const inputTokens = data.usage?.prompt_tokens; const outputTokens = data.usage?.completion_tokens;
          if (typeof text !== 'string' || Buffer.byteLength(text) > 131072 || !Number.isSafeInteger(inputTokens) || inputTokens < 0 || !Number.isSafeInteger(outputTokens) || outputTokens < 0 || outputTokens > frame.maxOutputTokens || data.choices?.[0]?.message?.tool_calls) { fail(); return; }
          resolve({ type: 'result', requestId: frame.requestId, text, inputTokens, outputTokens });
        } catch { fail(); }
      });
    });
    request.once('error', fail); request.once('timeout', () => { request.destroy(); fail(); }); request.end(bytes);
  });
}
