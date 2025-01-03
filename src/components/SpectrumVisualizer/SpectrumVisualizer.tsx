import { useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { useTheme } from '@mui/material';

interface SpectrumVisualizerProps {
  oscillator: Tone.OmniOscillator<any>;
  gainNode: Tone.Gain;
  width?: number;
  height?: number;
}

export const SpectrumVisualizer = ({
  oscillator,
  gainNode,
  width = 300,
  height = 150
}: SpectrumVisualizerProps) => {
  const theme = useTheme();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyzerRef = useRef<Tone.Analyser | null>(null);
  const animationFrameRef = useRef<number>();

  // Create and connect analyzer
  useEffect(() => {
    // Create new analyzer
    const analyzer = new Tone.Analyser('fft', 2048);
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

      // Vertical grid lines (logarithmic scale for frequency)
      const freqLabels = [20, 50, 100, 200, 500, 1000, 2000, 5000];
      freqLabels.forEach(freq => {
        const x = (Math.log10(freq) - Math.log10(20)) / (Math.log10(5000) - Math.log10(20)) * width;
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, height);
        ctx.stroke();

        // Draw frequency labels
        ctx.fillStyle = theme.palette.text.secondary;
        ctx.font = '10px Arial';
        ctx.textAlign = 'center';
        ctx.fillText(freq >= 1000 ? `${freq/1000}k` : freq.toString(), x, height - 2);
      });

      // Horizontal grid lines (dB scale)
      const dbLabels = [-100, -80, -60, -40, -20, 0];
      dbLabels.forEach(db => {
        const y = (1 - (db + 100) / 100) * height;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(width, y);
        ctx.stroke();

        // Draw dB labels
        ctx.fillStyle = theme.palette.text.secondary;
        ctx.font = '10px Arial';
        ctx.textAlign = 'right';
        ctx.fillText(`${db}dB`, 25, y + 3);
      });

      // Draw frequency spectrum
      const gradient = ctx.createLinearGradient(0, 0, 0, height);
      gradient.addColorStop(0, theme.palette.primary.light);
      gradient.addColorStop(1, theme.palette.primary.main);

      ctx.fillStyle = gradient;
      
      for (let i = 0; i < values.length; i++) {
        const dbValue = Math.max(-100, Math.min(0, values[i]));
        const scaledHeight = (dbValue + 100) / 100 * height;
        
        // Use logarithmic scale for x-axis
        const freq = (i / values.length) * 24000;
        const x = (Math.log10(freq + 1) - Math.log10(1)) / (Math.log10(24000) - Math.log10(1)) * width;
        const barWidth = width / values.length * 2;
        
        ctx.fillRect(x, height - scaledHeight, barWidth, scaledHeight);
      }

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