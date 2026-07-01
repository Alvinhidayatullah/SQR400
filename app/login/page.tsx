"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const [isSignUp, setIsSignUp] = useState(false);
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ onlineCount: 1, activeCount: 1 });

  useEffect(() => {
    setError("");
    setSuccess("");
  }, [isSignUp]);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await fetch("/api/stats");
        if (res.ok) {
          const data = await res.json();
          setStats(data);
        }
      } catch (err) {
        console.error("Failed to fetch stats", err);
      }
    };
    fetchStats();
    const interval = setInterval(fetchStats, 5000);
    return () => clearInterval(interval);
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    setLoading(true);

    const endpoint = isSignUp ? "/api/auth/register" : "/api/auth/login";

    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Portal access denied");
      }

      if (isSignUp) {
        setSuccess("Cryptographic identity verified! Access granted. Proceed to login.");
        setIsSignUp(false);
        setPassword("");
      } else {
        localStorage.setItem("sqr400_session", JSON.stringify(data.user));
        if (data.user.role === "admin") {
          router.push("/admin");
        } else {
          router.push("/");
        }
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-sans select-none">
      {/* Mesh Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none no-print" />

      {/* Cyber Ambient Spotlights */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-500/10 blur-[150px] pointer-events-none no-print" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none no-print" />

      {/* Web3 Node Statistics Bar */}
      <div className="mb-8 bg-white/5 backdrop-blur-xl border border-white/5 rounded-full px-6 py-2.5 flex items-center gap-6 text-sm text-slate-300 shadow-2xl relative z-10 no-print font-outfit">
        <div className="flex items-center gap-2">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="tracking-wide text-xs uppercase font-semibold">Mainnet: Online</span>
        </div>
        <div className="w-px h-4 bg-white/10" />
        <div className="text-xs uppercase tracking-wide font-semibold">User Online: <span className="text-white">{stats.onlineCount}</span></div>
        <div className="w-px h-4 bg-white/10" />
        <div className="text-xs uppercase tracking-wide font-semibold">User Active: <span className="text-white">{stats.activeCount}</span></div>
      </div>

      {/* Glassmorphic Portal Box */}
      <div className="w-full max-w-md bg-[#020617]/40 backdrop-blur-3xl border border-white/10 rounded-[2rem] p-8 sm:p-10 shadow-[0_0_40px_rgba(0,0,0,0.5)] relative z-10 no-print">
        {/* Glow Line Indicator */}
        <div className="absolute top-0 left-10 right-10 h-[1px] bg-gradient-to-r from-transparent via-cyan-400/50 to-transparent" />

        {/* Brand Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-16 h-16 bg-slate-900/50 border border-white/10 rounded-2xl flex items-center justify-center mb-5 relative shadow-inner group">
            {/* Holographic rings */}
            <div className="absolute inset-[-1px] rounded-2xl border border-cyan-500/30 group-hover:scale-[1.03] transition-all duration-500 pointer-events-none" />
            <span className="text-3xl text-cyan-400 group-hover:scale-110 transition-transform duration-500 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)]">⚡</span>
          </div>
          <h1 className="text-2xl font-black tracking-wider text-white font-outfit">
            SQR400 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-indigo-400">GATEWAY</span>
          </h1>
          <p className="text-xs text-slate-400 font-sans tracking-widest uppercase mt-2">
            Decentralized Swift Portal
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-900/50 p-1 rounded-2xl mb-8 border border-white/5">
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all uppercase tracking-widest font-outfit ${
              !isSignUp
                ? "bg-white/10 text-white shadow-md border border-white/5"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Connect
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2.5 text-xs font-semibold rounded-xl transition-all uppercase tracking-widest font-outfit ${
              isSignUp
                ? "bg-white/10 text-white shadow-md border border-white/5"
                : "text-slate-500 hover:text-slate-300"
            }`}
          >
            Register
          </button>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-200 text-sm rounded-2xl flex items-center gap-3 font-medium backdrop-blur-sm">
            <span className="text-red-400">⚠️</span> {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 text-emerald-200 text-sm rounded-2xl flex items-center gap-3 font-medium backdrop-blur-sm">
            <span className="text-emerald-400">✅</span> {success}
          </div>
        )}

        {/* Auth Inputs Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block font-outfit">
              Username
            </label>
            <input
              type="text"
              autoComplete="off"
              className="w-full px-5 py-3.5 bg-slate-950/50 border border-white/5 focus:border-cyan-500/50 rounded-2xl text-sm text-slate-100 placeholder-slate-600 outline-none transition-all duration-300 focus:ring-4 focus:ring-cyan-500/10 focus:bg-slate-900/80 font-sans"
              placeholder="Enter node identity"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-400 uppercase tracking-widest block font-outfit">
              Cryptographic Key
            </label>
            <input
              type="password"
              className="w-full px-5 py-3.5 bg-slate-950/50 border border-white/5 focus:border-cyan-500/50 rounded-2xl text-sm text-slate-100 placeholder-slate-600 outline-none transition-all duration-300 focus:ring-4 focus:ring-cyan-500/10 focus:bg-slate-900/80 font-sans tracking-widest"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-4 bg-gradient-to-r from-cyan-500 to-indigo-500 hover:from-cyan-400 hover:to-indigo-400 disabled:opacity-50 text-white rounded-2xl font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-[0_0_20px_rgba(6,182,212,0.2)] hover:shadow-[0_0_30px_rgba(6,182,212,0.4)] active:scale-[0.98] font-outfit"
          >
            {loading ? "INITIALIZING SECURE SOCKETS..." : isSignUp ? "ESTABLISH DECENTRALIZED KEY" : "AUTHENTICATE GATEWAY NODE"}
          </button>
        </form>
      </div>

      {/* Footer copyright */}
      <div className="mt-12 text-[10px] font-sans text-slate-500 tracking-widest relative z-10 uppercase opacity-60">
        SQR400 PROTOCOL • SECURED VIA SHA-256 PBKDF2
      </div>
    </main>
  );
}
