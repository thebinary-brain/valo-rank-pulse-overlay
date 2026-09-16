import React, { useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { RankDefinition } from '../types';
import { RankBadge } from './RankBadge';
import { Trophy, ArrowUpRight, ArrowDownRight } from 'lucide-react';

interface RankCelebrationProps {
  type: 'rankup' | 'derank' | null;
  rank: RankDefinition;
  onDismiss: () => void;
}

export const RankUpCelebration: React.FC<RankCelebrationProps> = ({
  type,
  rank,
  onDismiss,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (!type || type !== 'rankup') return;

    // Run geometric radiant shard particles on canvas
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
    const colors = [rank.color, '#ffffff', '#facc15', '#ff4655', rank.secondaryColor];

    for (let i = 0; i < 90; i++) {
      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 8 + 3;
      particles.push({
        x: canvas.width / 2,
        y: canvas.height / 2,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        size: Math.random() * 9 + 4,
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
        p.vy += 0.12; // slight gravity
        p.rotation += p.vRot;
        p.alpha -= 0.014;

        if (p.alpha > 0) {
          aliveCount++;
          ctx.save();
          ctx.translate(p.x, p.y);
          ctx.rotate(p.rotation);
          ctx.fillStyle = p.color;
          ctx.globalAlpha = Math.max(0, p.alpha);

          // Draw radiant diamond / triangle shard
          ctx.beginPath();
          ctx.moveTo(0, -p.size);
          ctx.lineTo(p.size * 0.6, p.size * 0.6);
          ctx.lineTo(-p.size * 0.6, p.size * 0.6);
          ctx.closePath();
          ctx.fill();
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
  }, [type, rank, onDismiss]);

  if (!type) return null;

  const isRankUp = type === 'rankup';

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onDismiss}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-md cursor-pointer select-none"
      >
        <canvas ref={canvasRef} className="absolute inset-0 pointer-events-none" />

        <motion.div
          initial={{ scale: 0.6, y: 30, opacity: 0 }}
          animate={{ scale: 1, y: 0, opacity: 1 }}
          exit={{ scale: 0.8, y: -20, opacity: 0 }}
          transition={{ type: 'spring', damping: 20, stiffness: 260 }}
          className="relative z-10 flex flex-col items-center text-center p-8 max-w-md w-full mx-4"
        >
          {/* Header Banner */}
          <div
            className={`inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold uppercase tracking-widest mb-4 border ${
              isRankUp
                ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                : 'bg-rose-500/20 text-rose-400 border-rose-500/40 shadow-[0_0_20px_rgba(244,63,94,0.3)]'
            }`}
          >
            {isRankUp ? (
              <>
                <ArrowUpRight className="w-4 h-4" />
                <span>Tier Promoted</span>
              </>
            ) : (
              <>
                <ArrowDownRight className="w-4 h-4" />
                <span>Tier Demoted</span>
              </>
            )}
          </div>

          {/* Large Badge with radiating animation */}
          <div className="my-3 relative">
            <RankBadge rank={rank} size={120} showGlow={true} animate={true} />
          </div>

          <h2
            className="text-4xl font-extrabold tracking-tight mt-2 font-['Chakra_Petch']"
            style={{ color: isRankUp ? rank.color : '#f43f5e' }}
          >
            {rank.name.toUpperCase()}
          </h2>

          <p className="text-gray-300 text-sm mt-1 max-w-xs">
            {isRankUp
              ? 'Congratulations! You advanced into the next competitive tier.'
              : 'Competitive rating fell below threshold. Time to bounce back!'}
          </p>

          <div className="mt-6 flex items-center gap-2 text-xs text-gray-400">
            <Trophy className="w-3.5 h-3.5 text-[#ff4655]" />
            <span>Click anywhere to continue stream</span>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};
