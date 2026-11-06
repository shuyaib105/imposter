import React, { useEffect, useRef, useState } from 'react';
import { GameSettings, UserProfile } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { AVATARS } from '../data/words';
import AvatarPicker from '../components/AvatarPicker';
import { sound } from '../utils/sound';
import { Check, Save, Shuffle, UserRound } from 'lucide-react';

interface ProfileViewProps {
  settings: GameSettings;
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onBack: () => void;
}

export default function ProfileView({ settings, profile, onSave, onBack }: ProfileViewProps) {
  const t = TRANSLATIONS[settings.language];
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [errorMsg, setErrorMsg] = useState('');
  const [saved, setSaved] = useState(false);
  const savedTimer = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (savedTimer.current !== null) window.clearTimeout(savedTimer.current);
    };
  }, []);

  const handleShuffle = () => {
    sound.playClick();
    const pool = AVATARS.filter((a) => a !== avatar);
    setAvatar(pool[Math.floor(Math.random() * pool.length)]);
    setSaved(false);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const trimmed = name.trim();
    if (!trimmed) {
      setErrorMsg(t.enterName);
      return;
    }
    sound.playClick();
    onSave({ name: trimmed, avatar });
    setName(trimmed);
    setErrorMsg('');
    setSaved(true);
    if (savedTimer.current !== null) window.clearTimeout(savedTimer.current);
    savedTimer.current = window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 animate-fadeIn space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <button
          onClick={onBack}
          className="text-xs uppercase font-mono tracking-widest text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 transition cursor-pointer"
        >
          ← {t.back}
        </button>
        <div className="flex items-center gap-1.5 text-xs font-mono text-purple-400">
          <UserRound className="w-3.5 h-3.5" />
          <span>{t.myProfile}</span>
        </div>
      </div>

      <div className="text-center space-y-1">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {t.editProfile}
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm">{t.profileSubtitle}</p>
      </div>

      {/* Profile preview */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-950/60 via-slate-900 to-indigo-950/40 border border-purple-500/30 flex items-center gap-4 shadow-xl">
        <div className="w-16 h-16 rounded-2xl bg-slate-950/80 border border-purple-500/40 flex items-center justify-center text-3xl shrink-0 shadow-lg shadow-purple-900/30">
          {avatar}
        </div>
        <div className="min-w-0">
          <span className="text-[10px] font-mono uppercase tracking-widest text-purple-300 block">
            {t.displayName}
          </span>
          <p className="text-lg font-black text-white truncate">
            {name.trim() || t.setUpProfile}
          </p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="text-xs font-mono uppercase text-slate-400 block mb-1.5">
            {t.displayName}
          </label>
          <input
            type="text"
            maxLength={24}
            value={name}
            onChange={(e) => {
              setName(e.target.value);
              setErrorMsg('');
              setSaved(false);
            }}
            placeholder={t.namePlaceholder}
            className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition"
          />
        </div>

        <div>
          <div className="flex items-center justify-between mb-1.5">
            <label className="text-xs font-mono uppercase text-slate-400">
              {t.avatarCollection}
            </label>
            <button
              type="button"
              onClick={handleShuffle}
              className="flex items-center gap-1 text-[10px] font-mono uppercase tracking-wider text-purple-300 hover:text-purple-200 px-2 py-1 rounded-lg border border-purple-500/30 bg-purple-950/40 transition cursor-pointer"
            >
              <Shuffle className="w-3 h-3" />
              <span>{t.shuffleAvatar}</span>
            </button>
          </div>
          <AvatarPicker
            value={avatar}
            onChange={(av) => {
              sound.playClick();
              setAvatar(av);
              setSaved(false);
            }}
          />
        </div>

        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs animate-shake">
            {errorMsg}
          </div>
        )}

        {saved && (
          <div className="p-3 rounded-xl bg-emerald-950/50 border border-emerald-500/40 text-emerald-300 text-xs flex items-center gap-2">
            <Check className="w-4 h-4 shrink-0 text-emerald-400" />
            <span>{t.profileSaved}</span>
          </div>
        )}

        <button
          type="submit"
          className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:scale-[1.02] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-purple-900/30 transition cursor-pointer"
        >
          <Save className="w-4 h-4" />
          <span>{t.saveProfile}</span>
        </button>
      </form>
    </div>
  );
}
