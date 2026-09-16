import React from 'react';
import { Shield, Sliders, Link2, ExternalLink, Sparkles, CheckCircle2, Monitor } from 'lucide-react';

export const InstructionStepper: React.FC = () => {
  return (
    <div className="relative flex flex-col gap-6 sm:gap-7 pl-1 sm:pl-2">
      {/* Vertical Cyan Glowing Track Line */}
      <div className="absolute left-[23px] sm:left-[27px] top-6 bottom-6 w-[2px] bg-gradient-to-b from-cyan-400 via-cyan-500/50 to-cyan-500/10 pointer-events-none shadow-[0_0_8px_rgba(0,210,255,0.4)]" />

      {/* Step 1: ACQUIRE KEY */}
      <div className="relative flex items-start gap-4 sm:gap-5 group">
        {/* Node */}
        <div className="relative z-10 flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#09111c] border-2 border-cyan-400 flex items-center justify-center text-cyan-300 shadow-[0_0_18px_rgba(0,210,255,0.5)] transition-all group-hover:scale-105 group-hover:shadow-[0_0_24px_rgba(0,210,255,0.7)]">
          <Shield className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300" />
        </div>

        {/* Card */}
        <div className="flex-1 bg-[#0d1422]/95 border border-white/10 hover:border-cyan-500/50 rounded-2xl p-5 sm:p-6 backdrop-blur-md transition-all shadow-lg hover:shadow-[0_0_24px_rgba(0,210,255,0.15)]">
          <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
                Step 01
              </span>
              <h3 className="text-base sm:text-lg font-black tracking-wider uppercase font-mono text-white">
                Acquire Key
              </h3>
            </div>
            <a
              href="https://api.henrikdev.xyz/dashboard/"
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 hover:bg-cyan-500/20 border border-cyan-500/40 text-xs font-mono text-cyan-300 hover:text-cyan-200 transition-all font-semibold hover:shadow-[0_0_12px_rgba(0,210,255,0.3)]"
            >
              <span>Get Free Key</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-sans mb-3">
            Sign in to the{' '}
            <a
              href="https://api.henrikdev.xyz/dashboard/"
              target="_blank"
              rel="noreferrer"
              className="text-cyan-400 font-semibold underline underline-offset-2 hover:text-cyan-300 transition-colors"
            >
              HenrikDev dashboard
            </a>{' '}
            via Discord, join their community, and generate your free tier API Key in seconds.
          </p>
          <div className="flex items-center gap-2 text-xs font-mono text-gray-400">
            <Sparkles className="w-3.5 h-3.5 text-cyan-400 flex-shrink-0" />
            <span>Zero-latency official proxy • No password or Riot login required</span>
          </div>
        </div>
      </div>

      {/* Step 2: CONFIGURE */}
      <div className="relative flex items-start gap-4 sm:gap-5 group">
        {/* Node */}
        <div className="relative z-10 flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#09111c] border-2 border-cyan-400/80 flex items-center justify-center text-cyan-300 shadow-[0_0_16px_rgba(0,210,255,0.35)] transition-all group-hover:scale-105 group-hover:shadow-[0_0_24px_rgba(0,210,255,0.6)]">
          <Sliders className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300" />
        </div>

        {/* Card */}
        <div className="flex-1 bg-[#0d1422]/95 border border-white/10 hover:border-cyan-500/50 rounded-2xl p-5 sm:p-6 backdrop-blur-md transition-all shadow-lg hover:shadow-[0_0_24px_rgba(0,210,255,0.15)]">
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
              Step 02
            </span>
            <h3 className="text-base sm:text-lg font-black tracking-wider uppercase font-mono text-white">
              Configure & Style
            </h3>
          </div>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-sans mb-3">
            Enter your Riot ID and Tag, choose your preferred design preset, and toggle match history or other HUD features to match your stream aesthetic.
          </p>
          <div className="flex flex-wrap gap-2 pt-1">
            {['Pill & Card Presets', 'Live RR Counter', 'Rank Win/Loss Streak', 'Custom Opacity'].map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[11px] font-mono text-cyan-300/80 bg-white/5 border border-white/10 px-2.5 py-1 rounded-lg"
              >
                <CheckCircle2 className="w-3 h-3 text-cyan-400" />
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* Step 3: EMBED */}
      <div className="relative flex items-start gap-4 sm:gap-5 group">
        {/* Node */}
        <div className="relative z-10 flex-shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl bg-[#09111c] border-2 border-cyan-400/80 flex items-center justify-center text-cyan-300 shadow-[0_0_16px_rgba(0,210,255,0.35)] transition-all group-hover:scale-105 group-hover:shadow-[0_0_24px_rgba(0,210,255,0.6)]">
          <Link2 className="w-5 h-5 sm:w-6 sm:h-6 text-cyan-300" />
        </div>

        {/* Card */}
        <div className="flex-1 bg-[#0d1422]/95 border border-white/10 hover:border-cyan-500/50 rounded-2xl p-5 sm:p-6 backdrop-blur-md transition-all shadow-lg hover:shadow-[0_0_24px_rgba(0,210,255,0.15)]">
          <div className="flex items-center gap-2.5 mb-2.5">
            <span className="text-[11px] font-mono font-bold text-cyan-400 uppercase tracking-widest px-2 py-0.5 rounded bg-cyan-950/60 border border-cyan-500/30">
              Step 03
            </span>
            <h3 className="text-base sm:text-lg font-black tracking-wider uppercase font-mono text-white">
              Embed In OBS Studio
            </h3>
          </div>
          <p className="text-sm sm:text-base text-gray-300 leading-relaxed font-sans mb-3.5">
            Click <strong>Sync Live Stats & Update Link</strong> and copy the tokenized overlay link. In OBS or Streamlabs, add a new <strong>Browser Source</strong> and paste the URL.
          </p>
          <div className="bg-[#06080d] border border-white/10 rounded-xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs font-mono text-gray-300">
            <div className="flex items-center gap-2">
              <Monitor className="w-4 h-4 text-cyan-400" />
              <span>Recommended Resolution:</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 px-2.5 py-0.5 rounded font-bold">
                1920 × 1080
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
