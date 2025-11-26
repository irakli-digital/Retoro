"use client"

import { useEffect } from "react"
import { getUserIdClient } from "@/lib/auth-client"

/**
 * Client-side component to ensure user session is initialized
 * This runs on the client to set the cookie if it doesn't exist
 */
export default function SessionProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Initialize session by calling the API
    fetch("/api/auth/init")
      .then(res => res.json())
      .then(data => {
        // Session initialized
        if (data.userId) {
          // Also set client-side cookie for client components
          const clientUserId = getUserIdClient();
        }
      })
      .catch(err => {
        console.error("Failed to initialize session:", err);
      });
  }, []);

  return <>{children}</>;
}

