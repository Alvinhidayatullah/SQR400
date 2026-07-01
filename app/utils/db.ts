import crypto from "crypto";
import { Pool } from "pg";

// Configure PostgreSQL connection pool
const pool = new Pool({
  connectionString: process.env.DATABASE_URL || "postgresql://postgres:password@localhost:5432/sqr400"
});

// Globally tracked online users: Map of username -> lastActiveTimestamp
if (typeof global.onlineUsers === "undefined") {
  global.onlineUsers = new Map();
}

export const trackOnlineUser = (username: string) => {
  if (!username) return;
  const normalized = normalizeUsername(username);
  global.onlineUsers.set(normalized, Date.now());
};

export const getOnlineUsersCount = () => {
  const now = Date.now();
  const timeout = 5 * 60 * 1000; // 5 minutes
  let count = 0;
  for (const [user, timestamp] of global.onlineUsers.entries()) {
    if (now - timestamp < timeout) {
      count++;
    } else {
      global.onlineUsers.delete(user);
    }
  }
  return Math.max(1, count);
};

// Normalize username: lowercase and strip non-alphanumeric characters
export const normalizeUsername = (username: string) => {
  if (!username) return "";
  return username.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
};

// Sanitization function against XSS injections (OWASP A03:2021)
export const sanitizeInput = (str: string) => {
  if (typeof str !== "string") return str;
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#x27;")
    .replace(/\//g, "&#x2F;");
};

// Secure PBKDF2 hashing wrapper (OWASP A02:2021)
export const hashPassword = (password: string, salt?: string) => {
  const userSalt = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, userSalt, 1000, 64, "sha256").toString("hex");
  return { hash, salt: userSalt };
};

// Verify password match
export const verifyPassword = (password: string, storedHash: string, storedSalt: string) => {
  const hash = crypto.pbkdf2Sync(password, storedSalt, 1000, 64, "sha256").toString("hex");
  return hash === storedHash;
};

// Dynamic generation of an Admin Security Session Validation Token
export const getAdminVerifyToken = () => {
  return crypto.createHmac("sha256", "SQR400_ADMIN_SECURE_SALT_99").update("vinz_admin_session").digest("hex");
};

// Instead of reading the whole JSON file, we'll provide helper functions for PG queries.

export const query = async (text: string, params?: any[]) => {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
};

// Optional helper to get all data (mostly to mimic old readDb structure if needed anywhere else)
export const readDb = async () => {
  try {
    const usersRes = await query("SELECT username, role, registered_at as \"registeredAt\", password_hash as \"passwordHash\", password_salt as \"passwordSalt\" FROM users");
    const trafficRes = await query("SELECT id, timestamp, username, bank, amount, currency, sender_ref as \"senderRef\" FROM traffic");
    return {
      users: usersRes.rows,
      traffic: trafficRes.rows
    };
  } catch (error) {
    console.error("Database read error:", error);
    return { users: [], traffic: [] };
  }
};
