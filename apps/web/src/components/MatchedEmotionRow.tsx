'use client';

import React, { useEffect, useState } from 'react';
import { RiHeart3Line } from 'react-icons/ri';
import { useWhispers } from '@/context/WhisperContext';
import matchedEmotionsClient, { type MatchedEmotion } from '@/services/matchedEmotionsClient';
import ChatWindow from './ChatWindow';

const colorGradients = [
  'from-yellow-500/20 to-orange-500/20',
  'from-purple-500/20 to-pink-500/20',
  'from-blue-500/20 to-cyan-500/20',
  'from-green-500/20 to-emerald-500/20',
  'from-red-500/20 to-rose-500/20',
];

export default function MatchedEmotionRow() {
  const { currentMood } = useWhispers();
  const [matches, setMatches] = useState<MatchedEmotion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [chatOpen, setChatOpen] = useState<{ whisperId: string; userId: string; userName: string; userImage: string | null } | null>(null);

  useEffect(() => {
    const fetchMatches = async () => {
      try {
        setIsLoading(true);
        const data = await matchedEmotionsClient.getMatchedEmotions(currentMood || undefined);
        setMatches(data.slice(0, 4));
      } catch (error) {
        console.error('Failed to fetch matched emotions:', error);
        setMatches([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (currentMood) {
      fetchMatches();
    } else {
      setMatches([]);
      setIsLoading(false);
    }
  }, [currentMood]);

  return (
    <section className="glass relative overflow-hidden rounded-3xl p-5 backdrop-blur transition-all duration-300 hover:shadow-2xl">
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-blob absolute -right-8 top-0 h-32 w-32 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-500/20 blur-2xl" />
      </div>
      <div className="relative">
        <div className="mb-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500/30 to-rose-500/30">
              <RiHeart3Line className="h-4 w-4 text-pink-400" />
            </div>
            <h3 className="text-sm font-bold text-white whitespace-nowrap">
              People feeling the same
            </h3>
          </div>
          <button className="text-xs text-slate-300 transition hover:text-white shrink-0 whitespace-nowrap">
            See all
          </button>
        </div>
        <div className="space-y-3">
          {isLoading ? (
            <div className="text-xs text-slate-400 text-center py-4">
              Finding matches...
            </div>
          ) : matches.length === 0 ? (
            <div className="text-xs text-slate-400 text-center py-4">
              No matches yet
            </div>
          ) : (
            matches.map((person, index) => {
              const timeAgo = Math.floor(
                (Date.now() - new Date(person.createdAt).getTime()) / 3600000
              );
              const color = colorGradients[index % colorGradients.length];
              const emoji = person.emoji || '💫';
              
              return (
                <div
                  key={person.id}
                  className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-white/5 to-white/0 p-3 transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 hover:shadow-lg"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <img
                        src={person.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(person.name)}&background=random`}
                        alt={person.name}
                        className="h-12 w-12 rounded-full border-2 border-white/20 object-cover shadow-md transition-transform duration-300 group-hover:scale-110"
                      />
                      <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-900 bg-gradient-to-br from-pink-500 to-rose-500 text-xs shadow-lg">
                        {emoji}
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-semibold text-white truncate">
                        {person.name}
                      </p>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs text-slate-300 whitespace-nowrap">
                          {person.mood || 'Unknown'}
                        </span>
                        <span className="h-1 w-1 rounded-full bg-slate-400 shrink-0"></span>
                        <span className="text-xs text-slate-400 whitespace-nowrap">{timeAgo}h ago</span>
                      </div>
                    </div>
                    <button
                      onClick={() => setChatOpen({
                        whisperId: person.whisperId,
                        userId: person.id,
                        userName: person.name,
                        userImage: person.image,
                      })}
                      className="rounded-full bg-gradient-to-r from-violet-500/20 to-fuchsia-500/20 border border-white/20 px-3 py-1.5 text-xs font-semibold text-white transition hover:from-violet-500/30 hover:to-fuchsia-500/30"
                    >
                      💬 Chat
                    </button>
                  </div>
                  <div className={`absolute inset-0 bg-gradient-to-r ${color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}></div>
                </div>
              );
            })
          )}
        </div>
      </div>
      
      {chatOpen && (
        <ChatWindow
          whisperId={chatOpen.whisperId}
          otherUserId={chatOpen.userId}
          otherUserName={chatOpen.userName}
          otherUserImage={chatOpen.userImage}
          onClose={() => setChatOpen(null)}
        />
      )}
    </section>
  );
}