import { useEffect, useRef } from 'react';
import * as Tone from 'tone';
import { useTheme } from '@mui/material';
import { visualizerStyles } from '../visualizers.styles';

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
  const colors = visualizerStyles.colors(theme);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const analyzerRef = useRef<Tone.Analyser | null>(null);
  const animationFrameRef = useRef<number>();
  const isDisposingRef = useRef(false);

  // Create and connect analyzer
  useEffect(() => {
    if (isDisposingRef.current) return;

    try {
      // Create new analyzer
      const analyzer = new Tone.Analyser('waveform', 1024);
      analyzerRef.current = analyzer;

      // Safely connect to the audio chain
      if (gainNode && !gainNode.disposed) {
        gainNode.connect(analyzer);
      }

      return () => {
        isDisposingRef.current = true;
        // Cleanup
        if (analyzerRef.current && !analyzerRef.current.disposed) {
          try {
            if (gainNode && !gainNode.disposed) {
              gainNode.disconnect(analyzerRef.current);
            }
            analyzerRef.current.dispose();
          } catch (error) {
            console.warn('Cleanup warning in WaveformVisualizer:', error);
          }
        }
        analyzerRef.current = null;
        isDisposingRef.current = false;
      };
    } catch (error) {
      console.error('Error in WaveformVisualizer setup:', error);
      return () => {
        isDisposingRef.current = false;
      };
    }
  }, [gainNode]);

  // Handle visualization
  useEffect(() => {
    if (!canvasRef.current || !analyzerRef.current || isDisposingRef.current) return;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const draw = () => {
      if (!analyzerRef.current || analyzerRef.current.disposed || isDisposingRef.current) {
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
        return;
      }

      try {
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

        // Draw waveform
        ctx.beginPath();
        ctx.lineWidth = 2;
        ctx.strokeStyle = colors.waveform;
        
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

        // Request next frame only if not disposing
        if (!isDisposingRef.current) {
          animationFrameRef.current = requestAnimationFrame(draw);
        }
      } catch (error) {
        console.warn('Error in visualization loop:', error);
        if (animationFrameRef.current) {
          cancelAnimationFrame(animationFrameRef.current);
        }
      }
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