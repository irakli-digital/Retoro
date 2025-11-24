import { NextRequest, NextResponse } from "next/server";
import { addReturnItem } from "@/lib/queries";
import { calculateDeadline } from "@/lib/return-logic";
import { getRetailerPolicy } from "@/lib/queries";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { retailer_id, name, price, purchase_date, user_id } = body;

    if (!retailer_id || !purchase_date || !user_id) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
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
      { error: "Failed to add return item" },
      { status: 500 }
    );
  }
}

