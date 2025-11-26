import { NextRequest, NextResponse } from "next/server";
import { 
  getReturnItemById, 
  updateReturnStatus, 
  deleteReturnItem,
  getRetailerPolicy 
} from "@/lib/queries";
import { calculateDeadline } from "@/lib/return-logic";

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
    const { retailer_id, name, price, purchase_date, user_id } = body;

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

    // Update item (we'll need to add an updateReturnItem function)
    // For now, we'll use a direct SQL update
    const { neon } = await import("@neondatabase/serverless");
    const sql = neon(process.env.DATABASE_URL!);
    
    const result = await sql`
      UPDATE return_items
      SET 
        retailer_id = ${retailer_id},
        name = ${name || null},
        price = ${price || null},
        purchase_date = ${purchaseDate.toISOString()},
        return_deadline = ${returnDeadline.toISOString()},
        updated_at = NOW()
      WHERE id = ${params.id} AND user_id = ${user_id}
      RETURNING *
    `;

    if (result.length === 0) {
      return NextResponse.json(
        { error: "Failed to update item" },
        { status: 500 }
      );
    }

    return NextResponse.json(result[0]);
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
    const { is_returned, user_id } = body;

    if (typeof is_returned !== "boolean" || !user_id) {
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

    const returnedDate = is_returned ? new Date() : null;
    await updateReturnStatus(params.id, is_returned, returnedDate);

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
    const user_id = searchParams.get("user_id");

    if (!user_id) {
      return NextResponse.json(
        { error: "User ID required" },
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

    await deleteReturnItem(params.id, user_id);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error deleting return item:", error);
    return NextResponse.json(
      { error: "Failed to delete return item" },
      { status: 500 }
    );
  }
}

