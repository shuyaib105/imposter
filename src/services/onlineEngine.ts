import {
  doc,
  collection,
  setDoc,
  getDoc,
  getDocs,
  updateDoc,
  deleteDoc,
  writeBatch,
} from 'firebase/firestore';
import { auth, db } from '../firebase';
import { signInAnonymously } from 'firebase/auth';
import { OnlineRoomData, Player, ChatMessage, WordPair } from '../types';
import { calculateWinningLogic } from '../game/winningLogic';

// Robust client player ID manager that works without requiring Firebase Anonymous Auth
// (Prevents auth/admin-restricted-operation errors when anonymous auth is not enabled in Firebase Console)
export function getOrCreateLocalPlayerId(): string {
  const STORAGE_KEY = 'imposter_client_player_id_v1';
  try {
    let id = localStorage.getItem(STORAGE_KEY);
    if (!id) {
      id = 'usr_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8);
      localStorage.setItem(STORAGE_KEY, id);
    }
    return id;
  } catch {
    return 'usr_' + Date.now().toString(36) + '_' + Math.random().toString(36).substring(2, 8);
  }
}

// Safely attempts auth if available, otherwise falls back gracefully to local unique player id
export async function ensurePlayerIdentity(): Promise<string> {
  if (auth.currentUser) {
    return auth.currentUser.uid;
  }
  try {
    // Attempt anonymous sign-in only if supported by Firebase config
    const cred = await signInAnonymously(auth);
    return cred.user.uid;
  } catch (err: any) {
    // If anonymous auth is disabled (admin-restricted-operation), seamlessly use the local unique player ID!
    console.warn('Firebase anonymous auth restricted; using persistent client ID instead:', err?.code || err);
    return getOrCreateLocalPlayerId();
  }
}

