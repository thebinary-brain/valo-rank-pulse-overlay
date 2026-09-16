export interface RankRRDetails {
  isImmortalOrRadiant: boolean;
  totalRR: number;
  displayText: string;
  ratingValueText: string;
  ratioText: string | null;
  progressPercentage: number;
  tierThresholdText: string;
  minTierRR: number;
  maxTierRR: number | null;
}

/**
 * Computes official Valorant Ranked RR according to competitive tier rules:
 * - Iron to Ascendant: 100 RR per tier, displayed as "x / 100 RR".
 * - Immortal 1: 0 - 100 RR (requires 100 RR to promote to Immortal 2). Total rating displayed as "x RR" (no x/y).
 * - Immortal 2: 100 - 200 RR (requires 200 RR to promote to Immortal 3). Total rating displayed as "x RR" (no x/y).
 * - Immortal 3: 200+ RR (requires 300 RR cutoff to be eligible for Radiant, uncapped RR). Total rating displayed as "x RR" (no x/y).
 * - Radiant: 300+ RR (minimum 300 RR cutoff and top 500 on leaderboard). Total rating displayed as "x RR" (no x/y).
 */
export function computeRankRR(rankId: string, rawRR: number): RankRRDetails {
  const normalizedId = (rankId || '').toLowerCase().trim();
  const safeRR = Number.isFinite(rawRR) ? Math.max(0, Math.round(rawRR)) : 0;

  if (normalizedId === 'immortal-1') {
    // Immortal 1: 0 to 100 RR threshold
    const totalRR = safeRR;
    const progressPercentage = Math.min(100, Math.max(0, (totalRR / 100) * 100));

    return {
      isImmortalOrRadiant: true,
      totalRR,
      displayText: `${totalRR} RR`,
      ratingValueText: `${totalRR}`,
      ratioText: null, // Strictly NO x/y for Immortal/Radiant
      progressPercentage,
      tierThresholdText: '100 RR required for Immortal 2',
      minTierRR: 0,
      maxTierRR: 100,
    };
  }

  if (normalizedId === 'immortal-2') {
    // Immortal 2: 100 to 200 RR threshold
    // If input is e.g. 68 (tier offset), total rating is 100 + 68 = 168 RR.
    // If input is already total rating (e.g. 168), keep 168.
    const totalRR = safeRR < 100 ? 100 + safeRR : safeRR;
    // Progress between 100 and 200 RR
    const progressPercentage = Math.min(100, Math.max(0, ((totalRR - 100) / 100) * 100));

    return {
      isImmortalOrRadiant: true,
      totalRR,
      displayText: `${totalRR} RR`,
      ratingValueText: `${totalRR}`,
      ratioText: null, // Strictly NO x/y for Immortal/Radiant
      progressPercentage,
      tierThresholdText: '200 RR required for Immortal 3',
      minTierRR: 100,
      maxTierRR: 200,
    };
  }

  if (normalizedId === 'immortal-3') {
    // Immortal 3: Starts at 200 RR, Radiant cutoff is 300 RR (Top 500), uncapped
    let totalRR = safeRR;
    if (safeRR < 100) {
      totalRR = 200 + safeRR;
    } else if (safeRR >= 100 && safeRR < 200) {
      totalRR = 200 + (safeRR - 100);
    }
    // Progress toward 300 RR Radiant threshold
    const progressPercentage =
      totalRR >= 300
        ? 100
        : Math.min(100, Math.max(0, ((totalRR - 200) / 100) * 100));

    return {
      isImmortalOrRadiant: true,
      totalRR,
      displayText: `${totalRR} RR`,
      ratingValueText: `${totalRR}`,
      ratioText: null, // Strictly NO x/y for Immortal/Radiant
      progressPercentage,
      tierThresholdText:
        totalRR >= 300
          ? '300 RR Cutoff Met (Top 500 for Radiant)'
          : '300 RR minimum cutoff for Radiant (Top 500)',
      minTierRR: 200,
      maxTierRR: null, // Uncapped
    };
  }

  if (normalizedId === 'radiant') {
    // Radiant: 300+ RR and Top 500 leaderboard, uncapped
    const totalRR = safeRR < 300 ? 300 + safeRR : safeRR;

    return {
      isImmortalOrRadiant: true,
      totalRR,
      displayText: `${totalRR} RR`,
      ratingValueText: `${totalRR}`,
      ratioText: null, // Strictly NO x/y for Immortal/Radiant
      progressPercentage: 100,
      tierThresholdText: 'Radiant • Top 500 Public Leaderboard',
      minTierRR: 300,
      maxTierRR: null, // Uncapped
    };
  }

  // Standard tiers: Iron 1 through Ascendant 3 (and Unranked)
  // Each tier requires 100 RR to promote
  const totalRR = Math.min(100, safeRR);
  const progressPercentage = totalRR;

  return {
    isImmortalOrRadiant: false,
    totalRR,
    displayText: `${totalRR} / 100 RR`,
    ratingValueText: `${totalRR}`,
    ratioText: '/ 100 RR',
    progressPercentage,
    tierThresholdText: '100 RR required to promote (sets at 10 RR)',
    minTierRR: 0,
    maxTierRR: 100,
  };
}
