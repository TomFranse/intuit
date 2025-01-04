import * as Tone from 'tone';
import { OmniOscillatorType } from 'tone/build/esm/source/oscillator/OscillatorInterface';

export interface OscillatorParameters {
  frequency: number;
  amplitude: number;
  phase: number;
  type: OmniOscillatorType;
  partialCount: number;
  harmonicity: number;
  modulationIndex?: number;
  harmonics: Array<{ amplitude: number; phase: number }>;
}

export class OscillatorEngine {
  private oscillator: Tone.OmniOscillator<any>;
  private gainNode: Tone.Gain;
  private analyzer: Tone.Analyser;
  private isPlaying: boolean = false;
  private currentParams: OscillatorParameters;
  private context: Tone.Context;

  constructor(context: Tone.Context, initialParams: OscillatorParameters) {
    this.context = context;
    this.currentParams = { ...initialParams };

    // Create audio nodes
    this.gainNode = new Tone.Gain(0, { context }).toDestination();
    this.oscillator = new Tone.OmniOscillator({ context });
    this.analyzer = new Tone.Analyser('waveform', 2048, { context });

    // Connect nodes
    this.oscillator.chain(this.gainNode, this.analyzer);

    // Set initial parameters
    this.setParameters(initialParams);

    // Handle context state changes
    this.context.onstatechange = () => {
      if (this.context.state === 'suspended' && this.isPlaying) {
        this.gainNode.gain.value = 0;
      } else if (this.context.state === 'running' && this.isPlaying) {
        this.gainNode.gain.value = this.currentParams.amplitude;
      }
    };
  }

  public start(): void {
    if (!this.isPlaying && this.context.state === 'running') {
      const now = this.context.now();
      
      try {
        // Start oscillator
        this.oscillator.start(now);
        
        // Ramp up gain
        this.gainNode.gain.cancelScheduledValues(now);
        this.gainNode.gain.setValueAtTime(0, now);
        this.gainNode.gain.linearRampToValueAtTime(
          this.currentParams.amplitude,
          now + 0.1
        );
        
        this.isPlaying = true;
      } catch (error) {
        console.error('Error starting oscillator:', error);
        this.stop();
      }
    }
  }

  public stop(): void {
    if (this.isPlaying) {
      const now = this.context.now();
      
      try {
        // Ramp down gain
        this.gainNode.gain.cancelScheduledValues(now);
        this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
        this.gainNode.gain.linearRampToValueAtTime(0, now + 0.1);
        
        // Schedule oscillator stop
        setTimeout(() => {
          if (this.oscillator && !this.oscillator.disposed) {
            this.oscillator.stop();
          }
        }, 150);
        
        this.isPlaying = false;
      } catch (error) {
        console.error('Error stopping oscillator:', error);
      }
    }
  }

  public setParameters(params: Partial<OscillatorParameters>): void {
    const now = this.context.now();

    try {
      // Update current parameters
      this.currentParams = { ...this.currentParams, ...params };

      // Handle frequency changes
      if ('frequency' in params) {
        this.oscillator.frequency.cancelScheduledValues(now);
        this.oscillator.frequency.setValueAtTime(this.oscillator.frequency.value, now);
        this.oscillator.frequency.linearRampToValueAtTime(params.frequency!, now + 0.1);
      }

      // Handle amplitude changes
      if ('amplitude' in params && this.isPlaying) {
        this.gainNode.gain.cancelScheduledValues(now);
        this.gainNode.gain.setValueAtTime(this.gainNode.gain.value, now);
        this.gainNode.gain.linearRampToValueAtTime(params.amplitude!, now + 0.1);
      }

      // Handle type changes
      if ('type' in params) {
        const wasPlaying = this.isPlaying;
        if (wasPlaying) this.stop();
        
        // Recreate oscillator with new type
        const oldOsc = this.oscillator;
        this.oscillator = new Tone.OmniOscillator({
          ...this.currentParams,
          type: params.type,
          context: this.context,
        });
        this.oscillator.chain(this.gainNode, this.analyzer);
        
        if (wasPlaying) {
          setTimeout(() => {
            this.start();
            oldOsc.dispose();
          }, 150);
        } else {
          oldOsc.dispose();
        }
      }

      // Handle phase changes
      if ('phase' in params) {
        this.oscillator.phase = params.phase!;
      }

      // Handle harmonic changes
      if ('harmonics' in params) {
        this.oscillator.partials = params.harmonics!.map(h => h.amplitude);
      }

      // Handle harmonicity changes
      if ('harmonicity' in params && this.oscillator.harmonicity) {
        this.oscillator.harmonicity.value = params.harmonicity!;
      }

      // Handle modulation index changes
      if ('modulationIndex' in params && this.oscillator.modulationIndex) {
        this.oscillator.modulationIndex.value = params.modulationIndex!;
      }
    } catch (error) {
      console.error('Error setting parameters:', error);
    }
  }

  public getAnalyzer(): Tone.Analyser {
    return this.analyzer;
  }

  public dispose(): void {
    try {
      if (this.isPlaying) {
        this.stop();
      }

      // Wait for gain ramp to complete before disposal
      setTimeout(() => {
        if (this.oscillator && !this.oscillator.disposed) {
          this.oscillator.dispose();
        }
        if (this.gainNode && !this.gainNode.disposed) {
          this.gainNode.dispose();
        }
        if (this.analyzer && !this.analyzer.disposed) {
          this.analyzer.dispose();
        }
      }, 150);
    } catch (error) {
      console.error('Error disposing oscillator engine:', error);
    }
  }
} 