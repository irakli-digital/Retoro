import { NextRequest, NextResponse } from "next/server";
import { createUser, getUserByEmail, migrateAnonymousData } from "@/lib/queries";
import { cookies } from "next/headers";

/**
 * Google OAuth callback handler
 * This endpoint handles the OAuth callback from Google
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const code = searchParams.get("code");
    const state = searchParams.get("state");
    const error = searchParams.get("error");

    if (error) {
      return NextResponse.redirect(new URL("/?error=oauth_cancelled", request.url));
    }

    if (!code) {
      return NextResponse.json(
        { error: "Authorization code is required" },
        { status: 400 }
      );
    }

    // Parse state to get anonymous_user_id
    let anonymousUserId: string | null = null;
    if (state) {
      try {
        const stateData = JSON.parse(decodeURIComponent(state));
        anonymousUserId = stateData.anonymous_user_id || null;
      } catch (e) {
        console.error("Error parsing state:", e);
      }
    }

    // Exchange code for access token with Google
    const clientId = process.env.GOOGLE_CLIENT_ID;
    const clientSecret = process.env.GOOGLE_CLIENT_SECRET;
    // Use the request origin to match what the button sent (works for both dev and prod)
    const requestUrl = new URL(request.url);
    const redirectUri = `${requestUrl.origin}/api/auth/google/callback`;

    if (!clientId || !clientSecret) {
      console.error("Google OAuth credentials not configured");
      return NextResponse.redirect(new URL("/?error=oauth_not_configured", request.url));
    }

    // Exchange authorization code for access token
    const tokenResponse = await fetch("https://oauth2.googleapis.com/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        code,
        client_id: clientId,
        client_secret: clientSecret,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    if (!tokenResponse.ok) {
      const errorData = await tokenResponse.text();
      console.error("Token exchange error:", errorData);
      return NextResponse.redirect(new URL("/?error=token_exchange_failed", request.url));
    }

    const tokenData = await tokenResponse.json();
    const accessToken = tokenData.access_token;

    // Get user info from Google
    const userInfoResponse = await fetch("https://www.googleapis.com/oauth2/v2/userinfo", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!userInfoResponse.ok) {
      return NextResponse.redirect(new URL("/?error=user_info_failed", request.url));
    }

    const userInfo = await userInfoResponse.json();
    const { email, name, picture } = userInfo;

    if (!email) {
      return NextResponse.redirect(new URL("/?error=no_email", request.url));
    }

    // Check if user already exists
    let userId: string;
    let existingUser = await getUserByEmail(email);

    if (existingUser) {
      userId = existingUser.id;
    } else {
      // Create new user (email verified by default for OAuth)
      userId = await createUser(email, name || null, null, true);
    }

    // Migrate anonymous session data if provided
    if (anonymousUserId) {
      const migratedCount = await migrateAnonymousData(anonymousUserId, userId);
      console.log(`Migrated ${migratedCount} items from anonymous session`);
    }

    // Set session cookie
    const cookieStore = await cookies();
    cookieStore.set("retoro_user_id", userId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 365, // 1 year
    });
    
    console.log(`OAuth success: Set cookie for user ${userId}, migrated ${anonymousUserId ? 'items' : 'no items'}`);

    // Redirect to dashboard
    return NextResponse.redirect(new URL("/?oauth_success=true", request.url));
  } catch (error) {
    console.error("Google OAuth callback error:", error);
    return NextResponse.redirect(new URL("/?error=oauth_failed", request.url));
  }
}

