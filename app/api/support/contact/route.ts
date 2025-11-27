import { NextRequest, NextResponse } from "next/server"
import { getUserId, getCurrentUser } from "@/lib/auth-server"
import { getUserById } from "@/lib/queries"

export const dynamic = 'force-dynamic'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { subject, message, email: providedEmail } = body

    if (!subject || !message) {
      return NextResponse.json(
        { error: "Subject and message are required" },
        { status: 400 }
      )
    }

    // Get user information
    const userId = await getUserId()
    const currentUser = await getCurrentUser()
    
    let userEmail = providedEmail
    let userName = null

    if (currentUser) {
      const user = await getUserById(userId)
      if (user) {
        userEmail = userEmail || user.email
        userName = user.name
      }
    }

    // In a real application, you would:
    // 1. Send an email to support@retoro.app with the message
    // 2. Store the support request in a database
    // 3. Send a confirmation email to the user
    
    // For now, we'll just log it and return success
    console.log("Support Request Received:", {
      userId: userId !== "demo-user-123" ? userId : "anonymous",
      userName,
      email: userEmail,
      subject,
      message,
      timestamp: new Date().toISOString(),
    })

    // TODO: Implement actual email sending service (e.g., SendGrid, Resend, etc.)
    // TODO: Store support requests in database for tracking

    return NextResponse.json({
      success: true,
      message: "Support request received successfully",
    })
  } catch (error) {
    console.error("Error processing support request:", error)
    return NextResponse.json(
      { error: "Failed to process support request" },
      { status: 500 }
    )
  }
}

