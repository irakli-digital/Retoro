import { NextRequest, NextResponse } from "next/server";
import { getAllRetailerPolicies, getRetailerPolicy } from "@/lib/queries";

export const dynamic = 'force-dynamic';

/**
 * Webhook endpoint for N8N E-commerce Checker flow
 * This endpoint receives requests from N8N when checking if a retailer exists
 * 
 * Authentication: Requires X-API-Key header matching RETORO_API_KEY env var
 */
export async function GET(request: NextRequest) {
  try {
    // Verify API key
    const apiKey = request.headers.get("X-API-Key");
    if (apiKey !== process.env.RETORO_API_KEY) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    // Get retailer name from query params
    const { searchParams } = new URL(request.url);
    const retailerName = searchParams.get("name");

    if (!retailerName) {
      return NextResponse.json(
        { error: "Retailer name is required" },
        { status: 400 }
      );
    }

    // Check if retailer exists (case-insensitive search)
    const allRetailers = await getAllRetailerPolicies();
    const matchedRetailer = allRetailers.find(
      (r) => r.name.toLowerCase() === retailerName.toLowerCase()
    );

    if (matchedRetailer) {
      return NextResponse.json([matchedRetailer]);
    }

    // Return empty array if not found
    return NextResponse.json([]);
  } catch (error) {
    console.error("Error checking retailer:", error);
    return NextResponse.json(
      { error: "Failed to check retailer" },
      { status: 500 }
    );
  }
}

/**
 * Webhook endpoint for N8N E-commerce Checker flow
 * This endpoint receives the final result from N8N after processing
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
    const { retailer_id, retailer_name, user_id, status } = body;

    // This endpoint can be used to notify users or log the result
    // For now, just return success
    console.log(`E-commerce check completed: ${retailer_name} - ${status}`);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error processing e-commerce check result:", error);
    return NextResponse.json(
      { error: "Failed to process result" },
      { status: 500 }
    );
  }
}

