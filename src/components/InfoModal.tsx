import React, { useState } from 'react';
import { X, ShieldAlert, BookOpen, Lock } from 'lucide-react';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'faq' | 'privacy' | 'terms' | null;
}

export const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose, type }) => {
  if (!isOpen || !type) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
      <div
        className="w-full max-w-2xl bg-[#0d121c] border border-white/15 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/10 bg-black/40">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-cyan-500/15 text-cyan-400">
              {type === 'faq' && <BookOpen className="w-5 h-5" />}
              {type === 'privacy' && <Lock className="w-5 h-5" />}
              {type === 'terms' && <ShieldAlert className="w-5 h-5" />}
            </div>
            <h3 className="text-white font-bold text-lg font-mono uppercase tracking-wider">
              {type === 'faq' && 'FAQ & Help'}
              {type === 'privacy' && 'Privacy Policy'}
              {type === 'terms' && 'Terms & Conditions'}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6 text-sm text-gray-300 font-sans leading-relaxed">
          {type === 'faq' && (
            <>
              <div className="space-y-2">
                <h4 className="text-white font-bold font-mono text-base text-cyan-300">
                  Why do I need my own API Key?
                </h4>
                <p className="text-gray-400">
                  Using your own key guarantees you don't hit global rate limits and ensures your widget stays online consistently during your streams.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10">
                <h4 className="text-white font-bold font-mono text-base text-cyan-300">
                  Is my Riot account safe?
                </h4>
                <p className="text-gray-400">
                  Yes. We never ask for your Riot password. The HenrikDev API only pulls public matchmaking data using your Riot ID and Tagline.
                </p>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10">
                <h4 className="text-white font-bold font-mono text-base text-cyan-300">
                  How do I resize in OBS?
                </h4>
                <p className="text-gray-400">
                  Set the Browser Source to 1920x1080 for the sharpest quality. You can then scale the source visually in your OBS canvas.
                </p>
              </div>
            </>
          )}

          {type === 'privacy' && (
            <>
              <div className="space-y-3">
                <h4 className="text-white font-bold font-mono text-lg text-cyan-300">
                  We do not store your data. Period.
                </h4>
                <p className="text-gray-400">
                  This application operates completely statically on the client-side. We do not maintain any backend database or server storage for your information.
                </p>
                <p className="text-gray-400">
                  Your Riot ID, Username, and HenrikDev API keys are never stored on our servers. The application simply takes your inputs to securely generate a unique URI overlay link for your OBS Browser Source, communicating directly with the HenrikDev API infrastructure.
                </p>
              </div>
            </>
          )}

          {type === 'terms' && (
            <>
              <div className="space-y-3">
                <h4 className="text-white font-bold font-mono text-lg text-cyan-300">
                  Community-Driven Project
                </h4>
                <p className="text-gray-400">
                  This is a fan-made, community-driven project created by The Alpha Uniq.
                </p>
                <p className="text-gray-400">
                  By using this tool, you acknowledge that you are using it at your own risk. This overlay utilizes the public HenrikDev Valorant API and serves as a highly customizable, modern design alternative to existing widgets.
                </p>
                <p className="text-gray-400">
                  This project is strictly unofficial and is not endorsed by, affiliated with, or supported by Riot Games or HenrikDev. Always keep your API keys and overlay URLs private. Do not share your OBS Browser Source link publicly, as it contains your authentication fragment.
                </p>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-white/10 bg-black/40 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold font-mono text-xs transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
