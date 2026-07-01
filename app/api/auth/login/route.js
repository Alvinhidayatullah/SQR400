import { NextResponse } from "next/server";
import { readDb, normalizeUsername, verifyPassword, getAdminVerifyToken, trackOnlineUser } from "../../../utils/db";

// Simple temporary rate limiter to mitigate login brute-force attacks (OWASP A07:2021)
const loginAttempts = new Map();
const LIMIT = 10;
const WINDOW = 60 * 1000; // 1 minute window

export async function POST(req) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "local";
    const now = Date.now();
    
    // Rate limit check
    if (loginAttempts.has(ip)) {
      const record = loginAttempts.get(ip);
      if (now - record.resetTime < WINDOW) {
        if (record.count >= LIMIT) {
          return NextResponse.json(
            { error: "Too many login attempts. Please wait 1 minute." },
            { status: 429 }
          );
        }
        record.count++;
      } else {
        loginAttempts.set(ip, { count: 1, resetTime: now });
      }
    } else {
      loginAttempts.set(ip, { count: 1, resetTime: now });
    }

    const body = await req.json();
    const { username, password } = body;

    if (!username || !password) {
      return NextResponse.json(
        { error: "Username and password are required" },
        { status: 400 }
      );
    }

    const db = readDb();
    const normalizedInput = normalizeUsername(username.trim());

    const user = db.users.find(
      (u) => normalizeUsername(u.username) === normalizedInput
    );

    if (!user) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Verify PBKDF2 Password Hash match
    const isValid = verifyPassword(password, user.passwordHash, user.passwordSalt);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid username or password" },
        { status: 401 }
      );
    }

    // Reset rate limiter on successful login
    loginAttempts.delete(ip);

    // Track online user session
    trackOnlineUser(user.username);

    // If logging in as admin, supply the server-verified validation token
    const token = user.role === "admin" ? getAdminVerifyToken() : null;

    return NextResponse.json({
      success: true,
      user: {
        username: user.username,
        role: user.role,
        adminToken: token,
      },
    });
  } catch (error) {
    console.error("Login API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
