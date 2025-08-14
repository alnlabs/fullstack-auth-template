import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { AuthUtils } from "@/lib/auth";
import { firebaseAuthProvider } from "@/lib/firebase-auth-provider";

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(firebaseAuthProvider);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "No active session" },
        { status: 401 }
      );
    }

    // Log logout action
    await AuthUtils.logUserAction({
      userId: session.user.id,
      action: "LOGOUT",
      details: { method: "api" },
      ipAddress:
        request.ip || request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    // Update last active timestamp
    await prisma.user.update({
      where: { id: session.user.id },
      data: {
        lastActiveAt: new Date(),
      },
    });

    // Clear all refresh tokens for this user
    await prisma.refreshToken.deleteMany({
      where: { userId: session.user.id },
    });

    // Clear all sessions for this user
    await prisma.session.deleteMany({
      where: { userId: session.user.id },
    });

    return NextResponse.json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
