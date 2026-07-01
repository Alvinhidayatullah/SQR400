import { NextResponse } from "next/server";
import { readDb, writeDb, normalizeUsername, hashPassword, verifyPassword, sanitizeInput } from "../../../utils/db";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();
    const { currentUsername, currentPassword, newUsername, newPassword } = body;

    if (!currentUsername || !currentPassword) {
      return NextResponse.json(
        { error: "Current username and password are required to verify identity" },
        { status: 400 }
      );
    }

    const db = readDb();
    const normalizedCurrentUser = normalizeUsername(currentUsername);

    // Find user record
    const userIndex = db.users.findIndex(
      (u) => normalizeUsername(u.username) === normalizedCurrentUser
    );

    if (userIndex === -1) {
      return NextResponse.json(
        { error: "User not found or authorization failed" },
        { status: 404 }
      );
    }

    const user = db.users[userIndex];

    // Verify current password (OWASP A07:2021)
    const isPasswordValid = verifyPassword(currentPassword, user.passwordHash, user.passwordSalt);
    if (!isPasswordValid) {
      return NextResponse.json(
        { error: "Incorrect current password" },
        { status: 401 }
      );
    }

    let updatedUsername = user.username;

    // 1. Process Username Change
    if (newUsername && newUsername.trim() !== user.username) {
      const sanitizedNewUsername = sanitizeInput(newUsername.trim());

      if (sanitizedNewUsername.length < 3) {
        return NextResponse.json(
          { error: "New username must be at least 3 characters" },
          { status: 400 }
        );
      }

      // Check duplicates (OWASP A01:2021 & User duplicate prevention requirement)
      const normalizedNewInput = normalizeUsername(sanitizedNewUsername);
      const exists = db.users.some(
        (u) => normalizeUsername(u.username) === normalizedNewInput
      );

      if (exists) {
        return NextResponse.json(
          { error: "New username is already taken or conflicts with an existing account" },
          { status: 400 }
        );
      }

      // Update user references in traffic logs to maintain consistency
      db.traffic = db.traffic.map((log) => {
        if (normalizeUsername(log.username) === normalizedCurrentUser) {
          log.username = sanitizedNewUsername;
        }
        return log;
      });

      // Update user model
      user.username = sanitizedNewUsername;
      updatedUsername = sanitizedNewUsername;
    }

    // 2. Process Password Change
    if (newPassword) {
      if (newPassword.length < 5) {
        return NextResponse.json(
          { error: "New password must be at least 5 characters" },
          { status: 400 }
        );
      }

      // Generate new PBKDF2 hash & salt (OWASP A02:2021)
      const { hash, salt } = hashPassword(newPassword);
      user.passwordHash = hash;
      user.passwordSalt = salt;
    }

    // Save changes
    db.users[userIndex] = user;
    writeDb(db);

    return NextResponse.json({
      success: true,
      username: updatedUsername
    });
  } catch (error) {
    console.error("Update profile API error:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}
