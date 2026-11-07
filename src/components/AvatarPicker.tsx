import { AVATARS } from '../data/words';
import { AvatarAccessory, AvatarColor, GameLanguage, PlayerStats } from '../types';
import {
  AVATAR_ACCESSORIES,
  AVATAR_COLORS,
  AVATAR_UNLOCKS,
  avatarUnlockFor,
} from '../game/avatar';
import { TRANSLATIONS } from '../data/translations';
import { Ban, Glasses, GraduationCap, Lock, Search, VenetianMask } from 'lucide-react';

interface AvatarPickerProps {
  language: GameLanguage;
  value: string;
  color: AvatarColor;
  accessory: AvatarAccessory;
  stats: PlayerStats;
  onChange: (avatar: string) => void;
  onColorChange: (color: AvatarColor) => void;
  onAccessoryChange: (accessory: AvatarAccessory) => void;
}

const ACCESSORY_ICON = {
  hat: GraduationCap,
  shades: Glasses,
  mask: VenetianMask,
  monocle: Search,
} as const;

export default function AvatarPicker({
  language,
  value,
  color,
  accessory,
  stats,
  onChange,
  onColorChange,
  onAccessoryChange,
}: AvatarPickerProps) {
  const t = TRANSLATIONS[language];

  const requirementLabel = (stat: keyof PlayerStats) =>
    stat === 'totalGames'
      ? t.unlockGamesLabel
      : stat === 'imposterWins'
        ? t.unlockImposterWinsLabel
        : t.unlockWinsLabel;

  const lockedAvatars = AVATAR_UNLOCKS.filter((u) => stats[u.stat] < u.value);

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-8 gap-1.5 max-h-44 overflow-y-auto pr-1 no-scrollbar">
        {AVATARS.map((av) => {
          const unlock = avatarUnlockFor(av);
          const locked = !!unlock && stats[unlock.stat] < unlock.value;
          return (
            <button
              key={av}
              type="button"
              onClick={() => {
                if (!locked) onChange(av);
              }}
              disabled={locked}
              aria-label={av}
              aria-pressed={value === av}
              title={
                locked && unlock
                  ? `${t.lockedAvatar} · ${unlock.value}+ ${requirementLabel(unlock.stat)}`
                  : av
              }
              className={`relative aspect-square rounded-xl flex items-center justify-center text-xl border transition ${
                locked
                  ? 'bg-slate-950 border-slate-800 opacity-50 cursor-not-allowed'
                  : value === av
                    ? 'bg-purple-950 border-purple-400 scale-105 shadow-lg shadow-purple-900/30 cursor-pointer'
                    : 'bg-slate-900 border-slate-800 hover:border-slate-600 cursor-pointer'
              }`}
            >
              <span className={locked ? 'grayscale' : ''}>{av}</span>
              {locked && (
                <span className="absolute inset-0 flex flex-col items-center justify-center gap-0.5 rounded-xl bg-slate-950/55">
                  <Lock className="h-3 w-3 text-slate-300" />
                  <span className="font-mono text-[7px] font-bold leading-none text-slate-300">
                    {unlock.value}
                  </span>
                </span>
              )}
            </button>
          );
        })}
      </div>

      {lockedAvatars.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {lockedAvatars.map((u) => (
            <span
              key={u.emoji}
              className="flex items-center gap-1 rounded border border-slate-800 bg-slate-950/70 px-1.5 py-0.5 font-mono text-[8px] text-slate-500"
            >
              <Lock className="h-2.5 w-2.5" />
              <span>{u.emoji}</span>
              <span>
                {u.value}+ {requirementLabel(u.stat)}
              </span>
            </span>
          ))}
        </div>
      )}

      <div>
        <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-widest text-slate-500">
          {t.avatarColor}
        </span>
        <div className="flex gap-1.5">
          {AVATAR_COLORS.map((palette) => (
            <button
              key={palette.id}
              type="button"
              onClick={() => onColorChange(palette.id)}
              aria-label={palette.id}
              aria-pressed={color === palette.id}
              className={`h-7 w-7 rounded-full border-2 transition cursor-pointer ${palette.swatch} ${
                color === palette.id
                  ? 'scale-110 border-white shadow-lg'
                  : 'border-transparent hover:scale-105'
              }`}
            />
          ))}
        </div>
      </div>

      <div>
        <span className="mb-1.5 block font-mono text-[9px] uppercase tracking-widest text-slate-500">
          {t.avatarAccessory}
        </span>
        <div className="flex flex-wrap gap-1.5">
          {AVATAR_ACCESSORIES.map((item) => {
            const Icon = item === 'none' ? Ban : ACCESSORY_ICON[item];
            const label =
              item === 'none'
                ? t.accessoryNone
                : item === 'hat'
                  ? t.accessoryHat
                  : item === 'shades'
                    ? t.accessoryShades
                    : item === 'mask'
                      ? t.accessoryMask
                      : t.accessoryMonocle;
            const active = accessory === item;
            return (
              <button
                key={item}
                type="button"
                onClick={() => onAccessoryChange(item)}
                aria-label={label}
                aria-pressed={active}
                className={`flex items-center gap-1 rounded-lg border px-2 py-1 font-mono text-[9px] uppercase tracking-wider transition cursor-pointer ${
                  active
                    ? 'border-purple-500/60 bg-purple-950/70 text-purple-200'
                    : 'border-slate-800 bg-slate-900 text-slate-500 hover:text-slate-300'
                }`}
              >
                <Icon className="h-3 w-3" />
                <span>{label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}