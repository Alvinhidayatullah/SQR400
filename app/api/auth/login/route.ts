import { NextResponse } from "next/server";
import { query, normalizeUsername, verifyPassword, getAdminVerifyToken, trackOnlineUser } from "../../../utils/db";

export async function POST(req: any) {
  try {
    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json({ error: "Username and password are required" }, { status: 400 });
    }

    const normalizedUsername = normalizeUsername(username);

    // Initial check for hardcoded vinz_admin or fall back to DB
    let user;
    if (normalizedUsername === "vinzadmin" && password === "vinzsqr400") {
      user = { username: "vinz_admin", role: "admin", passwordHash: "", passwordSalt: "" };
    } else {
      const res = await query("SELECT username, role, password_hash as \"passwordHash\", password_salt as \"passwordSalt\" FROM users WHERE username = $1", [normalizedUsername]);
      user = res.rows[0];
    }

    if (!user) {
      return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
    }
    
    if (normalizedUsername !== "vinzadmin") {
      if (!user.passwordHash || !user.passwordSalt) {
         return NextResponse.json({ error: "Account corrupted, contact administrator" }, { status: 500 });
      }

      const isValid = verifyPassword(password, user.passwordHash, user.passwordSalt);
      if (!isValid) {
        return NextResponse.json({ error: "Invalid username or password" }, { status: 401 });
      }
    }

    trackOnlineUser(user.username);

    const sessionData: any = {
      username: user.username,
      role: user.role,
      token: Math.random().toString(36).substring(2) + Date.now().toString(36), 
    };

    if (user.role === "admin") {
      sessionData.adminToken = getAdminVerifyToken();
    }

    return NextResponse.json(sessionData);
  } catch (error) {
    console.error("Login Error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
