import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { AuthUtils } from "@/lib/auth";
import { firebaseAuthProvider } from "@/lib/firebase-auth-provider";

const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
const ALLOWED_TYPES = [
  "application/pdf",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "application/vnd.ms-excel",
  "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  "text/plain",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
];

const uploadDocumentSchema = z.object({
  category: z.enum(["RESUME", "PORTFOLIO", "CERTIFICATE", "OTHER"]),
  description: z
    .string()
    .max(500, "Description must be less than 500 characters")
    .optional(),
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

    const formData = await request.formData();
    const file = formData.get("document") as File;
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

    // Validate metadata
    const validatedData = uploadDocumentSchema.parse({ category, description });

    // Validate file size
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json(
        {
          success: false,
          message: `File size must be less than ${
            MAX_FILE_SIZE / (1024 * 1024)
          }MB`,
        },
        { status: 400 }
      );
    }

    // Validate file type
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json(
        {
          success: false,
          message: "Only PDF, Word, Excel, text, and image files are allowed",
        },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const fileName = `doc_${session.user.id}_${timestamp}.${fileExtension}`;

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads", "documents");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Save file
    const filePath = join(uploadsDir, fileName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Generate public URL
    const publicUrl = `/uploads/documents/${fileName}`;

    // Create document record in database
    const document = await prisma.userDocument.create({
      data: {
        userId: session.user.id,
        fileName: file.name,
        filePath: publicUrl,
        fileSize: file.size,
        fileType: file.type,
        category: validatedData.category,
        description: validatedData.description,
      },
    });

    // Log document upload
    await AuthUtils.logUserAction({
      userId: session.user.id,
      action: "DOCUMENT_UPLOADED",
      details: {
        documentId: document.id,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
        category: validatedData.category,
      },
      ipAddress:
        request.ip || request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    return NextResponse.json({
      success: true,
      message: "Document uploaded successfully",
      document: {
        id: document.id,
        fileName: document.fileName,
        filePath: document.filePath,
        fileSize: document.fileSize,
        fileType: document.fileType,
        category: document.category,
        description: document.description,
        createdAt: document.createdAt,
      },
    });
  } catch (error) {
    console.error("Document upload error:", error);

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
