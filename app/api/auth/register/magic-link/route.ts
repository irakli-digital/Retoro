import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail, migrateAnonymousData, createMagicLinkToken } from "@/lib/queries";
import { generateMagicLinkToken } from "@/lib/auth-utils";

// Magic link tokens table (we'll create this in schema)
// For MVP, we'll use a simple approach with expiration

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, name, anonymous_user_id } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    // Check if user already exists
    let userId: string;
    const existingUser = await getUserByEmail(email);
    
    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create user
      userId = await createUser(email, name || null, null, false);
    }

    // Migrate anonymous session data if provided
    if (anonymous_user_id) {
      const migratedCount = await migrateAnonymousData(anonymous_user_id, userId);
      console.log(`Migrated ${migratedCount} items from anonymous session`);
    }

    // Generate magic link token
    const token = generateMagicLinkToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiration

    // Store token in database
    await createMagicLinkToken(userId, token, expiresAt);

    // TODO: Send magic link email with token
    // For MVP, we'll log it for development
    const magicLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/verify?token=${token}`;

    console.log(`Magic link for ${email}: ${magicLink}`); // Remove in production

    return NextResponse.json({
      success: true,
      userId,
      message: "Magic link sent to your email!",
      // Remove this in production - only for development
      magicLink: process.env.NODE_ENV === "development" ? magicLink : undefined,
    });
  } catch (error) {
    console.error("Magic link error:", error);
    return NextResponse.json(
      { error: "Failed to send magic link" },
      { status: 500 }
    );
  }
}