// Generate unique 6-character alphanumeric room code
export function generateRoomCode(): string {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let res = '';
  for (let i = 0; i < 6; i++) {
    res += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return res;
}

// 1. Create a Room
export async function createOnlineRoom(
  hostName: string,
  hostAvatar: string,
  mode: 'CHAT_ON' | 'CHAT_OFF',
  categories: string[],
  difficulty: 'EASY' | 'MEDIUM' | 'HARD'
): Promise<{ roomCode: string; playerId: string }> {
  const playerId = await ensurePlayerIdentity();
  const selectedCategories = categories.length > 0 ? categories : ['ALL'];

  // Never reuse an existing room code: a collision would overwrite another
  // group's live game.
  let roomCode = generateRoomCode();
  let roomRef = doc(db, 'rooms', roomCode);
  for (let attempt = 0; attempt < 5; attempt++) {
    const existing = await getDoc(roomRef);
    if (!existing.exists()) break;
    roomCode = generateRoomCode();
    roomRef = doc(db, 'rooms', roomCode);
    if (attempt === 4) throw new Error('ROOM_CODE_COLLISION');
  }

  const now = new Date().toISOString();

  const roomData: OnlineRoomData = {
    id: roomCode,
    hostId: playerId,
    hostName,
    createdAt: now,
    mode,
    phase: 'LOBBY',
    category: selectedCategories[0],
    categories: selectedCategories,
    difficulty,
    round: 1,
    totalVoted: 0,
    revealImposter: false,
  };

  await setDoc(roomRef, roomData);

  // Add Host as Player 1
  const playerRef = doc(db, 'rooms', roomCode, 'players', playerId);
  const hostPlayer: Player = {
    id: playerId,
    name: hostName,
    avatar: hostAvatar,
    isHost: true,
    isReady: true,
    isOnline: true,
    hasVoted: false,
  };
  await setDoc(playerRef, hostPlayer);

  return { roomCode, playerId };
}

// 2. Join a Room
export async function joinOnlineRoom(
  roomCode: string,
  playerName: string,
  playerAvatar: string
): Promise<{ success: boolean; error?: string; playerId?: string }> {
  const code = roomCode.trim().toUpperCase();
  const playerId = await ensurePlayerIdentity();

  const roomRef = doc(db, 'rooms', code);
  const roomSnap = await getDoc(roomRef);

  if (!roomSnap.exists()) {
    return { success: false, error: 'ROOM_NOT_FOUND' };
  }

  const roomData = roomSnap.data() as OnlineRoomData;
  if (roomData.phase !== 'LOBBY') {
    return { success: false, error: 'GAME_ALREADY_STARTED' };
  }

  const playersSnap = await getDocs(collection(db, 'rooms', code, 'players'));
  if (playersSnap.size >= 20) {
    return { success: false, error: 'ROOM_FULL' };
  }

  // Check if player name already taken in room (other than this same user reconnecting)
  const isNameDuplicate = playersSnap.docs.some(
    (d) => d.id !== playerId && (d.data() as Player).name.toLowerCase() === playerName.trim().toLowerCase()
  );
  if (isNameDuplicate) {
    return { success: false, error: 'NAME_DUPLICATE' };
  }

  const playerRef = doc(db, 'rooms', code, 'players', playerId);
  const playerDoc: Player = {
    id: playerId,
    name: playerName.trim(),
    avatar: playerAvatar,
    isHost: roomData.hostId === playerId,
    isReady: false,
    isOnline: true,
    hasVoted: false,
  };

  await setDoc(playerRef, playerDoc);
  return { success: true, playerId };
}

// 3. Toggle Ready status
export async function togglePlayerReady(roomCode: string, playerId: string, isReady: boolean) {
  const playerRef = doc(db, 'rooms', roomCode, 'players', playerId);
  await updateDoc(playerRef, { isReady });
}

// 4. Leave Room
export async function leaveOnlineRoom(roomCode: string, playerId: string, isHost: boolean) {
  try {
    const playerRef = doc(db, 'rooms', roomCode, 'players', playerId);
    await deleteDoc(playerRef);

    // Remove the departing player's private word and vote so neither can
    // skew the current round.
    try {
      await deleteDoc(doc(db, 'rooms', roomCode, 'secrets', playerId));
    } catch {}
    try {
      await deleteDoc(doc(db, 'rooms', roomCode, 'votes', playerId));
    } catch {}

    // If host left, either transfer host or delete room if empty
    const playersSnap = await getDocs(collection(db, 'rooms', roomCode, 'players'));
    if (playersSnap.empty) {
      await deleteDoc(doc(db, 'rooms', roomCode));
    } else if (isHost) {
      const nextHost = playersSnap.docs[0].data() as Player;
      await updateDoc(doc(db, 'rooms', roomCode), {
        hostId: nextHost.id,
        hostName: nextHost.name,
      });
      await updateDoc(doc(db, 'rooms', roomCode, 'players', nextHost.id), {
        isHost: true,
        isReady: true,
      });
    }
  } catch {}
}

// 5. Start Game (Distribute Secret Words & pick Imposter)
export async function startOnlineGame(
  roomCode: string,
  wordPair: WordPair,
  players: Player[]
) {
  if (players.length < 3) {
    throw new Error('NEED_MORE_PLAYERS');
  }

  // Randomly select Imposter
  const imposterIndex = Math.floor(Math.random() * players.length);
  const imposterPlayer = players[imposterIndex];

  const batch = writeBatch(db);

  // Write individual private secrets for each player
  players.forEach((p) => {
    const isImp = p.id === imposterPlayer.id;
    const secretRef = doc(db, 'rooms', roomCode, 'secrets', p.id);
    batch.set(secretRef, {
      playerId: p.id,
      secretWord: isImp ? wordPair.wordB : wordPair.wordA,
      secretWordBn: isImp ? wordPair.wordBBn : wordPair.wordABn,
      isImposter: isImp,
    });

    // Reset player vote flags (merge so a player that left mid-start does not
    // make the whole batch fail).
    const pRef = doc(db, 'rooms', roomCode, 'players', p.id);
    batch.set(pRef, { hasVoted: false, voteTargetId: '' }, { merge: true });
  });

  // Delete any votes from previous rounds
  const existingVotes = await getDocs(collection(db, 'rooms', roomCode, 'votes'));
  existingVotes.forEach((v) => batch.delete(v.ref));

  // Advance room phase to WORD_REVEAL
  const roomRef = doc(db, 'rooms', roomCode);
  batch.set(
    roomRef,
    {
      phase: 'WORD_REVEAL',
      majorityWord: wordPair.wordA,
      majorityWordBn: wordABnSafe(wordPair),
      imposterWord: wordPair.wordB,
      imposterWordBn: wordBBnSafe(wordPair),
      imposterId: imposterPlayer.id,
      winnerStatus: 'NONE',
      totalVoted: 0,
    },
    { merge: true }
  );

  await batch.commit();
}

function wordABnSafe(w: WordPair) {
  return w.wordABn || w.wordA;
}

function wordBBnSafe(w: WordPair) {
  return w.wordBBn || w.wordB;
}

// 6. Transition from Word Reveal to Discussion
export async function advanceToDiscussion(roomCode: string) {
  const roomRef = doc(db, 'rooms', roomCode);
  await updateDoc(roomRef, { phase: 'DISCUSSION' });
}

// 7. Call for Vote (Can be initiated by ANY player during discussion)
export async function callForVoteOnline(roomCode: string) {
  const roomRef = doc(db, 'rooms', roomCode);
  await updateDoc(roomRef, { phase: 'VOTING' });
}

// 8. Submit Vote
export async function submitOnlineVote(
  roomCode: string,
  voterId: string,
  targetId: string
) {
  if (voterId === targetId) {
    throw new Error('SELF_VOTE_NOT_ALLOWED');
  }

  const voteRef = doc(db, 'rooms', roomCode, 'votes', voterId);
  const playerRef = doc(db, 'rooms', roomCode, 'players', voterId);

  await setDoc(voteRef, {
    voterId,
    targetId,
    timestamp: new Date().toISOString(),
  });

  await updateDoc(playerRef, { hasVoted: true, voteTargetId: targetId });

  await finalizeOnlineVotingIfComplete(roomCode);
}

/**
 * Tallies the votes that are currently in Firestore and advances the room to
 * RESULTS once every *remaining* player has voted. The tally is always taken
 * from a fresh snapshot, so a player leaving mid-vote can never leave the room
 * permanently stuck on the voting screen.
 */
export async function finalizeOnlineVotingIfComplete(
  roomCode: string,
  options: { force?: boolean } = {}
): Promise<boolean> {
  const roomRef = doc(db, 'rooms', roomCode);

  const [roomSnap, playersSnap, votesSnap] = await Promise.all([
    getDoc(roomRef),
    getDocs(collection(db, 'rooms', roomCode, 'players')),
    getDocs(collection(db, 'rooms', roomCode, 'votes')),
  ]);

  if (!roomSnap.exists()) return false;
  const room = roomSnap.data() as OnlineRoomData;
  if (room.phase !== 'VOTING') return false;

  const players = playersSnap.docs.map((d) => d.data() as Player);
  if (players.length === 0) return false;

  const activeIds = new Set(players.map((p) => p.id));
  const votesMap: Record<string, string> = {};
  votesSnap.forEach((d) => {
    const data = d.data() as { voterId?: string; targetId?: string };
    if (data.voterId && data.targetId && activeIds.has(data.voterId) && activeIds.has(data.targetId)) {
      votesMap[data.voterId] = data.targetId;
    }
  });

  const totalVotesCast = Object.keys(votesMap).length;
  const isComplete = totalVotesCast >= players.length || !!options.force;

  if (!isComplete) {
    await updateDoc(roomRef, { totalVoted: totalVotesCast });
    return false;
  }

  const calculation = calculateWinningLogic(players, votesMap, room.imposterId || '');

  await updateDoc(roomRef, {
    phase: 'RESULTS',
    winnerStatus: calculation.winnerStatus,
    imposterVotes: calculation.imposterVotes,
    highestNonImposterVotes: calculation.highestNonImposterVotes,
    totalVoted: totalVotesCast,
  });

  return true;
}

/** Host escape hatch: close voting early and tally the votes already cast. */
export async function endVotingEarly(roomCode: string) {
  return finalizeOnlineVotingIfComplete(roomCode, { force: true });
}

// 9. Send Chat Message
export async function sendChatMessage(
  roomCode: string,
  sender: Player,
  text: string
) {
  if (!text.trim()) return;
  const msgId = Date.now().toString() + '_' + Math.random().toString(36).substring(2, 6);
  const msgRef = doc(db, 'rooms', roomCode, 'messages', msgId);

  const msg: ChatMessage = {
    id: msgId,
    senderId: sender.id,
    senderName: sender.name,
    senderAvatar: sender.avatar,
    text: text.trim().slice(0, 500),
    timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  };

  await setDoc(msgRef, msg);
}

// 10. Play Again / Reset Round for Online Room
export async function playAgainOnline(roomCode: string, currentRound: number) {
  const roomRef = doc(db, 'rooms', roomCode);
  const playersSnap = await getDocs(collection(db, 'rooms', roomCode, 'players'));

  const batch = writeBatch(db);
  playersSnap.forEach((p) => {
    batch.update(p.ref, { isReady: false, hasVoted: false, voteTargetId: '' });
  });

  const votesSnap = await getDocs(collection(db, 'rooms', roomCode, 'votes'));
  votesSnap.forEach((v) => batch.delete(v.ref));

  const msgsSnap = await getDocs(collection(db, 'rooms', roomCode, 'messages'));
  msgsSnap.forEach((m) => batch.delete(m.ref));

  // Private secret words must not survive into the next round.
  const secretsSnap = await getDocs(collection(db, 'rooms', roomCode, 'secrets'));
  secretsSnap.forEach((s) => batch.delete(s.ref));

  batch.set(
    roomRef,
    {
      phase: 'LOBBY',
      round: currentRound + 1,
      majorityWord: '',
      majorityWordBn: '',
      imposterWord: '',
      imposterWordBn: '',
      imposterId: '',
      winnerStatus: 'NONE',
      totalVoted: 0,
      imposterVotes: 0,
      highestNonImposterVotes: 0,
    },
    { merge: true }
  );

  await batch.commit();
}

// 11. Remove a player from the room (host cleanup for stale/ghost players)
export async function removePlayerFromRoom(roomCode: string, playerId: string) {
  await deleteDoc(doc(db, 'rooms', roomCode, 'players', playerId));
  try {
    await deleteDoc(doc(db, 'rooms', roomCode, 'secrets', playerId));
  } catch {}
  try {
    await deleteDoc(doc(db, 'rooms', roomCode, 'votes', playerId));
  } catch {}
}

/** Lets the host switch the category selection between rounds. 'ALL' means every category. */
export async function setOnlineRoomCategories(roomCode: string, categories: string[]) {
  const next = categories.length > 0 ? categories : ['ALL'];
  await updateDoc(doc(db, 'rooms', roomCode), {
    categories: next,
    category: next[0],
  });
}

/** Host toggle: should the imposter be told their role during the reveal? */
export async function setOnlineRoomRevealImposter(roomCode: string, revealImposter: boolean) {
  await updateDoc(doc(db, 'rooms', roomCode), { revealImposter });
}
