import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { prisma } from "@/lib/prisma";
import { AuthUtils } from "@/lib/auth";
import { firebaseAuthProvider } from "@/lib/firebase-auth-provider";

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
    const category = searchParams.get("category") || "";
    const search = searchParams.get("search") || "";
    const userId = searchParams.get("userId") || "";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};

    if (category) {
      where.category = category;
    }

    if (userId) {
      where.userId = userId;
    }

    if (search) {
      where.OR = [
        { fileName: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
        {
          user: {
            OR: [
              { email: { contains: search, mode: "insensitive" } },
              { username: { contains: search, mode: "insensitive" } },
              { firstName: { contains: search, mode: "insensitive" } },
              { lastName: { contains: search, mode: "insensitive" } },
            ],
          },
        },
      ];
    }

    // Get documents with pagination and user info
    const [documents, total] = await Promise.all([
      prisma.userDocument.findMany({
        where,
        select: {
          id: true,
          fileName: true,
          filePath: true,
          fileSize: true,
          fileType: true,
          category: true,
          description: true,
          createdAt: true,
          updatedAt: true,
          user: {
            select: {
              id: true,
              email: true,
              username: true,
              firstName: true,
              lastName: true,
              displayName: true,
              role: true,
              status: true,
            },
          },
        },
        skip,
        take: limit,
        orderBy: { createdAt: "desc" },
      }),
      prisma.userDocument.count({ where }),
    ]);

    return NextResponse.json({
      success: true,
      documents,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error("Get admin documents error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
