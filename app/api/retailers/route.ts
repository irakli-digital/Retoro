import { NextRequest, NextResponse } from "next/server";
import { getAllRetailerPolicies } from "@/lib/queries";
import { neon } from "@neondatabase/serverless";

export async function GET() {
  try {
    const retailers = await getAllRetailerPolicies();
    return NextResponse.json(retailers);
  } catch (error) {
    console.error("Error fetching retailers:", error);
    return NextResponse.json(
      { error: "Failed to fetch retailers" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, return_window_days, website_url, has_free_returns } = body;

    if (!name || return_window_days === undefined) {
      return NextResponse.json(
        { error: "Name and return window days are required" },
        { status: 400 }
      );
    }

    // Generate ID from name (lowercase, replace spaces with hyphens)
    const id = name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    
    const sql = neon(process.env.DATABASE_URL!);
    
    // Check if retailer already exists
    const existing = await sql`
      SELECT id FROM retailer_policies WHERE id = ${id} OR LOWER(name) = LOWER(${name})
    `;
    
    if (existing.length > 0) {
      return NextResponse.json(
        { error: "Retailer already exists", retailer_id: existing[0].id },
        { status: 409 }
      );
    }

    // Insert new retailer
    const result = await sql`
      INSERT INTO retailer_policies (id, name, return_window_days, website_url, has_free_returns)
      VALUES (${id}, ${name}, ${return_window_days}, ${website_url || null}, ${has_free_returns || false})
      RETURNING *
    `;

    return NextResponse.json(result[0], { status: 201 });
  } catch (error: any) {
    console.error("Error adding retailer:", error);
    if (error.code === "23505") {
      // Unique constraint violation
      return NextResponse.json(
        { error: "Retailer already exists" },
        { status: 409 }
      );
    }
    return NextResponse.json(
      { error: "Failed to add retailer" },
      { status: 500 }
    );
  }
}

