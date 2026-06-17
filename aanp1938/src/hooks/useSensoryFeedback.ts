"use client";

import { useRef, useCallback, useEffect } from "react";

export function useSensoryFeedback() {
  const audioCtxRef = useRef<AudioContext | null>(null);
  const gainRef = useRef<GainNode | null>(null);
  const bowlOscRef = useRef<OscillatorNode | null>(null);
  const isInitialized = useRef(false);

  const initAudio = useCallback(() => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    const ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    audioCtxRef.current = ctx;

    // Master gain — extremely subtle
    const masterGain = ctx.createGain();
    masterGain.gain.setValueAtTime(0.0, ctx.currentTime);
    masterGain.connect(ctx.destination);
    gainRef.current = masterGain;

    // Ambient singing bowl hum — low frequency fundamental ~111Hz (Himalayan bowl)
    const osc = ctx.createOscillator();
    osc.type = "sine";
    osc.frequency.setValueAtTime(111, ctx.currentTime);

    // Add a subtle 5th harmonic for richness
    const osc2 = ctx.createOscillator();
    osc2.type = "sine";
    osc2.frequency.setValueAtTime(166.5, ctx.currentTime); // perfect 5th

    const harmGain = ctx.createGain();
    harmGain.gain.setValueAtTime(0.3, ctx.currentTime);

    // Slow tremolo — breathe in 8s cycle
    const tremoloOsc = ctx.createOscillator();
    tremoloOsc.type = "sine";
    tremoloOsc.frequency.setValueAtTime(0.125, ctx.currentTime); // 8s cycle
    const tremoloGain = ctx.createGain();
    tremoloGain.gain.setValueAtTime(0.02, ctx.currentTime);
    tremoloOsc.connect(tremoloGain);
    tremoloGain.connect(masterGain.gain);

    osc2.connect(harmGain);
    harmGain.connect(masterGain);
    osc.connect(masterGain);

    osc.start();
    osc2.start();
    tremoloOsc.start();
    bowlOscRef.current = osc;

    // Fade in ambience over 4 seconds
    masterGain.gain.linearRampToValueAtTime(0.018, ctx.currentTime + 4);
  }, []);

  const triggerInteraction = useCallback(() => {
    if (!audioCtxRef.current || !gainRef.current) return;
    const ctx = audioCtxRef.current;

    // A microscopic "thud" — short sine burst at bowl resonance
    const pulse = ctx.createOscillator();
    const pulseGain = ctx.createGain();
    pulse.type = "sine";
    pulse.frequency.setValueAtTime(333, ctx.currentTime);
    pulse.frequency.exponentialRampToValueAtTime(111, ctx.currentTime + 0.08);
    pulseGain.gain.setValueAtTime(0.0, ctx.currentTime);
    pulseGain.gain.linearRampToValueAtTime(0.04, ctx.currentTime + 0.005);
    pulseGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.12);
    pulse.connect(pulseGain);
    pulseGain.connect(ctx.destination);
    pulse.start(ctx.currentTime);
    pulse.stop(ctx.currentTime + 0.15);

    // Haptic
    if ("vibrate" in navigator) {
      navigator.vibrate([8]);
    }
  }, []);

  useEffect(() => {
    // Initialize on first user gesture
    const init = () => initAudio();
    document.addEventListener("click", init, { once: true });
    document.addEventListener("mousemove", init, { once: true });
    return () => {
      document.removeEventListener("click", init);
      document.removeEventListener("mousemove", init);
    };
  }, [initAudio]);

  return { triggerInteraction };
}
