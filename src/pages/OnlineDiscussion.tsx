import { useState, useEffect, useRef } from 'react';
import { collection, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase';
import { sendChatMessage, callForVoteOnline } from '../services/onlineEngine';
import { OnlineRoomData, Player, GameSettings, ChatMessage } from '../types';
import { TRANSLATIONS } from '../data/translations';
import { sound } from '../utils/sound';
import {
  MessageSquare,
  Send,
  Vote,
  Radio,
  Eye,
  EyeOff,
} from 'lucide-react';

interface OnlineDiscussionProps {
  settings: GameSettings;
  roomData: OnlineRoomData;
  myPlayer: Player;
  players: Player[];
  secretWord: string;
  secretWordAlt?: string;
}

export default function OnlineDiscussion({
  settings,
  roomData,
  myPlayer,
  players,
  secretWord,
  secretWordAlt,
}: OnlineDiscussionProps) {
  const t = TRANSLATIONS[settings.language];
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState('');
  const [showSecretInHeader, setShowSecretInHeader] = useState(false);
  const [showCallConfirm, setShowCallConfirm] = useState(false);
  const [isCallingVote, setIsCallingVote] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Subscribe to real-time chat messages if in Mode A (CHAT_ON)
  useEffect(() => {
    if (roomData.mode !== 'CHAT_ON') return;

    const msgsRef = collection(db, 'rooms', roomData.id, 'messages');
    const unsub = onSnapshot(msgsRef, (snap) => {
      const list: ChatMessage[] = [];
      snap.forEach((d) => {
        list.push(d.data() as ChatMessage);
      });
      // Sort chronologically by id or timestamp
      list.sort((a, b) => a.id.localeCompare(b.id));
      setMessages(list);
    });

    return () => unsub();
  }, [roomData.id, roomData.mode]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputText.trim();
    if (!text) return;
    sound.playClick();
    setInputText('');
    setErrorMsg('');
    try {
      await sendChatMessage(roomData.id, myPlayer, text);
    } catch (err) {
      console.error(err);
      setInputText(text);
      setErrorMsg(t.messageFailed);
    }
  };

  const handleCallForVote = async () => {
    try {
      setIsCallingVote(true);
      setErrorMsg('');
      sound.playClick();
      await callForVoteOnline(roomData.id);
    } catch (err) {
      console.error(err);
      setErrorMsg(t.voteCallFailed);
      setIsCallingVote(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto px-4 py-4 min-h-[85vh] flex flex-col justify-between animate-fadeIn">
      {/* Top Banner with Secret Word Toggle & Call for Vote Action */}
      <div className="space-y-3 mb-3">
        <div className="flex items-center justify-between border-b border-slate-800/80 pb-2 font-mono text-[8px] uppercase tracking-[0.26em] text-slate-500">
          <span>
            <span className="text-slate-600">//</span> OP-02 / DISCUSSION
          </span>
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="h-1.5 w-1.5 animate-blink rounded-full bg-emerald-400" />
            Live
          </span>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
            <h2 className="text-sm sm:text-base font-black text-white uppercase tracking-tight flex items-center gap-1.5">
              <span>{t.discussionTitle}</span>
            </h2>
          </div>

          {/* Discreet peek at your own secret word */}
          <button
            onClick={() => setShowSecretInHeader(!showSecretInHeader)}
            className="flex items-center gap-1.5 text-xs font-mono px-3 py-1.5 rounded-xl bg-purple-950/60 border border-purple-500/30 text-purple-300 hover:text-white transition cursor-pointer"
          >
            {showSecretInHeader ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
            <span className="flex flex-col items-start leading-tight text-left">
              <span>{showSecretInHeader ? secretWord : t.peekMyWord}</span>
              {showSecretInHeader && secretWordAlt && secretWordAlt !== secretWord && (
                <span className="text-[10px] text-purple-200/70 font-bangla">
                  {secretWordAlt}
                </span>
              )}
            </span>
          </button>
        </div>

        {/* Global Call For Vote Bar */}
        <div className="flex items-center justify-between p-3 rounded-2xl bg-gradient-to-r from-purple-950/50 via-slate-900 to-indigo-950/50 border border-purple-500/30">
          <div className="text-xs text-slate-300">
            <span className="font-bold text-white block">{t.readyToEliminate}</span>
            <span className="text-[10px] text-slate-400">{t.anyPlayerCanTrigger}</span>
          </div>

          <button
            onClick={() => setShowCallConfirm(true)}
            className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-black text-xs uppercase tracking-wider flex items-center gap-1.5 shadow-lg shadow-purple-900/40 cursor-pointer transition hover:scale-105"
          >
            <Vote className="w-3.5 h-3.5" />
            <span>{t.callForVote}</span>
          </button>
        </div>

        {errorMsg && !showCallConfirm && (
          <p className="text-[11px] text-red-300 text-center">{errorMsg}</p>
        )}
      </div>

      {/* MODE A: In-Game Chat System */}
      {roomData.mode === 'CHAT_ON' ? (
        <div className="flex-1 flex flex-col justify-between bg-slate-900/70 border border-slate-800 rounded-3xl p-3 shadow-inner min-h-[50vh] max-h-[60vh] overflow-hidden">
          {/* Messages list */}
          <div className="flex-1 overflow-y-auto space-y-2.5 pr-1">
            {messages.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-slate-500 space-y-2">
                <MessageSquare className="w-8 h-8 text-slate-600" />
                <p className="text-xs">{t.noCluesYet}</p>
              </div>
            ) : (
              messages.map((m) => {
                const isMe = m.senderId === myPlayer.id;

                return (
                  <div
                    key={m.id}
                    className={`flex flex-col ${isMe ? 'items-end' : 'items-start'} space-y-1`}
                  >
                    <div className="flex items-center gap-1.5 text-[10px] text-slate-400 font-mono">
                      <span>{m.senderAvatar}</span>
                      <span className="font-bold text-slate-300">{m.senderName}</span>
                      <span>•</span>
                      <span>{m.timestamp}</span>
                    </div>
                    <div
                      className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs break-words shadow-sm ${
                        isMe
                          ? 'bg-purple-600 text-white rounded-tr-none'
                          : 'bg-slate-800 text-slate-200 border border-slate-700/60 rounded-tl-none'
                      }`}
                    >
                      {m.text}
                    </div>
                  </div>
                );
              })
            )}
            <div ref={messagesEndRef} />
          </div>

          {errorMsg && (
            <p className="text-[11px] text-red-300 pt-2">{errorMsg}</p>
          )}

          {/* Send Input */}
          <form onSubmit={handleSend} className="flex gap-2 pt-3 border-t border-slate-800">
            <input
              type="text"
              maxLength={200}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={t.sendMessagePlaceholder}
              className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-purple-500 transition"
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold uppercase transition flex items-center gap-1 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="w-3.5 h-3.5" />
              <span>{t.send}</span>
            </button>
          </form>
        </div>
      ) : (
        /* MODE B: External Discussion (Discord / Call) */
        <div className="flex-1 flex flex-col items-center justify-center text-center p-8 rounded-3xl bg-slate-900/70 border border-slate-800 space-y-6 my-auto">
          <div className="w-16 h-16 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center text-blue-400 shadow-lg shadow-blue-600/10">
            <Radio className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-black text-white uppercase tracking-tight">
              {t.externalModeTitle}
            </h3>
            <p className="text-xs text-slate-300 max-w-xs leading-relaxed">
              {t.externalModeDesc}
            </p>
          </div>

          {/* Active players grid */}
          <div className="w-full pt-4 border-t border-slate-800/80">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 block mb-3">
              {t.roomPlayers} ({players.length})
            </span>
            <div className="grid grid-cols-2 gap-2 text-left">
              {players.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center gap-2 p-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300"
                >
                  <span className="text-base">{p.avatar}</span>
                  <span className="font-bold truncate">{p.name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Separate confirmation sheet — calling the vote closes discussion for everyone */}
      {showCallConfirm && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-slate-950/80 backdrop-blur-sm animate-backdropIn px-0 sm:px-6">
          <div
            role="dialog"
            aria-modal="true"
            className="w-full sm:max-w-xs px-5 pt-3 pb-[calc(env(safe-area-inset-bottom)+20px)] sm:pb-5 rounded-t-3xl sm:rounded-3xl bg-slate-900 border-t sm:border border-purple-500/50 space-y-4 shadow-2xl animate-sheetUp"
          >
            <div className="sm:hidden mx-auto mb-1 h-1.5 w-10 rounded-full bg-slate-700" aria-hidden="true" />
            <div className="w-12 h-12 mx-auto rounded-2xl bg-purple-600/20 border border-purple-500/30 flex items-center justify-center">
              <Vote className="w-6 h-6 text-purple-300" />
            </div>
            <p className="text-sm text-white text-center font-bold">
              {t.callForVoteConfirm}
            </p>
            {errorMsg && (
              <p className="text-[11px] text-red-300 text-center">{errorMsg}</p>
            )}
            <div className="flex gap-2">
              <button
                onClick={() => {
                  sound.playClick();
                  setShowCallConfirm(false);
                  setErrorMsg('');
                }}
                disabled={isCallingVote}
                className="pressable flex-1 py-3 sm:py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs uppercase cursor-pointer disabled:opacity-60"
              >
                {t.cancel}
              </button>
              <button
                onClick={handleCallForVote}
                disabled={isCallingVote}
                className="pressable flex-1 py-3 sm:py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs uppercase cursor-pointer shadow-lg disabled:opacity-60"
              >
                {isCallingVote ? t.calling : t.confirm}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
