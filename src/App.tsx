import { useState, useEffect, useRef } from 'react';
import { doc, onSnapshot, collection } from 'firebase/firestore';
import { db } from './firebase';
import {
  playAgainOnline,
  finalizeOnlineVotingIfComplete,
  leaveOnlineRoom,
} from './services/onlineEngine';
import {
  GamePhase,
  GameSettings,
  Player,
  WinnerStatus,
  OnlineRoomData,
  UserProfile,
} from './types';
import { WORD_PAIRS } from './data/words';
import { TRANSLATIONS } from './data/translations';
import {
  loadSettings,
  saveSettings,
  recordGameStats,
  hasRecordedResult,
  markResultRecorded,
  loadProfile,
  saveProfile,
} from './utils/storage';
import { sound } from './utils/sound';
import { hapticTap } from './utils/haptics';
import { calculateWinningLogic } from './game/winningLogic';
import { pickWordPair } from './game/wordSelection';
import { loadRecentWordIds, rememberWordId } from './game/wordHistory';

// Components
import BottomNav from './components/BottomNav';

// Pages
import HomePage from './pages/HomePage';
import OfflineSetup from './pages/OfflineSetup';
import OfflineReveal from './pages/OfflineReveal';
import OfflineDiscussion from './pages/OfflineDiscussion';
import OfflineVoting from './pages/OfflineVoting';
import GameResults from './pages/GameResults';
import OnlineSelection from './pages/OnlineSelection';
import OnlineLobby from './pages/OnlineLobby';
import OnlineReveal from './pages/OnlineReveal';
import OnlineDiscussion from './pages/OnlineDiscussion';
import OnlineVoting from './pages/OnlineVoting';
import SettingsView from './pages/SettingsView';
import HowToPlay from './pages/HowToPlay';
import StatsView from './pages/StatsView';
import ProfileView from './pages/ProfileView';
import DeveloperPage from './pages/DeveloperPage';

function readSession(key: string): string {
  try {
    return sessionStorage.getItem(key) || '';
  } catch {
    return '';
  }
}

