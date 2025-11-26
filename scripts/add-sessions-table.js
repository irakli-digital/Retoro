/**
 * Script to add sessions table to database
 * Run with: node scripts/add-sessions-table.js
 */

import { neon } from '@neondatabase/serverless';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Load environment variables
dotenv.config({ path: join(__dirname, '../.env.local') });

const sql = neon(process.env.DATABASE_URL);

async function addSessionsTable() {
  try {
    console.log('🔄 Creating sessions table...\n');

    // Create sessions table
    await sql`
      CREATE TABLE IF NOT EXISTS sessions (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        token VARCHAR(255) UNIQUE NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT NOW(),
        last_used_at TIMESTAMP DEFAULT NOW(),
        ip_address VARCHAR(45),
        user_agent TEXT
      )
    `;

    console.log('✅ Sessions table created successfully!\n');

    // Create indexes
    console.log('🔄 Creating indexes...\n');

    await sql`
      CREATE INDEX IF NOT EXISTS idx_sessions_token ON sessions(token)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_sessions_user_id ON sessions(user_id)
    `;

    await sql`
      CREATE INDEX IF NOT EXISTS idx_sessions_expires ON sessions(expires_at)
    `;

    console.log('✅ Indexes created successfully!\n');

    // Clean up any expired sessions
    console.log('🔄 Cleaning up expired sessions...\n');
    const result = await sql`
      DELETE FROM sessions
      WHERE expires_at < NOW()
    `;
    console.log(`✅ Cleaned up expired sessions\n`);

    console.log('🎉 Sessions table setup complete!\n');
  } catch (error) {
    console.error('❌ Error creating sessions table:', error);
    process.exit(1);
  }
}

addSessionsTable();

