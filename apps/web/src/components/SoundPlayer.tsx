'use client';

import React, { useEffect, useRef, useState } from 'react';
import { Howl } from 'howler';

interface SoundPlayerProps {
  soundUrl?: string;
  autoPlay?: boolean;
  muted?: boolean;
}

export default function SoundPlayer({ soundUrl, autoPlay = false, muted = true }: SoundPlayerProps) {
  const [isMuted, setIsMuted] = useState(muted);
  const soundRef = useRef<Howl | null>(null);

  useEffect(() => {
    if (!soundUrl) return;

    // For demo purposes, we'll use a silent sound or generate tones
    // In production, you'd use actual sound files
    soundRef.current = new Howl({
      src: [soundUrl],
      volume: isMuted ? 0 : 0.3,
      loop: true,
    });

    if (autoPlay && !isMuted) {
      soundRef.current.play();
    }

    return () => {
      if (soundRef.current) {
        soundRef.current.stop();
        soundRef.current.unload();
      }
    };
  }, [soundUrl, autoPlay, isMuted]);

  const toggleMute = () => {
    if (!soundRef.current) return;
    
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    soundRef.current.volume(newMuted ? 0 : 0.3);
    
    if (newMuted) {
      soundRef.current.pause();
    } else if (autoPlay) {
      soundRef.current.play();
    }
  };

  if (!soundUrl) return null;

  return (
    <button
      onClick={toggleMute}
      className="p-2 rounded-full bg-black/20 hover:bg-black/40 transition-all backdrop-blur-sm"
      aria-label={isMuted ? 'Unmute' : 'Mute'}
    >
      {isMuted ? (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 14.142M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
        </svg>
      )}
    </button>
  );
}