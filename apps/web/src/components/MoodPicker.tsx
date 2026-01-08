'use client';

import React from 'react';
import type { Mood } from '@/app/lib/mockData';
import { moodConfigs } from '@/app/lib/moodConfig';

interface MoodPickerProps {
  selectedMood?: Mood;
  onSelect: (_mood: Mood) => void;
}

export default function MoodPicker({ selectedMood, onSelect }: MoodPickerProps) {
  const moods: Mood[] = ['happy', 'sad', 'calm', 'angry', 'excited', 'tired'];

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
      {moods.map((mood) => {
        const config = moodConfigs[mood];
        const isSelected = selectedMood === mood;

        return (
          <button
            key={mood}
            onClick={() => onSelect(mood)}
            className={`
              relative p-6 rounded-2xl transition-all transform
              ${config.bgClass} ${config.animationClass}
              ${isSelected ? 'ring-4 ring-white ring-offset-4 ring-offset-gray-900 scale-105' : 'hover:scale-105'}
              focus:outline-none focus:ring-4 focus:ring-white focus:ring-offset-4 focus:ring-offset-gray-900
            `}
          >
            <div className="text-center space-y-2">
              <div className="text-5xl">{config.emoji}</div>
              <div className="text-sm font-medium opacity-90">{config.label}</div>
            </div>
            {isSelected && (
              <div className="absolute top-2 right-2">
                <svg className="w-6 h-6 text-white" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
            )}
          </button>
        );
      })}
    </div>
  );
}