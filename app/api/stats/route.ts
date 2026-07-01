import { NextResponse } from "next/server";
import { query, getOnlineUsersCount, trackOnlineUser, normalizeUsername } from "../../utils/db";

export async function GET(req: any) {
  try {
    const url = new URL(req.url);
    const username = url.searchParams.get("username");

    if (username) {
      trackOnlineUser(username);
    }

    const res = await query("SELECT COUNT(*) FROM users");
    const registeredUsersCount = parseInt(res.rows[0].count, 10);
    const activeOnlineUsers = getOnlineUsersCount();

    return NextResponse.json({
      onlineCount: registeredUsersCount,
      activeCount: activeOnlineUsers
    });
  } catch (error) {
    console.error("Stats fetch error:", error);
    return NextResponse.json({ onlineCount: 1, activeCount: 1 });
  }
}
