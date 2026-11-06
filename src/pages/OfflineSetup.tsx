import React, { useState } from 'react';
import { Player, GameSettings, UserProfile } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { AVATARS } from '../data/words';
import { sound } from '../utils/sound';
import { Users, UserPlus, Trash2, ArrowRight, ShieldAlert, RefreshCw, Pencil, Check, X } from 'lucide-react';

interface OfflineSetupProps {
  settings: GameSettings;
  profile: UserProfile;
  onStartGame: (players: Player[]) => void;
  onBack: () => void;
}

export default function OfflineSetup({ settings, profile, onStartGame, onBack }: OfflineSetupProps) {
  const t = TRANSLATIONS[settings.language];
  const ownerName = profile.name.trim();
  const ownerAvatar = profile.avatar || AVATARS[0];
  const otherAvatars = AVATARS.filter((a) => a !== ownerAvatar);
  const [players, setPlayers] = useState<Player[]>([
    {
      id: 'p1',
      name: ownerName || (settings.language === 'bn' ? 'খেলোয়াড় ১' : 'Player 1'),
      avatar: ownerAvatar,
    },
    {
      id: 'p2',
      name: settings.language === 'bn' ? 'খেলোয়াড় ২' : 'Player 2',
      avatar: otherAvatars[0] ?? AVATARS[1],
    },
    {
      id: 'p3',
      name: settings.language === 'bn' ? 'খেলোয়াড় ৩' : 'Player 3',
      avatar: otherAvatars[1] ?? AVATARS[2],
    },
  ]);
  const [newName, setNewName] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [draftName, setDraftName] = useState('');

  const handleAddPlayer = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setErrorMsg('');
    const name = newName.trim();
    if (!name) return;

    if (players.length >= settings.maxPlayers) {
      setErrorMsg(t.maxPlayersWarning);
      return;
    }

    // Check duplicate
    if (players.some((p) => p.name.toLowerCase() === name.toLowerCase())) {
      setErrorMsg(t.nameDuplicateWarning);
      return;
    }

    const unusedAvatars = AVATARS.filter((a) => !players.some((p) => p.avatar === a));
    const randomAvatar = unusedAvatars.length > 0
      ? unusedAvatars[Math.floor(Math.random() * unusedAvatars.length)]
      : AVATARS[Math.floor(Math.random() * AVATARS.length)];

    const newP: Player = {
      id: 'p_' + Date.now() + '_' + Math.random().toString(36).substring(2, 5),
      name,
      avatar: randomAvatar,
    };

    sound.playClick();
    setPlayers([...players, newP]);
    setNewName('');
  };

  const handleStartRename = (player: Player) => {
    sound.playClick();
    setEditingId(player.id);
    setDraftName(player.name);
    setErrorMsg('');
  };

  const handleCommitRename = () => {
    if (!editingId) return;
    const name = draftName.trim();
    if (!name) {
      setErrorMsg(t.enterName);
      return;
    }
    if (
      players.some(
        (p) => p.id !== editingId && p.name.toLowerCase() === name.toLowerCase()
      )
    ) {
      setErrorMsg(t.nameDuplicateWarning);
      return;
    }
    setPlayers(players.map((p) => (p.id === editingId ? { ...p, name } : p)));
    setEditingId(null);
    setDraftName('');
    setErrorMsg('');
    sound.playClick();
  };

  const handleCancelRename = () => {
    setEditingId(null);
    setDraftName('');
  };

  const handleRemovePlayer = (id: string) => {
    sound.playClick();
    setPlayers(players.filter((p) => p.id !== id));
  };

  const handleChangeAvatar = (id: string) => {
    sound.playClick();
    setPlayers(
      players.map((p) => {
        if (p.id !== id) return p;
        const currentIdx = AVATARS.indexOf(p.avatar);
        const nextIdx = (currentIdx + 1) % AVATARS.length;
        return { ...p, avatar: AVATARS[nextIdx] };
      })
    );
  };

  const handleStart = () => {
    if (players.length < 3) {
      setErrorMsg(t.minPlayersWarning);
      return;
    }
    sound.playClick();
    onStartGame(players);
  };

  return (
    <div className="max-w-xl mx-auto px-4 py-8 animate-fadeIn">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="text-xs uppercase font-mono tracking-widest text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900/60 transition cursor-pointer"
        >
          ← {t.back}
        </button>
        <div className="flex items-center gap-2 bg-purple-950/40 border border-purple-500/30 px-3 py-1 rounded-full text-xs font-mono text-purple-300">
          <Users className="w-3.5 h-3.5 text-purple-400" />
          <span>{players.length} / {settings.maxPlayers} {t.totalPlayers}</span>
        </div>
      </div>

      <div className="text-center mb-6">
        <h2 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center justify-center gap-2">
          <span>{t.offlineTitle}</span>
        </h2>
        <p className="text-slate-400 text-xs sm:text-sm mt-1">{t.offlineDesc}</p>
      </div>

      {/* Add player form */}
      <form onSubmit={handleAddPlayer} className="flex gap-2 mb-6">
        <input
          type="text"
          value={newName}
          onChange={(e) => {
            setNewName(e.target.value);
            setErrorMsg('');
          }}
          placeholder={t.playerNamePlaceholder}
          maxLength={24}
          className="flex-1 bg-slate-900/90 border border-slate-700/80 rounded-xl px-4 py-3 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition shadow-inner"
        />
        <button
          type="submit"
          className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-bold text-xs uppercase px-5 py-3 rounded-xl transition cursor-pointer shadow-lg shadow-purple-900/30 shrink-0"
        >
          <UserPlus className="w-4 h-4" />
          <span>{t.addPlayer}</span>
        </button>
      </form>

      {errorMsg && (
        <div className="mb-4 p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 animate-shake">
          <ShieldAlert className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMsg}</span>
        </div>
      )}

      {/* Player List Cards */}
      <div className="space-y-2.5 max-h-[46vh] overflow-y-auto pr-1">
        {players.map((p, idx) => (
          <div
            key={p.id}
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-purple-500/40 transition group shadow-sm"
          >
            <div className="flex items-center gap-3 min-w-0">
              <button
                type="button"
                onClick={() => handleChangeAvatar(p.id)}
                title={t.changeAvatar}
                className="w-11 h-11 rounded-xl bg-purple-900/30 border border-purple-500/30 flex items-center justify-center text-xl hover:scale-105 active:scale-95 transition cursor-pointer shrink-0"
              >
                {p.avatar}
              </button>

              {editingId === p.id ? (
                <div className="flex items-center gap-1.5">
                  <input
                    autoFocus
                    type="text"
                    value={draftName}
                    maxLength={24}
                    onChange={(e) => {
                      setDraftName(e.target.value);
                      setErrorMsg('');
                    }}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleCommitRename();
                      } else if (e.key === 'Escape') {
                        handleCancelRename();
                      }
                    }}
                    className="w-36 bg-slate-950 border border-purple-500/60 rounded-lg px-2.5 py-1.5 text-sm text-white focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCommitRename}
                    title={t.save}
                    className="p-1.5 text-emerald-400 hover:text-emerald-300 transition cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                  </button>
                  <button
                    type="button"
                    onClick={handleCancelRename}
                    title={t.cancel}
                    className="p-1.5 text-slate-500 hover:text-slate-300 transition cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="min-w-0">
                  <button
                    type="button"
                    onClick={() => handleStartRename(p)}
                    title={t.editName}
                    className="text-white font-bold text-sm block truncate hover:text-purple-300 transition cursor-pointer text-left"
                  >
                    {p.name}
                  </button>
                  <span className="text-[10px] font-mono text-slate-500 uppercase">
                    {t.playerNumber} #{idx + 1}
                  </span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2 shrink-0">
              <button
                type="button"
                onClick={() => handleStartRename(p)}
                className="p-2 text-slate-500 hover:text-purple-300 transition cursor-pointer"
                title={t.editName}
              >
                <Pencil className="w-3.5 h-3.5" />
              </button>
              <button
                type="button"
                onClick={() => handleChangeAvatar(p.id)}
                className="p-2 text-slate-500 hover:text-purple-300 transition cursor-pointer"
                title={t.changeAvatar}
              >
                <RefreshCw className="w-3.5 h-3.5" />
              </button>
              {players.length > 3 && (
                <button
                  type="button"
                  onClick={() => handleRemovePlayer(p.id)}
                  className="p-2 text-slate-500 hover:text-red-400 transition cursor-pointer"
                  title={t.removePlayer}
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Start Button */}
      <div className="mt-8 pt-4 border-t border-slate-800">
        <button
          onClick={handleStart}
          disabled={players.length < 3}
          className={`w-full py-4 rounded-2xl font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
            players.length >= 3
              ? 'bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:scale-[1.02] text-white shadow-purple-600/30'
              : 'bg-slate-800 text-slate-500 cursor-not-allowed'
          }`}
        >
          <span>{t.startGame} ({players.length} {t.players})</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}
