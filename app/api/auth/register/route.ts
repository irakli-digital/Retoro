import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail, migrateAnonymousData, createMagicLinkToken } from "@/lib/queries";
import { generateVerificationToken, hashPassword } from "@/lib/auth-utils";
import { cookies } from "next/headers";
import { sendVerificationEmail } from "@/lib/mailgun";

const ANONYMOUS_USER_COOKIE = "retoro_anonymous_user_id";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password, name, anonymous_user_id } = body;

    if (!email) {
      return NextResponse.json(
        { error: "Email is required" },
        { status: 400 }
      );
    }

    if (password && password.length < 8) {
      return NextResponse.json(
        { error: "Password must be at least 8 characters" },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await getUserByEmail(email);
    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 409 }
      );
    }

    // Hash password if provided
    const passwordHash = password ? await hashPassword(password) : null;

    // Create user
    const userId = await createUser(email, name || null, passwordHash, false);

    // Migrate anonymous session data - check both request body and cookie
    const cookieStore = await cookies();
    const anonymousUserIdFromCookie = cookieStore.get(ANONYMOUS_USER_COOKIE)?.value;
    const anonymousUserIdToMigrate = anonymous_user_id || anonymousUserIdFromCookie;
    
    if (anonymousUserIdToMigrate) {
      const migratedCount = await migrateAnonymousData(anonymousUserIdToMigrate, userId);
      console.log(`[Registration] Migrated ${migratedCount} items from anonymous session (${anonymousUserIdToMigrate}) to user ${userId}`);
      
      // Clear anonymous cookie after migration
      if (anonymousUserIdFromCookie) {
        cookieStore.delete(ANONYMOUS_USER_COOKIE);
      }
    } else {
      console.log(`[Registration] No anonymous data to migrate for user ${userId}`);
    }

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiration

    // Store verification token as magic link token
    await createMagicLinkToken(userId, verificationToken, expiresAt);

    // Send verification email with token
    const verificationLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/verify-email?token=${verificationToken}`;
    
    // Use Mailgun if configured, otherwise log
    if (process.env.MAILGUN_API_KEY && process.env.MAILGUN_DOMAIN) {
      await sendVerificationEmail(email, verificationLink);
    } else {
      console.log(`[DEV] Verification link for ${email}: ${verificationLink}`);
    }

    return NextResponse.json({
      success: true,
      userId,
      message: "Account created successfully. Please check your email to verify.",
      // Remove in production - only for development
      verificationLink: process.env.NODE_ENV === "development" ? verificationLink : undefined,
    });
  } catch (error) {
    console.error("Registration error:", error);
    return NextResponse.json(
      { error: "Failed to create account" },
      { status: 500 }
    );
  }
}