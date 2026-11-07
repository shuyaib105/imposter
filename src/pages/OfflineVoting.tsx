import { useState } from 'react';
import { Player, GameSettings } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { sound } from '../utils/sound';
import AgentAvatar from '../components/AgentAvatar';
import { Vote, ArrowRight, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface OfflineVotingProps {
  settings: GameSettings;
  players: Player[];
  onVotingComplete: (votes: Record<string, string>) => void;
}

export default function OfflineVoting({
  settings,
  players,
  onVotingComplete,
}: OfflineVotingProps) {
  const t = TRANSLATIONS[settings.language];
  const [currentVoterIndex, setCurrentVoterIndex] = useState(0);
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [votes, setVotes] = useState<Record<string, string>>({});
  const [isHandover, setIsHandover] = useState(false);

  const currentVoter = players[currentVoterIndex];
  const isFinalVoter = currentVoterIndex === players.length - 1;

  const handleSelectTarget = (targetId: string) => {
    if (targetId === currentVoter.id) return; // Block self voting
    sound.playClick();
    setSelectedTargetId(targetId);
  };

  const handleSubmitVote = () => {
    if (!selectedTargetId) return;

    sound.playVoteSubmitted();
    const updatedVotes = {
      ...votes,
      [currentVoter.id]: selectedTargetId,
    };
    setVotes(updatedVotes);

    if (!isFinalVoter) {
      setIsHandover(true);
    } else {
      // All players have voted!
      onVotingComplete(updatedVotes);
    }
  };

  const handleNextVoter = () => {
    sound.playClick();
    setSelectedTargetId(null);
    setIsHandover(false);
    setCurrentVoterIndex((i) => i + 1);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 min-h-[80vh] flex flex-col justify-between animate-fadeIn">
      {/* Handover interstitial screen between votes to protect privacy */}
      {isHandover ? (
        <div className="my-auto p-6 rounded-3xl bg-slate-900/90 border border-slate-700 text-center space-y-6 shadow-2xl animate-scaleUp">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-black text-white">{t.voteSubmitted}</h3>
            <p className="text-xs text-slate-400">
              {t.passPhoneToVote}{' '}
              <strong className="text-purple-300 font-bold text-sm">
                {players[currentVoterIndex + 1].name}
              </strong>{' '}
              {t.toVote}
            </p>
          </div>

          <button
            onClick={handleNextVoter}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
          >
            <span>{t.nextPlayer}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      ) : (
        <>
          {/* Header */}
          <div>
            <div className="mb-6 flex items-center justify-between border-b border-slate-800/80 pb-2.5 font-mono text-[9px] uppercase tracking-[0.2em]">
              <span className="flex items-center gap-1.5 border border-slate-800 bg-slate-900/70 px-2.5 py-1 text-slate-400">
                <Vote className="w-3.5 h-3.5 text-purple-400" />
                <span>{t.privateBallot}</span>
              </span>
              <span className="border border-purple-500/30 bg-purple-950/50 px-2.5 py-1 font-bold text-purple-300">
                {currentVoterIndex + 1} / {players.length}
              </span>
            </div>

            <div className="text-center space-y-1 mb-6">
              <span className="font-mono text-[8px] uppercase tracking-[0.3em] text-purple-400/80">
                <span className="text-slate-600">//</span> OP-01 / BALLOT · {currentVoter.name}
              </span>
              <h2 className="text-xl sm:text-2xl font-black text-white">
                {t.votingQuestion}
              </h2>
            </div>

            {/* Candidate selection cards */}
            <div className="space-y-2 max-h-[46vh] overflow-y-auto pr-1">
              {players.map((p) => {
                const isSelf = p.id === currentVoter.id;
                const isSelected = selectedTargetId === p.id;

                return (
                  <button
                    key={p.id}
                    disabled={isSelf}
                    onClick={() => handleSelectTarget(p.id)}
                    className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition text-left cursor-pointer ${
                      isSelf
                        ? 'opacity-40 bg-slate-950/40 border-slate-900 cursor-not-allowed'
                        : isSelected
                        ? 'bg-purple-950/70 border-purple-500 shadow-lg shadow-purple-900/30'
                        : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <AgentAvatar
                        emoji={p.avatar}
                        name={p.name}
                        color={p.avatarColor}
                        accessory={p.avatarAccessory}
                        size="md"
                      />
                      <div>
                        <span className="text-sm font-bold text-white block">
                          {p.name}
                        </span>
                        {isSelf && (
                          <span className="text-[10px] font-mono text-red-400">
                            {t.selfVoteBlocked}
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="w-5 h-5 rounded-full border flex items-center justify-center shrink-0 border-slate-600">
                      {isSelected && (
                        <div className="w-2.5 h-2.5 rounded-full bg-purple-400" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Vote Action */}
          <div className="pt-4 border-t border-slate-800">
            <button
              onClick={handleSubmitVote}
              disabled={!selectedTargetId}
              className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition-all cursor-pointer ${
                selectedTargetId
                  ? 'bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:scale-[1.02] text-white shadow-purple-600/30'
                  : 'bg-slate-800 text-slate-500 cursor-not-allowed'
              }`}
            >
              <ShieldCheck className="w-4 h-4" />
              <span>{t.confirmVote}</span>
            </button>
          </div>
        </>
      )}
    </div>
  );
}
