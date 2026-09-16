import React, { useState, useRef, useLayoutEffect } from 'react';
import {
  Eye,
  EyeOff,
  Maximize2,
  Copy,
  Check,
  RefreshCw,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Sword,
  Shield,
} from 'lucide-react';
import { OverlayConfig, OverlayTheme } from '../types';
import { OverlayWidget } from './OverlayWidget';

interface HudConsoleProps {
  config: OverlayConfig;
  onChange: (updater: (prev: OverlayConfig) => OverlayConfig) => void;
  onSync: () => Promise<void>;
  isSyncing: boolean;
  syncStatus: { success: boolean; message: string; timestamp?: number } | null;
  obsUrl: string;
  onOpenEnlarge: () => void;
  celebrationType?: 'victory' | 'defeat' | null;
  onDismissCelebration?: () => void;
  onTestCelebration?: (type: 'victory' | 'defeat') => void;
}

const THEME_OPTIONS: { id: OverlayTheme; label: string }[] = [
  { id: 'vct', label: 'Champions' },
  { id: 'vct_2021', label: 'VCT 2021' },
  { id: 'radiant_glass', label: 'Radiant Glass' },
  { id: 'compact_pill', label: 'Compact Pill' },
  { id: 'esports_hud', label: 'Esports HUD' },
  { id: 'minimal_neon', label: 'Minimal Neon' },
  { id: 'vertical_card', label: 'Vertical Card' },
];

