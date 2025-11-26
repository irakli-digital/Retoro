import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionByToken, deleteSession } from "@/lib/queries";

export const dynamic = 'force-dynamic';

const SESSION_COOKIE = "retoro_session";
const ANONYMOUS_USER_COOKIE = "retoro_anonymous_user_id";

/**
 * Logout endpoint - deletes session and clears cookies
 */
export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;

    // Delete session from database if it exists
    if (sessionToken) {
      const session = await getSessionByToken(sessionToken);
      if (session) {
        await deleteSession(sessionToken);
      }
    }

    // Clear session cookie (must match the path used when setting)
    cookieStore.set(SESSION_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0, // Expire immediately
    });
    
    // Also clear anonymous cookie if it exists (for cleanup)
    cookieStore.set(ANONYMOUS_USER_COOKIE, "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0, // Expire immediately
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error during logout:", error);
    // Still try to clear cookies even if database deletion fails
    const cookieStore = await cookies();
    cookieStore.set(SESSION_COOKIE, "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    cookieStore.set(ANONYMOUS_USER_COOKIE, "", {
      httpOnly: false,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 0,
    });
    
    return NextResponse.json(
      { error: "Failed to logout" },
      { status: 500 }
    );
  }
}

