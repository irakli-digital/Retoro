import { NextRequest, NextResponse } from "next/server";
import { 
  getMagicLinkToken, 
  markMagicLinkTokenAsUsed,
  updateUserEmailVerified,
  getUserById,
  createSession,
  migrateAnonymousData
} from "@/lib/queries";
import { generateSessionToken, getSessionExpiration } from "@/lib/auth-utils";
import { setSessionCookie } from "@/lib/auth-server";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

const ANONYMOUS_USER_COOKIE = "retoro_anonymous_user_id";

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

    // Migrate anonymous session data if cookie exists (user logged in after uploading items anonymously)
    const cookieStore = await cookies();
    const anonymousUserIdFromCookie = cookieStore.get(ANONYMOUS_USER_COOKIE)?.value;
    
    if (anonymousUserIdFromCookie) {
      const migratedCount = await migrateAnonymousData(anonymousUserIdFromCookie, user.id);
      console.log(`[Magic Link Verify] Migrated ${migratedCount} items from anonymous session (${anonymousUserIdFromCookie}) to user ${user.id}`);
      
      // Clear anonymous cookie after migration
      cookieStore.delete(ANONYMOUS_USER_COOKIE);
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
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || new URL(request.url).origin;
    return NextResponse.redirect(new URL("/", baseUrl));
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.json(
      { error: "Failed to verify token" },
      { status: 500 }
    );
  }
}

