const { neon } = require('@neondatabase/serverless');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function addCurrencySupport() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not defined in .env.local');
  }

  const sql = neon(process.env.DATABASE_URL);

  console.log('📦 Adding currency support to database...\n');

  try {
    // Add currency fields to return_items table
    console.log('Adding currency fields to return_items...');
    await sql`
      ALTER TABLE return_items
      ADD COLUMN IF NOT EXISTS original_currency VARCHAR(3) DEFAULT 'USD',
      ADD COLUMN IF NOT EXISTS price_usd DECIMAL(10, 2)
    `;
    console.log('✅ Added currency fields to return_items');

    // Add preferred_currency to users table
    console.log('Adding preferred_currency to users...');
    await sql`
      ALTER TABLE users
      ADD COLUMN IF NOT EXISTS preferred_currency VARCHAR(3) DEFAULT 'USD'
    `;
    console.log('✅ Added preferred_currency to users');

    // Update existing return_items: set original_currency to USD and price_usd to price
    console.log('Updating existing return_items...');
    await sql`
      UPDATE return_items
      SET original_currency = 'USD',
          price_usd = price
      WHERE original_currency IS NULL OR price_usd IS NULL
    `;
    console.log('✅ Updated existing return_items');

    console.log('\n✅ Currency support added successfully!');
  } catch (error) {
    console.error('❌ Error adding currency support:', error);
    process.exit(1);
  }
}

addCurrencySupport();

