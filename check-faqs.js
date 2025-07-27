require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

async function checkFAQs() {
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    const faqs = await sql`
      SELECT id, question_ka, category_ka, published, sort_order
      FROM faqs 
      ORDER BY published DESC, sort_order ASC, created_at ASC
    `;
    
    console.log(`📋 Found ${faqs.length} FAQs in database:`);
    console.log('');
    
    if (faqs.length === 0) {
      console.log('💡 No FAQs found. Run "node add-faq.js" to add sample FAQ.');
      return;
    }
    
    // Group by status
    const published = faqs.filter(faq => faq.published);
    const unpublished = faqs.filter(faq => !faq.published);
    
    if (published.length > 0) {
      console.log('✅ Published FAQs:');
      published.forEach((faq, index) => {
        console.log(`   ${index + 1}. ${faq.question_ka}`);
        console.log(`      📂 Category: ${faq.category_ka || 'No category'}`);
        console.log(`      📊 Sort Order: ${faq.sort_order}`);
        console.log('');
      });
    }
    
    if (unpublished.length > 0) {
      console.log('❌ Unpublished FAQs:');
      unpublished.forEach((faq, index) => {
        console.log(`   ${index + 1}. ${faq.question_ka}`);
        console.log(`      📂 Category: ${faq.category_ka || 'No category'}`);
        console.log('');
      });
    }
    
    // Get categories
    const categories = await sql`
      SELECT DISTINCT category_ka 
      FROM faqs 
      WHERE published = true AND category_ka IS NOT NULL
      ORDER BY category_ka ASC
    `;
    
    if (categories.length > 0) {
      console.log(`📂 Categories (${categories.length}):`);
      categories.forEach((cat, index) => {
        console.log(`   ${index + 1}. ${cat.category_ka}`);
      });
    }
    
    console.log('');
    console.log('🔗 View FAQs at: http://localhost:3000/faq');
    
  } catch (error) {
    console.error('❌ Error checking FAQs:', error);
  }
}

checkFAQs();