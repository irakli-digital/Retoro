import { NextRequest, NextResponse } from "next/server";
import { getUserId } from "@/lib/auth-server";
import { updateUserPreferredCurrency } from "@/lib/queries";
import { isValidCurrency } from "@/lib/currency";

export const dynamic = 'force-dynamic';

export async function PUT(request: NextRequest) {
  try {
    const userId = await getUserId();
    
    if (userId === "demo-user-123") {
      return NextResponse.json(
        { error: "Authentication required" },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { currency } = body;

    if (!currency || !isValidCurrency(currency)) {
      return NextResponse.json(
        { error: "Valid currency code is required (e.g., USD, EUR, GEL)" },
        { status: 400 }
      );
    }

    await updateUserPreferredCurrency(userId, currency.toUpperCase());

    return NextResponse.json({ 
      success: true, 
      currency: currency.toUpperCase() 
    });
  } catch (error) {
    console.error("Error updating currency preference:", error);
    return NextResponse.json(
      { error: "Failed to update currency preference" },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const userId = await getUserId();
    
    if (userId === "demo-user-123") {
      // Return default for anonymous users
      return NextResponse.json({ currency: "USD" });
    }

    const { getUserById } = await import("@/lib/queries");
    const user = await getUserById(userId);

    return NextResponse.json({ 
      currency: user?.preferred_currency || "USD" 
    });
  } catch (error) {
    console.error("Error getting currency preference:", error);
    return NextResponse.json(
      { error: "Failed to get currency preference" },
      { status: 500 }
    );
  }
}

