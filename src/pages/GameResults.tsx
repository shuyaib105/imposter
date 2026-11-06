import { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { Player, GameSettings, WinnerStatus } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { sound } from '../utils/sound';
import { Trophy, Skull, Scale, RotateCcw, Home, Hourglass, ArrowRight } from 'lucide-react';

interface GameResultsProps {
  settings: GameSettings;
  players: Player[];
  imposterId: string;
  majorityWord: string;
  imposterWord: string;
  voteCounts: Record<string, number>;
  winnerStatus: WinnerStatus;
  myPlayerId?: string;
  votes?: Record<string, string>;
  canPlayAgain?: boolean;
  onPlayAgain: () => void | Promise<void>;
  onReturnHome: () => void;
}

export default function GameResults({
  settings,
  players,
  imposterId,
  majorityWord,
  imposterWord,
  voteCounts,
  winnerStatus,
  myPlayerId,
  votes,
  canPlayAgain = true,
  onPlayAgain,
  onReturnHome,
}: GameResultsProps) {
  const t = TRANSLATIONS[settings.language];
  const imposter = players.find((p) => p.id === imposterId);
  const myPlayer = myPlayerId ? players.find((p) => p.id === myPlayerId) : undefined;
  const myVoteTargetId = myPlayerId ? votes?.[myPlayerId] : undefined;
  const myVoteTarget = myVoteTargetId
    ? players.find((p) => p.id === myVoteTargetId)
    : undefined;
  const [isRestarting, setIsRestarting] = useState(false);

  useEffect(() => {
    if (winnerStatus === 'GROUP_WIN') {
      sound.playWin();
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#a855f7', '#6366f1', '#ec4899', '#3b82f6'],
      });
    } else if (winnerStatus === 'IMPOSTER_WIN') {
      sound.playWin();
      confetti({
        particleCount: 80,
        spread: 60,
        origin: { y: 0.6 },
        colors: ['#ef4444', '#f59e0b', '#dc2626'],
      });
    } else {
      sound.playTie();
    }
  }, [winnerStatus]);

  const handlePlayAgain = async () => {
    if (isRestarting) return;
    setIsRestarting(true);
    try {
      await onPlayAgain();
    } catch {
      setIsRestarting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-8 animate-fadeIn space-y-6">
      {/* Winner Hero Banner */}
      <div
        className={`p-6 rounded-3xl border text-center space-y-3 shadow-2xl relative overflow-hidden backdrop-blur-xl ${
          winnerStatus === 'GROUP_WIN'
            ? 'bg-gradient-to-b from-purple-950/70 via-slate-900/90 to-slate-950 border-purple-500/50 shadow-purple-900/30'
            : winnerStatus === 'IMPOSTER_WIN'
            ? 'bg-gradient-to-b from-red-950/70 via-slate-900/90 to-slate-950 border-red-500/50 shadow-red-900/30'
            : 'bg-gradient-to-b from-amber-950/70 via-slate-900/90 to-slate-950 border-amber-500/50 shadow-amber-900/30'
        }`}
      >
        <div className="w-16 h-16 mx-auto rounded-2xl flex items-center justify-center text-3xl shadow-lg border border-white/10">
          {winnerStatus === 'GROUP_WIN' && <Trophy className="w-8 h-8 text-purple-400" />}
          {winnerStatus === 'IMPOSTER_WIN' && <Skull className="w-8 h-8 text-red-400" />}
          {winnerStatus === 'TIE' && <Scale className="w-8 h-8 text-amber-400" />}
        </div>

        <div>
          <h2 className="text-xl sm:text-2xl font-black text-white uppercase tracking-tight">
            {winnerStatus === 'GROUP_WIN' && t.winnerStatusGroup}
            {winnerStatus === 'IMPOSTER_WIN' && t.winnerStatusImposter}
            {winnerStatus === 'TIE' && t.winnerStatusTie}
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto">
            {winnerStatus === 'GROUP_WIN' && t.winnerStatusGroupDesc}
            {winnerStatus === 'IMPOSTER_WIN' && t.winnerStatusImposterDesc}
            {winnerStatus === 'TIE' && t.winnerStatusTieDesc}
          </p>
        </div>
      </div>

      {/* Imposter Reveal Card */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400">
          {t.imposterWas}
        </span>
        <div className="flex items-center justify-center gap-3">
          <span className="text-2xl">{imposter?.avatar || '🕵️'}</span>
          <span className="text-lg font-black text-white uppercase">
            {imposter?.name || t.unknownPlayer}
          </span>
          <span className="bg-red-950/80 text-red-300 text-[10px] font-mono px-2 py-0.5 rounded border border-red-500/30">
            {t.imposterBadge}
          </span>
        </div>
      </div>

      {/* Secret Words Comparison */}
      <div className="grid grid-cols-2 gap-3">
        <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-purple-500/30 text-center space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 block">
            {t.majorityWordWas}
          </span>
          <span className="text-base font-extrabold text-white block">
            {majorityWord}
          </span>
        </div>

        <div className="p-3.5 rounded-2xl bg-slate-900/70 border border-red-500/30 text-center space-y-1">
          <span className="text-[10px] font-mono uppercase tracking-wider text-red-300 block">
            {t.imposterWordWas}
          </span>
          <span className="text-base font-extrabold text-red-200 block">
            {imposterWord}
          </span>
        </div>
      </div>

      {/* Your own ballot, so players remember whom they voted for */}
      {myPlayerId && (
        <div className="p-4 rounded-2xl bg-indigo-950/40 border border-indigo-500/30 space-y-1.5">
          <span className="text-[10px] font-mono uppercase tracking-widest text-indigo-300 block">
            {t.yourVote}
            {myPlayer ? ` • ${myPlayer.name}` : ''}
          </span>
          {myVoteTarget ? (
            <div className="flex items-center gap-3">
              <span className="w-10 h-10 rounded-xl bg-slate-950/70 border border-indigo-500/30 flex items-center justify-center text-xl shrink-0">
                {myVoteTarget.avatar}
              </span>
              <div className="min-w-0">
                <span className="text-[10px] font-mono text-slate-400 block">
                  {t.youVotedFor}
                </span>
                <span className="text-base font-black text-white block truncate">
                  {myVoteTarget.name}
                </span>
              </div>
            </div>
          ) : myVoteTargetId ? (
            <p className="text-sm font-bold text-slate-300">
              {t.youVotedFor} {t.unknownPlayer}
            </p>
          ) : (
            <p className="text-sm font-bold text-slate-400">{t.youDidNotVote}</p>
          )}
        </div>
      )}

      {/* Voting Breakdown Table */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 block px-1">
          {t.finalVoteBreakdown}
        </span>

        <div className="space-y-1.5 max-h-[30vh] overflow-y-auto pr-1">
          {[...players]
            .sort((a, b) => (voteCounts[b.id] || 0) - (voteCounts[a.id] || 0))
            .map((p) => {
              const isImp = p.id === imposterId;
              const count = voteCounts[p.id] || 0;

              return (
                <div
                  key={p.id}
                  className={`flex items-center justify-between p-3 rounded-xl border text-xs ${
                    isImp
                      ? 'bg-red-950/30 border-red-500/40 text-red-200'
                      : 'bg-slate-900/60 border-slate-800 text-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5">
                    <span className="text-base">{p.avatar}</span>
                    <span className="font-bold text-white">{p.name}</span>
                    {isImp && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-red-900/60 text-red-300 border border-red-500/30">
                        {t.imposterBadge}
                      </span>
                    )}
                    {myVoteTargetId === p.id && (
                      <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-indigo-900/60 text-indigo-200 border border-indigo-500/30">
                        {t.yourVoteBadge}
                      </span>
                    )}
                  </div>

                  <div className="flex items-center gap-2">
                    <span className="font-mono font-bold text-sm text-white">
                      {count}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {t.votesCount}
                    </span>
                  </div>
                </div>
              );
            })}
        </div>
      </div>

      {/* Who voted for whom — keeps every ballot clear after the reveal */}
      <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 space-y-2">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block">
          {t.voteMapTitle}
        </span>
        <div className="space-y-1.5 max-h-[26vh] overflow-y-auto pr-1">
          {players.map((voter) => {
            const targetId = votes?.[voter.id];
            const target = targetId ? players.find((p) => p.id === targetId) : undefined;
            const isMe = voter.id === myPlayerId;

            return (
              <div
                key={voter.id}
                className={`flex items-center justify-between gap-2 p-2 rounded-xl border ${
                  isMe
                    ? 'bg-indigo-950/40 border-indigo-500/40'
                    : 'bg-slate-950/40 border-slate-800/80'
                }`}
              >
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-base shrink-0">{voter.avatar}</span>
                  <span className="text-xs font-bold text-slate-200 truncate">
                    {voter.name}
                    {isMe && <span className="text-indigo-300"> ({t.youTag})</span>}
                  </span>
                </div>

                <div className="flex items-center gap-1.5 min-w-0">
                  <ArrowRight className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  {target ? (
                    <>
                      <span className="text-base shrink-0">{target.avatar}</span>
                      <span
                        className={`text-xs font-bold truncate ${
                          target.id === imposterId ? 'text-red-300' : 'text-white'
                        }`}
                      >
                        {target.name}
                      </span>
                      {target.id === imposterId && (
                        <span className="text-[8px] font-mono px-1 py-0.5 rounded bg-red-900/60 text-red-300 border border-red-500/30 shrink-0">
                          {t.imposterBadge}
                        </span>
                      )}
                    </>
                  ) : (
                    <span className="text-[11px] font-mono text-slate-500">{t.didNotVote}</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Actions */}
      <div className="pt-2 space-y-2.5">
        {canPlayAgain ? (
          <button
            onClick={handlePlayAgain}
            disabled={isRestarting}
            className="w-full py-3.5 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg shadow-purple-900/30 transition cursor-pointer disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <RotateCcw className="w-4 h-4" />
            <span>{isRestarting ? t.startingNextRound : t.playAgain}</span>
          </button>
        ) : (
          <div className="w-full py-3.5 rounded-2xl bg-slate-900/70 border border-slate-800 text-slate-400 font-mono text-[11px] flex items-center justify-center gap-2">
            <Hourglass className="w-4 h-4 text-amber-400" />
            <span>{t.waitingForHostRestart}</span>
          </div>
        )}

        <button
          onClick={onReturnHome}
          className="w-full py-3 rounded-2xl bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition cursor-pointer"
        >
          <Home className="w-4 h-4" />
          <span>{t.returnHome}</span>
        </button>
      </div>
    </div>
  );
}
