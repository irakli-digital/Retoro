import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail, migrateAnonymousData, createMagicLinkToken } from "@/lib/queries";
import { generateMagicLinkToken } from "@/lib/auth-utils";
import { cookies } from "next/headers";

const ANONYMOUS_USER_COOKIE = "retoro_anonymous_user_id";

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

    // Migrate anonymous session data - check both request body and cookie
    const cookieStore = await cookies();
    const anonymousUserIdFromCookie = cookieStore.get(ANONYMOUS_USER_COOKIE)?.value;
    const anonymousUserIdToMigrate = anonymous_user_id || anonymousUserIdFromCookie;
    
    if (anonymousUserIdToMigrate) {
      const migratedCount = await migrateAnonymousData(anonymousUserIdToMigrate, userId);
      console.log(`[Magic Link Registration] Migrated ${migratedCount} items from anonymous session (${anonymousUserIdToMigrate}) to user ${userId}`);
      
      // Clear anonymous cookie after migration
      if (anonymousUserIdFromCookie) {
        cookieStore.delete(ANONYMOUS_USER_COOKIE);
      }
    } else {
      console.log(`[Magic Link Registration] No anonymous data to migrate for user ${userId}`);
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

