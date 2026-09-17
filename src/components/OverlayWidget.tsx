import React from 'react';
import { motion } from 'motion/react';
import { OverlayConfig, DEFAULT_RECENT_MATCHES } from '../types';
import { getRankById } from '../data/ranks';
import { RankBadge } from './RankBadge';
import { BouncingBackgroundRank } from './BouncingBackgroundRank';
import { computeRankRR } from '../utils/rankCalculations';
import { Flame, Snowflake, TrendingUp, TrendingDown, Zap, Sparkles } from 'lucide-react';
import { OverlayCelebration } from './OverlayCelebration';

interface Shard {
  x: number;
  y: number;
  size: number;
  vx: number;
  vy: number;
  angle: number;
  vAngle: number;
  opacity: number;
  pulseSpeed: number;
  points: { dx: number; dy: number }[];
  color: string;
}

const Vct2021ShardBackground: React.FC = () => {
  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = canvas.offsetWidth || 340;
    let height = canvas.offsetHeight || 160;
    canvas.width = width;
    canvas.height = height;

    const resizeObserver = new ResizeObserver((entries) => {
      for (let entry of entries) {
        width = Math.max(10, entry.contentRect.width);
        height = Math.max(10, entry.contentRect.height);
        canvas.width = width;
        canvas.height = height;
      }
    });

    if (canvas.parentElement) {
      resizeObserver.observe(canvas.parentElement);
    }

    const shards: Shard[] = [];
    const colors = ['#ffd700', '#d4af37', '#f3e5ab', '#b8860b', '#aa7c11', '#e6c229'];

    for (let i = 0; i < 28; i++) {
      const size = Math.random() * 7 + 3;
      const numPoints = Math.floor(Math.random() * 3) + 3; // 3 to 5 points
      const points = [];
      for (let p = 0; p < numPoints; p++) {
        const pAngle = (p / numPoints) * Math.PI * 2 + (Math.random() - 0.5) * 0.4;
        const radius = size * (0.6 + Math.random() * 0.6);
        points.push({
          dx: Math.cos(pAngle) * radius,
          dy: Math.sin(pAngle) * radius,
        });
      }

      shards.push({
        x: Math.random() * width,
        y: Math.random() * height,
        size,
        vx: (Math.random() - 0.5) * 0.3,
        vy: -(Math.random() * 0.5 + 0.15), // drifting upward
        angle: Math.random() * Math.PI * 2,
        vAngle: (Math.random() - 0.5) * 0.02,
        opacity: Math.random() * 0.3 + 0.65, // More solid, less transparent starting point
        pulseSpeed: (Math.random() * 0.008 + 0.002) * (Math.random() > 0.5 ? 1 : -1),
        points,
        color: colors[Math.floor(Math.random() * colors.length)],
      });
    }

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Draw subtle gold dust trail lines to simulate Champions artwork
      ctx.strokeStyle = 'rgba(212, 175, 55, 0.04)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(0, height * 0.8);
      ctx.lineTo(width * 0.3, height * 0.2);
      ctx.lineTo(width * 0.7, height * 0.9);
      ctx.lineTo(width, height * 0.1);
      ctx.stroke();

      shards.forEach((s) => {
        s.x += s.vx;
        s.y += s.vy;
        s.angle += s.vAngle;
        s.opacity += s.pulseSpeed;

        if (s.opacity > 0.95 || s.opacity < 0.45) {
          s.pulseSpeed = -s.pulseSpeed;
        }
        s.opacity = Math.max(0.4, Math.min(0.98, s.opacity));

        if (s.y < -20) {
          s.y = height + 20;
          s.x = Math.random() * width;
        }
        if (s.x < -20) s.x = width + 20;
        if (s.x > width + 20) s.x = -20;

        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.angle);
        ctx.globalAlpha = s.opacity;

        ctx.shadowBlur = 3;
        ctx.shadowColor = s.color;

        ctx.fillStyle = s.color;
        ctx.beginPath();
        if (s.points.length > 0) {
          ctx.moveTo(s.points[0].dx, s.points[0].dy);
          for (let p = 1; p < s.points.length; p++) {
            ctx.lineTo(s.points[p].dx, s.points[p].dy);
          }
        }
        ctx.closePath();
        ctx.fill();

        ctx.strokeStyle = '#ffffff';
        ctx.globalAlpha = s.opacity * 0.35;
        ctx.lineWidth = 0.5;
        ctx.stroke();

        ctx.restore();
      });

      animId = requestAnimationFrame(render);
    };

    render();

    return () => {
      cancelAnimationFrame(animId);
      resizeObserver.disconnect();
    };
  }, []);

  return <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none z-0" />;
};

interface OverlayWidgetProps {
  config: OverlayConfig;
  isStandalone?: boolean;
  celebrationType?: 'victory' | 'defeat' | null;
  onDismissCelebration?: () => void;
}

