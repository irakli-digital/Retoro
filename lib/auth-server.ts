import { cookies } from "next/headers";
import { getUserById } from "@/lib/queries";

const USER_ID_COOKIE = "retoro_user_id";

/**
 * Get the current user ID from session cookie (Server-side only)
 * Returns a default user ID if cookie doesn't exist (cookie will be set client-side)
 */
export async function getUserId(): Promise<string> {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get(USER_ID_COOKIE)?.value;
    
    if (userId) {
      // Verify user exists and is valid
      const user = await getUserById(userId);
      if (user) {
        return userId;
      }
    }
    
    // Return a temporary ID - cookie will be set client-side
    // This prevents errors during SSR
    return "demo-user-123";
  } catch (error) {
    console.error("Error reading cookies:", error);
    return "demo-user-123";
  }
}

/**
 * Get the current user object (Server-side only)
 */
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const userId = cookieStore.get(USER_ID_COOKIE)?.value;
    
    if (userId) {
      return await getUserById(userId);
    }
    
    return null;
  } catch (error) {
    console.error("Error getting current user:", error);
    return null;
  }
}

