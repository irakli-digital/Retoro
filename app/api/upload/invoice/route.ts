import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth-server";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

const ANONYMOUS_USER_COOKIE = "retoro_anonymous_user_id";

/**
 * POST /api/upload/invoice - Upload invoice image and trigger n8n processing
 * 
 * This endpoint:
 * 1. Receives the invoice image
 * 2. Gets the user_id from session
 * 3. Calls n8n webhook to process the invoice
 * 4. Returns a job ID for status polling
 */
export async function POST(request: NextRequest) {
  try {
    // Get user ID from session (authenticated) or anonymous cookie
    let user_id = await getUserId();
    
    // If getUserId returned the demo user, try to get anonymous user ID from cookie
    if (user_id === "demo-user-123") {
      const cookieStore = await cookies();
      const anonymousUserId = cookieStore.get(ANONYMOUS_USER_COOKIE)?.value;
      
      if (anonymousUserId) {
        user_id = anonymousUserId;
      } else {
        // Generate a new anonymous user ID
        user_id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        
        // Set anonymous cookie
        cookieStore.set(ANONYMOUS_USER_COOKIE, user_id, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 365, // 1 year
        });
      }
    }

    if (!user_id || user_id === "demo-user-123") {
      return NextResponse.json(
        { error: "Unable to determine user session" },
        { status: 401 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("invoice") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type
    if (!file.type.startsWith("image/")) {
      return NextResponse.json(
        { error: "File must be an image" },
        { status: 400 }
      );
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    // Convert file to base64 for n8n webhook
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const base64Image = buffer.toString('base64');
    const dataUrl = `data:${file.type};base64,${base64Image}`;

    // Get n8n webhook URL from environment
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
    
    if (!n8nWebhookUrl) {
      console.error("N8N_WEBHOOK_URL not configured");
      return NextResponse.json(
        { error: "Invoice processing service not configured" },
        { status: 500 }
      );
    }

    // Generate job ID for tracking
    const jobId = `invoice_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    // Call n8n webhook with image and user_id
    const n8nResponse = await fetch(n8nWebhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        data: dataUrl,
        mimeType: file.type,
        user_id: user_id, // Pass user_id to n8n
        job_id: jobId,
      }),
    });

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error("N8N webhook error:", errorText);
      return NextResponse.json(
        { error: "Failed to process invoice" },
        { status: 500 }
      );
    }

    const n8nResult = await n8nResponse.json();

    // Return job ID and initial status
    return NextResponse.json({
      job_id: jobId,
      status: "processing",
      user_id: user_id,
      message: "Invoice is being processed",
      result: n8nResult, // Include n8n response for immediate results if available
    });
  } catch (error) {
    console.error("Error uploading invoice:", error);
    return NextResponse.json(
      { error: "Failed to upload invoice" },
      { status: 500 }
    );
  }
}

