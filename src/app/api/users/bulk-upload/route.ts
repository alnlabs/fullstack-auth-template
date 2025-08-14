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
const MAX_FILES = 10; // Maximum 10 files per request
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

const bulkUploadSchema = z.object({
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
    const files = formData.getAll("files") as File[];
    const category = formData.get("category") as string;
    const description = formData.get("description") as string;

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: "No files provided" },
        { status: 400 }
      );
    }

    if (files.length > MAX_FILES) {
      return NextResponse.json(
        {
          success: false,
          message: `Maximum ${MAX_FILES} files allowed per request`,
        },
        { status: 400 }
      );
    }

    // Validate metadata
    const validatedData = bulkUploadSchema.parse({ category, description });

    const results = [];
    const errors = [];

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads", "documents");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Process each file
    for (const file of files) {
      try {
        // Validate file size
        if (file.size > MAX_FILE_SIZE) {
          errors.push({
            fileName: file.name,
            error: `File size must be less than ${
              MAX_FILE_SIZE / (1024 * 1024)
            }MB`,
          });
          continue;
        }

        // Validate file type
        if (!ALLOWED_TYPES.includes(file.type)) {
          errors.push({
            fileName: file.name,
            error: "File type not allowed",
          });
          continue;
        }

        // Generate unique filename
        const timestamp = Date.now();
        const fileExtension = file.name.split(".").pop();
        const fileName = `doc_${session.user.id}_${timestamp}_${Math.random()
          .toString(36)
          .substr(2, 9)}.${fileExtension}`;

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

        results.push({
          id: document.id,
          fileName: document.fileName,
          filePath: document.filePath,
          fileSize: document.fileSize,
          fileType: document.fileType,
          category: document.category,
          description: document.description,
          createdAt: document.createdAt,
        });
      } catch (error) {
        console.error(`Error processing file ${file.name}:`, error);
        errors.push({
          fileName: file.name,
          error: "Failed to process file",
        });
      }
    }

    // Log bulk upload
    if (results.length > 0) {
      await AuthUtils.logUserAction({
        userId: session.user.id,
        action: "BULK_DOCUMENT_UPLOADED",
        details: {
          totalFiles: files.length,
          successfulUploads: results.length,
          failedUploads: errors.length,
          category: validatedData.category,
        },
        ipAddress:
          request.ip || request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      });
    }

    return NextResponse.json({
      success: true,
      message: `Successfully uploaded ${results.length} out of ${files.length} files`,
      uploaded: results,
      errors,
      summary: {
        total: files.length,
        successful: results.length,
        failed: errors.length,
      },
    });
  } catch (error) {
    console.error("Bulk upload error:", error);

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
