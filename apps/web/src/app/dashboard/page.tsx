"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";
import {
  HiHome,
  HiChatBubbleLeftRight,
  HiUserGroup,
  HiUsers,
  HiPhoto,
  HiCog6Tooth,
  HiSparkles,
  HiUserPlus,
} from "react-icons/hi2";
import { RiCompass3Line, RiMusic2Line, RiHeart3Line } from "react-icons/ri";
import { MdMusicNote, MdFavorite } from "react-icons/md";

const navItems = [
  { label: "News Feed", icon: HiHome, count: undefined, active: true },
  { label: "Messages", icon: HiChatBubbleLeftRight, count: 6 },
  { label: "Forums", icon: RiCompass3Line, count: undefined },
  { label: "Friends", icon: HiUsers, count: 3 },
  { label: "Media", icon: HiPhoto, count: undefined },
  { label: "Settings", icon: HiCog6Tooth, count: undefined },
];

const peopleFeelingSame = [
  {
    name: "Sarah Chen",
    mood: "Excited",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    emoji: "🎉",
    color: "from-yellow-500/20 to-orange-500/20",
  },
  {
    name: "Marcus Johnson",
    mood: "Inspired",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    emoji: "✨",
    color: "from-purple-500/20 to-pink-500/20",
  },
  {
    name: "Emma Wilson",
    mood: "Happy",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&w=120&q=80",
    emoji: "😊",
    color: "from-blue-500/20 to-cyan-500/20",
  },
  {
    name: "David Lee",
    mood: "Motivated",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=120&q=80",
    emoji: "🚀",
    color: "from-green-500/20 to-emerald-500/20",
  },
];

const musicForMood = [
  {
    title: "Chill Vibes",
    artist: "Lofi Beats",
    mood: "Relaxed",
    cover:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&w=400&q=80",
    color: "from-blue-500 to-cyan-500",
    icon: "🎵",
  },
  {
    title: "Energy Boost",
    artist: "Electronic Mix",
    mood: "Energetic",
    cover:
      "https://images.unsplash.com/photo-1511379938547-c1f69419868d?auto=format&fit=crop&w=400&q=80",
    color: "from-purple-500 to-pink-500",
    icon: "⚡",
  },
  {
    title: "Focus Mode",
    artist: "Ambient Sounds",
    mood: "Concentrated",
    cover:
      "https://images.unsplash.com/photo-1516280440614-37939bbacd81?auto=format&fit=crop&w=400&q=80",
    color: "from-green-500 to-emerald-500",
    icon: "🎧",
  },
  {
    title: "Happy Hour",
    artist: "Pop Hits",
    mood: "Joyful",
    cover:
      "https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?auto=format&fit=crop&w=400&q=80",
    color: "from-yellow-500 to-orange-500",
    icon: "🎶",
  },
];

const posts = [
  {
    id: 1,
    author: "George Lobko",
    time: "2 hours ago",
    text: "Hi everyone, today I was on the most beautiful mountain in the world! I also want to say hi to",
    mentions: ["Silena", "Olya", "Davis"],
    avatar:
      "https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=80",
    images: [
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?auto=format&fit=crop&w=800&q=80",
      "https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=900&q=80",
    ],
    stats: { likes: 6355, comments: 187 },
    tag: "Wooow!!",
  },
  {
    id: 2,
    author: "Vitaliy Boyko",
    time: "3 hours ago",
    text: "I chose a wonderful coffee today, I wanted to tell you what product they have in stock — it's a latte with coconut milk… delicious… it's incredibly tasty!",
    mentions: [],
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=120&q=80",
    images: [],
    stats: { likes: 6355, comments: 102 },
    tag: "Yummy!",
  },
];

const composerActions = [
  { label: "File", icon: "📁" },
  { label: "Image", icon: "🖼️" },
  { label: "Location", icon: "📍" },
  { label: "Emoji", icon: "😊" },
  { label: "Public", icon: "🌐" },
];

