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

  const fetchData = async (adminToken) => {
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
    <main className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 md:px-8 font-sans antialiased relative overflow-hidden">
      {/* Background glowing gradients */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-blue-500/5 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-red-500/5 blur-[150px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Header */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl px-6 py-5 flex flex-col sm:flex-row justify-between items-center shadow-2xl mb-8">
          <div className="flex items-center gap-3">
            <div className="w-3.5 h-3.5 bg-red-500 rounded-full animate-pulse shadow-[0_0_10px_#ef4444]" />
            <h1 className="text-xl sm:text-2xl font-black text-white tracking-widest uppercase">
              SQR400 <span className="text-red-500">ADMIN CONTROL CENTER</span>
            </h1>
          </div>
          <div className="flex items-center gap-4 mt-3 sm:mt-0">
            <button
              onClick={() => router.push("/")}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-xl text-xs font-bold transition-all border border-slate-750"
            >
              🖥️ Open Terminal
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-650/15 hover:bg-red-600/30 text-red-400 hover:text-red-200 rounded-xl text-xs font-bold transition-all border border-red-900/30"
            >
              🔒 Logout
            </button>
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500" />
          </div>
        )}

        {!loading && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Registered Users */}
            <div className="lg:col-span-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl h-fit">
              <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase mb-4 flex items-center gap-2">
                <span>👥</span> Registered Accounts ({users.length})
              </h2>
              {users.length === 0 ? (
                <p className="text-xs text-slate-500 italic py-4">No normal users registered yet.</p>
              ) : (
                <div className="space-y-3">
                  {users.map((user) => (
                    <div
                      key={user.username}
                      className="p-4 bg-slate-950 border border-slate-850 rounded-xl flex justify-between items-center hover:border-slate-800 transition group"
                    >
                      <div className="truncate pr-3">
                        <span className="text-sm font-bold text-slate-200 block truncate">
                          {user.username}
                        </span>
                        <span className="text-[10px] text-slate-500 block font-mono">
                          Reg: {new Date(user.registeredAt).toLocaleDateString()}
                        </span>
                        <span className="text-[10px] text-blue-400 font-bold block mt-1">
                          Prints Generated: {user.printCount}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteUser(user.username)}
                        className="opacity-0 group-hover:opacity-100 p-2 bg-red-950/40 hover:bg-red-900/50 text-red-400 hover:text-red-200 rounded-lg text-xs font-bold transition outline-none"
                        title="Delete User account"
                      >
                        🗑️
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Right Column: Traffic Logs */}
            <div className="lg:col-span-8 space-y-6">
              {/* Traffic Stats Header */}
              <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
                  <div>
                    <h2 className="text-sm font-bold tracking-wider text-slate-400 uppercase flex items-center gap-2">
                      <span>📊</span> Live Terminal Traffic logs
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Total prints recorded: {traffic.length}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 w-full sm:w-auto">
                    <input
                      type="text"
                      placeholder="Filter by user..."
                      className="px-4 py-2 bg-slate-950 border border-slate-850 focus:border-red-500 rounded-xl text-xs text-slate-200 outline-none w-full sm:w-44 focus:ring-1 focus:ring-red-900/20"
                      value={searchUser}
                      onChange={(e) => setSearchUser(e.target.value)}
                    />
                    {!flushConfirm ? (
                      <button
                        onClick={() => setFlushConfirm(true)}
                        className="px-4 py-2 bg-red-950/40 hover:bg-red-900/40 text-red-400 hover:text-red-300 rounded-xl text-xs font-bold transition border border-red-900/40"
                      >
                        🔥 Clear Logs
                      </button>
                    ) : (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={handleClearTraffic}
                          className="px-3 py-2 bg-red-650 text-white rounded-xl text-xs font-bold transition hover:bg-red-750"
                        >
                          Confirm Flush
                        </button>
                        <button
                          onClick={() => setFlushConfirm(false)}
                          className="px-3 py-2 bg-slate-850 hover:bg-slate-800 text-slate-300 rounded-xl text-xs font-bold transition"
                        >
                          Cancel
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Log Screen */}
                <div className="bg-slate-950 border border-slate-850 rounded-2xl p-4 overflow-hidden relative shadow-inner">
                  {filteredTraffic.length === 0 ? (
                    <div className="text-center py-12 text-slate-505 text-xs font-mono">
                      NO TRAFFIC RECORDS DETECTED
                    </div>
                  ) : (
                    <div className="max-h-[500px] overflow-y-auto font-mono text-[11px] space-y-2.5 pr-2 custom-scrollbar">
                      {filteredTraffic.map((log) => (
                        <div
                          key={log.id}
                          className="p-3 bg-slate-900/40 border border-slate-900 rounded-lg hover:border-slate-800 transition flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2 text-slate-450"
                        >
                          <div>
                            <span className="text-red-400 font-bold">[{log.username.toUpperCase()}]</span>{" "}
                            <span className="text-slate-300">Generated {log.bank.toUpperCase()} SWIFT printout</span>
                            <div className="mt-1 flex flex-wrap gap-2 text-[10px] text-slate-600">
                              <span>Ref: {log.senderRef}</span>
                              <span>•</span>
                              <span>Amt: {log.currency} {parseFloat(log.amount).toLocaleString("en-US", { minimumFractionDigits: 2 })}</span>
                            </div>
                          </div>
                          <span className="text-[10px] text-slate-600 sm:text-right shrink-0">
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
