import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RankDefinition } from '../types';
import { RankBadge } from './RankBadge';
import { Sword, Shield } from 'lucide-react';
import { soundFX } from '../utils/audio';

export interface MatchCelebrationProps {
  type: 'victory' | 'defeat' | null;
  rank: RankDefinition;
  onDismiss: () => void;
  soundEnabled?: boolean;
  soundVolume?: number;
}

export const MatchCelebrationModal: React.FC<MatchCelebrationProps> = ({
  type,
  rank,
  onDismiss,
  soundEnabled = true,
  soundVolume = 0.5,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!type) return;

    if (soundEnabled) {
      if (type === 'victory') {
        soundFX.playWin(soundVolume);
      } else {
        soundFX.playLoss(soundVolume);
      }
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

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
    }

    const particles: Particle[] = [];

    const winColors = ['#22c55e', '#4ade80', '#ffffff', '#facc15', rank.color, rank.secondaryColor];
    const lossColors = ['#f43f5e', '#fb7185', '#7f1d1d', '#ffffff', '#450a0a'];
    const colors = type === 'victory' ? winColors : lossColors;

    const count = type === 'victory' ? 100 : 70;

    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed =
        type === 'victory'
          ? Math.random() * 10 + 4
          : Math.random() * 6 + 2;
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 10 + 4,
        color: colors[Math.floor(Math.random() * colors.length)],
        alpha: 1,
        rotation: Math.random() * Math.PI,
        vRot: (Math.random() - 0.5) * 0.2,
      });
    }

    let animId: number;
    const render = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      let aliveCount = 0;

      particles.forEach((p) => {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += type === 'victory' ? 0.12 : 0.08;
        p.rotation += p.vRot;
        p.alpha -= type === 'victory' ? 0.013 : 0.016;

        if (p.alpha > 0) {
          aliveCount++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);

          if (type === 'victory') {
            // Confetti rectangles for victory
            ctx.fillRect(-p.size / 2, -p.size / 4, p.size, p.size / 2);
          } else {
            // Diamond shards for defeat
            ctx.beginPath();
            ctx.moveTo(0, -p.size);
            ctx.lineTo(p.size * 0.5, 0);
            ctx.lineTo(0, p.size * 0.6);
            ctx.lineTo(-p.size * 0.5, 0);
            ctx.closePath();
            ctx.fill();
          }
          ctx.restore();
        }
      });

      if (aliveCount > 0) {
        animId = requestAnimationFrame(render);
      }
    };

    animId = requestAnimationFrame(render);

    const autoTimer = setTimeout(() => {
      onDismiss();
    }, 4500);

    return () => {
      cancelAnimationFrame(animId);
      clearTimeout(autoTimer);
    };
  }, [type, rank, onDismiss, soundEnabled, soundVolume]);

  if (!type) return null;

  const isVictory = type === 'victory';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onDismiss}
        className={`fixed inset-0 z-50 flex items-center justify-center cursor-pointer select-none ${
          isVictory ? 'bg-black/80 backdrop-blur-md' : 'bg-black/85 backdrop-blur-md'
        }`}
      >
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

        <motion.div
          initial={{ scale: 0.6, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: -20, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 260 }}
          className="relative z-10 flex flex-col items-center text-center p-8 max-w-md w-full mx-4"
        >
          {/* Victory / Defeat header badge */}
          <div
            className={`inline-flex items-center gap-2.5 px-5 py-2 rounded-full text-sm font-black uppercase tracking-widest mb-5 border-2 ${
              isVictory
                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-400/60 shadow-[0_0_30px_rgba(34,197,94,0.4)]'
                : 'bg-rose-500/20 text-rose-300 border-rose-400/60 shadow-[0_0_30px_rgba(244,63,94,0.4)]'
            }`}
          >
            {isVictory ? (
              <>
                <Sword className="w-5 h-5 text-emerald-400" />
                <span>VICTORY</span>
              </>
            ) : (
              <>
                <Shield className="w-5 h-5 text-rose-400" />
                <span>DEFEAT</span>
              </>
            )}
          </div>

          {/* Large Rank Badge */}
          <div className="my-3 relative">
            <RankBadge rank={rank} size={120} showGlow={true} animate={true} />
          </div>

          <h2
            className="text-4xl font-extrabold tracking-tight mt-2 font-['Chakra_Petch']"
            style={{ color: isVictory ? rank.color : '#f43f5e' }}
          >
            {rank.name.toUpperCase()}
          </h2>

          <p className="text-gray-300 text-sm mt-1 max-w-xs">
            {isVictory
              ? 'GG! You secured the win. Keep climbing the ranks!'
              : "Tough game. Shake it off — the next one's yours."}
          </p>

          <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
            <span
              className={`w-2 h-2 rounded-full ${isVictory ? 'bg-emerald-400' : 'bg-rose-400'} animate-pulse`}
            />
            <span>Click anywhere to continue stream</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
