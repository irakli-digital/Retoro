const { neon } = require('@neondatabase/serverless');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function addCurrencySymbol() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL not defined in .env.local');
  }

  const sql = neon(process.env.DATABASE_URL);

  console.log('📦 Adding currency_symbol support to database...\n');

  try {
    // Add currency_symbol column to return_items table
    console.log('Adding currency_symbol column to return_items...');
    await sql`
      ALTER TABLE return_items
      ADD COLUMN IF NOT EXISTS currency_symbol VARCHAR(10) DEFAULT ''
    `;
    console.log('✅ Added currency_symbol column to return_items');

    // Update existing return_items: set currency_symbol to empty string if null
    console.log('Updating existing return_items...');
    await sql`
      UPDATE return_items
      SET currency_symbol = ''
      WHERE currency_symbol IS NULL
    `;
    console.log('✅ Updated existing return_items');

    console.log('\n✅ Currency symbol support added successfully!');
  } catch (error) {
    console.error('❌ Error adding currency symbol support:', error);
    process.exit(1);
  }
}

addCurrencySymbol();

