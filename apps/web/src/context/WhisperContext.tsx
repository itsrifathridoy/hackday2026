"use client";

import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import whisperClient, {
  type Whisper,
  type Mood,
} from "@/services/whisperClient";
import reactionClient from "@/services/reactionClient";

// Reaction types to match the frontend
export type ReactionType = "love" | "calm" | "sad" | "angry" | "rainbow";

// Transform backend Whisper to frontend format with reactions
export interface FrontendWhisper extends Whisper {
  reactions: {
    love: number;
    calm: number;
    sad: number;
    angry: number;
    rainbow: number;
  };
  drawingUrl: string;
  theme: string;
}

interface WhisperContextType {
  whispers: FrontendWhisper[];
  currentMood: Mood;
  setCurrentMood: (_mood: Mood) => void;
  refreshWhispers: () => Promise<void>;
  addNewWhisper: (_data: {
    mood: Mood;
    photoUrl?: string;
    audioUrl?: string;
    caption?: string;
    emoji?: string;
    drawingUrl?: string;
  }) => Promise<FrontendWhisper>;
  getWhisper: (_id: string) => FrontendWhisper | undefined;
  reactToWhisper: (id: string, reaction: ReactionType) => Promise<void>;
  isLoading: boolean;
}

const WhisperContext = createContext<WhisperContextType | undefined>(undefined);

export function WhisperProvider({ children }: { children: React.ReactNode }) {
  const [whispers, setWhispers] = useState<FrontendWhisper[]>([]);
  const [currentMood, setCurrentMoodState] = useState<Mood>("calm");
  const [isLoading, setIsLoading] = useState(false);

  // Transform backend whisper to frontend format
  const transformWhisper = (whisper: Whisper): FrontendWhisper => {
    return {
      ...whisper,
      reactions: whisper.reactions || {
        love: 0,
        calm: 0,
        sad: 0,
        angry: 0,
        rainbow: 0,
      },
      drawingUrl: whisper.photoUrl || "",
      theme: whisper.mood || "calm",
    };
  };

  const refreshWhispers = useCallback(async () => {
    try {
      setIsLoading(true);
      const data = await whisperClient.getWhispers();
      const transformedWhispers = data.map(transformWhisper);
      setWhispers(transformedWhispers);
    } catch (error) {
      console.error("Failed to fetch whispers:", error);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const addNewWhisper = useCallback(
    async (data: {
      mood: Mood;
      photoUrl?: string;
      audioUrl?: string;
      caption?: string;
      emoji?: string;
      drawingUrl?: string;
    }) => {
      try {
        setIsLoading(true);
        const newWhisper = await whisperClient.createWhisper({
          photoUrl: data.drawingUrl || data.photoUrl,
          audioUrl: data.audioUrl,
          caption: data.caption,
          emoji: data.emoji,
        });
        const transformed = transformWhisper(newWhisper);
        setWhispers((prev) => [transformed, ...prev]);
        setCurrentMoodState(data.mood);
        return transformed;
      } catch (error) {
        console.error("Failed to create whisper:", error);
        throw error;
      } finally {
        setIsLoading(false);
      }
    },
    []
  );

  const getWhisper = useCallback(
    (id: string) => {
      return whispers.find((w) => w.id === id);
    },
    [whispers]
  );

  const reactToWhisper = useCallback(async (id: string, reaction: ReactionType) => {
    // Check if already reacting to prevent race conditions
    const whisper = whispers.find((w) => w.id === id);
    if (!whisper) return;

    // Optimistically update the UI
    setWhispers((prev) =>
      prev.map((w) => {
        if (w.id === id) {
          const currentCount = w.reactions[reaction];
          return {
            ...w,
            reactions: {
              ...w.reactions,
              [reaction]: currentCount + 1,
            },
          };
        }
        return w;
      })
    );

    try {
      // Call backend API
      const updatedCounts = await reactionClient.addReaction(id, reaction);
      
      // Update with actual counts from backend
      setWhispers((prev) =>
        prev.map((w) => {
          if (w.id === id) {
            return {
              ...w,
              reactions: updatedCounts,
            };
          }
          return w;
        })
      );
    } catch (error: any) {
      console.error("Failed to add reaction:", error);
      // Revert optimistic update on error
      setWhispers((prev) =>
        prev.map((w) => {
          if (w.id === id) {
            const currentCount = w.reactions[reaction];
            return {
              ...w,
              reactions: {
                ...w.reactions,
                [reaction]: Math.max(0, currentCount - 1),
              },
            };
          }
          return w;
        })
      );
    }
  }, [whispers]);

  const setCurrentMood = (mood: Mood) => {
    setCurrentMoodState(mood);
  };

  // Load whispers on mount
  useEffect(() => {
    refreshWhispers();
  }, [refreshWhispers]);

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
        isLoading,
      }}
    >
      {children}
    </WhisperContext.Provider>
  );
}

export function useWhispers() {
  const context = useContext(WhisperContext);
  if (context === undefined) {
    throw new Error("useWhispers must be used within a WhisperProvider");
  }
  return context;
}
