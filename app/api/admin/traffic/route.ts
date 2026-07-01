import { NextResponse } from "next/server";
import { query, getAdminVerifyToken } from "../../../utils/db";

export async function GET(req: any) {
  try {
    const adminToken = req.headers.get("x-admin-token");
    if (!adminToken || adminToken !== getAdminVerifyToken()) {
      return NextResponse.json({ error: "Unauthorized access" }, { status: 403 });
    }

    const res = await query("SELECT id, timestamp, username, bank, amount, currency, sender_ref as \"senderRef\" FROM traffic ORDER BY timestamp DESC");

    return NextResponse.json({ traffic: res.rows });
  } catch (error) {
    console.error("Traffic fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function DELETE(req: any) {
  try {
    const adminToken = req.headers.get("x-admin-token");
    if (!adminToken || adminToken !== getAdminVerifyToken()) {
      return NextResponse.json({ error: "Unauthorized action" }, { status: 403 });
    }

    await query("DELETE FROM traffic");

    return NextResponse.json({ success: true, message: "Ledger flushed completely" });
  } catch (error) {
    console.error("Traffic clear error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
