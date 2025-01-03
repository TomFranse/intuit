import { useState, useEffect, useCallback, useRef } from 'react';
import * as Tone from 'tone';
import { useTone } from '../../contexts/ToneContext';
import { OmniOscillatorType, ToneOscillatorType } from 'tone/build/esm/source/oscillator/OscillatorInterface';
import { WaveformVisualizer } from '../../components/WaveformVisualizer/WaveformVisualizer';
import { SpectrumVisualizer } from '../../components/SpectrumVisualizer/SpectrumVisualizer';
import {
  Box,
  Button,
  Container,
  Grid,
  Paper,
  Slider,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Alert,
  useTheme
} from '@mui/material';
import { PlayArrow, Stop } from '@mui/icons-material';

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
  const theme = useTheme();
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

  const renderOscillatorControls = (index: number) => (
    <Paper 
      elevation={3} 
      sx={{ 
        p: 3, 
        mb: 3,
        borderRadius: 2,
        backgroundColor: theme.palette.background.paper
      }}
    >
      <Typography variant="h5" gutterBottom>
        Oscillator {index + 1}
      </Typography>
      
      <Box sx={{ mb: 3 }}>
        <Button
          variant="contained"
          startIcon={states[index].isPlaying ? <Stop /> : <PlayArrow />}
          color={states[index].isPlaying ? "error" : "primary"}
          onClick={() => togglePlay(index)}
          fullWidth
        >
          {states[index].isPlaying ? 'Stop' : 'Play'}
        </Button>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Frequency (Hz)</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={8}>
            <Slider
              value={states[index].frequency}
              min={20}
              max={2000}
              onChange={(_, value) => updateOscillator(index, { frequency: value as number })}
              valueLabelDisplay="auto"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              type="number"
              size="small"
              value={states[index].frequency}
              onChange={(e) => updateOscillator(index, { frequency: Number(e.target.value) })}
              inputProps={{ min: 20, max: 2000 }}
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Amplitude</Typography>
        <Slider
          value={states[index].amplitude}
          min={0}
          max={1}
          step={0.01}
          onChange={(_, value) => updateOscillator(index, { amplitude: value as number })}
          valueLabelDisplay="auto"
        />
      </Box>

      <Box sx={{ mb: 3 }}>
        <Typography gutterBottom>Phase (degrees)</Typography>
        <Grid container spacing={2} alignItems="center">
          <Grid item xs={8}>
            <Slider
              value={states[index].phase}
              min={0}
              max={360}
              onChange={(_, value) => updateOscillator(index, { phase: value as number })}
              valueLabelDisplay="auto"
            />
          </Grid>
          <Grid item xs={4}>
            <TextField
              type="number"
              size="small"
              value={states[index].phase}
              onChange={(e) => updateOscillator(index, { phase: Number(e.target.value) })}
              inputProps={{ min: 0, max: 360 }}
            />
          </Grid>
        </Grid>
      </Box>

      <Box sx={{ mb: 3 }}>
        <FormControl fullWidth>
          <InputLabel>Waveform Type</InputLabel>
          <Select
            value={states[index].type}
            label="Waveform Type"
            onChange={(e) => updateOscillator(index, { type: e.target.value as ToneOscillatorType })}
          >
            <MenuItem value="sine">Sine</MenuItem>
            <MenuItem value="square">Square</MenuItem>
            <MenuItem value="triangle">Triangle</MenuItem>
            <MenuItem value="sawtooth">Sawtooth</MenuItem>
          </Select>
        </FormControl>
      </Box>

      {oscillatorUnits[index] && (
        <Box sx={{ mt: 4 }}>
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>Waveform</Typography>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 1, 
                backgroundColor: theme.palette.grey[50],
                borderRadius: 1
              }}
            >
              <WaveformVisualizer
                oscillator={oscillatorUnits[index].oscillator}
                gainNode={oscillatorUnits[index].gainNode}
                width={400}
                height={200}
              />
            </Paper>
          </Box>
          
          <Box sx={{ mb: 3 }}>
            <Typography variant="h6" gutterBottom>Frequency Spectrum</Typography>
            <Paper 
              elevation={1} 
              sx={{ 
                p: 1, 
                backgroundColor: theme.palette.grey[50],
                borderRadius: 1
              }}
            >
              <SpectrumVisualizer
                oscillator={oscillatorUnits[index].oscillator}
                gainNode={oscillatorUnits[index].gainNode}
                width={400}
                height={200}
              />
            </Paper>
          </Box>
        </Box>
      )}
    </Paper>
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
    <Container maxWidth="xl" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Tone Creator
      </Typography>
      
      {!isInitialized && (
        <Button 
          variant="contained"
          size="large"
          onClick={initializeAudio}
          sx={{ mb: 4 }}
        >
          Enable Audio
        </Button>
      )}

      {isInitialized && (
        <>
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              {renderOscillatorControls(0)}
            </Grid>
            <Grid item xs={12} md={6}>
              {renderOscillatorControls(1)}
            </Grid>
          </Grid>

          <Box sx={{ mt: 4 }}>
            <Button 
              variant="outlined"
              onClick={testPhase}
              sx={{ mb: 2 }}
            >
              Test Phase Cancellation
            </Button>
            {testResult && (
              <Alert severity="info" sx={{ mt: 2 }}>
                {testResult}
              </Alert>
            )}
          </Box>
        </>
      )}
    </Container>
  );
};

export default ToneCreator; 