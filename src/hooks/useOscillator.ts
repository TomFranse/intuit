import { useState, useEffect, useCallback, useRef } from 'react';
import * as Tone from 'tone';
import { OmniOscillatorType } from 'tone/build/esm/source/oscillator/OscillatorInterface';
import { OscillatorEngine } from '../audio/OscillatorEngine';
import { useTone } from '../contexts/ToneContext';

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
  const { context, isReady } = useTone();
  const [state, setState] = useState<OscillatorState>(initialState);
  const engineRef = useRef<OscillatorEngine | null>(null);
  const cleanupInProgressRef = useRef(false);

  // Create oscillator engine when context is ready
  useEffect(() => {
    if (!context || !isReady) return;

    if (!engineRef.current) {
      engineRef.current = new OscillatorEngine(context, {
        frequency: state.frequency,
        amplitude: state.amplitude,
        phase: state.phase,
        type: state.type,
        partialCount: state.partialCount,
        harmonicity: state.harmonicity,
        modulationIndex: state.modulationIndex,
        harmonics: state.harmonics,
      });
    }

    return () => {
      if (engineRef.current && !cleanupInProgressRef.current) {
        cleanupInProgressRef.current = true;
        engineRef.current.dispose();
        engineRef.current = null;
        cleanupInProgressRef.current = false;
      }
    };
  }, [context, isReady]);

  // Handle context state changes
  useEffect(() => {
    if (!context) return;

    const handleStateChange = () => {
      if (context.state === 'suspended' && state.isPlaying) {
        setState(prev => ({ ...prev, isPlaying: false }));
      }
    };

    context.onstatechange = handleStateChange;
    return () => {
      if (context) {
        context.onstatechange = null;
      }
    };
  }, [context, state.isPlaying]);

  // Update parameters
  const updateParameters = useCallback((updates: Partial<OscillatorState>) => {
    if (!engineRef.current || cleanupInProgressRef.current || !context) return;

    setState(prev => {
      const newState = { ...prev, ...updates };
      engineRef.current?.setParameters(updates);
      return newState;
    });
  }, [context]);

  // Toggle playback
  const togglePlay = useCallback(() => {
    if (!engineRef.current || cleanupInProgressRef.current || !context) return;

    setState(prev => {
      const newState = { ...prev, isPlaying: !prev.isPlaying };
      
      try {
        if (newState.isPlaying) {
          engineRef.current?.start();
        } else {
          engineRef.current?.stop();
        }
      } catch (error) {
        console.error('Error toggling playback:', error);
        return prev;
      }

      return newState;
    });
  }, [context]);

  // Get analyzer for visualizations
  const getAnalyzer = useCallback(() => {
    return engineRef.current?.getAnalyzer() || null;
  }, []);

  return {
    state,
    updateParameters,
    togglePlay,
    getAnalyzer,
  };
}; 