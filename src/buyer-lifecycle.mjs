import { ClientError } from './network.mjs';

const identifier = value => /^[a-zA-Z0-9_-]{1,80}$/.test(value ?? '') ? value : null;
export class BuyerLifecycle {
  constructor(record = () => {}) { this.record = record; this.events = []; this.paused = false; this.firstFailure = null; }
  event(phase, outcome = {}) {
    const entry = { at: Date.now(), phase: identifier(phase), code: identifier(outcome.code),
      exitCode: Number.isInteger(outcome.exitCode) ? outcome.exitCode : null,
      signal: identifier(outcome.signal), state: identifier(outcome.state), status: identifier(outcome.status) };
    if (entry.code && !this.firstFailure) this.firstFailure = entry;
    this.events.push(entry); if (this.events.length > 256) this.events.shift();
    this.record({ firstFailure: this.firstFailure, events: this.events.slice() });
    return entry;
  }
}
export function backgroundOperation(work, interval, onError) {
  let pending, stopped = false;
  const run = () => {
    if (stopped) return Promise.resolve();
    if (pending) return pending;
    pending = Promise.resolve().then(work).catch(onError).finally(() => { pending = undefined; });
    return pending;
  };
  const timer = setInterval(() => void run(), interval);
  return { run, stop() { stopped = true; clearInterval(timer); }, get pending() { return pending; } };
}
export const recoverableStatusFailure = error => ['network_unavailable_outcome_unknown', 'auth_state_busy', 'invalid_network_response', 'runtime_cancelled', 'cancelled', 'response_too_large'].includes(error?.code);
export const approvalRequired = async () => { throw new ClientError('action_approval_required'); };
