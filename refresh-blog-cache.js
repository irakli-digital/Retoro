// Simple utility to refresh blog cache after adding new posts
// Run this after adding new blog posts to immediately refresh the cache

const axios = require('axios');

async function refreshBlogCache() {
  const baseUrl = process.env.NEXT_PUBLIC_URL || 'http://localhost:3001';
  
  try {
    console.log('🔄 Refreshing blog cache...');
    
    // Hit the blog page to trigger revalidation
    await axios.get(`${baseUrl}/blog`);
    console.log('✅ Blog listing cache refreshed');
    
    // You can also refresh specific posts if needed
    // await axios.get(`${baseUrl}/blog/unique-mypenge-prompts`);
    
    console.log('🎉 Cache refresh complete!');
    
  } catch (error) {
    console.error('❌ Error refreshing cache:', error.message);
  }
}

refreshBlogCache();