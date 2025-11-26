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
    
    console.log("[Invoice Upload] Initial user_id from getUserId():", user_id);
    
    // If getUserId returned the demo user, try to get anonymous user ID from cookie
    if (user_id === "demo-user-123") {
      const cookieStore = await cookies();
      const anonymousUserId = cookieStore.get(ANONYMOUS_USER_COOKIE)?.value;
      
      if (anonymousUserId) {
        user_id = anonymousUserId;
        console.log("[Invoice Upload] Using anonymous user ID from cookie:", user_id);
      } else {
        // Generate a new anonymous user ID
        user_id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
        
        console.log("[Invoice Upload] Generated new anonymous user ID:", user_id);
        
        // Set anonymous cookie
        cookieStore.set(ANONYMOUS_USER_COOKIE, user_id, {
          httpOnly: false,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          path: "/",
          maxAge: 60 * 60 * 24 * 365, // 1 year
        });
      }
    } else {
      console.log("[Invoice Upload] Using authenticated user ID:", user_id);
    }

    if (!user_id || user_id === "demo-user-123") {
      console.error("[Invoice Upload] Failed to determine user_id");
      return NextResponse.json(
        { error: "Unable to determine user session" },
        { status: 401 }
      );
    }
    
    console.log("[Invoice Upload] Final user_id being sent to n8n:", user_id);

    const formData = await request.formData();
    const file = formData.get("invoice") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    // Validate file type - accept images, PDFs, and common document formats
    const allowedTypes = [
      "image/", // All image types (jpeg, png, gif, webp, etc.)
      "application/pdf", // PDF files
      "application/msword", // .doc
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document", // .docx
    ];
    
    const isValidType = allowedTypes.some(type => file.type.startsWith(type) || file.type === type);
    
    if (!isValidType) {
      return NextResponse.json(
        { error: "File must be an image, PDF, or document (PDF, DOC, DOCX)" },
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

    // Get n8n webhook URL from environment
    const n8nWebhookUrl = process.env.N8N_WEBHOOK_URL || process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL;
    
    console.log("[Invoice Upload] Environment check:", {
      hasN8N_WEBHOOK_URL: !!process.env.N8N_WEBHOOK_URL,
      hasNEXT_PUBLIC_N8N_WEBHOOK_URL: !!process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL,
      webhookUrl: n8nWebhookUrl ? `${n8nWebhookUrl.substring(0, 30)}...` : "NOT SET",
    });
    
    if (!n8nWebhookUrl || n8nWebhookUrl.includes("your-n8n-instance.com")) {
      console.error("[Invoice Upload] N8N_WEBHOOK_URL not configured or is placeholder");
      return NextResponse.json(
        { error: "Invoice processing service not configured. Please contact support." },
        { status: 500 }
      );
    }

    // Generate job ID for tracking
    const jobId = `invoice_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;

    // Read file as buffer for binary upload
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    console.log("[Invoice Upload] Calling n8n webhook:", {
      url: n8nWebhookUrl,
      jobId,
      userId: user_id,
      fileSize: file.size,
      fileType: file.type,
    });

    // Call n8n webhook with binary file data (image, PDF, or document)
    // n8n webhook with binaryData: true expects the binary data in the body
    // Pass metadata via query parameters (accessible in n8n via $json.query)
    const webhookUrl = new URL(n8nWebhookUrl);
    webhookUrl.searchParams.append("user_id", user_id);
    webhookUrl.searchParams.append("job_id", jobId);
    webhookUrl.searchParams.append("mimeType", file.type);
    
    console.log("[Invoice Upload] Sending binary data:", {
      contentType: file.type,
      fileName: file.name,
      bufferLength: buffer.length,
      bufferType: Buffer.isBuffer(buffer) ? "Buffer" : typeof buffer,
      fileType: file.type.startsWith("image/") ? "image" : file.type === "application/pdf" ? "pdf" : "document",
      userId: user_id,
      webhookUrl: webhookUrl.toString().substring(0, 100) + "...",
    });

    let n8nResponse;
    try {
      n8nResponse = await fetch(webhookUrl.toString(), {
        method: "POST",
        headers: {
          "Content-Type": file.type, // Set file content type (e.g., image/jpeg, application/pdf)
        },
        body: buffer, // Send raw binary file data (Buffer)
        // Add timeout to prevent hanging
        signal: AbortSignal.timeout(60000), // 60 second timeout
      });
      
      console.log("[Invoice Upload] Request sent, response headers:", {
        contentType: n8nResponse.headers.get("content-type"),
        status: n8nResponse.status,
      });
    } catch (fetchError: any) {
      console.error("[Invoice Upload] Fetch error:", {
        error: fetchError.message,
        name: fetchError.name,
        code: fetchError.code,
      });
      
      if (fetchError.name === 'AbortError') {
        return NextResponse.json(
          { error: "Invoice processing timed out. Please try again." },
          { status: 504 }
        );
      }
      
      return NextResponse.json(
        { error: `Failed to connect to invoice processing service: ${fetchError.message}` },
        { status: 500 }
      );
    }

    console.log("[Invoice Upload] N8N response status:", n8nResponse.status);

    if (!n8nResponse.ok) {
      const errorText = await n8nResponse.text();
      console.error("[Invoice Upload] N8N webhook error:", {
        status: n8nResponse.status,
        statusText: n8nResponse.statusText,
        error: errorText,
      });
      return NextResponse.json(
        { error: `Invoice processing failed: ${n8nResponse.statusText}` },
        { status: 500 }
      );
    }

    let n8nResult;
    try {
      n8nResult = await n8nResponse.json();
      console.log("[Invoice Upload] N8N result received:", {
        hasResult: !!n8nResult,
        itemsCreated: n8nResult?.items_created?.length || 0,
      });
    } catch (jsonError: any) {
      console.error("[Invoice Upload] Failed to parse n8n response:", jsonError);
      // Still return success if webhook was called successfully
      n8nResult = { message: "Invoice processing initiated" };
    }

    // Return job ID and initial status
    return NextResponse.json({
      job_id: jobId,
      status: "processing",
      user_id: user_id,
      message: "Invoice is being processed",
      result: n8nResult, // Include n8n response for immediate results if available
    });
  } catch (error: any) {
    console.error("[Invoice Upload] Unexpected error:", {
      error: error.message,
      stack: error.stack,
      name: error.name,
    });
    return NextResponse.json(
      { error: `Failed to upload invoice: ${error.message || "Unknown error"}` },
      { status: 500 }
    );
  }
}

