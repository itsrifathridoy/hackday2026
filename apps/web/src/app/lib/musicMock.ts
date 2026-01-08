import type { Mood } from './mockData';

export interface MockTrack {
  id: string;
  title: string;
  artist: string;
  coverColor: string;
  mood: Mood;
  previewUrl?: string;
}

export const mockTracks: MockTrack[] = [
  {
    id: 't1',
    title: 'Soft Sunrise',
    artist: 'Aurora',
    coverColor: 'from-amber-300 to-pink-300',
    mood: 'happy',
    previewUrl: '/mock/happy.mp3',
  },
  {
    id: 't2',
    title: 'Deep Blue Night',
    artist: 'Tide',
    coverColor: 'from-sky-700 to-indigo-800',
    mood: 'sad',
    previewUrl: '/mock/sad.mp3',
  },
  {
    id: 't3',
    title: 'Slow River',
    artist: 'Moss',
    coverColor: 'from-emerald-300 to-teal-400',
    mood: 'calm',
    previewUrl: '/mock/calm.mp3',
  },
  {
    id: 't4',
    title: 'Electric Pulse',
    artist: 'Nova',
    coverColor: 'from-fuchsia-400 to-purple-500',
    mood: 'excited',
    previewUrl: '/mock/excited.mp3',
  },
  {
    id: 't5',
    title: 'Quiet Storm',
    artist: 'Flare',
    coverColor: 'from-red-500 to-rose-500',
    mood: 'angry',
    previewUrl: '/mock/angry.mp3',
  },
  {
    id: 't6',
    title: 'Late Glow',
    artist: 'Dust',
    coverColor: 'from-slate-500 to-gray-600',
    mood: 'tired',
    previewUrl: '/mock/tired.mp3',
  },
];

export const getTracksForMood = (mood: Mood): MockTrack[] => {
  return mockTracks.filter((t) => t.mood === mood);
};

