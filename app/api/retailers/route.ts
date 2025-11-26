import { NextRequest, NextResponse } from "next/server";
import { getAllRetailerPolicies } from "@/lib/queries";
import { neon } from "@neondatabase/serverless";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get("search");
    const name = searchParams.get("name");
    
    let retailers = await getAllRetailerPolicies();
    
    // Debug logging
    console.log(`[Retailers API] Search: "${search}", Name: "${name}", Total retailers: ${retailers.length}`);
    
    // If name parameter provided, do exact match (for e-commerce checker)
    if (name) {
      const matched = retailers.find(
        (r) => r.name.toLowerCase() === name.toLowerCase()
      );
      console.log(`[Retailers API] Name search for "${name}": ${matched ? 'Found' : 'Not found'}`);
      return NextResponse.json(matched ? [matched] : []);
    }
    
    // If search parameter provided, do fuzzy search (for invoice scraper)
    if (search) {
      const searchLower = search.toLowerCase();
      const matched = retailers.filter((r) => {
        const nameLower = r.name.toLowerCase();
        // Exact match
        if (nameLower === searchLower) return true;
        // Contains match
        if (nameLower.includes(searchLower) || searchLower.includes(nameLower)) return true;
        // Word boundary match (e.g., "amazon" matches "Amazon.com")
        const nameWords = nameLower.split(/[\s\-\.]+/);
        const searchWords = searchLower.split(/[\s\-\.]+/);
        return nameWords.some(word => searchWords.includes(word)) ||
               searchWords.some(word => nameWords.includes(word));
      });
      console.log(`[Retailers API] Search for "${search}": Found ${matched.length} matches`);
      if (matched.length > 0) {
        console.log(`[Retailers API] Matched retailers:`, matched.map(r => r.name).join(', '));
      } else {
        console.log(`[Retailers API] No matches found for "${search}". Available retailers:`, retailers.slice(0, 10).map(r => r.name).join(', '));
      }
      // Return array (n8n will handle empty arrays if "Always Output Data" is enabled)
      return NextResponse.json(matched);
    }
    
    // Return all retailers if no search/filter
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

