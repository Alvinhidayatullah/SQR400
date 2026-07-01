import { NextResponse } from "next/server";
import { query, normalizeUsername, hashPassword, verifyPassword, sanitizeInput } from "../../../utils/db";

export async function POST(req: any) {
  try {
    const body = await req.json();
    const { currentUsername, currentPassword, newUsername, newPassword } = body;

    if (!currentUsername || !currentPassword || !newUsername) {
      return NextResponse.json({ error: "Required fields missing" }, { status: 400 });
    }

    const currentNorm = normalizeUsername(currentUsername);
    const newNorm = normalizeUsername(newUsername);

    if (currentNorm === "vinzadmin") {
      return NextResponse.json({ error: "Core administrator identity cannot be modified" }, { status: 403 });
    }

    const res = await query("SELECT username, password_hash as \"passwordHash\", password_salt as \"passwordSalt\" FROM users WHERE username = $1", [currentNorm]);
    const user = res.rows[0];

    if (!user) {
      return NextResponse.json({ error: "Account not found" }, { status: 404 });
    }

    const isValid = verifyPassword(currentPassword, user.passwordHash, user.passwordSalt);
    if (!isValid) {
      return NextResponse.json({ error: "Current password validation failed" }, { status: 403 });
    }

    if (newNorm !== currentNorm) {
      const checkRes = await query("SELECT username FROM users WHERE username = $1", [newNorm]);
      if (checkRes.rows.length > 0) {
         return NextResponse.json({ error: "New identity already registered in network" }, { status: 409 });
      }
      
      // Since traffic is linked by username, we might want to update traffic too if we don't have CASCADE ON UPDATE
      // Actually we set REFERENCES users(username) ON DELETE CASCADE, but updating username requires CASCADE on UPDATE, which we didn't specify. 
      // Let's just run an UPDATE on both to be safe, inside a transaction if possible, or sequential.
      await query("UPDATE traffic SET username = $1 WHERE username = $2", [newNorm, currentNorm]);
    }

    let pHash = user.passwordHash;
    let pSalt = user.passwordSalt;

    if (newPassword) {
      if (newPassword.length < 6) {
        return NextResponse.json({ error: "New password must be at least 6 characters" }, { status: 400 });
      }
      const updatedHash = hashPassword(newPassword);
      pHash = updatedHash.hash;
      pSalt = updatedHash.salt;
    }

    await query("UPDATE users SET username = $1, password_hash = $2, password_salt = $3 WHERE username = $4", [newNorm, pHash, pSalt, currentNorm]);

    return NextResponse.json({ 
      success: true, 
      username: newNorm,
      message: "Gateway identity successfully updated"
    });
  } catch (error) {
    console.error("Update error:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
