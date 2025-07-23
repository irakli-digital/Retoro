require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

async function checkPosts() {
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    console.log('📊 Checking database posts...\n');
    
    // Check all posts
    const allPosts = await sql`SELECT id, title_ka, slug, published, published_at FROM posts ORDER BY published_at DESC`;
    
    console.log(`Found ${allPosts.length} posts in database:`);
    allPosts.forEach((post, index) => {
      console.log(`${index + 1}. ${post.title_ka}`);
      console.log(`   Slug: ${post.slug}`);
      console.log(`   Published: ${post.published}`);
      console.log(`   Date: ${post.published_at}`);
      console.log('');
    });
    
    // Check published posts only
    const publishedPosts = await sql`SELECT id, title_ka, slug FROM posts WHERE published = true ORDER BY published_at DESC`;
    console.log(`📝 Published posts: ${publishedPosts.length}`);
    
    if (publishedPosts.length === 0) {
      console.log('⚠️  No published posts found!');
    }
    
  } catch (error) {
    console.error('❌ Error checking posts:', error);
  }
}

checkPosts();