"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";
import { ShieldCheck, Server, Users, UserRound, LogOut, LayoutDashboard, Trash2, List, Activity, Settings2 } from "lucide-react";
import { motion } from "framer-motion";

export default function AdminPage() {
  const router = useRouter();
  const { data: sessionData, status } = useSession();
  const session = sessionData?.user as any;
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

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/login");
      return;
    }
    
    if (session) {
      if (session.role !== "admin" || !session.adminToken) {
        router.push("/");
        return;
      }
      fetchData(session.adminToken);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [status, session, router]);

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

  const handleLogout = async () => {
    await signOut({ redirect: false });
    router.push("/login");
  };

  // Filter traffic by search username
  const filteredTraffic = traffic.filter((t) =>
    t.username.toLowerCase().includes(searchUser.toLowerCase())
  );

  if (status === "loading" || !session) return null;

  return (
    <main className="min-h-screen text-slate-100 py-10 px-4 md:px-8 font-sans antialiased relative overflow-hidden select-none bg-slate-950">
      {/* Background with GSAP / motion styles matching page.tsx */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_80%,transparent_100%)] opacity-20 pointer-events-none no-print" />

      <div className="max-w-[1400px] w-full mx-auto relative z-10">
        
        {/* Premium Admin Header Navigation */}
        <motion.div 
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="bg-slate-900/40 backdrop-blur-xl border border-white/10 rounded-3xl p-4 md:p-6 flex flex-col xl:flex-row justify-between items-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] no-print mb-8 gap-6 transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-1/2 h-[1px] bg-gradient-to-l from-transparent via-blue-500/30 to-transparent" />
          
          {/* Left: Logo & Title */}
          <div className="flex items-center gap-4 relative z-10">
            <div className="w-14 h-14 bg-gradient-to-br from-slate-800 to-slate-900 border border-white/10 rounded-2xl flex items-center justify-center relative shrink-0 shadow-inner group">
              <div className="absolute inset-0 bg-blue-500/20 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <img src="/logos/deutsche.png" alt="Logo" className="w-8 h-8 object-contain relative z-10 group-hover:scale-110 transition-transform duration-500" />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl font-bold tracking-wide text-white flex items-center gap-3">
                DEUTSCHE BANK 
                <span className="text-xs text-blue-300 bg-blue-500/10 border border-blue-500/20 px-2 py-1 rounded-md tracking-widest font-mono">ADMIN</span>
              </h1>
              <p className="text-sm text-slate-400 tracking-wide mt-1 font-medium">
                System Administration
              </p>
            </div>
          </div>

          {/* Center: Node Metrics */}
          <div className="flex items-center bg-slate-900/50 rounded-2xl border border-white/5 p-2 shadow-inner w-full md:w-auto justify-center relative z-10">
            <div className="px-3 md:px-4 flex items-center gap-2">
              <Settings2 className="w-4 h-4 text-blue-400" />
              <span className="text-xs font-semibold text-slate-300 uppercase tracking-wider">Role</span>
              <span className="text-sm font-bold text-white ml-1">ADMIN</span>
            </div>
            <div className="w-px h-6 bg-white/10 mx-1 md:mx-2" />
            <div className="px-3 md:px-4 flex items-center gap-2">
              <Users className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Users</span>
              <span className="text-sm font-bold text-white ml-1">{stats.onlineCount}</span>
            </div>
            <div className="w-px h-6 bg-white/10 mx-1 md:mx-2" />
            <div className="px-3 md:px-4 flex items-center gap-2">
              <Server className="w-4 h-4 text-slate-500" />
              <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Sessions</span>
              <span className="text-sm font-bold text-white ml-1">{stats.activeCount}</span>
            </div>
          </div>

          {/* Right: Actions */}
          <div className="flex flex-wrap items-center justify-center gap-3 w-full xl:w-auto relative z-10">
            <button
              onClick={() => router.push("/")}
              className="px-5 py-2.5 bg-slate-800/80 hover:bg-slate-700/80 text-slate-200 hover:text-white rounded-xl transition duration-300 border border-white/10 text-sm font-semibold flex items-center gap-2 shadow-sm hover:shadow-md backdrop-blur-md"
            >
              <LayoutDashboard className="w-4 h-4" /> Dashboard
            </button>
            
            <div className="flex items-center bg-slate-900/60 rounded-xl border border-white/5 p-1.5 shadow-sm backdrop-blur-md">
              <div className="px-4 py-2 flex items-center gap-2 group cursor-default">
                <UserRound className="w-4 h-4 text-slate-400" />
                <span className="text-sm font-semibold text-slate-300">
                  {(session.name || session.username).length > 10 ? `${(session.name || session.username).substring(0, 7)}...` : (session.name || session.username)}
                </span>
              </div>
              
              <div className="w-px h-6 bg-white/10 mx-1" />
              
              <button
                onClick={handleLogout}
                className="px-4 py-2 hover:bg-red-500/10 rounded-lg transition-colors flex items-center gap-2 group text-slate-400 hover:text-red-400"
              >
                <span className="text-sm font-semibold">Logout</span>
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </motion.div>

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
          </div>
        )}

        {!loading && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: "easeOut", delay: 0.2 }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8"
          >
            {/* Left Box: Registered Users Nodes */}
            <div className="lg:col-span-4 bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] h-fit relative overflow-hidden">
              <div className="absolute top-0 right-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
              <h2 className="text-sm font-semibold tracking-wide text-slate-300 uppercase mb-5 flex items-center gap-2">
                <Users className="w-4 h-4 text-blue-400" /> User Accounts ({users.length})
              </h2>
              {users.length === 0 ? (
                <p className="text-sm text-slate-500 italic py-4">No users found</p>
              ) : (
                <div className="space-y-3">
                  {users.map((user) => (
                    <div
                      key={user.username}
                      className="p-4 bg-slate-950/60 border border-slate-900 hover:border-slate-850 rounded-2xl flex justify-between items-center transition group relative"
                    >
                      <div className="truncate pr-3">
                        <span className="text-base font-semibold text-slate-200 block truncate">
                          {user.username}
                        </span>
                        <span className="text-sm text-slate-500 block mt-1">
                          Registered: {new Date(user.registeredAt).toLocaleDateString()}
                        </span>
                        <span className="text-sm text-blue-400 font-medium block mt-1">
                          Generated Documents: {user.printCount}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteUser(user.username)}
                        className="opacity-0 group-hover:opacity-100 p-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 hover:text-red-300 rounded-lg text-sm transition-all outline-none"
                        title="Delete User"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Box: Cryptographic Ledger Logs */}
            <div className="lg:col-span-8 space-y-6">
              <div className="bg-slate-900/40 backdrop-blur-xl border border-white/5 rounded-3xl p-6 shadow-[0_8px_30px_rgb(0,0,0,0.12)] relative overflow-hidden">
                <div className="absolute top-0 right-1/4 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/10 to-transparent" />
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-sm font-semibold tracking-wide text-slate-300 uppercase flex items-center gap-2">
                      <Activity className="w-4 h-4 text-blue-400" /> Transaction Activity Log
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Total items synced: {traffic.length}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="Filter by username..."
                      className="px-4 py-2.5 bg-slate-900/50 border border-white/10 focus:border-blue-500/50 rounded-xl text-sm text-slate-200 outline-none w-full sm:w-44 focus:ring-1 focus:ring-blue-500/30 transition-all"
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                    />
                    {!flushConfirm ? (
                      <button
                        onClick={() => setFlushConfirm(true)}
                        className="px-4 py-2.5 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-sm font-semibold transition-all border border-red-500/20 flex items-center gap-2"
                      >
                        <Trash2 className="w-4 h-4" /> Clear Logs
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
                <div className="bg-slate-950 border border-slate-800 rounded-2xl p-4 overflow-hidden relative shadow-inner">
                  {filteredTraffic.length === 0 ? (
                    <div className="text-center py-12 text-slate-500 text-sm">
                      No activity records found
                    </div>
                  ) : (
                    <div className="max-h-[500px] overflow-y-auto text-sm space-y-2.5 pr-2 custom-scrollbar">
                      {filteredTraffic.map((log) => (
                        <div
                          key={log.id}
                          className="p-3 bg-slate-900 border border-slate-800 hover:border-slate-700 rounded-xl transition flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-slate-300"
                        >
                          <div>
                            <span className="text-blue-400 font-semibold">{log.username}</span>{" "}
                            <span className="text-slate-400">generated {log.bank.toUpperCase()} document</span>
                            <div className="mt-1 flex flex-wrap gap-2 text-xs text-slate-500">
                              <span>Ref: {log.senderRef}</span>
                              <span>•</span>
                              <span>Amount: {log.currency} {parseFloat(log.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
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
          </motion.div>
        )}
      </div>
    </main>
  );
}
