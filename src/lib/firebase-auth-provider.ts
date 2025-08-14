import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { auth } from "./firebase";
import { prisma } from "./prisma";
import { AuthUtils } from "./auth";
import { UserRole, UserStatus, AuthProvider } from "@prisma/client";

export const firebaseAuthProvider: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        emailOrUsername: { label: "Email or Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.emailOrUsername || !credentials?.password) {
          return null;
        }

        try {
          // Check if input is email or username
          const isEmail = credentials.emailOrUsername.includes("@");

          // Find user in database
          const user = await prisma.user.findFirst({
            where: isEmail
              ? { email: credentials.emailOrUsername }
              : { username: credentials.emailOrUsername },
          });

          if (!user || !user.password) {
            return null;
          }

          // Check if account is locked
          if (user.lockedUntil && user.lockedUntil > new Date()) {
            throw new Error(
              "Account is temporarily locked. Please try again later."
            );
          }

          // Check if user is active
          if (user.status !== "ACTIVE") {
            throw new Error(
              "Account is not active. Please verify your email or contact support."
            );
          }

          // Verify password with bcrypt (local auth)
          const isPasswordValid = await AuthUtils.comparePassword(
            credentials.password,
            user.password
          );

          if (!isPasswordValid) {
            // Increment login attempts
            await AuthUtils.incrementLoginAttempts(user.id);
            throw new Error("Invalid credentials");
          }

          // Reset login attempts on successful login
          await AuthUtils.updateLastLogin(user.id);

          // Log successful login
          await AuthUtils.logUserAction({
            userId: user.id,
            action: "LOGIN_SUCCESS",
            details: { method: "credentials" },
          });

          return {
            id: user.id,
            email: user.email,
            name: user.displayName || `${user.firstName} ${user.lastName}`,
            image: user.avatar || undefined,
            role: user.role,
            status: user.status,
          };
        } catch (error) {
          console.error("Login error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.status = user.status;
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id as string;
        session.user.role = token.role as UserRole;
        session.user.status = token.status as UserStatus;
      }
      return session;
    },
  },
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  secret: process.env.NEXTAUTH_SECRET,
  debug: process.env.NODE_ENV === "development",
};
