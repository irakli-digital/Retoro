"use client"

import { useEffect, useState, Suspense } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { Loader2, CheckCircle2, XCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import axios from "axios"
import Link from "next/link"

function VerifyEmailContent() {
  const searchParams = useSearchParams()
  const token = searchParams.get("token")
  const router = useRouter()
  
  const [status, setStatus] = useState<"verifying" | "success" | "error">("verifying")
  const [errorMessage, setErrorMessage] = useState("")

  useEffect(() => {
    if (!token) {
      setStatus("error")
      setErrorMessage("No verification token provided.")
      return
    }

    const verifyEmail = async () => {
      try {
        // Call the API endpoint to verify
        await axios.get(`/api/auth/verify-email?token=${token}`)
        setStatus("success")
        // Optional: Redirect after a few seconds
        // setTimeout(() => router.push("/?verified=true"), 3000)
      } catch (error: any) {
        console.error("Verification error:", error)
        setStatus("error")
        setErrorMessage(error.response?.data?.error || "Verification failed. Link may be expired or invalid.")
      }
    }

    verifyEmail()
  }, [token, router])

  return (
    <Card className="ios-rounded max-w-md w-full mx-auto mt-8 shadow-lg">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl mb-2">Email Verification</CardTitle>
        <CardDescription>
          {status === "verifying" && "Please wait while we verify your email..."}
          {status === "success" && "Your email has been successfully verified!"}
          {status === "error" && "There was a problem verifying your email."}
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col items-center justify-center p-6 pt-0 space-y-6">
        {status === "verifying" && (
          <Loader2 className="h-16 w-16 text-primary animate-spin" />
        )}

        {status === "success" && (
          <>
            <CheckCircle2 className="h-16 w-16 text-green-500" />
            <div className="text-center space-y-2">
              <p className="text-muted-foreground">
                Your account is now active. You can access all features of Retoro.
              </p>
            </div>
            <Button asChild className="w-full ios-rounded bg-green-600 hover:bg-green-700">
              <Link href="/?verified=true">
                Go to Dashboard
              </Link>
            </Button>
          </>
        )}

        {status === "error" && (
          <>
            <XCircle className="h-16 w-16 text-destructive" />
            <p className="text-center text-destructive font-medium">
              {errorMessage}
            </p>
            <Button asChild variant="outline" className="w-full ios-rounded">
              <Link href="/">
                Return Home
              </Link>
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  )
}

export default function VerifyEmailPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-4 bg-muted/30">
      <Suspense fallback={
        <Card className="ios-rounded max-w-md w-full mx-auto p-8 flex justify-center">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
        </Card>
      }>
        <VerifyEmailContent />
      </Suspense>
    </div>
  )
}
