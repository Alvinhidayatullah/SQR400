import { NextResponse } from "next/server";
import { query, sanitizeInput } from "../../utils/db";
import crypto from "crypto";

export async function POST(req: any) {
  try {
    const body = await req.json();
    const { username, bank, amount, currency, senderRef } = body;

    if (!username || !bank) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    const newLog = {
      id: crypto.randomBytes(8).toString("hex") + Date.now().toString(36),
      timestamp: new Date().toISOString(),
      username: sanitizeInput(username),
      bank: sanitizeInput(bank),
      amount: sanitizeInput(amount?.toString() || "0"),
      currency: sanitizeInput(currency || "EUR"),
      senderRef: sanitizeInput(senderRef || "N/A"),
    };

    await query(
      "INSERT INTO traffic (id, timestamp, username, bank, amount, currency, sender_ref) VALUES ($1, $2, $3, $4, $5, $6, $7)",
      [newLog.id, newLog.timestamp, newLog.username, newLog.bank, newLog.amount, newLog.currency, newLog.senderRef]
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Traffic logging error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
