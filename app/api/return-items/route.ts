import { NextRequest, NextResponse } from "next/server";
import { addReturnItem } from "@/lib/queries";
import { calculateDeadline } from "@/lib/return-logic";
import { getRetailerPolicy } from "@/lib/queries";
import { getUserId } from "@/lib/auth-server";
import { cookies } from "next/headers";
import { convertCurrency, isValidCurrency, getCurrencySymbol } from "@/lib/currency";

export const dynamic = 'force-dynamic';

const ANONYMOUS_USER_COOKIE = "retoro_anonymous_user_id";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { 
      retailer_id, 
      name, 
      price, 
      purchase_date, 
      user_id: provided_user_id,
      currency: original_currency = 'USD', // Default to USD if not provided
      currency_symbol = '' // Currency symbol from n8n (e.g., '$', '€', '₾', '₹')
    } = body;

    if (!retailer_id || !purchase_date) {
      return NextResponse.json(
        { error: "Missing required fields: retailer_id and purchase_date" },
        { status: 400 }
      );
    }

    // Get user ID - prioritize session over provided user_id from n8n
    let user_id = await getUserId();
    
    const cookieStore = await cookies();
    
    // If no authenticated user, handle anonymous/provided ID
    if (!user_id) {
      // User is NOT authenticated - use provided user_id from n8n or anonymous cookie
      if (provided_user_id) {
        user_id = provided_user_id;
        console.log("[Return Items] Using provided user_id from n8n (anonymous):", user_id);
      } else {
        // No provided user_id and no session - try anonymous cookie
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
      console.log("[Return Items] ✅ Using authenticated user ID:", user_id);
      // We do NOT delete the anonymous cookie here.
      // It will be handled by the login/registration endpoints upon migration.
    }

    if (!user_id) {
      // This should theoretically not be reached due to the generation logic above,
      // but strictly typing requires us to handle it.
      console.error("[Return Items] Failed to determine user_id");
      return NextResponse.json(
        { error: "Unable to determine user session" },
        { status: 500 }
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

    // Validate and normalize currency
    const currency = isValidCurrency(original_currency) ? original_currency.toUpperCase() : 'USD';
    
    // Derive currency_symbol from currency if not provided
    const finalCurrencySymbol = currency_symbol || getCurrencySymbol(currency);
    
    // Convert price to USD if needed
    let price_usd: number | null = null;
    if (price !== null && price !== undefined) {
      if (currency === 'USD') {
        price_usd = price;
      } else {
        try {
          price_usd = await convertCurrency(price, currency, 'USD');
          console.log(`[Return Items] Converted ${price} ${currency} to ${price_usd} USD`);
        } catch (error) {
          console.error(`[Return Items] Currency conversion failed:`, error);
          // If conversion fails, store original price as USD (fallback)
          price_usd = price;
        }
      }
    }

    // Add return item
    const item = await addReturnItem({
      retailer_id,
      name: name || null,
      price: price || null,
      original_currency: currency,
      price_usd: price_usd,
      currency_symbol: finalCurrencySymbol,
      purchase_date: purchaseDate,
      return_deadline: returnDeadline,
      is_returned: false,
      returned_date: null,
      user_id,
    });

    console.log("[Return Items] ✅ Successfully created item:", item.id);
    
    return NextResponse.json({
      ...item,
      user_id, // Include user_id in response for debugging
    });
  } catch (error) {
    console.error("[Return Items] ❌ Error adding return item:", error);
    return NextResponse.json(
      { 
        error: "Failed to add return item", 
        details: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    );
  }
}