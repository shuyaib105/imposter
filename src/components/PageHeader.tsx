import type { ReactNode } from 'react';
import { ArrowLeft, type LucideIcon } from 'lucide-react';
import { sound } from '../utils/sound';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  /** File code shown above the title, e.g. "OP-01 / SETUP" */
  code?: string;
  onBack?: () => void;
  backLabel?: string;
  backIcon?: LucideIcon;
  right?: ReactNode;
}

export default function PageHeader({
  title,
  subtitle,
  code,
  onBack,
  backLabel = 'Back',
  backIcon,
  right,
}: PageHeaderProps) {
  const BackIcon = backIcon ?? ArrowLeft;
  return (
    <div className="mb-5">
      <div className="flex items-center justify-between gap-3 border-b border-slate-800/80 pb-2.5">
        {onBack ? (
          <button
            onClick={() => {
              sound.playClick();
              onBack();
            }}
            className="pressable flex items-center gap-1.5 border border-slate-800 bg-slate-900/70 px-2.5 py-1.5 font-mono text-[9px] uppercase tracking-[0.2em] text-slate-400 transition-colors hover:border-purple-500/60 hover:text-white cursor-pointer"
          >
            <BackIcon className="h-3.5 w-3.5" />
            {backLabel}
          </button>
        ) : (
          <span className="font-mono text-[8px] uppercase tracking-[0.28em] text-slate-500">
            <span className="text-emerald-400">●</span> Live File
          </span>
        )}

        {right ?? <span className="h-1.5 w-1.5 bg-purple-400/70" aria-hidden="true" />}
      </div>

      <div className="pt-3.5">
        {code && (
          <p className="font-mono text-[8px] uppercase tracking-[0.32em] text-purple-400/80">
            <span className="text-slate-600">//</span> {code}
          </p>
        )}
        <h2 className="mt-1 text-2xl font-black uppercase tracking-tight text-white">{title}</h2>
        {subtitle && <p className="mt-1 text-xs text-slate-400">{subtitle}</p>}
      </div>
    </div>
  );
}