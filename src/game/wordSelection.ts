import { GameDifficulty, WordPair } from '../types';
import { CUSTOM_CATEGORY_ID } from '../data/words';

export interface WordSelectionOptions {
  /** Exact category id. Use CUSTOM_CATEGORY_ID for user-created pairs. */
  category?: string | null;
  /** Multiple category ids. 'ALL' (or an empty list) means every category. */
  categories?: string[] | null;
  difficulty?: GameDifficulty | null;
  /** Used in offline games: prefer these categories. */
  preferredCategories?: string[];
  /** Recently used pair ids; avoided so back-to-back games feel fresh. */
  excludeIds?: string[];
}

/**
 * Picks a random word pair while respecting the room/player configuration.
 *
 * Filters fall back gracefully: if a filter would leave an empty pool, it is
 * ignored so the game never gets stuck without a word pair.
 */
export function pickWordPair(
  pairs: WordPair[],
  options: WordSelectionOptions = {}
): WordPair | null {
  if (pairs.length === 0) return null;

  const { category, categories, difficulty, preferredCategories, excludeIds } = options;
  let pool = pairs;

  if (categories && categories.length > 0 && !categories.includes('ALL')) {
    const selected = new Set(categories);
    const byCategories = pool.filter((p) =>
      p.isCustom ? selected.has(CUSTOM_CATEGORY_ID) : selected.has(p.category)
    );
    if (byCategories.length > 0) pool = byCategories;
  } else if (category && category !== 'ALL') {
    const byCategory =
      category === CUSTOM_CATEGORY_ID
        ? pool.filter((p) => p.isCustom)
        : pool.filter((p) => p.category === category);
    if (byCategory.length > 0) pool = byCategory;
  } else if (preferredCategories && preferredCategories.length > 0) {
    // Custom pairs are always allowed in offline play, otherwise the player
    // would have no way to actually use the words they created.
    const byPreference = pool.filter(
      (p) => p.isCustom || preferredCategories.includes(p.category)
    );
    if (byPreference.length > 0) pool = byPreference;
  }

  if (difficulty) {
    // Custom pairs have no authored difficulty, so keep them eligible at every
    // level instead of silently hiding the words the player created.
    const byDifficulty = pool.filter((p) => p.isCustom || p.difficulty === difficulty);
    if (byDifficulty.length > 0) pool = byDifficulty;
  }

  if (excludeIds && excludeIds.length > 0) {
    const excluded = new Set(excludeIds);
    const fresh = pool.filter((p) => !excluded.has(p.id));
    if (fresh.length > 0) {
      pool = fresh;
    } else {
      // A small category can be fully exhausted; at minimum avoid repeating the
      // exact pair that was played most recently.
      const lastUsed = excludeIds[excludeIds.length - 1];
      const withoutLast = pool.filter((p) => p.id !== lastUsed);
      if (withoutLast.length > 0) pool = withoutLast;
    }
  }

  return pool[Math.floor(Math.random() * pool.length)];
}
