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

    // Get user ID - use provided user_id (from n8n) or get from session/cookie
    let user_id = provided_user_id;
    
    // If no user_id provided (e.g., from web UI), get from session
    if (!user_id) {
      user_id = await getUserId();
    }
    
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
          httpOnly: false, // Allow client-side access for anonymous sessions
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

