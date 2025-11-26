# Authentication Finalization Checklist

## Current Status

### ✅ Already Implemented
- Database schema (users, magic_link_tokens tables)
- Password hashing (bcryptjs)
- Session management (cookie-based)
- Registration endpoints (email/password, magic link)
- Verification endpoints (email verification, magic link)
- Google OAuth callback handler
- Anonymous session migration
- UI components (registration modal, Google auth button)

### ❌ Missing/Incomplete

## 1. Google OAuth Setup

### Step 1: Fix Google OAuth Init Route
**File:** `app/api/auth/google/route.ts`

**Issue:** Currently has placeholder code. Should redirect to Google OAuth.

**Action Required:** The route is actually not needed since `GoogleAuthButton` component handles the redirect directly. However, you can delete this file or update it to be a proper init route if needed.

**Status:** ✅ Actually working - button redirects directly to Google

### Step 2: Configure Google Cloud Console
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project (or select existing)
3. Enable **Google+ API** (or **Google Identity API**)
4. Go to **Credentials** → **Create Credentials** → **OAuth client ID**
5. Application type: **Web application**
6. Add authorized redirect URIs:
   - Development: `http://localhost:3000/api/auth/google/callback`
   - Production: `https://retoro.app/api/auth/google/callback` (or your domain)
7. Copy **Client ID** and **Client Secret**

### Step 3: Add Environment Variables
**File:** `.env.local`

Add these lines:
```bash
# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
```

**Status:** ⚠️ **MISSING** - Add these to `.env.local`

---

## 2. Email Service Setup

### Step 1: Choose Email Service Provider

**Option A: Resend (Recommended - Easy Setup)**
- Free tier: 3,000 emails/month
- Simple API
- Good deliverability

**Option B: SendGrid**
- Free tier: 100 emails/day
- More features
- Enterprise-grade

**Option C: SMTP (Gmail, etc.)**
- Free but limited
- Requires app password
- Less reliable

### Step 2: Install Email Service Package

**For Resend:**
```bash
npm install resend
```

**For SendGrid:**
```bash
npm install @sendgrid/mail
```

**Status:** ⚠️ **MISSING** - No email package installed

### Step 3: Create Email Service Module
**File:** `lib/email.ts` (create new file)

