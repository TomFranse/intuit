import React, { useState, useCallback } from 'react';
import { Box, Button, Paper, Typography, Alert } from '@mui/material';
import * as Tone from 'tone';
import { CombinedWaveformVisualizer } from '../CombinedWaveformVisualizer/CombinedWaveformVisualizer';
import { phaseTestSectionStyles } from './PhaseTestSection.styles';
import { OscillatorState } from '../../hooks/useOscillator';

interface PhaseTestSectionProps {
  oscillators: { oscillator: any; gainNode: any }[];
  onUpdateOscillator: (index: number, updates: Partial<OscillatorState>) => void;
  onTogglePlay: (index: number) => void;
}

export const PhaseTestSection: React.FC<PhaseTestSectionProps> = ({
  oscillators,
  onUpdateOscillator,
  onTogglePlay,
}) => {
  const [testResult, setTestResult] = useState<string>('');

  const testPhase = useCallback(async () => {
    if (oscillators.length < 2) return;

    const meter = new Tone.Meter();
    const combiner = new Tone.Gain(1).connect(meter);
    
    try {
      // Reset oscillators to same frequency and amplitude
      await Promise.all([
        onUpdateOscillator(0, { 
          frequency: 440, 
          amplitude: 0.5, 
          phase: 0,
          type: "sine"
        }),
        onUpdateOscillator(1, { 
          frequency: 440, 
          amplitude: 0.5, 
          phase: 180,
          type: "sine"
        })
      ]);

      // Connect to meter
      oscillators.forEach(({ gainNode }) => {
        gainNode.disconnect();
        gainNode.connect(combiner);
      });

      // Start playback
      onTogglePlay(0);
      onTogglePlay(1);

      // Wait for stable reading
      await new Promise(resolve => setTimeout(resolve, 500));

      const level = meter.getValue() as number;
      setTestResult(`Phase test result: ${level.toFixed(2)} dB`);

      // Restore connections
      oscillators.forEach(({ gainNode }) => {
        gainNode.disconnect(combiner);
        gainNode.toDestination();
      });

      // Stop playback
      onTogglePlay(0);
      onTogglePlay(1);

    } catch (err) {
      console.error("Phase test error:", err);
      setTestResult("Test failed: " + String(err));
    } finally {
      meter.dispose();
      combiner.dispose();
    }
  }, [oscillators, onUpdateOscillator, onTogglePlay]);

  return (
    <Box sx={phaseTestSectionStyles.container}>
      <Typography variant="h6" gutterBottom>Phase Test</Typography>
      <Paper elevation={1} sx={phaseTestSectionStyles.content}>
        <Box sx={phaseTestSectionStyles.description}>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            This test shows the combined waveform of both oscillators. 
            When the oscillators are 180° out of phase with the same frequency and amplitude, 
            they should cancel each other out.
          </Typography>
        </Box>

        <Box sx={phaseTestSectionStyles.visualizer}>
          <CombinedWaveformVisualizer
            oscillators={oscillators}
            width={400}
            height={200}
          />
        </Box>

        <Button 
          variant="outlined"
          onClick={testPhase}
          fullWidth
        >
          Test Phase Cancellation
        </Button>
        
        {testResult && (
          <Alert severity="info" sx={phaseTestSectionStyles.result}>
            {testResult}
          </Alert>
        )}
      </Paper>
    </Box>
  );
}; 