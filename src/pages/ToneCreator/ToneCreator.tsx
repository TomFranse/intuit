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

const degreesToRadians = (degrees: number) => (degrees * Math.PI) / 180;

const ToneCreator = () => {
  const { isInitialized, initializeAudio } = useTone();
  const [oscillatorUnits, setOscillatorUnits] = useState<OscillatorUnit[]>([]);
  const [testResult, setTestResult] = useState<string>("");

  // Initialize oscillators after context is ready
  useEffect(() => {
    if (!isInitialized) return;

    // Create oscillator units with gain nodes
    const units = states.map((state) => {
      const gainNode = new Tone.Gain(0).toDestination();
      const oscillator = new Tone.Oscillator({
        type: "sine",
        frequency: state.frequency,
      })
      .connect(gainNode);

      // Set phase directly (Tone.js handles conversion internally)
      oscillator.phase = state.phase;
      oscillator.start();

      return { oscillator, gainNode };
    });

    setOscillatorUnits(units);

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
          if (state.isPlaying) {
            unit.gainNode.gain.value = updates.amplitude!;
          }
        }
        if ('phase' in updates) {
          // Set phase directly - Tone.js will handle the conversion and waveform update
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

  // Add test function
  const testPhase = useCallback(async () => {
    if (!oscillatorUnits[0] || !oscillatorUnits[1]) return;

    const meter = new Tone.Meter({
      smoothing: 0.9,
    });
    const combiner = new Tone.Gain().connect(meter);
    
    try {
      // Stop any playing oscillators
      states.forEach((state, index) => {
        if (state.isPlaying) {
          togglePlay(index);
        }
      });

      // Connect to meter
      oscillatorUnits.forEach(unit => {
        unit.gainNode.disconnect();
        unit.gainNode.connect(combiner);
      });

      // Set phases (this will recreate oscillators)
      await updateOscillator(0, { frequency: 440, amplitude: 0.5, phase: 0 });
      await updateOscillator(1, { frequency: 440, amplitude: 0.5, phase: 180 });

      // Start playback
      togglePlay(0);
      togglePlay(1);

      // Wait for stable reading
      await new Promise(resolve => setTimeout(resolve, 500));

      const level = meter.getValue() as number;
      setTestResult(`Combined output level: ${level} dB`);
      console.log("Phase test result:", level);

      if (level < -50) {
        setTestResult("Phase cancellation working! Output level: " + level + " dB");
      } else {
        setTestResult("Phase cancellation not complete. Output level: " + level + " dB");
      }

      // Cleanup
      oscillatorUnits.forEach(unit => {
        unit.gainNode.disconnect();
        unit.gainNode.toDestination();
      });

      togglePlay(0);
      togglePlay(1);

    } catch (err) {
      console.error("Error during phase test:", err);
      setTestResult("Test failed: " + (err instanceof Error ? err.message : String(err)));
    } finally {
      meter.dispose();
      combiner.dispose();
    }
  }, [oscillatorUnits, updateOscillator, togglePlay, states]);

  // Add test button to UI
  const renderTestButton = () => (
    <div className="col-span-full text-center mt-4">
      <button
        onClick={testPhase}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Test Phase Cancellation
      </button>
      {testResult && (
        <div className="mt-2 text-sm font-mono">{testResult}</div>
      )}
    </div>
  );

  return (
    <div className="p-6">
      {!isInitialized ? (
        <div className="text-center p-8">
          <button
            onClick={initializeAudio}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-lg"
          >
            Enable Audio
          </button>
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
          {renderTestButton()}
        </>
      )}
    </div>
  );
};

export default ToneCreator; 