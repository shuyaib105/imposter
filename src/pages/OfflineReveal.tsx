import { useState, useEffect } from 'react';
import { Player, GameSettings } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { sound } from '../utils/sound';
import { Eye, EyeOff, ShieldCheck, ArrowRight, Smartphone, AlertTriangle } from 'lucide-react';

interface OfflineRevealProps {
  settings: GameSettings;
  players: Player[];
  playerSecrets: Record<string, string>; // playerId -> secret word
  playerSecretAlts?: Record<string, string>; // playerId -> other-language word
  onAllRevealed: () => void;
}

export default function OfflineReveal({
  settings,
  players,
  playerSecrets,
  playerSecretAlts,
  onAllRevealed,
}: OfflineRevealProps) {
  const t = TRANSLATIONS[settings.language];
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isRevealed, setIsRevealed] = useState(false);
  const [countdown, setCountdown] = useState(5);
  const [isWordExpired, setIsWordExpired] = useState(false);

  const currentPlayer = players[currentIndex];
  const currentSecret = playerSecrets[currentPlayer.id];
  const currentSecretAlt = playerSecretAlts?.[currentPlayer.id] || '';
  const showSecretAlt = !!currentSecretAlt && currentSecretAlt !== currentSecret;

  // 5-second countdown timer when revealed
  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (isRevealed && countdown > 0) {
      sound.playTick();
      timer = setTimeout(() => {
        setCountdown((c) => c - 1);
      }, 1000);
    } else if (isRevealed && countdown === 0) {
      // Countdown expired: automatically hide secret word
      setIsRevealed(false);
      setIsWordExpired(true);
    }
    return () => clearTimeout(timer);
  }, [isRevealed, countdown]);

  // Privacy protection: auto-hide if window loses focus or moves to background
  useEffect(() => {
    const handleBlur = () => {
      if (isRevealed) {
        setIsRevealed(false);
        setIsWordExpired(true);
      }
    };
    window.addEventListener('blur', handleBlur);
    document.addEventListener('visibilitychange', handleBlur);
    return () => {
      window.removeEventListener('blur', handleBlur);
      document.removeEventListener('visibilitychange', handleBlur);
    };
  }, [isRevealed]);

  const handleReveal = () => {
    sound.playReveal();
    setIsRevealed(true);
    setCountdown(5);
    setIsWordExpired(false);
  };

  const handleNextPlayer = () => {
    sound.playClick();
    setIsRevealed(false);
    setIsWordExpired(false);
    setCountdown(5);

    if (currentIndex + 1 < players.length) {
      setCurrentIndex(currentIndex + 1);
    } else {
      onAllRevealed();
    }
  };

  const isFinalPlayer = currentIndex === players.length - 1;

  return (
    <div className="max-w-md mx-auto px-4 py-8 min-h-[80vh] flex flex-col justify-between animate-fadeIn">
      {/* Top indicator */}
      <div>
        <div className="mb-6 flex items-center justify-between border-b border-slate-800/80 pb-2.5 font-mono text-[9px] uppercase tracking-[0.2em]">
          <span className="flex items-center gap-1.5 border border-slate-800 bg-slate-900/70 px-2.5 py-1 text-slate-400">
            <Smartphone className="w-3.5 h-3.5 text-purple-400" />
            <span>{t.passAndPlay}</span>
          </span>
          <span className="border border-purple-500/30 bg-purple-950/50 px-2.5 py-1 font-bold text-purple-300">
            {currentIndex + 1} / {players.length}
          </span>
        </div>

        {/* Current Player Card Header */}
        <div className="text-center space-y-2 mb-8">
          <p className="font-mono text-[8px] uppercase tracking-[0.3em] text-purple-400/80">
            <span className="text-slate-600">//</span> OP-01 / REVEAL
          </p>
          <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-purple-600/30 via-slate-900 to-indigo-600/30 border-2 border-purple-500/40 flex items-center justify-center text-4xl shadow-xl shadow-purple-900/20">
            {currentPlayer.avatar}
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-white uppercase tracking-tight">
            {currentPlayer.name}
          </h2>
          <p className="text-xs font-mono text-purple-400 uppercase tracking-widest">
            {t.revealTitle}
          </p>
        </div>
      </div>

      {/* Main Secret Card Area */}
      <div className="my-auto">
        {!isRevealed && !isWordExpired && (
          <div className="p-6 rounded-3xl bg-slate-900/80 border border-purple-500/20 text-center space-y-6 shadow-2xl backdrop-blur-xl">
            <div className="p-4 rounded-2xl bg-purple-950/30 border border-purple-500/20 text-slate-300 text-xs">
              <ShieldCheck className="w-6 h-6 text-purple-400 mx-auto mb-2" />
              <span>{t.revealPrompt}</span>
            </div>

            <button
              onClick={handleReveal}
              className="w-full py-5 rounded-2xl bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl shadow-purple-900/40 hover:scale-[1.02] active:scale-98 transition cursor-pointer"
            >
              <Eye className="w-5 h-5" />
              <span>{t.revealButton}</span>
            </button>
          </div>
        )}

        {/* Active Revealed State with 5s countdown */}
        {isRevealed && (
          <div className="p-6 rounded-3xl bg-gradient-to-b from-purple-950/60 to-slate-900/90 border-2 border-purple-400 text-center space-y-6 shadow-2xl animate-scaleUp">
            <div className="flex items-center justify-center gap-2 text-xs font-mono text-amber-300 bg-amber-950/40 border border-amber-500/30 py-1.5 px-3 w-fit mx-auto">
              <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.hideWarning} {countdown} {t.seconds}</span>
            </div>

            <div className="py-6 px-4 rounded-2xl bg-slate-950/80 border border-purple-500/40 shadow-inner">
              <span className="text-xs uppercase font-mono tracking-widest text-slate-400 block mb-1">
                {t.secretWordLabel}
              </span>
              <span className="text-3xl sm:text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-white via-purple-100 to-white tracking-wide">
                {currentSecret}
              </span>
              {showSecretAlt && (
                <span className="block mt-1.5 text-base font-semibold text-slate-400 font-bangla">
                  {currentSecretAlt}
                </span>
              )}
            </div>

            {/* Visual timer countdown bar */}
            <div className="w-full bg-slate-800 rounded-full h-2 overflow-hidden">
              <div
                className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-1000 ease-linear"
                style={{ width: `${(countdown / 5) * 100}%` }}
              />
            </div>
          </div>
        )}

        {/* Post-Expiration Transition / Handover Screen */}
        {isWordExpired && (
          <div className="p-6 rounded-3xl bg-slate-900/90 border border-slate-700 text-center space-y-6 shadow-2xl animate-fadeIn">
            <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-900/30 border border-purple-500/30 flex items-center justify-center text-purple-400">
              <EyeOff className="w-7 h-7" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-white">{t.wordHidden}</h3>
              <p className="text-xs text-slate-400">
                {!isFinalPlayer ? (
                  <>
                    {t.passPhone}{' '}
                    <strong className="text-purple-300 font-bold">
                      {players[currentIndex + 1].name}
                    </strong>
                    .
                  </>
                ) : (
                  t.allWordsReceived
                )}
              </p>
            </div>

            <button
              onClick={handleNextPlayer}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-lg transition cursor-pointer"
            >
              <span>
                {!isFinalPlayer ? t.nextPlayer : t.continueToDiscussion}
              </span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}
      </div>

      {/* Footer Info */}
      <div className="text-center pt-4 text-[11px] font-mono text-slate-500">
        {t.offlineFooter}
      </div>
    </div>
  );
}
