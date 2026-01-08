"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaSignOutAlt, FaArrowLeft } from "react-icons/fa";
import { useAuth } from "@/context/auth-context";

export default function MePage() {
  const router = useRouter();
  const { user, isAuthenticated, isLoading, logout } = useAuth();

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

  if (!isAuthenticated || !user) {
    return null;
  }

  const handleLogout = async () => {
    await logout();
    router.push("/auth");
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4">
      {/* Animated blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-blob absolute -left-10 top-10 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="animate-blob animation-delay-2000 absolute -right-16 top-24 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="animate-blob animation-delay-4000 absolute bottom-10 left-24 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        {/* Back button */}
        <Link
          href="/dashboard"
          className="mb-6 inline-flex items-center gap-2 text-fuchsia-400 hover:text-fuchsia-300 transition"
        >
          <FaArrowLeft className="text-lg" />
          Back to Dashboard
        </Link>

        {/* Profile card */}
        <div className="glass rounded-3xl p-8 backdrop-blur">
          {/* Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-white">My Profile</h1>
            <p className="mt-2 text-sm text-slate-300">Your account information</p>
          </div>

          {/* Avatar section */}
          <div className="mb-8 flex justify-center">
            {user.image ? (
              <img
                src={user.image}
                alt={user.name || "Profile"}
                className="h-24 w-24 rounded-2xl border-2 border-fuchsia-500/50 object-cover shadow-lg"
              />
            ) : (
              <div className="flex h-24 w-24 items-center justify-center rounded-2xl border-2 border-fuchsia-500/50 bg-gradient-to-br from-violet-500 to-fuchsia-500 text-3xl font-bold text-white shadow-lg">
                {user.name?.charAt(0).toUpperCase() || user.email.charAt(0).toUpperCase()}
              </div>
            )}
          </div>

          {/* User info */}
          <div className="space-y-4 mb-8">
            {/* Name */}
            {user.name && (
              <div className="rounded-xl bg-white/5 p-4 border border-white/10">
                <p className="text-sm text-slate-400">Full Name</p>
                <p className="text-lg font-semibold text-white">{user.name}</p>
              </div>
            )}

            {/* Email */}
            <div className="rounded-xl bg-white/5 p-4 border border-white/10">
              <p className="text-sm text-slate-400">Email Address</p>
              <p className="text-lg font-semibold text-white break-all">{user.email}</p>
            </div>

            {/* User ID */}
            <div className="rounded-xl bg-white/5 p-4 border border-white/10">
              <p className="text-sm text-slate-400">User ID</p>
              <p className="text-sm font-mono text-slate-300 break-all">{user.id}</p>
            </div>
          </div>

          {/* Divider */}
          <div className="my-6 border-t border-white/10" />

          {/* Logout button */}
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-red-600 to-red-700 px-4 py-3 font-semibold text-white shadow-lg shadow-red-500/30 transition hover:shadow-xl hover:shadow-red-500/40 hover:from-red-700 hover:to-red-800"
          >
            <FaSignOutAlt className="text-lg" />
            Sign Out
          </button>

          {/* Footer info */}
          <p className="mt-6 text-center text-xs text-slate-400">
            This is your secure profile information
          </p>
        </div>
      </div>
    </div>
  );
}
