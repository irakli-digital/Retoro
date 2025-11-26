"use client"

import { useEffect } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { toast } from "sonner"

/**
 * Handles OAuth callback success/error and refreshes the page
 * to ensure session cookie is properly read
 */
export default function OAuthHandler() {
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    const oauthSuccess = searchParams.get("oauth_success")
    const oauthError = searchParams.get("error")

    if (oauthSuccess === "true") {
      // Show success message
      toast.success("Successfully signed in with Google!")
      
      // Remove query params and refresh to ensure cookie is read
      setTimeout(() => {
        router.replace("/")
        router.refresh()
      }, 500)
    } else if (oauthError) {
      // Handle OAuth errors
      let errorMessage = "Authentication failed"
      switch (oauthError) {
        case "oauth_cancelled":
          errorMessage = "Sign in was cancelled"
          break
        case "oauth_not_configured":
          errorMessage = "OAuth is not configured"
          break
        case "token_exchange_failed":
          errorMessage = "Failed to authenticate with Google"
          break
        case "user_info_failed":
          errorMessage = "Failed to get user information"
          break
        case "no_email":
          errorMessage = "No email address found"
          break
        case "oauth_failed":
          errorMessage = "Authentication failed"
          break
      }
      toast.error(errorMessage)
      
      // Remove error query param
      setTimeout(() => {
        router.replace("/")
      }, 2000)
    }
  }, [searchParams, router])

  return null
}

