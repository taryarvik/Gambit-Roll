export function exportCode(payload) {
  return btoa(unescape(encodeURIComponent(JSON.stringify(payload))));
}

export function importCode(code) {
  const json = decodeURIComponent(escape(atob(code.trim())));
  return JSON.parse(json);
}
