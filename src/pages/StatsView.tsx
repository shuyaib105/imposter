import { useState } from 'react';
import { GameSettings, PlayerStats } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { loadStats, resetStats } from '../utils/storage';
import { sound } from '../utils/sound';
import { BarChart3, Trophy, Skull, Scale, Award } from 'lucide-react';
import PageHeader from '../components/PageHeader';

interface StatsViewProps {
  settings: GameSettings;
  onBack: () => void;
}

export default function StatsView({ settings, onBack }: StatsViewProps) {
  const t = TRANSLATIONS[settings.language];
  const [stats, setStats] = useState<PlayerStats>(loadStats());
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  const handleReset = () => {
    sound.playClick();
    const fresh = resetStats();
    setStats(fresh);
    setShowResetConfirm(false);
  };

  const winRate = stats.totalGames > 0
    ? Math.round((stats.totalWins / stats.totalGames) * 100)
    : 0;

  return (
    <div className="max-w-md mx-auto px-4 py-6 animate-fadeIn space-y-6">
      <PageHeader
        title={t.stats}
        code="SYS / STATS"
        backLabel={t.back}
        onBack={onBack}
        right={
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-purple-400">
            <BarChart3 className="w-3.5 h-3.5" />
            <span>{t.stats}</span>
          </span>
        }
      />

      {/* Win rate card */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/70 via-slate-900 to-indigo-950/50 border border-purple-500/40 text-center space-y-2 shadow-xl">
        <span className="text-[10px] font-mono uppercase tracking-widest text-purple-300">
          {t.playerWinRate}
        </span>
        <div className="text-4xl sm:text-5xl font-black text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
          {winRate}%
        </div>
        <p className="text-xs text-slate-400 font-mono">
          {stats.totalWins} {t.winsOutOf} {stats.totalGames} {t.matches}
        </p>
      </div>

      {/* Breakdown Grid */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <Trophy className="w-4 h-4 text-purple-400" />
            <span>{t.statsGroupWins}</span>
          </div>
          <div className="text-2xl font-black text-white font-mono">
            {stats.groupWins}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <Skull className="w-4 h-4 text-red-400" />
            <span>{t.statsImposterWins}</span>
          </div>
          <div className="text-2xl font-black text-red-300 font-mono">
            {stats.imposterWins}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <Scale className="w-4 h-4 text-amber-400" />
            <span>{t.statsTiedGames}</span>
          </div>
          <div className="text-2xl font-black text-amber-300 font-mono">
            {stats.tiedGames}
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-1">
          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
            <Award className="w-4 h-4 text-indigo-400" />
            <span>{t.statsTimesImposter}</span>
          </div>
          <div className="text-2xl font-black text-indigo-300 font-mono">
            {stats.timesImposter}
          </div>
        </div>
      </div>

      {/* Reset Stats */}
      <div className="pt-4 border-t border-slate-800">
        {!showResetConfirm ? (
          <button
            onClick={() => setShowResetConfirm(true)}
            className="w-full py-2.5 rounded-xl border border-slate-800 hover:border-red-500/40 text-slate-500 hover:text-red-400 text-xs font-mono uppercase transition cursor-pointer"
          >
            {t.clearStats}
          </button>
        ) : (
          <div className="p-3.5 rounded-2xl bg-slate-900 border border-red-500/40 space-y-2">
            <p className="text-xs text-red-300 text-center">
              {t.resetStatsConfirm}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="flex-1 py-1.5 rounded-lg bg-slate-800 text-slate-300 text-xs font-bold"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleReset}
                className="flex-1 py-1.5 rounded-lg bg-red-600 text-white text-xs font-bold shadow-md"
              >
                {t.reset}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
