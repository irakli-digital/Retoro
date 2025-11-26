import { NextRequest, NextResponse } from "next/server";
import { 
  getMagicLinkToken, 
  markMagicLinkTokenAsUsed,
  updateUserEmailVerified
} from "@/lib/queries";

export const dynamic = 'force-dynamic';

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

    // Redirect to dashboard with success message
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    const url = new URL("/", baseUrl);
    url.searchParams.set("verified", "true");
    return NextResponse.redirect(url);
  } catch (error) {
    console.error("Email verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify email" },
      { status: 500 }
    );
  }
}

