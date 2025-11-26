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
      const searchLower = search.toLowerCase().trim();
      const matched = retailers.filter((r) => {
        const nameLower = r.name.toLowerCase();
        const idLower = r.id.toLowerCase();
        const websiteUrlLower = (r.website_url || '').toLowerCase();
        
        // 1. Exact match on name
        if (nameLower === searchLower) {
          console.log(`[Retailers API] Exact name match: "${r.name}"`);
          return true;
        }
        
        // 2. Exact match on ID
        if (idLower === searchLower) {
          console.log(`[Retailers API] Exact ID match: "${r.id}" (name: "${r.name}")`);
          return true;
        }
        
        // 3. Exact match on website URL domain (extract domain from URL)
        if (websiteUrlLower) {
          try {
            const url = new URL(websiteUrlLower);
            const domain = url.hostname.replace(/^www\./, ''); // Remove www.
            if (domain === searchLower || domain.includes(searchLower) || searchLower.includes(domain)) {
              console.log(`[Retailers API] Website URL match: "${r.website_url}" (domain: "${domain}")`);
              return true;
            }
          } catch (e) {
            // If URL parsing fails, try direct string match
            if (websiteUrlLower.includes(searchLower) || searchLower.includes(websiteUrlLower)) {
              console.log(`[Retailers API] Website URL string match: "${r.website_url}"`);
              return true;
            }
          }
        }
        
        // 4. Name contains search or search contains name
        if (nameLower.includes(searchLower) || searchLower.includes(nameLower)) {
          console.log(`[Retailers API] Name contains match: "${r.name}"`);
          return true;
        }
        
        // 5. ID contains search or search contains ID
        if (idLower.includes(searchLower) || searchLower.includes(idLower)) {
          console.log(`[Retailers API] ID contains match: "${r.id}" (name: "${r.name}")`);
          return true;
        }
        
        // 6. Word boundary match (split by dots, hyphens, spaces)
        // Remove common TLDs for better matching
        const searchWithoutTld = searchLower.replace(/\.(com|net|org|io|ge|co|app|dev)$/, '');
        const nameWithoutTld = nameLower.replace(/\.(com|net|org|io|ge|co|app|dev)$/, '');
        
        // Split by dots, hyphens, spaces
        const nameWords = nameWithoutTld.split(/[\s\-\.]+/).filter(w => w.length > 0);
        const searchWords = searchWithoutTld.split(/[\s\-\.]+/).filter(w => w.length > 0);
        const idWords = idLower.split(/[\s\-\.]+/).filter(w => w.length > 0);
        
        // Check if any search word matches any name word
        const nameWordMatch = nameWords.some(word => searchWords.includes(word)) ||
                             searchWords.some(word => nameWords.includes(word));
        
        // Check if any search word matches any ID word
        const idWordMatch = idWords.some(word => searchWords.includes(word)) ||
                           searchWords.some(word => idWords.includes(word));
        
        if (nameWordMatch) {
          console.log(`[Retailers API] Word boundary match (name): "${r.name}"`);
          return true;
        }
        
        if (idWordMatch) {
          console.log(`[Retailers API] Word boundary match (ID): "${r.id}" (name: "${r.name}")`);
          return true;
        }
        
        return false;
      });
      
      console.log(`[Retailers API] Search for "${search}": Found ${matched.length} matches`);
      if (matched.length > 0) {
        console.log(`[Retailers API] Matched retailers:`, matched.map(r => `${r.name} (ID: ${r.id})`).join(', '));
      } else {
        console.log(`[Retailers API] No matches found for "${search}".`);
        console.log(`[Retailers API] Sample retailers in DB:`, retailers.slice(0, 10).map(r => `${r.name} (ID: ${r.id})`).join(', '));
        console.log(`[Retailers API] All retailer names:`, retailers.map(r => r.name).join(', '));
        console.log(`[Retailers API] All retailer IDs:`, retailers.map(r => r.id).join(', '));
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

