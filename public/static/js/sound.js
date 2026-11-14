const SoundEngine = {
  ctx: null,
  muted: false,
  init() {
    if (!this.ctx) {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (AudioContext) this.ctx = new AudioContext();
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  },
  playTone(freq, type = 'sine', duration = 0.25, delay = 0, vol = 0.08) {
    if (this.muted) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime + delay;
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, now);
      gain.gain.setValueAtTime(0.001, now);
      gain.gain.exponentialRampToValueAtTime(vol, now + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + duration + 0.02);
    } catch (e) {}
  },
  playPat() {
    this.playTone(523.25, 'sine', 0.22, 0, 0.07);
    this.playTone(659.25, 'sine', 0.28, 0.07, 0.06);
  },
  playComplete() {
    this.playTone(440, 'triangle', 0.25, 0, 0.08);
    this.playTone(554.37, 'triangle', 0.25, 0.09, 0.08);
    this.playTone(659.25, 'triangle', 0.35, 0.18, 0.08);
    this.playTone(880, 'sine', 0.45, 0.27, 0.07);
  },
  playBirthdayTune() {
    const notes = [392, 392, 440, 392, 523.25, 493.88];
    notes.forEach((n, i) => this.playTone(n, 'triangle', 0.28, i * 0.18, 0.08));
  },
  playLevelUp() {
    const notes = [523.25, 659.25, 783.99, 1046.50, 1318.51];
    notes.forEach((n, i) => this.playTone(n, 'sine', 0.35, i * 0.09, 0.09));
  },
  playSoftClick() {
    this.playTone(392.00, 'sine', 0.12, 0, 0.04);
  }
};
