export type TierId =
  | 'unranked'
  | 'iron'
  | 'bronze'
  | 'silver'
  | 'gold'
  | 'platinum'
  | 'diamond'
  | 'ascendant'
  | 'immortal'
  | 'radiant';

export interface RankDefinition {
  id: string;
  tierId: TierId;
  division: 1 | 2 | 3 | null;
  name: string;
  shortName: string;
  tierNumber?: number;
  minRR: number;
  maxRR: number;
  color: string;
  glowColor: string;
  secondaryColor: string;
  badgeLevel: number;
  iconUrl: string;
}

export type MatchResult = 'win' | 'loss' | 'draw';

export interface MatchRecord {
  id: string;
  result: MatchResult;
  rrChange: number;
  agent?: string;
  map?: string;
  timestamp: number;
  score?: string;
}

export const DEFAULT_RECENT_MATCHES: MatchRecord[] = [
  { id: 'match-1', result: 'win', rrChange: 20, map: 'Ascent', timestamp: Date.now() - 1000 * 60 * 25, score: '13-8' },
  { id: 'match-2', result: 'win', rrChange: 18, map: 'Bind', timestamp: Date.now() - 1000 * 60 * 70, score: '13-10' },
  { id: 'match-3', result: 'win', rrChange: 22, map: 'Haven', timestamp: Date.now() - 1000 * 60 * 120, score: '13-6' },
  { id: 'match-4', result: 'loss', rrChange: -18, map: 'Split', timestamp: Date.now() - 1000 * 60 * 180, score: '9-13' },
  { id: 'match-5', result: 'win', rrChange: 10, map: 'Sunset', timestamp: Date.now() - 1000 * 60 * 240, score: '13-11' },
];

export type OverlayTheme =
  | 'vct'
  | 'radiant_glass'
  | 'compact_pill'
  | 'esports_hud'
  | 'minimal_neon'
  | 'vertical_card'
  | 'vct_2021';

export interface HenrikDevConfig {
  apiKey: string;
  riotId: string;
  tag: string;
  region: 'na' | 'eu' | 'ap' | 'kr' | 'latam' | 'br';
  lastMatchesCount: number; // strictly 1 to 5
  autoSync: boolean;
  syncIntervalSeconds: number; // 15, 30, 60
}

export interface OverlayDisplayToggles {
  showRankIcon: boolean;
  showPlayerName: boolean;
  showTotalRR: boolean;
  showWinStreak: boolean;
  showWinLoss: boolean;
  showWinRate: boolean;
  showNetRR: boolean;
  showLastMatches: boolean;
  showLeaderboard?: boolean;
  showAnimatedRankBackground: boolean;
}

export interface OverlayConfig {
  playerName: string;
  playerTag: string;
  currentRankId: string;
  currentRR: number;
  leaderboardRank?: number;
  peakRank: string;
  theme: OverlayTheme;

  // Display toggles
  toggles: OverlayDisplayToggles;

  // Transparency & visual tuning
  overlayOpacity: number; // 0.1 to 1.0 (overall overlay transparency)
  opacity?: number;
  backdropOpacity: number; // 0 to 1.0 (container background darkness)
  scale: number;
  glowIntensity: 'none' | 'subtle' | 'high';
  soundEnabled: boolean;
  soundVolume: number;

  // Live Win / Loss & Percentage data (auto-calculated from live matches or custom)
  wins: number;
  losses: number;
  autoCalculateWinRate: boolean;
  customWinRate: number; // e.g. 75 (%)

  // Streak data (auto-calculated from live matches or custom)
  streakType: 'win' | 'loss' | 'custom' | 'none';
  streakCount: number;
  customStreakText: string;

  // Net RR across tracked matches
  netRR: number;

  // Tracked recent matches (last 1-5 matches)
  recentMatches: MatchRecord[];

  // HenrikDEV API Integration settings
  henrik: HenrikDevConfig;
}

export type AnimationEventType = 'win' | 'loss' | null;

export interface MatchAnimationEvent {
  type: 'win' | 'loss';
  rrChange: number;
  previousRR: number;
  targetRR: number;
  id: string;
}

export interface SessionStats {
  wins: number;
  losses: number;
  currentRR: number;
  startRR: number;
  netRR: number;
  currentStreak: number;
  peakRR: number;
  winRate: number;
  matchHistory: MatchRecord[];
}
