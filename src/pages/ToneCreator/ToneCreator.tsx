import { useState, useEffect, useCallback, useRef } from 'react';
import * as Tone from 'tone';
import { useTone } from '../../contexts/ToneContext';
import { OmniOscillatorType, ToneOscillatorType } from 'tone/build/esm/source/oscillator/OscillatorInterface';

interface OscillatorState {
  isPlaying: boolean;
  frequency: number;
  amplitude: number;
  phase: number;
  type: ToneOscillatorType;
  partialCount?: number;
  harmonicity?: number;
}

interface OscillatorUnit {
  oscillator: Tone.OmniOscillator<any>;
  gainNode: Tone.Gain;
}

const ToneCreator = () => {
  const { isInitialized, initializeAudio } = useTone();
  const [oscillatorUnits, setOscillatorUnits] = useState<OscillatorUnit[]>([]);
  const [testResult, setTestResult] = useState<string>("");
  const [transportTime, setTransportTime] = useState<number>(0);
  const animationFrameRef = useRef<number>();

  const [states, setStates] = useState<OscillatorState[]>([
    {
      isPlaying: false,
      frequency: 440,
      amplitude: 0.5,
      phase: 0,
      type: "sine",
      partialCount: 0,
      harmonicity: 1,
    },
    {
      isPlaying: false,
      frequency: 660,
      amplitude: 0.5,
      phase: 0,
      type: "sine",
      partialCount: 0,
      harmonicity: 1,
    },
  ]);

  const setupOscillators = useCallback(() => {
    // Reset and start Transport
    Tone.Transport.stop();
    Tone.Transport.seconds = 0;
    
    console.log("Setting up oscillators at Transport time:", Tone.Transport.seconds);
    console.log("Transport state:", Tone.Transport.state);

    // Create both oscillators at the same time
    const startTime = Tone.Transport.now() + 0.1; // Small delay for setup
    const units: OscillatorUnit[] = [];

    // Create both oscillators before starting either
    for (let i = 0; i < 2; i++) {
      const gainNode = new Tone.Gain(0).toDestination();
      const oscillator = new Tone.OmniOscillator(
        states[i].frequency,
        states[i].type as OmniOscillatorType
      ).connect(gainNode);
      
      // Set phase before sync
      oscillator.phase = states[i].phase / 360;

      console.log(`Oscillator ${i} cycle info:`, {
        frequency: Number(oscillator.frequency.value),
        phase: oscillator.phase,
        cycleLength: 1 / Number(oscillator.frequency.value)
      });

      // Sync to transport before starting
      oscillator.sync();

      units.push({
        oscillator,
        gainNode,
      });
    }

    // Start Transport before starting oscillators
    Tone.Transport.start(startTime);

    // Start both oscillators at exactly the same time
    units.forEach((unit, i) => {
      console.log(`Starting oscillator ${i}:`, {
        frequency: Number(unit.oscillator.frequency.value),
        phase: unit.oscillator.phase,
        startTime
      });
      unit.oscillator.start(startTime);
      if (states[i].isPlaying) {
        unit.gainNode.gain.setValueAtTime(states[i].amplitude, startTime);
      }
    });

    setOscillatorUnits(units);
  }, [states]);

  // Initialize oscillators when component mounts
  useEffect(() => {
    setupOscillators();
    return () => {
      // Stop Transport and cleanup oscillators
      Tone.Transport.stop();
      oscillatorUnits.forEach(unit => {
        unit.oscillator.stop().dispose();
        unit.gainNode.dispose();
      });
    };
  }, []); // Empty dependency array since setupOscillators handles state internally

  const updateOscillator = useCallback((index: number, updates: Partial<OscillatorState>) => {
    if (!oscillatorUnits[index]) return;

    setStates(prev => prev.map((state, i) => {
      if (i !== index) return state;
      
      const newState = { ...state, ...updates };
      const unit = oscillatorUnits[i];

      try {
        // Need to recreate oscillator if frequency or phase changes
        if ('frequency' in updates || 'phase' in updates) {
          const currentTime = Tone.Transport.now();
          const startTime = Number(currentTime) + 0.1;
          const newFrequency = 'frequency' in updates ? Number(updates.frequency!) : Number(unit.oscillator.frequency.value);
          const newPhase = 'phase' in updates ? Number(updates.phase!) / 360 : unit.oscillator.phase;
          
          console.log(`Recreating oscillator ${index}:`, {
            frequency: newFrequency,
            phase: newPhase,
            cycleLength: 1 / Number(newFrequency),
            transportTime: currentTime
          });

          // Stop current oscillator
          const wasPlaying = states[index].isPlaying;
          if (wasPlaying) {
            unit.gainNode.gain.setValueAtTime(0, currentTime);
          }

          // Create new oscillator with all current settings
          const newOsc = new Tone.OmniOscillator(
            newFrequency,
            unit.oscillator.type as OmniOscillatorType
          ).connect(unit.gainNode);

          // Set phase before sync
          newOsc.phase = newPhase;

          // Sync and start at precise time
          newOsc.sync();
          newOsc.start(startTime);

          // Schedule gain change
          if (wasPlaying) {
            unit.gainNode.gain.setValueAtTime(state.amplitude, startTime);
          }

          // Schedule old oscillator cleanup
          unit.oscillator.stop(startTime).dispose();
          unit.oscillator = newOsc;

          console.log(`New oscillator state:`, {
            frequency: newOsc.frequency.value,
            phase: newOsc.phase,
            transportTime: currentTime,
            scheduledStartTime: startTime,
            cycleLength: 1 / newFrequency
          });
        } else if ('amplitude' in updates && state.isPlaying) {
          unit.gainNode.gain.value = updates.amplitude!;
        } else if ('type' in updates) {
          unit.oscillator.type = updates.type! as OmniOscillatorType;
        }
      } catch (error) {
        console.error("Error updating oscillator:", error);
      }
      
      return newState;
    }));
  }, [oscillatorUnits, states]);

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

  // Update transport time display
  useEffect(() => {
    if (!isInitialized) return;

    const updateTime = () => {
      setTransportTime(Tone.Transport.seconds);
      animationFrameRef.current = requestAnimationFrame(updateTime);
    };

    updateTime();

    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [isInitialized]);

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
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">Dual Tone Creator</h1>
            <div className="font-mono text-sm">
              Transport Time: {transportTime.toFixed(3)}s
            </div>
          </div>
          
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

                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Oscillator Type
                    </label>
                    <select
                      value={state.type}
                      onChange={(e) => updateOscillator(index, { type: e.target.value as ToneOscillatorType })}
                      className="w-full px-2 py-1 border rounded"
                    >
                      <option value="sine">Sine</option>
                      <option value="square">Square</option>
                      <option value="triangle">Triangle</option>
                      <option value="sawtooth">Sawtooth</option>
                      <option value="fmsine">FM Sine</option>
                      <option value="amsine">AM Sine</option>
                      <option value="fatsine">Fat Sine</option>
                    </select>
                  </div>
                  
                  {(state.type.includes('fm') || state.type.includes('am')) && (
                    <div>
                      <label className="block text-sm font-medium mb-2">
                        Harmonicity
                      </label>
                      <div className="flex gap-4 items-center">
                        <input
                          type="range"
                          min="0.1"
                          max="5"
                          step="0.1"
                          value={state.harmonicity}
                          onChange={(e) => updateOscillator(index, { harmonicity: Number(e.target.value) })}
                          className="flex-1"
                        />
                        <input
                          type="number"
                          min="0.1"
                          max="5"
                          step="0.1"
                          value={state.harmonicity}
                          onChange={(e) => updateOscillator(index, { harmonicity: Number(e.target.value) })}
                          className="w-20 px-2 py-1 border rounded"
                        />
                      </div>
                    </div>
                  )}

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