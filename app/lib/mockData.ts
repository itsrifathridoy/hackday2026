export type Mood = 'happy' | 'sad' | 'calm' | 'angry' | 'excited' | 'tired';

export interface Whisper {
  id: string;
  mood: Mood;
  theme: string;
  drawingUrl: string; // base64 or data URL
  reactions: {
    love: number;
    calm: number;
    sad: number;
    angry: number;
    rainbow: number;
  };
  createdAt: number; // timestamp
}

// Initial mock data
export const initialMockWhispers: Whisper[] = [
  {
    id: '1',
    mood: 'happy',
    theme: 'bright',
    drawingUrl: '', // Will be generated or placeholder
    reactions: { love: 12, calm: 3, sad: 0, angry: 0, rainbow: 5 },
    createdAt: Date.now() - 3600000, // 1 hour ago
  },
  {
    id: '2',
    mood: 'calm',
    theme: 'serene',
    drawingUrl: '',
    reactions: { love: 8, calm: 15, sad: 0, angry: 0, rainbow: 2 },
    createdAt: Date.now() - 7200000, // 2 hours ago
  },
  {
    id: '3',
    mood: 'excited',
    theme: 'energetic',
    drawingUrl: '',
    reactions: { love: 20, calm: 1, sad: 0, angry: 0, rainbow: 10 },
    createdAt: Date.now() - 1800000, // 30 minutes ago
  },
  {
    id: '4',
    mood: 'sad',
    theme: 'melancholy',
    drawingUrl: '',
    reactions: { love: 5, calm: 8, sad: 12, angry: 0, rainbow: 1 },
    createdAt: Date.now() - 5400000, // 1.5 hours ago
  },
  {
    id: '5',
    mood: 'tired',
    theme: 'muted',
    drawingUrl: '',
    reactions: { love: 3, calm: 10, sad: 2, angry: 0, rainbow: 0 },
    createdAt: Date.now() - 9000000, // 2.5 hours ago
  },
];

// Store whispers in memory (simulating a backend)
let whispers: Whisper[] = [...initialMockWhispers];

export const getWhispers = (): Whisper[] => {
  return [...whispers];
};

export const getWhisperById = (id: string): Whisper | undefined => {
  return whispers.find((w) => w.id === id);
};

export const addWhisper = (whisper: Omit<Whisper, 'id' | 'createdAt'>): Whisper => {
  const newWhisper: Whisper = {
    ...whisper,
    id: Date.now().toString(),
    createdAt: Date.now(),
  };
  whispers = [newWhisper, ...whispers];
  return newWhisper;
};

export const addReaction = (whisperId: string, reaction: keyof Whisper['reactions']): void => {
  const whisper = whispers.find((w) => w.id === whisperId);
  if (whisper) {
    whisper.reactions[reaction]++;
    // Update the whispers array to trigger re-renders
    whispers = [...whispers];
  }
};