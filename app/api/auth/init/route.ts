import { NextResponse } from "next/server";
import { cookies } from "next/headers";

const USER_ID_COOKIE = "retoro_user_id";

export async function GET() {
  try {
    const cookieStore = await cookies();
    let userId = cookieStore.get(USER_ID_COOKIE)?.value;

    if (!userId) {
      // Generate a new user ID (UUID-like)
      userId = `user_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`;
      
      // Set cookie
      cookieStore.set(USER_ID_COOKIE, userId, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 60 * 60 * 24 * 365, // 1 year
      });
    }

    return NextResponse.json({ userId });
  } catch (error) {
    console.error("Error initializing session:", error);
    return NextResponse.json(
      { error: "Failed to initialize session" },
      { status: 500 }
    );
  }
}

