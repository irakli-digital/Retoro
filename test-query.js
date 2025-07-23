require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

async function testQuery() {
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    console.log('🔍 Testing blog page query...\n');
    
    // Test the exact query used in blog page
    const result = await sql`
      SELECT id, title, title_ka, slug, excerpt, excerpt_ka, published_at, author, featured_image 
      FROM posts 
      WHERE published = true 
      ORDER BY published_at DESC
    `;
    
    console.log(`Query returned ${result.length} posts:`);
    console.log(JSON.stringify(result, null, 2));
    
  } catch (error) {
    console.error('❌ Error with query:', error);
  }
}

testQuery();