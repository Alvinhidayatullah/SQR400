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

  useEffect(() => {
    // Route guard check
    const storedSession = localStorage.getItem("sqr400_session");
    if (!storedSession) {
      router.push("/login");
      return;
    }
    setSession(JSON.parse(storedSession));
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
    <main className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 md:px-8 font-mono antialiased relative overflow-hidden select-none">
      {/* Dynamic Digital Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none no-print" />

      {/* Deep Space Glowing Accent Elements */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-cyan-500/10 blur-[150px] pointer-events-none select-none no-print" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-purple-500/5 blur-[150px] pointer-events-none select-none no-print" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* dApp Styled Header Navigation */}
        <div className="bg-slate-900/40 backdrop-blur-2xl border border-slate-800/85 rounded-3xl p-6 flex flex-col lg:flex-row justify-between items-center shadow-2xl no-print mb-8 gap-4">
          
          {/* Logo & Node Indicator */}
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center relative shadow-inner">
              <span className="text-xl text-cyan-400">⚡</span>
              <span className="absolute top-0 right-0 w-2.5 h-2.5 bg-emerald-500 rounded-full border-2 border-slate-900 animate-pulse" />
            </div>
            <div>
              <h1 className="text-lg font-black tracking-widest text-white uppercase">
                SQR400 <span className="text-cyan-400 text-xs font-bold font-mono">NODE v5.8</span>
              </h1>
              <p className="text-[9px] text-slate-500 font-mono tracking-wider uppercase">
                SWIFT CRYPTO BRIDGE dAPP
              </p>
            </div>
          </div>

          {/* Network status badges */}
          <div className="flex flex-wrap items-center gap-3 lg:gap-4 text-[10px] text-slate-400 font-mono">
            <div className="bg-slate-950/60 border border-slate-850 px-3.5 py-1.5 rounded-xl flex items-center gap-2">
              <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-ping" />
              <span className="text-slate-550">NET:</span>
              <span className="text-slate-200">SWIFT_MAINNET</span>
            </div>
            <div className="bg-slate-950/60 border border-slate-850 px-3.5 py-1.5 rounded-xl">
              <span className="text-slate-550">User Online:</span>{" "}
              <span className="text-cyan-400 font-bold">{stats.onlineCount}</span>
            </div>
            <div className="bg-slate-950/60 border border-slate-850 px-3.5 py-1.5 rounded-xl">
              <span className="text-slate-550">user active:</span>{" "}
              <span className="text-purple-400 font-bold">{stats.activeCount}</span>
            </div>
          </div>

          {/* Action Navigation Buttons */}
          <div className="flex items-center gap-3 text-xs font-semibold">
            {session.role === "admin" && (
              <button
                onClick={() => router.push("/admin")}
                className="px-4 py-2 bg-red-950/40 hover:bg-red-900/40 text-red-400 hover:text-red-300 rounded-xl transition duration-200 border border-red-900/30 text-[10px] tracking-widest uppercase font-bold"
              >
                🔐 Administrator Node
              </button>
            )}
            
            {/* Wallet Address username Badge */}
            <div className="bg-gradient-to-r from-cyan-950/30 to-purple-950/30 border border-cyan-800/40 rounded-xl px-4 py-2 text-[11px] font-mono text-cyan-400 font-bold shadow-inner">
              🔑 {session.username.length > 10 ? `${session.username.substring(0, 7)}...` : session.username}
            </div>

            <button
              onClick={handleLogout}
              className="p-2.5 bg-slate-950 hover:bg-slate-900 text-slate-500 hover:text-red-450 border border-slate-850 hover:border-red-900/30 rounded-xl transition duration-200"
              title="Disconnect Node"
            >
              🔌
            </button>
          </div>
        </div>

        {/* Bank Selector - Custom Node Grid */}
        <div className="no-print">
          <BankSelector selectedBank={selectedBank} onSelectBank={setSelectedBank} />
        </div>

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
    </main>
  );
}
