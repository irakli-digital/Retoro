#!/bin/bash

# Test script for Invoice Scraper N8N webhook
# Usage: ./test-invoice-webhook.sh [n8n-webhook-url] [user-id]

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# Configuration
RETORO_API_URL="${RETORO_API_URL:-http://localhost:3000}"
N8N_WEBHOOK_URL="${1:-http://localhost:5678/webhook/invoice-process}"
USER_ID="${2:-demo-user-123}"
INVOICE_FILE="${3:-Example Invoice/invoice.png}"

echo -e "${YELLOW}Testing Invoice Scraper Webhook${NC}"
echo "=================================="
echo "Retoro API URL: $RETORO_API_URL"
echo "N8N Webhook URL: $N8N_WEBHOOK_URL"
echo "User ID: $USER_ID"
echo "Invoice File: $INVOICE_FILE"
echo ""

# Step 1: Upload invoice image
echo -e "${YELLOW}Step 1: Uploading invoice image...${NC}"
UPLOAD_RESPONSE=$(curl -s -X POST \
  "$RETORO_API_URL/api/upload/invoice" \
  -H "Content-Type: multipart/form-data" \
  -F "invoice=@$INVOICE_FILE")

echo "Upload Response: $UPLOAD_RESPONSE"

# Extract image URL from response
IMAGE_URL=$(echo $UPLOAD_RESPONSE | grep -o '"url":"[^"]*' | cut -d'"' -f4)

if [ -z "$IMAGE_URL" ]; then
  echo -e "${RED}Error: Could not extract image URL from upload response${NC}"
  echo "Response was: $UPLOAD_RESPONSE"
  exit 1
fi

echo -e "${GREEN}✓ Image uploaded successfully${NC}"
echo "Image URL: $IMAGE_URL"
echo ""

# Step 2: Trigger N8N webhook
echo -e "${YELLOW}Step 2: Triggering N8N webhook...${NC}"
WEBHOOK_RESPONSE=$(curl -s -X POST \
  "$N8N_WEBHOOK_URL" \
  -H "Content-Type: application/json" \
  -d "{
    \"image_url\": \"$IMAGE_URL\",
    \"user_id\": \"$USER_ID\"
  }")

echo "Webhook Response: $WEBHOOK_RESPONSE"
echo ""

if echo "$WEBHOOK_RESPONSE" | grep -q "items_created"; then
  echo -e "${GREEN}✓ Webhook triggered successfully!${NC}"
else
  echo -e "${YELLOW}⚠ Check the response above for any errors${NC}"
fi

