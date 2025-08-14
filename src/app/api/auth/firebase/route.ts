import { NextRequest, NextResponse } from "next/server";
import { signInWithCredential, GoogleAuthProvider } from "firebase/auth";
import { auth } from "@/lib/firebase";
import { prisma } from "@/lib/prisma";
import { AuthUtils } from "@/lib/auth";
import { z } from "zod";

const firebaseAuthSchema = z.object({
  idToken: z.string().min(1, "ID token is required"),
});

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedData = firebaseAuthSchema.parse(body);

    // Verify the ID token with Firebase
    const credential = GoogleAuthProvider.credential(validatedData.idToken);
    const userCredential = await signInWithCredential(auth, credential);
    const firebaseUser = userCredential.user;

    if (!firebaseUser.email) {
      return NextResponse.json(
        { success: false, message: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user already exists in database
    let user = await prisma.user.findUnique({
      where: { email: firebaseUser.email },
    });

    if (user) {
      // Update existing user with Firebase data
      user = await prisma.user.update({
        where: { id: user.id },
        data: {
          authProvider: "FIREBASE",
          providerId: firebaseUser.uid,
          providerData: {
            firebaseUid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified,
          },
          avatar: firebaseUser.photoURL || user.avatar,
          emailVerified: firebaseUser.emailVerified,
          status: "ACTIVE",
          lastLoginAt: new Date(),
        },
      });

      // Log Firebase sign-in
      await AuthUtils.logUserAction({
        userId: user.id,
        action: "LOGIN_SUCCESS",
        details: { method: "firebase", provider: "FIREBASE" },
        ipAddress:
          request.ip || request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      });
    } else {
      // Generate unique username for Firebase user
      const baseUsername = firebaseUser.email.split("@")[0];
      const username = await AuthUtils.generateUniqueUsername(baseUsername);

      // Create new user from Firebase
      user = await prisma.user.create({
        data: {
          email: firebaseUser.email,
          username: username,
          firstName: firebaseUser.displayName?.split(" ")[0] || "",
          lastName: firebaseUser.displayName?.split(" ").slice(1).join(" ") || "",
          displayName: firebaseUser.displayName || "",
          avatar: firebaseUser.photoURL || "",
          role: "USER",
          status: "ACTIVE",
          emailVerified: firebaseUser.emailVerified,
          authProvider: "FIREBASE",
          providerId: firebaseUser.uid,
          providerData: {
            firebaseUid: firebaseUser.uid,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            emailVerified: firebaseUser.emailVerified,
          },
        },
      });

      // Log user creation
      await AuthUtils.logUserAction({
        userId: user.id,
        action: "USER_CREATED",
        details: { method: "firebase", provider: "FIREBASE" },
        ipAddress:
          request.ip || request.headers.get("x-forwarded-for") || "unknown",
        userAgent: request.headers.get("user-agent") || "unknown",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Firebase authentication successful",
      user: {
        id: user.id,
        email: user.email,
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        displayName: user.displayName,
        avatar: user.avatar,
        role: user.role,
        status: user.status,
        emailVerified: user.emailVerified,
        authProvider: user.authProvider,
      },
    });
  } catch (error) {
    console.error("Firebase authentication error:", error);

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
      { success: false, message: "Firebase authentication failed" },
      { status: 401 }
    );
  }
}
