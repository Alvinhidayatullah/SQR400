import { NextResponse } from "next/server";
import { query, normalizeUsername, getAdminVerifyToken } from "../../../utils/db";

export async function GET(req: any) {
  try {
    const adminToken = req.headers.get("x-admin-token");
    if (!adminToken || adminToken !== getAdminVerifyToken()) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const usersRes = await query("SELECT username, role, registered_at as \"registeredAt\" FROM users");
    const trafficRes = await query("SELECT username, COUNT(*) as print_count FROM traffic GROUP BY username");
    
    let users = usersRes.rows;
    let traffic = trafficRes.rows;
    
    const trafficMap = {};
    traffic.forEach((t: any) => {
      trafficMap[t.username] = parseInt(t.print_count, 10);
    });

    users = users.map((u: any) => ({
      ...u,
      printCount: trafficMap[u.username] || 0
    }));

    return NextResponse.json({ users });
  } catch (error) {
    console.error("Admin stats fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: any) {
  try {
    const adminToken = req.headers.get("x-admin-token");
    if (!adminToken || adminToken !== getAdminVerifyToken()) {
      return NextResponse.json({ error: "Unauthorized action" }, { status: 403 });
    }

    const url = new URL(req.url);
    const usernameParam = url.searchParams.get("username");
    if (!usernameParam) {
      return NextResponse.json({ error: "Username parameter is required" }, { status: 400 });
    }

    const username = normalizeUsername(usernameParam);
    if (username === "vinzadmin") {
      return NextResponse.json({ error: "Cannot delete master administrator account" }, { status: 403 });
    }

    await query("DELETE FROM users WHERE username = $1", [username]);
    
    return NextResponse.json({ success: true, message: "User deleted permanently" });
  } catch (error) {
    console.error("User delete error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
