import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

const ANONYMOUS_USER_COOKIE = "retoro_anonymous_user_id";

/**
 * Initialize anonymous session (for users not logged in)
 * This creates a temporary anonymous user ID cookie
 * Authenticated users use session tokens stored in database
 */
export async function GET() {
  try {
    const cookieStore = await cookies();
    let userId = cookieStore.get(ANONYMOUS_USER_COOKIE)?.value;

    if (!userId) {
      // Generate a new anonymous user ID (UUID-like)
      userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      
      // Set anonymous cookie (not httpOnly so client can read it)
      cookieStore.set(ANONYMOUS_USER_COOKIE, userId, {
        httpOnly: false, // Allow client-side access for anonymous sessions
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }

    return NextResponse.json({ userId });
  } catch (error) {
    console.error("Error initializing anonymous session:", error);
    return NextResponse.json(
      { error: "Failed to initialize session" },
      { status: 500 }
    );
  }
}

