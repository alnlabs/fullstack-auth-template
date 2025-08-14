import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AuthUtils } from "@/lib/auth";
import { firebaseAuthProvider } from "@/lib/firebase-auth-provider";

const updateUserSchema = z.object({
  firstName: z.string().min(1, "First name is required").optional(),
  lastName: z.string().min(1, "Last name is required").optional(),
  displayName: z.string().min(1, "Display name is required").optional(),
  role: z.enum(["USER", "ADMIN", "SUPERADMIN"]).optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "SUSPENDED", "BANNED"]).optional(),
  emailVerified: z.boolean().optional(),
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

    // Check if user has admin privileges
    if (!AuthUtils.hasRole(session.user.role, ["ADMIN", "SUPERADMIN"])) {
      return NextResponse.json(
        { success: false, message: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const search = searchParams.get("search") || "";
    const role = searchParams.get("role") || "";
    const status = searchParams.get("status") || "";
    const authProvider = searchParams.get("authProvider") || "";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (search) {
      where.OR = [
        { email: { contains: search, mode: "insensitive" } },
        { username: { contains: search, mode: "insensitive" } },
        { firstName: { contains: search, mode: "insensitive" } },
        { lastName: { contains: search, mode: "insensitive" } },
        { displayName: { contains: search, mode: "insensitive" } },
      ];
    }

    if (role) {
      where.role = role;
    }

    if (status) {
      where.status = status;
    }

    if (authProvider) {
      where.authProvider = authProvider;
    }

    // Get users with pagination
    const [users, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          username: true,
          firstName: true,
          lastName: true,
          displayName: true,
          avatar: true,
          role: true,
          status: true,
          emailVerified: true,
          authProvider: true,
          createdAt: true,
          updatedAt: true,
          lastLoginAt: true,
          lastActiveAt: true,
          loginAttempts: true,
          lockedUntil: true,
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.user.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      users,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get users error:", error);
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

    // Check if user has admin privileges
    if (!AuthUtils.hasRole(session.user.role, ["ADMIN", "SUPERADMIN"])) {
      return NextResponse.json(
        { success: false, message: "Insufficient permissions" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const { userId, ...updateData } = body;

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID is required" },
        { status: 400 }
      );
    }

    const validatedData = updateUserSchema.parse(updateData);

    // Check if user exists
    const existingUser = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true, role: true },
    });

    if (!existingUser) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Prevent non-superadmin from modifying superadmin users
    if (
      existingUser.role === "SUPERADMIN" &&
      session.user.role !== "SUPERADMIN"
    ) {
      return NextResponse.json(
        { success: false, message: "Cannot modify superadmin users" },
        { status: 403 }
      );
    }

    // Prevent role escalation
    if (
      validatedData.role === "SUPERADMIN" &&
      session.user.role !== "SUPERADMIN"
    ) {
      return NextResponse.json(
        { success: false, message: "Cannot assign superadmin role" },
        { status: 403 }
      );
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: validatedData,
      select: {
        id: true,
        email: true,
        username: true,
        firstName: true,
        lastName: true,
        displayName: true,
        avatar: true,
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

    // Log admin action
    await AuthUtils.logUserAction({
      userId: session.user.id,
      action: "ADMIN_USER_UPDATED",
      details: {
        targetUserId: userId,
        updatedFields: Object.keys(validatedData),
      },
      ipAddress:
        request.ip || request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    return NextResponse.json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    console.error("Update user error:", error);

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
