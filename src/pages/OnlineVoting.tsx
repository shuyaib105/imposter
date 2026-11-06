import { useState } from 'react';
import { OnlineRoomData, Player, GameSettings } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { sound } from '../utils/sound';
import { submitOnlineVote, endVotingEarly } from '../services/onlineEngine';
import { Vote, ShieldCheck, CheckCircle2, Clock, Flag } from 'lucide-react';

interface OnlineVotingProps {
  settings: GameSettings;
  roomData: OnlineRoomData;
  myPlayer: Player;
  players: Player[];
}

export default function OnlineVoting({
  settings,
  roomData,
  myPlayer,
  players,
}: OnlineVotingProps) {
  const t = TRANSLATIONS[settings.language];
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [localVoted, setLocalVoted] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [showEndConfirm, setShowEndConfirm] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

  const hasVoted = myPlayer.hasVoted || localVoted;
  const myVoteTarget = players.find(
    (p) => p.id === (myPlayer.voteTargetId || selectedTargetId)
  );
  const totalVoted = roomData.totalVoted || 0;
  const isHost = roomData.hostId === myPlayer.id;
  const voteProgress = players.length > 0 ? Math.min(100, (totalVoted / players.length) * 100) : 0;

  const handleSelect = (targetId: string) => {
    if (hasVoted || targetId === myPlayer.id) return;
    sound.playClick();
    setSelectedTargetId(targetId);
  };

  const handleSubmit = async () => {
    if (!selectedTargetId || hasVoted || isSubmitting) return;

    try {
      setIsSubmitting(true);
      setErrorMsg('');
      sound.playVoteSubmitted();
      await submitOnlineVote(roomData.id, myPlayer.id, selectedTargetId);
      setLocalVoted(true);
    } catch (e) {
      console.error(e);
      setErrorMsg(t.voteFailed);
      setIsSubmitting(false);
    }
  };

  const handleEndVoting = async () => {
    if (isEnding) return;
    try {
      setIsEnding(true);
      setErrorMsg('');
      await endVotingEarly(roomData.id);
    } catch (e) {
      console.error(e);
      setErrorMsg(t.endVotingFailed);
      setIsEnding(false);
      setShowEndConfirm(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 min-h-[80vh] flex flex-col justify-between animate-fadeIn">
      {/* Top Banner */}
      <div>
        <div className="flex items-center justify-between text-xs font-mono text-slate-400 mb-6">
          <span className="flex items-center gap-1.5 bg-slate-900 px-3 py-1 rounded-full border border-slate-800">
            <Vote className="w-3.5 h-3.5 text-purple-400" />
            <span>{t.votingTitle}</span>
          </span>
          <span className="bg-purple-950/60 border border-purple-500/30 text-purple-300 font-bold px-3 py-1 rounded-full flex items-center gap-1">
            <Clock className="w-3 h-3" />
            <span>
              {totalVoted} / {players.length} {t.votedStatus}
            </span>
          </span>
        </div>

        <div className="text-center space-y-1 mb-6">
          <h2 className="text-xl sm:text-2xl font-black text-white">
            {t.votingQuestion}
          </h2>
          <p className="text-xs text-slate-400">
            {t.votesPrivateNote}
          </p>
        </div>

        {/* If already voted */}
        {hasVoted ? (
          <div className="p-8 rounded-3xl bg-slate-900/90 border border-purple-500/30 text-center space-y-4 shadow-2xl backdrop-blur-xl animate-scaleUp my-6">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
              <CheckCircle2 className="w-8 h-8" />
            </div>

            <div className="space-y-1.5">
              <h3 className="text-lg font-black text-white">{t.yourVoteRecorded}</h3>
              <p className="text-xs text-slate-400 max-w-xs mx-auto">
                {t.waitingForVotes}
              </p>
            </div>

            {myVoteTarget && (
              <div className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-slate-950/60 border border-slate-800">
                <span className="text-base">{myVoteTarget.avatar}</span>
                <span className="text-[11px] font-mono text-slate-400">{t.youVotedFor}</span>
                <span className="text-xs font-black text-white">{myVoteTarget.name}</span>
              </div>
            )}

            <div className="pt-2">
              <div className="text-sm font-mono font-bold text-purple-300">
                {totalVoted} / {players.length} {t.votedStatus}
              </div>
              <div className="w-full bg-slate-800 rounded-full h-2 mt-2 overflow-hidden">
                <div
                  className="bg-purple-500 h-full transition-all duration-500"
                  style={{ width: `${voteProgress}%` }}
                />
              </div>
            </div>
          </div>
        ) : (
          /* Ballot cards */
          <div className="space-y-2 max-h-[46vh] overflow-y-auto pr-1">
            {players.map((p) => {
              const isSelf = p.id === myPlayer.id;
              const isSelected = selectedTargetId === p.id;

              return (
                <button
                  key={p.id}
                  disabled={isSelf}
                  onClick={() => handleSelect(p.id)}
                  className={`w-full flex items-center justify-between p-3.5 rounded-2xl border transition text-left cursor-pointer ${
                    isSelf
                      ? 'opacity-40 bg-slate-950/40 border-slate-900 cursor-not-allowed'
                      : isSelected
                      ? 'bg-purple-950/70 border-purple-500 shadow-lg shadow-purple-900/30'
                      : 'bg-slate-900/70 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div className="w-11 h-11 rounded-xl bg-slate-800/80 border border-slate-700/60 flex items-center justify-center text-xl shrink-0">
                      {p.avatar}
                    </div>
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
        )}
      </div>

      {/* Submit / host controls */}
      <div className="pt-4 border-t border-slate-800 space-y-2">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs">
            {errorMsg}
          </div>
        )}

        {!hasVoted && (
          <button
            onClick={handleSubmit}
            disabled={!selectedTargetId || isSubmitting}
            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition cursor-pointer ${
              selectedTargetId && !isSubmitting
                ? 'bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:scale-[1.02] text-white shadow-purple-600/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <ShieldCheck className="w-4 h-4" />
            <span>{isSubmitting ? t.recordingVote : t.confirmVote}</span>
          </button>
        )}

        {isHost &&
          (!showEndConfirm ? (
            <button
              onClick={() => setShowEndConfirm(true)}
              className="w-full py-2.5 rounded-xl bg-slate-900 border border-slate-800 hover:border-amber-500/40 text-slate-400 hover:text-amber-300 text-[11px] font-mono uppercase flex items-center justify-center gap-1.5 transition cursor-pointer"
            >
              <Flag className="w-3.5 h-3.5" />
              <span>{t.endVotingNow}</span>
            </button>
          ) : (
            <div className="p-3.5 rounded-2xl bg-slate-900 border border-amber-500/40 space-y-2 animate-scaleUp">
              <p className="text-xs text-amber-200 text-center">{t.endVotingConfirm}</p>
              <div className="flex gap-2">
                <button
                  onClick={() => setShowEndConfirm(false)}
                  className="flex-1 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase cursor-pointer"
                >
                  {t.cancel}
                </button>
                <button
                  onClick={handleEndVoting}
                  disabled={isEnding}
                  className="flex-1 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs uppercase cursor-pointer shadow-lg disabled:opacity-60"
                >
                  {isEnding ? t.endingVoting : t.confirm}
                </button>
              </div>
            </div>
          ))}
      </div>
    </div>
  );
}
