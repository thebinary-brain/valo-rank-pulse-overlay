import React from 'react';
import rankPulseLogoImg from '../assets/images/rank-pulse-logo.png';

interface RankPulseLogoProps {
  className?: string;
  height?: number | string;
}

export const RankPulseLogo: React.FC<RankPulseLogoProps> = ({
  className = '',
  height = 56,
}) => {
  const numericHeight = typeof height === 'number' ? height : parseInt(String(height), 10) || 56;
  // Aspect ratio is 2172 / 724 = 3.0
  const width = Math.round(numericHeight * 3.0);

  return (
    <div
      className={`relative inline-flex items-center justify-center select-none ${className}`}
      style={{
        height: `${numericHeight}px`,
        width: `${width}px`,
      }}
    >
      {/* The EXACT Uploaded Logo Image (Clean, No Glow) */}
      <img
        src={rankPulseLogoImg}
        alt="RANK PULSE"
        className="relative z-10 w-full h-full object-contain select-none pointer-events-none"
      />

      {/* Electrifying Traveling Pulse Surging Through The Exact Silhouette */}
      <div
        className="absolute inset-0 pointer-events-none z-20 overflow-hidden mix-blend-screen"
        style={{
          WebkitMaskImage: `url(${rankPulseLogoImg})`,
          maskImage: `url(${rankPulseLogoImg})`,
          WebkitMaskSize: 'contain',
          maskSize: 'contain',
          WebkitMaskRepeat: 'no-repeat',
          maskRepeat: 'no-repeat',
          WebkitMaskPosition: 'center',
          maskPosition: 'center',
        }}
      >
        {/* Primary High-Voltage Cyan Electric Beam */}
        <div
          className="absolute inset-y-0 w-28 bg-gradient-to-r from-transparent via-cyan-300 to-transparent opacity-95 animate-electric-sweep"
          style={{ filter: 'blur(1px)' }}
        />

        {/* Ultra-Bright White Hot Core Lightning Streak */}
        <div
          className="absolute inset-y-0 w-10 bg-gradient-to-r from-transparent via-white to-transparent opacity-100 animate-electric-sweep"
          style={{ animationDelay: '0.04s' }}
        />
      </div>
    </div>
  );
};



