const RECENT_WORD_IDS_KEY = 'imposter_recent_word_ids_v1';
const MAX_RECENT_WORD_IDS = 80;

/** Word pairs used most recently, oldest first. */
export function loadRecentWordIds(): string[] {
  try {
    const raw = localStorage.getItem(RECENT_WORD_IDS_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed)
      ? parsed.filter((v): v is string => typeof v === 'string')
      : [];
  } catch {
    return [];
  }
}

export function rememberWordId(id: string) {
  if (!id) return;
  try {
    const next = loadRecentWordIds().filter((v) => v !== id);
    next.push(id);
    localStorage.setItem(
      RECENT_WORD_IDS_KEY,
      JSON.stringify(next.slice(-MAX_RECENT_WORD_IDS))
    );
  } catch {}
}
