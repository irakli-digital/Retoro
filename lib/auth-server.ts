import { cookies } from "next/headers";

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
      return userId;
    }
    
    // Return a temporary ID - cookie will be set client-side
    // This prevents errors during SSR
    return "demo-user-123";
  } catch (error) {
    console.error("Error reading cookies:", error);
    return "demo-user-123";
  }
}

