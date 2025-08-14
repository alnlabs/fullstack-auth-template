import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from "crypto";
import { prisma } from "./prisma";
import {
  AuthUser,
  JWTPayload,
  RefreshTokenPayload,
  UserLogData,
  UserRole,
  UserStatus,
  AuthProvider,
} from "@/types/auth";

const JWT_SECRET = process.env.JWT_SECRET!;
const JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET!;
const BCRYPT_ROUNDS = parseInt(process.env.BCRYPT_ROUNDS || "12");

export class AuthUtils {
  // Password hashing
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, BCRYPT_ROUNDS);
  }

  static async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // JWT token generation
  static generateAccessToken(user: AuthUser): string {
    const payload: JWTPayload = {
      userId: user.id,
      email: user.email,
      role: user.role,
      status: user.status,
    };
    return jwt.sign(payload, JWT_SECRET, { expiresIn: "15m" });
  }

  static generateRefreshToken(userId: string, tokenId: string): string {
    const payload: RefreshTokenPayload = {
      userId,
      tokenId,
    };
    return jwt.sign(payload, JWT_REFRESH_SECRET, { expiresIn: "7d" });
  }

  // Token verification
  static verifyAccessToken(token: string): JWTPayload | null {
    try {
      return jwt.verify(token, JWT_SECRET) as JWTPayload;
    } catch (error) {
      return null;
    }
  }

  static verifyRefreshToken(token: string): RefreshTokenPayload | null {
    try {
      return jwt.verify(token, JWT_REFRESH_SECRET) as RefreshTokenPayload;
    } catch (error) {
      return null;
    }
  }

  // Token generation utilities
  static generateEmailVerificationToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  static generatePasswordResetToken(): string {
    return crypto.randomBytes(32).toString("hex");
  }

  // User logging
  static async logUserAction(logData: UserLogData): Promise<void> {
    try {
      await prisma.userLog.create({
        data: {
          userId: logData.userId,
          action: logData.action,
          details: logData.details,
          ipAddress: logData.ipAddress,
          userAgent: logData.userAgent,
        },
      });
    } catch (error) {
      console.error("Failed to log user action:", error);
    }
  }

  // User status management
  static async updateUserStatus(
    userId: string,
    status: UserStatus
  ): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: { status },
    });
  }

  static async updateLastLogin(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        lastLoginAt: new Date(),
        lastActiveAt: new Date(),
        loginAttempts: 0,
        lockedUntil: null,
      },
    });
  }

  static async incrementLoginAttempts(userId: string): Promise<void> {
    const user = await prisma.user.findUnique({ where: { id: userId } });
    if (!user) return;

    const newAttempts = (user.loginAttempts || 0) + 1;
    const lockedUntil =
      newAttempts >= 5 ? new Date(Date.now() + 15 * 60 * 1000) : null; // 15 minutes

    await prisma.user.update({
      where: { id: userId },
      data: {
        loginAttempts: newAttempts,
        lockedUntil,
      },
    });
  }

  // Role-based access control
  static hasRole(userRole: UserRole, requiredRole: UserRole): boolean {
    const roleHierarchy = {
      SUPERADMIN: 3,
      ADMIN: 2,
      USER: 1,
    };
    return roleHierarchy[userRole] >= roleHierarchy[requiredRole];
  }

  static isActiveUser(user: AuthUser): boolean {
    return user.status === "ACTIVE" && user.emailVerified;
  }

  // Refresh token management
  static async createRefreshToken(userId: string): Promise<string> {
    const tokenId = crypto.randomUUID();
    const refreshToken = this.generateRefreshToken(userId, tokenId);

    await prisma.refreshToken.create({
      data: {
        id: tokenId,
        token: refreshToken,
        userId,
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      },
    });

    return refreshToken;
  }

  static async validateRefreshToken(token: string): Promise<AuthUser | null> {
    const payload = this.verifyRefreshToken(token);
    if (!payload) return null;

    const refreshToken = await prisma.refreshToken.findUnique({
      where: { id: payload.tokenId },
      include: { user: true },
    });

    if (!refreshToken || refreshToken.expires < new Date()) {
      return null;
    }

    return refreshToken.user as AuthUser;
  }

  static async revokeRefreshToken(tokenId: string): Promise<void> {
    await prisma.refreshToken.delete({
      where: { id: tokenId },
    });
  }

  // Username generation
  static async generateUniqueUsername(baseUsername: string): Promise<string> {
    let username = baseUsername;
    let counter = 1;
    
    // Check if username exists and generate unique one
    while (await prisma.user.findUnique({ where: { username } })) {
      username = `${baseUsername}${counter}`;
      counter++;
      
      // Prevent infinite loop
      if (counter > 100) {
        throw new Error('Unable to generate unique username');
      }
    }
    
    return username;
  }

  // Cleanup expired tokens
  static async cleanupExpiredTokens(): Promise<void> {
    await prisma.refreshToken.deleteMany({
      where: {
        expires: {
          lt: new Date(),
        },
      },
    });

    await prisma.verificationToken.deleteMany({
      where: {
        expires: {
          lt: new Date(),
        },
      },
    });
  }
}
