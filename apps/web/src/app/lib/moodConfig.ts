import type { Mood } from "@/services/whisperClient";

export interface MoodConfig {
  emoji: string;
  label: string;
  bgClass: string;
  animationClass: string;
  soundUrl?: string;
}

export const moodConfigs: Record<Mood, MoodConfig> = {
  happy: {
    emoji: "😊",
    label: "Happy",
    bgClass: "mood-happy",
    animationClass: "animate-float",
  },
  sad: {
    emoji: "😢",
    label: "Sad",
    bgClass: "mood-sad",
    animationClass: "animate-fade-in",
  },
  calm: {
    emoji: "😌",
    label: "Calm",
    bgClass: "mood-calm",
    animationClass: "animate-wave",
  },
  angry: {
    emoji: "😡",
    label: "Angry",
    bgClass: "mood-angry",
    animationClass: "animate-shake",
  },
  excited: {
    emoji: "🌈",
    label: "Excited",
    bgClass: "mood-excited",
    animationClass: "animate-pulse-fast",
  },
  tired: {
    emoji: "😴",
    label: "Tired",
    bgClass: "mood-tired",
    animationClass: "animate-pulse-slow",
  },
};
