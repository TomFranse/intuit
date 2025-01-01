import React, { createContext, useContext, useEffect, useState } from 'react';
import * as Tone from 'tone';

interface ToneContextType {
  isInitialized: boolean;
}

const ToneContext = createContext<ToneContextType | undefined>(undefined);

export const ToneProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isInitialized, setIsInitialized] = useState(false);

  // Auto-initialize on mount
  useEffect(() => {
    const setupAudio = async () => {
      try {
        await Tone.start();
        await Tone.getContext().resume();
        setIsInitialized(true);
      } catch (error) {
        console.error("Error initializing Tone.js:", error);
      }
    };

    setupAudio();

    return () => {
      Tone.Transport.stop();
      Tone.Transport.cancel();
    };
  }, []);

  return (
    <ToneContext.Provider value={{ isInitialized }}>
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