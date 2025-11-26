const { neon } = require('@neondatabase/serverless');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function addAuthTables() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in .env.local');
  }

  const sql = neon(process.env.DATABASE_URL);

  console.log('📦 Adding authentication tables...\n');

  try {
    // Add email_verified column to users table if it doesn't exist
    try {
      await sql`
        ALTER TABLE users 
        ADD COLUMN IF NOT EXISTS email_verified BOOLEAN DEFAULT false,
        ADD COLUMN IF NOT EXISTS email_verified_at TIMESTAMP
      `;
      console.log('✅ Updated users table with email verification fields');
    } catch (error) {
      if (!error.message.includes('already exists')) {
        console.warn('Warning updating users table:', error.message);
      }
    }

    // Create magic_link_tokens table
    await sql`
      CREATE TABLE IF NOT EXISTS magic_link_tokens (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        used BOOLEAN DEFAULT false,
        created_at TIMESTAMP DEFAULT NOW()
      )
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_magic_tokens_token ON magic_link_tokens(token)
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_magic_tokens_user_id ON magic_link_tokens(user_id)
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_magic_tokens_expires ON magic_link_tokens(expires_at)
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified)
    `;
    
    console.log('✅ Magic link tokens table created successfully!\n');
    
  } catch (error) {
    console.error('❌ Error adding auth tables:', error);
    process.exit(1);
  }
}

addAuthTables();

