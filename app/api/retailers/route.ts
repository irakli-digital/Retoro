import { NextResponse } from "next/server";
import { getAllRetailerPolicies } from "@/lib/queries";

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