export default function App() {
  const [phase, setPhase] = useState<GamePhase>('HOME');
  const [profileReturnPhase, setProfileReturnPhase] = useState<GamePhase>('HOME');
  const [settings, setSettings] = useState<GameSettings>(loadSettings);
  const [profile, setProfile] = useState<UserProfile>(loadProfile);
  const t = TRANSLATIONS[settings.language];

  // Bottom tab bar is only shown on the app's top-level destinations
  const showNav: boolean = (
    ['HOME', 'STATS', 'SETTINGS', 'DEVELOPERS'] as GamePhase[]
  ).includes(phase);

  // -------------------------------------------------------------
  // Offline Game State
  // -------------------------------------------------------------
  const [offlinePlayers, setOfflinePlayers] = useState<Player[]>([]);
  const [offlineImposterId, setOfflineImposterId] = useState<string>('');
  const [offlineSecrets, setOfflineSecrets] = useState<Record<string, string>>({});
  const [offlineSecretsAlt, setOfflineSecretsAlt] = useState<Record<string, string>>({});
  const [offlineRevealImposter, setOfflineRevealImposter] = useState(false);
  const [offlineMajorityWord, setOfflineMajorityWord] = useState('');
  const [offlineImposterWord, setOfflineImposterWord] = useState('');
  const [offlineMajorityWordAlt, setOfflineMajorityWordAlt] = useState('');
  const [offlineImposterWordAlt, setOfflineImposterWordAlt] = useState('');
  const [offlineVoteCounts, setOfflineVoteCounts] = useState<Record<string, number>>({});
  const [offlineVotes, setOfflineVotes] = useState<Record<string, string>>({});
  const [offlineWinnerStatus, setOfflineWinnerStatus] = useState<WinnerStatus>('NONE');

  // -------------------------------------------------------------
  // Online Game State
  // -------------------------------------------------------------
  const [activeRoomCode, setActiveRoomCode] = useState<string | null>(() =>
    readSession('imposter_active_room')
  );
  const [myPlayerId, setMyPlayerId] = useState<string>(() =>
    readSession('imposter_my_player_id')
  );
  const [onlineRoom, setOnlineRoom] = useState<OnlineRoomData | null>(null);
  const [onlinePlayers, setOnlinePlayers] = useState<Player[]>([]);
  const [myOnlineSecretWord, setMyOnlineSecretWord] = useState<string>('');
  const [myOnlineSecretWordAlt, setMyOnlineSecretWordAlt] = useState<string>('');

  // Prevents the same voting round from being finalized repeatedly
  const votingFinalizeRef = useRef<string>('');

  // Combined word bank (stock + user-created custom words)
  const allWordPairs = WORD_PAIRS;

  // -------------------------------------------------------------
  // Global Settings Effects
  // -------------------------------------------------------------
  useEffect(() => {
    sound.setEnabled(settings.soundEnabled);
  }, [settings.soundEnabled]);

  useEffect(() => {
    document.documentElement.lang = settings.language === 'bn' ? 'bn' : 'en';
  }, [settings.language]);

  useEffect(() => {
    document.documentElement.classList.toggle('light', !settings.darkMode);
    const themeMeta = document.querySelector('meta[name="theme-color"]');
    if (themeMeta) {
      themeMeta.setAttribute('content', settings.darkMode ? '#070b16' : '#eef2f8');
    }
  }, [settings.darkMode]);

  // Each screen starts at the top, like a native stack push
  useEffect(() => {
    window.scrollTo({ top: 0 });
  }, [phase]);

  // Haptic tick on any interactive tap (mobile-native feel)
  useEffect(() => {
    if (!settings.hapticsEnabled) return;
    const selector = 'button, a, [role="button"], [role="switch"], [role="tab"]';
    const handlePointerDown = (e: PointerEvent) => {
      const target = e.target as Element | null;
      if (!target?.closest) return;
      const el = target.closest(selector) as HTMLElement | null;
      if (!el || el.hasAttribute('disabled') || el.getAttribute('aria-disabled') === 'true') return;
      hapticTap();
    };
    document.addEventListener('pointerdown', handlePointerDown, { passive: true });
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [settings.hapticsEnabled]);

  // Keep the online session across a page refresh (per browser tab)
  useEffect(() => {
    try {
      if (activeRoomCode) sessionStorage.setItem('imposter_active_room', activeRoomCode);
      else sessionStorage.removeItem('imposter_active_room');
    } catch {}
  }, [activeRoomCode]);

  useEffect(() => {
    try {
      if (myPlayerId) sessionStorage.setItem('imposter_my_player_id', myPlayerId);
      else sessionStorage.removeItem('imposter_my_player_id');
    } catch {}
  }, [myPlayerId]);

  // -------------------------------------------------------------
  // Online Real-time Sync Listeners
  // -------------------------------------------------------------
  useEffect(() => {
    if (!activeRoomCode) return;

    const handleSnapshotError = (err: unknown) => {
      console.error('Online room subscription failed', err);
      setActiveRoomCode(null);
      setMyPlayerId('');
      setOnlineRoom(null);
      setPhase('HOME');
    };

    // 1. Room document listener
    const roomRef = doc(db, 'rooms', activeRoomCode);
    const unsubRoom = onSnapshot(roomRef, (snap) => {
      if (snap.exists()) {
        const data = snap.data() as OnlineRoomData;
        setOnlineRoom(data);

        // Sync view based on live room phase
        if (data.phase === 'LOBBY') {
          setPhase('ONLINE_LOBBY');
        } else if (data.phase === 'WORD_REVEAL') {
          setPhase('ONLINE_WORD_REVEAL');
        } else if (data.phase === 'DISCUSSION') {
          setPhase('ONLINE_DISCUSSION');
        } else if (data.phase === 'VOTING') {
          setPhase('ONLINE_VOTING');
        } else if (data.phase === 'RESULTS') {
          setPhase('ONLINE_RESULTS');
          // Record player stats exactly once per room round, even after refresh
          if (myPlayerId) {
            const resultKey = `${activeRoomCode}:${data.round ?? 1}`;
            if (!hasRecordedResult(resultKey)) {
              markResultRecorded(resultKey);
              recordGameStats(
                myPlayerId === data.imposterId,
                (data.winnerStatus as WinnerStatus) || 'NONE'
              );
            }
          }
        }
      } else {
        // Room was deleted or closed
        setActiveRoomCode(null);
        setMyPlayerId('');
        setOnlineRoom(null);
        setPhase('HOME');
      }
    }, handleSnapshotError);

    // 2. Players collection listener
    const playersRef = collection(db, 'rooms', activeRoomCode, 'players');
    const unsubPlayers = onSnapshot(playersRef, (snap) => {
      const pList: Player[] = [];
      snap.forEach((d) => {
        pList.push(d.data() as Player);
      });
      setOnlinePlayers(pList);

      // If we were removed from the room (kicked / stale session), go home.
      if (myPlayerId && pList.length > 0 && !pList.some((p) => p.id === myPlayerId)) {
        setActiveRoomCode(null);
        setMyPlayerId('');
        setOnlineRoom(null);
        setPhase('HOME');
      }
    }, handleSnapshotError);

    // 3. My private secret word listener
    let unsubSecret = () => {};
    if (myPlayerId) {
      const secretRef = doc(db, 'rooms', activeRoomCode, 'secrets', myPlayerId);
      unsubSecret = onSnapshot(secretRef, (snap) => {
        if (snap.exists()) {
          const sData = snap.data();
          const word = settings.language === 'bn' ? sData.secretWordBn : sData.secretWord;
          const altWord = settings.language === 'bn' ? sData.secretWord : sData.secretWordBn;
          setMyOnlineSecretWord(word || sData.secretWord);
          setMyOnlineSecretWordAlt(altWord || '');
        }
      });
    }

    return () => {
      unsubRoom();
      unsubPlayers();
      unsubSecret();
    };
  }, [activeRoomCode, myPlayerId, settings.language]);

  // Safety net: if every remaining player has already voted (for example the
  // last voter left the room before the tally ran), advance the round so the
  // room can never get stuck on the voting screen.
  useEffect(() => {
    if (!activeRoomCode || !onlineRoom || onlineRoom.phase !== 'VOTING') return;
    if (onlinePlayers.length === 0) return;
    if (!onlinePlayers.every((p) => p.hasVoted)) return;

    const roundKey = `${activeRoomCode}:${onlineRoom.round ?? 1}`;
    if (votingFinalizeRef.current === roundKey) return;
    votingFinalizeRef.current = roundKey;

    finalizeOnlineVotingIfComplete(activeRoomCode).catch((err) => {
      console.error('Failed to finalize online voting', err);
      votingFinalizeRef.current = '';
    });
  }, [activeRoomCode, onlineRoom, onlinePlayers]);

  // -------------------------------------------------------------
  // Offline Game Lifecycle Handlers
  // -------------------------------------------------------------
  const handleStartOfflineGame = (players: Player[], revealImposter = false) => {
    setOfflinePlayers(players);
    setOfflineRevealImposter(revealImposter);

    // Pick a random pair respecting the player's category + difficulty settings
    const pair = pickWordPair(allWordPairs, {
      preferredCategories: settings.preferredCategories,
      difficulty: settings.defaultDifficulty,
      excludeIds: loadRecentWordIds(),
    });
    if (!pair) return;
    rememberWordId(pair.id);

    const majorityWord = settings.language === 'bn' ? pair.wordABn : pair.wordA;
    const imposterWord = settings.language === 'bn' ? pair.wordBBn : pair.wordB;
    const majorityWordAlt = settings.language === 'bn' ? pair.wordA : pair.wordABn;
    const imposterWordAlt = settings.language === 'bn' ? pair.wordB : pair.wordBBn;

    // Pick exactly one Imposter
    const imposterIdx = Math.floor(Math.random() * players.length);
    const imposterP = players[imposterIdx];
    setOfflineImposterId(imposterP.id);
    setOfflineMajorityWord(majorityWord);
    setOfflineImposterWord(imposterWord);
    setOfflineMajorityWordAlt(majorityWordAlt);
    setOfflineImposterWordAlt(imposterWordAlt);

    // Distribute secrets (primary word + the other-language version)
    const secretMap: Record<string, string> = {};
    const secretAltMap: Record<string, string> = {};
    players.forEach((p) => {
      const isImp = p.id === imposterP.id;
      secretMap[p.id] = isImp ? imposterWord : majorityWord;
      secretAltMap[p.id] = isImp ? imposterWordAlt : majorityWordAlt;
    });
    setOfflineSecrets(secretMap);
    setOfflineSecretsAlt(secretAltMap);

    setPhase('OFFLINE_WORD_REVEAL');
  };

  const handleOfflineVotingComplete = (votes: Record<string, string>) => {
    const calc = calculateWinningLogic(offlinePlayers, votes, offlineImposterId);
    setOfflineVoteCounts(calc.voteCounts);
    setOfflineVotes(votes);
    setOfflineWinnerStatus(calc.winnerStatus);

    // Record stats for player 1 (device owner)
    const isP1Imposter = offlinePlayers[0]?.id === offlineImposterId;
    recordGameStats(isP1Imposter, calc.winnerStatus);

    setPhase('OFFLINE_RESULTS');
  };

  const handleOfflinePlayAgain = () => {
    sound.playClick();
    handleStartOfflineGame(offlinePlayers, offlineRevealImposter);
  };

  // -------------------------------------------------------------
  // Online Game Handlers
  // -------------------------------------------------------------
  const handleOnlineRoomJoined = (roomCode: string, pId: string) => {
    setActiveRoomCode(roomCode);
    setMyPlayerId(pId);
    setPhase('ONLINE_LOBBY');
  };

  const handleOnlinePlayAgain = async () => {
    if (!onlineRoom || !activeRoomCode) return;
    sound.playClick();
    try {
      await playAgainOnline(activeRoomCode, onlineRoom.round || 1);
    } catch (err) {
      console.error('Failed to restart online round', err);
    }
  };

  // -------------------------------------------------------------
  // Settings & Profile Handlers
  // -------------------------------------------------------------
  const handleUpdateSettings = (next: GameSettings) => {
    setSettings(next);
    saveSettings(next);
  };

  const handleSaveProfile = (next: UserProfile) => {
    setProfile(next);
    saveProfile(next);
  };

  const myOnlinePlayer = onlinePlayers.find((p) => p.id === myPlayerId) || {
    id: myPlayerId,
    name: 'You',
    avatar: '🕵️‍♂️',
  };

  return (
    <div
      className={`safe-area min-h-[100dvh] bg-[#070b16] text-slate-100 flex flex-col justify-between selection:bg-purple-600 selection:text-white font-sans overflow-x-hidden ${
        settings.animationsEnabled ? '' : 'reduce-motion'
      }`}
    >
      {/* Background radial glow + dossier grid */}
      <div className="fixed inset-0 pointer-events-none opacity-40">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl" />
        <div className="absolute -bottom-32 right-1/4 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl" />
      </div>
      <div className="pointer-events-none fixed inset-0 dossier-grid opacity-50" aria-hidden="true" />

      <main
        key={phase}
        className={`relative z-10 flex-1 flex flex-col animate-pageIn ${
          showNav ? 'pb-[calc(env(safe-area-inset-bottom)+88px)]' : ''
        }`}
      >
        {/* 1. HOME */}
        {phase === 'HOME' && (
          <HomePage
            settings={settings}
            profile={profile}
            onToggleTheme={() =>
              handleUpdateSettings({ ...settings, darkMode: !settings.darkMode })
            }
            onSelectProfile={() => {
              setProfileReturnPhase('HOME');
              setPhase('PROFILE');
            }}
            onSelectOffline={() => setPhase('OFFLINE_SETUP')}
            onSelectOnline={() => setPhase('ONLINE_ROOM_SELECTION')}
            onSelectHowToPlay={() => setPhase('HOW_TO_PLAY')}
          />
        )}

        {/* 2. PROFILE */}
        {phase === 'PROFILE' && (
          <ProfileView
            settings={settings}
            profile={profile}
            onSave={handleSaveProfile}
            onBack={() => setPhase(profileReturnPhase)}
          />
        )}

        {/* 3. HOW TO PLAY */}
        {phase === 'HOW_TO_PLAY' && (
          <HowToPlay settings={settings} onBack={() => setPhase('HOME')} />
        )}

        {/* 3. SETTINGS */}
        {phase === 'SETTINGS' && (
          <SettingsView
            settings={settings}
            onUpdateSettings={handleUpdateSettings}
            onBack={() => setPhase('HOME')}
          />
        )}

        {/* 4. STATS */}
        {phase === 'STATS' && (
          <StatsView settings={settings} onBack={() => setPhase('HOME')} />
        )}

        {phase === 'DEVELOPERS' && (
          <DeveloperPage settings={settings} onBack={() => setPhase('HOME')} />
        )}

        {/* 5. OFFLINE SETUP */}
        {phase === 'OFFLINE_SETUP' && (
          <OfflineSetup
            settings={settings}
            onStartGame={handleStartOfflineGame}
            onBack={() => setPhase('HOME')}
          />
        )}

        {/* 7. OFFLINE WORD REVEAL */}
        {phase === 'OFFLINE_WORD_REVEAL' && (
          <OfflineReveal
            settings={settings}
            players={offlinePlayers}
            playerSecrets={offlineSecrets}
            playerSecretAlts={offlineSecretsAlt}
            imposterId={offlineImposterId}
            revealImposter={offlineRevealImposter}
            onAllRevealed={() => setPhase('OFFLINE_DISCUSSION')}
          />
        )}

        {/* 8. OFFLINE DISCUSSION */}
        {phase === 'OFFLINE_DISCUSSION' && (
          <OfflineDiscussion
            settings={settings}
            players={offlinePlayers}
            onStartVoting={() => setPhase('OFFLINE_VOTING')}
          />
        )}

        {/* 9. OFFLINE VOTING */}
        {phase === 'OFFLINE_VOTING' && (
          <OfflineVoting
            settings={settings}
            players={offlinePlayers}
            onVotingComplete={handleOfflineVotingComplete}
          />
        )}

        {/* 10. OFFLINE RESULTS */}
        {phase === 'OFFLINE_RESULTS' && (
          <GameResults
            settings={settings}
            players={offlinePlayers}
            imposterId={offlineImposterId}
            majorityWord={offlineMajorityWord}
            imposterWord={offlineImposterWord}
            majorityWordAlt={offlineMajorityWordAlt}
            imposterWordAlt={offlineImposterWordAlt}
            voteCounts={offlineVoteCounts}
            winnerStatus={offlineWinnerStatus}
            votes={offlineVotes}
            onPlayAgain={handleOfflinePlayAgain}
            onReturnHome={() => setPhase('HOME')}
          />
        )}

        {/* 11. ONLINE SELECTION (CREATE / JOIN) */}
        {phase === 'ONLINE_ROOM_SELECTION' && (
          <OnlineSelection
            settings={settings}
            profile={profile}
            onEditProfile={() => {
              setProfileReturnPhase('ONLINE_ROOM_SELECTION');
              setPhase('PROFILE');
            }}
            onRoomJoined={handleOnlineRoomJoined}
            onBack={() => setPhase('HOME')}
          />
        )}

        {/* Loading state while the room snapshot is being fetched */}
        {onlineRoom === null &&
          (phase === 'ONLINE_LOBBY' ||
            phase === 'ONLINE_WORD_REVEAL' ||
            phase === 'ONLINE_DISCUSSION' ||
            phase === 'ONLINE_VOTING' ||
            phase === 'ONLINE_RESULTS') && (
            <div className="flex-1 flex flex-col items-center justify-center gap-3 py-24 text-center">
              <div className="w-10 h-10 rounded-full border-2 border-purple-500/30 border-t-purple-400 animate-spin" />
              <p className="text-xs font-mono uppercase tracking-widest text-slate-400">
                {t.connectingToRoom}
              </p>
            </div>
          )}

        {/* 12. ONLINE LOBBY */}
        {phase === 'ONLINE_LOBBY' && onlineRoom && (
          <OnlineLobby
            settings={settings}
            roomData={onlineRoom}
            players={onlinePlayers}
            myPlayerId={myPlayerId}
            allWordPairs={allWordPairs}
            onLeave={() => {
              setActiveRoomCode(null);
              setMyPlayerId('');
              setOnlineRoom(null);
              setPhase('HOME');
            }}
          />
        )}

        {/* 13. ONLINE WORD REVEAL */}
        {phase === 'ONLINE_WORD_REVEAL' && onlineRoom && (
          <OnlineReveal
            settings={settings}
            roomData={onlineRoom}
            secretWord={myOnlineSecretWord}
            secretWordAlt={myOnlineSecretWordAlt}
            isImposter={myPlayerId === (onlineRoom.imposterId || '')}
            revealImposter={!!onlineRoom.revealImposter}
            myPlayer={myOnlinePlayer}
            isHost={onlineRoom.hostId === myPlayerId}
          />
        )}

        {/* 14. ONLINE DISCUSSION */}
        {phase === 'ONLINE_DISCUSSION' && onlineRoom && (
          <OnlineDiscussion
            settings={settings}
            roomData={onlineRoom}
            myPlayer={myOnlinePlayer}
            players={onlinePlayers}
            secretWord={myOnlineSecretWord}
            secretWordAlt={myOnlineSecretWordAlt}
          />
        )}

        {/* 15. ONLINE VOTING */}
        {phase === 'ONLINE_VOTING' && onlineRoom && (
          <OnlineVoting
            settings={settings}
            roomData={onlineRoom}
            myPlayer={myOnlinePlayer}
            players={onlinePlayers}
          />
        )}

        {/* 16. ONLINE RESULTS */}
        {phase === 'ONLINE_RESULTS' && onlineRoom && (
          <GameResults
            settings={settings}
            players={onlinePlayers}
            imposterId={onlineRoom.imposterId || ''}
            majorityWord={
              settings.language === 'bn'
                ? onlineRoom.majorityWordBn || onlineRoom.majorityWord || ''
                : onlineRoom.majorityWord || ''
            }
            imposterWord={
              settings.language === 'bn'
                ? onlineRoom.imposterWordBn || onlineRoom.imposterWord || ''
                : onlineRoom.imposterWord || ''
            }
            majorityWordAlt={
              settings.language === 'bn'
                ? onlineRoom.majorityWord || ''
                : onlineRoom.majorityWordBn || ''
            }
            imposterWordAlt={
              settings.language === 'bn'
                ? onlineRoom.imposterWord || ''
                : onlineRoom.imposterWordBn || ''
            }
            voteCounts={
              // Compute votes from players voteTargetId
              onlinePlayers.reduce((acc, p) => {
                if (p.voteTargetId) {
                  acc[p.voteTargetId] = (acc[p.voteTargetId] || 0) + 1;
                }
                return acc;
              }, {} as Record<string, number>)
            }
            winnerStatus={onlineRoom.winnerStatus || 'NONE'}
            myPlayerId={myPlayerId}
            votes={onlinePlayers.reduce((acc, p) => {
              if (p.voteTargetId) acc[p.id] = p.voteTargetId;
              return acc;
            }, {} as Record<string, string>)}
            canPlayAgain={onlineRoom.hostId === myPlayerId}
            onPlayAgain={handleOnlinePlayAgain}
            onReturnHome={() => {
              const roomCode = onlineRoom.id;
              const wasHost = onlineRoom.hostId === myPlayerId;
              setActiveRoomCode(null);
              setMyPlayerId('');
              setOnlineRoom(null);
              setPhase('HOME');
              leaveOnlineRoom(roomCode, myPlayerId, wasHost).catch((err) => {
                console.error('Failed to leave room after results', err);
              });
            }}
          />
        )}
      </main>

      {showNav && (
        <BottomNav settings={settings} activePhase={phase} onNavigate={setPhase} />
      )}
    </div>
  );
}
