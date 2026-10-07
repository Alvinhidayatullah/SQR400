"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "next-auth/react";

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
      <div className="max-w-[1400px] w-full mx-auto relative z-10">
        
        {/* Premium Admin Header Navigation */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 md:p-6 flex flex-col xl:flex-row justify-between items-center shadow-lg no-print mb-8 gap-6 transition-all duration-300">
          
          {/* Left: Logo & Title */}
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-slate-800 border border-slate-700 rounded-xl flex items-center justify-center relative shrink-0">
              <span className="text-2xl text-blue-400 relative z-10">🛡️</span>
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-2xl font-bold tracking-wide text-white flex items-center gap-3">
                SQR400 
                <span className="text-xs text-blue-300 bg-blue-900/40 px-2 py-1 rounded tracking-widest font-mono">ADMIN</span>
              </h1>
              <p className="text-sm text-slate-400 tracking-wide mt-1">
                System Administration
              </p>
            </div>
          </div>

          {/* Center: Node Metrics */}
          <div className="flex items-center bg-slate-950 rounded-xl border border-slate-800 p-2 shadow-inner w-full md:w-auto justify-center">
            <div className="px-3 md:px-4 flex items-center gap-2">
              <span className="text-xs font-semibold text-slate-400 uppercase">ROLE:</span>
              <span className="text-sm font-bold text-white">ADMIN</span>
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
            <button
              onClick={() => router.push("/")}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg transition duration-200 border border-slate-700 text-sm font-semibold flex items-center gap-2"
            >
              <span>🖥️</span> Dashboard
            </button>
            
            <div className="flex items-center bg-slate-900 rounded-lg border border-slate-800 p-1 shadow-sm">
              <div className="px-4 py-2 flex items-center gap-2 group cursor-default">
                <span className="text-sm">👤</span>
                <span className="text-sm font-semibold text-slate-300">
                  {(session.name || session.username).length > 10 ? `${(session.name || session.username).substring(0, 7)}...` : (session.name || session.username)}
                </span>
              </div>
              
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

        {/* Loading Spinner */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-cyan-500" />
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Box: Registered Users Nodes */}
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl h-fit relative overflow-hidden">
              <h2 className="text-sm font-semibold tracking-wide text-slate-400 uppercase mb-5 flex items-center gap-2">
                <span>👥</span> User Accounts ({users.length})
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
                        className="opacity-0 group-hover:opacity-100 p-2.5 bg-red-900/30 hover:bg-red-800 text-red-400 hover:text-white rounded-lg text-sm font-bold transition outline-none"
                        title="Delete User"
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
              <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-sm font-semibold tracking-wide text-slate-400 uppercase flex items-center gap-2">
                      <span>📊</span> Transaction Activity Log
                    </h2>
                    <p className="text-sm text-slate-500 mt-1">Total items synced: {traffic.length}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="Filter by username..."
                      className="px-4 py-2.5 bg-slate-950 border border-slate-800 focus:border-blue-500 rounded-xl text-sm text-slate-200 outline-none w-full sm:w-44 focus:ring-1 focus:ring-blue-500/50"
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                    />
                    {!flushConfirm ? (
                      <button
                        onClick={() => setFlushConfirm(true)}
                        className="px-4 py-2.5 bg-red-900/20 hover:bg-red-900/40 text-red-400 hover:text-red-300 rounded-xl text-sm font-semibold transition border border-red-900/30"
                      >
                        🗑️ Clear Logs
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
          </div>
        )}
      </div>
    </main>
  );
}
