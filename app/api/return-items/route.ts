import { NextRequest, NextResponse } from "next/server";
import { addReturnItem } from "@/lib/queries";
import { calculateDeadline } from "@/lib/return-logic";
import { getRetailerPolicy } from "@/lib/queries";
import { getUserId } from "@/lib/auth-server";
import { cookies } from "next/headers";

export const dynamic = 'force-dynamic';

const ANONYMOUS_USER_COOKIE = "retoro_anonymous_user_id";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { retailer_id, name, price, purchase_date, user_id: provided_user_id } = body;

    if (!retailer_id || !purchase_date) {
      return NextResponse.json(
        { error: "Missing required fields: retailer_id and purchase_date" },
        { status: 400 }
      );
    }

    // Get user ID - prioritize session over provided user_id from n8n
    // This ensures logged-in users always use their authenticated ID
    let user_id = await getUserId();
    
    console.log("[Return Items] User ID from session:", user_id);
    console.log("[Return Items] Provided user_id from n8n:", provided_user_id);
    
    // If user is not authenticated (demo-user-123), use the provided user_id from n8n
    // This handles anonymous users who uploaded invoices
    if (user_id === "demo-user-123") {
      if (provided_user_id) {
        user_id = provided_user_id;
        console.log("[Return Items] Using provided user_id from n8n (anonymous):", user_id);
      } else {
        // No provided user_id and no session - try anonymous cookie
        const cookieStore = await cookies();
        const anonymousUserId = cookieStore.get(ANONYMOUS_USER_COOKIE)?.value;
        
        if (anonymousUserId) {
          user_id = anonymousUserId;
          console.log("[Return Items] Using anonymous user ID from cookie:", user_id);
        } else {
          // Generate a new anonymous user ID
          user_id = `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
          console.log("[Return Items] Generated new anonymous user ID:", user_id);
          
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
    } else {
      console.log("[Return Items] Using authenticated user ID:", user_id);
      // User is authenticated - always use their real user ID, ignore provided_user_id
      // This ensures items created via n8n are associated with the logged-in user
    }

    if (!user_id || user_id === "demo-user-123") {
      console.error("[Return Items] Failed to determine user_id");
      return NextResponse.json(
        { error: "Unable to determine user session" },
        { status: 401 }
      );
    }
    
    console.log("[Return Items] Final user_id for creating return item:", user_id);

    // Get retailer policy
    const policy = await getRetailerPolicy(retailer_id);
    if (!policy) {
      return NextResponse.json(
        { error: "Retailer not found" },
        { status: 404 }
      );
    }

    // Calculate deadline
    const purchaseDate = new Date(purchase_date);
    const returnDeadline = calculateDeadline(purchaseDate, policy);

    // Add return item
    const item = await addReturnItem({
      retailer_id,
      name: name || null,
      price: price || null,
      purchase_date: purchaseDate,
      return_deadline: returnDeadline,
      is_returned: false,
      returned_date: null,
      user_id,
    });

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error adding return item:", error);
    return NextResponse.json(
      { error: "Failed to add return item", details: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    );
  }
}

