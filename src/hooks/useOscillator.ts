import { useState, useEffect, useCallback } from 'react';
import * as Tone from 'tone';
import { OmniOscillatorType } from 'tone/build/esm/source/oscillator/OscillatorInterface';

export interface Harmonic {
  amplitude: number;
  phase: number;
}

export interface OscillatorState {
  isPlaying: boolean;
  frequency: number;
  amplitude: number;
  phase: number;
  type: OmniOscillatorType;
  partialCount: number;
  harmonicity: number;
  modulationIndex?: number;
  harmonics: Harmonic[];
}

export const DEFAULT_OSCILLATOR_STATE: OscillatorState = {
  isPlaying: false,
  frequency: 440,
  amplitude: 0.5,
  phase: 0,
  type: "sine",
  partialCount: 1,
  harmonicity: 1,
  modulationIndex: 0,
  harmonics: [{ amplitude: 1, phase: 0 }],
};

export const useOscillator = (initialState: OscillatorState = DEFAULT_OSCILLATOR_STATE) => {
  const [state, setState] = useState<OscillatorState>(initialState);
  const [oscillator, setOscillator] = useState<Tone.OmniOscillator<any> | null>(null);
  const [gainNode, setGainNode] = useState<Tone.Gain | null>(null);
  const [analyzer, setAnalyzer] = useState<Tone.Analyser | null>(null);

  // Create oscillator with current state
  const createOscillator = useCallback(() => {
    // Clean up existing nodes
    if (oscillator) {
      if (oscillator.state !== 'stopped') {
        oscillator.stop().dispose();
      }
    }
    if (gainNode) gainNode.dispose();
    if (analyzer) analyzer.dispose();

    // Create new nodes
    const newGain = new Tone.Gain(0).toDestination();
    const newAnalyzer = new Tone.Analyser('waveform', 2048);
    const newOsc = new Tone.OmniOscillator({
      frequency: state.frequency,
      type: state.type,
      phase: state.phase,
    });

    // Connect nodes
    newOsc.chain(newGain, newAnalyzer, Tone.Destination);

    // Configure additional parameters
    if (state.harmonics.length > 0) {
      newOsc.partials = state.harmonics.map(h => h.amplitude);
    }

    if (state.type.includes('fm') || state.type.includes('am')) {
      if (newOsc.harmonicity) {
        newOsc.harmonicity.value = state.harmonicity;
      }
      if (state.type.includes('fm') && newOsc.modulationIndex) {
        newOsc.modulationIndex.value = state.modulationIndex || 0;
      }
    }

    // Update state
    setOscillator(newOsc);
    setGainNode(newGain);
    setAnalyzer(newAnalyzer);

    // Start if playing
    if (state.isPlaying) {
      newOsc.start();
      newGain.gain.value = state.amplitude;
    }
  }, [state, oscillator, gainNode, analyzer]);

  // Initialize on mount
  useEffect(() => {
    createOscillator();
    return () => {
      if (oscillator) {
        if (oscillator.state !== 'stopped') {
          oscillator.stop().dispose();
        }
      }
      if (gainNode) gainNode.dispose();
      if (analyzer) analyzer.dispose();
    };
  }, []);

  // Update parameters
  const updateParameters = useCallback((updates: Partial<OscillatorState>) => {
    setState(prev => {
      const newState = { ...prev, ...updates };

      // Handle immediate parameter changes
      if (oscillator && gainNode) {
        const now = Tone.now();

        if ('frequency' in updates) {
          oscillator.frequency.cancelScheduledValues(now);
          oscillator.frequency.setValueAtTime(oscillator.frequency.value, now);
          oscillator.frequency.linearRampToValueAtTime(updates.frequency!, now + 0.1);
        }

        if ('amplitude' in updates && newState.isPlaying) {
          gainNode.gain.cancelScheduledValues(now);
          gainNode.gain.setValueAtTime(gainNode.gain.value, now);
          gainNode.gain.linearRampToValueAtTime(updates.amplitude!, now + 0.1);
        }

        // Recreate oscillator for type/phase/harmonic changes
        if ('type' in updates || 'phase' in updates || 'harmonics' in updates ||
            'harmonicity' in updates || 'modulationIndex' in updates) {
          createOscillator();
        }
      }

      return newState;
    });
  }, [oscillator, gainNode, createOscillator]);

  // Toggle playback
  const togglePlay = useCallback(() => {
    setState(prev => {
      const newState = { ...prev, isPlaying: !prev.isPlaying };

      if (oscillator && gainNode) {
        const now = Tone.now();

        if (newState.isPlaying) {
          if (oscillator.state === 'stopped') {
            oscillator.start(now);
          }
          gainNode.gain.cancelScheduledValues(now);
          gainNode.gain.setValueAtTime(0, now);
          gainNode.gain.linearRampToValueAtTime(newState.amplitude, now + 0.1);
        } else {
          gainNode.gain.cancelScheduledValues(now);
          gainNode.gain.setValueAtTime(gainNode.gain.value, now);
          gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
        }
      }

      return newState;
    });
  }, [oscillator, gainNode]);

  // Get analyzer for visualizations
  const getAnalyzer = useCallback(() => analyzer, [analyzer]);

  return {
    state,
    updateParameters,
    togglePlay,
    getAnalyzer,
  };
}; 