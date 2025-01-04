import { useState, useEffect, useCallback } from 'react';
import * as Tone from 'tone';
import {
  Box,
  Button,
  Grid as MuiGrid,
  Paper,
  Typography,
  IconButton,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
} from '@mui/material';
import {
  Add as AddIcon,
  Delete as DeleteIcon,
  PlayArrow,
  Stop,
} from '@mui/icons-material';
import { useTone } from '../../contexts/ToneContext';
import { AudioInitModal } from '../../components/AudioInitModal/AudioInitModal';
import { EnvelopeControls } from '../../components/EnvelopeControls/EnvelopeControls';
import { WaveformVisualizer } from '../../components/WaveformVisualizer/WaveformVisualizer';
import { CombinedWaveformVisualizer } from '../../components/CombinedWaveformVisualizer/CombinedWaveformVisualizer';
import { noteBuilderStyles } from './NoteBuilder.styles';

interface ToneLayer {
  id: string;
  name: string;
  tone: any; // Will be replaced with proper Tone type from library
  envelope: {
    attack: number;
    decay: number;
    sustain: number;
    release: number;
  };
  gain: number;
  isPlaying: boolean;
}

interface NoteState {
  name: string;
  layers: ToneLayer[];
  isPlaying: boolean;
}

const NoteBuilder = () => {
  const { isInitialized, initializeAudio } = useTone();
  const [showControls, setShowControls] = useState(false);
  const [note, setNote] = useState<NoteState>({
    name: 'New Note',
    layers: [],
    isPlaying: false,
  });
  const [oscillatorUnits, setOscillatorUnits] = useState<{ oscillator: Tone.OmniOscillator<any>; gainNode: Tone.Gain; envelope: Tone.Envelope }[]>([]);

  // Initialize audio units for each layer
  useEffect(() => {
    if (!isInitialized) return;

    // Clean up old units
    oscillatorUnits.forEach(unit => {
      unit.oscillator.stop().dispose();
      unit.gainNode.dispose();
      unit.envelope.dispose();
    });

    // Create new units for each layer
    const newUnits = note.layers.map(layer => {
      const gainNode = new Tone.Gain(0);
      const envelope = new Tone.Envelope({
        attack: layer.envelope.attack,
        decay: layer.envelope.decay,
        sustain: layer.envelope.sustain,
        release: layer.envelope.release,
      });
      const oscillator = new Tone.OmniOscillator({
        // Will be replaced with actual tone parameters from library
        frequency: 440,
        type: 'sine',
      }).connect(gainNode);

      envelope.connect(gainNode.gain);
      gainNode.toDestination();

      return { oscillator, gainNode, envelope };
    });

    setOscillatorUnits(newUnits);

    // Cleanup
    return () => {
      newUnits.forEach(unit => {
        unit.oscillator.stop().dispose();
        unit.gainNode.dispose();
        unit.envelope.dispose();
      });
    };
  }, [note.layers, isInitialized]);

  // Show controls after initialization
  useEffect(() => {
    if (isInitialized && !showControls) {
      setShowControls(true);
    }
  }, [isInitialized]);

  const addLayer = useCallback(() => {
    setNote(prev => ({
      ...prev,
      layers: [
        ...prev.layers,
        {
          id: Date.now().toString(),
          name: `Layer ${prev.layers.length + 1}`,
          tone: null, // Will be replaced with selected tone
          envelope: {
            attack: 0.1,
            decay: 0.2,
            sustain: 0.5,
            release: 0.5,
          },
          gain: 1,
          isPlaying: false,
        },
      ],
    }));
  }, []);

  const removeLayer = useCallback((id: string) => {
    setNote(prev => ({
      ...prev,
      layers: prev.layers.filter(layer => layer.id !== id),
    }));
  }, []);

  const updateLayerEnvelope = useCallback((id: string, envelopeParams: Partial<ToneLayer['envelope']>) => {
    setNote(prev => ({
      ...prev,
      layers: prev.layers.map(layer => {
        if (layer.id === id) {
          return {
            ...layer,
            envelope: {
              ...layer.envelope,
              ...envelopeParams,
            },
          };
        }
        return layer;
      }),
    }));
  }, []);

  const playNote = useCallback(() => {
    if (!isInitialized) return;
    
    const now = Tone.now();
    oscillatorUnits.forEach((unit, index) => {
      unit.oscillator.start(now);
      unit.envelope.triggerAttack(now);
    });
    setNote(prev => ({ ...prev, isPlaying: true }));
  }, [oscillatorUnits, isInitialized]);

  const stopNote = useCallback(() => {
    if (!isInitialized) return;

    const now = Tone.now();
    oscillatorUnits.forEach((unit, index) => {
      unit.envelope.triggerRelease(now);
      // Schedule oscillator stop after release
      unit.oscillator.stop(now + note.layers[index].envelope.release + 0.1);
    });
    setNote(prev => ({ ...prev, isPlaying: false }));
  }, [oscillatorUnits, note.layers, isInitialized]);

  return (
    <Box sx={{ width: '100%' }}>
      <Typography variant="h4" gutterBottom sx={{ mb: 4 }}>
        Note Builder
      </Typography>

      <AudioInitModal 
        open={!isInitialized} 
        onInitialize={initializeAudio} 
      />

      {showControls && (
        <MuiGrid container spacing={3}>
          {/* Layer List */}
          <MuiGrid item xs={12} lg={4}>
            <Paper elevation={3} sx={noteBuilderStyles.layerPanel}>
              <Box sx={noteBuilderStyles.layerHeader}>
                <Typography variant="h6">Layers</Typography>
                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={addLayer}
                  size="large"
                >
                  Add Layer
                </Button>
              </Box>
              <List sx={noteBuilderStyles.layerList}>
                {note.layers.map((layer, index) => (
                  <ListItem 
                    key={layer.id}
                    sx={{
                      mb: 1,
                      bgcolor: 'background.default',
                      borderRadius: 1
                    }}
                  >
                    <ListItemText
                      primary={layer.name}
                      secondary={`Gain: ${layer.gain}`}
                    />
                    <ListItemSecondaryAction>
                      <IconButton
                        edge="end"
                        aria-label="delete"
                        onClick={() => removeLayer(layer.id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </ListItemSecondaryAction>
                  </ListItem>
                ))}
              </List>
            </Paper>
          </MuiGrid>

          {/* Envelope Controls */}
          <MuiGrid item xs={12} lg={8}>
            <Paper elevation={3} sx={noteBuilderStyles.controlPanel}>
              <Box sx={noteBuilderStyles.buttonGroup}>
                <Typography variant="h6" gutterBottom>
                  Note Controls
                </Typography>
                <Button
                  variant="contained"
                  startIcon={note.isPlaying ? <Stop /> : <PlayArrow />}
                  onClick={note.isPlaying ? stopNote : playNote}
                  size="large"
                >
                  {note.isPlaying ? 'Stop' : 'Play'} Note
                </Button>
              </Box>

              {note.layers.map((layer, index) => (
                <Box key={layer.id} sx={noteBuilderStyles.layerControls}>
                  <Typography variant="subtitle1" gutterBottom>
                    {layer.name} Envelope
                  </Typography>
                  <EnvelopeControls
                    envelope={layer.envelope}
                    onChange={(params) => updateLayerEnvelope(layer.id, params)}
                  />
                  {oscillatorUnits[index] && (
                    <Box sx={noteBuilderStyles.visualizerContainer}>
                      <Typography variant="subtitle2" gutterBottom>
                        Waveform
                      </Typography>
                      <WaveformVisualizer
                        oscillator={oscillatorUnits[index].oscillator}
                        gainNode={oscillatorUnits[index].gainNode}
                        width={400}
                        height={150}
                      />
                    </Box>
                  )}
                </Box>
              ))}

              {note.layers.length > 0 && oscillatorUnits.length > 0 && (
                <Box sx={noteBuilderStyles.combinedVisualizer}>
                  <Typography variant="h6" gutterBottom>
                    Combined Waveform
                  </Typography>
                  <CombinedWaveformVisualizer
                    oscillators={oscillatorUnits}
                    width={400}
                    height={200}
                  />
                </Box>
              )}
            </Paper>
          </MuiGrid>
        </MuiGrid>
      )}
    </Box>
  );
};

export default NoteBuilder; 