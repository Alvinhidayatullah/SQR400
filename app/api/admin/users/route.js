import { NextResponse } from "next/server";
import { readDb, writeDb, normalizeUsername, getAdminVerifyToken } from "../../../utils/db";

// Validate custom Admin Session token to prevent Broken Access Control (OWASP A01:2021)
const verifyAdminSession = (req) => {
  const token = req.headers.get("x-admin-token");
  return token === getAdminVerifyToken();
};

// GET user list with aggregated traffic count
export async function GET(req) {
  try {
    if (!verifyAdminSession(req)) {
      return NextResponse.json(
        { error: "Access denied. Unauthorized request." },
        { status: 403 }
      );
    }

    const db = readDb();
    const usersWithTraffic = db.users
      .filter((u) => u.role !== "admin")
      .map((u) => {
        const count = db.traffic.filter(
          (t) => normalizeUsername(t.username) === normalizeUsername(u.username)
        ).length;
        return {
          username: u.username,
          registeredAt: u.registeredAt,
          printCount: count,
        };
      });

    return NextResponse.json({ success: true, users: usersWithTraffic });
  } catch (error) {
    console.error("Admin Get Users API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE a specific user
export async function DELETE(req) {
  try {
    if (!verifyAdminSession(req)) {
      return NextResponse.json(
        { error: "Access denied. Unauthorized request." },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const usernameToDelete = searchParams.get("username");

    if (!usernameToDelete) {
      return NextResponse.json(
        { error: "Username is required to delete" },
        { status: 400 }
      );
    }

    const db = readDb();
    const initialCount = db.users.length;
    
    // Do not allow deleting admin
    if (normalizeUsername(usernameToDelete) === "vinzadmin") {
      return NextResponse.json(
        { error: "Cannot delete admin account" },
        { status: 400 }
      );
    }

    db.users = db.users.filter(
      (u) => normalizeUsername(u.username) !== normalizeUsername(usernameToDelete)
    );

    if (db.users.length === initialCount) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    writeDb(db);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin Delete User API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
