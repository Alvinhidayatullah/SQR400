"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminPage() {
  const router = useRouter();
  const [session, setSession] = useState(null);
  const [users, setUsers] = useState([]);
  const [traffic, setTraffic] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchUser, setSearchUser] = useState("");
  const [flushConfirm, setFlushConfirm] = useState(false);
  const [stats, setStats] = useState({ onlineCount: 1, activeCount: 1 });

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

  useEffect(() => {
    // Session Guard
    const storedSession = localStorage.getItem("sqr400_session");
    if (!storedSession) {
      router.push("/login");
      return;
    }
    const parsed = JSON.parse(storedSession);
    if (parsed.role !== "admin" || !parsed.adminToken) {
      router.push("/");
      return;
    }
    setSession(parsed);
    fetchData(parsed.adminToken);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router]);

  const fetchData = async (adminToken?: any) => {
    const token = adminToken || (session && session.adminToken);
    if (!token) return;

    setLoading(true);
    try {
      const usersRes = await fetch("/api/admin/users", {
        headers: { "x-admin-token": token }
      });
      const usersData = await usersRes.json();
      if (usersRes.ok) setUsers(usersData.users);

      const trafficRes = await fetch("/api/admin/traffic", {
        headers: { "x-admin-token": token }
      });
      const trafficData = await trafficRes.json();
      if (trafficRes.ok) setTraffic(trafficData.traffic);
    } catch (err) {
      console.error("Error fetching admin stats:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteUser = async (username) => {
    if (!session?.adminToken) return;
    if (!confirm(`Are you sure you want to permanently delete user "${username}"?`)) {
      return;
    }
    try {
      const res = await fetch(`/api/admin/users?username=${encodeURIComponent(username)}`, {
        method: "DELETE",
        headers: { "x-admin-token": session.adminToken }
      });
      if (res.ok) {
        fetchData();
      } else {
        const err = await res.json();
        alert(err.error || "Failed to delete user");
      }
    } catch (err) {
      console.error("Delete user error:", err);
    }
  };

  const handleClearTraffic = async () => {
    if (!session?.adminToken) return;
    try {
      const res = await fetch("/api/admin/traffic", {
        method: "DELETE",
        headers: { "x-admin-token": session.adminToken }
      });
      if (res.ok) {
        setFlushConfirm(false);
        fetchData();
      } else {
        alert("Failed to clear traffic logs");
      }
    } catch (err) {
      console.error("Clear traffic error:", err);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("sqr400_session");
    router.push("/login");
  };

  // Filter traffic by search username
  const filteredTraffic = traffic.filter((t) =>
    t.username.toLowerCase().includes(searchUser.toLowerCase())
  );

  if (!session) return null;

  return (
    <main className="min-h-screen text-slate-100 py-10 px-4 md:px-8 font-sans antialiased relative overflow-hidden select-none">
      {/* Mesh Grid Pattern Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)] opacity-30 pointer-events-none no-print" />

      {/* Cyber Ambient Spotlights */}
      <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] rounded-full bg-red-500/10 blur-[150px] pointer-events-none no-print" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-orange-500/5 blur-[150px] pointer-events-none no-print" />

      <div className="max-w-6xl mx-auto relative z-10">
        
        {/* Validator Control Header */}
        <div className="bg-[#020617]/40 backdrop-blur-3xl border border-white/5 rounded-[2rem] p-6 lg:p-8 flex flex-col lg:flex-row justify-between items-center shadow-[0_0_40px_rgba(0,0,0,0.5)] mb-10 gap-6 no-print">
          <div className="flex items-center gap-5">
            <div className="w-12 h-12 bg-slate-900/50 border border-white/10 rounded-2xl flex items-center justify-center relative shadow-inner group">
              <span className="text-2xl text-red-500 drop-shadow-[0_0_10px_rgba(239,68,68,0.5)] group-hover:scale-110 transition-transform duration-500">🛡️</span>
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full border-2 border-slate-900 animate-pulse shadow-[0_0_10px_rgba(239,68,68,0.5)]" />
            </div>
            <div>
              <h1 className="text-2xl font-black tracking-widest text-white uppercase font-outfit">
                SQR400 <span className="text-red-500 text-sm font-bold ml-2 px-2 py-0.5 bg-red-500/10 rounded-lg">VALIDATOR</span>
              </h1>
              <p className="text-xs text-slate-400 font-sans tracking-widest uppercase mt-1">
                Secure Ledger Management Portal
              </p>
            </div>
          </div>

          {/* Node Metrics */}
          <div className="flex flex-wrap items-center gap-4 text-xs font-semibold text-slate-400 font-outfit uppercase tracking-widest">
            <div className="bg-red-500/5 border border-red-500/10 px-4 py-2 rounded-xl">
              <span className="text-slate-500">ROLE:</span> <span className="text-red-400">ADMIN</span>
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

          {/* Control Buttons */}
          <div className="flex items-center gap-4 text-sm font-semibold font-outfit">
            <button
              onClick={() => router.push("/")}
              className="px-5 py-2.5 bg-white/5 hover:bg-white/10 text-slate-300 hover:text-white rounded-xl transition duration-300 border border-white/5 text-xs tracking-widest uppercase"
            >
              🖥️ Console
            </button>
            <button
              onClick={handleLogout}
              className="px-5 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-xl transition duration-300 border border-red-500/20 text-xs tracking-widest uppercase"
            >
              🔒 Disconnect
            </button>
          </div>
        </div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Box: Registered Users Nodes */}
            <div className="lg:col-span-4 bg-slate-900/30 border border-slate-850 rounded-3xl p-6 shadow-2xl h-fit backdrop-blur-md relative overflow-hidden">
              <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-cyan-500/20 to-transparent" />
              
              <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase mb-5 flex items-center gap-2">
                <span>👥</span> [ NODE USER IDENTITIES ({users.length}) ]
              </h2>
              {users.length === 0 ? (
                <p className="text-sm text-slate-650 italic py-4 font-mono">NO USER NODES INSTANTIATED</p>
              ) : (
                <div className="space-y-3">
                  {users.map((user) => (
                    <div
                      key={user.username}
                      className="p-4 bg-slate-950/60 border border-slate-900 hover:border-slate-850 rounded-2xl flex justify-between items-center transition group relative"
                    >
                      <div className="truncate pr-3">
                        <span className="text-base font-bold text-slate-200 block truncate">
                          {user.username}
                        </span>
                        <span className="text-sm text-slate-500 block font-mono mt-1">
                          REG: {new Date(user.registeredAt).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-cyan-400 font-bold block mt-1">
                          BLOCK TRANSACTIONS: {user.printCount}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteUser(user.username)}
                        className="opacity-0 group-hover:opacity-100 p-2.5 bg-red-950/40 hover:bg-red-900/50 text-red-400 hover:text-red-200 rounded-xl text-sm font-bold transition outline-none"
                        title="Delete Node Ident"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Box: Cryptographic Ledger Logs */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-slate-900/30 border border-slate-850 rounded-3xl p-6 shadow-2xl backdrop-blur-md relative overflow-hidden">
                <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-red-500/20 to-transparent" />
                
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-2">
                      <span>📊</span> [ TRANSACTIONS LEDGER LOGS ]
                    </h2>
                    <p className="text-sm text-slate-550 mt-1">Total items synced: {traffic.length}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="Filter node identifier..."
                      className="px-4 py-2.5 bg-slate-950 border border-slate-850 focus:border-red-500 rounded-xl text-sm text-slate-200 outline-none w-full sm:w-44 focus:ring-1 focus:ring-red-900/20 font-mono"
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                    />
                    {!flushConfirm ? (
                      <button
                        onClick={() => setFlushConfirm(true)}
                        className="px-4 py-2.5 bg-red-950/30 hover:bg-red-900/40 text-red-400 hover:text-red-300 rounded-xl text-sm font-bold transition border border-red-900/30 font-mono"
                      >
                        🔥 Flush Ledger
                      </button>
                    ) : (
                      <div className="flex items-center gap-2 font-mono">
                        <button
                          onClick={handleClearTraffic}
                          className="px-3 py-2 bg-red-650 text-white rounded-xl text-sm font-bold transition hover:bg-red-750"
                        >
                          Confirm Flush
                        </button>
                        <button
                          onClick={() => setFlushConfirm(false)}
                          className="px-3 py-2 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded-xl text-sm font-bold transition"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Ledger Terminal Screen */}
                <div className="bg-slate-950/80 border border-slate-900 rounded-2xl p-4 overflow-hidden relative shadow-inner">
                  {filteredTraffic.length === 0 ? (
                    <div className="text-center py-12 text-slate-650 text-sm font-mono">
                      NO CRYPTOGRAPHIC ENTRIES IN LEDGER
                    </div>
                  ) : (
                    <div className="max-h-[500px] overflow-y-auto font-mono text-sm space-y-2.5 pr-2 custom-scrollbar">
                      {filteredTraffic.map((log) => (
                        <div
                          key={log.id}
                          className="p-3 bg-slate-900/25 border border-slate-900 hover:border-slate-850 rounded-xl transition flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-slate-450"
                        >
                          <div>
                            <span className="text-red-400 font-bold">[{log.username.toUpperCase()}]</span>{" "}
                            <span className="text-slate-300">Generated {log.bank.toUpperCase()} SWIFT Node printout</span>
                            <div className="mt-1 flex flex-wrap gap-2 text-sm text-slate-600">
                              <span>Ref: {log.senderRef}</span>
                              <span>•</span>
                              <span>Amt: {log.currency} {parseFloat(log.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                            </div>
                          </div>
                          <span className="text-sm text-slate-600 sm:text-right shrink-0">
                            {new Date(log.timestamp).toLocaleString()}
                          </span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
