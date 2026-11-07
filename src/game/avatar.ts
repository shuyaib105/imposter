import { AvatarAccessory, AvatarColor, PlayerStats } from '../types';

export interface AvatarPalette {
  id: AvatarColor;
  /** Full class string so Tailwind keeps it in the build. */
  bg: string;
  border: string;
  swatch: string;
}

export const AVATAR_COLORS: AvatarPalette[] = [
  {
    id: 'violet',
    bg: 'bg-gradient-to-br from-purple-600/35 via-violet-600/15 to-slate-950',
    border: 'border-purple-500/50',
    swatch: 'bg-purple-500',
  },
  {
    id: 'emerald',
    bg: 'bg-gradient-to-br from-emerald-600/35 via-teal-600/15 to-slate-950',
    border: 'border-emerald-500/50',
    swatch: 'bg-emerald-500',
  },
  {
    id: 'amber',
    bg: 'bg-gradient-to-br from-amber-500/35 via-orange-600/15 to-slate-950',
    border: 'border-amber-500/50',
    swatch: 'bg-amber-500',
  },
  {
    id: 'rose',
    bg: 'bg-gradient-to-br from-rose-600/35 via-red-600/15 to-slate-950',
    border: 'border-rose-500/50',
    swatch: 'bg-rose-500',
  },
  {
    id: 'sky',
    bg: 'bg-gradient-to-br from-sky-600/35 via-blue-600/15 to-slate-950',
    border: 'border-sky-500/50',
    swatch: 'bg-sky-500',
  },
  {
    id: 'slate',
    bg: 'bg-gradient-to-br from-slate-600/40 via-slate-800/30 to-slate-950',
    border: 'border-slate-600/60',
    swatch: 'bg-slate-500',
  },
];

export const AVATAR_ACCESSORIES: AvatarAccessory[] = [
  'none',
  'hat',
  'shades',
  'mask',
  'monocle',
];

export interface AvatarUnlock {
  emoji: string;
  stat: keyof Pick<PlayerStats, 'totalWins' | 'totalGames' | 'imposterWins'>;
  value: number;
}

/** Avatars that stay locked in the profile picker until a stat is reached. */
export const AVATAR_UNLOCKS: AvatarUnlock[] = [
  { emoji: '🔥', stat: 'totalWins', value: 3 },
  { emoji: '🦹', stat: 'imposterWins', value: 2 },
  { emoji: '👑', stat: 'totalWins', value: 5 },
  { emoji: '👽', stat: 'totalGames', value: 10 },
  { emoji: '💎', stat: 'totalWins', value: 10 },
  { emoji: '🐲', stat: 'totalGames', value: 25 },
];

export function paletteOf(color?: AvatarColor | null): AvatarPalette {
  return AVATAR_COLORS.find((c) => c.id === color) ?? AVATAR_COLORS[0];
}

export function isAvatarColor(value: unknown): value is AvatarColor {
  return AVATAR_COLORS.some((c) => c.id === value);
}

export function isAvatarAccessory(value: unknown): value is AvatarAccessory {
  return AVATAR_ACCESSORIES.includes(value as AvatarAccessory);
}

/** Small deterministic hash so the same player always gets the same look. */
export function hashString(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i += 1) {
    hash = (hash * 31 + input.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

export function colorFromSeed(seed: string): AvatarColor {
  return AVATAR_COLORS[hashString(seed || 'agent') % AVATAR_COLORS.length].id;
}

/** Roughly one in three agents gets a random disguise accessory. */
export function accessoryFromSeed(seed: string): AvatarAccessory {
  const hash = hashString(`${seed || 'agent'}:accessory`);
  if (hash % 3 !== 0) return 'none';
  return AVATAR_ACCESSORIES[1 + (hash % (AVATAR_ACCESSORIES.length - 1))];
}

export function getInitials(name: string): string {
  const trimmed = name.trim();
  if (!trimmed) return '?';
  const parts = trimmed.split(/\s+/);
  const raw = parts.length > 1 ? `${parts[0][0]}${parts[1][0]}` : trimmed.slice(0, 2);
  return raw.toUpperCase();
}

export function avatarUnlockFor(emoji: string): AvatarUnlock | null {
  return AVATAR_UNLOCKS.find((u) => u.emoji === emoji) ?? null;
}

export function isAvatarUnlocked(emoji: string, stats: PlayerStats): boolean {
  const unlock = avatarUnlockFor(emoji);
  return !unlock || stats[unlock.stat] >= unlock.value;
}