import React, { createContext, useContext, useState, useCallback, useRef, useEffect } from 'react';
import * as Tone from 'tone';

interface ToneContextType {
  isInitialized: boolean;
  isReady: boolean;
  context: Tone.Context | null;
  initializeAudio: () => Promise<void>;
  cleanupAudio: () => Promise<void>;
}

const ToneContext = createContext<ToneContextType | undefined>(undefined);

export const ToneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [context, setContext] = useState<Tone.Context | null>(null);
  const cleanupInProgressRef = useRef(false);

  // Monitor context state changes
  useEffect(() => {
    if (!context) return;

    const handleStateChange = () => {
      setIsReady(context.state === 'running');
    };

    context.onstatechange = handleStateChange;
    return () => {
      if (context) {
        context.onstatechange = null;
      }
    };
  }, [context]);

  const cleanupAudio = useCallback(async () => {
    if (cleanupInProgressRef.current) return;
    cleanupInProgressRef.current = true;

    try {
      // Stop transport
      Tone.Transport.stop();
      Tone.Transport.cancel();

      if (context) {
        // Get all source nodes
        const sourceNodes = Array.from(context.activeSourceNodes || []);
        
        // Disconnect and dispose all nodes
        await Promise.all(sourceNodes.map(async node => {
          try {
            if (node && !node.disposed) {
              // Ramp down gain to avoid clicks
              if ('gain' in node) {
                const now = context.now();
                node.gain.cancelScheduledValues(now);
                node.gain.setValueAtTime(node.gain.value, now);
                node.gain.linearRampToValueAtTime(0, now + 0.1);
                await new Promise(resolve => setTimeout(resolve, 150));
              }
              node.disconnect();
              node.dispose();
            }
          } catch (error) {
            console.warn('Error disposing node:', error);
          }
        }));

        // Close context only if it's not already closed
        if (context.state !== 'closed') {
          try {
            await context.close();
          } catch (error) {
            console.warn('Error closing context:', error);
          }
        }
      }

      // Reset state
      setIsInitialized(false);
      setIsReady(false);
      setContext(null);
    } catch (error) {
      console.error('Error during audio cleanup:', error);
    } finally {
      cleanupInProgressRef.current = false;
    }
  }, [context]);

  const initializeAudio = useCallback(async () => {
    try {
      // If there's an existing context that's not closed, try to resume it
      if (context && context.state !== 'closed') {
        await context.resume();
        setIsInitialized(true);
        setIsReady(true);
        return;
      }

      // Clean up any existing audio if the context is closed
      if (context?.state === 'closed') {
        await cleanupAudio();
      }

      // Create new context
      const newContext = new Tone.Context({
        latencyHint: 'interactive',
        lookAhead: 0.1,
        updateInterval: 0.05,
      });

      // Set as global context
      Tone.setContext(newContext);
      setContext(newContext);

      // Start audio context
      await Tone.start();
      await newContext.resume();
      
      // Configure transport
      Tone.Transport.bpm.value = 120;
      
      setIsInitialized(true);
      setIsReady(true);
    } catch (error) {
      console.error("Failed to initialize audio:", error);
      // If initialization fails, clean up completely
      await cleanupAudio();
    }
  }, [context, cleanupAudio]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (context && context.state !== 'closed') {
        cleanupAudio();
      }
    };
  }, [context, cleanupAudio]);

  return (
    <ToneContext.Provider value={{ isInitialized, isReady, context, initializeAudio, cleanupAudio }}>
      {children}
    </ToneContext.Provider>
  );
};

export const useTone = () => {
  const context = useContext(ToneContext);
  if (context === undefined) {
    throw new Error('useTone must be used within a ToneProvider');
  }
  return context;
}; 