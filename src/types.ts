export type GameLanguage = 'en' | 'bn';

export type GameMode = 'OFFLINE' | 'ONLINE';

export type OnlineModeType = 'CHAT_ON' | 'CHAT_OFF';

export type GameDifficulty = 'EASY' | 'MEDIUM' | 'HARD';

export type AvatarColor = 'violet' | 'emerald' | 'amber' | 'rose' | 'sky' | 'slate';

export type AvatarAccessory = 'none' | 'hat' | 'shades' | 'mask' | 'monocle';

export type GamePhase =
  | 'HOME'
  | 'HOW_TO_PLAY'
  | 'PROFILE'
  | 'SETTINGS'
  | 'STATS'
  | 'DEVELOPERS'
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
  avatarColor?: AvatarColor;
  avatarAccessory?: AvatarAccessory;
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
}

export interface GameSettings {
  language: GameLanguage;
  soundEnabled: boolean;
  musicEnabled: boolean;
  animationsEnabled: boolean;
  darkMode: boolean;
  hapticsEnabled: boolean;
  defaultDifficulty: GameDifficulty;
  preferredCategories: string[];
  maxPlayers: number;
}

export interface UserProfile {
  name: string;
  avatar: string;
  avatarColor?: AvatarColor;
  avatarAccessory?: AvatarAccessory;
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
  /** Selected category ids for this round. 'ALL' means every category. */
  categories?: string[];
  difficulty: GameDifficulty;
  /** When true, the imposter is told their role during the word reveal. */
  revealImposter?: boolean;
  /** When true, the imposter also sees the crew word as a suggestion at reveal. */
  imposterSuggestion?: boolean;
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
