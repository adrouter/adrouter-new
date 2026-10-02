// One policy for host imports/proposals and guest snapshot discovery.
export function workspacePathReason(path) {
  if (typeof path !== 'string' || !path || path.startsWith('/') || path.includes('\\') || path.includes('\0') || path.includes(':')) return 'private';
  const parts = path.split('/');
  if (parts.some(p => !p || p === '.' || p === '..')) return 'private';
  if (parts.some(p => /(^auth\.json$|^\.npmrc$|^\.pypirc$|^\.netrc$|^\.|credentials?|secrets?|id_rsa|id_ed25519|\.pem$|\.key$|\.p12$|\.pfx$|\.tgz$|\.tar$|\.zip$|\.sqlite$|\.db$)/i.test(p) && !['.gitignore','.ignore','.editorconfig','.adrouter'].includes(p))) return 'private';
  if (parts.some(p => ['node_modules','dist','build','coverage','vendor','target','__pycache__'].includes(p))) return 'generated';
  return null;
}
export function checkWorkspacePath(path) {
  if (workspacePathReason(path)) throw Error('workspace_path_rejected');
}
