import { Home, BarChart3, BookPlus, Settings as SettingsIcon } from 'lucide-react';
import { GamePhase, GameSettings } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { sound } from '../utils/sound';

interface BottomNavProps {
  settings: GameSettings;
  activePhase: GamePhase;
  onNavigate: (phase: GamePhase) => void;
}

export default function BottomNav({ settings, activePhase, onNavigate }: BottomNavProps) {
  const t = TRANSLATIONS[settings.language];

  const tabs: { phase: GamePhase; label: string; Icon: typeof Home }[] = [
    { phase: 'HOME', label: t.home, Icon: Home },
    { phase: 'STATS', label: t.stats, Icon: BarChart3 },
    { phase: 'CUSTOM_WORDS', label: t.customWords, Icon: BookPlus },
    { phase: 'SETTINGS', label: t.settings, Icon: SettingsIcon },
  ];

  return (
    <nav className="fixed inset-x-0 bottom-0 z-40 pointer-events-none">
      <div className="mx-auto w-full max-w-md px-3 pb-[calc(env(safe-area-inset-bottom)+10px)]">
        <div className="pointer-events-auto grid grid-cols-4 gap-1 rounded-2xl border border-slate-800/80 bg-slate-950/85 px-1.5 py-1.5 shadow-[0_18px_40px_-12px_rgba(0,0,0,0.9)] backdrop-blur-xl">
          {tabs.map(({ phase, label, Icon }) => {
            const isActive = activePhase === phase;
            return (
              <button
                key={phase}
                onClick={() => {
                  if (!isActive) sound.playClick();
                  onNavigate(phase);
                }}
                aria-current={isActive ? 'page' : undefined}
                className={`pressable relative flex flex-col items-center justify-center gap-1 rounded-xl py-1.5 transition-colors cursor-pointer ${
                  isActive ? 'text-purple-300' : 'text-slate-500 hover:text-slate-300'
                }`}
              >
                <span
                  className={`absolute top-0 h-0.5 w-6 rounded-full bg-purple-400 transition-opacity ${
                    isActive
                      ? 'opacity-100 shadow-[0_0_10px_2px_rgba(168,85,247,0.55)]'
                      : 'opacity-0'
                  }`}
                />
                <Icon
                  className={`w-5 h-5 ${
                    isActive ? 'drop-shadow-[0_0_8px_rgba(168,85,247,0.5)]' : ''
                  }`}
                  strokeWidth={isActive ? 2.4 : 2}
                />
                <span
                  className={`text-[10px] leading-none ${
                    isActive ? 'font-bold' : 'font-medium'
                  }`}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}
