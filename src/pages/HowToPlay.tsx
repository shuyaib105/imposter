import { GameSettings } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { BookOpen, ShieldAlert, Users, Trophy, Sparkles } from 'lucide-react';
import PageHeader from '../components/PageHeader';

interface HowToPlayProps {
  settings: GameSettings;
  onBack: () => void;
}

export default function HowToPlay({ settings, onBack }: HowToPlayProps) {
  const t = TRANSLATIONS[settings.language];

  return (
    <div className="max-w-md mx-auto px-4 py-6 animate-fadeIn space-y-6">
      <PageHeader
        title={t.howToPlay}
        code="SYS / FIELD MANUAL"
        backLabel={t.back}
        onBack={onBack}
        right={
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-purple-400">
            <BookOpen className="w-3.5 h-3.5" />
            <span>{t.howToPlay}</span>
          </span>
        }
      />

      {/* Main Overview */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-950/60 via-slate-900 to-indigo-950/40 border border-purple-500/30 space-y-2 shadow-xl">
        <h2 className="text-lg font-black text-white uppercase flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>{t.rulesOverview}</span>
        </h2>
        <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
          {t.rulesOverviewText}
        </p>
      </div>

      {/* Step by Step Breakdown */}
      <div className="space-y-3">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Users className="w-4 h-4 text-purple-400" />
            <span>{t.rule1Title}</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.rule1Text}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1.5">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <ShieldAlert className="w-4 h-4 text-indigo-400" />
            <span>{t.rule2Title}</span>
          </h3>
          <p className="text-xs text-slate-400 leading-relaxed">
            {t.rule2Text}
          </p>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-purple-500/30 space-y-2">
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>{t.rule3Title}</span>
          </h3>
          <div className="text-xs text-slate-300 space-y-1 font-mono whitespace-pre-line bg-slate-950/70 p-3 rounded-xl border border-slate-800">
            {t.rule3Text}
          </div>
        </div>
      </div>
    </div>
  );
}
