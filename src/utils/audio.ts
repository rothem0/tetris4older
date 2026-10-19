/**
 * Senior-Friendly Web Audio and Gentle Korean Voice Encouragement
 * Uses warm pentatonic chime tones (no abrasive buzzers) and soft speech
 */

class SoundManager {
  private ctx: AudioContext | null = null;
  private soundEnabled: boolean = true;
  private voiceEnabled: boolean = true;
  private volume: number = 0.7;

  constructor() {
    // Lazily initialized on first user interaction to comply with browser autoplay policy
  }

  private initContext() {
    if (!this.ctx && typeof window !== 'undefined') {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        this.ctx = new AudioCtx();
      }
    }
    if (this.ctx && this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public updateConfig(soundEnabled: boolean, voiceEnabled: boolean, volume: number) {
    this.soundEnabled = soundEnabled;
    this.voiceEnabled = voiceEnabled;
    this.volume = Math.max(0, Math.min(1, volume));
  }

  /**
   * Warm marimba / acoustic chime tone using gentle sine/triangle waves
   */
  public playTone(frequency: number, duration: number = 0.25, type: OscillatorType = 'sine', gainMultiplier: number = 1) {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();

      osc.type = type;
      osc.frequency.setValueAtTime(frequency, this.ctx.currentTime);

      const targetGain = this.volume * 0.3 * gainMultiplier;
      gain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(targetGain, this.ctx.currentTime + 0.03);
      gain.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch {
      // Ignore audio context errors gracefully
    }
  }

  // Soft wooden move click (warm, subtle)
  public playMove() {
    this.playTone(330, 0.08, 'triangle', 0.6); // E4 soft tap
  }

  // Soft rotation chime
  public playRotate() {
    this.playTone(440, 0.12, 'sine', 0.8); // A4 clear chime
  }

  // Block landing soft thud (wooden block contact)
  public playDrop() {
    if (!this.soundEnabled) return;
    try {
      this.initContext();
      if (!this.ctx) return;

      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(180, this.ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(80, this.ctx.currentTime + 0.15);

      gain.gain.setValueAtTime(this.volume * 0.4, this.ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.15);

      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start();
      osc.stop(this.ctx.currentTime + 0.16);
    } catch {
      // Graceful
    }
  }

  // Inspiring line clear chord (warm major arpeggio: C5 - E5 - G5 - C6)
  public playLineClear(linesCount: number = 1) {
    if (!this.soundEnabled) return;
    const notes = linesCount > 1 ? [523.25, 659.25, 783.99, 1046.5] : [523.25, 659.25, 783.99];
    notes.forEach((freq, index) => {
      setTimeout(() => {
        this.playTone(freq, 0.4, 'sine', 1.0);
      }, index * 70);
    });
  }

  // Gentle undo chime (reverse chime)
  public playUndo() {
    this.playTone(440, 0.12, 'sine', 0.7);
    setTimeout(() => this.playTone(349.23, 0.18, 'sine', 0.7), 80);
  }

  // Hint activated pleasant chime
  public playHint() {
    this.playTone(587.33, 0.15, 'sine', 0.8); // D5
    setTimeout(() => this.playTone(880.0, 0.25, 'sine', 0.9), 100); // A5
  }

  // Encouraging game completed fanfare (warm singing chime)
  public playCelebration() {
    if (!this.soundEnabled) return;
    const melody = [523.25, 659.25, 783.99, 880.0, 1046.5];
    melody.forEach((freq, i) => {
      setTimeout(() => {
        this.playTone(freq, 0.45, 'sine', 1.1);
      }, i * 90);
    });
  }

  // Tactile vibration for mobile
  public triggerVibrate(pattern: number | number[] = 25) {
    if (typeof window !== 'undefined' && 'vibrate' in navigator) {
      try {
        navigator.vibrate(pattern);
      } catch {
        // Safe ignore
      }
    }
  }

  /**
   * Gentle, respectful Korean speech encouragement
   */
  public speakEncouragement(phrase: string) {
    if (!this.voiceEnabled) return;
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;

    try {
      window.speechSynthesis.cancel(); // Stop prior sentence to avoid queue lag
      const utterance = new SpeechSynthesisUtterance(phrase);
      utterance.lang = 'ko-KR';
      utterance.rate = 0.88; // Slightly slower, very articulate and comfortable for seniors
      utterance.pitch = 1.05; // Friendly warm pitch
      utterance.volume = this.volume;

      const voices = window.speechSynthesis.getVoices();
      const koVoice = voices.find(v => v.lang.includes('ko') || v.lang.includes('KO'));
      if (koVoice) {
        utterance.voice = koVoice;
      }

      window.speechSynthesis.speak(utterance);
    } catch {
      // Ignore speech synth error
    }
  }
}

export const soundManager = new SoundManager();

export const ENCOURAGEMENT_PHRASES = {
  start: [
    '천천히 즐겁게 시작해 보세요.',
    '두뇌가 맑아지는 시간입니다.',
    '오늘도 건강하게 두뇌 운동을 시작합니다.',
  ],
  lineClearSingle: [
    '잘하셨습니다!',
    '한 줄 완성! 참 잘 맞추셨어요.',
    '좋습니다! 차근차근 잘 가고 계세요.',
    '아주 훌륭하세요!',
  ],
  lineClearMulti: [
    '대단하십니다! 연속으로 시원하게 맞추셨어요!',
    '와! 정말 대단한 공간 감각이십니다!',
    '최고입니다! 머리가 아주 상쾌해집니다!',
  ],
  hintUsed: [
    '추천 자리에 맞춰보세요.',
    '천천히 자리를 확인해보세요.',
  ],
  undoUsed: [
    '언제든 다시 놓으셔도 괜찮습니다.',
    '마음 편히 천천히 맞춰보세요.',
  ],
  rescueUsed: [
    '위기를 멋지게 넘기셨습니다!',
    '숨을 한 번 고르고 다시 해보세요.',
  ],
  pause: [
    '잠시 쉬어가세요. 준비되면 언제든 계속하실 수 있습니다.',
  ],
  levelUp: [
    '놀라운 집중력이십니다! 두뇌가 활짝 깨어납니다.',
  ]
};

export function getRandomPhrase(phrases: string[]): string {
  const index = Math.floor(Math.random() * phrases.length);
  return phrases[index];
}
