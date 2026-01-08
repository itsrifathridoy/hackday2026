'use client';

import React from 'react';
import type { Mood } from '@/app/lib/mockData';
import { moodConfigs } from '@/app/lib/moodConfig';

interface ThemeWrapperProps {
  mood: Mood;
  children: React.ReactNode;
  fullScreen?: boolean;
}

export default function ThemeWrapper({ mood, children, fullScreen = false }: ThemeWrapperProps) {
  const config = moodConfigs[mood];
  const baseClasses = `transition-all duration-500 ${config.bgClass} ${config.animationClass}`;
  const sizeClasses = fullScreen ? 'min-h-screen w-full' : 'rounded-3xl p-5 shadow-2xl shadow-black/30';

  return (
    <div className={`${baseClasses} ${sizeClasses} backdrop-blur-xl border border-white/10`}>
      {children}
    </div>
  );
}