export default function DashboardPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push("/auth");
    }
  }, [isAuthenticated, isLoading, router]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
        <div className="text-center">
          <div className="mb-4 flex justify-center">
            <span className="h-12 w-12 animate-spin rounded-full border-4 border-white border-t-fuchsia-500" />
          </div>
          <p className="text-white">Loading...</p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950">
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-blob absolute -left-10 top-10 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="animate-blob animation-delay-2000 absolute -right-16 top-24 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="animate-blob animation-delay-4000 absolute bottom-10 left-24 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
      </div>

      <div className="relative mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 lg:flex-row lg:px-8">
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="glass relative h-full overflow-hidden rounded-3xl p-6 backdrop-blur transition-all duration-500 hover:shadow-2xl">
            <div className="pointer-events-none absolute inset-0">
              <div className="animate-blob absolute -left-8 top-0 h-48 w-48 rounded-full bg-gradient-to-br from-amber-400/30 via-orange-400/20 to-pink-400/20 blur-3xl" />
              <div className="animate-blob animation-delay-2000 absolute bottom-0 right-0 h-52 w-52 rounded-full bg-gradient-to-br from-emerald-400/25 via-cyan-400/20 to-blue-400/20 blur-3xl" />
              <div className="animate-blob animation-delay-4000 absolute top-1/2 left-1/2 h-32 w-32 -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-to-br from-violet-400/20 to-fuchsia-400/20 blur-3xl" />
            </div>

            <div className="relative flex flex-col gap-6">
              {/* Profile Section */}
              <div className="group relative flex items-center gap-4 rounded-2xl bg-gradient-to-br from-white/10 to-white/5 p-4 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                <div className="relative">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 via-fuchsia-500 to-pink-500 text-xl font-bold text-white shadow-lg shadow-violet-500/50 transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                    BN
                  </div>
                  <div className="absolute -bottom-1 -right-1 flex h-5 w-5 items-center justify-center rounded-full border-2 border-slate-900 bg-emerald-500 shadow-lg">
                    <div className="h-2 w-2 rounded-full bg-white"></div>
                  </div>
                </div>
                <div className="flex-1">
                  <p className="text-base font-bold text-white">
                    Bogdan Nikitin
                  </p>
                  <p className="text-xs text-slate-300">@nikitintea</p>
                </div>
              </div>

              {/* Today Vibe Card */}
              <div className="group relative overflow-hidden rounded-2xl bg-gradient-to-br from-cyan-500/20 via-amber-500/20 to-pink-500/20 p-4 backdrop-blur-sm transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                <div className="flex items-center justify-between">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-semibold uppercase tracking-widest text-slate-300">
                      Today vibe
                    </span>
                    <span className="text-base font-bold text-white">
                      Let&apos;s explore
                    </span>
                  </div>
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-amber-400 to-pink-400 text-2xl shadow-lg shadow-cyan-500/30 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110">
                    <HiSparkles className="text-white" />
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <nav className="space-y-2">
                {navItems.map((item, index) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.label}
                      className={`group relative flex w-full items-center justify-between gap-3 rounded-xl px-4 py-3 text-left text-sm font-semibold transition-all duration-300 ${
                        item.active
                          ? "bg-gradient-to-r from-white to-white/95 text-slate-900 shadow-lg shadow-white/20"
                          : "bg-white/5 text-slate-200 hover:bg-white/10 hover:text-white"
                      }`}
                      style={{ animationDelay: `${index * 50}ms` }}
                    >
                      <span className="flex items-center gap-3">
                        <span
                          className={`flex h-8 w-8 items-center justify-center rounded-lg transition-all duration-300 ${
                            item.active
                              ? "bg-gradient-to-br from-violet-500 to-fuchsia-500 text-white shadow-md"
                              : "bg-white/10 text-slate-300 group-hover:bg-white/20 group-hover:text-white"
                          }`}
                        >
                          <Icon className="h-4 w-4" />
                        </span>
                        <span className="relative">{item.label}</span>
                      </span>
                      {item.count && (
                        <span
                          className={`flex h-6 min-w-[1.5rem] items-center justify-center rounded-full px-1.5 text-xs font-bold transition-all duration-300 ${
                            item.active
                              ? "bg-gradient-to-r from-violet-500 to-fuchsia-500 text-white shadow-md"
                              : "bg-gradient-to-r from-rose-500 to-pink-500 text-white shadow-md group-hover:scale-110"
                          }`}
                        >
                          {item.count}
                        </span>
                      )}
                      {item.active && (
                        <div className="absolute left-0 top-1/2 h-8 w-1 -translate-y-1/2 rounded-r-full bg-gradient-to-b from-violet-500 to-fuchsia-500"></div>
                      )}
                    </button>
                  );
                })}
              </nav>

              {/* Favorite Crew */}
              <div className="mt-auto space-y-4 rounded-2xl bg-gradient-to-br from-white/10 via-white/5 to-transparent p-4 backdrop-blur-sm">
                <div className="flex items-center justify-between">
                  <p className="text-[10px] font-bold uppercase tracking-widest text-slate-300">
                    Favorite crew
                  </p>
                  <HiUserGroup className="h-4 w-4 text-slate-400" />
                </div>
                <div className="flex -space-x-2">
                  {["A", "B", "C", "D"].map((initial, idx) => (
                    <div
                      key={initial}
                      className="group relative grid h-10 w-10 place-items-center rounded-full border-2 border-slate-900 bg-gradient-to-br from-violet-500/80 to-fuchsia-500/80 text-xs font-bold text-white shadow-lg transition-all duration-300 hover:z-10 hover:scale-110 hover:shadow-xl"
                      style={{ animationDelay: `${idx * 100}ms` }}
                    >
                      {initial}
                      <div className="absolute inset-0 rounded-full bg-gradient-to-br from-violet-500/0 to-fuchsia-500/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                    </div>
                  ))}
                </div>
                <button className="group relative w-full overflow-hidden rounded-xl bg-gradient-to-r from-violet-500 via-fuchsia-500 to-pink-500 py-2.5 text-xs font-bold text-white shadow-lg shadow-violet-500/30 transition-all duration-300 hover:scale-[1.02] hover:shadow-xl hover:shadow-violet-500/50">
                  <span className="relative z-10 flex items-center justify-center gap-2">
                    <HiUserPlus className="h-4 w-4" />
                    Invite friends
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-pink-500 via-fuchsia-500 to-violet-500 opacity-0 transition-opacity duration-300 group-hover:opacity-100"></div>
                </button>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 space-y-6">
          <header className="flex flex-wrap items-center justify-between gap-3">
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-slate-400">
                Dashboard
              </p>
              <h1 className="text-2xl font-semibold text-white">Feeds</h1>
            </div>
            <div className="flex items-center gap-2 rounded-full bg-white/5 p-1 text-xs font-medium text-slate-200 shadow-inner shadow-black/30">
              {["Recents", "Friends", "Popular"].map((tab) => (
                <button
                  key={tab}
                  className={`rounded-full px-4 py-2 transition ${
                    tab === "Friends"
                      ? "bg-white text-slate-900 shadow-lg"
                      : "hover:bg-white/10"
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>
          </header>

          <div className="space-y-5">
            {posts.map((post, index) => (
              <article
                key={post.id}
                className="glass animate-fade-up rounded-3xl p-4 backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-2xl md:p-6"
                style={{ animationDelay: `${index * 120}ms` }}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={post.avatar}
                      alt={post.author}
                      className="h-12 w-12 rounded-full border border-white/20 object-cover shadow-md"
                    />
                    <div>
                      <p className="text-sm font-semibold text-white">
                        {post.author}
                      </p>
                      <p className="text-xs text-slate-300">{post.time}</p>
                    </div>
                  </div>
                  <button className="rounded-full p-2 text-slate-300 transition hover:bg-white/10">
                    <span className="sr-only">More</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth={1.5}
                      stroke="currentColor"
                      className="h-5 w-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zm0 6a.75.75 0 110-1.5.75.75 0 010 1.5zm0 6a.75.75 0 110-1.5.75.75 0 010 1.5z"
                      />
                    </svg>
                  </button>
                </div>

                <p className="mt-4 text-sm leading-relaxed text-slate-100">
                  {post.text}{" "}
                  {post.mentions.map((name) => (
                    <span
                      key={name}
                      className="mr-1 font-semibold text-sky-300 underline decoration-sky-400/60"
                    >
                      {name}
                    </span>
                  ))}
                </p>

                {post.images.length > 0 && (
                  <div className="mt-5 grid grid-cols-3 gap-3">
                    <img
                      src={post.images[0]}
                      alt="Story"
                      className="col-span-1 h-48 rounded-2xl object-cover"
                    />
                    <img
                      src={post.images[1]}
                      alt="Story"
                      className="col-span-1 h-48 rounded-2xl object-cover"
                    />
                    <img
                      src={post.images[2]}
                      alt="Story"
                      className="col-span-1 h-48 rounded-2xl object-cover"
                    />
                  </div>
                )}

                <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-slate-300">
                  <div className="flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 shadow-inner shadow-black/30">
                    <span>😍</span>
                    <span>😆</span>
                    <span>😘</span>
                    <span className="ml-2 text-[13px] font-semibold text-white">
                      {post.stats.likes}
                    </span>
                  </div>
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 shadow-inner shadow-black/30">
                    💬 <strong className="text-white">{post.stats.comments}</strong>
                  </span>
                  <div className="ml-auto flex flex-wrap items-center gap-2 text-[13px] font-medium text-slate-100">
                    {["Like", "Comment", "Share"].map((action) => (
                      <button
                        key={action}
                        className="rounded-full px-3 py-1 transition hover:bg-white/10"
                      >
                        {action}
                      </button>
                    ))}
                    <button className="rounded-full bg-gradient-to-r from-rose-500 to-fuchsia-500 px-4 py-1.5 text-xs font-semibold text-white shadow-lg shadow-rose-500/30">
                      {post.tag}
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="glass rounded-3xl p-4 backdrop-blur transition duration-300 hover:-translate-y-1 hover:shadow-2xl md:p-5">
            <div className="flex items-center gap-3">
              <img
                src="https://images.unsplash.com/photo-1544723795-3fb6469f5b39?auto=format&fit=crop&w=120&q=80"
                alt="You"
                className="h-10 w-10 rounded-full border border-white/20 object-cover"
              />
              <input
                className="flex-1 rounded-2xl bg-white/5 px-4 py-3 text-sm text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/60"
                placeholder="Share something"
              />
              <button className="hidden rounded-full bg-white px-4 py-2 text-sm font-semibold text-slate-900 shadow-lg transition hover:scale-[1.02] sm:inline-block">
                Send
              </button>
            </div>
            <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-white/5 pt-3 text-xs text-slate-200">
              {composerActions.map((action) => (
                <button
                  key={action.label}
                  className="inline-flex items-center gap-2 rounded-full bg-white/5 px-3 py-1.5 transition hover:bg-white/10"
                >
                  <span>{action.icon}</span>
                  <span>{action.label}</span>
                </button>
              ))}
              <button className="ml-auto rounded-full bg-white px-4 py-2 text-xs font-semibold text-slate-900 shadow-lg transition hover:scale-[1.02] sm:hidden">
                Send
              </button>
            </div>
          </div>
        </main>

        <aside className="hidden w-72 shrink-0 space-y-5 lg:block">
          {/* People Feeling the Same Section */}
          <section className="glass relative overflow-hidden rounded-3xl p-5 backdrop-blur transition-all duration-300 hover:shadow-2xl">
            <div className="pointer-events-none absolute inset-0">
              <div className="animate-blob absolute -right-8 top-0 h-32 w-32 rounded-full bg-gradient-to-br from-pink-500/20 to-rose-500/20 blur-2xl" />
            </div>
            <div className="relative">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500/30 to-rose-500/30">
                    <RiHeart3Line className="h-4 w-4 text-pink-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    People feeling the same
                  </h3>
                </div>
                <button className="text-xs text-slate-300 transition hover:text-white">
                  See all
                </button>
              </div>
              <div className="space-y-3">
                {peopleFeelingSame.map((person, index) => (
                  <div
                    key={person.name}
                    className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-white/5 to-white/0 p-3 transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 hover:shadow-lg"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img
                          src={person.avatar}
                          alt={person.name}
                          className="h-12 w-12 rounded-full border-2 border-white/20 object-cover shadow-md transition-transform duration-300 group-hover:scale-110"
                        />
                        <div className="absolute -bottom-1 -right-1 flex h-6 w-6 items-center justify-center rounded-full border-2 border-slate-900 bg-gradient-to-br from-pink-500 to-rose-500 text-xs shadow-lg">
                          {person.emoji}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-white">
                          {person.name}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <span className="text-xs text-slate-300">
                            {person.mood}
                          </span>
                          <span className="h-1 w-1 rounded-full bg-slate-400"></span>
                          <span className="text-xs text-slate-400">2h ago</span>
                        </div>
                      </div>
                    </div>
                    <div className={`absolute inset-0 bg-gradient-to-r ${person.color} opacity-0 transition-opacity duration-300 group-hover:opacity-100`}></div>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Music for Your Mood Section */}
          <section className="glass relative overflow-hidden rounded-3xl p-5 backdrop-blur transition-all duration-300 hover:shadow-2xl">
            <div className="pointer-events-none absolute inset-0">
              <div className="animate-blob animation-delay-2000 absolute -left-8 bottom-0 h-36 w-36 rounded-full bg-gradient-to-br from-violet-500/20 to-purple-500/20 blur-2xl" />
            </div>
            <div className="relative">
              <div className="mb-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-violet-500/30 to-purple-500/30">
                    <RiMusic2Line className="h-4 w-4 text-violet-400" />
                  </div>
                  <h3 className="text-sm font-bold text-white">
                    Music for your mood
                  </h3>
                </div>
                <button className="text-xs text-slate-300 transition hover:text-white">
                  See all
                </button>
              </div>
              <div className="space-y-3">
                {musicForMood.map((track, index) => (
                  <div
                    key={track.title}
                    className="group relative overflow-hidden rounded-xl bg-gradient-to-r from-white/5 to-white/0 transition-all duration-300 hover:scale-[1.02] hover:bg-white/10 hover:shadow-lg"
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <div className="flex items-center gap-3 p-3">
                      <div className="relative h-14 w-14 shrink-0 overflow-hidden rounded-xl shadow-lg transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3">
                        <img
                          src={track.cover}
                          alt={track.title}
                          className="h-full w-full object-cover"
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black/40 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                          <MdMusicNote className="h-6 w-6 text-white" />
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-semibold text-white">
                          {track.title}
                        </p>
                        <p className="truncate text-xs text-slate-300">
                          {track.artist}
                        </p>
                        <div className="mt-1 flex items-center gap-2">
                          <span className="text-xs">{track.icon}</span>
                          <span className="text-xs text-slate-400">
                            {track.mood}
                          </span>
                        </div>
                      </div>
                      <button className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-r from-violet-500 to-purple-500 text-white shadow-md transition-all duration-300 hover:scale-110 hover:shadow-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="currentColor"
                          className="h-4 w-4"
                        >
                          <path
                            fillRule="evenodd"
                            d="M4.5 5.653c0-1.426 1.529-2.33 2.779-1.643l11.54 6.348c1.295.712 1.295 2.573 0 3.285L7.28 19.991c-1.25.687-2.779-.217-2.779-1.643V5.653z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </div>
                    <div className={`absolute inset-0 bg-gradient-to-r ${track.color} opacity-0 transition-opacity duration-300 group-hover:opacity-10`}></div>
                  </div>
                ))}
              </div>
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
