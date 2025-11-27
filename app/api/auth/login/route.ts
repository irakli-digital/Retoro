import { NextRequest, NextResponse } from "next/server";
import { 
  getUserByEmail, 
  migrateAnonymousData, 
  createSession 
} from "@/lib/queries";
import { 
  verifyPassword, 
  generateSessionToken, 
  getSessionExpiration 
} from "@/lib/auth-utils";
import { setSessionCookie } from "@/lib/auth-server";
import { cookies } from "next/headers";

const ANONYMOUS_USER_COOKIE = "retoro_anonymous_user_id";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, anonymous_user_id } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user by email
    const user = await getUserByEmail(email);
    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Check if user has a password set (might be OAuth-only user)
    if (!user.password_hash) {
      return NextResponse.json(
        { error: "Please log in with Google or Magic Link" },
        { status: 401 }
      );
    }

    // Verify password
    const isValid = await verifyPassword(password, user.password_hash);
    if (!isValid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    // Login successful
    const userId = user.id;

    // Migrate anonymous session data
    const cookieStore = await cookies();
    const anonymousUserIdFromCookie = cookieStore.get(ANONYMOUS_USER_COOKIE)?.value;
    const anonymousUserIdToMigrate = anonymous_user_id || anonymousUserIdFromCookie;
    
    if (anonymousUserIdToMigrate) {
      const migratedCount = await migrateAnonymousData(anonymousUserIdToMigrate, userId);
      console.log(`[Login] Migrated ${migratedCount} items from anonymous session (${anonymousUserIdToMigrate}) to user ${userId}`);
      
      // Clear anonymous cookie after migration
      if (anonymousUserIdFromCookie) {
        cookieStore.delete(ANONYMOUS_USER_COOKIE);
      }
    } else {
      console.log(`[Login] No anonymous data to migrate for user ${userId}`);
    }

    // Create session
    const sessionToken = generateSessionToken();
    const expiresAt = getSessionExpiration();
    const ipAddress = request.headers.get("x-forwarded-for") || request.headers.get("x-real-ip") || null;
    const userAgent = request.headers.get("user-agent") || null;
    
    await createSession(userId, sessionToken, expiresAt, ipAddress, userAgent);
    
    // Set session cookie
    await setSessionCookie(sessionToken);
    
    return NextResponse.json({
      success: true,
      user: {
        id: user.id,
        email: user.email,
        name: user.name
      }
    });
  } catch (error) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: "Failed to log in" },
      { status: 500 }
    );
  }
}
