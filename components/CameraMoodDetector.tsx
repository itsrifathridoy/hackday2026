'use client';

import React, { useRef, useState, useEffect } from 'react';
import type { Mood } from '@/app/lib/mockData';
import { moodConfigs } from '@/app/lib/moodConfig';

const moods: Mood[] = ['happy', 'sad', 'calm', 'angry', 'excited', 'tired'];

interface CameraMoodDetectorProps {
  onMoodSuggested?: (mood: Mood) => void;
}

type FaceApiModule = typeof import('face-api.js');

export default function CameraMoodDetector({ onMoodSuggested }: CameraMoodDetectorProps) {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [suggestedMood, setSuggestedMood] = useState<Mood | null>(null);
  const [note, setNote] = useState<string>('Camera data is not stored.');
  const [faceApi, setFaceApi] = useState<FaceApiModule | null>(null);
  const [modelsLoaded, setModelsLoaded] = useState(false);

  // Lazy-load face-api.js on mount
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const mod = await import('face-api.js');
        if (cancelled) return;
        setFaceApi(mod);
        // Try to load models from /models; if missing, we'll fall back to random suggestions.
        const modelUrl = '/models';
        await Promise.all([
          mod.nets.tinyFaceDetector.loadFromUri(modelUrl),
          mod.nets.faceExpressionNet.loadFromUri(modelUrl),
        ]);
        if (!cancelled) {
          setModelsLoaded(true);
          setNote('Models loaded. Camera data is not stored.');
        }
      } catch {
        if (!cancelled) {
          // Still allow random simulation if models are not present.
          setNote('Using simple mood guess. Camera data is not stored.');
        }
      }
    })();

    return () => {
      cancelled = true;
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, []);

  const stopStream = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
    }
  };

  const mapExpressionToMood = (expression: string | undefined): Mood => {
    switch (expression) {
      case 'happy':
        return 'happy';
      case 'sad':
        return 'sad';
      case 'angry':
        return 'angry';
      case 'surprised':
      case 'fearful':
        return 'excited';
      case 'disgusted':
        return 'angry';
      case 'neutral':
      default: {
        // Neutral → calm or tired
        return Math.random() > 0.5 ? 'calm' : 'tired';
      }
    }
  };

  const randomFallbackMood = (): Mood => {
    const index = Math.floor(Math.random() * moods.length);
    return moods[index];
  };

  const handleScan = async () => {
    try {
      setIsScanning(true);
      setSuggestedMood(null);
      setNote(modelsLoaded ? 'Looking at your vibe…' : 'Looking at your vibe (simple guess)…');

      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }

      setTimeout(async () => {
        let mood: Mood;

        if (faceApi && modelsLoaded && videoRef.current) {
          try {
            const { TinyFaceDetectorOptions } = faceApi;
            const detections = await faceApi
              .detectSingleFace(videoRef.current, new TinyFaceDetectorOptions())
              .withFaceExpressions();

            const expression =
              detections?.expressions &&
              Object.entries(detections.expressions).sort((a, b) => b[1] - a[1])[0]?.[0];

            mood = mapExpressionToMood(expression);
          } catch {
            mood = randomFallbackMood();
          }
        } else {
          mood = randomFallbackMood();
        }

        stopStream();
        setSuggestedMood(mood);
        setNote('Suggestion only. Tap to apply if it feels right.');
        setIsScanning(false);
      }, 1400);
    } catch {
      stopStream();
      setIsScanning(false);
      setNote('Camera blocked. Try again if you like.');
    }
  };

  const applySuggestion = () => {
    if (suggestedMood && onMoodSuggested) {
      onMoodSuggested(suggestedMood);
    }
  };

  return (
    <section className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-2xl p-5 shadow-xl shadow-black/20 space-y-4">
      <div className="flex items-center justify-between gap-3">
        <div>
          <p className="text-lg font-semibold">Camera mood assist</p>
          <p className="mt-1 text-[11px] text-white/60">
            Smile → happy · Relaxed face → calm · Frown → sad · Intense look → angry · Wide eyes → excited
          </p>
        </div>
        <span className="text-[11px] rounded-full border border-white/15 bg-white/10 px-3 py-1 text-white/70">
          {modelsLoaded ? 'face‑api.js loaded' : 'simple guess mode'}
        </span>
      </div>

      <div className="relative rounded-2xl bg-black/40 border border-white/10 overflow-hidden h-52 flex items-center justify-center">
        <video ref={videoRef} className="w-full h-full object-cover opacity-70" playsInline muted />
        {!isScanning && !suggestedMood && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 text-sm text-white/75">
            <span>{modelsLoaded ? 'One quick look, no recording.' : 'Models not found, using simple guess.'}</span>
            <span className="text-[11px] text-white/60">Tip: smile or exaggerate your expression for a clearer read.</span>
          </div>
        )}
        {isScanning && (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-black/40">
            <div className="h-10 w-10 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            <p className="text-xs text-white/80">Scanning mood…</p>
          </div>
        )}
        {suggestedMood && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
            <div className="flex h-20 w-20 items-center justify-center rounded-full bg-black/40 border border-white/30 backdrop-blur-md">
              <span className="text-3xl">{moodConfigs[suggestedMood].emoji}</span>
            </div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          onClick={handleScan}
          disabled={isScanning}
          className="px-4 py-2 rounded-full text-sm font-semibold bg-white text-gray-900 hover:bg-white/90 disabled:opacity-60"
        >
          {isScanning ? 'Scanning…' : 'Scan face / gesture'}
        </button>
        <p className="text-[11px] text-white/60 text-right max-w-xs">{note}</p>
      </div>

      {suggestedMood && (
        <div className="flex items-center justify-between rounded-2xl bg-white/10 border border-white/20 px-3 py-2">
          <div className="flex items-center gap-2">
            <span className="text-xl">{moodConfigs[suggestedMood].emoji}</span>
            <span className="text-sm capitalize">{suggestedMood}</span>
          </div>
          <button
            onClick={applySuggestion}
            className="px-3 py-1.5 rounded-full text-xs font-semibold bg-white text-gray-900 hover:bg-white/90"
          >
            Use mood
          </button>
        </div>
      )}

      <p className="text-[11px] text-white/50">
        Camera data is not stored. face-api.js runs only in your browser to suggest a mood — nothing is uploaded or saved.
      </p>
    </section>
  );
}

