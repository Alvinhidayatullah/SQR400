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
    <main className="min-h-screen bg-slate-950 text-slate-100 flex flex-col justify-center items-center p-4 relative overflow-hidden font-mono select-none">
      {/* Mesh Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-40 pointer-events-none no-print" />

      {/* Cyber Ambient Spotlights */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[150px] pointer-events-none no-print" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/10 blur-[150px] pointer-events-none no-print" />

      {/* Web3 Node Statistics Bar */}
      <div className="mb-6 bg-slate-900/40 backdrop-blur-md border border-slate-800/80 rounded-full px-5 py-2 flex items-center gap-6 text-[10px] text-slate-400 shadow-xl relative z-10 no-print">
        <div className="flex items-center gap-2">
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
          <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />
          <span>MAINNET: ONLINE</span>
        </div>
        <div className="w-px h-3 bg-slate-800" />
        <div>User Online : {stats.onlineCount}</div>
        <div className="w-px h-3 bg-slate-800" />
        <div>user active : {stats.activeCount}</div>
      </div>

      {/* Glassmorphic Portal Box */}
      <div className="w-full max-w-md bg-slate-900/30 backdrop-blur-2xl border border-slate-850 rounded-3xl p-8 shadow-2xl relative z-10 no-print">
        {/* Glow Line Indicator */}
        <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />

        {/* Brand Header */}
        <div className="flex flex-col items-center mb-8">
          <div className="w-16 h-16 bg-slate-950 border border-slate-800 rounded-2xl flex items-center justify-center mb-4 relative shadow-inner group">
            {/* Holographic rings */}
            <div className="absolute inset-[-4px] rounded-2xl border border-cyan-500/20 group-hover:scale-105 transition-all duration-300 pointer-events-none" />
            <span className="text-3xl text-cyan-400">⚡</span>
          </div>
          <h1 className="text-xl font-black tracking-widest text-white uppercase text-center font-mono">
            SQR400 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">GATEWAY</span>
          </h1>
          <p className="text-[9px] text-slate-500 font-mono tracking-widest uppercase mt-1">
            Decentralized Cryptographic SWIFT Portal
          </p>
        </div>

        {/* Tab Buttons */}
        <div className="flex bg-slate-950/80 p-1.5 rounded-2xl mb-6 border border-slate-850">
          <button
            type="button"
            onClick={() => setIsSignUp(false)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all uppercase tracking-wider ${
              !isSignUp
                ? "bg-slate-900 text-cyan-400 shadow-lg border border-slate-800"
                : "text-slate-500 hover:text-slate-350"
            }`}
          >
            Connect Node
          </button>
          <button
            type="button"
            onClick={() => setIsSignUp(true)}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition-all uppercase tracking-wider ${
              isSignUp
                ? "bg-slate-900 text-cyan-400 shadow-lg border border-slate-800"
                : "text-slate-500 hover:text-slate-355"
            }`}
          >
            Register Key
          </button>
        </div>

        {/* Status Alerts */}
        {error && (
          <div className="mb-5 p-3.5 bg-red-950/30 border border-red-900/40 text-red-300 text-xs rounded-xl flex items-center gap-2 font-medium">
            <span>[ERROR]:</span> {error}
          </div>
        )}
        {success && (
          <div className="mb-5 p-3.5 bg-emerald-950/30 border border-emerald-900/40 text-emerald-300 text-xs rounded-xl flex items-center gap-2 font-medium">
            <span>[SUCCESS]:</span> {success}
          </div>
        )}

        {/* Auth Inputs Form */}
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-[10px] font-bold text-slate-450 uppercase tracking-widest block mb-1.5 font-sans">
              Username
            </label>
            <input
              type="text"
              autoComplete="off"
              className="w-full px-4 py-3 bg-slate-950/80 border border-slate-850 focus:border-cyan-500 rounded-xl text-sm text-slate-100 placeholder-slate-650 outline-none transition-all duration-300 focus:ring-2 focus:ring-cyan-500/10 focus:shadow-[0_0_15px_rgba(6,182,212,0.05)]"
              placeholder="Enter account username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>
          <div>
            <label className="text-[10px] font-bold text-slate-455 uppercase tracking-widest block mb-1.5 font-sans">
              Password
            </label>
            <input
              type="password"
              className="w-full px-4 py-3 bg-slate-950/80 border border-slate-850 focus:border-cyan-500 rounded-xl text-sm text-slate-100 placeholder-slate-650 outline-none transition-all duration-300 focus:ring-2 focus:ring-cyan-500/10 focus:shadow-[0_0_15px_rgba(6,182,212,0.05)]"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-4 mt-2 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 disabled:opacity-50 text-white rounded-xl font-bold text-xs tracking-widest uppercase transition-all duration-300 shadow-xl shadow-cyan-500/10 hover:shadow-cyan-500/25 active:scale-98"
          >
            {loading ? "INITIALIZING SECURE SOCKETS..." : isSignUp ? "ESTABLISH DECENTRALIZED NODE KEY" : "AUTHENTICATE GATEWAY NODE"}
          </button>
        </form>
      </div>

      {/* Footer copyright */}
      <div className="mt-8 text-[9px] font-mono text-slate-650 tracking-widest relative z-10 uppercase">
        SQR400 PROTOCOL • ALL CONNECTIONS ENCRYPTED UNDER SHA-256 PBKDF2
      </div>
    </main>
  );
}
