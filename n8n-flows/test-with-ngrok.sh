#!/bin/bash

# Test script using ngrok to expose localhost
# Prerequisites: Install ngrok (brew install ngrok or download from ngrok.com)

INVOICE_FILE="Example Invoice/invoice.png"
N8N_WEBHOOK_URL="https://tbcuz.app.n8n.cloud/webhook-test/invoice-process"
USER_ID="demo-user-123"

echo "🚀 Testing Invoice Scraper with ngrok"
echo "======================================"
echo ""

# Check if ngrok is running
if ! curl -s http://localhost:4040/api/tunnels > /dev/null 2>&1; then
  echo "❌ ngrok is not running!"
  echo ""
  echo "Please start ngrok in another terminal:"
  echo "  ngrok http 3000"
  echo ""
  echo "Then run this script again."
  exit 1
fi

# Get ngrok public URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o '"public_url":"https://[^"]*' | head -1 | cut -d'"' -f4)

if [ -z "$NGROK_URL" ]; then
  echo "❌ Could not get ngrok URL. Make sure ngrok is running: ngrok http 3000"
  exit 1
fi

echo "✓ Found ngrok URL: $NGROK_URL"
echo ""

# Step 1: Upload invoice
echo "Step 1: Uploading invoice..."
UPLOAD_RESPONSE=$(curl -s -X POST \
  "http://localhost:3000/api/upload/invoice" \
  -H "Content-Type: multipart/form-data" \
  -F "invoice=@$INVOICE_FILE")

IMAGE_URL=$(echo $UPLOAD_RESPONSE | grep -o '"url":"[^"]*' | cut -d'"' -f4)

if [ -z "$IMAGE_URL" ]; then
  echo "❌ Upload failed: $UPLOAD_RESPONSE"
  exit 1
fi

# Replace localhost with ngrok URL
PUBLIC_IMAGE_URL="${IMAGE_URL/localhost:3000/${NGROK_URL#https://}}"
PUBLIC_IMAGE_URL="https://${PUBLIC_IMAGE_URL#http://}"

echo "✓ Image uploaded"
echo "  Local URL: $IMAGE_URL"
echo "  Public URL: $PUBLIC_IMAGE_URL"
echo ""

# Step 2: Trigger N8N webhook
echo "Step 2: Triggering N8N webhook..."
echo ""

curl -X POST "$N8N_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"image_url\": \"$PUBLIC_IMAGE_URL\",
    \"user_id\": \"$USER_ID\"
  }" \
  -w "\n\nHTTP Status: %{http_code}\n"

echo ""
echo "✅ Done! Check N8N workflow execution for results."

