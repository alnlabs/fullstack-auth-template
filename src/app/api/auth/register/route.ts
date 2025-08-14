import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AuthUtils } from "@/lib/auth";
import { UserRole, UserStatus, AuthProvider } from "@prisma/client";

const registerSchema = z.object({
  email: z.string().email("Invalid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  username: z
    .string()
    .min(3, "Username must be at least 3 characters")
    .max(20, "Username must be at most 20 characters")
    .regex(/^[a-zA-Z0-9_-]+$/, "Username can only contain letters, numbers, underscores, and hyphens")
    .required(),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = registerSchema.parse(body);

    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: {
        OR: [
          { email: validatedData.email },
          ...(validatedData.username
            ? [{ username: validatedData.username }]
            : []),
        ],
      },
    });

    if (existingUser) {
      return NextResponse.json(
        {
          success: false,
          message:
            existingUser.email === validatedData.email
              ? "Email already registered"
              : "Username already taken",
        },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await AuthUtils.hashPassword(validatedData.password);

    // Generate email verification token
    const emailVerificationToken = AuthUtils.generateEmailVerificationToken();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

          // Create user
      const user = await prisma.user.create({
        data: {
          email: validatedData.email,
          username: validatedData.username,
          firstName: validatedData.firstName,
          lastName: validatedData.lastName,
        displayName: `${validatedData.firstName} ${validatedData.lastName}`,
        password: hashedPassword,
        role: UserRole.USER,
        status: UserStatus.PENDING_VERIFICATION,
        emailVerified: false,
        authProvider: AuthProvider.LOCAL,
        emailVerificationToken,
        emailVerificationExpires,
        language: "en",
        currency: "USD",
        preferences: {
          theme: "auto",
          notifications: {
            email: true,
            push: false,
            sms: false,
          },
        },
      },
    });

    // Log user creation
    await AuthUtils.logUserAction({
      userId: user.id,
      action: "USER_CREATED",
      details: { method: "registration" },
      ipAddress:
        request.ip || request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    // TODO: Send verification email
    // await sendVerificationEmail(user.email, emailVerificationToken)

    return NextResponse.json({
      success: true,
      message:
        "User registered successfully. Please check your email to verify your account.",
      user: {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        username: user.username,
        status: user.status,
      },
    });
  } catch (error) {
    console.error("Registration error:", error);

    if (error instanceof z.ZodError) {
      return NextResponse.json(
        {
          success: false,
          message: "Validation error",
          errors: error.errors,
        },
        { status: 400 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message: "Internal server error",
      },
      { status: 500 }
    );
  }
}
