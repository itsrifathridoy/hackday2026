"use client";

import { useState, FormEvent, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { FaGoogle } from "react-icons/fa";
import { authClient } from "@/services/apiClient";
import { useAuth } from "@/context/auth-context";

type AuthMode = "signin" | "signup";

export default function AuthPage() {
  const router = useRouter();
  const { isAuthenticated, isLoading } = useAuth();
  const [mode, setMode] = useState<AuthMode>("signin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    if (!isLoading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [isAuthenticated, isLoading, router]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);

    try {
      if (mode === "signin") {
        await authClient.signin({ email, password });
        setSuccess("Sign in successful! Redirecting...");
        setTimeout(() => router.push("/dashboard"), 1500);
      } else {
        await authClient.signup({ email, password, name });
        setSuccess("Account created! Redirecting...");
        setTimeout(() => router.push("/dashboard"), 1500);
      }
    } catch (err: any) {
      const errorMsg =
        err.response?.data?.error ||
        err.response?.data?.issues?.[0]?.message ||
        "An error occurred. Please try again.";
      setError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const toggleMode = () => {
    setMode(mode === "signin" ? "signup" : "signin");
    setError(null);
    setSuccess(null);
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-gradient-to-br from-slate-950 via-slate-900 to-indigo-950 flex items-center justify-center p-4">
      {/* Animated blobs */}
      <div className="pointer-events-none absolute inset-0">
        <div className="animate-blob absolute -left-10 top-10 h-72 w-72 rounded-full bg-fuchsia-500/20 blur-3xl" />
        <div className="animate-blob animation-delay-2000 absolute -right-16 top-24 h-80 w-80 rounded-full bg-indigo-500/20 blur-3xl" />
        <div className="animate-blob animation-delay-4000 absolute bottom-10 left-24 h-64 w-64 rounded-full bg-blue-400/20 blur-3xl" />
      </div>

      {/* Auth card */}
      <div className="relative z-10 w-full max-w-md">
        <div className="glass rounded-3xl p-8 backdrop-blur">
          {/* Header */}
          <div className="mb-8 text-center">
            <div className="mb-4 flex justify-center">
              <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-br from-violet-500 to-fuchsia-500 text-2xl font-bold text-white shadow-lg">
                🚀
              </div>
            </div>
            <h1 className="text-2xl font-bold text-white">HackDay 2026</h1>
            <p className="mt-2 text-sm text-slate-300">
              {mode === "signin" ? "Welcome back" : "Create your account"}
            </p>
          </div>

          {/* Error message */}
          {error && (
            <div className="mb-6 rounded-xl bg-red-500/20 p-4 border border-red-500/30">
              <p className="text-sm text-red-200">{error}</p>
            </div>
          )}

          {/* Success message */}
          {success && (
            <div className="mb-6 rounded-xl bg-green-500/20 p-4 border border-green-500/30">
              <p className="text-sm text-green-200">{success}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            {mode === "signup" && (
              <div>
                <label className="block text-sm font-medium text-white mb-2">
                  Full Name
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/60 transition"
                  disabled={loading}
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/60 transition"
                required
                disabled={loading}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-white mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full rounded-xl bg-white/10 border border-white/20 px-4 py-3 text-white placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-fuchsia-400/60 transition"
                required
                disabled={loading}
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-xl bg-gradient-to-r from-violet-500 to-fuchsia-500 px-4 py-3 font-semibold text-white shadow-lg shadow-fuchsia-500/30 transition hover:shadow-xl hover:shadow-fuchsia-500/40 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent" />
                  {mode === "signin" ? "Signing in..." : "Creating account..."}
                </span>
              ) : mode === "signin" ? (
                "Sign In"
              ) : (
                "Create Account"
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="my-6 flex items-center gap-3">
            <div className="flex-1 border-t border-white/10" />
            <span className="text-xs text-slate-400">OR</span>
            <div className="flex-1 border-t border-white/10" />
          </div>

          {/* Google login button */}
          <a
            href={`${process.env.NEXT_PUBLIC_API_HOST || "http://localhost:3001"}/api/auth/google`}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-white/20 bg-white/5 px-4 py-3 text-white transition hover:bg-white/10"
          >
            <FaGoogle className="text-lg" />
            Continue with Google
          </a>

          {/* Toggle mode */}
          <div className="mt-6 text-center">
            <p className="text-sm text-slate-300">
              {mode === "signin" ? "Don't have an account?" : "Already have an account?"}
              <button
                type="button"
                onClick={toggleMode}
                className="ml-2 font-semibold text-fuchsia-400 hover:text-fuchsia-300 transition"
              >
                {mode === "signin" ? "Sign Up" : "Sign In"}
              </button>
            </p>
          </div>
        </div>

        {/* Footer info */}
        <div className="mt-8 text-center text-xs text-slate-400">
          <p>By continuing, you agree to our Terms of Service and Privacy Policy</p>
        </div>
      </div>
    </div>
  );
}
