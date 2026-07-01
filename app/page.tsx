"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import BankSelector from "./components/BankSelector";
import HSBCForm from "./banks/hsbc/HSBCForm";
import BNIForm from "./banks/bni/BNIForm";
import DeutscheForm from "./banks/deutsche/DeutscheForm";
import MandiriForm from "./banks/mandiri/MandiriForm";
import BCAForm from "./banks/bca/BCAForm";
import CitiForm from "./banks/citi/CitiForm";
import TransactionResult from "./components/TransactionResult";

export default function Home() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [selectedBank, setSelectedBank] = useState("hsbc");
  const [transactionData, setTransactionData] = useState(null);
  const [showResult, setShowResult] = useState(false);

  const [stats, setStats] = useState({ onlineCount: 1, activeCount: 1 });
  const [showSettings, setShowSettings] = useState(false);
  const [settingsUsername, setSettingsUsername] = useState("");
  const [settingsCurrentPassword, setSettingsCurrentPassword] = useState("");
  const [settingsNewPassword, setSettingsNewPassword] = useState("");
  const [settingsConfirmPassword, setSettingsConfirmPassword] = useState("");
  const [settingsError, setSettingsError] = useState("");
  const [settingsSuccess, setSettingsSuccess] = useState("");
  const [settingsLoading, setSettingsLoading] = useState(false);

  useEffect(() => {
    // Route guard check
    const storedSession = localStorage.getItem("sqr400_session");
    if (!storedSession) {
      router.push("/login");
      return;
    }
    const parsed = JSON.parse(storedSession);
    setSession(parsed);
    setSettingsUsername(parsed.username);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  useEffect(() => {
    if (!session) return;
    const fetchStats = async () => {
      try {
        const res = await fetch(`/api/stats?username=${encodeURIComponent(session.username)}`);
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
  }, [session]);

  const handleSubmit = async (data) => {
    setTransactionData(data);
    setShowResult(true);
    window.scrollTo({ top: 0, behavior: "smooth" });

    // Log user generation traffic on the backend
    if (session) {
      try {
        await fetch("/api/traffic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: session.username,
            bank: data.selectedBank,
            amount: data.transaction?.amount || "0",
            currency: data.transaction?.currency || "EUR",
            senderRef: data.transaction?.senderReference || "N/A",
          }),
        });
      } catch (err) {
        console.error("Failed to log printout generation traffic:", err);
      }
    }
  };

  const handleBack = () => {
    setShowResult(false);
  };

  const handleUpdateSettings = async (e) => {
    e.preventDefault();
    setSettingsError("");
    setSettingsSuccess("");

    if (!settingsCurrentPassword) {
      setSettingsError("Current password is required to authorize modifications.");
      return;
    }

    if (settingsNewPassword && settingsNewPassword !== settingsConfirmPassword) {
      setSettingsError("New password and confirmation password do not match.");
      return;
    }

    setSettingsLoading(true);

    try {
      const res = await fetch("/api/auth/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentUsername: session.username,
          currentPassword: settingsCurrentPassword,
          newUsername: settingsUsername,
          newPassword: settingsNewPassword || null
        })
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update profile settings.");
      }

      setSettingsSuccess("Profile settings successfully updated! Syncing node...");
      
      // Update session locally
      const updatedSession = { ...session, username: data.username };
      localStorage.setItem("sqr400_session", JSON.stringify(updatedSession));
      setSession(updatedSession);

      // Clean inputs
      setSettingsCurrentPassword("");
      setSettingsNewPassword("");
      setSettingsConfirmPassword("");

      // Autoclose after delay
      setTimeout(() => {
        setShowSettings(false);
        setSettingsSuccess("");
      }, 2000);
    } catch (err) {
      setSettingsError(err.message);
    } finally {
      setSettingsLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("sqr400_session");
    router.push("/login");
  };

  const renderForm = () => {
    switch (selectedBank) {
      case "hsbc":
        return <HSBCForm onSubmit={handleSubmit} />;
      case "bni":
        return <BNIForm onSubmit={handleSubmit} />;
      case "deutsche":
        return <DeutscheForm onSubmit={handleSubmit} />;
      case "mandiri":
        return <MandiriForm onSubmit={handleSubmit} />;
      case "bca":
        return <BCAForm onSubmit={handleSubmit} />;
      case "citi":
        return <CitiForm onSubmit={handleSubmit} />;
      default:
        return <HSBCForm onSubmit={handleSubmit} />;
    }
  };

  if (!session) return null; // Avoid flashing content before redirect

  return (
    <main className="min-h-screen text-slate-100 py-10 px-4 md:px-8 font-sans antialiased relative overflow-hidden select-none">
      {/* Dynamic Digital Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none no-print" />

      {/* Deep Space Glowing Accent Elements */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-cyan-500/10 blur-[150px] pointer-events-none select-none no-print" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-indigo-500/10 blur-[150px] pointer-events-none select-none no-print" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* dApp Styled Header Navigation */}
        <div className="bg-[#020617]/40 backdrop-blur-3xl border border-white/5 rounded-[2rem] p-6 lg:p-8 flex flex-col lg:flex-row justify-between items-center shadow-[0_0_40px_rgba(0,0,0,0.5)] no-print mb-10 gap-6">
          
          {/* Logo & Node Indicator */}
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-slate-900/50 border border-white/10 rounded-2xl flex items-center justify-center relative shadow-inner group">
              <span className="text-2xl text-cyan-400 drop-shadow-[0_0_10px_rgba(34,211,238,0.5)] group-hover:scale-110 transition-transform duration-500">⚡</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse shadow-[0_0_10px_rgba(16,185,129,0.5)]" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-widest text-white uppercase font-outfit">
                SQR400 <span className="text-cyan-400 text-sm font-bold ml-2 px-2 py-0.5 bg-cyan-500/10 rounded-lg">v5.8</span>
              </h1>
              <p className="text-xs text-slate-400 font-sans tracking-widest uppercase mt-1">
                Swift Crypto Bridge
              </p>
            </div>
          </div>

          {/* Network status badges */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400 font-outfit uppercase tracking-widest">
            <div className="bg-white/5 border border-white/5 px-4 py-2 rounded-xl flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-slate-500">NET:</span>
              <span className="text-white">Mainnet</span>
            </div>
            <div className="bg-white/5 border border-white/5 px-4 py-2 rounded-xl">
              <span className="text-slate-500">Online:</span>{" "}
              <span className="text-cyan-400">{stats.onlineCount}</span>
            </div>
            <div className="bg-white/5 border border-white/5 px-4 py-2 rounded-xl">
              <span className="text-slate-500">Active:</span>{" "}
              <span className="text-indigo-400">{stats.activeCount}</span>
            </div>
          </div>

          {/* Action Navigation Buttons */}
          <div className="flex items-center gap-4 text-sm font-semibold font-outfit">
            {session.role === "admin" && (
              <button
                onClick={() => router.push("/admin")}
                className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xl transition duration-300 border border-red-500/20 text-xs tracking-widest uppercase"
              >
                🔐 Admin Node
              </button>
            )}
            
            {/* Wallet Address username Badge */}
            <div className="bg-gradient-to-r from-cyan-500/10 to-indigo-500/10 border border-cyan-500/20 rounded-xl px-5 py-2.5 text-xs text-cyan-400 tracking-widest shadow-inner">
              🔑 {session.username.length > 10 ? `${session.username.substring(0, 7)}...` : session.username}
            </div>

            <button
              onClick={() => {
                setSettingsUsername(session.username);
                setSettingsCurrentPassword("");
                setSettingsNewPassword("");
                setSettingsConfirmPassword("");
                setSettingsError("");
                setSettingsSuccess("");
                setShowSettings(true);
              }}
              className="p-3 bg-white/5 hover:bg-white/10 text-slate-400 hover:text-white border border-white/5 rounded-xl transition duration-300 group"
              title="Identity & Password Settings"
            >
              <span className="group-hover:rotate-45 block transition-transform duration-300">⚙️</span>
            </button>

            <button
              onClick={handleLogout}
              className="p-3 bg-white/5 hover:bg-red-500/20 text-slate-400 hover:text-red-400 border border-white/5 hover:border-red-500/30 rounded-xl transition duration-300"
              title="Disconnect Node"
            >
              🔌
            </button>
          </div>
        </div>

        {/* Bank Selector - Custom Node Grid */}
        {!showResult && (
          <div className="no-print">
            <BankSelector selectedBank={selectedBank} onSelectBank={setSelectedBank} />
          </div>
        )}

        {/* Form or Result Container */}
        <div className="transition-all duration-300">
          {!showResult ? (
            <div className="bg-slate-900/30 border border-slate-850 rounded-3xl p-1 md:p-2 shadow-2xl backdrop-blur-md">
              {renderForm()}
            </div>
          ) : (
            <TransactionResult data={transactionData} onBack={handleBack} />
          )}
        </div>
      </div>

      {/* Web3 Settings Modal (OWASP Anti-XSS & BAC/IDOR protection enabled) */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm no-print">
          <div className="w-full max-w-md bg-slate-900/90 border border-slate-850 rounded-3xl p-6 shadow-2xl relative overflow-hidden">
            {/* Glow line decoration */}
            <div className="absolute top-0 left-6 right-6 h-[2px] bg-gradient-to-r from-transparent via-cyan-500 to-transparent" />
            
            <h2 className="text-base font-bold tracking-widest text-slate-200 uppercase mb-5 font-mono">
              [ EDIT GATEWAY IDENTITY ]
            </h2>

            {settingsError && (
              <div className="mb-4 p-3 bg-red-950/30 border border-red-900/40 text-red-300 text-sm rounded-xl flex items-center gap-2 font-mono">
                <span>[ERROR]:</span> {settingsError}
              </div>
            )}

            {settingsSuccess && (
              <div className="mb-4 p-3 bg-emerald-950/30 border border-emerald-900/40 text-emerald-300 text-sm rounded-xl flex items-center gap-2 font-mono">
                <span>[SUCCESS]:</span> {settingsSuccess}
              </div>
            )}

            <form onSubmit={handleUpdateSettings} className="space-y-4 font-mono">
              <div>
                <label className="text-sm font-bold text-slate-400 block mb-1.5 uppercase tracking-widest">
                  Username
                </label>
                <input
                  type="text"
                  autoComplete="off"
                  className="w-full px-4 py-3 bg-slate-950/80 border border-slate-850 focus:border-cyan-500 rounded-xl text-base text-slate-100 placeholder-slate-650 outline-none transition-all duration-300"
                  placeholder="New Username"
                  value={settingsUsername}
                  onChange={(e) => setSettingsUsername(e.target.value)}
                  required
                />
              </div>

              <div className="border-t border-slate-850/60 my-4 pt-4">
                <p className="text-sm text-slate-500 uppercase tracking-wider mb-3">
                  OPTIONAL PASSWORD MODIFICATION
                </p>
                
                <div className="space-y-3">
                  <div>
                    <label className="text-sm font-bold text-slate-400 block mb-1.5 uppercase tracking-widest">
                      New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 bg-slate-950/80 border border-slate-850 focus:border-cyan-500 rounded-xl text-base text-slate-100 placeholder-slate-650 outline-none transition-all duration-300"
                      placeholder="Leave empty to keep current"
                      value={settingsNewPassword}
                      onChange={(e) => setSettingsNewPassword(e.target.value)}
                    />
                  </div>
                  <div>
                    <label className="text-sm font-bold text-slate-400 block mb-1.5 uppercase tracking-widest">
                      Confirm New Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-4 py-3 bg-slate-950/80 border border-slate-850 focus:border-cyan-500 rounded-xl text-base text-slate-100 placeholder-slate-650 outline-none transition-all duration-300"
                      placeholder="Confirm new password"
                      value={settingsConfirmPassword}
                      onChange={(e) => setSettingsConfirmPassword(e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="border-t border-slate-850/60 my-4 pt-4">
                <label className="text-sm font-bold text-red-400 block mb-1.5 uppercase tracking-widest">
                  Current Password *
                </label>
                <input
                  type="password"
                  className="w-full px-4 py-3 bg-slate-950/80 border border-red-900/30 focus:border-red-500 rounded-xl text-base text-slate-100 placeholder-slate-650 outline-none transition-all duration-300"
                  placeholder="Enter current password to verify identity"
                  value={settingsCurrentPassword}
                  onChange={(e) => setSettingsCurrentPassword(e.target.value)}
                  required
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="submit"
                  disabled={settingsLoading}
                  className="flex-1 py-3 bg-gradient-to-r from-cyan-600 to-purple-600 hover:from-cyan-500 hover:to-purple-500 disabled:opacity-50 text-white rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-300 shadow-xl shadow-cyan-500/10 hover:shadow-cyan-500/25 active:scale-98"
                >
                  {settingsLoading ? "UPDATING NODE..." : "SAVE CHANGES"}
                </button>
                <button
                  type="button"
                  onClick={() => setShowSettings(false)}
                  className="px-5 py-3 bg-slate-850 hover:bg-slate-800 text-slate-350 hover:text-white rounded-xl font-bold text-sm tracking-widest uppercase transition-all duration-200 border border-slate-800"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main>
  );
}
