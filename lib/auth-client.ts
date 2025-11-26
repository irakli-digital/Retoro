"use client"

const ANONYMOUS_USER_COOKIE = "retoro_anonymous_user_id";

/**
 * Get anonymous user ID from client-side (for anonymous sessions before login)
 * Note: Authenticated sessions use httpOnly cookies and are handled server-side only
 */
export function getUserIdClient(): string {
  if (typeof window === "undefined") {
    return "demo-user-123"; // Fallback for SSR
  }

  // Try to get anonymous user ID from cookie (for anonymous sessions)
  const cookies = document.cookie.split(";");
  const anonymousCookie = cookies.find((c) => c.trim().startsWith(`${ANONYMOUS_USER_COOKIE}=`));
  
  if (anonymousCookie) {
    return anonymousCookie.split("=")[1];
  }

  // Generate and set new anonymous user ID
  const userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
  document.cookie = `${ANONYMOUS_USER_COOKIE}=${userId}; path=/; max-age=${60 * 60 * 24 * 365}`;
  
  return userId;
}

