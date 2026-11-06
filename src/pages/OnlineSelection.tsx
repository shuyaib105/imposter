import React, { useState } from 'react';
import { GameSettings, OnlineModeType, GameDifficulty, WordPair, UserProfile } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { CATEGORIES, CUSTOM_CATEGORY_ID } from '../data/words';
import { sound } from '../utils/sound';
import { createOnlineRoom, joinOnlineRoom } from '../services/onlineEngine';
import AvatarPicker from '../components/AvatarPicker';
import { PlusCircle, LogIn, ArrowRight, ShieldAlert, MessageSquare, Radio } from 'lucide-react';

interface OnlineSelectionProps {
  settings: GameSettings;
  customWords: WordPair[];
  profile: UserProfile;
  onSaveProfile: (profile: UserProfile) => void;
  onRoomJoined: (roomCode: string, playerId: string) => void;
  onBack: () => void;
}

export default function OnlineSelection({
  settings,
  customWords,
  profile,
  onSaveProfile,
  onRoomJoined,
  onBack,
}: OnlineSelectionProps) {
  const t = TRANSLATIONS[settings.language];
  const [tab, setTab] = useState<'CREATE' | 'JOIN'>('CREATE');

  // Create form state
  const [hostName, setHostName] = useState(profile.name);
  const [hostAvatar, setHostAvatar] = useState(profile.avatar);
  const [onlineMode, setOnlineMode] = useState<OnlineModeType>('CHAT_ON');
  const [category, setCategory] = useState(CATEGORIES[0].id);
  const [difficulty, setDifficulty] = useState<GameDifficulty>(
    settings.defaultDifficulty
  );

  // Join form state
  const [joinCode, setJoinCode] = useState('');
  const [joinName, setJoinName] = useState(profile.name);
  const [joinAvatar, setJoinAvatar] = useState(profile.avatar);

  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const categoryOptions = [
    ...CATEGORIES.map((cat) => ({
      id: cat.id,
      label: settings.language === 'bn' ? cat.bn : cat.en,
    })),
    ...(customWords.length > 0
      ? [
          {
            id: CUSTOM_CATEGORY_ID,
            label: t.customWords,
          },
        ]
      : []),
  ];

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const name = hostName.trim();
    if (!name) {
      setErrorMsg(t.enterName);
      return;
    }

    try {
      setIsLoading(true);
      sound.playClick();
      const res = await createOnlineRoom(name, hostAvatar, onlineMode, category, difficulty);
      onSaveProfile({ name, avatar: hostAvatar });
      onRoomJoined(res.roomCode, res.playerId);
    } catch (err) {
      console.error(err);
      setErrorMsg(t.createFailed);
    } finally {
      setIsLoading(false);
    }
  };

  const handleJoin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    const name = joinName.trim();
    const code = joinCode.trim().toUpperCase();

    if (!code || code.length !== 6) {
      setErrorMsg(t.roomCodeLength);
      return;
    }
    if (!name) {
      setErrorMsg(t.enterName);
      return;
    }

    try {
      setIsLoading(true);
      sound.playClick();
      const res = await joinOnlineRoom(code, name, joinAvatar);
      if (!res.success) {
        if (res.error === 'ROOM_NOT_FOUND') setErrorMsg(t.roomNotFound);
        else if (res.error === 'ROOM_FULL') setErrorMsg(t.roomFull);
        else if (res.error === 'GAME_ALREADY_STARTED') setErrorMsg(t.gameAlreadyStarted);
        else if (res.error === 'NAME_DUPLICATE') setErrorMsg(t.nameDuplicateWarning);
        else setErrorMsg(t.joinFailed);
        return;
      }
      if (res.playerId) {
        onSaveProfile({ name, avatar: joinAvatar });
        onRoomJoined(code, res.playerId);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(t.joinFailed);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="text-xs uppercase font-mono tracking-widest text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 transition cursor-pointer"
        >
          ← {t.back}
        </button>
        <span className="text-xs font-mono text-purple-400 bg-purple-950/40 border border-purple-500/30 px-3 py-1 rounded-full">
          {t.realtimeOnline}
        </span>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
          {t.playOnline}
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">
          {t.onlineSubtitle}
        </p>
      </div>

      {/* Tabs */}
      <div className="flex bg-slate-900/80 p-1 rounded-2xl border border-slate-800 mb-6">
        <button
          onClick={() => {
            sound.playClick();
            setTab('CREATE');
            setErrorMsg('');
          }}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer ${
            tab === 'CREATE'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <PlusCircle className="w-3.5 h-3.5" />
          <span>{t.createRoom}</span>
        </button>

        <button
          onClick={() => {
            sound.playClick();
            setTab('JOIN');
            setErrorMsg('');
          }}
          className={`flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer ${
            tab === 'JOIN'
              ? 'bg-purple-600 text-white shadow-md'
              : 'text-slate-400 hover:text-white'
          }`}
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>{t.joinRoom}</span>
        </button>
      </div>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 animate-shake">
          <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* CREATE ROOM FORM */}
      {tab === 'CREATE' && (
        <form onSubmit={handleCreate} className="space-y-4">
          <div>
            <label className="text-xs font-mono uppercase text-slate-400 block mb-1.5">
              {t.yourName}
            </label>
            <input
              type="text"
              required
              maxLength={20}
              value={hostName}
              onChange={(e) => setHostName(e.target.value)}
              placeholder={t.nicknamePlaceholder}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-slate-400 block mb-1.5">
              {t.chooseAvatar}
            </label>
            <AvatarPicker
              value={hostAvatar}
              onChange={(av) => {
                sound.playClick();
                setHostAvatar(av);
              }}
            />
          </div>

          {/* Mode Switcher: Mode A (Chat On) vs Mode B (Chat Off) */}
          <div>
            <label className="text-xs font-mono uppercase text-slate-400 block mb-1.5">
              {t.chatMode}
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOnlineMode('CHAT_ON')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                  onlineMode === 'CHAT_ON'
                    ? 'bg-purple-950/70 border-purple-500 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs mb-0.5">
                  <MessageSquare className="w-3.5 h-3.5 text-purple-400" />
                  <span>{t.chatOn}</span>
                </div>
                <span className="text-[10px] text-slate-400 block">
                  {t.chatOnDesc}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setOnlineMode('CHAT_OFF')}
                className={`p-3 rounded-xl border text-left cursor-pointer transition ${
                  onlineMode === 'CHAT_OFF'
                    ? 'bg-purple-950/70 border-purple-500 text-white'
                    : 'bg-slate-900/60 border-slate-800 text-slate-400 hover:text-white'
                }`}
              >
                <div className="flex items-center gap-1.5 font-bold text-xs mb-0.5">
                  <Radio className="w-3.5 h-3.5 text-purple-400" />
                  <span>{t.chatOff}</span>
                </div>
                <span className="text-[10px] text-slate-400 block">
                  {t.chatOffDesc}
                </span>
              </button>
            </div>
          </div>

          {/* Category & Difficulty */}
          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1.5">
                {t.category}
              </label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                {categoryOptions.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs font-mono uppercase text-slate-400 block mb-1.5">
                {t.difficulty}
              </label>
              <select
                value={difficulty}
                onChange={(e) => setDifficulty(e.target.value as GameDifficulty)}
                className="w-full bg-slate-900 border border-slate-800 rounded-xl px-3 py-2.5 text-xs text-white focus:outline-none focus:border-purple-500"
              >
                <option value="EASY">{t.difficultyEasy}</option>
                <option value="MEDIUM">{t.difficultyMedium}</option>
                <option value="HARD">{t.difficultyHard}</option>
              </select>
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:scale-[1.02] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-purple-900/30 transition cursor-pointer mt-2"
          >
            <span>{isLoading ? t.creatingRoom : t.createRoom}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}

      {/* JOIN ROOM FORM */}
      {tab === 'JOIN' && (
        <form onSubmit={handleJoin} className="space-y-4">
          <div>
            <label className="text-xs font-mono uppercase text-slate-400 block mb-1.5">
              {t.roomCode}
            </label>
            <input
              type="text"
              required
              maxLength={6}
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value.toUpperCase())}
              placeholder={t.roomCodePlaceholder}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-lg font-mono tracking-widest text-center text-purple-300 placeholder-slate-600 focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-slate-400 block mb-1.5">
              {t.yourName}
            </label>
            <input
              type="text"
              required
              maxLength={20}
              value={joinName}
              onChange={(e) => setJoinName(e.target.value)}
              placeholder={t.joinNamePlaceholder}
              className="w-full bg-slate-900 border border-slate-800 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-600 focus:outline-none focus:border-purple-500 transition"
            />
          </div>

          <div>
            <label className="text-xs font-mono uppercase text-slate-400 block mb-1.5">
              {t.chooseAvatar}
            </label>
            <AvatarPicker
              value={joinAvatar}
              onChange={(av) => {
                sound.playClick();
                setJoinAvatar(av);
              }}
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:scale-[1.02] text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-purple-900/30 transition cursor-pointer mt-2"
          >
            <span>{isLoading ? t.joiningRoom : t.joinButton}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      )}
    </div>
  );
}
