import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AuthUtils } from "@/lib/auth";

const verifyEmailSchema = z.object({
  token: z.string().min(1, "Verification token is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = verifyEmailSchema.parse(body);

    // Find user by verification token
    const user = await prisma.user.findFirst({
      where: {
        emailVerificationToken: validatedData.token,
        emailVerificationExpires: {
          gt: new Date(),
        },
        emailVerified: false,
      },
      select: {
        id: true,
        email: true,
        status: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired verification token",
        },
        { status: 400 }
      );
    }

    // Update user to verified
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerified: true,
        emailVerificationToken: null,
        emailVerificationExpires: null,
        status: "ACTIVE", // Activate user after email verification
      },
    });

    // Log email verification
    await AuthUtils.logUserAction({
      userId: user.id,
      action: "EMAIL_VERIFIED",
      details: { method: "token" },
      ipAddress:
        request.ip || request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    return NextResponse.json({
      success: true,
      message:
        "Email verified successfully. You can now login to your account.",
    });
  } catch (error) {
    console.error("Email verification error:", error);

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
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
