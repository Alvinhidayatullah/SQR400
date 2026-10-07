"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import BankSelector from "./components/BankSelector";
import HSBCForm from "./banks/hsbc/HSBCForm";
import BNIForm from "./banks/bni/BNIForm";
import DeutscheForm from "./banks/deutsche/DeutscheForm";
import DeutscheFormV2 from "./banks/deutsche/DeutscheFormV2";
import DeutscheFormV3 from "./banks/deutsche/DeutscheFormV3";
import MandiriForm from "./banks/mandiri/MandiriForm";
import BCAForm from "./banks/bca/BCAForm";
import CitiForm from "./banks/citi/CitiForm";
import CISForm from "./banks/cis/CISForm";
import CISFormV2 from "./banks/cis/CISFormV2";
import POFForm from "./banks/pof/POFForm";
import TransactionResult from "./components/TransactionResult";

export default function Home() {
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  const session = sessionData?.user as any;
  const [selectedBank, setSelectedBank] = useState("hsbc");
  const [transactionData, setTransactionData] = useState(null);
  const [showResult, setShowResult] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

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
    if (status === "unauthenticated") {
      router.push("/login");
    }
    if (session) {
      setSettingsUsername(session.name || session.username);
    }
  }, [status, session, router]);

  useEffect(() => {
    if (!session) return;
    const fetchStats = async () => {
      try {
        const currentUsername = session.name || session.username;
        const res = await fetch(`/api/stats?username=${encodeURIComponent(currentUsername)}`);
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
    setIsGenerating(true);
    let finalData = { ...data };

    if (session) {
      try {
        // Log user generation traffic on the backend
        await fetch("/api/traffic", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: session.name || session.username,
            bank: data.selectedBank,
            amount: data.transaction?.amount || "0",
            currency: data.transaction?.currency || "EUR",
            senderRef: data.transaction?.senderReference || "N/A",
          }),
        });

        // Save full transaction data to the database to generate a public link
        const res = await fetch("/api/transactions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            username: session.name || session.username,
            bank: data.selectedBank,
            transactionData: data,
          }),
        });

        if (res.ok) {
          const result = await res.json();
          if (result.success && result.slug) {
            finalData.slug = result.slug;
          }
        }
      } catch (err) {
        console.error("Failed to log printout generation traffic or save transaction:", err);
      }
    }

    setTransactionData(finalData);
    setIsGenerating(false);
    setShowResult(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
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
          currentUsername: session.name || session.username,
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
      
      // Since NextAuth session handles JWT, we don't manually set localStorage anymore
      // We could trigger session update here if needed.

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

  const handleLogout = async () => {
    await signOut({ redirect: false });
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
      case "deutsche_v2":
        return <DeutscheFormV2 onSubmit={handleSubmit} />;
      case "deutsche_v3":
        return <DeutscheFormV3 onSubmit={handleSubmit} />;
      case "mandiri":
        return <MandiriForm onSubmit={handleSubmit} />;
      case "bca":
        return <BCAForm onSubmit={handleSubmit} />;
      case "citi":
        return <CitiForm onSubmit={handleSubmit} />;
      case "cis":
        return <CISForm onSubmit={handleSubmit} />;
      case "cis_v2":
        return <CISFormV2 onSubmit={handleSubmit} />;
      case "pof":
        return <POFForm onSubmit={handleSubmit} />;
      default:
        return <HSBCForm onSubmit={handleSubmit} />;
    }
  };

  if (status === "loading" || !session) return null; // Avoid flashing content before redirect

  return (
    <main className="min-h-screen text-slate-100 py-10 px-4 md:px-8 font-sans antialiased relative overflow-hidden select-none bg-slate-950">
      <div className="max-w-[1400px] w-full mx-auto relative z-10">
        {/* Premium Header Navigation */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 flex flex-col xl:flex-row justify-between items-center shadow-lg no-print mb-8 gap-6 transition-all duration-300">
          
          {/* Left: Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center relative shrink-0">
              <span className="text-2xl text-blue-400 relative z-10">🏦</span>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl font-bold tracking-wide text-white flex items-center gap-3">
                SQR400 
                <span className="text-xs text-blue-300 bg-blue-900/40 px-2 py-1 rounded tracking-widest font-mono">v5.8</span>
              </h1>
              <p className="text-sm text-slate-400 tracking-wide mt-1">
                System Dashboard
              </p>
            </div>
          </div>

          {/* Center: Network Status Indicators */}
          <div className="flex items-center bg-slate-950 rounded-xl border border-slate-800 p-2 shadow-inner w-full md:w-auto justify-center">
            <div className="px-3 md:px-4 flex items-center gap-2">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <span className="text-xs font-semibold text-slate-300 uppercase">Production</span>
            </div>
            <div className="w-px h-5 bg-slate-800 mx-1 md:mx-2" />
            <div className="px-3 md:px-4 flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase">Users Online</span>
              <span className="text-sm font-bold text-white">{stats.onlineCount}</span>
            </div>
            <div className="w-px h-5 bg-slate-800 mx-1 md:mx-2" />
            <div className="px-3 md:px-4 flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase">Active Sessions</span>
              <span className="text-sm font-bold text-white">{stats.activeCount}</span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full xl:w-auto">
            {session.role === "admin" && (
              <button
                onClick={() => router.push("/admin")}
                className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg transition duration-200 border border-slate-700 text-sm font-semibold flex items-center gap-2"
              >
                <span>⚙️</span> Administration
              </button>
            )}
            
            <div className="flex items-center bg-slate-900 rounded-lg border border-slate-800 p-1 shadow-sm">
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
                className="px-4 py-2 hover:bg-slate-800 rounded-md transition-colors flex items-center gap-2 group"
                title="Account Settings"
              >
                <span className="text-sm">👤</span>
                <span className="text-sm font-semibold text-slate-300 group-hover:text-white transition-colors">
                  {(session.name || session.username).length > 10 ? `${(session.name || session.username).substring(0, 7)}...` : (session.name || session.username)}
                </span>
              </button>
              
              <div className="w-px h-5 bg-slate-800 mx-1" />
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 hover:bg-red-900/50 rounded-md transition-colors flex items-center gap-2 group text-slate-300 hover:text-red-400"
              >
                <span className="text-sm font-semibold">Logout</span>
                <span className="text-sm">🚪</span>
              </button>
            </div>
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
          {isGenerating ? (
            <div className="flex flex-col items-center justify-center py-20 bg-slate-900 border border-slate-800 rounded-2xl shadow-lg">
              <div className="w-12 h-12 border-4 border-blue-500/30 border-t-blue-500 rounded-full animate-spin mb-4" />
              <p className="text-blue-400 font-semibold tracking-wider text-base animate-pulse">Generating Document...</p>
            </div>
          ) : !showResult ? (
            <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-8 shadow-xl">
              {renderForm()}
            </div>
          ) : (
            <TransactionResult data={transactionData} onBack={handleBack} />
          )}
        </div>
      </div>

      {/* Account Settings Modal */}
      {showSettings && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm no-print">
          <div className="w-full max-w-lg bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-2xl relative overflow-hidden">
            <h2 className="text-xl font-bold tracking-wide text-white mb-6">
              Account Settings
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
