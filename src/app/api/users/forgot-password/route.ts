import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AuthUtils } from "@/lib/auth";

const forgotPasswordSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = forgotPasswordSchema.parse(body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        authProvider: true,
      },
    });

    if (!user) {
      // Don't reveal if user exists or not
      return NextResponse.json({
        success: true,
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // Check if user is using local authentication
    if (user.authProvider !== "LOCAL") {
      return NextResponse.json({
        success: true,
        message:
          "If an account with that email exists, a password reset link has been sent.",
      });
    }

    // Generate password reset token
    const passwordResetToken = AuthUtils.generatePasswordResetToken();
    const passwordResetExpires = new Date(Date.now() + 60 * 60 * 1000); // 1 hour

    // Update user with reset token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        passwordResetToken,
        passwordResetExpires,
      },
    });

    // Log password reset request
    await AuthUtils.logUserAction({
      userId: user.id,
      action: "PASSWORD_RESET_REQUESTED",
      details: { method: "email" },
      ipAddress:
        request.ip || request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    // TODO: Send password reset email
    // await sendPasswordResetEmail(user.email, passwordResetToken, user.firstName);

    return NextResponse.json({
      success: true,
      message:
        "If an account with that email exists, a password reset link has been sent.",
    });
  } catch (error) {
    console.error("Forgot password error:", error);

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
