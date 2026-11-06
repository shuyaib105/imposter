export type GameLanguage = 'en' | 'bn';

export type GameMode = 'OFFLINE' | 'ONLINE';

export type OnlineModeType = 'CHAT_ON' | 'CHAT_OFF';

export type GameDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type GamePhase =
  | 'HOME'
  | 'HOW_TO_PLAY'
  | 'PROFILE'
  | 'SETTINGS'
  | 'STATS'
  | 'CUSTOM_WORDS'
  | 'OFFLINE_SETUP'
  | 'OFFLINE_WORD_REVEAL'
  | 'OFFLINE_DISCUSSION'
  | 'OFFLINE_VOTING'
  | 'OFFLINE_RESULTS'
  | 'ONLINE_ROOM_SELECTION'
  | 'ONLINE_CREATE'
  | 'ONLINE_JOIN'
  | 'ONLINE_LOBBY'
  | 'ONLINE_WORD_REVEAL'
  | 'ONLINE_DISCUSSION'
  | 'ONLINE_VOTING'
  | 'ONLINE_RESULTS';

export type WinnerStatus = 'GROUP_WIN' | 'IMPOSTER_WIN' | 'TIE' | 'NONE';

export interface Player {
  id: string;
  name: string;
  avatar: string;
  isHost?: boolean;
  isReady?: boolean;
  isOnline?: boolean;
  hasVoted?: boolean;
  voteTargetId?: string;
}

export interface WordPair {
  id: string;
  category: string;
  categoryBn: string;
  wordA: string; // Majority word
  wordABn: string;
  wordB: string; // Imposter word
  wordBBn: string;
  difficulty: GameDifficulty;
  isCustom?: boolean;
}

export interface GameSettings {
  language: GameLanguage;
  soundEnabled: boolean;
  musicEnabled: boolean;
  animationsEnabled: boolean;
  defaultDifficulty: GameDifficulty;
  preferredCategories: string[];
  maxPlayers: number;
}

export interface UserProfile {
  name: string;
  avatar: string;
}

export interface PlayerStats {
  totalGames: number;
  totalWins: number;
  totalLosses: number;
  timesImposter: number;
  imposterWins: number;
  groupWins: number;
  tiedGames: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  senderName: string;
  senderAvatar: string;
  text: string;
  timestamp: string;
}

export interface OnlineRoomData {
  id: string;
  hostId: string;
  hostName: string;
  createdAt: string;
  mode: OnlineModeType;
  phase: 'LOBBY' | 'WORD_REVEAL' | 'DISCUSSION' | 'VOTING' | 'RESULTS';
  category: string;
  difficulty: GameDifficulty;
  round: number;
  majorityWord?: string;
  imposterWord?: string;
  majorityWordBn?: string;
  imposterWordBn?: string;
  imposterId?: string;
  winnerStatus?: WinnerStatus;
  highestNonImposterVotes?: number;
  imposterVotes?: number;
  totalVoted?: number;
}
