"use client"

const USER_ID_COOKIE = "retoro_user_id";

/**
 * Get user ID from client-side (for client components)
 */
export function getUserIdClient(): string {
  if (typeof window === "undefined") {
    return "demo-user-123"; // Fallback for SSR
  }

  // Try to get from cookie
  const cookies = document.cookie.split(";");
  const userIdCookie = cookies.find((c) => c.trim().startsWith(`${USER_ID_COOKIE}=`));
  
  if (userIdCookie) {
    return userIdCookie.split("=")[1];
  }

  // Generate and set new user ID
  const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  document.cookie = `${USER_ID_COOKIE}=${userId}; path=/; max-age=${60 * 60 * 24 * 365}`;
  
  return userId;
}

