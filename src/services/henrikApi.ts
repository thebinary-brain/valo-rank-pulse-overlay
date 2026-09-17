import { HenrikDevConfig, MatchRecord, RankDefinition } from '../types';
import { getRankByTierNumber, getRankByName, RANKS } from '../data/ranks';

export interface HenrikFetchResult {
  success: boolean;
  error?: string;
  isCached?: boolean;
  rank: RankDefinition;
  currentRR: number;
  leaderboardRank?: number;
  peakRank?: string;
  wins: number;
  losses: number;
  winRate: number;
  streakType: 'win' | 'loss' | 'none';
  streakCount: number;
  netRR: number;
  recentMatches: MatchRecord[];
  latestMatch?: MatchRecord;
}

export const REGION_NAMES: Record<string, string> = {
  na: 'North America (NA)',
  eu: 'Europe (EU)',
  ap: 'Asia-Pacific (AP)',
  kr: 'Korea (KR)',
  latam: 'Latin America (LATAM)',
  br: 'Brazil (BR)',
};

// In-memory cache to prevent burning the 30 req/min free tier limit
interface CacheEntry {
  data: HenrikFetchResult;
  timestamp: number;
}
const apiCache = new Map<string, CacheEntry>();
const CACHE_TTL_MS = 60 * 1000; // 60 seconds
let rateLimitCooldownUntil = 0;

/**
 * Fetches live MMR and match history from HenrikDEV API with aggressive rate-limit defense & caching
 */
