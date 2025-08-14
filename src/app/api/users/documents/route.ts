import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { unlink } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
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

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "10");
    const category = searchParams.get("category") || "";
    const search = searchParams.get("search") || "";

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = { userId: session.user.id };

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { fileName: { contains: search, mode: "insensitive" } },
        { description: { contains: search, mode: "insensitive" } },
      ];
    }

    // Get documents with pagination
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
    console.error("Get documents error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(firebaseAuthProvider);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { documentId } = body;

    if (!documentId) {
      return NextResponse.json(
        { success: false, message: "Document ID is required" },
        { status: 400 }
      );
    }

    // Get document and verify ownership
    const document = await prisma.userDocument.findFirst({
      where: {
        id: documentId,
        userId: session.user.id,
      },
    });

    if (!document) {
      return NextResponse.json(
        { success: false, message: "Document not found" },
        { status: 404 }
      );
    }

    // Delete file from filesystem
    const filePath = join(process.cwd(), "public", document.filePath);
    if (existsSync(filePath)) {
      await unlink(filePath);
    }

    // Delete document record from database
    await prisma.userDocument.delete({
      where: { id: documentId },
    });

    // Log document deletion
    await AuthUtils.logUserAction({
      userId: session.user.id,
      action: "DOCUMENT_DELETED",
      details: {
        documentId,
        fileName: document.fileName,
        fileSize: document.fileSize,
        fileType: document.fileType,
        category: document.category,
      },
      ipAddress:
        request.ip || request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    return NextResponse.json({
      success: true,
      message: "Document deleted successfully",
    });
  } catch (error) {
    console.error("Delete document error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
