import { GameSettings, UserProfile } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { sound } from '../utils/sound';
import {
  Smartphone,
  Globe,
  BookOpen,
  Settings,
  BarChart3,
  BookPlus,
  Users,
  Eye,
  Vote,
  Trophy,
  Pencil,
} from 'lucide-react';

interface HomePageProps {
  settings: GameSettings;
  profile: UserProfile;
  onSelectProfile: () => void;
  onSelectOffline: () => void;
  onSelectOnline: () => void;
  onSelectHowToPlay: () => void;
  onSelectSettings: () => void;
  onSelectStats: () => void;
  onSelectCustomWords: () => void;
}

export default function HomePage({
  settings,
  profile,
  onSelectProfile,
  onSelectOffline,
  onSelectOnline,
  onSelectHowToPlay,
  onSelectSettings,
  onSelectStats,
  onSelectCustomWords,
}: HomePageProps) {
  const t = TRANSLATIONS[settings.language];

  return (
    <div className="max-w-md mx-auto px-4 py-8 min-h-[90vh] flex flex-col justify-between animate-fadeIn">
      {/* Top Brand & Logo */}
      <div className="text-center space-y-4 pt-4">
        {/* Animated Brand Badge */}
        <div className="relative inline-flex items-center justify-center">
          <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-purple-600 via-violet-600 to-indigo-600 p-0.5 shadow-2xl shadow-purple-600/30 animate-pulse">
            <div className="w-full h-full bg-slate-950 rounded-[22px] flex items-center justify-center text-4xl">
              🕵️‍♂️
            </div>
          </div>
          <span className="absolute -top-2 -right-2 bg-gradient-to-r from-pink-500 to-purple-500 text-white text-[9px] font-black uppercase px-2 py-0.5 rounded-full border border-purple-300/40 shadow-sm">
            {t.partyGameBadge}
          </span>
        </div>

        <div>
          <h1 className="text-4xl sm:text-5xl font-black tracking-tight text-white uppercase font-sans">
            {t.gameTitle}
          </h1>
          <p className="text-xs sm:text-sm text-purple-300 font-medium tracking-wide mt-1.5">
            "{t.subtitle}"
          </p>
        </div>

        {/* Profile chip: opens the profile editor */}
        <button
          onClick={() => {
            sound.playClick();
            onSelectProfile();
          }}
          className="mx-auto flex items-center gap-2 px-3 py-1.5 rounded-full bg-slate-900/80 border border-slate-800 hover:border-purple-500/60 transition cursor-pointer group"
        >
          <span className="w-7 h-7 rounded-full bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-sm shrink-0">
            {profile.avatar}
          </span>
          <span className="text-[11px] font-semibold text-slate-300 group-hover:text-white max-w-[150px] truncate transition">
            {profile.name.trim() || t.setUpProfile}
          </span>
          <Pencil className="w-3 h-3 text-slate-500 group-hover:text-purple-300 transition shrink-0" />
        </button>

        {/* Small live animated preview of the 4-phase game loop */}
        <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md flex items-center justify-around text-center text-[10px] font-mono text-slate-400">
          <div className="flex flex-col items-center gap-1">
            <Users className="w-4 h-4 text-purple-400" />
            <span>{t.flowPlayers}</span>
          </div>
          <span>→</span>
          <div className="flex flex-col items-center gap-1">
            <Eye className="w-4 h-4 text-pink-400" />
            <span>{t.flowSecret}</span>
          </div>
          <span>→</span>
          <div className="flex flex-col items-center gap-1">
            <Vote className="w-4 h-4 text-indigo-400" />
            <span>{t.flowVote}</span>
          </div>
          <span>→</span>
          <div className="flex flex-col items-center gap-1">
            <Trophy className="w-4 h-4 text-amber-400" />
            <span>{t.flowVictory}</span>
          </div>
        </div>
      </div>

      {/* Main Play Action Buttons */}
      <div className="space-y-3.5 my-6">
        {/* Offline Mode Button */}
        <button
          onClick={() => {
            sound.playClick();
            onSelectOffline();
          }}
          className="w-full p-4.5 rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:scale-[1.02] active:scale-[0.99] text-white flex items-center justify-between shadow-xl shadow-purple-900/40 border border-purple-400/30 transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center text-white shrink-0 group-hover:scale-110 transition-transform">
              <Smartphone className="w-6 h-6" />
            </div>
            <div>
              <span className="text-base font-extrabold uppercase tracking-wide block">
                {t.playOffline}
              </span>
              <span className="text-[11px] text-purple-200 block font-normal">
                {t.offlineFeatureText}
              </span>
            </div>
          </div>
          <span className="text-lg text-purple-200 group-hover:translate-x-1 transition-transform">
            →
          </span>
        </button>

        {/* Online Multiplayer Mode Button */}
        <button
          onClick={() => {
            sound.playClick();
            onSelectOnline();
          }}
          className="w-full p-4.5 rounded-2xl bg-slate-900/90 hover:bg-slate-800/90 border border-purple-500/30 hover:border-purple-500/60 hover:scale-[1.02] active:scale-[0.99] text-white flex items-center justify-between shadow-lg transition-all cursor-pointer group"
        >
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-12 h-12 rounded-xl bg-purple-950/80 border border-purple-500/30 flex items-center justify-center text-purple-300 shrink-0 group-hover:scale-110 transition-transform">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold uppercase tracking-wide block">
                  {t.playOnline}
                </span>
                <span className="bg-emerald-500/20 text-emerald-400 text-[9px] font-mono px-1.5 py-0.2 rounded border border-emerald-500/30">
                  {t.liveBadge}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 block font-normal">
                {t.onlineFeatureText}
              </span>
            </div>
          </div>
          <span className="text-lg text-slate-400 group-hover:translate-x-1 transition-transform">
            →
          </span>
        </button>
      </div>

      {/* Auxiliary Nav Buttons */}
      <div className="grid grid-cols-4 gap-2 pt-2 border-t border-slate-800/80">
        <button
          onClick={() => {
            sound.playClick();
            onSelectHowToPlay();
          }}
          className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-purple-400" />
          <span className="text-[10px] font-medium truncate max-w-full">{t.howToPlay}</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onSelectStats();
          }}
          className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <BarChart3 className="w-4 h-4 text-indigo-400" />
          <span className="text-[10px] font-medium truncate max-w-full">{t.stats}</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onSelectCustomWords();
          }}
          className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <BookPlus className="w-4 h-4 text-pink-400" />
          <span className="text-[10px] font-medium truncate max-w-full">{t.customWords}</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            onSelectSettings();
          }}
          className="flex flex-col items-center justify-center gap-1 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 text-slate-400 hover:text-white transition cursor-pointer"
        >
          <Settings className="w-4 h-4 text-slate-400" />
          <span className="text-[10px] font-medium truncate max-w-full">{t.settings}</span>
        </button>
      </div>
    </div>
  );
}
