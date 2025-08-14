import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AuthUtils } from "@/lib/auth";

const resendVerificationSchema = z.object({
  email: z.string().email("Invalid email address"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = resendVerificationSchema.parse(body);

    // Find user by email
    const user = await prisma.user.findUnique({
      where: { email: validatedData.email },
      select: {
        id: true,
        email: true,
        firstName: true,
        lastName: true,
        emailVerified: true,
        emailVerificationExpires: true,
        authProvider: true,
      },
    });

    if (!user) {
      // Don't reveal if user exists or not
      return NextResponse.json({
        success: true,
        message:
          "If an account with that email exists, a verification link has been sent.",
      });
    }

    // Check if user is already verified
    if (user.emailVerified) {
      return NextResponse.json({
        success: true,
        message:
          "If an account with that email exists, a verification link has been sent.",
      });
    }

    // Check if user is using local authentication
    if (user.authProvider !== "LOCAL") {
      return NextResponse.json({
        success: true,
        message:
          "If an account with that email exists, a verification link has been sent.",
      });
    }

    // Check if previous token is still valid (within 5 minutes)
    if (
      user.emailVerificationExpires &&
      user.emailVerificationExpires > new Date(Date.now() - 5 * 60 * 1000)
    ) {
      return NextResponse.json(
        {
          success: false,
          message:
            "Please wait 5 minutes before requesting another verification email.",
        },
        { status: 429 }
      );
    }

    // Generate new verification token
    const emailVerificationToken = AuthUtils.generateEmailVerificationToken();
    const emailVerificationExpires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

    // Update user with new verification token
    await prisma.user.update({
      where: { id: user.id },
      data: {
        emailVerificationToken,
        emailVerificationExpires,
      },
    });

    // Log resend verification request
    await AuthUtils.logUserAction({
      userId: user.id,
      action: "VERIFICATION_EMAIL_RESENT",
      details: { method: "api" },
      ipAddress:
        request.ip || request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    // TODO: Send verification email
    // await sendVerificationEmail(user.email, emailVerificationToken, user.firstName);

    return NextResponse.json({
      success: true,
      message:
        "If an account with that email exists, a verification link has been sent.",
    });
  } catch (error) {
    console.error("Resend verification error:", error);

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
