import { useState } from 'react';
import { Player, GameSettings } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { AVATARS } from '../data/words';
import { sound } from '../utils/sound';
import { Users, UserPlus, Trash2, ArrowRight, ShieldAlert } from 'lucide-react';
import PageHeader from '../components/PageHeader';

interface OfflineSetupProps {
  settings: GameSettings;
  onStartGame: (players: Player[]) => void;
  onBack: () => void;
}

export default function OfflineSetup({ settings, onStartGame, onBack }: OfflineSetupProps) {
  const t = TRANSLATIONS[settings.language];

  const playerLabel = (index: number) =>
    settings.language === 'bn' ? `খেলোয়াড় ${index}` : `Player ${index}`;

  const makePlayer = (index: number, id?: string): Player => ({
    id: id ?? `p${index}`,
    name: playerLabel(index),
    avatar: AVATARS[(index - 1) % AVATARS.length],
  });

  const [players, setPlayers] = useState<Player[]>(() => [1, 2, 3].map((i) => makePlayer(i)));
  const [errorMsg, setErrorMsg] = useState('');

  const handleAddPlayer = () => {
    setErrorMsg('');
    if (players.length >= settings.maxPlayers) {
      setErrorMsg(t.maxPlayersWarning);
      return;
    }
    sound.playClick();
    setPlayers([...players, makePlayer(players.length + 1, `p_${Date.now()}`)]);
  };

  const handleRemovePlayer = (id: string) => {
    sound.playClick();
    setPlayers(
      players
        .filter((p) => p.id !== id)
        .map((p, i) => ({
          ...p,
          name: playerLabel(i + 1),
          avatar: AVATARS[i % AVATARS.length],
        }))
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
    <div className="max-w-md mx-auto px-4 py-6 animate-fadeIn">
      <PageHeader
        title={t.offlineTitle}
        subtitle={t.offlineDesc}
        code="OP-01 / SETUP"
        backLabel={t.back}
        onBack={onBack}
        right={
          <div className="flex items-center gap-2 border border-purple-500/30 bg-purple-950/40 px-2.5 py-1 font-mono text-[10px] text-purple-300">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>{players.length} / {settings.maxPlayers} {t.totalPlayers}</span>
          </div>
        }
      />

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
            className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/60 border border-slate-800/80 backdrop-blur-md hover:border-purple-500/40 transition shadow-sm"
          >
            <div className="flex items-center gap-3 min-w-0">
              <div className="w-11 h-11 rounded-xl bg-purple-900/30 border border-purple-500/30 flex items-center justify-center text-xl shrink-0">
                {p.avatar}
              </div>

              <div className="min-w-0">
                <span className="text-white font-bold text-sm block truncate">
                  {p.name}
                </span>
                <span className="text-[10px] font-mono text-slate-500 uppercase">
                  {t.playerNumber} #{idx + 1}
                </span>
              </div>
            </div>

            {players.length > 3 && (
              <button
                type="button"
                onClick={() => handleRemovePlayer(p.id)}
                className="p-2 text-slate-500 hover:text-red-400 transition cursor-pointer shrink-0"
                title={t.removePlayer}
              >
                <Trash2 className="w-4 h-4" />
              </button>
            )}
          </div>
        ))}
      </div>

      <button
        type="button"
        onClick={handleAddPlayer}
        disabled={players.length >= settings.maxPlayers}
        className="w-full mt-3 py-3 rounded-2xl border border-dashed border-slate-700 text-slate-400 hover:text-purple-300 hover:border-purple-500/50 text-xs font-bold uppercase tracking-wider flex items-center justify-center gap-1.5 transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
      >
        <UserPlus className="w-4 h-4" />
        <span>{t.addPlayer}</span>
      </button>

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
