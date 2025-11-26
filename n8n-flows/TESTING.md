# Testing N8N Flows

## Testing Invoice Scraper Webhook

### Option 1: Using the Test Script (Recommended)

```bash
# Make sure your Retoro app is running on localhost:3000
# Make sure N8N is running and the invoice-scraper flow is active

cd /path/to/Retoro
./n8n-flows/test-invoice-webhook.sh [n8n-webhook-url] [user-id]

# Example:
./n8n-flows/test-invoice-webhook.sh http://localhost:5678/webhook/invoice-process demo-user-123
```

### Option 2: Manual curl Commands

#### Step 1: Upload the invoice image

```bash
curl -X POST http://localhost:3000/api/upload/invoice \
  -H "Content-Type: multipart/form-data" \
  -F "invoice=@Example Invoice/invoice.png"
```

**Response:**
```json
{
  "url": "http://localhost:3000/uploads/invoices/demo-user-123_1234567890_abc123.png"
}
```

#### Step 2: Trigger N8N webhook with the image URL

```bash
# Replace with your actual N8N webhook URL
# You can find this in N8N: Workflow → Settings → Webhook URL
curl -X POST http://localhost:5678/webhook/invoice-process \
  -H "Content-Type: application/json" \
  -d '{
    "image_url": "http://localhost:3000/uploads/invoices/demo-user-123_1234567890_abc123.png",
    "user_id": "demo-user-123"
  }'
```

### Option 3: Using a Public Image URL

If you have the invoice hosted somewhere publicly accessible:

```bash
curl -X POST http://localhost:5678/webhook/invoice-process \
  -H "Content-Type: application/json" \
  -d '{
    "image_url": "https://example.com/invoice.png",
    "user_id": "demo-user-123"
  }'
```

## Finding Your N8N Webhook URL

1. Open your N8N instance
2. Go to the **Invoice Scraper** workflow
3. Click on the **Webhook Trigger** node
4. Look for the **Webhook URL** - it will be something like:
   - `http://localhost:5678/webhook/invoice-process` (local)
   - `https://your-n8n-instance.com/webhook/invoice-process` (cloud)

## Testing E-commerce Checker

```bash
curl -X GET "http://localhost:3000/api/n8n/ecommerce-check?name=Amazon" \
  -H "X-API-Key: 299f5ca754fa16718420949736b75abb139ff5018f792a00c961b99a97716fa7"
```

## Testing Policy Verification

The policy verification flow runs on a schedule (cron). To test manually:

1. In N8N, click "Execute Workflow" on the Policy Verification flow
2. Or modify the cron trigger to run immediately for testing

## Troubleshooting

### "Connection refused" errors
- Make sure your Retoro app is running (`npm run dev`)
- Make sure N8N is running
- Check that ports match (3000 for Retoro, 5678 for N8N by default)

### "Unauthorized" errors
- Verify `RETORO_API_KEY` matches in both `.env.local` and N8N environment variables
- Check that the `X-API-Key` header is being sent

### Image not found errors
- Make sure the image URL is accessible from N8N
- If N8N is in Docker, use `http://host.docker.internal:3000` instead of `localhost:3000`
- Or use a publicly accessible URL

