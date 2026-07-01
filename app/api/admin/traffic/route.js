import { NextResponse } from "next/server";
import { readDb, writeDb, getAdminVerifyToken } from "../../../utils/db";

// Validate custom Admin Session token to prevent Broken Access Control (OWASP A01:2021)
const verifyAdminSession = (req) => {
  const token = req.headers.get("x-admin-token");
  return token === getAdminVerifyToken();
};

// GET all traffic logs (newest first)
export async function GET(req) {
  try {
    if (!verifyAdminSession(req)) {
      return NextResponse.json(
        { error: "Access denied. Unauthorized request." },
        { status: 403 }
      );
    }

    const db = readDb();
    const sortedTraffic = [...db.traffic].sort(
      (a, b) => new Date(b.timestamp) - new Date(a.timestamp)
    );
    return NextResponse.json({ success: true, traffic: sortedTraffic });
  } catch (error) {
    console.error("Admin Get Traffic API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}

// DELETE (flush) all traffic logs
export async function DELETE(req) {
  try {
    if (!verifyAdminSession(req)) {
      return NextResponse.json(
        { error: "Access denied. Unauthorized request." },
        { status: 403 }
      );
    }

    const db = readDb();
    db.traffic = [];
    writeDb(db);
    return NextResponse.json({ success: true, message: "Traffic logs cleared successfully" });
  } catch (error) {
    console.error("Admin Clear Traffic API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
