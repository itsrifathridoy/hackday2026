'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import CameraMoodDetector from '@/components/CameraMoodDetector';
import { useWhispers } from '@/app/context/WhisperContext';

export default function CameraPage() {
  const router = useRouter();
  const { setCurrentMood } = useWhispers();

  return (
    <main className="min-h-screen pb-16">
      <div className="max-w-3xl mx-auto px-4 lg:px-6 py-6 lg:py-10 space-y-6">
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/')}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 transition-all"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
          </button>
          <p className="text-lg font-semibold">Camera mood</p>
          <div className="w-8" />
        </div>

        <CameraMoodDetector
          onMoodSuggested={(m) => {
            setCurrentMood(m);
          }}
        />
      </div>
    </main>
  );
}

