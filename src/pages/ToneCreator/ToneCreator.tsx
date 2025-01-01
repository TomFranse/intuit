import { useState, useEffect, useCallback } from 'react';
import * as Tone from 'tone';
import { useTone } from '../../contexts/ToneContext';

interface OscillatorState {
  isPlaying: boolean;
  frequency: number;
  amplitude: number;
  phase: number;
}

interface OscillatorUnit {
  oscillator: Tone.Oscillator;
  gainNode: Tone.Gain;
}

const ToneCreator = () => {
  const { isInitialized } = useTone();
  const [oscillatorUnits, setOscillatorUnits] = useState<OscillatorUnit[]>([]);

  // Initialize oscillators after context is ready
  useEffect(() => {
    if (!isInitialized) return;

    // Create oscillator units with gain nodes
    const units = states.map(() => {
      const gainNode = new Tone.Gain(0).toDestination();
      const oscillator = new Tone.Oscillator({ type: "sine" })
        .connect(gainNode)
        .sync()
        .start();

      return { oscillator, gainNode };
    });

    // Set initial parameters
    units.forEach((unit, i) => {
      unit.oscillator.frequency.value = states[i].frequency;
      unit.oscillator.phase = states[i].phase;
    });

    setOscillatorUnits(units);

    // Start transport after oscillators are ready
    Tone.Transport.start();

    return () => {
      units.forEach(unit => {
        try {
          unit.gainNode.dispose();
          unit.oscillator.dispose();
        } catch (error) {
          console.error("Error cleaning up oscillator unit:", error);
        }
      });
    };
  }, [isInitialized]);

  const [states, setStates] = useState<OscillatorState[]>([
    {
      isPlaying: false,
      frequency: 440,
      amplitude: 0.5,
      phase: 0,
    },
    {
      isPlaying: false,
      frequency: 660,
      amplitude: 0.5,
      phase: 0,
    },
  ]);

  const updateOscillator = useCallback((index: number, updates: Partial<OscillatorState>) => {
    if (!oscillatorUnits[index]) return;

    setStates(prev => prev.map((state, i) => {
      if (i !== index) return state;
      
      const newState = { ...state, ...updates };
      const unit = oscillatorUnits[i];

      try {
        if ('frequency' in updates) {
          unit.oscillator.frequency.value = updates.frequency!;
        }
        if ('amplitude' in updates) {
          // Only update gain if oscillator is playing
          if (state.isPlaying) {
            unit.gainNode.gain.value = updates.amplitude!;
          }
        }
        if ('phase' in updates) {
          unit.oscillator.phase = updates.phase!;
        }
      } catch (error) {
        console.error("Error updating oscillator:", error);
      }
      
      return newState;
    }));
  }, [oscillatorUnits]);

  const togglePlay = useCallback((index: number) => {
    if (!oscillatorUnits[index]) return;

    try {
      const unit = oscillatorUnits[index];
      const newIsPlaying = !states[index].isPlaying;

      // Use gain to control playback
      unit.gainNode.gain.value = newIsPlaying ? states[index].amplitude : 0;

      setStates(prev => prev.map((state, i) => 
        i === index ? { ...state, isPlaying: newIsPlaying } : state
      ));
    } catch (error) {
      console.error("Error toggling oscillator:", error);
    }
  }, [oscillatorUnits, states]);

  return (
    <div className="p-6">
      {!isInitialized ? (
        <div className="text-center p-8">
          <p>Initializing audio...</p>
        </div>
      ) : (
        <>
          <h1 className="text-2xl font-bold mb-6">Dual Tone Creator</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {states.map((state, index) => (
              <div key={index} className="p-6 bg-white rounded-lg shadow-md">
                <h2 className="text-xl font-semibold mb-4">Tone {index + 1}</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Frequency
                    </label>
                    <div className="flex gap-4 items-center">
                      <input
                        type="range"
                        min="20"
                        max="2000"
                        value={state.frequency}
                        onChange={(e) => updateOscillator(index, { frequency: Number(e.target.value) })}
                        className="flex-1"
                      />
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="20"
                          max="2000"
                          value={state.frequency}
                          onChange={(e) => updateOscillator(index, { frequency: Number(e.target.value) })}
                          className="w-20 px-2 py-1 border rounded"
                        />
                        <span className="text-sm">Hz</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Amplitude
                    </label>
                    <div className="flex gap-4 items-center">
                      <input
                        type="range"
                        min="0"
                        max="1"
                        step="0.01"
                        value={state.amplitude}
                        onChange={(e) => updateOscillator(index, { amplitude: Number(e.target.value) })}
                        className="flex-1"
                      />
                      <input
                        type="number"
                        min="0"
                        max="1"
                        step="0.01"
                        value={state.amplitude}
                        onChange={(e) => updateOscillator(index, { amplitude: Number(e.target.value) })}
                        className="w-20 px-2 py-1 border rounded"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Phase
                    </label>
                    <div className="flex gap-4 items-center">
                      <input
                        type="range"
                        min="0"
                        max="360"
                        value={state.phase}
                        onChange={(e) => updateOscillator(index, { phase: Number(e.target.value) })}
                        className="flex-1"
                      />
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0"
                          max="360"
                          value={state.phase}
                          onChange={(e) => updateOscillator(index, { phase: Number(e.target.value) })}
                          className="w-20 px-2 py-1 border rounded"
                        />
                        <span className="text-sm">°</span>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={() => togglePlay(index)}
                    className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                  >
                    {state.isPlaying ? 'Stop' : 'Play'}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ToneCreator; 