export async function fetchHenrikData(
  config: HenrikDevConfig
): Promise<HenrikFetchResult> {
  const { apiKey, riotId, tag, region, lastMatchesCount } = config;

  const emptyResult = (errorMessage: string): HenrikFetchResult => ({
    success: false,
    error: errorMessage,
    rank: RANKS[0], // Unranked fallback
    currentRR: 0,
    wins: 0,
    losses: 0,
    winRate: 0,
    streakType: 'none',
    streakCount: 0,
    netRR: 0,
    recentMatches: [],
  });

  if (!apiKey || !apiKey.trim()) {
    return emptyResult('HenrikDEV API Key is required. Get a free key from the HenrikDev dashboard.');
  }

  if (!riotId || !tag) {
    return emptyResult('Riot ID and TAG are required.');
  }

  // Validate matches count: strictly 1 to 5
  const matchLimit = Math.min(5, Math.max(1, Number(lastMatchesCount) || 5));

  const cleanName = encodeURIComponent(riotId.trim());
  const cleanTag = encodeURIComponent(tag.trim().replace(/^#/, ''));
  const cleanKey = apiKey.trim();
  const selectedRegion = (region || 'na').toLowerCase();
  const selectedRegionLabel = REGION_NAMES[selectedRegion] || selectedRegion.toUpperCase();

  const cacheKey = `${cleanKey.slice(-6)}_${selectedRegion}_${cleanName.toLowerCase()}_${cleanTag.toLowerCase()}`;
  const now = Date.now();

  // Check cache first: if fresh data exists, return it immediately without touching the API!
  const cached = apiCache.get(cacheKey);
  if (cached && now - cached.timestamp < CACHE_TTL_MS) {
    return {
      ...cached.data,
      isCached: true,
      // Re-slice and compute netRR based on current user's matchLimit
      netRR: cached.data.recentMatches.slice(0, matchLimit).reduce((acc, m) => acc + m.rrChange, 0),
    };
  }

  // If currently in rate limit cooldown, serve stale cache if available
  if (now < rateLimitCooldownUntil) {
    if (cached) {
      return {
        ...cached.data,
        isCached: true,
        error: 'API rate limit cooldown active (30 req/min). Showing cached stats.',
      };
    }
    const waitSec = Math.ceil((rateLimitCooldownUntil - now) / 1000);
    return emptyResult(`HenrikDEV API rate limit exceeded (30 req/min). Cooldown in progress, please wait ${waitSec}s.`);
  }

  const headers: HeadersInit = {
    Authorization: cleanKey,
    Accept: 'application/json',
  };

  try {
    let puuid = '';

    // Step 1: Check Account endpoint to verify player existence and actual server region (1 call)
    try {
      const accountUrl = `https://api.henrikdev.xyz/valorant/v1/account/${cleanName}/${cleanTag}`;
      const accountRes = await fetch(accountUrl, { headers });

      if (accountRes.status === 401 || accountRes.status === 403) {
        return emptyResult('Invalid HenrikDEV API Key. Please verify your key at https://api.henrikdev.xyz/dashboard/');
      }

      if (accountRes.status === 429) {
        rateLimitCooldownUntil = Date.now() + 20000;
        if (cached) {
          return {
            ...cached.data,
            isCached: true,
            error: 'HenrikDEV rate limit exceeded (30 req/min). Showing cached data.',
          };
        }
        return emptyResult('HenrikDEV API rate limit exceeded (30 req/min). Please wait 20 seconds before retrying.');
      }

      if (accountRes.status === 404) {
        return emptyResult(`Player "${riotId}#${cleanTag}" was not found. Please verify the Riot ID and TAG.`);
      }

      if (accountRes.ok) {
        const accountJson = await accountRes.json();
        const accountData = accountJson?.data;

        if (accountData) {
          puuid = accountData.puuid || '';
          const accountRegion = (accountData.region || '').toLowerCase();

          // Enforce strict region match: If player belongs to a different region, reject!
          if (accountRegion && accountRegion !== selectedRegion) {
            const actualRegionLabel = REGION_NAMES[accountRegion] || accountRegion.toUpperCase();
            return emptyResult(
              `Player "${riotId}#${cleanTag}" is registered in ${actualRegionLabel}, not ${selectedRegionLabel}. Please change Server Region to ${actualRegionLabel}.`
            );
          }
        }
      }
    } catch (accountErr: any) {
      console.warn('Account lookup error, continuing with MMR lookup', accountErr);
    }

    // Step 2: Fetch Competitive Match History & MMR
    // Henrik's mmr-history endpoint returns matches, current tier, and RR together in ONE request!
    let rawList: any[] = [];
    let currentTierNum = 0;
    let currentTierName = '';
    let currentRR = 0;
    let peakRank = 'Diamond 3';
    let seasonWins = 0;
    let seasonLosses = 0;

    const historyUrl = puuid
      ? `https://api.henrikdev.xyz/valorant/v1/by-puuid/mmr-history/${selectedRegion}/${puuid}`
      : `https://api.henrikdev.xyz/valorant/v1/mmr-history/${selectedRegion}/${cleanName}/${cleanTag}`;

    try {
      const historyRes = await fetch(historyUrl, { headers });

      if (historyRes.status === 429) {
        rateLimitCooldownUntil = Date.now() + 20000;
        if (cached) {
          return {
            ...cached.data,
            isCached: true,
            error: 'HenrikDEV rate limit exceeded (30 req/min). Showing cached data.',
          };
        }
        return emptyResult('HenrikDEV API rate limit exceeded (30 req/min). Please wait 20 seconds before retrying.');
      }

      if (historyRes.ok) {
        const json = await historyRes.json();
        if (Array.isArray(json?.data) && json.data.length > 0) {
          rawList = json.data;
          const first = rawList[0];
          currentTierNum = first.tier?.id ?? first.currenttier ?? (typeof first.ranking_tier === 'number' ? first.ranking_tier : 0);
          currentTierName = first.tier?.name ?? first.currenttierpatched ?? '';
          if (typeof first.ranking_in_tier === 'number') {
            currentRR = first.ranking_in_tier;
          } else if (typeof first.rr === 'number') {
            currentRR = first.rr;
          }
        }
      }
    } catch (histErr) {
      console.warn('Error fetching match history', histErr);
    }

    // Step 3: If MMR details weren't present in match history (e.g. no recent games or unranked),
    // query mmr v1 (1 call max)
    if (currentTierNum === 0) {
      try {
        const mmrUrl = `https://api.henrikdev.xyz/valorant/v1/mmr/${selectedRegion}/${cleanName}/${cleanTag}`;
        const mmrRes = await fetch(mmrUrl, { headers });

        if (mmrRes.status === 429) {
          rateLimitCooldownUntil = Date.now() + 20000;
          if (cached) return { ...cached.data, isCached: true };
        } else if (mmrRes.ok) {
          const mmrJson = await mmrRes.json();
          const d = mmrJson?.data;
          if (d) {
            currentTierNum = typeof d.currenttier === 'number' ? d.currenttier : 0;
            currentTierName = d.currenttierpatched || '';
            currentRR = typeof d.ranking_in_tier === 'number' ? d.ranking_in_tier : 0;
          }
        }
      } catch {
        // ignore
      }
    }

    // Scan match history of unranked users who are playing competitive queue.
    // At the start of a season, the player is unranked but previous matches in rawList show their rank.
    if (currentTierNum === 0 || !currentTierName || currentTierName.toLowerCase() === 'unranked') {
      for (const item of rawList) {
        const itemTierNum = item.tier?.id ?? item.currenttier ?? (typeof item.ranking_tier === 'number' ? item.ranking_tier : 0);
        const itemTierName = item.tier?.name ?? item.currenttierpatched ?? '';
        if (itemTierNum > 0) {
          currentTierNum = itemTierNum;
          currentTierName = itemTierName;
          if (typeof item.ranking_in_tier === 'number') {
            currentRR = item.ranking_in_tier;
          } else if (typeof item.rr === 'number') {
            currentRR = item.rr;
          }
          break;
        }
      }
    }

    // STRICT CHECK: If no rank and no matches were found in this region, reject
    if (currentTierNum === 0 && !currentTierName && rawList.length === 0) {
      return emptyResult(
        `No competitive data found for "${riotId}#${cleanTag}" in ${selectedRegionLabel}. The player may not have competitive matches this act or the region is incorrect.`
      );
    }

    // Parse all available recent matches (up to 10)
    const allMatches: MatchRecord[] = rawList.slice(0, 10).map((item: any, idx: number) => {
      const change =
        typeof item.mmr_change_to_last_game === 'number'
          ? item.mmr_change_to_last_game
          : typeof item.last_mmr_change === 'number'
          ? item.last_mmr_change
          : typeof item.change === 'number'
          ? item.change
          : typeof item.rr_change === 'number'
          ? item.rr_change
          : 0;

      const result: 'win' | 'loss' | 'draw' =
        change > 0 ? 'win' : change < 0 ? 'loss' : 'draw';

      return {
        id:
          item.match_id ||
          item.matchid ||
          (item.date_raw ? `match-${idx}-${item.date_raw}` : item.date ? `match-${idx}-${item.date}` : `match-${idx}`),
        result,
        rrChange: change,
        map: item.map?.name || (typeof item.map === 'string' ? item.map : 'Competitive'),
        agent: item.character || item.agent || undefined,
        timestamp: item.date_raw ? item.date_raw * 1000 : Date.now() - idx * 3600000,
      };
    });

    const activeMatches = allMatches.slice(0, matchLimit);

    // Resolve Rank
    let rank = RANKS[0]; // Default fallback for Unranked is RANKS[0] (Unranked), NOT RANKS[17] (Diamond 2)
    if (currentTierNum > 0) {
      rank = getRankByTierNumber(currentTierNum);
    } else if (currentTierName && currentTierName.toLowerCase() !== 'unranked') {
      rank = getRankByName(currentTierName);
    } else {
      rank = RANKS[0]; // Explicitly Unranked
    }

    // Calculate Wins and Losses
    let wins = 0;
    let losses = 0;
    if (seasonWins > 0 || seasonLosses > 0) {
      wins = seasonWins;
      losses = seasonLosses;
    } else if (allMatches.length > 0) {
      wins = allMatches.filter((m) => m.result === 'win').length;
      losses = allMatches.filter((m) => m.result === 'loss').length;
    }
    const total = wins + losses;
    const winRate = total > 0 ? Math.round((wins / total) * 100) : 0;

    // Calculate Streak
    let streakType: 'win' | 'loss' | 'none' = 'none';
    let streakCount = 0;

    if (allMatches.length > 0) {
      const firstResult = allMatches[0].result;
      if (firstResult === 'win' || firstResult === 'loss') {
        streakType = firstResult;
        for (const m of allMatches) {
          if (m.result === firstResult) {
            streakCount++;
          } else {
            break;
          }
        }
      }
    }

    // Net RR across active matches
    const netRR = activeMatches.reduce((acc, m) => acc + m.rrChange, 0);

    const result: HenrikFetchResult = {
      success: true,
      rank,
      currentRR,
      peakRank,
      wins,
      losses,
      winRate,
      streakType,
      streakCount,
      netRR,
      recentMatches: allMatches,
      latestMatch: allMatches[0],
    };

    // Store in cache for 60s
    apiCache.set(cacheKey, {
      data: result,
      timestamp: Date.now(),
    });

    return result;
  } catch (err: any) {
    if (cached) {
      return {
        ...cached.data,
        isCached: true,
        error: 'Network glitch; showing cached stats.',
      };
    }
    return emptyResult(err?.message || 'Network error connecting to HenrikDEV API.');
  }
}
