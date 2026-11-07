import React, { useEffect, useMemo, useRef, useState } from 'react';
import { AvatarAccessory, AvatarColor, GameSettings, UserProfile } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { AVATARS } from '../data/words';
import { AVATAR_COLORS, isAvatarUnlocked } from '../game/avatar';
import { loadStats } from '../utils/storage';
import AvatarPicker from '../components/AvatarPicker';
import AgentAvatar from '../components/AgentAvatar';
import { sound } from '../utils/sound';
import { Check, Save, Shuffle, UserRound } from 'lucide-react';
import PageHeader from '../components/PageHeader';

interface ProfileViewProps {
  settings: GameSettings;
  profile: UserProfile;
  onSave: (profile: UserProfile) => void;
  onBack: () => void;
}

export default function ProfileView({ settings, profile, onSave, onBack }: ProfileViewProps) {
  const t = TRANSLATIONS[settings.language];
  const stats = useMemo(() => loadStats(), []);
  const [name, setName] = useState(profile.name);
  const [avatar, setAvatar] = useState(profile.avatar);
  const [avatarColor, setAvatarColor] = useState<AvatarColor>(profile.avatarColor ?? 'violet');
  const [avatarAccessory, setAvatarAccessory] = useState<AvatarAccessory>(
    profile.avatarAccessory ?? 'none'
  );
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
    const pool = AVATARS.filter((a) => a !== avatar && isAvatarUnlocked(a, stats));
    setAvatar(pool[Math.floor(Math.random() * pool.length)]);
    setAvatarColor(AVATAR_COLORS[Math.floor(Math.random() * AVATAR_COLORS.length)].id);
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
    onSave({ name: trimmed, avatar, avatarColor, avatarAccessory });
    setName(trimmed);
    setErrorMsg('');
    setSaved(true);
    if (savedTimer.current !== null) window.clearTimeout(savedTimer.current);
    savedTimer.current = window.setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 animate-fadeIn space-y-5">
      <PageHeader
        title={t.editProfile}
        subtitle={t.profileSubtitle}
        code="ID / AGENT"
        backLabel={t.back}
        onBack={onBack}
        right={
          <span className="flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.18em] text-purple-400">
            <UserRound className="w-3.5 h-3.5" />
            <span>{t.myProfile}</span>
          </span>
        }
      />

      {/* Profile preview */}
      <div className="p-5 rounded-3xl bg-gradient-to-br from-purple-950/60 via-slate-900 to-indigo-950/40 border border-purple-500/30 flex items-center gap-4 shadow-xl">
        <AgentAvatar
          emoji={avatar}
          name={name}
          color={avatarColor}
          accessory={avatarAccessory}
          size="lg"
          status="online"
          className="shadow-lg shadow-purple-900/30"
        />
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
            language={settings.language}
            value={avatar}
            color={avatarColor}
            accessory={avatarAccessory}
            stats={stats}
            onChange={(av) => {
              sound.playClick();
              setAvatar(av);
              setSaved(false);
            }}
            onColorChange={(next) => {
              sound.playClick();
              setAvatarColor(next);
              setSaved(false);
            }}
            onAccessoryChange={(next) => {
              sound.playClick();
              setAvatarAccessory(next);
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
