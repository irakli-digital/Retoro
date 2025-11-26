#!/bin/bash

# Quick test script for N8N Invoice Scraper webhook
# Usage: ./test-invoice-curl.sh [path-to-invoice.png]

INVOICE_FILE="${1:-Example Invoice/invoice.png}"
N8N_WEBHOOK_URL="https://tbcuz.app.n8n.cloud/webhook-test/invoice-process"
USER_ID="demo-user-123"

echo "Testing Invoice Scraper Webhook"
echo "================================"
echo "Invoice file: $INVOICE_FILE"
echo "N8N Webhook: $N8N_WEBHOOK_URL"
echo ""

# Option 1: Upload to Retoro first, then send URL to N8N
echo "Step 1: Uploading invoice to Retoro..."
UPLOAD_RESPONSE=$(curl -s -X POST \
  "http://localhost:3000/api/upload/invoice" \
  -H "Content-Type: multipart/form-data" \
  -F "invoice=@$INVOICE_FILE")

echo "Upload response: $UPLOAD_RESPONSE"
echo ""

# Extract image URL
IMAGE_URL=$(echo $UPLOAD_RESPONSE | grep -o '"url":"[^"]*' | cut -d'"' -f4)

if [ -z "$IMAGE_URL" ]; then
  echo "Error: Could not extract image URL"
  echo "Trying with full localhost URL..."
  # Try to construct URL manually
  FILENAME=$(basename "$INVOICE_FILE")
  IMAGE_URL="http://localhost:3000/uploads/invoices/${FILENAME}"
fi

# For cloud N8N, we need a publicly accessible URL
# Option: Use ngrok or similar to expose localhost
echo "⚠️  Note: N8N is cloud-hosted and cannot access localhost"
echo "You need to either:"
echo "  1. Use ngrok to expose localhost:3000"
echo "  2. Upload image to a public URL (imgur, etc.)"
echo "  3. Deploy Retoro and use production URL"
echo ""
echo "For now, using: $IMAGE_URL"
echo ""

# Step 2: Trigger N8N webhook
echo "Step 2: Triggering N8N webhook..."
curl -X POST "$N8N_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"image_url\": \"$IMAGE_URL\",
    \"user_id\": \"$USER_ID\"
  }" \
  -v

echo ""
echo "Done!"

