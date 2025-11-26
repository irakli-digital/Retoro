import { NextRequest, NextResponse } from "next/server";
import { 
  getMagicLinkToken, 
  markMagicLinkTokenAsUsed,
  updateUserEmailVerified,
  getUserById,
  createSession
} from "@/lib/queries";
import { generateSessionToken, getSessionExpiration } from "@/lib/auth-utils";
import { setSessionCookie } from "@/lib/auth-server";

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

    // Create session token
    const sessionToken = generateSessionToken();
    const expiresAt = getSessionExpiration();
    
    // Get IP address and user agent for session tracking
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || null;
    const userAgent = request.headers.get("user-agent") || null;
    
    // Create session in database
    await createSession(user.id, sessionToken, expiresAt, ipAddress, userAgent);
    
    // Set session cookie
    await setSessionCookie(sessionToken);

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