export const OverlayWidget: React.FC<OverlayWidgetProps> = ({
  config,
  isStandalone = false,
  celebrationType = null,
  onDismissCelebration,
}) => {
  const rank = getRankById(config.currentRankId);
  const rrInfo = computeRankRR(config.currentRankId, config.currentRR);
  const isImmortalOrRadiant = rrInfo.isImmortalOrRadiant;

  const displayedRR = rrInfo.totalRR;
  const rrPercentage = rrInfo.progressPercentage;

  // Configurable Wins & Losses
  const wins = config.wins;
  const losses = config.losses;
  const totalGames = wins + losses;

  // Configurable Win Rate / Percentage
  const calculatedWinRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;
  const winRate =
    config.autoCalculateWinRate !== false
      ? calculatedWinRate
      : (config.customWinRate ?? calculatedWinRate);

  // Glow Styling (Removed outer glow per user request)
  const glowStyle = 'none';

  // Backdrop container alpha
  const backdropAlpha = config.backdropOpacity ?? 0.92;
  const cardBgColor = `rgba(12, 16, 23, ${backdropAlpha})`;

  // Toggles shortcuts
  const isUnranked = rank.id === 'unranked';

  const {
    showRankIcon = true,
    showPlayerName = true,
    showTotalRR: rawTotalRR = true,
    showWinStreak: rawWinStreak = true,
    showWinLoss: rawWinLoss = true,
    showWinRate: rawWinRate = true,
    showNetRR: rawNetRR = true,
    showLastMatches: rawLastMatches = true,
    showAnimatedRankBackground = true,
  } = config.toggles || {};

  const showTotalRR = !isUnranked && rawTotalRR;
  const showWinStreak = !isUnranked && rawWinStreak;
  const showWinLoss = !isUnranked && rawWinLoss;
  const showWinRate = !isUnranked && rawWinRate;
  const showNetRR = !isUnranked && rawNetRR;
  const showLastMatches = !isUnranked && rawLastMatches;

  // -------------------------------------------------------------
  // Configurable Recent Matches (Last 1-5 Matches)
  // -------------------------------------------------------------
  const renderRecentMatches = (options?: { compact?: boolean; vertical?: boolean }) => {
    if (!showLastMatches) return null;

    const isCompactPill = config.theme === 'compact_pill';
    const maxAllowed = isCompactPill ? 3 : 5;
    const count = Math.min(maxAllowed, Math.max(1, config.henrik?.lastMatchesCount || maxAllowed));
    const hasConfiguredApi = Boolean(config.henrik?.apiKey && config.henrik.apiKey.trim());
    const matches = (
      config.recentMatches && config.recentMatches.length > 0
        ? config.recentMatches
        : hasConfiguredApi
        ? []
        : DEFAULT_RECENT_MATCHES
    ).slice(0, count);

    if (matches.length === 0) {
      if (hasConfiguredApi) {
        return (
          <span className="text-[10px] text-gray-500 font-mono italic">
            No matches
          </span>
        );
      }
      return null;
    }

    const matchLabel = matches.length === 1 ? 'Last Match:' : `Last ${matches.length}:`;

    // Vertical card layout: Stack label above and wrap badges cleanly in the center
    if (options?.vertical) {
      return (
        <div className="flex flex-col items-center w-full gap-1.5 font-mono select-none">
          <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold text-center">
            {matchLabel}
          </span>
          <div className="flex items-center justify-center flex-wrap gap-1 w-full max-w-full">
            {matches.map((m, idx) => {
              const isWin = m.result === 'win';
              const isLoss = m.result === 'loss';
              const sign = m.rrChange > 0 ? '+' : '';

              return (
                <div
                  key={m.id || idx}
                  title={`${m.map ? m.map + ' • ' : ''}${m.result.toUpperCase()} (${sign}${m.rrChange} RR)`}
                  className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold transition-transform hover:scale-105 shrink-0 ${
                    isWin
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_6px_rgba(16,185,129,0.2)]'
                      : isLoss
                      ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-[0_0_6px_rgba(244,63,94,0.2)]'
                      : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                  }`}
                >
                  <span>{isWin ? 'W' : isLoss ? 'L' : 'D'}</span>
                  <span className="opacity-90">
                    {sign}{m.rrChange}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      );
    }

    return (
      <div
        className={`flex items-center ${
          options?.compact ? 'gap-1' : 'justify-between w-full gap-2'
        } font-mono select-none`}
      >
        {!options?.compact && (
          <span className="text-[9px] uppercase tracking-wider text-gray-400 font-bold whitespace-nowrap">
            {matchLabel}
          </span>
        )}
        <div className={`flex items-center gap-1 ${options?.compact ? '' : 'flex-wrap justify-end'}`}>
          {matches.map((m, idx) => {
            const isWin = m.result === 'win';
            const isLoss = m.result === 'loss';
            const sign = m.rrChange > 0 ? '+' : '';

            return (
              <div
                key={m.id || idx}
                title={`${m.map ? m.map + ' • ' : ''}${m.result.toUpperCase()} (${sign}${m.rrChange} RR)`}
                className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-mono font-bold transition-transform hover:scale-105 ${
                  isWin
                    ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 shadow-[0_0_6px_rgba(16,185,129,0.2)]'
                    : isLoss
                    ? 'bg-rose-500/20 text-rose-300 border border-rose-500/40 shadow-[0_0_6px_rgba(244,63,94,0.2)]'
                    : 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
                }`}
              >
                <span>{isWin ? 'W' : isLoss ? 'L' : 'D'}</span>
                <span className="opacity-90">
                  {sign}{m.rrChange}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    );
  };

  // -------------------------------------------------------------
  // In-HUD Match Victory / Defeat Celebration Banner
  // -------------------------------------------------------------
  const renderCelebrationOverlay = () => {
    if (!celebrationType) return null;
    return (
      <OverlayCelebration
        type={celebrationType}
        rank={rank}
        theme={config.theme}
        onDismiss={() => onDismissCelebration?.()}
      />
    );
  };

  // -------------------------------------------------------------
  // Minimal Corner Watermark Rank Icon (Subtle Floating Oscillation, No Zoom)
  // -------------------------------------------------------------
  const renderAnimatedBackgroundRank = () => {
    if (!showAnimatedRankBackground) return null;

    return (
      <BouncingBackgroundRank
        iconUrl={rank.iconUrl}
        color={rank.color}
        show={showAnimatedRankBackground}
      />
    );
  };

  // -------------------------------------------------------------
  // Configurable Streak Badge
  // -------------------------------------------------------------
  const renderStreak = () => {
    if (!showWinStreak || config.streakType === 'none') return null;

    if (config.streakType === 'custom' && config.customStreakText) {
      return (
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40">
          <Zap className="w-3 h-3 text-amber-400" />
          <span>{config.customStreakText}</span>
        </div>
      );
    }

    const isWin = config.streakType === 'win';
    const isLoss = config.streakType === 'loss';
    const count = config.streakCount || 1;

    if (!isWin && !isLoss) return null;

    return (
      <div
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold tracking-wider uppercase font-mono ${
          isWin
            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.25)]'
            : 'bg-blue-500/20 text-blue-300 border border-blue-500/40 shadow-[0_0_10px_rgba(59,130,246,0.25)]'
        }`}
      >
        {isWin ? (
          <Flame className="w-3 h-3 text-amber-400 fill-amber-400 animate-pulse" />
        ) : (
          <Snowflake className="w-3 h-3 text-blue-400" />
        )}
        <span>
          {count} {isWin ? 'WIN' : 'LOSS'} STREAK
        </span>
      </div>
    );
  };

  // -------------------------------------------------------------
  // Configurable Net RR Tag (Dynamically syncs with displayed matches)
  // -------------------------------------------------------------
  const renderNetRR = () => {
    if (!showNetRR) return null;

    const count = Math.min(5, Math.max(1, config.henrik?.lastMatchesCount || 5));
    const hasConfiguredApi = Boolean(config.henrik?.apiKey && config.henrik.apiKey.trim());
    const matches = (
      config.recentMatches && config.recentMatches.length > 0
        ? config.recentMatches
        : hasConfiguredApi
        ? []
        : DEFAULT_RECENT_MATCHES
    ).slice(0, count);

    // If matches are present, active Net RR is computed across displayed matches
    const netRRValue =
      matches.length > 0
        ? matches.reduce((acc, m) => acc + m.rrChange, 0)
        : config.netRR;

    const isPos = netRRValue > 0;
    const isZero = netRRValue === 0;

    return (
      <div
        className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[11px] font-bold tracking-wide font-mono ${
          isPos
            ? 'bg-emerald-500/15 text-emerald-400 border border-emerald-500/30'
            : isZero
            ? 'bg-gray-800 text-gray-300 border border-gray-700'
            : 'bg-rose-500/15 text-rose-400 border border-rose-500/30'
        }`}
      >
        {isPos ? (
          <TrendingUp className="w-3 h-3" />
        ) : isZero ? null : (
          <TrendingDown className="w-3 h-3" />
        )}
        <span>{isPos ? `+${netRRValue}` : netRRValue} RR</span>
      </div>
    );
  };

  // -------------------------------------------------------------
  // Configurable Win/Loss & Percentage text
  // -------------------------------------------------------------
  const renderWinLossText = () => {
    if (!showWinLoss && !showWinRate) return null;
    return (
      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-gray-200">
        {showWinLoss && (
          <span>
            {wins}W - {losses}L
          </span>
        )}
        {showWinRate && (
          <span className="text-emerald-400 font-semibold text-[11px]">
            ({winRate}%)
          </span>
        )}
      </div>
    );
  };

  // Common outer style with scale & opacity & glow boundary buffer
  const outerStyle: React.CSSProperties = {
    transform: `scale(${config.scale || 1})`,
    transformOrigin: isStandalone ? 'top left' : 'center center',
    opacity: config.overlayOpacity ?? config.opacity ?? 1,
    transition: 'opacity 0.2s ease, transform 0.2s ease',
    padding: '12px',
  };

  // -------------------------------------------------------------
  // THEME 1: VCT Champions / Esports Broadcast
  // -------------------------------------------------------------
  if (config.theme === 'vct') {
    return (
      <div id="valorant-overlay-vct" className="relative inline-block select-none font-sans" style={outerStyle}>
        <div
          className="relative text-white backdrop-blur-md rounded-md"
        >
          <div
            className="relative overflow-hidden border-2 rounded-md animate-vct-border"
            style={{
              backgroundColor: cardBgColor,
              clipPath:
                'polygon(0 0, calc(100% - 14px) 0, 100% 14px, 100% 100%, 14px 100%, 0 calc(100% - 14px))',
            }}
          >
            {/* Animated Background Enlarged Rank Icon */}
            {renderAnimatedBackgroundRank()}

            {/* In-HUD Victory / Defeat celebration banner */}
            {renderCelebrationOverlay()}

            {/* Top Red VCT slash banner */}
            <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#ff4655] via-amber-400 to-[#ff4655]" />

            <div className="relative z-10 p-3.5 pr-5 flex items-center gap-4">
              {/* Rank Badge */}
              {showRankIcon && (
                <div className="relative flex-shrink-0">
                  <RankBadge rank={rank} size={70} showGlow={config.glowIntensity !== 'none'} animate spinInterval={config.henrik.syncIntervalSeconds} />
                </div>
              )}

              {/* Rank Name, Player Tag, RR progress bar */}
              <div className="min-w-[220px] flex flex-col justify-center">
                <div className="flex items-center justify-between gap-2 mb-0.5">
                  <div className="flex items-baseline gap-1.5">
                    <span
                      className="text-xl font-extrabold tracking-wider uppercase drop-shadow-sm font-sans"
                      style={{ color: rank.color }}
                    >
                      {rank.name.toUpperCase()}
                    </span>
                    {showPlayerName && config.playerName && (
                      <span className="text-xs text-gray-300 font-medium font-mono">
                        {config.playerName}
                        {config.playerTag ? <span className="text-gray-400 font-normal">#{config.playerTag}</span> : ''}
                      </span>
                    )}
                  </div>
                </div>

                {/* RR Bar & Total RR */}
                {showTotalRR && (
                  <div className="relative mt-1">
                    <div className="flex items-center justify-between text-xs font-mono font-bold mb-1">
                      <span className="text-gray-400 text-[11px] tracking-wide">
                        {isImmortalOrRadiant ? 'TOTAL RATING' : 'RATING'}
                      </span>
                      <div className="flex items-baseline gap-1">
                        <motion.span
                          key={displayedRR}
                          initial={{ scale: 1.15 }}
                          animate={{ scale: 1 }}
                          className="text-white text-sm font-bold font-mono"
                        >
                          {displayedRR}
                        </motion.span>
                        {rrInfo.ratioText ? (
                          <span className="text-gray-400 text-[10px]">{rrInfo.ratioText}</span>
                        ) : (
                          <span className="text-cyan-400 text-[10px] font-bold">RR</span>
                        )}
                      </div>
                    </div>

                    <div className="w-full h-2.5 bg-black/60 rounded-sm overflow-hidden p-0.5 border border-white/15">
                      <motion.div
                        className="h-full rounded-sm"
                        animate={{ width: `${rrPercentage}%` }}
                        transition={{ duration: 0.5, ease: 'easeOut' }}
                        style={{
                          background: `linear-gradient(90deg, ${rank.secondaryColor}, ${rank.color})`,
                          boxShadow: `0 0 8px ${rank.color}`,
                        }}
                      />
                    </div>
                  </div>
                )}

              {/* Bottom Configurable Stats */}
              {!isUnranked && (
                <div className="flex items-center justify-between gap-2 mt-2 pt-1.5 border-t border-white/10">
                  <div>{renderWinLossText()}</div>
                  <div className="flex items-center gap-1.5">
                    {renderNetRR()}
                    {renderStreak()}
                  </div>
                </div>
              )}

              {isUnranked && (
                <div className="mt-2 pt-2 border-t border-white/10 text-center">
                  <span className="text-[10px] tracking-widest font-mono uppercase text-gray-400 font-bold">
                    PLACEMENT MATCHES PENDING
                  </span>
                </div>
              )}

              {/* Last Matches Strip */}
              {showLastMatches && (
                <div className="mt-1.5 pt-1.5 border-t border-white/10">
                  {renderRecentMatches()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// THEME 7: VCT Champions 2021 (Luxury Gold & Red Stencil)
// -------------------------------------------------------------
if (config.theme === 'vct_2021') {
  return (
    <div id="valorant-overlay-vct-2021" className="relative inline-block select-none font-sans" style={outerStyle}>
      <div className="relative text-white backdrop-blur-md">
        {/* Outer sharp container with gold double-wireframe border and dark gold corner glow */}
        <div
          className="relative overflow-hidden border-2 rounded-none p-4.5 pr-6 flex items-center gap-5 transition-all outline outline-1 outline-[#d4af37]/35 outline-offset-2"
          style={{
            background: `linear-gradient(135deg, rgba(5, 5, 5, ${backdropAlpha}) 0%, rgba(21, 16, 5, ${backdropAlpha}) 50%, rgba(5, 5, 5, ${backdropAlpha}) 100%)`,
            borderColor: '#d4af37', // Gold outer border
            boxShadow: `0 0 30px rgba(212, 175, 55, ${0.12 + backdropAlpha * 0.1}), inset 0 0 25px rgba(212, 175, 55, ${backdropAlpha * 0.08})`,
          }}
        >
          {/* Shard-like particle animation in the background */}
          <Vct2021ShardBackground />

          {/* Red VCT slash light strips in the top left */}
          <div className="absolute top-0 left-0 w-14 h-1 bg-[#ff4655] rotate-[-45deg] translate-y-[-7px] translate-x-[-15px] opacity-90 shadow-[0_0_12px_#ff4655] z-10" />
          {/* Gold slash light strip in bottom right */}
          <div className="absolute bottom-0 right-0 w-14 h-1 bg-[#d4af37] rotate-[-45deg] translate-y-[7px] translate-x-[15px] opacity-90 shadow-[0_0_12px_#d4af37] z-10" />

          {/* Double wireframe corner chevron details (resembling Art of Greatness card) */}
          <div className="absolute top-1.5 left-1.5 w-4 h-4 border-t border-l border-[#d4af37]/50 pointer-events-none" />
          <div className="absolute bottom-1.5 right-1.5 w-4 h-4 border-b border-r border-[#d4af37]/50 pointer-events-none" />

          {/* Iconic Champions Star SVG watermark in background */}
          <div className="absolute right-[-10px] top-1/2 -translate-y-1/2 opacity-[0.06] pointer-events-none transform scale-150 text-[#d4af37] z-0">
            <svg viewBox="0 0 100 100" className="w-36 h-36">
              <polygon points="50,15 58,28 42,28" fill="currentColor" />
              <polygon points="85,50 72,42 72,58" fill="currentColor" />
              <polygon points="50,85 42,72 58,72" fill="currentColor" />
              <polygon points="15,50 28,58 28,42" fill="currentColor" />
              <polygon points="32,32 38,26 44,32 38,38" fill="currentColor" />
              <polygon points="68,32 74,26 80,32 74,38" fill="currentColor" />
              <polygon points="32,68 38,62 44,68 38,74" fill="currentColor" />
              <polygon points="68,68 74,62 80,68 74,74" fill="currentColor" />
              <polygon points="50,38 62,50 50,62 38,50" fill="currentColor" />
            </svg>
          </div>

          {/* In-HUD Victory / Defeat celebration banner */}
          {renderCelebrationOverlay()}

          {/* Rank Badge Frame */}
          {showRankIcon && (
            <div className="relative flex-shrink-0 z-10">
              <RankBadge rank={rank} size={72} showGlow={config.glowIntensity !== 'none'} animate spinInterval={config.henrik.syncIntervalSeconds} />
              {/* Gold double frame around rank badge */}
              <div className="absolute inset-0 border border-[#d4af37]/40 pointer-events-none scale-110 rounded-none" />
              <div className="absolute inset-0 border border-[#d4af37]/20 pointer-events-none scale-125 rounded-none" />
            </div>
          )}

          {/* Main Stats Column */}
          <div className="min-w-[230px] flex flex-col justify-center z-10">
            {/* Header: Player Name & Champions branding */}
            <div className="flex items-center justify-between mb-1.5 border-b border-[#d4af37]/25 pb-1">
              <div className="flex items-baseline gap-2">
                {showPlayerName && config.playerName ? (
                  <span className="text-sm font-mono font-black text-gray-100 tracking-wider">
                    {config.playerName}
                    {config.playerTag ? <span className="text-gray-500 font-normal">#{config.playerTag}</span> : ''}
                  </span>
                ) : (
                  <span className="text-[10px] font-mono tracking-widest text-[#d4af37] font-bold uppercase">
                    CHAMPIONS 2021
                  </span>
                )}
              </div>
              <span className="text-[9px] font-mono font-bold text-[#d4af37] bg-[#d4af37]/15 border border-[#d4af37]/45 px-1.5 py-0.5 tracking-widest">
                VCT 21
              </span>
            </div>

            {/* Rank Name & Rating */}
            <div className="flex items-baseline justify-between mb-1">
              <span className="text-lg font-black tracking-widest text-[#d4af37] uppercase font-sans">
                {rank.name.toUpperCase()}
              </span>
              {showTotalRR && (
                <div className="flex items-baseline gap-1 font-mono text-sm font-bold text-white">
                  <span>{displayedRR}</span>
                  <span className="text-[10px] text-gray-400">RR</span>
                </div>
              )}
            </div>

            {/* Custom Sharp Gold Progress Bar */}
            {showTotalRR && (
              <div className="relative mt-1 mb-2">
                <div className="w-full h-1.5 bg-black/80 rounded-none overflow-hidden p-[1px] border border-[#d4af37]/25">
                  <motion.div
                    className="h-full rounded-none"
                    animate={{ width: `${rrPercentage}%` }}
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                    style={{
                      background: 'linear-gradient(90deg, #9a701a, #ffd700, #9a701a)',
                      boxShadow: '0 0 8px #d4af37',
                    }}
                  />
                </div>
              </div>
            )}

            {/* Bottom Configurable Stats */}
            {!isUnranked && (
              <div className="flex items-center justify-between gap-3 mt-1.5 pt-1.5 border-t border-white/5">
                <div>{renderWinLossText()}</div>
                <div className="flex items-center gap-1.5">
                  {renderNetRR()}
                  {renderStreak()}
                </div>
              </div>
            )}

            {isUnranked && (
              <div className="mt-1.5 pt-1.5 border-t border-white/5 text-center">
                <span className="text-[10px] tracking-widest font-mono uppercase text-[#ffd700] font-bold">
                  PLACEMENT MATCHES PENDING
                </span>
              </div>
            )}

            {/* Last Matches Strip */}
            {showLastMatches && (
              <div className="mt-1.5 pt-1.5 border-t border-white/5">
                {renderRecentMatches()}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------
// THEME 2: Radiant Glass (Frosted Modern Glassmorphism)
// -------------------------------------------------------------
  if (config.theme === 'radiant_glass') {
    return (
      <div id="valorant-overlay-radiant-glass" className="relative inline-block select-none font-sans" style={outerStyle}>
        <div
          className="relative p-3.5 rounded-2xl backdrop-blur-xl border text-white shadow-2xl overflow-hidden"
          style={{
            backgroundColor: cardBgColor,
            borderColor: `${rank.color}88`,
            boxShadow: `0 8px 32px 0 rgba(0, 0, 0, 0.6), ${glowStyle}`,
          }}
        >
          {renderAnimatedBackgroundRank()}
          {renderCelebrationOverlay()}

          <div className="relative z-10 flex items-center gap-3.5">
            {showRankIcon && (
              <RankBadge rank={rank} size={64} showGlow={config.glowIntensity !== 'none'} animate spinInterval={config.henrik.syncIntervalSeconds} />
            )}

            <div className="min-w-[210px]">
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-baseline gap-1.5">
                  <span className="text-lg font-bold tracking-wide uppercase" style={{ color: rank.color }}>
                    {rank.name.toUpperCase()}
                  </span>
                  {showPlayerName && config.playerName && (
                    <span className="text-xs text-gray-300 font-mono">
                      {config.playerName}
                      {config.playerTag ? <span className="text-gray-400 opacity-80">#{config.playerTag}</span> : ''}
                    </span>
                  )}
                </div>
              </div>

              {showTotalRR && (
                <div className="mt-1.5">
                  <div className="flex justify-between text-[11px] font-mono text-gray-300 mb-1">
                    <span>{isImmortalOrRadiant ? 'Total Rating' : 'Rating Progress'}</span>
                    <span className="font-bold text-white font-mono">{rrInfo.displayText}</span>
                  </div>
                  <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full rounded-full"
                      animate={{ width: `${rrPercentage}%` }}
                      transition={{ duration: 0.5 }}
                      style={{ backgroundColor: rank.color }}
                    />
                  </div>
                </div>
              )}

              {/* Bottom Configurable Stats */}
              {!isUnranked && (
                <div className="flex items-center justify-between gap-2 mt-2 pt-1.5 border-t border-white/10">
                  <div>{renderWinLossText()}</div>
                  <div className="flex items-center gap-1.5">
                    {renderNetRR()}
                    {renderStreak()}
                  </div>
                </div>
              )}

              {isUnranked && (
                <div className="mt-2 pt-2 border-t border-white/10 text-center">
                  <span className="text-[10px] tracking-widest font-mono uppercase text-gray-300 font-bold">
                    PLACEMENT MATCHES PENDING
                  </span>
                </div>
              )}

              {/* Last Matches Strip */}
              {showLastMatches && (
                <div className="mt-1.5 pt-1.5 border-t border-white/10">
                  {renderRecentMatches()}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // THEME 3: Compact Stream Pill (Under Webcam)
  // -------------------------------------------------------------
  if (config.theme === 'compact_pill') {
    const getRankGradientClass = (tierId: string) => {
      switch (tierId) {
        case 'radiant':
          return 'from-yellow-500 via-amber-400 to-amber-600';
        case 'immortal':
          return 'from-red-600 via-rose-500 to-purple-700';
        case 'ascendant':
          return 'from-emerald-400 via-teal-600 to-green-700';
        case 'diamond':
          return 'from-cyan-400 via-blue-500 to-indigo-600';
        case 'platinum':
          return 'from-teal-300 via-cyan-500 to-blue-600';
        case 'gold':
          return 'from-amber-400 via-yellow-500 to-orange-500';
        case 'silver':
          return 'from-slate-200 via-zinc-400 to-gray-500';
        case 'bronze':
          return 'from-amber-600 via-orange-700 to-yellow-800';
        case 'iron':
          return 'from-zinc-400 via-slate-500 to-zinc-700';
        default:
          return 'from-cyan-500 via-blue-600 to-slate-800';
      }
    };

    return (
      <div id="valorant-overlay-compact-pill" className="relative inline-block select-none font-sans pt-5" style={outerStyle}>
        <div className="relative">
          {/* Attached Flat-Seated Top-Left Riot ID Tab sitting flush on the pill */}
          {showPlayerName && config.playerName && (
            <div
              className={`absolute bottom-full left-8 z-20 px-3 py-0.5 rounded-t-xl text-[10px] font-mono font-bold tracking-wider text-white shadow-md border-t border-x flex items-center bg-gradient-to-r ${getRankGradientClass(rank.tierId)} overflow-hidden`}
              style={{
                borderColor: `${rank.color}88`,
                height: '16px',
                marginBottom: '0px',
                boxShadow: `0 -2px 6px ${rank.color}22`,
              }}
            >
              {/* Shimmer wave movement animation inside */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent animate-shimmer-wave pointer-events-none" />
              <span className="relative z-10 flex items-center gap-1 leading-none">
                <span className="text-gray-100 font-bold">{config.playerName}</span>
                {config.playerTag && <span className="text-white/80 font-medium opacity-90">#{config.playerTag}</span>}
              </span>
            </div>
          )}

          <div
            className="relative flex items-center gap-2.5 px-4 py-2 rounded-full border text-white backdrop-blur-md shadow-xl overflow-hidden"
            style={{
              backgroundColor: cardBgColor,
              borderColor: `${rank.color}88`,
              boxShadow: glowStyle,
            }}
          >
            {renderAnimatedBackgroundRank()}
            {renderCelebrationOverlay()}

            <div className="relative z-10 flex items-center gap-2.5">
              {showRankIcon && <RankBadge rank={rank} size={34} showGlow={false} spinInterval={config.henrik.syncIntervalSeconds} />}

            <div className="flex items-baseline gap-1.5 whitespace-nowrap">
              <span className="font-extrabold text-sm tracking-wider uppercase whitespace-nowrap" style={{ color: rank.color }}>
                {rank.name.toUpperCase()}
              </span>
              {showTotalRR && (
                <span className="font-mono text-xs text-white font-bold whitespace-nowrap">{rrInfo.displayText}</span>
              )}
            </div>

            {(showWinLoss || showWinRate) && (
              <>
                <div className="w-px h-4 bg-white/20" />
                {renderWinLossText()}
              </>
            )}

            {showNetRR && (
              <>
                <div className="w-px h-4 bg-white/20" />
                {renderNetRR()}
              </>
            )}

            {showWinStreak && config.streakType !== 'none' && (
              <>
                <div className="w-px h-4 bg-white/20" />
                {renderStreak()}
              </>
            )}

            {showLastMatches && (
              <>
                <div className="w-px h-4 bg-white/20" />
                {renderRecentMatches({ compact: true })}
              </>
            )}

            {isUnranked && (
              <>
                <div className="w-px h-4 bg-white/20" />
                <span className="text-[10px] tracking-wider font-mono uppercase text-gray-300 font-bold">
                  PLACEMENTS
                </span>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

  // -------------------------------------------------------------
  // THEME 4: Esports Broadcast HUD
  // -------------------------------------------------------------
  if (config.theme === 'esports_hud') {
    return (
      <div id="valorant-overlay-esports-hud" className="relative inline-block select-none font-sans" style={outerStyle}>
        <div
          className="relative border-l-4 border-t border-r border-b border-gray-800 text-white shadow-2xl p-3 min-w-[280px] overflow-hidden"
          style={{
            backgroundColor: cardBgColor,
            borderLeftColor: rank.color,
            boxShadow: glowStyle,
          }}
        >
          {renderAnimatedBackgroundRank()}
          {renderCelebrationOverlay()}

          <div className="relative z-10">
            <div className="flex items-center justify-between border-b border-gray-800 pb-1.5 mb-2">
              <div className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-[#ff4655] animate-pulse" />
                <span className="text-[10px] font-mono tracking-widest text-gray-400 uppercase font-bold">
                  RANKED LIVE
                </span>
              </div>
              {showPlayerName && config.playerName && (
                <span className="text-xs font-mono text-gray-300 font-bold">
                  {config.playerName}
                  {config.playerTag ? <span className="opacity-60">#{config.playerTag}</span> : ''}
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {showRankIcon && <RankBadge rank={rank} size={58} showGlow={config.glowIntensity !== 'none'} spinInterval={config.henrik.syncIntervalSeconds} />}
              <div className="flex-1">
                <div className="flex items-center justify-between">
                  <span className="text-base font-extrabold uppercase" style={{ color: rank.color }}>
                    {rank.name.toUpperCase()}
                  </span>
                  {showTotalRR && (
                    <span className="font-mono text-xs font-bold text-white">{rrInfo.displayText}</span>
                  )}
                </div>

                {showTotalRR && (
                  <div className="w-full h-1.5 bg-gray-800 mt-1 rounded-sm overflow-hidden">
                    <motion.div
                      className="h-full transition-all duration-300"
                      animate={{ width: `${rrPercentage}%` }}
                      style={{ backgroundColor: rank.color }}
                    />
                  </div>
                )}

                {/* Bottom Configurable Stats */}
                {!isUnranked && (
                  <div className="flex items-center justify-between gap-2 mt-2 pt-1 border-t border-gray-800">
                    <div>{renderWinLossText()}</div>
                    <div className="flex items-center gap-1.5">
                      {renderNetRR()}
                      {renderStreak()}
                    </div>
                  </div>
                )}

                {isUnranked && (
                  <div className="mt-2 pt-1 border-t border-gray-800 text-center">
                    <span className="text-[10px] tracking-widest font-mono uppercase text-gray-400 font-bold">
                      PLACEMENT MATCHES PENDING
                    </span>
                  </div>
                )}

                {/* Last Matches Strip */}
                {showLastMatches && (
                  <div className="mt-1.5 pt-1 border-t border-gray-800">
                    {renderRecentMatches()}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // THEME 5: Minimal Neon
  // -------------------------------------------------------------
  if (config.theme === 'minimal_neon') {
    return (
      <div id="valorant-overlay-minimal-neon" className="relative inline-block select-none font-sans" style={outerStyle}>
        <div
          className="relative flex items-center gap-3 px-4 py-2 rounded-lg border text-white backdrop-blur-md shadow-2xl overflow-hidden"
          style={{
            backgroundColor: cardBgColor,
            borderColor: rank.color,
            boxShadow: `0 0 16px ${rank.glowColor}`,
          }}
        >
          {renderAnimatedBackgroundRank()}
          {renderCelebrationOverlay()}

          <div className="relative z-10 flex items-center gap-3">
            {showRankIcon && <RankBadge rank={rank} size={46} showGlow={false} spinInterval={config.henrik.syncIntervalSeconds} />}
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="font-bold text-base uppercase" style={{ color: rank.color }}>
                  {rank.name.toUpperCase()}
                </span>
                {showPlayerName && config.playerName && (
                  <span className="text-xs text-gray-300 font-mono">
                    {config.playerName}
                    {config.playerTag ? <span className="text-gray-400 opacity-80">#{config.playerTag}</span> : ''}
                  </span>
                )}
                {showTotalRR && (
                  <span className="font-mono text-xs text-white/90 font-bold">
                    {rrInfo.displayText}
                  </span>
                )}
              </div>
              <div className="flex items-center gap-2 mt-0.5">
                {renderWinLossText()}
                {renderNetRR()}
                {renderStreak()}
              </div>
              {showLastMatches && (
                <div className="mt-1 pt-1 border-t border-white/10">
                  {renderRecentMatches({ compact: true })}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // THEME 6: Vertical Card
  // -------------------------------------------------------------
  return (
    <div id="valorant-overlay-vertical-card" className="relative inline-block select-none font-sans" style={outerStyle}>
      <div
        className="relative w-52 p-4 rounded-xl border-2 text-white shadow-2xl text-center flex flex-col items-center gap-2 overflow-hidden"
        style={{
          backgroundColor: cardBgColor,
          borderColor: `${rank.color}88`,
          boxShadow: glowStyle,
        }}
      >
        {renderAnimatedBackgroundRank()}
        {renderCelebrationOverlay()}

        <div className="relative z-10 w-full flex flex-col items-center gap-2">
          {showRankIcon && (
            <RankBadge rank={rank} size={76} showGlow={config.glowIntensity !== 'none'} animate spinInterval={config.henrik.syncIntervalSeconds} />
          )}
          <div className="font-extrabold text-base uppercase" style={{ color: rank.color }}>
            {rank.name.toUpperCase()}
          </div>
          {showPlayerName && config.playerName && (
            <div className="text-xs font-mono text-gray-300">
              {config.playerName}
              {config.playerTag ? <span className="opacity-60">#{config.playerTag}</span> : ''}
            </div>
          )}

          {showTotalRR && (
            <div className="w-full">
              <div className="flex justify-between text-[11px] font-mono text-gray-400 mb-1">
                <span>{isImmortalOrRadiant ? 'Total Rating' : 'Progress'}</span>
                <span className="font-bold text-white font-mono">{rrInfo.displayText}</span>
              </div>
              <div className="w-full h-2 bg-black/60 rounded-full overflow-hidden border border-white/10">
                <motion.div
                  className="h-full rounded-full transition-all duration-300"
                  animate={{ width: `${rrPercentage}%` }}
                  style={{ backgroundColor: rank.color }}
                />
              </div>
            </div>
          )}

          {!isUnranked && (
            <div className="pt-2 border-t border-white/10 w-full flex flex-col items-center gap-1.5">
              {renderWinLossText()}
              <div className="flex items-center gap-1.5 flex-wrap justify-center">
                {renderNetRR()}
                {renderStreak()}
              </div>
              {showLastMatches && (
                <div className="pt-1.5 border-t border-white/10 w-full flex justify-center">
                  {renderRecentMatches({ compact: true, vertical: true })}
                </div>
              )}
            </div>
          )}

          {isUnranked && (
            <div className="pt-2 border-t border-white/10 w-full text-center">
              <span className="text-[10px] tracking-widest font-mono uppercase text-gray-400 font-bold">
                PLACEMENT MATCHES PENDING
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
