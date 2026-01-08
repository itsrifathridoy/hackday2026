"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/auth-context";

export default function HomePage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated) {
        // Redirect authenticated users to the feed
        router.push("/feed");
      } else {
        // Redirect non-authenticated users to auth page
        router.push("/auth");
      }
    }
  }, [isAuthenticated, isLoading, router]);

  // Show loading state while checking authentication
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
