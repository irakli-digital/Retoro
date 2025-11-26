import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail, migrateAnonymousData, createMagicLinkToken } from "@/lib/queries";
import { generateVerificationToken, hashPassword } from "@/lib/auth-utils";

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

    // Migrate anonymous session data if provided
    if (anonymous_user_id) {
      const migratedCount = await migrateAnonymousData(anonymous_user_id, userId);
      console.log(`Migrated ${migratedCount} items from anonymous session`);
    }

    // Generate verification token
    const verificationToken = generateVerificationToken();
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hour expiration

    // Store verification token as magic link token
    await createMagicLinkToken(userId, verificationToken, expiresAt);

    // TODO: Send verification email with token
    // For now, log the token (remove in production)
    const verificationLink = `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/verify-email?token=${verificationToken}`;
    console.log(`Verification link for ${email}: ${verificationLink}`);

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

