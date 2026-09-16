import React, { useState } from 'react';
import { X, Tv, Layers, Monitor } from 'lucide-react';
import { OverlayConfig } from '../types';
import { OverlayWidget } from './OverlayWidget';

interface EnlargePreviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: OverlayConfig;
  celebrationType?: 'victory' | 'defeat' | null;
  onDismissCelebration?: () => void;
}

export const EnlargePreviewModal: React.FC<EnlargePreviewModalProps> = ({
  isOpen,
  onClose,
  config,
  celebrationType,
  onDismissCelebration,
}) => {
  const [bgMode, setBgMode] = useState<'transparent' | 'ingame' | 'green' | 'dark'>('ingame');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-6 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-[#0b0f17] border border-cyan-500/30 rounded-2xl shadow-[0_0_50px_rgba(0,0,0,0.8)] overflow-hidden flex flex-col max-h-[96vh] sm:max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between px-4 sm:px-6 py-3 sm:py-4 border-b border-white/10 bg-[#0e1422] gap-3">
          <div className="flex items-center justify-between w-full sm:w-auto gap-3">
            <div className="flex items-center gap-2">
              <span className="text-cyan-400 font-mono font-bold">&gt;_</span>
              <h3 className="text-white font-bold text-sm sm:text-base tracking-wide">
                HUD Live Stage Preview
              </h3>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="sm:hidden p-2 rounded-lg bg-white/10 hover:bg-white/20 text-white transition-colors cursor-pointer"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-between w-full sm:w-auto gap-3">
            {/* Background switcher */}
            <div className="flex items-center gap-1 bg-[#141b2b] p-1 rounded-lg border border-white/10 text-[11px] sm:text-xs overflow-x-auto max-w-full">
              <button
                type="button"
                onClick={() => setBgMode('ingame')}
                className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${
                  bgMode === 'ingame' ? 'bg-cyan-500 text-black font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                In-Game
              </button>
              <button
                type="button"
                onClick={() => setBgMode('dark')}
                className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${
                  bgMode === 'dark' ? 'bg-cyan-500 text-black font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                Grid
              </button>
              <button
                type="button"
                onClick={() => setBgMode('green')}
                className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${
                  bgMode === 'green' ? 'bg-emerald-500 text-black font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                Green
              </button>
              <button
                type="button"
                onClick={() => setBgMode('transparent')}
                className={`px-2 py-1 rounded transition-colors whitespace-nowrap ${
                  bgMode === 'transparent' ? 'bg-cyan-500 text-black font-bold' : 'text-gray-400 hover:text-white'
                }`}
              >
                Check
              </button>
            </div>

            <button
              type="button"
              onClick={onClose}
              className="hidden sm:block p-1.5 rounded-lg bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white transition-colors cursor-pointer"
              title="Close Preview"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Preview Canvas */}
        <div
          className={`relative flex-1 min-h-[360px] sm:min-h-[500px] flex items-center justify-center p-4 sm:p-8 overflow-hidden transition-colors ${
            bgMode === 'green'
              ? 'bg-[#00b140]'
              : bgMode === 'dark'
              ? 'bg-[#090d14] bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]'
              : bgMode === 'transparent'
              ? 'bg-[#121620] bg-[linear-gradient(45deg,#181f2f_25%,transparent_25%),linear-gradient(-45deg,#181f2f_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#181f2f_75%),linear-gradient(-45deg,transparent_75%,#181f2f_75%)] [background-size:20px_20px] [background-position:0_0,0_10px,10px_-10px,-10px_0px]'
              : 'bg-[#0a0e17]'
          }`}
        >
          {bgMode === 'ingame' && (
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {/* Valorant In-Game Atmosphere Backdrop */}
              <div
                className="absolute inset-0 bg-cover bg-center opacity-40 scale-105"
                style={{
                  backgroundImage:
                    'url("https://images.unsplash.com/photo-1542751371-adc38448a05e?auto=format&fit=crop&w=1920&q=80")',
                }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f17] via-transparent to-[#0b0f17]/60" />
            </div>
          )}

          {/* Centered Overlay Widget */}
          <div className="relative z-10 scale-75 sm:scale-100 md:scale-110 transition-transform">
            <OverlayWidget
              config={config}
              isStandalone={false}
              celebrationType={celebrationType}
              onDismissCelebration={onDismissCelebration}
            />
          </div>

          <div className="absolute bottom-3 left-4 text-[11px] font-mono text-white/50 pointer-events-none hidden sm:block">
            OBS Resolution: 1920 × 1080 | Preset: {config.theme.toUpperCase()}
          </div>
        </div>
      </div>
    </div>
  );
};
