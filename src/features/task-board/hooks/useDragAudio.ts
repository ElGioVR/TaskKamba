"use client";

type DragSound = "lift" | "drop" | "cancel";

let audioContext: AudioContext | null = null;

export function playDragSound(type: DragSound) {
  if (typeof window === "undefined") return;

  const AudioContextConstructor =
    window.AudioContext ||
    (window as Window & { webkitAudioContext?: typeof AudioContext })
      .webkitAudioContext;

  if (!AudioContextConstructor) return;

  audioContext = audioContext || new AudioContextConstructor();
  if (audioContext.state === "suspended") {
    void audioContext.resume();
  }

  const now = audioContext.currentTime;
  const oscillator = audioContext.createOscillator();
  const gain = audioContext.createGain();
  const settings = {
    lift: { start: 360, end: 520, duration: 0.1, volume: 0.045 },
    drop: { start: 520, end: 220, duration: 0.12, volume: 0.055 },
    cancel: { start: 240, end: 180, duration: 0.08, volume: 0.035 },
  }[type];

  oscillator.type = "triangle";
  oscillator.frequency.setValueAtTime(settings.start, now);
  oscillator.frequency.exponentialRampToValueAtTime(
    settings.end,
    now + settings.duration,
  );

  gain.gain.setValueAtTime(0.0001, now);
  gain.gain.exponentialRampToValueAtTime(settings.volume, now + 0.015);
  gain.gain.exponentialRampToValueAtTime(0.0001, now + settings.duration);

  oscillator.connect(gain);
  gain.connect(audioContext.destination);
  oscillator.start(now);
  oscillator.stop(now + settings.duration + 0.02);
}
