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

  constructor(initialParams: OscillatorParameters) {
    // Create audio nodes
    this.gainNode = new Tone.Gain(0).toDestination();
    this.oscillator = new Tone.OmniOscillator();
    this.analyzer = new Tone.Analyser('waveform', 1024);

    // Connect nodes
    this.oscillator.chain(this.gainNode, this.analyzer);

    // Set initial parameters
    this.setParameters(initialParams);
  }

  public start(): void {
    if (!this.isPlaying) {
      const now = Tone.now();
      this.oscillator.start(now);
      this.isPlaying = true;
    }
  }

  public stop(): void {
    if (this.isPlaying) {
      const now = Tone.now();
      this.gainNode.gain.rampTo(0, 0.1, now);
      this.isPlaying = false;
    }
  }

  public setParameters(params: Partial<OscillatorParameters>): void {
    const now = Tone.now();

    if ('frequency' in params) {
      this.oscillator.frequency.rampTo(params.frequency!, 0.1, now);
    }

    if ('amplitude' in params && this.isPlaying) {
      this.gainNode.gain.rampTo(params.amplitude!, 0.1, now);
    }

    if ('type' in params) {
      this.oscillator.type = params.type!;
    }

    if ('phase' in params) {
      this.oscillator.phase = params.phase!;
    }

    if ('harmonics' in params) {
      this.oscillator.partials = params.harmonics!.map(h => h.amplitude);
    }

    if ('harmonicity' in params && this.oscillator.harmonicity) {
      this.oscillator.harmonicity.value = params.harmonicity!;
    }

    if ('modulationIndex' in params && this.oscillator.modulationIndex) {
      this.oscillator.modulationIndex.value = params.modulationIndex!;
    }
  }

  public getAnalyzer(): Tone.Analyser {
    return this.analyzer;
  }

  public dispose(): void {
    if (this.isPlaying) {
      this.stop();
    }
    this.oscillator.dispose();
    this.gainNode.dispose();
    this.analyzer.dispose();
  }
} 