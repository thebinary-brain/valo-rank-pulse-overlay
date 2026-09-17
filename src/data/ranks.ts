import { RankDefinition } from '../types';

const BASE_ICON_URL =
  'https://media.valorant-api.com/competitivetiers/03621f52-342b-cf4e-4f86-9350a49c6d04';

export const RANKS: RankDefinition[] = [
  {
    id: 'unranked',
    tierId: 'unranked',
    division: null,
    name: 'Unranked',
    shortName: 'UNR',
    minRR: 0,
    maxRR: 100,
    color: '#8b97a2',
    glowColor: 'rgba(139, 151, 162, 0.4)',
    secondaryColor: '#535d67',
    badgeLevel: 0,
    iconUrl: `${BASE_ICON_URL}/0/largeicon.png`,
  },
  // Iron
  {
    id: 'iron-1',
    tierId: 'iron',
    division: 1,
    name: 'Iron 1',
    shortName: 'I1',
    minRR: 0,
    maxRR: 100,
    color: '#707882',
    glowColor: 'rgba(112, 120, 130, 0.4)',
    secondaryColor: '#474d54',
    badgeLevel: 1,
    iconUrl: `${BASE_ICON_URL}/3/largeicon.png`,
  },
  {
    id: 'iron-2',
    tierId: 'iron',
    division: 2,
    name: 'Iron 2',
    shortName: 'I2',
    minRR: 0,
    maxRR: 100,
    color: '#818b95',
    glowColor: 'rgba(129, 139, 149, 0.4)',
    secondaryColor: '#50565e',
    badgeLevel: 2,
    iconUrl: `${BASE_ICON_URL}/4/largeicon.png`,
  },
  {
    id: 'iron-3',
    tierId: 'iron',
    division: 3,
    name: 'Iron 3',
    shortName: 'I3',
    minRR: 0,
    maxRR: 100,
    color: '#959fa9',
    glowColor: 'rgba(149, 159, 169, 0.5)',
    secondaryColor: '#5a626a',
    badgeLevel: 3,
    iconUrl: `${BASE_ICON_URL}/5/largeicon.png`,
  },
  // Bronze
  {
    id: 'bronze-1',
    tierId: 'bronze',
    division: 1,
    name: 'Bronze 1',
    shortName: 'B1',
    minRR: 0,
    maxRR: 100,
    color: '#a0734c',
    glowColor: 'rgba(160, 115, 76, 0.4)',
    secondaryColor: '#63452c',
    badgeLevel: 4,
    iconUrl: `${BASE_ICON_URL}/6/largeicon.png`,
  },
  {
    id: 'bronze-2',
    tierId: 'bronze',
    division: 2,
    name: 'Bronze 2',
    shortName: 'B2',
    minRR: 0,
    maxRR: 100,
    color: '#b68356',
    glowColor: 'rgba(182, 131, 86, 0.45)',
    secondaryColor: '#704f33',
    badgeLevel: 5,
    iconUrl: `${BASE_ICON_URL}/7/largeicon.png`,
  },
  {
    id: 'bronze-3',
    tierId: 'bronze',
    division: 3,
    name: 'Bronze 3',
    shortName: 'B3',
    minRR: 0,
    maxRR: 100,
    color: '#cd9360',
    glowColor: 'rgba(205, 147, 96, 0.5)',
    secondaryColor: '#805939',
    badgeLevel: 6,
    iconUrl: `${BASE_ICON_URL}/8/largeicon.png`,
  },
  // Silver
  {
    id: 'silver-1',
    tierId: 'silver',
    division: 1,
    name: 'Silver 1',
    shortName: 'S1',
    minRR: 0,
    maxRR: 100,
    color: '#9aa5b1',
    glowColor: 'rgba(154, 165, 177, 0.45)',
    secondaryColor: '#636c76',
    badgeLevel: 7,
    iconUrl: `${BASE_ICON_URL}/9/largeicon.png`,
  },
  {
    id: 'silver-2',
    tierId: 'silver',
    division: 2,
    name: 'Silver 2',
    shortName: 'S2',
    minRR: 0,
    maxRR: 100,
    color: '#b2bcc6',
    glowColor: 'rgba(178, 188, 198, 0.5)',
    secondaryColor: '#737c86',
    badgeLevel: 8,
    iconUrl: `${BASE_ICON_URL}/10/largeicon.png`,
  },
  {
    id: 'silver-3',
    tierId: 'silver',
    division: 3,
    name: 'Silver 3',
    shortName: 'S3',
    minRR: 0,
    maxRR: 100,
    color: '#cbd5e1',
    glowColor: 'rgba(203, 213, 225, 0.55)',
    secondaryColor: '#88929e',
    badgeLevel: 9,
    iconUrl: `${BASE_ICON_URL}/11/largeicon.png`,
  },
  // Gold
  {
    id: 'gold-1',
    tierId: 'gold',
    division: 1,
    name: 'Gold 1',
    shortName: 'G1',
    minRR: 0,
    maxRR: 100,
    color: '#d69e2e',
    glowColor: 'rgba(214, 158, 46, 0.45)',
    secondaryColor: '#8f6515',
    badgeLevel: 10,
    iconUrl: `${BASE_ICON_URL}/12/largeicon.png`,
  },
  {
    id: 'gold-2',
    tierId: 'gold',
    division: 2,
    name: 'Gold 2',
    shortName: 'G2',
    minRR: 0,
    maxRR: 100,
    color: '#eab308',
    glowColor: 'rgba(234, 179, 8, 0.5)',
    secondaryColor: '#9c7308',
    badgeLevel: 11,
    iconUrl: `${BASE_ICON_URL}/13/largeicon.png`,
  },
  {
    id: 'gold-3',
    tierId: 'gold',
    division: 3,
    name: 'Gold 3',
    shortName: 'G3',
    minRR: 0,
    maxRR: 100,
    color: '#facc15',
    glowColor: 'rgba(250, 204, 21, 0.55)',
    secondaryColor: '#b4880b',
    badgeLevel: 12,
    iconUrl: `${BASE_ICON_URL}/14/largeicon.png`,
  },
  // Platinum
  {
    id: 'platinum-1',
    tierId: 'platinum',
    division: 1,
    name: 'Platinum 1',
    shortName: 'P1',
    minRR: 0,
    maxRR: 100,
    color: '#22a2bb',
    glowColor: 'rgba(34, 162, 187, 0.45)',
    secondaryColor: '#126171',
    badgeLevel: 13,
    iconUrl: `${BASE_ICON_URL}/15/largeicon.png`,
  },
  {
    id: 'platinum-2',
    tierId: 'platinum',
    division: 2,
    name: 'Platinum 2',
    shortName: 'P2',
    minRR: 0,
    maxRR: 100,
    color: '#2ec3e0',
    glowColor: 'rgba(46, 195, 224, 0.5)',
    secondaryColor: '#18798c',
    badgeLevel: 14,
    iconUrl: `${BASE_ICON_URL}/16/largeicon.png`,
  },
  {
    id: 'platinum-3',
    tierId: 'platinum',
    division: 3,
    name: 'Platinum 3',
    shortName: 'P3',
    minRR: 0,
    maxRR: 100,
    color: '#38e1ff',
    glowColor: 'rgba(56, 225, 255, 0.55)',
    secondaryColor: '#2096ab',
    badgeLevel: 15,
    iconUrl: `${BASE_ICON_URL}/17/largeicon.png`,
  },
  // Diamond
  {
    id: 'diamond-1',
    tierId: 'diamond',
    division: 1,
    name: 'Diamond 1',
    shortName: 'D1',
    minRR: 0,
    maxRR: 100,
    color: '#9333ea',
    glowColor: 'rgba(147, 51, 234, 0.45)',
    secondaryColor: '#5c179c',
    badgeLevel: 16,
    iconUrl: `${BASE_ICON_URL}/18/largeicon.png`,
  },
  {
    id: 'diamond-2',
    tierId: 'diamond',
    division: 2,
    name: 'Diamond 2',
    shortName: 'D2',
    minRR: 0,
    maxRR: 100,
    color: '#a855f7',
    glowColor: 'rgba(168, 85, 247, 0.5)',
    secondaryColor: '#6f24b5',
    badgeLevel: 17,
    iconUrl: `${BASE_ICON_URL}/19/largeicon.png`,
  },
  {
    id: 'diamond-3',
    tierId: 'diamond',
    division: 3,
    name: 'Diamond 3',
    shortName: 'D3',
    minRR: 0,
    maxRR: 100,
    color: '#c084fc',
    glowColor: 'rgba(192, 132, 252, 0.55)',
    secondaryColor: '#802fce',
    badgeLevel: 18,
    iconUrl: `${BASE_ICON_URL}/20/largeicon.png`,
  },
  // Ascendant
  {
    id: 'ascendant-1',
    tierId: 'ascendant',
    division: 1,
    name: 'Ascendant 1',
    shortName: 'A1',
    minRR: 0,
    maxRR: 100,
    color: '#10b981',
    glowColor: 'rgba(16, 185, 129, 0.45)',
    secondaryColor: '#086345',
    badgeLevel: 19,
    iconUrl: `${BASE_ICON_URL}/21/largeicon.png`,
  },
  {
    id: 'ascendant-2',
    tierId: 'ascendant',
    division: 2,
    name: 'Ascendant 2',
    shortName: 'A2',
    minRR: 0,
    maxRR: 100,
    color: '#34d399',
    glowColor: 'rgba(52, 211, 153, 0.5)',
    secondaryColor: '#0b7b57',
    badgeLevel: 20,
    iconUrl: `${BASE_ICON_URL}/22/largeicon.png`,
  },
  {
    id: 'ascendant-3',
    tierId: 'ascendant',
    division: 3,
    name: 'Ascendant 3',
    shortName: 'A3',
    minRR: 0,
    maxRR: 100,
    color: '#6ee7b7',
    glowColor: 'rgba(110, 231, 183, 0.55)',
    secondaryColor: '#10996c',
    badgeLevel: 21,
    iconUrl: `${BASE_ICON_URL}/23/largeicon.png`,
  },
  // Immortal
  {
    id: 'immortal-1',
    tierId: 'immortal',
    division: 1,
    name: 'Immortal 1',
    shortName: 'IM1',
    minRR: 0,
    maxRR: 100,
    color: '#e11d48',
    glowColor: 'rgba(225, 29, 72, 0.5)',
    secondaryColor: '#86102a',
    badgeLevel: 22,
    iconUrl: `${BASE_ICON_URL}/24/largeicon.png`,
  },
  {
    id: 'immortal-2',
    tierId: 'immortal',
    division: 2,
    name: 'Immortal 2',
    shortName: 'IM2',
    minRR: 0,
    maxRR: 100,
    color: '#f43f5e',
    glowColor: 'rgba(244, 63, 94, 0.55)',
    secondaryColor: '#9f1332',
    badgeLevel: 23,
    iconUrl: `${BASE_ICON_URL}/25/largeicon.png`,
  },
  {
    id: 'immortal-3',
    tierId: 'immortal',
    division: 3,
    name: 'Immortal 3',
    shortName: 'IM3',
    minRR: 0,
    maxRR: 100,
    color: '#fb7185',
    glowColor: 'rgba(251, 113, 133, 0.6)',
    secondaryColor: '#b91c3e',
    badgeLevel: 24,
    iconUrl: `${BASE_ICON_URL}/26/largeicon.png`,
  },
  // Radiant
  {
    id: 'radiant',
    tierId: 'radiant',
    division: null,
    name: 'Radiant',
    shortName: 'RAD',
    minRR: 0,
    maxRR: 999,
    color: '#fef08a',
    glowColor: 'rgba(254, 240, 138, 0.75)',
    secondaryColor: '#eab308',
    badgeLevel: 25,
    iconUrl: `${BASE_ICON_URL}/27/largeicon.png`,
  },
];

