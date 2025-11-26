import { cookies } from "next/headers";
import { getUserById, getSessionByToken, updateSessionLastUsed } from "@/lib/queries";

const SESSION_COOKIE = "retoro_session";

/**
 * Get the current user ID from session token (Server-side only)
 * Returns a default user ID if session doesn't exist (session will be set client-side)
 */
export async function getUserId(): Promise<string> {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;
    
    if (sessionToken) {
      // Verify session exists and is valid
      const session = await getSessionByToken(sessionToken);
      
      if (session) {
        // Update last used timestamp
        await updateSessionLastUsed(sessionToken);
        
        // Verify user still exists
        const user = await getUserById(session.user_id);
        if (user) {
          return session.user_id;
        } else {
          console.warn(`User ID ${session.user_id} from session not found in database`);
        }
      } else {
        console.log("Session token invalid or expired");
      }
    } else {
      console.log("No session cookie found, using anonymous session");
    }
    
    // Return a temporary ID - session will be set client-side
    // This prevents errors during SSR
    return "demo-user-123";
  } catch (error) {
    console.error("Error reading session:", error);
    return "demo-user-123";
  }
}

/**
 * Get the current user object (Server-side only)
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get(SESSION_COOKIE)?.value;
    
    if (sessionToken) {
      const session = await getSessionByToken(sessionToken);
      
      if (session) {
        // Update last used timestamp
        await updateSessionLastUsed(sessionToken);
        
        return await getUserById(session.user_id);
      }
    }
    
    return null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

/**
 * Set session cookie (Server-side only)
 * Used by auth endpoints to create sessions
 */
export async function setSessionCookie(sessionToken: string) {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE, sessionToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days (matches session expiration)
  });
}

