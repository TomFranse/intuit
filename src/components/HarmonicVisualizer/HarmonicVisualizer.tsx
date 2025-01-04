import React, { useEffect, useRef } from 'react';
import * as Tone from 'tone';

interface HarmonicVisualizerProps {
  oscillator: Tone.Analyser | null;
  gainNode: Tone.Gain | null;
  width: number;
  height: number;
  maxHarmonics?: number;
}

export const HarmonicVisualizer: React.FC<HarmonicVisualizerProps> = ({
  oscillator,
  gainNode,
  width,
  height,
  maxHarmonics = 32,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !oscillator || !gainNode) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set up canvas
    const dpr = window.devicePixelRatio || 1;
    canvas.width = width * dpr;
    canvas.height = height * dpr;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;
    ctx.scale(dpr, dpr);

    // Animation function
    const draw = () => {
      if (!ctx || !oscillator || !gainNode) return;

      try {
        // Get frequency data
        const frequencyData = oscillator.getValue();
        if (!Array.isArray(frequencyData)) return;

        // Clear canvas
        ctx.fillStyle = 'rgba(18, 18, 18, 1)';
        ctx.fillRect(0, 0, width, height);

        // Calculate bar width and spacing
        const numBars = Math.min(maxHarmonics, frequencyData.length);
        const barWidth = (width - (numBars + 1) * 2) / numBars;
        const spacing = 2;

        // Draw frequency bars
        ctx.fillStyle = '#90caf9';
        for (let i = 0; i < numBars; i++) {
          const value = Math.abs(frequencyData[i] || 0);
          const normalizedValue = Math.min(Math.max(value, 0), 1);
          const barHeight = normalizedValue * (height - 40);
          
          ctx.fillRect(
            i * (barWidth + spacing) + spacing,
            height - barHeight - 20,
            barWidth,
            barHeight
          );

          // Draw frequency label
          ctx.fillStyle = '#666';
          ctx.font = '10px Arial';
          ctx.textAlign = 'center';
          ctx.fillText(
            `${((i + 1) * (oscillator.context.sampleRate / oscillator.size)).toFixed(0)} Hz`,
            i * (barWidth + spacing) + spacing + barWidth / 2,
            height - 5
          );
          ctx.fillStyle = '#90caf9';
        }
      } catch (error) {
        console.error('Error in HarmonicVisualizer:', error);
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
  }, [oscillator, gainNode, width, height, maxHarmonics]);

  return (
    <canvas
      ref={canvasRef}
      style={{
        width: `${width}px`,
        height: `${height}px`,
        backgroundColor: 'rgba(18, 18, 18, 1)',
      }}
    />
  );
}; 