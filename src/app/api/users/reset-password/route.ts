import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AuthUtils } from "@/lib/auth";

const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset token is required"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = resetPasswordSchema.parse(body);

    // Find user by reset token
    const user = await prisma.user.findFirst({
      where: {
        passwordResetToken: validatedData.token,
        passwordResetExpires: {
          gt: new Date(),
        },
      },
      select: {
        id: true,
        email: true,
        authProvider: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid or expired reset token",
        },
        { status: 400 }
      );
    }

    // Check if user is using local authentication
    if (user.authProvider !== "LOCAL") {
      return NextResponse.json(
        {
          success: false,
          message: "Password reset not available for OAuth users",
        },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedPassword = await AuthUtils.hashPassword(validatedData.password);

    // Update user password and clear reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        password: hashedPassword,
        passwordResetToken: null,
        passwordResetExpires: null,
        loginAttempts: 0,
        lockedUntil: null,
      },
    });

    // Log password reset
    await AuthUtils.logUserAction({
      userId: user.id,
      action: "PASSWORD_RESET_COMPLETED",
      details: { method: "token" },
      ipAddress:
        request.ip || request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    return NextResponse.json({
      success: true,
      message:
        "Password reset successfully. You can now login with your new password.",
    });
  } catch (error) {
    console.error("Reset password error:", error);

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
