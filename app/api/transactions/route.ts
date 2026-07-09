import { NextResponse } from "next/server";
import { query, sanitizeInput } from "../../utils/db";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { username, bank, transactionData } = body;

    if (!username || !bank || !transactionData) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
    }

    // Generate a unique slug: YYYYMMDD-AMOUNT-CURRENCY-BANK
    // E.g., "20250624-999B-MT103TT-AVA-DB-SWIFT-COPY"
    const dateStr = new Date().toISOString().slice(0, 10).replace(/-/g, ""); // "20250624"
    const currency = transactionData.transaction?.currency || "EUR";
    let amountStr = transactionData.transaction?.amount?.toString().replace(/,/g, "") || "0";
    
    // Attempt to parse amount for suffix (e.g. 999999999 -> 999B)
    let amountSuffix = amountStr;
    const amountVal = parseFloat(amountStr);
    if (!isNaN(amountVal) && amountVal >= 1000000000) {
      amountSuffix = Math.floor(amountVal / 1000000000) + "B";
    } else if (!isNaN(amountVal) && amountVal >= 1000000) {
      amountSuffix = Math.floor(amountVal / 1000000) + "M";
    }

    let rawSlug = `${dateStr} ${amountSuffix} MT103TT AVA ${bank.toUpperCase()} SWIFT COPY`;
    // Replace spaces with hyphens for the URL slug
    let slug = rawSlug.replace(/\s+/g, "-");

    // Add random suffix to ensure uniqueness just in case
    const randomSuffix = Math.random().toString(36).substring(2, 6).toUpperCase();
    slug = `${slug}-${randomSuffix}`;

    await query(
      "INSERT INTO transactions (slug, username, bank, data) VALUES ($1, $2, $3, $4)",
      [slug, sanitizeInput(username), sanitizeInput(bank), JSON.stringify(transactionData)]
    );

    return NextResponse.json({ success: true, slug });
  } catch (error) {
    console.error("Transaction save error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");

    if (!slug) {
      return NextResponse.json({ error: "Missing slug" }, { status: 400 });
    }

    const res = await query("SELECT data FROM transactions WHERE slug = $1", [slug]);
    
    if (res.rows.length === 0) {
      return NextResponse.json({ error: "Transaction not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: res.rows[0].data });
  } catch (error) {
    console.error("Transaction fetch error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
