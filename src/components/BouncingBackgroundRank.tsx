import React from 'react';

interface BouncingBackgroundRankProps {
  iconUrl: string;
  color: string;
  show?: boolean;
}

/**
 * Minimal Corner Watermark Rank Icon
 * Features an enlarged rank emblem anchored at the corner with subtle
 * continuous floating oscillation (zero zoom-in/zoom-out to maintain minimal aesthetics).
 */
export const BouncingBackgroundRank: React.FC<BouncingBackgroundRankProps> = ({
  iconUrl,
  color,
  show = true,
}) => {
  if (!show) return null;

  return (
    <div
      className="absolute inset-0 pointer-events-none select-none z-0 overflow-hidden"
      aria-hidden="true"
    >
      {/* Corner Anchor Container (Anchored at bottom-right corner) */}
      <div className="absolute -bottom-5 -right-5 sm:-bottom-7 sm:-right-7 h-[145%] min-h-[110px] max-h-[190px] aspect-square pointer-events-none select-none">
        {/* Continuous Corner Oscillating Wrapper (Translation & gentle micro-rotation only, strictly NO zoom/scale) */}
        <div
          className="relative w-full h-full will-change-transform animate-corner-rank-oscillate flex items-center justify-center"
          style={{
            transformOrigin: 'center center',
          }}
        >
          {/* Soft atmospheric ambient color bloom anchored in corner */}
          <div
            className="absolute inset-0 rounded-full filter blur-2xl pointer-events-none"
            style={{
              backgroundColor: color,
              opacity: 0.07,
            }}
          />

          {/* Minimal Enlarged Rank Watermark */}
          <img
            src={iconUrl}
            alt=""
            className="w-full h-full object-contain filter brightness-110 contrast-125 pointer-events-none select-none"
            style={{
              opacity: 0.08, // Elegant minimal watermark transparency
              filter: `drop-shadow(0 0 20px ${color}30)`,
            }}
          />
        </div>
      </div>
    </div>
  );
};

