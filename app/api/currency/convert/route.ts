import { NextRequest, NextResponse } from "next/server";
import { convertCurrency } from "@/lib/currency";

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const amount = parseFloat(searchParams.get("amount") || "0");
    const from = searchParams.get("from") || "USD";
    const to = searchParams.get("to") || "USD";

    if (isNaN(amount)) {
      return NextResponse.json(
        { error: "Invalid amount" },
        { status: 400 }
      );
    }

    const converted = await convertCurrency(amount, from, to);

    return NextResponse.json({
      amount,
      from,
      to,
      converted,
      rate: converted / amount,
    });
  } catch (error) {
    console.error("Currency conversion error:", error);
    return NextResponse.json(
      { error: "Failed to convert currency" },
      { status: 500 }
    );
  }
}

