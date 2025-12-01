import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { getSessionByToken, deleteSession } from "@/lib/queries";

export const dynamic = 'force-dynamic';

const SESSION_COOKIE = "retoro_session";
const ANONYMOUS_USER_COOKIE = "retoro_anonymous_user_id";

/**
 * Helper function to clear cookies on a response
 */
function clearCookiesOnResponse(response: NextResponse) {
  const isProduction = process.env.NODE_ENV === "production";
  
  // Clear session cookie
  response.cookies.set(SESSION_COOKIE, "", {
    httpOnly: true,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  
  // Clear anonymous cookie
  response.cookies.set(ANONYMOUS_USER_COOKIE, "", {
    httpOnly: false,
    secure: isProduction,
    sameSite: "lax",
    path: "/",
    maxAge: 0,
  });
  
  return response;
}

export async function POST(request: NextRequest) {
  let sessionToken: string | undefined;
  
  try {
    const cookieStore = await cookies();
    sessionToken = cookieStore.get(SESSION_COOKIE)?.value;

    // Delete session from database if it exists
    if (sessionToken) {
      try {
        const session = await getSessionByToken(sessionToken);
        if (session) {
          await deleteSession(sessionToken);
        }
      } catch (dbError) {
        // Log database error but continue with cookie clearing
        console.error("Error deleting session from database:", dbError);
      }
    }

    // Create response and clear cookies
    const response = NextResponse.json({ success: true });
    clearCookiesOnResponse(response);
    
    return response;
  } catch (error) {
    console.error("Error during logout:", error);
    
    // Even on error, try to clear cookies
    const errorResponse = NextResponse.json(
      { error: "Failed to logout", success: false },
      { status: 500 }
    );
    
    // Clear cookies on error response too
    clearCookiesOnResponse(errorResponse);
    
    return errorResponse;
  }
}

