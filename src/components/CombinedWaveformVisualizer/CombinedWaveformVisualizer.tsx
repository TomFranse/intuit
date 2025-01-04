import { useEffect, useRef } from 'react';
import { useTheme } from '@mui/material';
import * as Tone from 'tone';
import { visualizerStyles } from '../visualizers.styles';

interface CombinedWaveformVisualizerProps {
  oscillators: {
    oscillator: Tone.OmniOscillator<any>;
    gainNode: Tone.Gain;
  }[];
  width?: number;
  height?: number;
}

export const CombinedWaveformVisualizer = ({
  oscillators,
  width = 300,
  height = 150
}: CombinedWaveformVisualizerProps) => {
  const theme = useTheme();
  const colors = visualizerStyles.colors(theme);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyzerRef = useRef<Tone.Analyser | null>(null);
  const combinerRef = useRef<Tone.Gain | null>(null);
  const animationFrameRef = useRef<number>();

  // Create and connect analyzer
  useEffect(() => {
    // Create combiner and analyzer
    const combiner = new Tone.Gain(1);
    const analyzer = new Tone.Analyser('waveform', 1024);
    
    combinerRef.current = combiner;
    analyzerRef.current = analyzer;

    // Connect all oscillators to combiner
    oscillators.forEach(({ gainNode }) => {
      gainNode.connect(combiner);
    });

    // Connect combiner to analyzer
    combiner.connect(analyzer);

    return () => {
      // Cleanup
      oscillators.forEach(({ gainNode }) => {
        gainNode.disconnect(combiner);
      });
      combiner.disconnect();
      analyzer.dispose();
      combiner.dispose();
      analyzerRef.current = null;
      combinerRef.current = null;
    };
  }, [oscillators]);

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
      ctx.fillStyle = colors.background;
      ctx.fillRect(0, 0, width, height);

      // Draw grid
      ctx.strokeStyle = colors.grid;
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
      ctx.strokeStyle = colors.text;
      ctx.beginPath();
      ctx.moveTo(0, height / 2);
      ctx.lineTo(width, height / 2);
      ctx.stroke();

      // Draw combined waveform
      ctx.beginPath();
      ctx.lineWidth = 2;
      ctx.strokeStyle = colors.combined;
      
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
  }, [width, height, colors]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      style={{ 
        ...visualizerStyles.canvas,
        maxWidth: width,
      }}
    />
  );
}; 