# Authentication System Setup Guide

## Overview
Complete authentication system with email verification, password hashing, magic links, and Google OAuth support.

## Features Implemented

### ✅ Completed
1. **Magic Link Tokens Table** - Database table for storing magic link tokens
2. **Password Hashing** - Bcrypt integration for secure password storage
3. **Email Verification** - Token-based email verification system
4. **Session Management** - Updated to use user IDs with validation
5. **Google OAuth** - OAuth flow with callback handler

## Database Tables

### Users Table
- `id` - UUID primary key
- `email` - Unique email address
- `password_hash` - Bcrypt hashed password (nullable for passwordless)
- `name` - User's name (optional)
- `email_verified` - Boolean flag
- `email_verified_at` - Timestamp of verification
- `created_at`, `updated_at`, `last_login_at` - Timestamps

### Magic Link Tokens Table
- `id` - UUID primary key
- `user_id` - Foreign key to users
- `token` - Unique token string
- `expires_at` - Expiration timestamp
- `used` - Boolean flag
- `created_at` - Creation timestamp

## Environment Variables

Add these to your `.env.local`:

```bash
# Google OAuth (for Gmail/Google sign-in)
GOOGLE_CLIENT_ID=your-google-client-id
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id

# Email Service (for sending verification emails)
# Choose one:
# RESEND_API_KEY=your-resend-api-key
# SENDGRID_API_KEY=your-sendgrid-api-key
# SMTP_HOST=smtp.example.com
# SMTP_PORT=587
# SMTP_USER=your-email@example.com
# SMTP_PASSWORD=your-password
```

## Google OAuth Setup

1. **Create Google OAuth Credentials:**
   - Go to [Google Cloud Console](https://console.cloud.google.com/)
   - Create a new project or select existing
   - Enable Google+ API
   - Go to "Credentials" → "Create Credentials" → "OAuth client ID"
   - Application type: "Web application"
   - Authorized redirect URIs: `http://localhost:3000/api/auth/google/callback` (dev)
   - Authorized redirect URIs: `https://yourdomain.com/api/auth/google/callback` (production)

2. **Add to .env.local:**
   ```bash
   GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   GOOGLE_CLIENT_SECRET=your-client-secret
   NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-client-id.apps.googleusercontent.com
   ```

## Email Service Setup (TODO)

Currently, verification emails are logged to console. To send actual emails:

### Option 1: Resend (Recommended)
```bash
npm install resend
```

Create `lib/email.ts`:
```typescript
import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function sendVerificationEmail(email: string, token: string) {
  const verificationLink = `${process.env.NEXT_PUBLIC_SITE_URL}/auth/verify-email?token=${token}`;
  
  await resend.emails.send({
    from: 'noreply@yourdomain.com',
    to: email,
    subject: 'Verify your Return Tracker account',
    html: `
      <h1>Welcome to Return Tracker!</h1>
      <p>Click the link below to verify your email:</p>
      <a href="${verificationLink}">Verify Email</a>
    `,
  });
}
```

### Option 2: SendGrid
Similar setup with SendGrid SDK.

## API Routes

### Registration
- `POST /api/auth/register` - Email + password registration
- `POST /api/auth/register/magic-link` - Magic link registration

### Verification
- `GET /api/auth/verify` - Magic link verification (redirects to dashboard)
- `GET /api/auth/verify-email` - Email verification (redirects to dashboard)

### OAuth
- `GET /api/auth/google` - Initiate Google OAuth (not used directly)
- `GET /api/auth/google/callback` - Google OAuth callback handler

## Usage

### Registration Flow

1. **User clicks "Save My Returns"** on dashboard
2. **Registration modal opens** with options:
   - Continue with Google (OAuth)
   - Email + Password
   - Magic Link (passwordless)
3. **User selects method** and fills form
4. **Account created** with verification token
5. **Verification email sent** (or link shown in dev mode)
6. **User clicks link** → Email verified → Logged in

### Magic Link Flow

1. User enters email
2. Magic link token generated and stored
3. Email sent with link (or logged in dev)
4. User clicks link → Token validated → Session created → Redirected

### Google OAuth Flow

1. User clicks "Continue with Google"
2. Redirected to Google consent screen
3. User grants permission
4. Redirected back with authorization code
5. Code exchanged for access token
6. User info fetched from Google
7. Account created/found → Session set → Redirected

## Security Features

- ✅ Password hashing with bcrypt (10 rounds)
- ✅ Token expiration (24 hours)
- ✅ One-time use tokens
- ✅ Email verification required
- ✅ Secure session cookies (httpOnly, secure in production)
- ✅ CSRF protection via state parameter (OAuth)

## Next Steps

1. **Set up email service** (Resend/SendGrid)
2. **Add email templates** for verification and magic links
3. **Implement password reset** flow
4. **Add rate limiting** to prevent abuse
5. **Add email change** functionality
6. **Implement account deletion**

## Testing

### Development Mode
- Verification links are logged to console
- Magic links are logged to console
- No actual emails sent

### Production Mode
- Actual emails sent via email service
- Links not logged to console
- Secure cookies enabled

