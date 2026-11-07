import { useState } from 'react';
import { OnlineRoomData, Player, GameSettings, WordPair } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { CATEGORIES, CUSTOM_CATEGORY_ID } from '../data/words';
import { pickWordPair } from '../game/wordSelection';
import { loadRecentWordIds, rememberWordId } from '../game/wordHistory';
import { sound } from '../utils/sound';
import {
  togglePlayerReady,
  leaveOnlineRoom,
  startOnlineGame,
  removePlayerFromRoom,
  setOnlineRoomCategories,
} from '../services/onlineEngine';
import {
  Copy,
  Check,
  Share2,
  Users,
  Crown,
  Play,
  LogOut,
  Radio,
  MessageSquare,
  Sparkles,
  UserX,
} from 'lucide-react';
import PageHeader from '../components/PageHeader';

interface OnlineLobbyProps {
  settings: GameSettings;
  roomData: OnlineRoomData;
  players: Player[];
  myPlayerId: string;
  allWordPairs: WordPair[];
  onLeave: () => void;
}

export default function OnlineLobby({
  settings,
  roomData,
  players,
  myPlayerId,
  allWordPairs,
  onLeave,
}: OnlineLobbyProps) {
  const t = TRANSLATIONS[settings.language];
  const [copied, setCopied] = useState(false);
  const [isStarting, setIsStarting] = useState(false);
  const [isChangingCategory, setIsChangingCategory] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [confirmKickId, setConfirmKickId] = useState<string | null>(null);

  const me = players.find((p) => p.id === myPlayerId);
  const isHost = me?.isHost || roomData.hostId === myPlayerId;
  const isReady = me?.isReady || false;

  const minPlayersMet = players.length >= 3;
  // All connected players except host must be ready (or all ready)
  const allReady = players.length >= 3 && players.every((p) => p.isReady || p.isHost);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(roomData.id);
      sound.playClick();
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {}
  };

  const handleShare = async () => {
    sound.playClick();
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${t.gameTitle} — ${t.roomCode} ${roomData.id}`,
          text: `${t.shareText} ${roomData.id}`,
          url: window.location.href,
        });
      } catch {}
    } else {
      handleCopyCode();
    }
  };

  const selectedCategories =
    roomData.categories && roomData.categories.length > 0
      ? roomData.categories
      : [roomData.category || 'ALL'];

  const categoryLabelOf = (id: string) => {
    if (id === 'ALL') return t.allCategories;
    if (id === CUSTOM_CATEGORY_ID) return t.customWords;
    const cat = CATEGORIES.find((c) => c.id === id);
    return cat ? (settings.language === 'bn' ? cat.bn : cat.en) : id;
  };

  const categoryLabel = selectedCategories.includes('ALL')
    ? t.allCategories
    : selectedCategories.map(categoryLabelOf).join(' · ');

  const hasCustomPairs = allWordPairs.some((p) => p.isCustom);
  const categoryOptions = [
    { id: 'ALL', label: t.allCategories },
    ...CATEGORIES.map((cat) => ({
      id: cat.id,
      label: settings.language === 'bn' ? cat.bn : cat.en,
    })),
    ...(hasCustomPairs || selectedCategories.includes(CUSTOM_CATEGORY_ID)
      ? [{ id: CUSTOM_CATEGORY_ID, label: t.customWords }]
      : []),
  ];

  const handleCategoryToggle = async (id: string) => {
    if (!isHost || isChangingCategory) return;
    let next: string[];
    if (id === 'ALL') {
      next = ['ALL'];
    } else {
      const withoutAll = selectedCategories.filter((c) => c !== 'ALL');
      next = withoutAll.includes(id)
        ? withoutAll.filter((c) => c !== id)
        : [...withoutAll, id];
      if (next.length === 0) next = ['ALL'];
    }
    if (
      next.length === selectedCategories.length &&
      next.every((c) => selectedCategories.includes(c))
    ) {
      return;
    }
    sound.playClick();
    try {
      setIsChangingCategory(true);
      setErrorMsg('');
      await setOnlineRoomCategories(roomData.id, next);
    } catch (err) {
      console.error(err);
      setErrorMsg(t.genericError);
    } finally {
      setIsChangingCategory(false);
    }
  };

  const handleToggleReady = async () => {
    sound.playClick();
    try {
      await togglePlayerReady(roomData.id, myPlayerId, !isReady);
    } catch (err) {
      console.error(err);
      setErrorMsg(t.genericError);
    }
  };

  const handleKickPlayer = async (playerId: string) => {
    if (confirmKickId !== playerId) {
      setConfirmKickId(playerId);
      return;
    }
    sound.playClick();
    try {
      await removePlayerFromRoom(roomData.id, playerId);
      setErrorMsg('');
    } catch (err) {
      console.error(err);
      setErrorMsg(t.kickFailed);
    } finally {
      setConfirmKickId(null);
    }
  };

  const handleStartGame = async () => {
    if (!isHost || !allReady || isStarting || isChangingCategory) return;
    try {
      setIsStarting(true);
      setErrorMsg('');
      sound.playClick();

      // Pick a word pair matching the room's category selection and difficulty
      const pair = pickWordPair(allWordPairs, {
        categories: selectedCategories,
        difficulty: roomData.difficulty,
        excludeIds: loadRecentWordIds(),
      });
      if (!pair) {
        setErrorMsg(t.noWordPair);
        setIsStarting(false);
        return;
      }
      rememberWordId(pair.id);

      await startOnlineGame(roomData.id, pair, players);
    } catch (e) {
      console.error(e);
      setErrorMsg(t.startFailed);
      setIsStarting(false);
    }
  };

  const handleLeaveRoom = async () => {
    sound.playClick();
    await leaveOnlineRoom(roomData.id, myPlayerId, !!isHost);
    onLeave();
  };

  return (
    <div className="max-w-md mx-auto px-4 py-6 animate-fadeIn space-y-6">
      <PageHeader
        title={t.lobbyTitle}
        code="OP-02 / LOBBY"
        backLabel={t.leaveRoom}
        backIcon={LogOut}
        onBack={handleLeaveRoom}
        right={
          <div className="flex items-center gap-1.5 border border-purple-500/30 bg-purple-950/40 px-2.5 py-1 font-mono text-[10px] text-purple-300">
            <Users className="w-3.5 h-3.5 text-purple-400" />
            <span>{players.length} / 20</span>
          </div>
        }
      />

      {/* Room Code Showcase Banner */}
      <div className="p-6 rounded-3xl bg-gradient-to-br from-purple-950/80 via-slate-900 to-indigo-950/60 border-2 border-purple-500/50 text-center space-y-3 shadow-2xl backdrop-blur-xl">
        <span className="text-[10px] font-mono uppercase tracking-widest text-purple-300">
          {t.roomCode}
        </span>
        <div className="text-4xl font-extrabold font-mono tracking-widest text-white">
          {roomData.id}
        </div>

        <div className="flex justify-center gap-2 pt-1">
          <button
            onClick={handleCopyCode}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-purple-600/30 border border-purple-500/40 hover:bg-purple-600/50 text-purple-200 text-xs font-bold uppercase transition cursor-pointer"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? t.copied : t.copyCode}</span>
          </button>

          <button
            onClick={handleShare}
            className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-800/80 border border-slate-700 hover:bg-slate-700 text-slate-200 text-xs font-bold uppercase transition cursor-pointer"
          >
            <Share2 className="w-3.5 h-3.5" />
            <span>{t.shareInvitation}</span>
          </button>
        </div>

        {/* Room configuration pills */}
        <div className="flex items-center justify-center gap-2 pt-2 text-[10px] font-mono text-slate-400">
          <span className="bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800">
            {categoryLabel}
          </span>
          <span className="bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800">
            {roomData.difficulty}
          </span>
          <span className="bg-slate-950/60 px-2 py-0.5 rounded border border-slate-800 flex items-center gap-1">
            {roomData.mode === 'CHAT_ON' ? <MessageSquare className="w-3 h-3 text-purple-400" /> : <Radio className="w-3 h-3 text-blue-400" />}
            {roomData.mode === 'CHAT_ON' ? t.chatOnShort : t.chatOffShort}
          </span>
        </div>

        {/* Host-only: switch categories for the upcoming round */}
        {isHost && (
          <div className="pt-2 space-y-1.5">
            <span className="text-[10px] font-mono uppercase tracking-wider text-purple-300 block text-center">
              {t.roundCategory}
            </span>
            <div className="flex flex-wrap justify-center gap-1.5">
              {categoryOptions.map((cat) => {
                const isSelected = selectedCategories.includes(cat.id);
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => handleCategoryToggle(cat.id)}
                    disabled={isChangingCategory || isStarting}
                    className={`px-2.5 py-1 rounded-lg text-[10px] font-medium border transition cursor-pointer disabled:opacity-60 ${
                      isSelected
                        ? 'bg-purple-950 border-purple-500/60 text-purple-200'
                        : 'bg-slate-950/80 border-slate-800 text-slate-500 hover:text-slate-300'
                    }`}
                  >
                    {cat.label}
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Players Connected List */}
      <div className="space-y-2">
        <span className="text-[11px] font-mono uppercase tracking-widest text-slate-400 block px-1">
          {t.connectedPlayers} ({players.length})
        </span>

        <div className="space-y-2 max-h-[38vh] overflow-y-auto pr-1">
          {players.map((p) => {
            const isThisHost = p.isHost || p.id === roomData.hostId;
            const isMe = p.id === myPlayerId;

            return (
              <div
                key={p.id}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-900/70 border border-slate-800/80 text-xs"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-purple-900/30 border border-purple-500/30 flex items-center justify-center text-xl shrink-0">
                    {p.avatar}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <span className="font-bold text-white text-sm">{p.name}</span>
                      {isMe && (
                        <span className="bg-purple-950 text-purple-300 text-[9px] font-mono px-1.5 py-0.2 rounded border border-purple-500/40">
                          {t.youBadge}
                        </span>
                      )}
                      {isThisHost && (
                        <span className="bg-amber-950/80 text-amber-300 text-[9px] font-mono px-1.5 py-0.2 rounded border border-amber-500/40 flex items-center gap-0.5">
                          <Crown className="w-2.5 h-2.5" />
                          {t.hostBadge}
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      {p.isOnline ? `● ${t.onlineStatus}` : `○ ${t.offlineStatus}`}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  {isHost && !isMe && !isThisHost && (
                    <button
                      onClick={() => handleKickPlayer(p.id)}
                      title={t.removePlayer}
                      className={`flex items-center gap-1 text-[10px] font-mono uppercase px-2 py-1 rounded border transition cursor-pointer ${
                        confirmKickId === p.id
                          ? 'bg-red-600 border-red-500 text-white'
                          : 'bg-slate-950 border-slate-800 text-slate-500 hover:text-red-400 hover:border-red-500/40'
                      }`}
                    >
                      <UserX className="w-3 h-3" />
                      {confirmKickId === p.id && <span>{t.confirm}</span>}
                    </button>
                  )}
                  {isThisHost ? (
                    <span className="text-amber-400 font-mono text-[10px] uppercase font-bold px-2 py-1 rounded bg-amber-950/40 border border-amber-500/20">
                      {t.hostBadge}
                    </span>
                  ) : p.isReady ? (
                    <span className="text-emerald-400 font-mono text-[10px] uppercase font-bold px-2 py-1 rounded bg-emerald-950/40 border border-emerald-500/30 flex items-center gap-1">
                      <Check className="w-3 h-3" />
                      {t.ready}
                    </span>
                  ) : (
                    <span className="text-slate-400 font-mono text-[10px] uppercase px-2 py-1 rounded bg-slate-950 border border-slate-800">
                      {t.notReady}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Action Buttons: Host starts or player toggles Ready */}
      <div className="pt-2 space-y-2">
        {errorMsg && (
          <div className="p-3 rounded-xl bg-red-950/50 border border-red-500/40 text-red-300 text-xs flex items-center gap-2 animate-shake">
            <Sparkles className="w-4 h-4 shrink-0 text-red-400" />
            <span>{errorMsg}</span>
          </div>
        )}
        {!isHost && (
          <button
            onClick={handleToggleReady}
            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition cursor-pointer ${
              isReady
                ? 'bg-slate-800 text-slate-300 border border-slate-700'
                : 'bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white shadow-emerald-900/30'
            }`}
          >
            <span>{isReady ? t.setNotReady : t.setReady}</span>
          </button>
        )}

        {isHost && (
          <button
            onClick={handleStartGame}
            disabled={!allReady || isStarting || isChangingCategory}
            className={`w-full py-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow-xl transition cursor-pointer ${
              allReady && !isStarting
                ? 'bg-gradient-to-r from-purple-600 via-violet-600 to-indigo-600 hover:scale-[1.02] text-white shadow-purple-600/30'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed'
            }`}
          >
            <Play className="w-4 h-4 fill-current" />
            <span>
              {isStarting
                ? t.launchingGame
                : !minPlayersMet
                ? t.needMorePlayers
                : !allReady
                ? t.waitingReady
                : t.startGame}
            </span>
          </button>
        )}
      </div>
    </div>
  );
}
