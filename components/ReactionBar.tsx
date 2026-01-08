'use client';

import React from 'react';

export type ReactionType = 'love' | 'calm' | 'sad' | 'angry' | 'rainbow';

interface ReactionBarProps {
  reactions: {
    love: number;
    calm: number;
    sad: number;
    angry: number;
    rainbow: number;
  };
  onReaction?: (reaction: ReactionType) => void;
  compact?: boolean;
}

const reactionEmojis: Record<ReactionType, string> = {
  love: '❤️',
  calm: '😌',
  sad: '😢',
  angry: '😡',
  rainbow: '🌈',
};

export default function ReactionBar({ reactions, onReaction, compact = false }: ReactionBarProps) {
  const reactionsArray: Array<{ type: ReactionType; count: number }> = [
    { type: 'love', count: reactions.love },
    { type: 'calm', count: reactions.calm },
    { type: 'sad', count: reactions.sad },
    { type: 'angry', count: reactions.angry },
    { type: 'rainbow', count: reactions.rainbow },
  ];

  return (
    <div className={`flex ${compact ? 'gap-2' : 'gap-3'} items-center flex-wrap`}>
      {reactionsArray.map(({ type, count }) => (
        <button
          key={type}
          onClick={() => onReaction?.(type)}
          className={`
            flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium
            bg-white/20 hover:bg-white/30 backdrop-blur-md
            shadow-lg shadow-black/20 transition-all transform hover:scale-105 active:scale-95
            border border-white/20
            ${onReaction ? 'cursor-pointer' : 'cursor-default opacity-80'}
          `}
        >
          <span className="text-xl">{reactionEmojis[type]}</span>
          {count > 0 && (
            <span className="text-sm font-medium">{count}</span>
          )}
        </button>
      ))}
    </div>
  );
}