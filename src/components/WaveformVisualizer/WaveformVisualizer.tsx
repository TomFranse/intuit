import { useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { useTheme } from '@mui/material';

interface WaveformVisualizerProps {
  oscillator: Tone.OmniOscillator<any>;
  gainNode: Tone.Gain;
  width?: number;
  height?: number;
}

export const WaveformVisualizer = ({ 
  oscillator, 
  gainNode, 
  width = 300, 
  height = 150 
}: WaveformVisualizerProps) => {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyzerRef = useRef<Tone.Analyser | null>(null);
  const animationFrameRef = useRef<number>();

  // Create and connect analyzer
  useEffect(() => {
    // Create new analyzer
    const analyzer = new Tone.Analyser('waveform', 1024);
    analyzerRef.current = analyzer;

    // Connect to the audio chain
    gainNode.connect(analyzer);

    return () => {
      // Cleanup
      gainNode.disconnect(analyzer);
      analyzer.dispose();
      analyzerRef.current = null;
    };
  }, [gainNode]);

  // Handle visualization
  useEffect(() => {
    if (!canvasRef.current || !analyzerRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      if (!analyzerRef.current) return;

      const values = analyzerRef.current.getValue() as Float32Array;
      
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

      // Draw center line
      ctx.strokeStyle = theme.palette.text.secondary;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Draw waveform
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = theme.palette.primary.main;
      
      const sliceWidth = width / values.length;
      let x = 0;

      for (let i = 0; i < values.length; i++) {
        const y = (values[i] + 1) / 2 * height;

        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Request next frame
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    // Start animation
    draw();

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [width, height, theme]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ 
        width: '100%',
        height: 'auto',
        maxWidth: width,
        display: 'block',
        margin: '0 auto'
      }}
    />
  );
}; 