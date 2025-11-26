import { NextRequest, NextResponse } from "next/server";
import { getRetailerPolicy, updateRetailerPolicy } from "@/lib/queries";

/**
 * GET /api/retailers/[id] - Get a specific retailer
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const retailer = await getRetailerPolicy(params.id);
    
    if (!retailer) {
      return NextResponse.json(
        { error: "Retailer not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(retailer);
  } catch (error) {
    console.error("Error fetching retailer:", error);
    return NextResponse.json(
      { error: "Failed to fetch retailer" },
      { status: 500 }
    );
  }
}

/**
 * PUT /api/retailers/[id] - Update a retailer policy
 * Used by N8N policy verification flow
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Verify API key for N8N requests
    const apiKey = request.headers.get("X-API-Key");
    if (apiKey !== process.env.RETORO_API_KEY) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { return_window_days, has_free_returns, policy_description, website_url } = body;

    // Validate that at least one field is provided
    if (
      return_window_days === undefined &&
      has_free_returns === undefined &&
      policy_description === undefined &&
      website_url === undefined
    ) {
      return NextResponse.json(
        { error: "At least one field must be provided for update" },
        { status: 400 }
      );
    }

    // Validate return_window_days if provided
    if (return_window_days !== undefined && (typeof return_window_days !== 'number' || return_window_days < 0)) {
      return NextResponse.json(
        { error: "return_window_days must be a non-negative number" },
        { status: 400 }
      );
    }

    // Update retailer
    const updatedRetailer = await updateRetailerPolicy(params.id, {
      return_window_days,
      has_free_returns,
      policy_description,
      website_url,
    });

    return NextResponse.json(updatedRetailer);
  } catch (error: any) {
    console.error("Error updating retailer:", error);
    
    if (error.message === "Retailer not found") {
      return NextResponse.json(
        { error: "Retailer not found" },
        { status: 404 }
      );
    }
    
    return NextResponse.json(
      { error: "Failed to update retailer" },
      { status: 500 }
    );
  }
}

