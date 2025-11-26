const { neon } = require('@neondatabase/serverless');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env.local') });

async function addUsersTable() {
  if (!process.env.DATABASE_URL) {
    throw new Error('DATABASE_URL is not defined in .env.local');
  }

  const sql = neon(process.env.DATABASE_URL);

  console.log('📦 Adding users table...\n');

  try {
    // Create users table
    await sql`
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        email VARCHAR(255) UNIQUE NOT NULL,
        password_hash VARCHAR(255),
        name VARCHAR(255),
        created_at TIMESTAMP DEFAULT NOW(),
        updated_at TIMESTAMP DEFAULT NOW(),
        last_login_at TIMESTAMP
      )
    `;
    
    await sql`
      CREATE INDEX IF NOT EXISTS idx_users_email ON users(email)
    `;
    
    console.log('✅ Users table created successfully!\n');
    
  } catch (error) {
    console.error('❌ Error adding users table:', error);
    process.exit(1);
  }
}

addUsersTable();

