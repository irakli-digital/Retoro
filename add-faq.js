require('dotenv').config({ path: '.env.local' });
const { neon } = require('@neondatabase/serverless');

async function addFAQ() {
  const sql = neon(process.env.DATABASE_URL);
  
  try {
    const question = 'What is Mypen?';
    const question_ka = 'რა არის Mypen?';
    const answer = `<p>Mypen is an AI-powered writing assistant designed to help you create high-quality content efficiently. It can help with various writing tasks including:</p>
<ul>
<li>Blog posts and articles</li>
<li>Email composition</li>
<li>Social media content</li>
<li>Creative writing</li>
<li>Business documents</li>
</ul>
<p>Mypen uses advanced language models to understand context and provide relevant, well-structured responses to your writing needs.</p>`;
    
    const answer_ka = `<p>Mypen არის AI-ზე დაფუძნებული წერის ასისტენტი, რომელიც შექმნილია იმისთვის, რომ დაგეხმაროთ ეფექტურად შექმნათ მაღალი ხარისხის კონტენტი. ის შეგიძლიათ დაგეხმაროთ სხვადასხვა სახის წერითი ამოცანებში, მათ შორის:</p>
<ul>
<li>ბლოგ პოსტებისა და სტატიების წერაში</li>
<li>იმეილების შედგენაში</li>
<li>სოციალური მედიის კონტენტის შექმნაში</li>
<li>კრეატიულ წერაში</li>
<li>საბიზნესო დოკუმენტებში</li>
</ul>
<p>Mypen იყენებს მოწინავე ენობრივ მოდელებს კონტექსტის გასააზრებლად და თქვენი წერითი საჭიროებებისთვის შესაბამისი, კარგად სტრუქტურირებული პასუხების მისაცემად.</p>`;
    
    const category = 'General';
    const category_ka = 'ზოგადი';
    
    await sql`
      INSERT INTO faqs (
        question, question_ka, answer, answer_ka, 
        category, category_ka, sort_order, published
      )
      VALUES (
        ${question}, ${question_ka}, ${answer}, ${answer_ka},
        ${category}, ${category_ka}, 1, true
      )
    `;
    
    console.log('✅ FAQ added successfully!');
    console.log('❓ Question:', question_ka);
    console.log('📂 Category:', category_ka);
    console.log('🔗 URL: /faq');
    
  } catch (error) {
    console.error('❌ Error adding FAQ:', error);
  }
}

addFAQ();