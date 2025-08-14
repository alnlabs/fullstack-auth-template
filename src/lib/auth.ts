import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { prisma } from "./prisma";

const JWT_SECRET = process.env.JWT_SECRET || "your-secret-key";

export interface User {
  id: string;
  email: string;
  name: string;
  role: "USER" | "ADMIN" | "SUPERADMIN";
  status: "ACTIVE" | "INACTIVE" | "SUSPENDED" | "PENDING_VERIFICATION";
  image?: string;
}

export class AuthUtils {
  // Password hashing
  static async hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
  }

  static async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
  }

  // JWT token generation
  static generateToken(user: User): string {
    return jwt.sign(
      {
        id: user.id,
        email: user.email,
        role: user.role,
        status: user.status,
      },
      JWT_SECRET,
      { expiresIn: "7d" }
    );
  }

  // Token verification
  static verifyToken(token: string): any {
    try {
      return jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return null;
    }
  }

  // User authentication
  static async authenticateUser(
    emailOrUsername: string,
    password: string
  ): Promise<User | null> {
    try {
      // Check if input is email or username
      const isEmail = emailOrUsername.includes("@");

      const user = await prisma.user.findFirst({
        where: isEmail
          ? { email: emailOrUsername }
          : { username: emailOrUsername },
      });

      if (!user || !user.password) {
        return null;
      }

      const isPasswordValid = await this.comparePassword(
        password,
        user.password
      );
      if (!isPasswordValid) {
        return null;
      }

      if (user.status !== "ACTIVE") {
        return null;
      }

      return {
        id: user.id,
        email: user.email,
        name: user.displayName || `${user.firstName} ${user.lastName}`,
        role: user.role,
        status: user.status,
        image: user.avatar,
      };
    } catch (error) {
      console.error("Authentication error:", error);
      return null;
    }
  }

  // Role-based access control
  static hasRole(userRole: string, requiredRoles: string[]): boolean {
    return requiredRoles.includes(userRole);
  }

  // Update last login
  static async updateLastLogin(userId: string): Promise<void> {
    await prisma.user.update({
      where: { id: userId },
      data: {
        lastLoginAt: new Date(),
        lastActiveAt: new Date(),
      },
    });
  }
}
