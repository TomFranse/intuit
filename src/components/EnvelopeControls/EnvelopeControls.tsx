import { useEffect, useRef, useCallback } from 'react';
import {
  Box,
  Grid,
  Slider,
  Typography,
  useTheme,
} from '@mui/material';

export interface EnvelopeParams {
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

interface EnvelopeControlsProps {
  envelope: EnvelopeParams;
  onChange: (params: Partial<EnvelopeParams>) => void;
}

export const EnvelopeControls = ({ envelope, onChange }: EnvelopeControlsProps) => {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  const drawEnvelopeCurve = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = 20;

    // Clear canvas
    ctx.fillStyle = theme.palette.background.paper;
    ctx.fillRect(0, 0, width, height);

    // Draw grid
    ctx.strokeStyle = theme.palette.divider;
    ctx.lineWidth = 1;

    // Vertical grid lines
    for (let x = 0; x <= width; x += width / 8) {
      ctx.beginPath();
      ctx.moveTo(x, 0);
      ctx.lineTo(x, height);
      ctx.stroke();
    }

    // Horizontal grid lines
    for (let y = 0; y <= height; y += height / 4) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    // Calculate time points
    const totalTime = envelope.attack + envelope.decay + 1 + envelope.release; // 1 second for sustain
    const attackX = (envelope.attack / totalTime) * (width - padding * 2) + padding;
    const decayX = ((envelope.attack + envelope.decay) / totalTime) * (width - padding * 2) + padding;
    const sustainX = ((envelope.attack + envelope.decay + 1) / totalTime) * (width - padding * 2) + padding;
    const releaseX = width - padding;

    // Draw envelope curve
    ctx.beginPath();
    ctx.strokeStyle = theme.palette.primary.main;
    ctx.lineWidth = 2;

    // Start point
    ctx.moveTo(padding, height - padding);

    // Attack (linear)
    ctx.lineTo(attackX, padding);

    // Decay (exponential)
    ctx.bezierCurveTo(
      attackX + (decayX - attackX) * 0.5, padding,
      attackX + (decayX - attackX) * 0.5, height - padding - (height - 2 * padding) * envelope.sustain,
      decayX, height - padding - (height - 2 * padding) * envelope.sustain
    );

    // Sustain (horizontal line)
    ctx.lineTo(sustainX, height - padding - (height - 2 * padding) * envelope.sustain);

    // Release (exponential)
    ctx.bezierCurveTo(
      sustainX + (releaseX - sustainX) * 0.5, height - padding - (height - 2 * padding) * envelope.sustain,
      sustainX + (releaseX - sustainX) * 0.5, height - padding,
      releaseX, height - padding
    );

    ctx.stroke();

    // Add labels
    ctx.fillStyle = theme.palette.text.primary;
    ctx.font = '12px Arial';
    ctx.textAlign = 'center';
    
    ctx.fillText('A', attackX, height - 5);
    ctx.fillText('D', decayX, height - 5);
    ctx.fillText('S', (decayX + sustainX) / 2, height - 5);
    ctx.fillText('R', sustainX + (releaseX - sustainX) / 2, height - 5);
  }, [envelope, theme]);

  useEffect(() => {
    drawEnvelopeCurve();
  }, [drawEnvelopeCurve]);

  return (
    <Box>
      <canvas
        ref={canvasRef}
        width={600}
        height={200}
        style={{
          width: '100%',
          maxWidth: 600,
          height: 'auto',
          marginBottom: theme.spacing(2),
          backgroundColor: theme.palette.background.paper,
          borderRadius: theme.shape.borderRadius,
        }}
      />

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <Typography gutterBottom>Attack (s)</Typography>
          <Slider
            value={envelope.attack}
            min={0.01}
            max={2}
            step={0.01}
            onChange={(_, value) => onChange({ attack: value as number })}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography gutterBottom>Decay (s)</Typography>
          <Slider
            value={envelope.decay}
            min={0.01}
            max={2}
            step={0.01}
            onChange={(_, value) => onChange({ decay: value as number })}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography gutterBottom>Sustain</Typography>
          <Slider
            value={envelope.sustain}
            min={0}
            max={1}
            step={0.01}
            onChange={(_, value) => onChange({ sustain: value as number })}
            valueLabelDisplay="auto"
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <Typography gutterBottom>Release (s)</Typography>
          <Slider
            value={envelope.release}
            min={0.01}
            max={2}
            step={0.01}
            onChange={(_, value) => onChange({ release: value as number })}
            valueLabelDisplay="auto"
          />
        </Grid>
      </Grid>
    </Box>
  );
}; 