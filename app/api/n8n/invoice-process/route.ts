import { NextRequest, NextResponse } from "next/server";

/**
 * Webhook endpoint for N8N Invoice Scraper flow
 * This endpoint receives requests from N8N when processing invoice images
 * 
 * Authentication: Requires X-API-Key header matching RETORO_API_KEY env var
 */
export async function POST(request: NextRequest) {
  try {
    // Verify API key
    const apiKey = request.headers.get("X-API-Key");
    if (apiKey !== process.env.RETORO_API_KEY) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { image_url, user_id } = body;

    if (!image_url || !user_id) {
      return NextResponse.json(
        { error: "image_url and user_id are required" },
        { status: 400 }
      );
    }

    // This endpoint receives the request and can trigger N8N webhook
    // The actual processing happens in N8N, which will call back to create return items
    // For now, we just validate and return success
    // In a real implementation, you might want to:
    // 1. Store the processing request in a queue
    // 2. Return a job ID for tracking
    // 3. Have N8N poll or use webhook to get the job

    console.log(`Invoice processing requested: ${image_url} for user ${user_id}`);

    return NextResponse.json({
      success: true,
      message: "Invoice processing started",
      // In production, return a job ID for tracking
      // job_id: jobId
    });
  } catch (error) {
    console.error("Error processing invoice request:", error);
    return NextResponse.json(
      { error: "Failed to process invoice request" },
      { status: 500 }
    );
  }
}

