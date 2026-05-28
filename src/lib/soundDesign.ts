/**
 * Sound Design System
 * Subtle audio feedback and ambient modes for emotional attachment.
 * All sounds are generated with Web Audio API (no external files).
 */

export type AmbientSound = "none" | "rain" | "cafe" | "deep-focus" | "synth";

export interface SoundSettings {
  enabled: boolean;
  volume: number; // 0-1
  keyboardSounds: boolean;
  uiSounds: boolean;
  ambientMode: AmbientSound;
  ambientVolume: number; // 0-1
}

export const defaultSoundSettings: SoundSettings = {
  enabled: false,
  volume: 0.3,
  keyboardSounds: false,
  uiSounds: true,
  ambientMode: "none",
  ambientVolume: 0.15,
};

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return audioContext;
}

/**
 * Play a soft click/tap sound (keyboard)
 */
export function playKeyClick(volume: number = 0.1): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const oscillator = ctx.createOscillator();
  const gainNode = ctx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(ctx.destination);

  oscillator.type = "sine";
  oscillator.frequency.setValueAtTime(800, ctx.currentTime);
  oscillator.frequency.exponentialRampToValueAtTime(200, ctx.currentTime + 0.05);

  gainNode.gain.setValueAtTime(volume * 0.3, ctx.currentTime);
  gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);

  oscillator.start(ctx.currentTime);
  oscillator.stop(ctx.currentTime + 0.05);
}

/**
 * Play paper flip sound (page change, export start)
 */
export function playPaperFlip(volume: number = 0.3): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  // White noise burst shaped like paper
  const bufferSize = ctx.sampleRate * 0.15;
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);

  for (let i = 0; i < bufferSize; i++) {
    const t = i / bufferSize;
    // Envelope: quick attack, medium decay
    const envelope = Math.exp(-t * 15) * Math.sin(t * Math.PI);
    data[i] = (Math.random() * 2 - 1) * envelope;
  }

  const source = ctx.createBufferSource();
  source.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "highpass";
  filter.frequency.value = 2000;

  const gainNode = ctx.createGain();
  gainNode.gain.value = volume * 0.4;

  source.connect(filter);
  filter.connect(gainNode);
  gainNode.connect(ctx.destination);

  source.start();
}

/**
 * Play export completion chime
 */
export function playExportChime(volume: number = 0.3): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const notes = [523.25, 659.25, 783.99]; // C5, E5, G5 - major chord
  const now = ctx.currentTime;

  notes.forEach((freq, i) => {
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.type = "sine";
    osc.frequency.value = freq;

    const startTime = now + i * 0.08;
    gain.gain.setValueAtTime(0, startTime);
    gain.gain.linearRampToValueAtTime(volume * 0.2, startTime + 0.02);
    gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.8);

    osc.start(startTime);
    osc.stop(startTime + 0.8);
  });
}

/**
 * Play subtle hover sound
 */
export function playHover(volume: number = 0.05): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = "sine";
  osc.frequency.value = 1200;

  gain.gain.setValueAtTime(volume * 0.15, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.06);

  osc.start();
  osc.stop(ctx.currentTime + 0.06);
}

/**
 * Play click/select sound
 */
export function playClick(volume: number = 0.2): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  const osc = ctx.createOscillator();
  const gain = ctx.createGain();

  osc.connect(gain);
  gain.connect(ctx.destination);

  osc.type = "triangle";
  osc.frequency.setValueAtTime(600, ctx.currentTime);
  osc.frequency.exponentialRampToValueAtTime(300, ctx.currentTime + 0.08);

  gain.gain.setValueAtTime(volume * 0.25, ctx.currentTime);
  gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.1);

  osc.start();
  osc.stop(ctx.currentTime + 0.1);
}

/**
 * Ambient noise generator (brown noise for rain/focus)
 */
let ambientSource: AudioBufferSourceNode | null = null;
let ambientGain: GainNode | null = null;

export function startAmbient(mode: AmbientSound, volume: number = 0.15): void {
  stopAmbient();
  if (mode === "none") return;

  const ctx = getAudioContext();
  if (!ctx) return;

  const bufferSize = ctx.sampleRate * 4; // 4 second loop
  const buffer = ctx.createBuffer(2, bufferSize, ctx.sampleRate);

  for (let channel = 0; channel < 2; channel++) {
    const data = buffer.getChannelData(channel);
    let lastValue = 0;

    for (let i = 0; i < bufferSize; i++) {
      const white = Math.random() * 2 - 1;

      switch (mode) {
        case "rain":
          // Brown noise with rain-like characteristics
          lastValue = (lastValue + (0.02 * white)) / 1.02;
          data[i] = lastValue * 3.5 + (Math.random() > 0.998 ? (Math.random() - 0.5) * 0.3 : 0);
          break;
        case "cafe":
          // Pink-ish noise with subtle rhythmic elements
          lastValue = (lastValue * 0.95) + (white * 0.05);
          data[i] = lastValue * 2 + (Math.sin(i * 0.001) * 0.02);
          break;
        case "deep-focus":
          // Very low frequency drone
          lastValue = (lastValue + (0.01 * white)) / 1.01;
          data[i] = lastValue * 2 + Math.sin(i * 0.0003) * 0.1;
          break;
        case "synth":
          // Gentle pad-like atmosphere
          data[i] = (
            Math.sin(i * 0.0005) * 0.15 +
            Math.sin(i * 0.0003) * 0.1 +
            Math.sin(i * 0.0007) * 0.05 +
            white * 0.02
          );
          break;
      }
    }
  }

  ambientSource = ctx.createBufferSource();
  ambientSource.buffer = buffer;
  ambientSource.loop = true;

  ambientGain = ctx.createGain();
  ambientGain.gain.value = volume;

  const filter = ctx.createBiquadFilter();
  filter.type = "lowpass";
  filter.frequency.value = mode === "rain" ? 800 : mode === "synth" ? 2000 : 1200;

  ambientSource.connect(filter);
  filter.connect(ambientGain);
  ambientGain.connect(ctx.destination);

  ambientSource.start();
}

export function stopAmbient(): void {
  if (ambientSource) {
    try { ambientSource.stop(); } catch {}
    ambientSource = null;
  }
  ambientGain = null;
}

export function setAmbientVolume(volume: number): void {
  if (ambientGain) {
    ambientGain.gain.value = volume;
  }
}

/**
 * Load/save sound settings
 */
export function loadSoundSettings(): SoundSettings {
  if (typeof window === "undefined") return defaultSoundSettings;
  try {
    const stored = localStorage.getItem("markflow-sound-settings");
    return stored ? JSON.parse(stored) : defaultSoundSettings;
  } catch {
    return defaultSoundSettings;
  }
}

export function saveSoundSettings(settings: SoundSettings): void {
  if (typeof window === "undefined") return;
  localStorage.setItem("markflow-sound-settings", JSON.stringify(settings));
}
