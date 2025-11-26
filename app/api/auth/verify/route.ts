import { NextRequest, NextResponse } from "next/server";
import { 
  getMagicLinkToken, 
  markMagicLinkTokenAsUsed,
  updateUserEmailVerified,
  getUserById
} from "@/lib/queries";
import { cookies } from "next/headers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const token = searchParams.get("token");

    if (!token) {
      return NextResponse.json(
        { error: "Token is required" },
        { status: 400 }
      );
    }

    // Get token from database
    const magicToken = await getMagicLinkToken(token);
    
    if (!magicToken) {
      return NextResponse.json(
        { error: "Invalid or expired token" },
        { status: 400 }
      );
    }

    // Mark token as used
    await markMagicLinkTokenAsUsed(token);

    // Verify email and update user
    await updateUserEmailVerified(magicToken.user_id);

    // Get user
    const user = await getUserById(magicToken.user_id);
    if (!user) {
      return NextResponse.json(
        { error: "User not found" },
        { status: 404 }
      );
    }

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("retoro_user_id", user.id, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });

    // Redirect to dashboard
    return NextResponse.redirect(new URL("/", request.url));
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify token" },
      { status: 500 }
    );
  }
}

