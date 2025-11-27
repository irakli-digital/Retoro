import { NextRequest, NextResponse } from "next/server";
import { 
  getReturnItemById, 
  updateReturnStatus, 
  deleteReturnItem,
  getRetailerPolicy,
  updateReturnItem
} from "@/lib/queries";
import { calculateDeadline } from "@/lib/return-logic";
import { getUserId } from "@/lib/auth-server";
import { cookies } from "next/headers";
import { isValidCurrency, getCurrencySymbol, convertCurrency } from "@/lib/currency";

export const dynamic = 'force-dynamic';

const ANONYMOUS_USER_COOKIE = "retoro_anonymous_user_id";

// GET single return item
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const item = await getReturnItemById(params.id);
    
    if (!item) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(item);
  } catch (error) {
    console.error("Error fetching return item:", error);
    return NextResponse.json(
      { error: "Failed to fetch return item" },
      { status: 500 }
    );
  }
}

// PUT update return item
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { retailer_id, name, price, purchase_date, user_id, currency: original_currency, currency_symbol } = body;

    if (!retailer_id || !purchase_date || !user_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Verify item exists and belongs to user
    const existingItem = await getReturnItemById(params.id);
    if (!existingItem) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    if (existingItem.user_id !== user_id) {
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
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

    // Calculate new deadline
    const purchaseDate = new Date(purchase_date);
    const returnDeadline = calculateDeadline(purchaseDate, policy);

    // Handle currency if provided
    let currency = existingItem.original_currency;
    let finalCurrencySymbol = existingItem.currency_symbol || '';
    let price_usd = existingItem.price_usd;
    
    if (original_currency) {
      currency = isValidCurrency(original_currency) ? original_currency.toUpperCase() : currency;
      finalCurrencySymbol = currency_symbol !== undefined ? currency_symbol : getCurrencySymbol(currency);
      
      // Recalculate price_usd if currency changed
      if (price !== null && price !== undefined) {
        if (currency === 'USD') {
          price_usd = price;
        } else {
          try {
            price_usd = await convertCurrency(price, currency, 'USD');
          } catch (error) {
            console.error(`[Return Items PUT] Currency conversion failed:`, error);
            price_usd = price; // Fallback
          }
        }
      }
    } else if (currency_symbol !== undefined) {
      finalCurrencySymbol = currency_symbol || '';
    }

    const updatedItem = await updateReturnItem(params.id, user_id, {
      retailer_id,
      name: name || null,
      price: price || null,
      original_currency: original_currency ? currency : undefined,
      price_usd: price_usd,
      currency_symbol: finalCurrencySymbol,
      purchase_date: purchaseDate,
      return_deadline: returnDeadline
    });

    return NextResponse.json(updatedItem);
  } catch (error) {
    console.error("Error updating return item:", error);
    return NextResponse.json(
      { error: "Failed to update return item" },
      { status: 500 }
    );
  }
}

// PATCH mark as returned/kept
export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const body = await request.json();
    const { is_returned, user_id: provided_user_id } = body;

    if (typeof is_returned !== "boolean") {
      return NextResponse.json(
        { error: "Missing required field: is_returned" },
        { status: 400 }
      );
    }

    // Get user ID - prioritize authenticated session over provided user_id
    let user_id = await getUserId();
    
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("retoro_session")?.value;
    
    console.log("[Return Items PATCH] User ID check:", {
      userIdFromGetUserId: user_id,
      providedUserId: provided_user_id,
      hasSessionToken: !!sessionToken,
    });
    
    // If user is not authenticated, use provided user_id or anonymous cookie
    if (!user_id) {
      if (provided_user_id) {
        user_id = provided_user_id;
        console.log("[Return Items PATCH] Using provided user_id (anonymous):", user_id);
      } else {
        // Try anonymous cookie
        const anonymousUserId = cookieStore.get(ANONYMOUS_USER_COOKIE)?.value;
        if (anonymousUserId) {
          user_id = anonymousUserId;
          console.log("[Return Items PATCH] Using anonymous user ID from cookie:", user_id);
        } else {
          return NextResponse.json(
            { error: "User ID required" },
            { status: 401 }
          );
        }
      }
    } else {
      console.log("[Return Items PATCH] ✅ Using authenticated user ID:", user_id);
      // User is authenticated - always use their real user ID, ignore provided_user_id
    }

    if (!user_id) {
      return NextResponse.json(
        { error: "Unable to determine user session" },
        { status: 401 }
      );
    }

    // Verify item exists and belongs to user
    const existingItem = await getReturnItemById(params.id);
    if (!existingItem) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    if (existingItem.user_id !== user_id) {
      console.error("[Return Items PATCH] Unauthorized:", {
        itemUserId: existingItem.user_id,
        requestUserId: user_id,
      });
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    const returnedDate = is_returned ? new Date() : null;
    await updateReturnStatus(params.id, is_returned, returnedDate);

    console.log("[Return Items PATCH] ✅ Successfully updated return status:", {
      itemId: params.id,
      isReturned: is_returned,
      userId: user_id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating return status:", error);
    return NextResponse.json(
      { error: "Failed to update return status" },
      { status: 500 }
    );
  }
}

// DELETE return item
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const provided_user_id = searchParams.get("user_id");

    // Get user ID - prioritize authenticated session over provided user_id
    let user_id = await getUserId();
    
    const cookieStore = await cookies();
    const sessionToken = cookieStore.get("retoro_session")?.value;
    
    console.log("[Return Items DELETE] User ID check:", {
      userIdFromGetUserId: user_id,
      providedUserId: provided_user_id,
      hasSessionToken: !!sessionToken,
    });
    
    // If user is not authenticated, use provided user_id or anonymous cookie
    if (!user_id) {
      if (provided_user_id) {
        user_id = provided_user_id;
        console.log("[Return Items DELETE] Using provided user_id (anonymous):", user_id);
      } else {
        // Try anonymous cookie
        const anonymousUserId = cookieStore.get(ANONYMOUS_USER_COOKIE)?.value;
        if (anonymousUserId) {
          user_id = anonymousUserId;
          console.log("[Return Items DELETE] Using anonymous user ID from cookie:", user_id);
        } else {
          return NextResponse.json(
            { error: "User ID required" },
            { status: 401 }
          );
        }
      }
    } else {
      console.log("[Return Items DELETE] ✅ Using authenticated user ID:", user_id);
      // User is authenticated - always use their real user ID, ignore provided_user_id
    }

    if (!user_id) {
      return NextResponse.json(
        { error: "Unable to determine user session" },
        { status: 401 }
      );
    }

    // Verify item exists and belongs to user
    const existingItem = await getReturnItemById(params.id);
    if (!existingItem) {
      return NextResponse.json(
        { error: "Item not found" },
        { status: 404 }
      );
    }

    if (existingItem.user_id !== user_id) {
      console.error("[Return Items DELETE] Unauthorized:", {
        itemUserId: existingItem.user_id,
        requestUserId: user_id,
      });
      return NextResponse.json(
        { error: "Unauthorized" },
        { status: 403 }
      );
    }

    await deleteReturnItem(params.id, user_id);

    console.log("[Return Items DELETE] ✅ Successfully deleted item:", {
      itemId: params.id,
      userId: user_id,
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting return item:", error);
    return NextResponse.json(
      { error: "Failed to delete return item" },
      { status: 500 }
    );
  }
}