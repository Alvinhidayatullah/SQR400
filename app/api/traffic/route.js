import { NextResponse } from "next/server";
import { readDb, writeDb, sanitizeInput } from "../../utils/db";

export async function POST(req) {
  try {
    const body = await req.json();
    const { username, bank, amount, currency, senderRef } = body;

    if (!username || !bank) {
      return NextResponse.json(
        { error: "Username and bank name are required" },
        { status: 400 }
      );
    }

    const db = readDb();
    
    // Sanitize values to prevent XSS vulnerability (OWASP A03:2021)
    const newLog = {
      id: Date.now() + Math.random().toString(36).substr(2, 5),
      timestamp: new Date().toISOString(),
      username: sanitizeInput(username),
      bank: sanitizeInput(bank),
      amount: sanitizeInput(amount || "0.00"),
      currency: sanitizeInput(currency || "EUR"),
      senderRef: sanitizeInput(senderRef || "N/A"),
    };

    db.traffic.push(newLog);
    writeDb(db);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Traffic Log API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
