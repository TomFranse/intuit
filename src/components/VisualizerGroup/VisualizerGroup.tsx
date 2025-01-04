import React from 'react';
import { Box, Paper, Typography } from '@mui/material';
import { WaveformVisualizer } from '../WaveformVisualizer/WaveformVisualizer';
import { SpectrumVisualizer } from '../SpectrumVisualizer/SpectrumVisualizer';
import { HarmonicVisualizer } from '../HarmonicVisualizer/HarmonicVisualizer';
import { visualizerGroupStyles } from './VisualizerGroup.styles';
import * as Tone from 'tone';

interface VisualizerGroupProps {
  oscillator: Tone.Analyser | null;
  gainNode: Tone.Gain | null;
}

export const VisualizerGroup: React.FC<VisualizerGroupProps> = ({ oscillator, gainNode }) => {
  if (!oscillator || !gainNode) return null;

  return (
    <Box sx={visualizerGroupStyles.container}>
      <Box sx={visualizerGroupStyles.section}>
        <Typography variant="h6" gutterBottom>Waveform</Typography>
        <Paper elevation={1} sx={visualizerGroupStyles.visualizerContainer}>
          <WaveformVisualizer
            oscillator={oscillator}
            gainNode={gainNode}
            width={400}
            height={200}
          />
        </Paper>
      </Box>
      
      <Box sx={visualizerGroupStyles.section}>
        <Typography variant="h6" gutterBottom>Frequency Spectrum</Typography>
        <Paper elevation={1} sx={visualizerGroupStyles.visualizerContainer}>
          <SpectrumVisualizer
            oscillator={oscillator}
            gainNode={gainNode}
            width={400}
            height={200}
          />
        </Paper>
      </Box>

      <Box sx={visualizerGroupStyles.section}>
        <Typography variant="h6" gutterBottom>Harmonic Content</Typography>
        <Paper elevation={1} sx={visualizerGroupStyles.visualizerContainer}>
          <HarmonicVisualizer
            oscillator={oscillator}
            gainNode={gainNode}
            width={400}
            height={200}
            maxHarmonics={32}
          />
        </Paper>
      </Box>
    </Box>
  );
}; 