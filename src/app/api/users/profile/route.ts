import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AuthUtils } from "@/lib/auth";
import { firebaseAuthProvider } from "@/lib/firebase-auth-provider";

const updateProfileSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  displayName: z.string().min(1, "Display name is required").optional(),
  bio: z.string().max(500, "Bio must be less than 500 characters").optional(),
  phone: z.string().optional(),
  location: z.string().optional(),
  timezone: z.string().optional(),
  language: z.string().optional(),
  currency: z.string().optional(),
  website: z.string().url("Invalid website URL").optional(),
  socialLinks: z.record(z.string().url("Invalid social link URL")).optional(),
  preferences: z.record(z.any()).optional(),
});

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(firebaseAuthProvider);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        displayName: true,
        avatar: true,
        bio: true,
        phone: true,
        location: true,
        timezone: true,
        language: true,
        currency: true,
        website: true,
        socialLinks: true,
        preferences: true,
        role: true,
        status: true,
        emailVerified: true,
        authProvider: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        lastActiveAt: true,
      },
    });

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get profile error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(firebaseAuthProvider);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateProfileSchema.parse(body);

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: validatedData,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        displayName: true,
        avatar: true,
        bio: true,
        phone: true,
        location: true,
        timezone: true,
        language: true,
        currency: true,
        website: true,
        socialLinks: true,
        preferences: true,
        role: true,
        status: true,
        emailVerified: true,
        authProvider: true,
        createdAt: true,
        updatedAt: true,
        lastLoginAt: true,
        lastActiveAt: true,
      },
    });

    // Log profile update
    await AuthUtils.logUserAction({
      userId: session.user.id,
      action: "PROFILE_UPDATED",
      details: { updatedFields: Object.keys(validatedData) },
      ipAddress:
        request.ip || request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    return NextResponse.json({
      success: true,
      message: "Profile updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update profile error:", error);

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
