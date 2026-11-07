import { GameSettings, UserProfile } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { sound } from '../utils/sound';
import AgentAvatar from '../components/AgentAvatar';
import {
  Smartphone,
  Globe,
  BookOpen,
  Users,
  Eye,
  Vote,
  Trophy,
  Pencil,
  Moon,
  Sun,
  ArrowRight,
} from 'lucide-react';

interface HomePageProps {
  settings: GameSettings;
  profile: UserProfile;
  onToggleTheme: () => void;
  onSelectProfile: () => void;
  onSelectOffline: () => void;
  onSelectOnline: () => void;
  onSelectHowToPlay: () => void;
}

export default function HomePage({
  settings,
  profile,
  onToggleTheme,
  onSelectProfile,
  onSelectOffline,
  onSelectOnline,
  onSelectHowToPlay,
}: HomePageProps) {
  const t = TRANSLATIONS[settings.language];
  const displayName = profile.name.trim() || t.setUpProfile;
  const difficultyLabel =
    settings.defaultDifficulty === 'EASY'
      ? t.difficultyEasy
      : settings.defaultDifficulty === 'MEDIUM'
        ? t.difficultyMedium
        : t.difficultyHard;

  const phases = [
    { Icon: Users, label: t.flowPlayers, color: 'text-purple-400' },
    { Icon: Eye, label: t.flowSecret, color: 'text-pink-400' },
    { Icon: Vote, label: t.flowVote, color: 'text-indigo-400' },
    { Icon: Trophy, label: t.flowVictory, color: 'text-amber-400' },
  ];

  return (
    <div className="relative mx-auto flex min-h-[90vh] w-full max-w-md flex-col px-4 pb-6 pt-5 animate-fadeIn">
      <div className="relative z-10 flex flex-1 flex-col justify-between gap-5">
        {/* Status bar: case number + theme switch */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2 font-mono text-[9px] uppercase tracking-[0.28em] text-slate-500">
            <span className="relative flex h-1.5 w-1.5">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-60" />
              <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-emerald-400" />
            </span>
            <span>{t.caseFile}</span>
            <span className="text-slate-700">//</span>
            <span className="text-slate-400">001</span>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onToggleTheme();
            }}
            title={settings.darkMode ? t.lightMode : t.darkMode}
            aria-label={settings.darkMode ? t.lightMode : t.darkMode}
            className="pressable flex h-9 w-9 items-center justify-center border border-slate-800 bg-slate-900/80 text-slate-400 transition-colors hover:border-purple-500/60 hover:text-white cursor-pointer"
          >
            {settings.darkMode ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </button>
        </div>

        {/* Title + agent dossier */}
        <div>
          <div className="pb-6 pt-1 text-center">
            <p className="font-mono text-[8px] uppercase tracking-[0.5em] text-purple-400/80">
              {t.classified} <span className="text-slate-700">//</span> {t.partyGameBadge}
            </p>
            <h1 className="mt-2 text-[44px] leading-none font-black uppercase tracking-tighter text-white drop-shadow-[0_0_24px_rgba(168,85,247,0.25)]">
              {t.gameTitle}
            </h1>
            <p className="mx-auto mt-2 max-w-[280px] font-mono text-[10px] leading-relaxed text-slate-500">
              {t.subtitle}
            </p>
          </div>

          {/* Agent ID card — opens the profile editor */}
          <button
            onClick={() => {
              sound.playClick();
              onSelectProfile();
            }}
            className="pressable group relative w-full border border-slate-700/80 bg-slate-900/70 text-left shadow-[0_18px_40px_-24px_rgba(0,0,0,0.9)] backdrop-blur-sm cursor-pointer"
          >
            {/* clipped file corner */}
            <span
              className="absolute right-0 top-0 h-4 w-4 border-b border-l border-slate-700/80 bg-slate-950"
              aria-hidden="true"
            />

            {/* rubber stamp */}
            <span className="pointer-events-none absolute -top-3 right-4 -rotate-[8deg]">
              <span className="animate-stampIn block border-2 border-red-500/70 bg-slate-950 px-2 py-0.5 font-mono text-[9px] font-black uppercase tracking-[0.22em] text-red-500/90 shadow-[0_0_12px_rgba(239,68,68,0.25)]">
                {t.classified}
              </span>
            </span>

            <div className="flex items-center justify-between border-b border-slate-800 py-2 pl-3.5 pr-16 font-mono text-[8px] uppercase tracking-[0.25em] text-slate-500">
              <span>{t.agentDossier}</span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <span className="h-1.5 w-1.5 animate-blink rounded-full bg-emerald-400" />
                {t.statusActive}
              </span>
            </div>

            <div className="flex gap-3.5 p-3.5">
              <div className="relative flex h-[88px] w-[72px] shrink-0 items-center justify-center border border-slate-700/80 bg-slate-950">
                <AgentAvatar
                  emoji={profile.avatar}
                  name={displayName}
                  color={profile.avatarColor}
                  accessory={profile.avatarAccessory}
                  size="portrait"
                  className="absolute inset-0"
                />
                <span className="absolute -left-px -top-px h-2 w-2 border-l-2 border-t-2 border-purple-400/90" />
                <span className="absolute -right-px -top-px h-2 w-2 border-r-2 border-t-2 border-purple-400/90" />
                <span className="absolute -bottom-px -left-px h-2 w-2 border-b-2 border-l-2 border-purple-400/90" />
                <span className="absolute -bottom-px -right-px h-2 w-2 border-b-2 border-r-2 border-purple-400/90" />
                <span className="absolute bottom-1 left-0 right-0 text-center font-mono text-[7px] tracking-[0.18em] text-slate-500">
                  ID-001
                </span>
              </div>

              <div className="min-w-0 flex-1">
                <p className="font-mono text-[8px] uppercase tracking-[0.25em] text-purple-400/80">
                  {t.fieldAgent}
                </p>
                <p className="truncate text-xl font-black text-white">{displayName}</p>

                <div className="mt-2.5 space-y-1 font-mono text-[9px]">
                  <div className="flex items-center justify-between gap-2 border-b border-dashed border-slate-800 pb-1">
                    <span className="uppercase tracking-widest text-slate-500">{t.clearance}</span>
                    <span className="uppercase text-slate-200">{difficultyLabel}</span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="uppercase tracking-widest text-slate-500">{t.language}</span>
                    <span className="uppercase text-slate-200">{settings.language}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between border-t border-slate-800 px-3.5 py-2 font-mono text-[9px] uppercase tracking-[0.22em] text-slate-500 transition-colors group-hover:text-purple-300">
              <span className="flex items-center gap-1.5">
                <Pencil className="h-3 w-3" />
                {t.editFile}
              </span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" />
            </div>
          </button>
        </div>

        {/* Mission select */}
        <div>
          <div className="mb-2.5 flex items-center gap-2 font-mono text-[8px] uppercase tracking-[0.3em] text-slate-500">
            <span className="text-purple-400">//</span>
            <span>{t.availableMissions}</span>
            <span className="h-px flex-1 bg-slate-800" />
          </div>

          <div className="space-y-2.5">
            <button
              onClick={() => {
                sound.playClick();
                onSelectOffline();
              }}
              className="pressable group relative w-full overflow-hidden border border-purple-500/40 bg-gradient-to-r from-purple-600/30 via-violet-600/15 to-slate-900/40 p-3.5 text-left cursor-pointer"
            >
              <span className="absolute left-0 top-0 h-full w-0.5 bg-purple-400" />
              <div className="flex items-center gap-3">
                <span className="font-mono text-2xl font-black leading-none text-purple-400/50">01</span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-purple-400/40 bg-purple-500/10 text-purple-300">
                  <Smartphone className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-black uppercase tracking-wide text-white">
                    {t.playOffline}
                  </span>
                  <span className="block truncate text-[10px] text-purple-200/70">
                    {t.offlineFeatureText}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 text-purple-200/80 transition-transform group-hover:translate-x-1" />
              </div>
            </button>

            <button
              onClick={() => {
                sound.playClick();
                onSelectOnline();
              }}
              className="pressable group relative w-full overflow-hidden border border-slate-700/80 bg-slate-900/70 p-3.5 text-left transition-colors hover:border-purple-500/50 cursor-pointer"
            >
              <span className="absolute left-0 top-0 h-full w-0.5 bg-emerald-400/70" />
              <div className="flex items-center gap-3">
                <span className="font-mono text-2xl font-black leading-none text-emerald-400/40">02</span>
                <span className="flex h-9 w-9 shrink-0 items-center justify-center border border-emerald-400/30 bg-emerald-500/10 text-emerald-300">
                  <Globe className="h-4 w-4" />
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span className="text-sm font-black uppercase tracking-wide text-white">
                      {t.playOnline}
                    </span>
                    <span className="border border-emerald-500/30 bg-emerald-500/15 px-1.5 py-px font-mono text-[8px] uppercase tracking-widest text-emerald-400">
                      {t.liveBadge}
                    </span>
                  </span>
                  <span className="block truncate text-[10px] text-slate-400">
                    {t.onlineFeatureText}
                  </span>
                </span>
                <ArrowRight className="h-4 w-4 text-slate-500 transition-transform group-hover:translate-x-1" />
              </div>
            </button>
          </div>
        </div>

        {/* Mission phases + field manual */}
        <div>
          <div className="border border-slate-800/80 bg-slate-950/50 backdrop-blur-sm">
            <div className="border-b border-slate-800/80 px-3 py-1.5 font-mono text-[8px] uppercase tracking-[0.3em] text-slate-500">
              {t.missionPhases}
            </div>
            <div className="grid grid-cols-4 divide-x divide-slate-800/70">
              {phases.map(({ Icon, label, color }, index) => (
                <div key={label} className="flex flex-col items-center gap-1 py-2.5 text-center">
                  <span className="font-mono text-[7px] tracking-widest text-slate-600">
                    0{index + 1}
                  </span>
                  <Icon className={`h-3.5 w-3.5 ${color}`} />
                  <span className="text-[9px] text-slate-400">{label}</span>
                </div>
              ))}
            </div>
          </div>

          <button
            onClick={() => {
              sound.playClick();
              onSelectHowToPlay();
            }}
            className="pressable mt-4 flex w-full items-center justify-center gap-2 border-y border-dashed border-slate-800 py-3 font-mono text-[9px] uppercase tracking-[0.3em] text-slate-500 transition-colors hover:text-slate-200 cursor-pointer"
          >
            <BookOpen className="h-3.5 w-3.5 text-purple-400/80" />
            {t.fieldManual}
          </button>
        </div>
      </div>
    </div>
  );
}