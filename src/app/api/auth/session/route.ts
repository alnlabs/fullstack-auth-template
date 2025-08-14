import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { firebaseAuthProvider } from "@/lib/firebase-auth-provider";

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(firebaseAuthProvider);

    if (!session) {
      return NextResponse.json(
        { success: false, message: "No active session" },
        { status: 401 }
      );
    }

    return NextResponse.json({
      success: true,
      session: {
        user: session.user,
        expires: session.expires,
      },
    });
  } catch (error) {
    console.error("Session error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
