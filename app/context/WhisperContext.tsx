'use client';

import React, { createContext, useContext, useState, useCallback } from 'react';
import { getWhispers, addWhisper, getWhisperById, addReaction, type Whisper, type Mood } from '@/app/lib/mockData';

interface WhisperContextType {
  whispers: Whisper[];
  currentMood: Mood;
  setCurrentMood: (mood: Mood) => void;
  refreshWhispers: () => void;
  addNewWhisper: (whisper: Omit<Whisper, 'id' | 'createdAt'>) => Whisper;
  getWhisper: (id: string) => Whisper | undefined;
  reactToWhisper: (id: string, reaction: keyof Whisper['reactions']) => void;
}

const WhisperContext = createContext<WhisperContextType | undefined>(undefined);

export function WhisperProvider({ children }: { children: React.ReactNode }) {
  const [whispers, setWhispers] = useState<Whisper[]>(getWhispers());
  const [currentMood, setCurrentMoodState] = useState<Mood>('calm');

  const refreshWhispers = useCallback(() => {
    setWhispers(getWhispers());
  }, []);

  const addNewWhisper = useCallback((whisper: Omit<Whisper, 'id' | 'createdAt'>) => {
    const newWhisper = addWhisper(whisper);
    refreshWhispers();
    setCurrentMoodState(whisper.mood);
    return newWhisper;
  }, [refreshWhispers]);

  const getWhisper = useCallback((id: string) => {
    return getWhisperById(id);
  }, []);

  const reactToWhisper = useCallback((id: string, reaction: keyof Whisper['reactions']) => {
    addReaction(id, reaction);
    refreshWhispers();
  }, [refreshWhispers]);

  const setCurrentMood = (mood: Mood) => {
    setCurrentMoodState(mood);
  };

  return (
    <WhisperContext.Provider
      value={{
        whispers,
        currentMood,
        setCurrentMood,
        refreshWhispers,
        addNewWhisper,
        getWhisper,
        reactToWhisper,
      }}
    >
      {children}
    </WhisperContext.Provider>
  );
}

export function useWhispers() {
  const context = useContext(WhisperContext);
  if (context === undefined) {
    throw new Error('useWhispers must be used within a WhisperProvider');
  }
  return context;
}