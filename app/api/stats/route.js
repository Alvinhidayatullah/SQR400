import { NextResponse } from "next/server";
import { readDb, getOnlineUsersCount, trackOnlineUser } from "../../utils/db";

export const dynamic = "force-dynamic";

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);
    const username = searchParams.get("username");
    
    if (username) {
      trackOnlineUser(username);
    }

    const db = readDb();
    const activeCount = db.users.length;
    const onlineCount = getOnlineUsersCount();

    return NextResponse.json({
      onlineCount,
      activeCount
    });
  } catch (error) {
    console.error("Stats API error:", error);
    return NextResponse.json({ error: "Failed to fetch stats" }, { status: 500 });
  }
}
