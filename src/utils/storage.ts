import { PlayerStats, GameSettings, WinnerStatus, WordPair, UserProfile } from '../types';
import { AVATARS } from '../data/words';

const STATS_KEY = 'imposter_player_stats_v1';
const SETTINGS_KEY = 'imposter_game_settings_v1';
const CUSTOM_WORDS_KEY = 'imposter_custom_words_v1';
const RECORDED_RESULTS_KEY = 'imposter_recorded_results_v1';
const PROFILE_KEY = 'imposter_user_profile_v1';

export const DEFAULT_PROFILE: UserProfile = {
  name: '',
  avatar: AVATARS[0],
};

export const DEFAULT_SETTINGS: GameSettings = {
  language: 'en',
  soundEnabled: true,
  musicEnabled: false,
  animationsEnabled: true,
  darkMode: true,
  hapticsEnabled: true,
  defaultDifficulty: 'EASY',
  preferredCategories: ['Food & Drinks', 'Sports', 'Animals', 'Technology'],
  maxPlayers: 20,
};

export const DEFAULT_STATS: PlayerStats = {
  totalGames: 0,
  totalWins: 0,
  totalLosses: 0,
  timesImposter: 0,
  imposterWins: 0,
  groupWins: 0,
  tiedGames: 0,
};

export function loadSettings(): GameSettings {
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    if (raw) return { ...DEFAULT_SETTINGS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_SETTINGS;
}

export function saveSettings(settings: GameSettings) {
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  } catch {}
}

export function loadProfile(): UserProfile {
  try {
    const raw = localStorage.getItem(PROFILE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<UserProfile>;
      const avatar =
        typeof parsed.avatar === 'string' && AVATARS.includes(parsed.avatar)
          ? parsed.avatar
          : DEFAULT_PROFILE.avatar;
      return {
        name: typeof parsed.name === 'string' ? parsed.name.slice(0, 24) : '',
        avatar,
      };
    }
  } catch {}
  return DEFAULT_PROFILE;
}

export function saveProfile(profile: UserProfile) {
  try {
    localStorage.setItem(PROFILE_KEY, JSON.stringify(profile));
  } catch {}
}

export function loadStats(): PlayerStats {
  try {
    const raw = localStorage.getItem(STATS_KEY);
    if (raw) return { ...DEFAULT_STATS, ...JSON.parse(raw) };
  } catch {}
  return DEFAULT_STATS;
}

export function recordGameStats(isImposter: boolean, winnerStatus: WinnerStatus): PlayerStats {
  if (winnerStatus === 'NONE') return loadStats();
  const current = loadStats();
  current.totalGames += 1;

  if (isImposter) {
    current.timesImposter += 1;
    if (winnerStatus === 'IMPOSTER_WIN') {
      current.imposterWins += 1;
      current.totalWins += 1;
    } else if (winnerStatus === 'GROUP_WIN') {
      current.totalLosses += 1;
    } else {
      current.tiedGames += 1;
    }
  } else {
    // Regular group member
    if (winnerStatus === 'GROUP_WIN') {
      current.groupWins += 1;
      current.totalWins += 1;
    } else if (winnerStatus === 'IMPOSTER_WIN') {
      current.totalLosses += 1;
    } else {
      current.tiedGames += 1;
    }
  }

  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(current));
  } catch {}
  return current;
}

/**
 * Online results are written by a live listener that fires again after a page
 * refresh. Remember which rounds were already counted for this tab so a refresh
 * on the results screen cannot inflate the player's statistics.
 */
export function hasRecordedResult(resultKey: string): boolean {
  try {
    const raw = sessionStorage.getItem(RECORDED_RESULTS_KEY);
    if (!raw) return false;
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.includes(resultKey);
  } catch {
    return false;
  }
}

export function markResultRecorded(resultKey: string) {
  try {
    const raw = sessionStorage.getItem(RECORDED_RESULTS_KEY);
    let recorded: string[] = [];
    if (raw) {
      try {
        const parsed: unknown = JSON.parse(raw);
        if (Array.isArray(parsed)) recorded = parsed.filter((v): v is string => typeof v === 'string');
      } catch {}
    }
    if (!recorded.includes(resultKey)) recorded.push(resultKey);
    sessionStorage.setItem(RECORDED_RESULTS_KEY, JSON.stringify(recorded.slice(-50)));
  } catch {}
}

export function resetStats(): PlayerStats {
  try {
    localStorage.setItem(STATS_KEY, JSON.stringify(DEFAULT_STATS));
  } catch {}
  return DEFAULT_STATS;
}

// ---------------------------------------------------------------------------
// Custom word pairs
// ---------------------------------------------------------------------------

export function loadCustomWords(): WordPair[] {
  try {
    const raw = localStorage.getItem(CUSTOM_WORDS_KEY);
    if (raw) {
      const parsed: unknown = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        return parsed
          .filter(
            (p): p is WordPair =>
              !!p && typeof p.id === 'string' && typeof p.wordA === 'string' && typeof p.wordB === 'string'
          )
          .map((p) => ({
            ...p,
            category: p.category || 'Custom',
            categoryBn:
              p.categoryBn || (p.category === 'Custom' ? 'কাস্টম' : p.category) || 'কাস্টম',
            wordABn: p.wordABn || p.wordA,
            wordBBn: p.wordBBn || p.wordB,
            difficulty: p.difficulty || 'MEDIUM',
            isCustom: true,
          }));
      }
    }
  } catch {}
  return [];
}

export function saveCustomWords(pairs: WordPair[]) {
  try {
    localStorage.setItem(CUSTOM_WORDS_KEY, JSON.stringify(pairs));
  } catch {}
}

