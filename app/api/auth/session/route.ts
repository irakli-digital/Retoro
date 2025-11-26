import { NextResponse } from "next/server";
import { getUserId } from "@/lib/auth";

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const userId = await getUserId();
    return NextResponse.json({ userId });
  } catch (error) {
    console.error("Error getting session:", error);
    return NextResponse.json(
      { error: "Failed to get session" },
      { status: 500 }
    );
  }
}

