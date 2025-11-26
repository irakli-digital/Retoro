# N8N Flows Documentation

This directory contains N8N workflow definitions for automating various Retoro operations. These flows handle retailer discovery, invoice processing, and policy verification.

## Overview

N8N is used to offload heavy processing tasks from the website, keeping the application lightweight and responsive. All flows communicate with the Retoro API via webhooks.

## Required Environment Variables

Set these in your N8N instance:

- `PERPLEXITY_API_KEY` - For AI-powered search and data extraction
- `GOOGLE_VISION_API_KEY` - For OCR (invoice image text extraction)
- `OPENAI_API_KEY` - For AI parsing of invoice data (or use Claude)
- `RETORO_API_URL` - Base URL of Retoro API (e.g., `https://retoro.app/api` or `http://localhost:3000/api`)
- `RETORO_API_KEY` - API key for authenticating N8N requests to Retoro

## Flows

### 1. E-commerce Checker (`ecommerce-checker.json`)

**Purpose:** Automatically discover and add retailer return policies when users request new retailers.

**Trigger:** Webhook from Retoro (`POST /api/n8n/ecommerce-check`)

**Input:**
```json
{
  "retailer_name": "Example Store",
  "website_url": "https://example.com", // optional
  "user_id": "uuid-string"
}
```

**Process:**
1. Check if retailer exists in Retoro database
2. If exists, return existing retailer info
3. If not exists:
   - Use Perplexity AI to search for retailer return policy
   - Extract: return window days, free returns status, policy description, return portal URL
   - Validate extracted data
   - Call Retoro API to add retailer
4. Return result

**Output:**
```json
{
  "retailer_id": "example-store",
  "retailer_name": "Example Store",
  "return_window_days": 30,
  "has_free_returns": true,
  "website_url": "https://example.com",
  "return_portal_url": "https://example.com/returns",
  "status": "created" // or "existing"
}
```

**API Endpoints Used:**
- `GET {RETORO_API_URL}/retailers?name={name}` - Check if retailer exists
- `POST {RETORO_API_URL}/retailers` - Add new retailer

---

### 2. Invoice Image Scraper (`invoice-scraper.json`)

**Purpose:** Extract purchase data from invoice screenshots using OCR and AI.

**Trigger:** Webhook from Retoro (`POST /api/n8n/invoice-process`)

**Input:**
```json
{
  "image_url": "https://retoro.app/uploads/invoice-123.jpg",
  "user_id": "uuid-string"
}
```

**Process:**
1. Download image from URL
2. Use Google Vision API (OCR) to extract text from image
3. Use OpenAI/Claude to parse structured data from OCR text:
   - Retailer name
   - Purchase date
   - Items (name, price, quantity for each)
   - Order number
   - Total amount
4. For each item in invoice:
   - Match retailer name to database (fuzzy match)
   - Create return item record via Retoro API
5. Return summary

**Output:**
```json
{
  "items_created": ["item-id-1", "item-id-2"],
  "retailer_matched": "Amazon",
  "items_count": 2,
  "errors": [] // optional, any errors encountered
}
```

**Note:** Each product on the invoice creates a separate return item record for individual tracking.

**API Endpoints Used:**
- `GET {RETORO_API_URL}/retailers?search={name}` - Search retailers (fuzzy match)
- `POST {RETORO_API_URL}/return-items` - Create return item

---

### 3. Return Policy Verification (`policy-verification.json`)

**Purpose:** Periodically verify and update retailer return policies to ensure accuracy.

**Trigger:** Scheduled (daily or weekly via N8N Cron node)

**Process:**
1. Query all retailers from Retoro database
2. For each retailer:
   - Use Perplexity AI to search for latest return policy
   - Compare with existing policy in database
   - If policy changed:
     - Update database via API
     - Log change
3. Generate report of updates

**Output:**
```json
{
  "retailers_checked": 50,
  "policies_updated": 3,
  "changes": [
    {
      "retailer_id": "example-store",
      "retailer_name": "Example Store",
      "old_policy": { "return_window_days": 30 },
      "new_policy": { "return_window_days": 45 }
    }
  ],
  "report": "Checked 50 retailers, updated 3 policies"
}
```

**API Endpoints Used:**
- `GET {RETORO_API_URL}/retailers` - Get all retailers
- `PUT {RETORO_API_URL}/retailers/{id}` - Update retailer policy

---

## Installation

1. Import each JSON file into your N8N instance
2. Configure credentials for:
   - Perplexity AI
   - Google Vision API (or alternative OCR)
   - OpenAI/Claude (for invoice parsing)
   - HTTP Request nodes (for Retoro API calls)
3. Set environment variables listed above
4. Test each flow individually before enabling in production

## Security

- All webhook endpoints require API key authentication via `RETORO_API_KEY`
- User IDs are validated in webhook handlers
- Rate limiting should be configured on Retoro API endpoints
- All inputs are sanitized before database operations

## Troubleshooting

### E-commerce Checker Issues
- **No results from Perplexity:** Check API key and rate limits
- **Invalid data extracted:** Review Perplexity prompt, may need refinement
- **Retailer not added:** Check Retoro API logs for validation errors

### Invoice Scraper Issues
- **OCR fails:** Verify image URL is accessible, check image quality
- **Parsing errors:** Review AI prompt, may need to handle edge cases
- **Retailer not matched:** Check fuzzy search logic, may need to improve matching

### Policy Verification Issues
- **Too many API calls:** Adjust schedule frequency, consider batching
- **False positives:** Review comparison logic, may need threshold adjustments