export const HudConsole: React.FC<HudConsoleProps> = ({
  config,
  onChange,
  onSync,
  isSyncing,
  syncStatus,
  obsUrl,
  onOpenEnlarge,
  celebrationType,
  onDismissCelebration,
  onTestCelebration,
}) => {
  const [showKey, setShowKey] = useState(false);
  const [copied, setCopied] = useState(false);

  // Responsive scaling for live preview to eliminate scrollbars on wide themes
  const previewContainerRef = useRef<HTMLDivElement>(null);
  const widgetWrapperRef = useRef<HTMLDivElement>(null);
  const [previewScale, setPreviewScale] = useState(1);

  useLayoutEffect(() => {
    const updateScale = () => {
      const container = previewContainerRef.current;
      const widget = widgetWrapperRef.current;
      if (!container || !widget) return;

      const availableWidth = container.clientWidth - 32;
      const contentWidth = widget.scrollWidth;

      if (contentWidth > availableWidth && availableWidth > 0) {
        const calculated = Math.max(0.55, availableWidth / contentWidth);
        setPreviewScale(calculated);
      } else {
        setPreviewScale(1);
      }
    };

    updateScale();
    const ro = new ResizeObserver(updateScale);
    if (previewContainerRef.current) {
      ro.observe(previewContainerRef.current);
    }
    return () => ro.disconnect();
  }, [config.theme, config.scale, config.henrik.lastMatchesCount, config.toggles, config.currentRankId, config.currentRR]);

  const handleCopyObsUrl = () => {
    navigator.clipboard.writeText(obsUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2200);
  };

  const handleLastMatchesChange = (count: number) => {
    const validCount = Math.min(5, Math.max(1, count));
    onChange((prev) => {
      const netRR = (prev.recentMatches || [])
        .slice(0, validCount)
        .reduce((acc, m) => acc + (m.rrChange || 0), 0);

      return {
        ...prev,
        henrik: {
          ...prev.henrik,
          lastMatchesCount: validCount,
        },
        netRR,
      };
    });
  };

  const updateToggle = (key: keyof typeof config.toggles, value: boolean) => {
    onChange((prev) => ({
      ...prev,
      toggles: {
        ...prev.toggles,
        [key]: value,
      },
    }));
  };

  return (
    <div className="w-full bg-[#0b0e14]/95 border border-white/10 rounded-2xl sm:rounded-3xl p-5 sm:p-7 shadow-2xl backdrop-blur-2xl">
      {/* Header: >_ HUD Console */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 mb-4 border-b border-white/10">
        <div className="flex items-center gap-2.5">
          <span className="text-cyan-400 font-mono text-xl font-black">&gt;_</span>
          <h2 className="text-white font-extrabold text-xl sm:text-2xl tracking-wide font-sans">
            HUD Console
          </h2>
        </div>

        {syncStatus && (
          <div
            className={`flex items-start sm:items-center gap-2.5 px-3 py-1.5 rounded-xl text-xs font-mono border max-w-full sm:max-w-[450px] md:max-w-[550px] ${
              syncStatus.success
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-amber-950/60 border-amber-500/40 text-amber-300'
            }`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                syncStatus.success ? 'bg-emerald-400' : 'bg-amber-400'
              } animate-pulse mt-1.5 sm:mt-0 flex-shrink-0`}
            />
            <span className="break-words leading-relaxed">{syncStatus.message}</span>
          </div>
        )}
      </div>

      {/* Balanced Two-Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-7 items-start">
        {/* ========================================================= */}
        {/* LEFT COLUMN: CREDENTIALS & PRESENTATION (Stacked Vertically) */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 space-y-5">
          {/* CREDENTIALS SECTION (Stacked Inputs One Below The Other) */}
          <div>
            <div className="flex items-center justify-between pb-2 mb-3 border-b border-white/10">
              <span className="text-xs sm:text-sm font-mono font-bold tracking-widest text-cyan-400 uppercase">
                Credentials
              </span>
              <a
                href="https://api.henrikdev.xyz/dashboard/"
                target="_blank"
                rel="noreferrer"
                className="inline-flex items-center gap-1.5 text-xs font-mono text-gray-300 hover:text-cyan-400 transition-colors font-semibold"
                title="Get HenrikDev API Key"
              >
                <span>Get API Key</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            <div className="space-y-2.5">
              {/* 1. HenrikDev Key */}
              <div>
                <label className="block text-xs font-mono font-semibold text-gray-300 uppercase mb-1.5">
                  HenrikDev Key
                </label>
                <div className="relative flex items-center">
                  <input
                    type={showKey ? 'text' : 'password'}
                    value={config.henrik.apiKey || ''}
                    onChange={(e) =>
                      onChange((prev) => ({
                        ...prev,
                        henrik: { ...prev.henrik, apiKey: e.target.value },
                      }))
                    }
                    placeholder="HDEV-..."
                    className="w-full bg-[#06080d] border border-white/10 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-mono tracking-wider pr-10 transition-colors"
                  />
                  <button
                    type="button"
                    onClick={() => setShowKey(!showKey)}
                    className="absolute right-3 text-gray-400 hover:text-gray-200 transition-colors cursor-pointer"
                    title={showKey ? 'Hide Key' : 'Show Key'}
                  >
                    {showKey ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* 2. Region */}
              <div>
                <label className="block text-xs font-mono font-semibold text-gray-300 uppercase mb-1.5">
                  Region
                </label>
                <select
                  value={config.henrik.region || 'ap'}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      henrik: { ...prev.henrik, region: e.target.value as any },
                    }))
                  }
                  className="w-full bg-[#06080d] border border-white/10 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 font-mono transition-colors cursor-pointer"
                >
                  <option value="ap">Asia Pacific</option>
                  <option value="na">North America</option>
                  <option value="eu">Europe</option>
                  <option value="kr">Korea</option>
                  <option value="latam">Latin America</option>
                  <option value="br">Brazil</option>
                </select>
              </div>

              {/* 3. Platform */}
              <div>
                <label className="block text-xs font-mono font-semibold text-gray-300 uppercase mb-1.5">
                  Platform
                </label>
                <div className="w-full bg-[#06080d] border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white font-mono flex items-center justify-between">
                  <span>PC</span>
                  <span className="w-2.5 h-2.5 rounded-full bg-cyan-400 shadow-[0_0_8px_#00e5ff]" />
                </div>
              </div>

              {/* 4. Riot ID */}
              <div>
                <label className="block text-xs font-mono font-semibold text-gray-300 uppercase mb-1.5">
                  Riot ID
                </label>
                <input
                  type="text"
                  value={config.henrik.riotId || ''}
                  onChange={(e) => {
                    const val = e.target.value;
                    onChange((prev) => ({
                      ...prev,
                      playerName: val,
                      henrik: { ...prev.henrik, riotId: val },
                    }));
                  }}
                  placeholder="Player"
                  className="w-full bg-[#06080d] border border-white/10 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-mono transition-colors"
                />
              </div>

              {/* 5. Tag */}
              <div>
                <label className="block text-xs font-mono font-semibold text-gray-300 uppercase mb-1.5">
                  Tag
                </label>
                <input
                  type="text"
                  value={config.henrik.tag ? `#${config.henrik.tag.replace(/^#/, '')}` : ''}
                  onChange={(e) => {
                    const val = e.target.value.replace(/^#/, '');
                    onChange((prev) => ({
                      ...prev,
                      playerTag: val,
                      henrik: { ...prev.henrik, tag: val },
                    }));
                  }}
                  placeholder="#TAG"
                  className="w-full bg-[#06080d] border border-white/10 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-sm text-white placeholder-gray-600 focus:outline-none focus:ring-1 focus:ring-cyan-400 font-mono transition-colors"
                />
              </div>
            </div>
          </div>

          {/* PRESENTATION SECTION (Below Credentials with clear, legible controls) */}
          <div>
            <div className="pb-2 mb-3 border-b border-white/10">
              <span className="text-xs sm:text-sm font-mono font-bold tracking-widest text-cyan-400 uppercase">
                Presentation
              </span>
            </div>

            <div className="space-y-3">
              {/* History Matches & Update Rate */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-mono font-semibold text-gray-300 uppercase mb-1.5">
                    History Matches
                  </label>
                  <select
                    value={config.henrik.lastMatchesCount || 3}
                    onChange={(e) => handleLastMatchesChange(Number(e.target.value))}
                    className="w-full bg-[#06080d] border border-white/10 rounded-xl px-3 py-2 text-xs sm:text-sm text-white font-mono transition-colors focus:border-cyan-400 focus:outline-none focus:ring-1 focus:ring-cyan-400 cursor-pointer"
                  >
                    <option value={1}>1 Match</option>
                    <option value={2}>2 Matches</option>
                    <option value={3}>3 Matches</option>
                    <option value={4} disabled={config.theme === 'compact_pill'}>4 Matches {config.theme === 'compact_pill' ? '(Pill max 3)' : ''}</option>
                    <option value={5} disabled={config.theme === 'compact_pill'}>5 Matches {config.theme === 'compact_pill' ? '(Pill max 3)' : ''}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-semibold text-gray-300 uppercase mb-1.5">
                    Update Rate
                  </label>
                  <select
                    value={config.henrik.autoSync ? config.henrik.syncIntervalSeconds || 30 : 0}
                    onChange={(e) => {
                      const val = Number(e.target.value);
                      onChange((prev) => ({
                        ...prev,
                        henrik: {
                          ...prev.henrik,
                          autoSync: val > 0,
                          syncIntervalSeconds: val > 0 ? val : 30,
                        },
                      }));
                    }}
                    className="w-full bg-[#06080d] border border-white/10 focus:border-cyan-400 rounded-xl px-3 py-2 text-xs sm:text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 font-mono transition-colors cursor-pointer"
                  >
                    <option value={15}>15 Seconds</option>
                    <option value={30}>30 Seconds</option>
                    <option value={60}>60 Seconds</option>
                    <option value={0}>Manual Only</option>
                  </select>
                </div>
              </div>

              {/* All 6 Feature Toggles in 2-Column Grid of Modern Capsules */}
              <div className="grid grid-cols-2 gap-2 pt-0.5">
                {[
                  { key: 'showPlayerName', label: 'Player Name' },
                  { key: 'showRankIcon', label: 'Rank Emblem' },
                  { key: 'showTotalRR', label: 'Total RR' },
                  { key: 'showLastMatches', label: 'Last Matches' },
                  { key: 'showWinLoss', label: 'Win / Loss' },
                  { key: 'showWinStreak', label: 'Win Streak' },
                  { key: 'showNetRR', label: 'Net RR' },
                ].map(({ key, label }) => {
                  const isCompactPill = config.theme === 'compact_pill';
                  const isWinLossDisabled = isCompactPill && key === 'showWinLoss';
                  const isActive = isWinLossDisabled ? false : config.toggles[key as keyof typeof config.toggles];
                  return (
                    <button
                      key={key}
                      type="button"
                      disabled={isWinLossDisabled}
                      onClick={() => !isWinLossDisabled && updateToggle(key as any, !isActive)}
                      className={`group relative flex items-center justify-between px-3 py-2 sm:py-2.5 rounded-xl border transition-all text-left ${
                        isWinLossDisabled
                          ? 'opacity-40 cursor-not-allowed bg-gray-900 border-white/5'
                          : isActive
                          ? 'bg-gradient-to-r from-cyan-950/40 to-[#06080d] border-cyan-500/40 shadow-[0_0_12px_rgba(0,210,255,0.14)] cursor-pointer'
                          : 'bg-[#06080d] border-white/10 hover:border-white/20 cursor-pointer'
                      }`}
                    >
                      <span
                        className={`text-xs font-mono font-bold tracking-wider uppercase truncate pr-1.5 transition-colors ${
                          isWinLossDisabled
                            ? 'text-gray-600'
                            : isActive
                            ? 'text-cyan-300'
                            : 'text-gray-400 group-hover:text-gray-300'
                        }`}
                      >
                        {label} {isWinLossDisabled ? '(Locked)' : ''}
                      </span>
                      <div
                        className={`relative inline-flex h-5 w-9 shrink-0 items-center rounded-full p-0.5 transition-colors ${
                          isWinLossDisabled
                            ? 'bg-gray-900'
                            : isActive
                            ? 'bg-cyan-400 shadow-[0_0_8px_rgba(0,210,255,0.7)]'
                            : 'bg-gray-800'
                        }`}
                      >
                        <span
                          className={`inline-block h-3.5 w-3.5 transform rounded-full bg-white transition-transform ${
                            isActive && !isWinLossDisabled ? 'translate-x-4' : 'translate-x-0'
                          }`}
                        />
                      </div>
                    </button>
                  );
                })}
              </div>

              {/* Slider 1: HUD Transparency */}
              <div className="pt-1.5">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono font-bold text-gray-300 uppercase">
                    HUD Transparency
                  </label>
                  <span className="text-xs sm:text-sm font-mono font-bold text-cyan-300">
                    {Math.round(config.opacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.1"
                  max="1.0"
                  step="0.02"
                  value={config.opacity}
                  style={{
                    '--slider-progress': `${((config.opacity - 0.1) / (1.0 - 0.1)) * 100}%`,
                  } as any}
                  onChange={(e) => {
                    const val = parseFloat(e.target.value);
                    onChange((prev) => ({
                      ...prev,
                      opacity: val,
                      overlayOpacity: val,
                    }));
                  }}
                  className="w-full accent-cyan-400 bg-gray-800 h-2 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Slider 2: Background Darkness (Backdrop Opacity) */}
              <div>
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-mono font-bold text-gray-300 uppercase">
                    Backdrop Darkness
                  </label>
                  <span className="text-xs sm:text-sm font-mono font-bold text-cyan-300">
                    {Math.round(config.backdropOpacity * 100)}%
                  </span>
                </div>
                <input
                  type="range"
                  min="0.0"
                  max="1.0"
                  step="0.05"
                  value={config.backdropOpacity}
                  style={{ '--slider-progress': `${config.backdropOpacity * 100}%` } as any}
                  onChange={(e) =>
                    onChange((prev) => ({
                      ...prev,
                      backdropOpacity: parseFloat(e.target.value),
                    }))
                  }
                  className="w-full accent-cyan-400 bg-gray-800 h-2 rounded-lg appearance-none cursor-pointer"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: LIVE PREVIEW & CONTROLS */}
        {/* ========================================================= */}
        <div className="lg:col-span-6 space-y-4">
          {/* LIVE PREVIEW HEADER */}
          <div>
            <div className="pb-2 mb-3 border-b border-white/10 flex items-center justify-between">
              <span className="text-xs sm:text-sm font-mono font-bold tracking-widest text-cyan-400 uppercase">
                Live Preview
              </span>
            </div>

            {/* PREVIEW FRAME WITH MODERN ENLARGE CAPSULE IN TOP RIGHT */}
            <div
              ref={previewContainerRef}
              className="relative w-full min-h-[220px] sm:min-h-[250px] bg-[#06080d] border border-white/10 rounded-2xl overflow-hidden flex items-center justify-center p-4 sm:p-6"
            >
              {/* Subtle Grid backdrop */}
              <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:12px_12px] opacity-40 pointer-events-none" />

              {/* Modern ENLARGE Capsule Button in Top Right */}
              <button
                type="button"
                onClick={onOpenEnlarge}
                className="absolute top-3 right-3 z-20 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/80 hover:bg-black border border-white/20 hover:border-cyan-400 text-xs font-mono font-bold text-white uppercase tracking-wider transition-all cursor-pointer shadow-lg backdrop-blur-md hover:scale-105 active:scale-95"
              >
                <Maximize2 className="w-3.5 h-3.5 text-cyan-400" />
                <span>Enlarge</span>
              </button>

              {/* Centered Overlay Widget */}
              <div
                ref={widgetWrapperRef}
                className="relative z-10 flex justify-center transition-transform duration-200"
                style={{
                  transform: previewScale < 1 ? `scale(${previewScale})` : undefined,
                  transformOrigin: 'center center',
                }}
              >
                <OverlayWidget
                  config={config}
                  isStandalone={false}
                  celebrationType={celebrationType}
                  onDismissCelebration={onDismissCelebration}
                />
              </div>
            </div>
          </div>

          {/* THEME PRESET DROPDOWN & WIDGET SCALE SLIDER */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {/* Theme Preset Dropdown */}
            <div>
              <label className="block text-xs font-mono font-bold text-gray-300 uppercase mb-1.5">
                Theme Preset
              </label>
              <select
                value={config.theme}
                onChange={(e) => {
                  const newTheme = e.target.value as any;
                  onChange((prev) => {
                    let lastMatchesCount = prev.henrik.lastMatchesCount;
                    let netRR = prev.netRR;
                    if (newTheme === 'compact_pill' && lastMatchesCount > 3) {
                      lastMatchesCount = 3;
                      netRR = (prev.recentMatches || [])
                        .slice(0, 3)
                        .reduce((acc, m) => acc + (m.rrChange || 0), 0);
                    }

                    return {
                      ...prev,
                      theme: newTheme,
                      henrik: {
                        ...prev.henrik,
                        lastMatchesCount,
                      },
                      netRR,
                      toggles: newTheme === 'compact_pill' ? {
                        ...prev.toggles,
                        showWinLoss: false,
                        showWinRate: false,
                        showWinStreak: false,
                      } : prev.toggles,
                    };
                  });
                }}
                className="w-full bg-[#06080d] border border-white/10 focus:border-cyan-400 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:ring-1 focus:ring-cyan-400 font-mono transition-colors cursor-pointer"
              >
                {THEME_OPTIONS.map((theme) => (
                  <option key={theme.id} value={theme.id}>
                    {theme.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Slider 3: Widget Scale Slider */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-xs font-mono font-bold text-gray-300 uppercase">
                  Widget Scale
                </label>
                <span className="text-xs sm:text-sm font-mono font-bold text-cyan-300">
                  {Math.round(config.scale * 100)}%
                </span>
              </div>
              <input
                type="range"
                min="0.6"
                max="1.25"
                step="0.05"
                value={config.scale}
                style={{
                  '--slider-progress': `${((config.scale - 0.6) / (1.25 - 0.6)) * 100}%`,
                } as any}
                onChange={(e) =>
                  onChange((prev) => ({
                    ...prev,
                    scale: parseFloat(e.target.value),
                  }))
                }
                className="w-full accent-cyan-400 bg-gray-800 h-2 rounded-lg appearance-none cursor-pointer mt-1"
              />
            </div>
          </div>


          {/* SYNC LIVE STATS & UPDATE LINK BUTTON */}
          <button
            type="button"
            onClick={onSync}
            disabled={isSyncing}
            className="w-full relative flex items-center justify-center gap-2 py-3 px-6 rounded-xl bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 hover:from-cyan-300 hover:to-blue-400 text-black font-black font-sans uppercase tracking-wider text-xs sm:text-sm shadow-[0_0_24px_rgba(0,210,255,0.4)] hover:shadow-[0_0_32px_rgba(0,210,255,0.6)] transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
          >
            <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
            <span>{isSyncing ? 'Fetching Live MMR...' : 'Sync Live Stats & Update Link'}</span>
          </button>

          {/* OBS BROWSER SOURCE BAR WITH MODERN COPY CAPSULE */}
          <div className="relative flex items-center bg-[#06080d] border border-white/10 rounded-xl px-4 py-2.5">
            <input
              type="text"
              readOnly
              value={obsUrl}
              placeholder="Connect to generate secure URL..."
              className="w-full bg-transparent text-xs sm:text-sm font-mono text-gray-300 select-all pr-24 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleCopyObsUrl}
              className={`absolute right-1.5 px-3.5 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider transition-all flex items-center gap-1.5 cursor-pointer ${
                copied
                  ? 'bg-emerald-500 text-black shadow-[0_0_10px_rgba(16,185,129,0.5)]'
                  : 'bg-white/10 hover:bg-white/20 text-white border border-white/15 hover:border-cyan-400'
              }`}
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5" />
                  <span>Copied</span>
                </>
              ) : (
                <span>COPY</span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
