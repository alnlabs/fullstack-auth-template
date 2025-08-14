import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AuthUtils } from "@/lib/auth";
import { firebaseAuthProvider } from "@/lib/firebase-auth-provider";

const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, "Current password is required"),
  newPassword: z.string().min(8, "New password must be at least 8 characters"),
});

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(firebaseAuthProvider);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = changePasswordSchema.parse(body);

    // Get user with password
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        password: true,
        authProvider: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Check if user has a password (local auth)
    if (!user.password || user.authProvider !== "LOCAL") {
      return NextResponse.json(
        {
          success: false,
          message: "Password change not available for OAuth users",
        },
        { status: 400 }
      );
    }

    // Verify current password
    const isCurrentPasswordValid = await AuthUtils.comparePassword(
      validatedData.currentPassword,
      user.password
    );

    if (!isCurrentPasswordValid) {
      return NextResponse.json(
        { success: false, message: "Current password is incorrect" },
        { status: 400 }
      );
    }

    // Hash new password
    const hashedNewPassword = await AuthUtils.hashPassword(
      validatedData.newPassword
    );

    // Update password
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        password: hashedNewPassword,
      },
    });

    // Log password change
    await AuthUtils.logUserAction({
      userId: session.user.id,
      action: "PASSWORD_CHANGED",
      details: { method: "api" },
      ipAddress:
        request.ip || request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    return NextResponse.json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    console.error("Change password error:", error);

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
