#!/bin/bash

# Quick test - assumes ngrok is running on port 3000
# Run this AFTER starting: ngrok http 3000

INVOICE_FILE="Example Invoice/invoice.png"
N8N_WEBHOOK="https://tbcuz.app.n8n.cloud/webhook-test/invoice-process"

# Get ngrok public URL
NGROK_URL=$(curl -s http://localhost:4040/api/tunnels | grep -o 'https://[a-z0-9]*\.ngrok-free\.app\|https://[a-z0-9]*\.ngrok\.io' | head -1)

if [ -z "$NGROK_URL" ]; then
  echo "❌ ngrok not found! Please run: ngrok http 3000"
  exit 1
fi

echo "Using ngrok URL: $NGROK_URL"
echo ""

# Upload invoice
echo "Uploading invoice..."
UPLOAD=$(curl -s -X POST http://localhost:3000/api/upload/invoice -F "invoice=@$INVOICE_FILE")
IMAGE_PATH=$(echo $UPLOAD | grep -o '"/uploads/[^"]*' | cut -d'"' -f2)
PUBLIC_URL="$NGROK_URL$IMAGE_PATH"

echo "Image URL: $PUBLIC_URL"
echo ""

# Trigger N8N
echo "Triggering N8N webhook..."
curl -X POST "$N8N_WEBHOOK" \
  -H "Content-Type: application/json" \
  -d "{\"image_url\": \"$PUBLIC_URL\", \"user_id\": \"demo-user-123\"}"

echo ""
echo "Done! Check N8N for results."

