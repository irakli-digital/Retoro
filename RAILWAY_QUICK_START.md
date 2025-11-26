# Railway Quick Start Checklist

## ✅ Pre-Deployment Checklist

### 1. Code is Ready
- ✅ `package.json` has `build` and `start` scripts
- ✅ `next.config.mjs` is configured
- ✅ `.gitignore` excludes `.env.local`
- ✅ Code is pushed to GitHub

### 2. Environment Variables Ready
All these need to be added to Railway:

**Required:**
```bash
DATABASE_URL=postgresql://user:password@host:port/database?sslmode=require

NEXT_PUBLIC_SITE_URL=https://your-app-name.up.railway.app  # ⚠️ UPDATE AFTER DEPLOY

GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com

NODE_ENV=production
```

**Optional (for email):**
```bash
RESEND_API_KEY=your-api-key
EMAIL_FROM=noreply@retoro.app
```

## 🚀 Deployment Steps

### Step 1: Create Railway Project
1. Go to [railway.app](https://railway.app)
2. Click **"New Project"**
3. Select **"Deploy from GitHub repo"**
4. Choose **Retoro** repository

### Step 2: Add Environment Variables
1. In Railway dashboard → **Variables** tab
2. Add all variables from checklist above
3. **IMPORTANT:** `NEXT_PUBLIC_SITE_URL` will be set after first deploy

### Step 3: Deploy
1. Railway auto-deploys on push
2. Or click **"Deploy"** button
3. Wait for build (2-5 minutes)

### Step 4: Get Your Domain
1. After deploy, Railway gives you a URL like:
   `https://retoro-production.up.railway.app`
2. Copy this URL

### Step 5: Update Environment Variables
1. Go back to Railway → **Variables**
2. Update `NEXT_PUBLIC_SITE_URL` to your Railway domain:
   ```
   NEXT_PUBLIC_SITE_URL=https://retoro-production.up.railway.app
   ```
3. Railway will auto-redeploy

### Step 6: Update Google OAuth
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. **APIs & Services** → **Credentials**
3. Click your OAuth Client ID
4. Add redirect URI:
   ```
   https://retoro-production.up.railway.app/api/auth/google/callback
   ```
5. Save

### Step 7: Test
1. Visit your Railway URL
2. Test Google OAuth login
3. Verify session persists
4. Check if items show up

## ⚠️ Common Issues

### Issue: OAuth redirect_uri_mismatch
**Fix:** 
- Check `NEXT_PUBLIC_SITE_URL` matches Railway domain exactly
- Check Google Console redirect URI matches exactly

### Issue: Session not persisting
**Fix:**
- Verify `NEXT_PUBLIC_SITE_URL` is correct
- Check cookie domain matches site domain
- Check Railway logs for cookie errors

### Issue: Build fails
**Fix:**
- Check Railway build logs
- Verify all dependencies in `package.json`
- Check for TypeScript/ESLint errors

## 📝 Post-Deployment

After successful deployment:
1. ✅ Test Google OAuth
2. ✅ Test adding purchases
3. ✅ Verify session persistence
4. ✅ Check Railway logs for errors
5. ✅ Test on mobile device

## 🔗 Important URLs

- **Railway Dashboard:** https://railway.app/dashboard
- **Google Cloud Console:** https://console.cloud.google.com/
- **Neon Database:** https://neon.tech

