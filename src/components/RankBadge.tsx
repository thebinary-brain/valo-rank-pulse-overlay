import React, { useState } from 'react';
import { RankDefinition } from '../types';

interface RankBadgeProps {
  rank: RankDefinition;
  size?: number; // size in px
  showGlow?: boolean;
  className?: string;
  animate?: boolean;
  spinInterval?: number; // spin interval in seconds
}

export const RankBadge: React.FC<RankBadgeProps> = ({
  rank,
  size = 64,
  showGlow = true,
  className = '',
  animate = false,
  spinInterval,
}) => {
  const [imgError, setImgError] = useState(false);
  const [isSpinning, setIsSpinning] = useState(false);
  const { color, glowColor, iconUrl, name } = rank;

  React.useEffect(() => {
    if (!spinInterval) return;
    
    // Convert 0 interval (manual) or other interval to seconds (fallback 30s)
    const sec = spinInterval > 0 ? spinInterval : 30;

    const intervalId = setInterval(() => {
      setIsSpinning(true);
      setTimeout(() => setIsSpinning(false), 1200);
    }, sec * 1000);

    return () => clearInterval(intervalId);
  }, [spinInterval]);

  return (
    <div
      className={`relative flex items-center justify-center select-none ${className}`}
      style={{ width: size, height: size }}
    >
      {/* Dynamic ambient backdrop glow */}
      {showGlow && (
        <div
          className={`absolute inset-0 rounded-full blur-md pointer-events-none transition-all duration-500 ${
            animate ? 'animate-pulse' : ''
          }`}
          style={{
            background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
            transform: 'scale(1.25)',
            opacity: 0.75,
          }}
        />
      )}

      {/* Real Official Valorant Rank Icon from Riot CDN */}
      {!imgError && iconUrl ? (
        <img
          src={iconUrl}
          alt={name}
          width={size}
          height={size}
          loading="eager"
          decoding="async"
          onError={() => setImgError(true)}
          className={`relative z-10 w-full h-full object-contain filter drop-shadow-[0_4px_10px_rgba(0,0,0,0.7)] transition-transform duration-300 ${
            animate ? 'hover:scale-105' : ''
          } ${isSpinning ? 'animate-3d-spin' : ''}`}
        />
      ) : (
        /* Fallback badge text if network fails */
        <div
          className={`relative z-10 w-full h-full rounded-full flex items-center justify-center font-bold text-xs border-2 uppercase font-mono shadow-lg ${isSpinning ? 'animate-3d-spin' : ''}`}
          style={{
            borderColor: color,
            backgroundColor: '#0c1017',
            color: color,
          }}
        >
          {rank.shortName}
        </div>
      )}
    </div>
  );
};
