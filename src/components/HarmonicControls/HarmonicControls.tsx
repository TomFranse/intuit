import { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Slider,
  Grid,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Collapse,
  IconButton,
  TextField,
} from '@mui/material';
import { ExpandMore, ExpandLess } from '@mui/icons-material';
import { OmniOscillatorType } from 'tone';

interface Harmonic {
  amplitude: number;
  phase: number;
}

interface HarmonicControlsProps {
  type: OmniOscillatorType;
  partialCount: number;
  harmonicity: number;
  modulationIndex?: number;
  harmonics: Harmonic[];
  onTypeChange: (type: OmniOscillatorType) => void;
  onPartialCountChange: (count: number) => void;
  onHarmonicityChange: (value: number) => void;
  onModulationIndexChange?: (value: number) => void;
  onHarmonicChange: (index: number, harmonic: Harmonic) => void;
}

export const HarmonicControls = ({
  type,
  partialCount,
  harmonicity,
  modulationIndex = 0,
  harmonics,
  onTypeChange,
  onPartialCountChange,
  onHarmonicityChange,
  onModulationIndexChange,
  onHarmonicChange,
}: HarmonicControlsProps) => {
  const [expanded, setExpanded] = useState(false);
  const [activeHarmonics, setActiveHarmonics] = useState<Harmonic[]>([]);

  useEffect(() => {
    // Ensure we have the correct number of harmonics
    const newHarmonics = [...harmonics];
    while (newHarmonics.length < partialCount) {
      newHarmonics.push({ amplitude: 1, phase: 0 });
    }
    setActiveHarmonics(newHarmonics.slice(0, partialCount));
  }, [harmonics, partialCount]);

  const isModulated = type.includes('fm') || type.includes('am');
  const isFat = type.includes('fat');

  return (
    <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Harmonic Controls</Typography>
        <IconButton onClick={() => setExpanded(!expanded)} size="small">
          {expanded ? <ExpandLess /> : <ExpandMore />}
        </IconButton>
      </Box>

      <FormControl fullWidth sx={{ mb: 2 }}>
        <InputLabel>Oscillator Type</InputLabel>
        <Select
          value={type}
          label="Oscillator Type"
          onChange={(e) => onTypeChange(e.target.value as OmniOscillatorType)}
        >
          <MenuItem value="sine">Sine</MenuItem>
          <MenuItem value="square">Square</MenuItem>
          <MenuItem value="triangle">Triangle</MenuItem>
          <MenuItem value="sawtooth">Sawtooth</MenuItem>
          <MenuItem value="fmsine">FM Sine</MenuItem>
          <MenuItem value="fmtriangle">FM Triangle</MenuItem>
          <MenuItem value="fmsawtooth">FM Sawtooth</MenuItem>
          <MenuItem value="amsine">AM Sine</MenuItem>
          <MenuItem value="amtriangle">AM Triangle</MenuItem>
          <MenuItem value="amsawtooth">AM Sawtooth</MenuItem>
          <MenuItem value="fatsine">Fat Sine</MenuItem>
          <MenuItem value="fatsawtooth">Fat Sawtooth</MenuItem>
          <MenuItem value="fattriangle">Fat Triangle</MenuItem>
          <MenuItem value="fatsquare">Fat Square</MenuItem>
        </Select>
      </FormControl>

      {isModulated && (
        <Box sx={{ mb: 2 }}>
          <Typography gutterBottom>Harmonicity</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={8}>
              <Slider
                value={harmonicity}
                min={0.1}
                max={5}
                step={0.1}
                onChange={(_, value) => onHarmonicityChange(value as number)}
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                type="number"
                size="small"
                value={harmonicity}
                onChange={(e) => onHarmonicityChange(Number(e.target.value))}
                inputProps={{ min: 0.1, max: 5, step: 0.1 }}
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {type.includes('fm') && onModulationIndexChange && (
        <Box sx={{ mb: 2 }}>
          <Typography gutterBottom>Modulation Index</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={8}>
              <Slider
                value={modulationIndex}
                min={0}
                max={20}
                step={0.1}
                onChange={(_, value) => onModulationIndexChange(value as number)}
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                type="number"
                size="small"
                value={modulationIndex}
                onChange={(e) => onModulationIndexChange(Number(e.target.value))}
                inputProps={{ min: 0, max: 20, step: 0.1 }}
              />
            </Grid>
          </Grid>
        </Box>
      )}

      {!isModulated && !isFat && (
        <Box sx={{ mb: 2 }}>
          <Typography gutterBottom>Partial Count</Typography>
          <Grid container spacing={2} alignItems="center">
            <Grid item xs={8}>
              <Slider
                value={partialCount}
                min={1}
                max={32}
                step={1}
                onChange={(_, value) => onPartialCountChange(value as number)}
                valueLabelDisplay="auto"
              />
            </Grid>
            <Grid item xs={4}>
              <TextField
                type="number"
                size="small"
                value={partialCount}
                onChange={(e) => onPartialCountChange(Number(e.target.value))}
                inputProps={{ min: 1, max: 32, step: 1 }}
              />
            </Grid>
          </Grid>
        </Box>
      )}

      <Collapse in={expanded}>
        {activeHarmonics.map((harmonic, index) => (
          <Paper key={index} elevation={1} sx={{ p: 2, mb: 1 }}>
            <Typography variant="subtitle2" gutterBottom>
              Harmonic {index + 1}
            </Typography>
            
            <Box sx={{ mb: 1 }}>
              <Typography variant="caption">Amplitude</Typography>
              <Slider
                value={harmonic.amplitude}
                min={0}
                max={1}
                step={0.01}
                onChange={(_, value) => 
                  onHarmonicChange(index, { ...harmonic, amplitude: value as number })
                }
                valueLabelDisplay="auto"
              />
            </Box>

            <Box>
              <Typography variant="caption">Phase</Typography>
              <Slider
                value={harmonic.phase}
                min={0}
                max={360}
                step={1}
                onChange={(_, value) => 
                  onHarmonicChange(index, { ...harmonic, phase: value as number })
                }
                valueLabelDisplay="auto"
              />
            </Box>
          </Paper>
        ))}
      </Collapse>
    </Paper>
  );
}; 