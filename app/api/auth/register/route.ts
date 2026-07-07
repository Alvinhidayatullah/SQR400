import { NextResponse } from "next/server";
import { query, normalizeUsername, hashPassword } from "@/app/utils/db";
import { authSchema } from "@/app/utils/schema";
import { LRUCache } from "lru-cache";

// Rate limiter setup: max 10 requests per minute per IP
const rateLimit = new LRUCache({
  max: 100,
  ttl: 60 * 1000, // 1 minute
});

export async function POST(req: Request) {
  try {
    // Rate Limiting
    const ip = req.headers.get("x-forwarded-for") || "unknown";
    const tokenCount = (rateLimit.get(ip) as number[]) || [0];
    if (tokenCount[0] === 0) {
      rateLimit.set(ip, [1]);
    } else {
      tokenCount[0] += 1;
      rateLimit.set(ip, tokenCount);
    }

    if (tokenCount[0] > 10) {
      return NextResponse.json({ error: "Too many requests. Please try again later." }, { status: 429 });
    }

    const body = await req.json();

    // Zod Validation
    const parsed = authSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0].message }, { status: 400 });
    }

    const { username, password } = parsed.data;
    const normalizedUsername = normalizeUsername(username);

    // Business Logic Validation
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
