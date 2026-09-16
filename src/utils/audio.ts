// Web Audio API synthesized sound cues for Win and Loss events
// Zero external asset dependencies, instant playback, OBS and browser compatible.

class SoundFX {
  private ctx: AudioContext | null = null;

  private getContext(): AudioContext | null {
    if (typeof window === 'undefined') return null;
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume().catch(() => {});
    }
    return this.ctx;
  }

  playWin(volume = 0.5) {
    try {
      const ctx = this.getContext();
      if (!ctx || volume <= 0) return;

      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume * 0.4, now);
      masterGain.connect(ctx.destination);

      // 4-note victory arpeggio: C5 (523.25), E5 (659.25), G5 (783.99), C6 (1046.50)
      const notes = [523.25, 659.25, 783.99, 1046.5];
      notes.forEach((freq, idx) => {
        const osc = ctx.createOscillator();
        const noteGain = ctx.createGain();

        osc.type = idx === 3 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);

        noteGain.gain.setValueAtTime(0, now + idx * 0.08);
        noteGain.gain.linearRampToValueAtTime(0.7, now + idx * 0.08 + 0.02);
        noteGain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.6);

        osc.connect(noteGain);
        noteGain.connect(masterGain);

        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.65);
      });

      // Shimmer sparkle
      const sparkleOsc = ctx.createOscillator();
      const sparkleGain = ctx.createGain();
      sparkleOsc.type = 'sine';
      sparkleOsc.frequency.setValueAtTime(1318.51, now + 0.28); // E6
      sparkleOsc.frequency.exponentialRampToValueAtTime(1567.98, now + 0.6); // G6
      sparkleGain.gain.setValueAtTime(0.3, now + 0.28);
      sparkleGain.gain.exponentialRampToValueAtTime(0.001, now + 0.8);
      sparkleOsc.connect(sparkleGain);
      sparkleGain.connect(masterGain);
      sparkleOsc.start(now + 0.28);
      sparkleOsc.stop(now + 0.85);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  playLoss(volume = 0.5) {
    try {
      const ctx = this.getContext();
      if (!ctx || volume <= 0) return;

      const now = ctx.currentTime;
      const masterGain = ctx.createGain();
      masterGain.gain.setValueAtTime(volume * 0.5, now);
      masterGain.connect(ctx.destination);

      // Low punch oscillator
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(130.81, now); // C3
      osc.frequency.exponentialRampToValueAtTime(65.41, now + 0.35); // C2

      // Low-pass filter for heavy thud
      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(280, now);
      filter.frequency.exponentialRampToValueAtTime(80, now + 0.4);

      gain.gain.setValueAtTime(0.8, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(masterGain);

      osc.start(now);
      osc.stop(now + 0.55);

      // Defeat descending tone
      const subOsc = ctx.createOscillator();
      const subGain = ctx.createGain();
      subOsc.type = 'sine';
      subOsc.frequency.setValueAtTime(220, now + 0.1); // A3
      subOsc.frequency.linearRampToValueAtTime(174.61, now + 0.5); // F3
      subGain.gain.setValueAtTime(0.4, now + 0.1);
      subGain.gain.exponentialRampToValueAtTime(0.001, now + 0.6);

      subOsc.connect(subGain);
      subGain.connect(masterGain);
      subOsc.start(now + 0.1);
      subOsc.stop(now + 0.65);
    } catch {
      // Audio autoplay policy fallback
    }
  }

  playClick(volume = 0.2) {
    try {
      const ctx = this.getContext();
      if (!ctx || volume <= 0) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(volume * 0.2, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.05);
    } catch {
      // Audio fallback
    }
  }

  playRankUp(volume = 0.5) {
    this.playWin(volume);
  }

  playDerank(volume = 0.5) {
    this.playLoss(volume);
  }
}

export const soundFX = new SoundFX();
export const soundEngine = soundFX;
