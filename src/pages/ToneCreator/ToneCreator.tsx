import { useState, useEffect, useCallback } from 'react';
import * as Tone from 'tone';

interface OscillatorState {
  isPlaying: boolean;
  frequency: number;
  amplitude: number;
  phase: number;
}

const ToneCreator = () => {
  // Track if context is initialized
  const [isContextInitialized, setIsContextInitialized] = useState(false);
  
  // Separate oscillator instances from React state
  const [oscillatorNodes, setOscillatorNodes] = useState<Tone.Oscillator[]>([]);

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

  // Initialize oscillators after context is ready
  useEffect(() => {
    if (!isContextInitialized) return;

    const nodes = [
      new Tone.Oscillator({ type: "sine" }).toDestination(),
      new Tone.Oscillator({ type: "sine" }).toDestination()
    ];

    // Set initial parameters
    nodes.forEach((osc, i) => {
      osc.frequency.value = states[i].frequency;
      osc.volume.value = Tone.gainToDb(states[i].amplitude);
      osc.phase = states[i].phase;
    });

    setOscillatorNodes(nodes);

    // Cleanup
    return () => {
      nodes.forEach(osc => {
        try {
          if (osc.state === "started") {
            osc.stop();
          }
          osc.dispose();
        } catch (error) {
          console.error("Error cleaning up oscillator:", error);
        }
      });
    };
  }, [isContextInitialized]);

  // Initialize context on first user interaction
  const initializeContext = async () => {
    if (!isContextInitialized) {
      try {
        await Tone.start();
        Tone.setContext(new Tone.Context({ 
          latencyHint: "interactive",
          lookAhead: 0.1,
          updateInterval: 0.01
        }));
        setIsContextInitialized(true);
      } catch (error) {
        console.error("Error initializing audio context:", error);
      }
    }
  };

  const updateOscillator = useCallback((index: number, updates: Partial<OscillatorState>) => {
    if (!oscillatorNodes[index]) return;

    setStates(prev => prev.map((state, i) => {
      if (i !== index) return state;
      
      const newState = { ...state, ...updates };
      const osc = oscillatorNodes[i];

      try {
        if ('frequency' in updates) {
          osc.frequency.value = updates.frequency!;
        }
        if ('amplitude' in updates) {
          osc.volume.value = Tone.gainToDb(updates.amplitude!);
        }
        if ('phase' in updates) {
          // For phase changes, we need to restart the oscillator if it's playing
          const wasPlaying = osc.state === "started";
          if (wasPlaying) {
            osc.stop();
          }
          osc.phase = updates.phase!;
          if (wasPlaying) {
            osc.start();
          }
        }
      } catch (error) {
        console.error("Error updating oscillator:", error);
      }
      
      return newState;
    }));
  }, [oscillatorNodes]);

  const togglePlay = useCallback(async (index: number) => {
    if (!oscillatorNodes[index]) return;

    try {
      const osc = oscillatorNodes[index];
      const isPlaying = osc.state === "started";

      if (isPlaying) {
        osc.stop();
      } else {
        osc.start();
      }

      setStates(prev => prev.map((state, i) => 
        i === index ? { ...state, isPlaying: !isPlaying } : state
      ));
    } catch (error) {
      console.error("Error toggling oscillator:", error);
    }
  }, [oscillatorNodes]);

  return (
    <div className="p-6">
      {!isContextInitialized ? (
        <div className="text-center p-8">
          <button
            onClick={initializeContext}
            className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 text-lg"
          >
            Click to Enable Audio
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
        </>
      )}
    </div>
  );
};

export default ToneCreator; 