import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AuthUtils } from "@/lib/auth";
import { firebaseAuthProvider } from "@/lib/firebase-auth-provider";

const updateDocumentSchema = z.object({
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
  category: z.enum(["RESUME", "PORTFOLIO", "CERTIFICATE", "OTHER"]).optional(),
});

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(firebaseAuthProvider);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const document = await prisma.userDocument.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
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
    });

    if (!document) {
      return NextResponse.json(
        { success: false, message: "Document not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      document,
    });
  } catch (error) {
    console.error("Get document error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(firebaseAuthProvider);

    if (!session?.user?.id) {
      return NextResponse.json(
        { success: false, message: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const validatedData = updateDocumentSchema.parse(body);

    // Get document and verify ownership
    const existingDocument = await prisma.userDocument.findFirst({
      where: {
        id: params.id,
        userId: session.user.id,
      },
    });

    if (!existingDocument) {
      return NextResponse.json(
        { success: false, message: "Document not found" },
        { status: 404 }
      );
    }

    // Update document
    const updatedDocument = await prisma.userDocument.update({
      where: { id: params.id },
      data: validatedData,
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
    });

    // Log document update
    await AuthUtils.logUserAction({
      userId: session.user.id,
      action: "DOCUMENT_UPDATED",
      details: {
        documentId: params.id,
        updatedFields: Object.keys(validatedData),
      },
      ipAddress:
        request.ip || request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    return NextResponse.json({
      success: true,
      message: "Document updated successfully",
      document: updatedDocument,
    });
  } catch (error) {
    console.error("Update document error:", error);

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
