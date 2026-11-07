import { Glasses, GraduationCap, Search, VenetianMask } from 'lucide-react';
import { AvatarAccessory, AvatarColor } from '../types';
import {
  accessoryFromSeed,
  colorFromSeed,
  getInitials,
  paletteOf,
} from '../game/avatar';

export type AvatarStatus = 'online' | 'ready' | 'host' | 'imposter';

interface AgentAvatarProps {
  emoji?: string;
  name?: string;
  color?: AvatarColor;
  accessory?: AvatarAccessory;
  status?: AvatarStatus;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl' | 'portrait';
  className?: string;
}

const SIZE = {
  xs: { box: 'h-7 w-7 rounded-lg', text: 'text-sm', initials: 'text-[10px]', badge: 'h-3 w-3', icon: 'h-2 w-2' },
  sm: { box: 'h-9 w-9 rounded-xl', text: 'text-lg', initials: 'text-xs', badge: 'h-3.5 w-3.5', icon: 'h-2.5 w-2.5' },
  md: { box: 'h-11 w-11 rounded-xl', text: 'text-xl', initials: 'text-sm', badge: 'h-4 w-4', icon: 'h-2.5 w-2.5' },
  lg: { box: 'h-16 w-16 rounded-2xl', text: 'text-3xl', initials: 'text-lg', badge: 'h-5 w-5', icon: 'h-3 w-3' },
  xl: { box: 'h-20 w-20 rounded-3xl', text: 'text-4xl', initials: 'text-xl', badge: 'h-6 w-6', icon: 'h-3.5 w-3.5' },
  portrait: { box: 'h-[88px] w-[72px] rounded-none', text: 'text-3xl', initials: 'text-lg', badge: 'h-5 w-5', icon: 'h-3 w-3' },
} as const;

const STATUS_RING: Record<AvatarStatus, string> = {
  online: 'ring-2 ring-emerald-400/80',
  ready: 'ring-2 ring-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.35)]',
  host: 'ring-2 ring-amber-400 shadow-[0_0_10px_rgba(251,191,36,0.35)]',
  imposter: 'ring-2 ring-red-500 shadow-[0_0_14px_rgba(239,68,68,0.45)]',
};

const ACCESSORY_ICON = {
  hat: GraduationCap,
  shades: Glasses,
  mask: VenetianMask,
  monocle: Search,
} as const;

export default function AgentAvatar({
  emoji,
  name = '',
  color,
  accessory,
  status,
  size = 'md',
  className = '',
}: AgentAvatarProps) {
  const seed = name || emoji || 'agent';
  const palette = paletteOf(color ?? colorFromSeed(seed));
  const look = accessory ?? accessoryFromSeed(seed);
  const sizing = SIZE[size];
  const AccessoryIcon = look !== 'none' ? ACCESSORY_ICON[look] : null;

  return (
    <span
      className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden border ${palette.bg} ${palette.border} ${sizing.box} ${
        status ? STATUS_RING[status] : ''
      } ${className}`}
      aria-hidden="true"
    >
      {emoji ? (
        <span className={`${sizing.text} leading-none`}>{emoji}</span>
      ) : (
        <span className={`${sizing.initials} font-mono font-black tracking-tight text-white/90`}>
          {getInitials(name)}
        </span>
      )}

      {AccessoryIcon && (
        <span
          className={`absolute bottom-0 right-0 flex items-center justify-center border border-slate-700 bg-slate-950 text-slate-200 ${sizing.badge}`}
        >
          <AccessoryIcon className={sizing.icon} strokeWidth={2.2} />
        </span>
      )}
    </span>
  );
}