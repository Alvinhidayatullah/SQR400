import { NextResponse } from "next/server";
import { query, normalizeUsername, hashPassword, sanitizeInput } from "../../../utils/db";

export async function POST(req: any) {
  try {
    const body = await req.json();
    const { username, password, passkey } = body;

    if (!username || !password || !passkey) {
      return NextResponse.json({ error: "All fields are required" }, { status: 400 });
    }

    if (passkey !== "VINZ1") {
      return NextResponse.json({ error: "Invalid registration node passkey" }, { status: 403 });
    }

    if (username.length < 4 || password.length < 6) {
      return NextResponse.json({ error: "Username must be > 3 chars and password > 5 chars" }, { status: 400 });
    }

    const normalizedUsername = normalizeUsername(username);

    if (normalizedUsername.includes("admin")) {
      return NextResponse.json({ error: "Reserved identity keyword detected" }, { status: 403 });
    }

    const res = await query("SELECT username FROM users WHERE username = $1", [normalizedUsername]);
    if (res.rows.length > 0) {
      return NextResponse.json({ error: "Identity node already instantiated" }, { status: 409 });
    }

    const { hash, salt } = hashPassword(password);

    await query(
      "INSERT INTO users (username, password_hash, password_salt, role, registered_at) VALUES ($1, $2, $3, $4, NOW())",
      [normalizedUsername, hash, salt, "user"]
    );

    return NextResponse.json({ success: true, message: "Node instantiated successfully" });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