export const MAPS = [
  'Ascent',
  'Bind',
  'Haven',
  'Split',
  'Icebox',
  'Breeze',
  'Fracture',
  'Pearl',
  'Lotus',
  'Sunset',
  'Abyss',
];

export const AGENTS = [
  'Jett',
  'Reyna',
  'Omen',
  'Sova',
  'Viper',
  'Cypher',
  'Killjoy',
  'Clove',
  'Iso',
  'Vyse',
  'Fade',
  'Raze',
  'Chamber',
  'Phoenix',
  'Yoru',
  'Gekko',
  'Skye',
  'Breach',
  'Astra',
  'Harbor',
  'KAY/O',
  'Deadlock',
  'Neon',
  'Brimstone',
];

export function getRankById(id: string): RankDefinition {
  const found = RANKS.find((r) => r.id === id);
  return found || RANKS[0]; // default Unranked
}

export function getRankByTierNumber(tierNum: number): RankDefinition {
  // If unranked or below 3
  if (tierNum <= 2) return RANKS[0]; // Unranked
  if (tierNum >= 27) return RANKS[RANKS.length - 1]; // Radiant

  const found = RANKS.find((r) => {
    // Check if iconUrl contains /${tierNum}/
    return r.iconUrl.includes(`/${tierNum}/`) || r.tierNumber === tierNum;
  });

  return found || RANKS[0]; // default Unranked
}

export function getRankByName(name: string): RankDefinition {
  if (!name) return RANKS[0];
  const clean = name.toLowerCase().replace(/\s+/g, '');
  if (clean === 'unrated' || clean === 'unranked' || clean === 'unr') {
    return RANKS[0];
  }
  const found = RANKS.find((r) => {
    const rClean = r.name.toLowerCase().replace(/\s+/g, '');
    const rShort = r.shortName.toLowerCase();
    const rId = r.id.toLowerCase().replace('-', '');
    return rClean === clean || rShort === clean || rId === clean;
  });
  return found || RANKS[0]; // default Unranked
}

export function getNextRank(currentId: string): RankDefinition | null {
  const idx = RANKS.findIndex((r) => r.id === currentId);
  if (idx === -1 || idx === RANKS.length - 1) return null;
  return RANKS[idx + 1];
}

export function getPreviousRank(currentId: string): RankDefinition | null {
  const idx = RANKS.findIndex((r) => r.id === currentId);
  if (idx <= 0) return null;
  return RANKS[idx - 1];
}
