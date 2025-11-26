# N8N Setup Guide

## Quick Setup Steps

### 1. Set Environment Variables in N8N

In your N8N instance, go to **Settings → Environment Variables** and add:

```
RETORO_API_KEY=299f5ca754fa16718420949736b75abb139ff5018f792a00c961b99a97716fa7
RETORO_API_URL=http://localhost:3000/api
```

**For Production:**
- Change `RETORO_API_URL` to your production URL: `https://your-domain.com/api`
- Use the same `RETORO_API_KEY` value that's in your production `.env.local` (or Railway/Render environment variables)

### 2. Additional API Keys Needed

You'll also need to set these in N8N:

- `PERPLEXITY_API_KEY` - Get from https://www.perplexity.ai/
- `OPENAI_API_KEY` - Get from https://platform.openai.com/api-keys
- `GOOGLE_VISION_API_KEY` - Optional, only if using Google Vision for OCR instead of OpenAI Vision

### 3. Import Flows

1. Open N8N
2. Go to **Workflows**
3. Click **Import from File**
4. Import each JSON file from the `n8n-flows/` directory:
   - `ecommerce-checker.json`
   - `invoice-scraper.json`
   - `policy-verification.json`

### 4. Configure Credentials

After importing, configure credentials for:
- **HTTP Request nodes** - Use the "Generic Credential Type" → "HTTP Header Auth"
  - Header name: `X-API-Key`
  - Header value: `={{ $env.RETORO_API_KEY }}`
- **OpenAI nodes** - Add your OpenAI API credentials
- **Perplexity nodes** - Add your Perplexity API credentials

### 5. Test the Flows

1. **E-commerce Checker**: Test by calling the webhook with a retailer name
2. **Invoice Scraper**: Upload an invoice image via the Retoro website
3. **Policy Verification**: Enable the scheduled trigger (cron) to run daily/weekly

## Security Notes

- **Never commit** `.env.local` to git (it's already in `.gitignore`)
- **Rotate** `RETORO_API_KEY` periodically for security
- **Use different keys** for development and production
- **Restrict** N8N webhook URLs if possible (IP whitelisting)

## Troubleshooting

### "Unauthorized" errors
- Check that `RETORO_API_KEY` in N8N matches exactly with your `.env.local`
- Verify the `X-API-Key` header is being sent in HTTP requests

### Connection errors
- Verify `RETORO_API_URL` is correct
- Check if your Retoro app is running and accessible
- For localhost, ensure N8N can reach `localhost:3000` (may need `http://host.docker.internal:3000` if N8N is in Docker)

### Flow execution errors
- Check N8N execution logs for detailed error messages
- Verify all API keys are set correctly
- Ensure credentials are configured for each node

