export function safeLoad(key, fallback) {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw);
  } catch {
    return fallback;
  }
}

export function safeSave(key, payload) {
  try {
    localStorage.setItem(key, JSON.stringify(payload));
    return { ok: true };
  } catch (e) {
    return { ok: false, error: e };
  }
}

/** if localStorage overflow -> strip enemy images and retry */
export function saveWithImageGuard(key, payload) {
  const a = safeSave(key, payload);
  if (a.ok) return a;

  try {
    const trimmed = {
      ...payload,
      bestiary: (payload.bestiary ?? []).map(en => ({ ...en, image: "" }))
    };
    const b = safeSave(key, trimmed);
    if (b.ok) return { ok: true, trimmed: true };
  } catch {}

  return { ok: false };
}
