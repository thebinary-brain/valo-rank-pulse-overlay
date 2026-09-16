import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sword, Shield, Sparkles, Trophy } from 'lucide-react';
import { RankDefinition, OverlayTheme } from '../types';

interface OverlayCelebrationProps {
  type: 'victory' | 'defeat' | null;
  rank: RankDefinition;
  theme?: OverlayTheme;
  onDismiss: () => void;
}

export const OverlayCelebration: React.FC<OverlayCelebrationProps> = ({
  type,
  rank,
  theme,
  onDismiss,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!type) return;

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    canvas.width = rect.width || 360;
    canvas.height = rect.height || 160;

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      size: number;
      color: string;
      alpha: number;
      rotation: number;
      vRot: number;
      shape: 'rectangle' | 'diamond' | 'triangle' | 'spark';
    }

    const particles: Particle[] = [];
    const winColors = ['#facc15', '#eab308', '#ffffff', '#22c55e', '#10b981', rank.color];
    const lossColors = ['#f43f5e', '#fb7185', '#ef4444', '#ffffff', '#991b1b'];
    const colors = type === 'victory' ? winColors : lossColors;

    const count = type === 'victory' ? 65 : 45;
    const shapes: ('rectangle' | 'diamond' | 'triangle' | 'spark')[] = ['rectangle', 'diamond', 'triangle', 'spark'];

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = type === 'victory' ? Math.random() * 6 + 2.5 : Math.random() * 4 + 1.5;
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 7 + 3,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.3,
        shape: shapes[Math.floor(Math.random() * shapes.length)],
      });
    }

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let aliveCount = 0;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += type === 'victory' ? 0.06 : 0.04; // Gravity
        p.rotation += p.vRot;
        p.alpha -= type === 'victory' ? 0.014 : 0.016;

        if (p.alpha > 0) {
          aliveCount++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);

          if (p.shape === 'rectangle') {
            ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          } else if (p.shape === 'diamond') {
            ctx.beginPath();
            ctx.moveTo(0, -p.size);
            ctx.lineTo(p.size * 0.6, 0);
            ctx.lineTo(0, p.size);
            ctx.lineTo(-p.size * 0.6, 0);
            ctx.closePath();
            ctx.fill();
          } else if (p.shape === 'triangle') {
            ctx.beginPath();
            ctx.moveTo(0, -p.size * 0.7);
            ctx.lineTo(p.size * 0.7, p.size * 0.7);
            ctx.lineTo(-p.size * 0.7, p.size * 0.7);
            ctx.closePath();
            ctx.fill();
          } else {
            // Spark line
            ctx.strokeStyle = p.color;
            ctx.lineWidth = 1.5;
            ctx.beginPath();
            ctx.moveTo(0, -p.size * 1.2);
            ctx.lineTo(0, p.size * 1.2);
            ctx.stroke();
          }
          ctx.restore();
        }
      });

      if (aliveCount > 0) {
        animId = requestAnimationFrame(render);
      }
    };

    animId = requestAnimationFrame(render);

    const timer = setTimeout(() => {
      onDismiss();
    }, 2800);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(timer);
    };
  }, [type, rank, onDismiss]);

  if (!type) return null;

  const isVictory = type === 'victory';
  const isPill = theme === 'compact_pill';

  // Letter by letter animation variants
  const wordContainerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.04,
        delayChildren: 0.1,
      },
    },
  };

  const letterVariants = {
    hidden: { opacity: 0, y: 15, scale: 0.7 },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: { type: 'spring' as const, damping: 12, stiffness: 220 },
    },
  };

  const bannerText = isVictory ? 'VICTORY' : 'DEFEAT';

  return (
    <AnimatePresence>
      <motion.div
        key="overlay-celebration-banner"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.25, ease: 'easeOut' }}
        onClick={onDismiss}
        className={`absolute inset-0 z-40 flex items-center justify-center overflow-hidden backdrop-blur-md cursor-pointer select-none ${
          isPill ? 'rounded-full px-3 py-1' : 'rounded-[inherit]'
        } ${
          isVictory
            ? 'bg-gradient-to-br from-emerald-950/95 via-[#021810]/95 to-[#010c08]/98 border border-emerald-400/80 shadow-[0_0_35px_rgba(16,185,129,0.45)]'
            : 'bg-gradient-to-br from-rose-950/95 via-[#1a0508]/95 to-[#0b0103]/98 border border-rose-500/80 shadow-[0_0_35px_rgba(244,63,94,0.45)]'
        }`}
      >
        {/* Canvas for embedded rich confetti / custom shards */}
        <canvas ref={canvasRef} className="absolute inset-0 w-full h-full pointer-events-none" />

        {/* Dynamic Scanline & Sweep highlight line */}
        <motion.div
          initial={{ x: '-150%' }}
          animate={{ x: '150%' }}
          transition={{ duration: 1.5, ease: 'easeInOut', repeat: Infinity, repeatDelay: 1 }}
          className={`absolute inset-0 pointer-events-none w-1/2 opacity-30 skew-x-12 ${
            isVictory
              ? 'bg-gradient-to-r from-transparent via-emerald-400 to-transparent'
              : 'bg-gradient-to-r from-transparent via-rose-400 to-transparent'
          }`}
        />

        {/* Tactical Corner Brackets (for large HUD displays) */}
        {!isPill && (
          <div className="absolute inset-2 border border-white/5 pointer-events-none rounded-none">
            <div className={`absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 ${isVictory ? 'border-emerald-400/80' : 'border-rose-400/80'}`} />
            <div className={`absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 ${isVictory ? 'border-emerald-400/80' : 'border-rose-400/80'}`} />
            <div className={`absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 ${isVictory ? 'border-emerald-400/80' : 'border-rose-400/80'}`} />
            <div className={`absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 ${isVictory ? 'border-emerald-400/80' : 'border-rose-400/80'}`} />
          </div>
        )}

        {/* Compact Pill Theme Layout (stays strictly within bounds) */}
        {isPill ? (
          <motion.div
            initial={{ y: 3, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -3, opacity: 0 }}
            transition={{ duration: 0.15 }}
            className="relative z-10 flex items-center gap-2 text-center whitespace-nowrap"
          >
            {isVictory ? (
              <Sword className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            ) : (
              <Shield className="w-3.5 h-3.5 text-rose-400 shrink-0" />
            )}
            <span
              className={`text-xs font-black uppercase tracking-wider font-sans ${
                isVictory ? 'text-emerald-300' : 'text-rose-300'
              }`}
            >
              {isVictory ? 'VICTORY' : 'DEFEAT'}
            </span>
            <span className="text-white/30 text-xs">•</span>
            <span className="text-[11px] font-mono font-bold tracking-tight text-white/90">
              {isVictory ? 'MATCH WON' : 'MATCH LOST'}
            </span>
          </motion.div>
        ) : (
          /* Standard Rich Theme Banner Content */
          <div className="relative z-10 flex flex-col items-center justify-center text-center px-4 py-2.5">
            {/* Header Mini Badge */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.05, type: 'spring' }}
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[10px] font-mono font-black uppercase tracking-widest border ${
                isVictory
                  ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/40 shadow-[0_0_12px_rgba(16,185,129,0.3)]'
                  : 'bg-rose-500/20 text-rose-300 border-rose-400/40 shadow-[0_0_12px_rgba(244,63,94,0.3)]'
              }`}
            >
              {isVictory ? (
                <>
                  <Trophy className="w-3 h-3 text-emerald-400" />
                  <span>VICTORY</span>
                </>
              ) : (
                <>
                  <Shield className="w-3 h-3 text-rose-400" />
                  <span>DEFEAT</span>
                </>
              )}
            </motion.div>

            {/* Main Word - Animated Letter by Letter */}
            <motion.div
              variants={wordContainerVariants}
              initial="hidden"
              animate="visible"
              className="flex items-center justify-center gap-1 mt-2.5 mb-1.5"
            >
              {bannerText.split('').map((letter, idx) => (
                <motion.span
                  key={idx}
                  variants={letterVariants}
                  className={`text-2xl sm:text-3xl font-sans font-black tracking-widest leading-none ${
                    isVictory
                      ? 'text-transparent bg-clip-text bg-gradient-to-b from-white via-emerald-100 to-emerald-400 drop-shadow-[0_2px_8px_rgba(16,185,129,0.5)]'
                      : 'text-transparent bg-clip-text bg-gradient-to-b from-white via-rose-100 to-rose-400 drop-shadow-[0_2px_8px_rgba(244,63,94,0.5)]'
                  }`}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.div>

            {/* Sub-text message */}
            <motion.p
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45, duration: 0.3 }}
              className="text-[11px] text-gray-200 font-mono tracking-wide"
            >
              {isVictory ? 'GG! Rank Rating Secured' : 'Shake it off — Next match is yours'}
            </motion.p>
          </div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
