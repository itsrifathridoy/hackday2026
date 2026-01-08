'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import ThemeWrapper from '@/components/ThemeWrapper';
import SoundPlayer from '@/components/SoundPlayer';
import ReactionBar, { ReactionType } from '@/components/ReactionBar';
import { useWhispers } from '@/context/WhisperContext';
import { moodConfigs } from '@/app/lib/moodConfig';

export default function ViewWhisperPage() {
  const router = useRouter();
  const params = useParams();
  const whisperId = params.id as string;
  const { getWhisper, reactToWhisper, refreshWhispers } = useWhispers();
  const [whisper, setWhisper] = useState(getWhisper(whisperId));
  const [isMuted] = useState(true);

  useEffect(() => {
    refreshWhispers();
    const updatedWhisper = getWhisper(whisperId);
    setWhisper(updatedWhisper);

    if (!updatedWhisper) {
      // Whisper not found, redirect to home
      router.push('/');
    }
  }, [whisperId, router, getWhisper, refreshWhispers]);

  const handleReaction = (reaction: ReactionType) => {
    if (!whisper) return;
    reactToWhisper(whisper.id, reaction);
    // Refresh whisper data
    refreshWhispers();
    setWhisper(getWhisper(whisperId));
  };

  if (!whisper) {
    return (
      <main className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-4xl mb-4">😶</p>
          <p className="text-white/60">Whisper not found</p>
          <Link href="/" className="mt-4 inline-block px-6 py-3 rounded-full bg-white/20 hover:bg-white/30 transition-all">
            Go Home
          </Link>
        </div>
      </main>
    );
  }

  const config = moodConfigs[whisper.mood] || moodConfigs.calm;

  return (
    <main className="min-h-screen">
      <ThemeWrapper mood={whisper.mood} fullScreen>
        <div className="min-h-screen flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-50 bg-black/20 backdrop-blur-md border-b border-white/10">
            <div className="container mx-auto px-4 py-4">
              <div className="flex items-center justify-between">
                <button
                  onClick={() => router.push('/')}
                  className="p-2 rounded-full bg-black/30 hover:bg-black/50 transition-all backdrop-blur-sm"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <div className="flex items-center gap-3">
                  <span className="text-3xl">{config.emoji}</span>
                  <span className="text-lg font-medium">{config.label}</span>
                </div>
                <SoundPlayer
                  soundUrl={undefined} // No real sound files in mock
                  autoPlay={true}
                  muted={isMuted}
                />
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="flex-1 flex flex-col items-center justify-center p-4 pb-24">
            <div className="w-full max-w-2xl space-y-8">
              {/* Drawing */}
              <div className="w-full aspect-square rounded-2xl overflow-hidden bg-black/20 backdrop-blur-sm border-2 border-white/30 shadow-2xl">
                {whisper.drawingUrl ? (
                  <img
                    src={whisper.drawingUrl}
                    alt={`Whisper ${whisper.mood}`}
                    className="w-full h-full object-contain"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-9xl opacity-50">{config.emoji}</span>
                  </div>
                )}
              </div>

              {/* Reactions */}
              <div className="bg-black/20 backdrop-blur-md rounded-2xl p-6 border border-white/20">
                <div className="flex justify-center mb-4">
                  <p className="text-white/80 text-sm">How does this make you feel?</p>
                </div>
                <ReactionBar reactions={whisper.reactions} onReaction={handleReaction} />
              </div>
            </div>
          </div>
        </div>
      </ThemeWrapper>
    </main>
  );
}