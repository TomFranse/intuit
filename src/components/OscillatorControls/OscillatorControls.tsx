import React from 'react';
import { Box, Button, Slider, TextField, Typography } from '@mui/material';
import { PlayArrow, Stop } from '@mui/icons-material';
import { OscillatorState } from '../../hooks/useOscillator';
import { HarmonicControls } from '../HarmonicControls/HarmonicControls';
import { oscillatorControlsStyles } from './OscillatorControls.styles';

interface OscillatorControlsProps {
  state: OscillatorState;
  onUpdate: (updates: Partial<OscillatorState>) => void;
  onTogglePlay: () => void;
}

export const OscillatorControls: React.FC<OscillatorControlsProps> = ({
  state,
  onUpdate,
  onTogglePlay,
}) => {
  return (
    <Box sx={oscillatorControlsStyles.container}>
      <Box sx={oscillatorControlsStyles.section}>
        <Button
          variant="contained"
          startIcon={state.isPlaying ? <Stop /> : <PlayArrow />}
          color={state.isPlaying ? "error" : "primary"}
          onClick={onTogglePlay}
          sx={oscillatorControlsStyles.playButton}
        >
          {state.isPlaying ? 'Stop' : 'Play'}
        </Button>
      </Box>

      <Box sx={oscillatorControlsStyles.section}>
        <Typography gutterBottom>Frequency (Hz)</Typography>
        <Box sx={oscillatorControlsStyles.sliderWithInput}>
          <Slider
            value={state.frequency}
            min={20}
            max={2000}
            onChange={(_, value) => onUpdate({ frequency: value as number })}
            valueLabelDisplay="auto"
          />
          <TextField
            type="number"
            size="small"
            value={state.frequency}
            onChange={(e) => onUpdate({ frequency: Number(e.target.value) })}
            inputProps={{ min: 20, max: 2000 }}
          />
        </Box>
      </Box>

      <Box sx={oscillatorControlsStyles.section}>
        <Typography gutterBottom>Amplitude</Typography>
        <Slider
          value={state.amplitude}
          min={0}
          max={1}
          step={0.01}
          onChange={(_, value) => onUpdate({ amplitude: value as number })}
          valueLabelDisplay="auto"
        />
      </Box>

      <Box sx={oscillatorControlsStyles.section}>
        <Typography gutterBottom>Phase (degrees)</Typography>
        <Box sx={oscillatorControlsStyles.sliderWithInput}>
          <Slider
            value={state.phase}
            min={0}
            max={360}
            onChange={(_, value) => onUpdate({ phase: value as number })}
            valueLabelDisplay="auto"
          />
          <TextField
            type="number"
            size="small"
            value={state.phase}
            onChange={(e) => onUpdate({ phase: Number(e.target.value) })}
            inputProps={{ min: 0, max: 360 }}
          />
        </Box>
      </Box>

      <HarmonicControls
        type={state.type}
        partialCount={state.partialCount}
        harmonicity={state.harmonicity}
        modulationIndex={state.modulationIndex}
        harmonics={state.harmonics}
        onTypeChange={(type) => onUpdate({ type })}
        onPartialCountChange={(count) => onUpdate({ partialCount: count })}
        onHarmonicityChange={(value) => onUpdate({ harmonicity: value })}
        onModulationIndexChange={(value) => onUpdate({ modulationIndex: value })}
        onHarmonicChange={(hIndex, harmonic) => {
          const newHarmonics = [...state.harmonics];
          newHarmonics[hIndex] = harmonic;
          onUpdate({ harmonics: newHarmonics });
        }}
      />
    </Box>
  );
}; 