**For Resend:**
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM || 'noreply@retoro.app';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export async function sendVerificationEmail(email: string, token: string, name?: string | null) {
  const verificationLink = `${SITE_URL}/api/auth/verify-email?token=${token}`;
  
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Verify your Return Tracker account',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #5e8e3e;">Welcome to Return Tracker!</h1>
            <p>Hi${name ? ` ${name}` : ''},</p>
            <p>Thanks for signing up! Please verify your email address by clicking the button below:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${verificationLink}" style="background-color: #5e8e3e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Verify Email</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666; font-size: 12px;">${verificationLink}</p>
            <p style="margin-top: 30px; font-size: 12px; color: #999;">This link will expire in 24 hours.</p>
            <p style="font-size: 12px; color: #999;">If you didn't create an account, you can safely ignore this email.</p>
          </body>
        </html>
      `,
    });
  } catch (error) {
    console.error('Error sending verification email:', error);
    throw error;
  }
}

export async function sendMagicLinkEmail(email: string, token: string, name?: string | null) {
  const magicLink = `${SITE_URL}/api/auth/verify?token=${token}`;
  
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: email,
      subject: 'Your Return Tracker login link',
      html: `
        <!DOCTYPE html>
        <html>
          <head>
            <meta charset="utf-8">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
          </head>
          <body style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
            <h1 style="color: #5e8e3e;">Return Tracker Login</h1>
            <p>Hi${name ? ` ${name}` : ''},</p>
            <p>Click the button below to log in to your Return Tracker account:</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${magicLink}" style="background-color: #5e8e3e; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">Log In</a>
            </div>
            <p>Or copy and paste this link into your browser:</p>
            <p style="word-break: break-all; color: #666; font-size: 12px;">${magicLink}</p>
            <p style="margin-top: 30px; font-size: 12px; color: #999;">This link will expire in 24 hours and can only be used once.</p>
            <p style="font-size: 12px; color: #999;">If you didn't request this link, you can safely ignore this email.</p>
          </body>
        </html>
      `,
    });
  } catch (error) {
    console.error('Error sending magic link email:', error);
    throw error;
  }
}
```

**Status:** ⚠️ **MISSING** - File doesn't exist

### Step 4: Update Registration Routes to Send Emails

**File:** `app/api/auth/register/route.ts`

Replace the console.log with:
```typescript
import { sendVerificationEmail } from "@/lib/email";

// Replace line 55-56 with:
try {
  await sendVerificationEmail(email, verificationToken, name);
} catch (error) {
  console.error("Failed to send verification email:", error);
  // Don't fail registration if email fails - user can request resend later
}
```

**File:** `app/api/auth/register/magic-link/route.ts`

Replace the console.log with:
```typescript
import { sendMagicLinkEmail } from "@/lib/email";

// Replace line 47-49 with:
try {
  await sendMagicLinkEmail(email, token, name);
} catch (error) {
  console.error("Failed to send magic link email:", error);
  // Return error so user knows email failed
  return NextResponse.json(
    { error: "Failed to send magic link email" },
    { status: 500 }
  );
}
```

**Status:** ⚠️ **MISSING** - Routes still using console.log

### Step 5: Add Email Environment Variables
**File:** `.env.local`

**For Resend:**
```bash
# Email Service (Resend)
RESEND_API_KEY=re_your_api_key_here
EMAIL_FROM=noreply@retoro.app
```

**For SendGrid:**
```bash
# Email Service (SendGrid)
SENDGRID_API_KEY=SG.your_api_key_here
EMAIL_FROM=noreply@retoro.app
```

**Status:** ⚠️ **MISSING** - Add to `.env.local`

### Step 6: Set Up Email Domain (Production)

**For Resend:**
1. Go to [Resend Dashboard](https://resend.com/)
2. Add and verify your domain
3. Update DNS records
4. Use verified domain in `EMAIL_FROM`

**For SendGrid:**
1. Go to [SendGrid Dashboard](https://sendgrid.com/)
2. Verify sender identity
3. Use verified email in `EMAIL_FROM`

**Status:** ⚠️ **REQUIRED FOR PRODUCTION**

---

## 3. Environment Variables Summary

**Complete `.env.local` should include:**

```bash
# Database
DATABASE_URL=your-neon-database-url

# Google OAuth
GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-client-secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com

# Email Service (choose one)
RESEND_API_KEY=re_your_api_key_here
# OR
SENDGRID_API_KEY=SG.your_api_key_here

# Email Configuration
EMAIL_FROM=noreply@retoro.app
NEXT_PUBLIC_SITE_URL=https://retoro.app
```

**Status:** ⚠️ **INCOMPLETE** - Missing Google OAuth and Email service keys

---

## 4. Testing Checklist

### Google OAuth Testing
- [ ] Test Google OAuth flow in development
- [ ] Verify redirect URI matches Google Console settings
- [ ] Test with existing user (should login)
- [ ] Test with new user (should create account)
- [ ] Test anonymous session migration
- [ ] Test in production with production redirect URI

### Email Testing
- [ ] Test verification email sending
- [ ] Test magic link email sending
- [ ] Verify email links work correctly
- [ ] Test email templates render properly
- [ ] Test email delivery (check spam folder)
- [ ] Test email expiration (24 hours)

---

## 5. Production Checklist

- [ ] Google OAuth redirect URI updated for production domain
- [ ] Email domain verified and DNS configured
- [ ] Environment variables set in production (Vercel, etc.)
- [ ] `NEXT_PUBLIC_SITE_URL` set to production domain
- [ ] Secure cookies enabled (`secure: true` in production)
- [ ] Email service API key added to production environment
- [ ] Test full authentication flow in production

---

## Quick Start Guide

### To Finalize Google OAuth:
1. Set up Google Cloud Console credentials
2. Add `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `NEXT_PUBLIC_GOOGLE_CLIENT_ID` to `.env.local`
3. Test the flow

### To Finalize Email:
1. Choose Resend or SendGrid
2. Install package: `npm install resend` (or `@sendgrid/mail`)
3. Create `lib/email.ts` with email functions
4. Update registration routes to use email functions
5. Add `RESEND_API_KEY` (or `SENDGRID_API_KEY`) and `EMAIL_FROM` to `.env.local`
6. Test email sending

---

## Estimated Time

- **Google OAuth:** 15-30 minutes (mostly waiting for Google Console setup)
- **Email Service:** 30-60 minutes (including domain verification for production)
- **Testing:** 30 minutes
- **Total:** ~2 hours

---

## Notes

- In development, emails can still log to console as fallback
- Google OAuth callback route is already complete
- All database queries and session management are implemented
- UI components are ready and working

