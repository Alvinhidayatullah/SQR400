import NextAuth, { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { query, verifyPassword, normalizeUsername, getAdminVerifyToken, trackOnlineUser } from "@/app/utils/db";

const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.username || !credentials?.password) {
          throw new Error("Missing credentials");
        }

        const normalizedUsername = normalizeUsername(credentials.username);
        
        // Admin credential check against environment variables
        const adminUser = process.env.ADMIN_USERNAME || "vinz_admin_default_secure";
        const adminPass = process.env.ADMIN_PASSWORD || "change_this_default_password";
        
        let user;
        if (normalizedUsername === normalizeUsername(adminUser) && credentials.password === adminPass) {
          user = { username: adminUser, role: "admin", passwordHash: "", passwordSalt: "" };
        } else {
          const res = await query("SELECT username, role, password_hash as \"passwordHash\", password_salt as \"passwordSalt\" FROM users WHERE username = $1", [normalizedUsername]);
          user = res.rows[0];
        }

        if (!user) {
          throw new Error("Invalid username or password");
        }

        if (normalizedUsername !== normalizeUsername(adminUser)) {
          if (!user.passwordHash || !user.passwordSalt) {
             throw new Error("Account corrupted, contact administrator");
          }

          const isValid = verifyPassword(credentials.password, user.passwordHash, user.passwordSalt);
          if (!isValid) {
            throw new Error("Invalid username or password");
          }
        }

        trackOnlineUser(user.username);

        return {
          id: user.username,
          name: user.username,
          role: user.role,
          adminToken: user.role === "admin" ? getAdminVerifyToken() : undefined
        };
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user, trigger, session }) {
      if (user) {
        token.role = user.role;
        token.adminToken = user.adminToken;
      }
      if (trigger === "update" && session?.username) {
        token.name = session.username;
        token.id = session.username;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.name = token.name as string;
        session.user.role = token.role as string;
        session.user.adminToken = token.adminToken as string | undefined;
      }
      return session;
    }
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST };
