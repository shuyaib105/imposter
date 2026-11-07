import { useState } from 'react';
import { Player, GameSettings } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { sound } from '../utils/sound';
import AgentAvatar from '../components/AgentAvatar';
import { MessageSquare, Vote, Sparkles, CheckCircle2 } from 'lucide-react';

interface OfflineDiscussionProps {
  settings: GameSettings;
  players: Player[];
  onStartVoting: () => void;
}

export default function OfflineDiscussion({
  settings,
  players,
  onStartVoting,
}: OfflineDiscussionProps) {
  const t = TRANSLATIONS[settings.language];
  const [showConfirm, setShowConfirm] = useState(false);

  const handleProceed = () => {
    sound.playClick();
    onStartVoting();
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 min-h-[80vh] flex flex-col justify-between animate-fadeIn">
      {/* Header */}
      <div>
        <div className="mb-6 flex items-center justify-between border-b border-slate-800/80 pb-2.5 font-mono text-[8px] uppercase tracking-[0.26em] text-slate-500">
          <span>
            <span className="text-slate-600">//</span> OP-01 / DISCUSSION
          </span>
          <span>{players.length} {t.players}</span>
        </div>

        <div className="text-center space-y-3 mb-8">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center text-purple-400 shadow-lg shadow-purple-600/10">
            <MessageSquare className="w-8 h-8" />
          </div>

          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            {t.discussionTitle}
          </h2>

          <p className="text-xs sm:text-sm text-slate-300 max-w-xs mx-auto leading-relaxed">
            {t.discussionDesc}
          </p>
        </div>

        {/* Clue rules highlight */}
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-xs text-slate-300 space-y-2 mb-6">
          <div className="flex items-start gap-2">
            <Sparkles className="w-4 h-4 text-purple-400 shrink-0 mt-0.5" />
            <span>{t.discussionTip1}</span>
          </div>
          <div className="flex items-start gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
            <span>{t.discussionTip2}</span>
          </div>
        </div>

        {/* Active Player Roster */}
        <div className="space-y-2">
          <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 block px-1">
            {t.activeCircle} ({players.length} {t.players})
          </span>
          <div className="grid grid-cols-2 gap-2">
            {players.map((p) => (
              <div
                key={p.id}
                className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-900/60 border border-slate-800 text-xs text-white"
              >
                <AgentAvatar
                  emoji={p.avatar}
                  name={p.name}
                  color={p.avatarColor}
                  accessory={p.avatarAccessory}
                  size="sm"
                />
                <span className="font-bold truncate">{p.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Start Voting Action */}
      <div className="pt-6 border-t border-slate-800/80 space-y-3">
        {!showConfirm ? (
          <button
            onClick={() => {
              sound.playClick();
              setShowConfirm(true);
            }}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:scale-[1.02] text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-purple-900/40 cursor-pointer transition"
          >
            <Vote className="w-5 h-5" />
            <span>{t.startVoting}</span>
          </button>
        ) : (
          <div className="p-4 rounded-2xl bg-slate-900 border border-purple-500/50 space-y-3 animate-scaleUp">
            <p className="text-xs text-slate-200 text-center font-bold">
              {t.startVotingConfirm}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() => setShowConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase cursor-pointer"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleProceed}
                className="flex-1 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase cursor-pointer shadow-lg"
              >
                {t.confirmVoting}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
