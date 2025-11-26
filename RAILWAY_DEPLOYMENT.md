# Railway Deployment Guide

## Prerequisites

- Railway account: [railway.app](https://railway.app)
- GitHub repository (already set up)
- Neon PostgreSQL database (already configured)
- Google OAuth credentials (already configured)

## Step 1: Create Railway Project

1. Go to [Railway Dashboard](https://railway.app/dashboard)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose your **Retoro** repository
5. Railway will automatically detect it's a Next.js project

## Step 2: Configure Environment Variables

In Railway dashboard, go to your project → **Variables** tab and add:

### Required Variables

```bash
# Database (already configured)
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

# Site Configuration (IMPORTANT: Update with your Railway domain)
NEXT_PUBLIC_SITE_URL=https://your-app-name.up.railway.app

# Google OAuth (replace with your actual credentials)
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

# Email Service (optional for now)
RESEND_API_KEY=your-api-key
EMAIL_FROM=noreply@retoro.app

# Node Environment
NODE_ENV=production
```

### Optional Analytics Variables

```bash
NEXT_PUBLIC_GTM_ID=GTM-XXXXXXX
NEXT_PUBLIC_GA_ID=G-XXXXXXXXXX
NEXT_PUBLIC_FB_PIXEL_ID=123456789012345
NEXT_PUBLIC_HOTJAR_ID=1234567
```

## Step 3: Update Google OAuth Redirect URI

**IMPORTANT:** After Railway deploys, you'll get a domain like `your-app-name.up.railway.app`

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Navigate to **APIs & Services** → **Credentials**
3. Click on your OAuth 2.0 Client ID
4. Add to **Authorized redirect URIs**:
   ```
   https://your-app-name.up.railway.app/api/auth/google/callback
   ```
5. Save changes

## Step 4: Railway Build Configuration

Railway should auto-detect Next.js, but verify:

1. **Build Command:** `npm run build` (auto-detected)
2. **Start Command:** `npm start` (auto-detected)
3. **Root Directory:** `/` (default)

## Step 5: Deploy

1. Railway will automatically deploy when you push to GitHub
2. Or click **"Deploy"** in Railway dashboard
3. Wait for build to complete (usually 2-5 minutes)
4. Railway will provide a URL like: `https://your-app-name.up.railway.app`

## Step 6: Post-Deployment Checklist

### ✅ Verify Deployment

1. **Check Build Logs:**
   - Go to Railway dashboard → **Deployments** → Click latest deployment
   - Check for any build errors
   - Should see: "Build successful"

2. **Test the App:**
   - Visit your Railway URL
   - Check if homepage loads
   - Test adding a purchase
   - Test Google OAuth login

3. **Check Environment Variables:**
   - Railway dashboard → **Variables**
   - Verify all variables are set correctly
   - **CRITICAL:** `NEXT_PUBLIC_SITE_URL` must match your Railway domain

### ✅ Update Google OAuth (if needed)

If you get a different Railway domain than expected:
1. Update `NEXT_PUBLIC_SITE_URL` in Railway variables
2. Add new redirect URI in Google Console
3. Redeploy (or wait for auto-deploy)

### ✅ Test Authentication

1. **Test Google OAuth:**
   - Click "Continue with Google"
   - Should redirect to Google sign-in
   - After signing in, should redirect back
   - Should be logged in

2. **Test Session:**
   - After login, refresh page
   - Should stay logged in
   - Items should persist

## Step 7: Custom Domain (Optional)

If you want to use `retoro.app`:

1. In Railway dashboard → **Settings** → **Domains**
2. Add custom domain: `retoro.app`
3. Update DNS records as instructed
4. Update `NEXT_PUBLIC_SITE_URL` to `https://retoro.app`
5. Update Google OAuth redirect URI to `https://retoro.app/api/auth/google/callback`

## Troubleshooting

### Build Fails

**Error: "Module not found"**
- Check `package.json` dependencies
- Railway should install automatically

**Error: "Environment variable missing"**
- Check Railway Variables tab
- Ensure all required variables are set

### OAuth Not Working

**Error: "redirect_uri_mismatch"**
- Check Google Console redirect URIs
- Must match exactly: `https://your-domain.com/api/auth/google/callback`
- Check `NEXT_PUBLIC_SITE_URL` matches your Railway domain

**Error: "oauth_not_configured"**
- Check `GOOGLE_CLIENT_ID` and `GOOGLE_CLIENT_SECRET` are set in Railway
- Check they match Google Console credentials

### Session Issues

**User not logged in after OAuth**
- Check browser console for errors
- Check Railway logs for cookie setting errors
- Verify `NEXT_PUBLIC_SITE_URL` is correct
- Cookies need matching domain

**Items not showing**
- Check Railway logs for database connection errors
- Verify `DATABASE_URL` is correct
- Check if anonymous session migration is working

## Railway-Specific Notes

### Port Configuration
- Railway automatically sets `PORT` environment variable
- Next.js will use it automatically
- No configuration needed

### Database Connection
- Your Neon database URL should work as-is
- Railway doesn't need special database setup
- Connection is external (Neon)

### Build Optimization
- Railway uses `npm run build` automatically
- Next.js will optimize for production
- Static assets are served automatically

## Environment Variables Reference

### Required for Production

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | Neon PostgreSQL connection string | `postgresql://...` |
| `NEXT_PUBLIC_SITE_URL` | Your Railway domain | `https://app.up.railway.app` |
| `GOOGLE_CLIENT_ID` | Google OAuth Client ID | `xxx.apps.googleusercontent.com` |
| `GOOGLE_CLIENT_SECRET` | Google OAuth Secret | `your-google-client-secret` |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Public Google Client ID | `xxx.apps.googleusercontent.com` |
| `NODE_ENV` | Environment | `production` |

### Optional

| Variable | Description | Status |
|----------|-------------|--------|
| `RESEND_API_KEY` | Email service API key | Not configured yet |
| `EMAIL_FROM` | Email sender address | Not configured yet |

## Quick Deploy Checklist

- [ ] Railway project created
- [ ] GitHub repo connected
- [ ] All environment variables added to Railway
- [ ] `NEXT_PUBLIC_SITE_URL` set to Railway domain
- [ ] Google OAuth redirect URI updated in Google Console
- [ ] Build successful
- [ ] App accessible at Railway URL
- [ ] Google OAuth tested and working
- [ ] Session persistence verified

## Support

If you encounter issues:
1. Check Railway deployment logs
2. Check browser console for client errors
3. Verify all environment variables are set
4. Ensure Google OAuth redirect URI matches Railway domain exactly

