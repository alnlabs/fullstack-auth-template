import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { existsSync } from "fs";
import { prisma } from "@/lib/prisma";
import { AuthUtils } from "@/lib/auth";
import { firebaseAuthProvider } from "@/lib/firebase-auth-provider";

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ALLOWED_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

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
    const file = formData.get("avatar") as File;

    if (!file) {
      return NextResponse.json(
        { success: false, message: "No file provided" },
        { status: 400 }
      );
    }

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
          message: "Only JPEG, PNG, and WebP images are allowed",
        },
        { status: 400 }
      );
    }

    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split(".").pop();
    const fileName = `avatar_${session.user.id}_${timestamp}.${fileExtension}`;

    // Create uploads directory if it doesn't exist
    const uploadsDir = join(process.cwd(), "public", "uploads", "avatars");
    if (!existsSync(uploadsDir)) {
      await mkdir(uploadsDir, { recursive: true });
    }

    // Save file
    const filePath = join(uploadsDir, fileName);
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);

    // Generate public URL
    const publicUrl = `/uploads/avatars/${fileName}`;

    // Update user avatar in database
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: { avatar: publicUrl },
      select: {
        id: true,
        email: true,
        username: true,
        avatar: true,
        firstName: true,
        lastName: true,
        displayName: true,
      },
    });

    // Log avatar upload
    await AuthUtils.logUserAction({
      userId: session.user.id,
      action: "AVATAR_UPLOADED",
      details: {
        fileName,
        fileSize: file.size,
        fileType: file.type,
      },
      ipAddress:
        request.ip || request.headers.get("x-forwarded-for") || "unknown",
      userAgent: request.headers.get("user-agent") || "unknown",
    });

    return NextResponse.json({
      success: true,
      message: "Avatar uploaded successfully",
      avatar: publicUrl,
      user: updatedUser,
    });
  } catch (error) {
    console.error("Avatar upload error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
