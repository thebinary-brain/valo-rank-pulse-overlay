import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Crosshair, Sliders, Copy, Check, Radio, ExternalLink } from 'lucide-react';
import { OverlayConfig, DEFAULT_RECENT_MATCHES } from './types';
import { OverlayWidget } from './components/OverlayWidget';
import { InstructionStepper } from './components/InstructionStepper';
import { HudConsole } from './components/HudConsole';
import { EnlargePreviewModal } from './components/EnlargePreviewModal';
import { InfoModal } from './components/InfoModal';
import { RankPulseLogo } from './components/RankPulseLogo';
import { SamosaIcon } from './components/SamosaIcon';
import { fetchHenrikData } from './services/henrikApi';

const STORAGE_KEY_CONFIG = 'valorant_overlay_henrik_config_v4';

export default function App() {
  // Check if loaded in OBS Browser Source mode (?overlay=true or ?transparent=true)
  const isOverlayModeFromUrl =
    typeof window !== 'undefined' &&
    (new URLSearchParams(window.location.search).get('overlay') === 'true' ||
      new URLSearchParams(window.location.search).get('transparent') === 'true');

  const [isEnlargeOpen, setIsEnlargeOpen] = useState(false);
  const [activeModal, setActiveModal] = useState<'faq' | 'privacy' | 'terms' | null>(null);
  const [topBarCopied, setTopBarCopied] = useState(false);

  // Victory / Defeat match celebration state
  const [celebrationType, setCelebrationType] = useState<'victory' | 'defeat' | null>(null);
  const lastKnownMatchIdRef = useRef<string | null>(null);

  // Sync state
  const [isSyncing, setIsSyncing] = useState(false);
  const [syncStatus, setSyncStatus] = useState<{
    success: boolean;
    message: string;
    timestamp?: number;
  } | null>(null);

  // Main Overlay Config
  const [config, setConfig] = useState<OverlayConfig>(() => {
    let baseConfig: OverlayConfig = {
      playerName: 'TenZ',
      playerTag: '0001',
      currentRankId: 'immortal-2',
      currentRR: 168,
      peakRank: 'Radiant',
      theme: 'vct',

      toggles: {
        showRankIcon: true,
        showPlayerName: true,
        showTotalRR: true,
        showWinStreak: true,
        showWinLoss: true,
        showWinRate: true,
        showNetRR: true,
        showLastMatches: true,
        showAnimatedRankBackground: true,
      },

      overlayOpacity: 1.0,
      opacity: 1.0,
      backdropOpacity: 0.92,
      scale: 1,
      glowIntensity: 'high',
      soundEnabled: true,
      soundVolume: 0.6,

      wins: 4,
      losses: 1,
      autoCalculateWinRate: true,
      customWinRate: 80,

      streakType: 'win',
      streakCount: 3,
      customStreakText: '3 WIN STREAK',

      netRR: 52,
      recentMatches: DEFAULT_RECENT_MATCHES,

      henrik: {
        apiKey: '',
        riotId: 'TenZ',
        tag: '0001',
        region: 'ap',
        lastMatchesCount: 3,
        autoSync: false,
        syncIntervalSeconds: 30,
      },
    };

    // Load from SessionStorage if not standalone overlay mode
    const isOverlayMode =
      typeof window !== 'undefined' &&
      (new URLSearchParams(window.location.search).get('overlay') === 'true' ||
        new URLSearchParams(window.location.search).get('transparent') === 'true');

    if (typeof window !== 'undefined' && !isOverlayMode) {
      // Clear legacy localStorage to prevent pulling someone else's cached credentials
      try {
        localStorage.removeItem(STORAGE_KEY_CONFIG);
      } catch {
        // ignore
      }

      const saved = sessionStorage.getItem(STORAGE_KEY_CONFIG);
      if (saved) {
        try {
          const parsed = JSON.parse(saved);
          baseConfig = {
            ...baseConfig,
            ...parsed,
            toggles: {
              ...baseConfig.toggles,
              ...(parsed.toggles || {}),
            },
            henrik: {
              ...baseConfig.henrik,
              ...(parsed.henrik || {}),
            },
          };
        } catch {
          // ignore
        }
      }
    } else if (isOverlayMode) {
      // Clear TenZ/Immortal placeholder stats for stream overlays during load latency
      baseConfig.playerName = 'Loading...';
      baseConfig.playerTag = '';
      baseConfig.currentRankId = 'unranked';
      baseConfig.currentRR = 0;
      baseConfig.peakRank = 'Unranked';
      baseConfig.wins = 0;
      baseConfig.losses = 0;
      baseConfig.streakType = 'none';
      baseConfig.streakCount = 0;
      baseConfig.netRR = 0;
      baseConfig.recentMatches = [];
    }

    // Read URL Search parameters (critical for OBS and sharing configurations)
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);

      const themeParam = urlParams.get('theme');
      if (themeParam) baseConfig.theme = themeParam as any;

      const opacityParam = urlParams.get('opacity');
      if (opacityParam) {
        const opVal = parseFloat(opacityParam);
        if (!isNaN(opVal)) {
          baseConfig.opacity = opVal;
          baseConfig.overlayOpacity = opVal;
        }
      }

      const scaleParam = urlParams.get('scale');
      if (scaleParam) {
        const scaleVal = parseFloat(scaleParam);
        if (!isNaN(scaleVal)) baseConfig.scale = scaleVal;
      }

      const glowParam = urlParams.get('glowIntensity');
      if (glowParam) baseConfig.glowIntensity = glowParam as any;

      const backdropParam = urlParams.get('backdropOpacity');
      if (backdropParam) {
        const bdVal = parseFloat(backdropParam);
        if (!isNaN(bdVal)) baseConfig.backdropOpacity = bdVal;
      }

      // Henrik credentials
      const riotIdParam = urlParams.get('riotId');
      if (riotIdParam) {
        baseConfig.henrik.riotId = riotIdParam;
        baseConfig.playerName = riotIdParam;
      }

      const tagParam = urlParams.get('tag');
      if (tagParam) {
        baseConfig.henrik.tag = tagParam;
        baseConfig.playerTag = tagParam;
      }

      const regionParam = urlParams.get('region');
      if (regionParam) baseConfig.henrik.region = regionParam as any;

      const apiKeyParam = urlParams.get('apiKey');
      if (apiKeyParam) baseConfig.henrik.apiKey = apiKeyParam;

      // Toggle parameters
      if (baseConfig.toggles) {
        Object.keys(baseConfig.toggles).forEach((key) => {
          const toggleParam = urlParams.get(key);
          if (toggleParam !== null) {
            (baseConfig.toggles as any)[key] = toggleParam === 'true';
          }
        });
      }
    }

    return baseConfig;
  });

  // Save config changes to sessionStorage
  useEffect(() => {
    try {
      sessionStorage.setItem(STORAGE_KEY_CONFIG, JSON.stringify(config));
    } catch {
      // ignore
    }
  }, [config]);

  // Keep a ref to avoid stale closure or triggering interval resets
  const henrikConfigRef = useRef(config.henrik);
  useEffect(() => {
    henrikConfigRef.current = config.henrik;
  }, [config.henrik]);

  // -------------------------------------------------------------
  // HenrikDEV Live Data Fetcher
  // -------------------------------------------------------------
  const handleSyncLive = useCallback(async () => {
    const activeHenrik = henrikConfigRef.current;
    if (!activeHenrik.apiKey || !activeHenrik.apiKey.trim()) {
      setSyncStatus({
        success: false,
        message: 'Enter your HenrikDEV API Key in the HUD Console to fetch live stats.',
      });
      return;
    }

    setIsSyncing(true);
    try {
      const result = await fetchHenrikData(activeHenrik);

      if (!result.success) {
        setSyncStatus({
          success: false,
          message: result.error || 'Failed to fetch from HenrikDEV API',
          timestamp: Date.now(),
        });
        setIsSyncing(false);
        return;
      }

      // Check if a new match has arrived to trigger Victory / Defeat animation
      if (result.latestMatch) {
        const latestId = result.latestMatch.id;
        if (lastKnownMatchIdRef.current && lastKnownMatchIdRef.current !== latestId) {
          if (result.latestMatch.result === 'win') {
            setCelebrationType('victory');
          } else if (result.latestMatch.result === 'loss') {
            setCelebrationType('defeat');
          }
        }
        lastKnownMatchIdRef.current = latestId;
      }

      // Update overlay config with fetched live results
      setConfig((prev) => ({
        ...prev,
        currentRankId: result.rank.id,
        currentRR: typeof result.currentRR === 'number' ? result.currentRR : prev.currentRR,
        peakRank: typeof result.peakRank === 'string' ? result.peakRank : prev.peakRank,
        wins: typeof result.wins === 'number' ? result.wins : prev.wins,
        losses: typeof result.losses === 'number' ? result.losses : prev.losses,
        streakType: result.streakType,
        streakCount: result.streakCount,
        netRR: typeof result.netRR === 'number' ? result.netRR : prev.netRR,
        recentMatches: Array.isArray(result.recentMatches) ? result.recentMatches : prev.recentMatches,
      }));

      const cachedNotice = result.isCached ? ' (Cached data)' : '';
      setSyncStatus({
        success: true,
        message: `Synced ${result.rank.name} (${result.currentRR} RR) • ${result.wins}W-${result.losses}L${cachedNotice}`,
        timestamp: Date.now(),
      });
    } catch (e: any) {
      setSyncStatus({
        success: false,
        message: e?.message || 'Sync failed. Please check network connection.',
        timestamp: Date.now(),
      });
    } finally {
      setIsSyncing(false);
    }
  }, []);

  // Polling effect: only reset timer if autoSync or interval changes
  useEffect(() => {
    if (!config.henrik.autoSync || !config.henrik.apiKey || !config.henrik.apiKey.trim()) {
      return;
    }

    // Run first sync immediately
    handleSyncLive();

    const intervalSec = Math.max(20, config.henrik.syncIntervalSeconds || 30);
    const intervalId = setInterval(() => {
      handleSyncLive();
    }, intervalSec * 1000);

    return () => clearInterval(intervalId);
  }, [config.henrik.autoSync, Boolean(config.henrik.apiKey), config.henrik.syncIntervalSeconds, handleSyncLive]);

  // Keyboard shortcut: 'Escape' closes modals
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isInput =
        target &&
        (target.tagName === 'INPUT' ||
          target.tagName === 'SELECT' ||
          target.tagName === 'TEXTAREA' ||
          target.isContentEditable);

      if (isInput) {
        if (e.key === 'Escape') {
          setIsEnlargeOpen(false);
          setActiveModal(null);
        }
        return;
      }

      if (e.key === 'Escape') {
        setIsEnlargeOpen(false);
        setActiveModal(null);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Trigger automatic sync when loaded in OBS Browser Source mode with valid config
  useEffect(() => {
    if (isOverlayModeFromUrl && config.henrik.apiKey && config.henrik.apiKey.trim() && config.henrik.riotId) {
      // Run first sync immediately
      handleSyncLive();

      // Poll every 30 seconds inside OBS to keep stats live
      const intervalId = setInterval(() => {
        handleSyncLive();
      }, 30000);

      return () => clearInterval(intervalId);
    }
  }, [isOverlayModeFromUrl, handleSyncLive, config.henrik.apiKey, config.henrik.riotId]);

  // Compute OBS URL with all active configurations tokenized so OBS can fetch live stats dynamically
  const origin = typeof window !== 'undefined' ? window.location.origin : '';
  const obsUrl = (() => {
    const params = new URLSearchParams();
    params.set('overlay', 'true');
    params.set('theme', config.theme);
    params.set('opacity', String(config.opacity ?? config.overlayOpacity ?? 1));
    params.set('scale', String(config.scale ?? 1));
    params.set('glowIntensity', config.glowIntensity ?? 'high');
    params.set('backdropOpacity', String(config.backdropOpacity ?? 0.92));

    // Henrik credentials
    if (config.henrik.riotId) params.set('riotId', config.henrik.riotId);
    if (config.henrik.tag) params.set('tag', config.henrik.tag);
    if (config.henrik.region) params.set('region', config.henrik.region);
    if (config.henrik.apiKey) params.set('apiKey', config.henrik.apiKey);

    // Toggles
    if (config.toggles) {
      Object.entries(config.toggles).forEach(([key, val]) => {
        params.set(key, String(val));
      });
    }

    return `${origin}/?${params.toString()}`;
  })();

  // -------------------------------------------------------------
  // If loaded in OBS Browser Source mode: Render transparent overlay ONLY!
  // -------------------------------------------------------------
  if (isOverlayModeFromUrl) {
    return (
      <main
        id="obs-stream-overlay"
        className="fixed inset-0 w-screen h-screen bg-transparent overflow-hidden select-none p-0 m-0"
      >
        <div className="absolute top-0 left-0 p-4">
          <OverlayWidget
            config={config}
            isStandalone={true}
            celebrationType={celebrationType}
            onDismissCelebration={() => setCelebrationType(null)}
          />
        </div>
      </main>
    );
  }

  // -------------------------------------------------------------
  // Full Esports Webpage Layout
  // -------------------------------------------------------------
  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between valorant-combat-bg text-gray-100 font-sans selection:bg-cyan-500 selection:text-black overflow-x-hidden">
      {/* Top Esports Navigation Bar */}
      <header className="relative z-20 w-full bg-transparent flex-shrink-0">
        <div className="w-full px-5 sm:px-8 lg:px-12 h-16 sm:h-20 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center gap-3">
            <RankPulseLogo height={52} />
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-3">
            {config.henrik.autoSync && (
              <div className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-emerald-950/60 border border-emerald-500/40 text-emerald-300 text-xs font-mono">
                <Radio className="w-3.5 h-3.5 animate-pulse text-emerald-400" />
                <span>Live Syncing</span>
              </div>
            )}

            <button
              type="button"
              onClick={() => {
                navigator.clipboard.writeText(obsUrl);
                setTopBarCopied(true);
                setTimeout(() => setTopBarCopied(false), 2000);
              }}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-[#0e1422] hover:bg-[#141d30] border border-cyan-500/30 hover:border-cyan-400 text-xs font-mono text-cyan-300 transition-all cursor-pointer"
              title="Copy OBS Browser Source URL"
            >
              {topBarCopied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{topBarCopied ? 'Copied!' : 'Copy OBS URL'}</span>
            </button>
          </div>
        </div>
      </header>

      {/* Main Container */}
      <main className="relative z-10 w-full px-5 sm:px-8 lg:px-12 py-4 sm:py-6 flex-1 flex flex-col justify-start">
        <div className="grid grid-cols-1 xl:grid-cols-12 gap-7 lg:gap-10 items-start">
          {/* ========================================================= */}
          {/* LEFT COLUMN: Hero & Instruction Section */}
          {/* ========================================================= */}
          <section className="xl:col-span-5 lg:col-span-5 flex flex-col">
            {/* Live Studio Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-950/40 border border-cyan-500/40 text-cyan-400 text-xs font-mono font-bold tracking-wider uppercase shadow-[0_0_12px_rgba(0,210,255,0.2)] mb-3.5 self-start">
              <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse shadow-[0_0_8px_#00e5ff]" />
              LIVE HUD STUDIO
            </div>

            {/* Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-[46px] xl:text-[54px] font-black tracking-tight text-white uppercase leading-[1.02] font-sans mb-3">
              ELEVATE YOUR <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-sky-300 to-cyan-200 drop-shadow-[0_0_24px_rgba(0,210,255,0.4)]">
                BROADCAST.
              </span>
            </h1>

            {/* Subtitle */}
            <p className="text-gray-300 text-sm sm:text-base leading-relaxed max-w-xl mb-6 font-sans">
              A zero-latency, highly customizable Valorant MMR tracker for modern creators. Generate a secure, database-free overlay in seconds.
            </p>

            {/* Instruction Stepper */}
            <div>
              <InstructionStepper />
            </div>
          </section>

          {/* ========================================================= */}
          {/* RIGHT COLUMN: HUD Console */}
          {/* ========================================================= */}
          <section className="xl:col-span-7 lg:col-span-7">
            <HudConsole
              config={config}
              onChange={setConfig}
              onSync={handleSyncLive}
              isSyncing={isSyncing}
              syncStatus={syncStatus}
              obsUrl={obsUrl}
              onOpenEnlarge={() => setIsEnlargeOpen(true)}
              celebrationType={celebrationType}
              onDismissCelebration={() => setCelebrationType(null)}
              onTestCelebration={(type) => setCelebrationType(type)}
            />
          </section>
        </div>
      </main>

      {/* Persistent Bottom Footer */}
      <footer className="relative z-10 w-full px-5 sm:px-8 lg:px-12 py-3.5 border-t border-white/10 flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-xs bg-[#06080d]/90 backdrop-blur-md mt-auto flex-shrink-0">
        <div className="flex flex-wrap items-center gap-x-3.5 gap-y-1">
          <a
            href="https://www.youtube.com/@thealphauniq"
            target="_blank"
            rel="noreferrer"
            className="text-gray-400 hover:text-white font-bold tracking-wider uppercase transition-colors"
          >
            BY THE ALPHA UNIQ
          </a>
          <span className="text-gray-600 font-bold">•</span>
          <button
            type="button"
            onClick={() => setActiveModal('faq')}
            className="text-gray-400 hover:text-white font-bold tracking-wider uppercase transition-colors cursor-pointer"
          >
            FAQ
          </button>
          <span className="text-gray-600 font-bold">•</span>
          <button
            type="button"
            onClick={() => setActiveModal('privacy')}
            className="text-gray-400 hover:text-white font-bold tracking-wider uppercase transition-colors cursor-pointer"
          >
            PRIVACY POLICY
          </button>
          <span className="text-gray-600 font-bold">•</span>
          <button
            type="button"
            onClick={() => setActiveModal('terms')}
            className="text-gray-400 hover:text-white font-bold tracking-wider uppercase transition-colors cursor-pointer"
          >
            TERMS & CONDITIONS
          </button>
        </div>

        <a
          href="https://www.buymeasnack.in/u/the-alpha-uniq"
          target="_blank"
          rel="noreferrer"
          className="group relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-amber-500/15 via-orange-500/20 to-amber-500/15 hover:from-amber-500/25 hover:to-orange-500/25 border border-amber-500/40 hover:border-amber-400 text-amber-300 font-mono tracking-wider shadow-[0_0_15px_rgba(245,158,11,0.2)] hover:shadow-[0_0_24px_rgba(245,158,11,0.4)] transition-all hover:scale-105 active:scale-95 cursor-pointer"
        >
          <span className="relative z-10 transition-transform group-hover:rotate-12 duration-200">
            <SamosaIcon className="w-4 h-4" />
          </span>
          <span className="relative z-10 font-bold text-amber-200 group-hover:text-amber-100 uppercase text-xs tracking-wider">
            BUY ME A SAMOSA
          </span>
        </a>
      </footer>

      {/* Enlarged Live Stage Preview Modal */}
      <EnlargePreviewModal
        isOpen={isEnlargeOpen}
        onClose={() => setIsEnlargeOpen(false)}
        config={config}
        celebrationType={celebrationType}
        onDismissCelebration={() => setCelebrationType(null)}
      />

      {/* Info Modals (FAQ, Privacy, Terms) */}
      <InfoModal
        isOpen={activeModal !== null}
        onClose={() => setActiveModal(null)}
        type={activeModal}
      />
    </div>
  );
}
