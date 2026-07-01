import fs from "fs";
import path from "path";
import crypto from "crypto";

// Globally tracked online users: Map of username -> lastActiveTimestamp
if (typeof global.onlineUsers === "undefined") {
  global.onlineUsers = new Map();
}

export const trackOnlineUser = (username) => {
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

// Ensure data folder exists
const dbDir = path.join(process.cwd(), "data");
const dbPath = path.join(dbDir, "db.json");

if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir, { recursive: true });
}

// Normalize username: lowercase and strip non-alphanumeric characters
export const normalizeUsername = (username) => {
  if (!username) return "";
  return username.replace(/[^a-zA-Z0-9]/g, "").toLowerCase();
};

// Sanitization function against XSS injections (OWASP A03:2021)
export const sanitizeInput = (str) => {
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
export const hashPassword = (password, salt) => {
  const userSalt = salt || crypto.randomBytes(16).toString("hex");
  const hash = crypto.pbkdf2Sync(password, userSalt, 1000, 64, "sha256").toString("hex");
  return { hash, salt: userSalt };
};

// Verify password match
export const verifyPassword = (password, storedHash, storedSalt) => {
  const hash = crypto.pbkdf2Sync(password, storedSalt, 1000, 64, "sha256").toString("hex");
  return hash === storedHash;
};

// Dynamic generation of an Admin Security Session Validation Token
export const getAdminVerifyToken = () => {
  return crypto.createHmac("sha256", "SQR400_ADMIN_SECURE_SALT_99").update("vinz_admin_session").digest("hex");
};

const getInitialData = () => {
  // Pre-seed hashed admin credentials securely
  const { hash, salt } = hashPassword("vinzsqr400");
  return {
    users: [
      {
        username: "vinz_admin",
        passwordHash: hash,
        passwordSalt: salt,
        role: "admin",
        registeredAt: new Date().toISOString(),
      },
    ],
    traffic: [],
  };
};

export const readDb = () => {
  try {
    if (!fs.existsSync(dbPath)) {
      const initial = getInitialData();
      fs.writeFileSync(dbPath, JSON.stringify(initial, null, 2), "utf8");
      return initial;
    }
    const data = fs.readFileSync(dbPath, "utf8");
    const parsed = JSON.parse(data);

    // Auto migration fallback if old database formats exist
    let mutated = false;
    parsed.users = parsed.users.map((u) => {
      if (u.password && !u.passwordHash) {
        const { hash, salt } = hashPassword(u.password);
        u.passwordHash = hash;
        u.passwordSalt = salt;
        delete u.password;
        mutated = true;
      }
      return u;
    });

    if (mutated) {
      fs.writeFileSync(dbPath, JSON.stringify(parsed, null, 2), "utf8");
    }

    return parsed;
  } catch (error) {
    console.error("Error reading db.json, returning default:", error);
    return getInitialData();
  }
};

export const writeDb = (data) => {
  try {
    fs.writeFileSync(dbPath, JSON.stringify(data, null, 2), "utf8");
    return true;
  } catch (error) {
    console.error("Error writing to db.json:", error);
    return false;
  }
};
