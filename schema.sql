-- Blog posts table with bilingual support
CREATE TABLE IF NOT EXISTS posts (
  id SERIAL PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  title_ka VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  content_ka TEXT NOT NULL,
  excerpt TEXT,
  excerpt_ka TEXT,
  author VARCHAR(100),
  published_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  published BOOLEAN DEFAULT false,
  featured_image VARCHAR(500)
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_posts_slug ON posts(slug);
CREATE INDEX IF NOT EXISTS idx_posts_published ON posts(published, published_at DESC);

-- FAQ table with bilingual support
CREATE TABLE IF NOT EXISTS faqs (
  id SERIAL PRIMARY KEY,
  question VARCHAR(500) NOT NULL,
  question_ka VARCHAR(500) NOT NULL,
  answer TEXT NOT NULL,
  answer_ka TEXT NOT NULL,
  category VARCHAR(100),
  category_ka VARCHAR(100),
  sort_order INTEGER DEFAULT 0,
  published BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for better performance
CREATE INDEX IF NOT EXISTS idx_faqs_published ON faqs(published, sort_order ASC);
CREATE INDEX IF NOT EXISTS idx_faqs_category ON faqs(category, sort_order ASC);

-- Sample data (optional)
-- INSERT INTO posts (title, title_ka, slug, content, content_ka, excerpt, excerpt_ka, author, published)
-- VALUES 
-- ('Getting Started with AI', 'AI-ს დაწყება', 'getting-started-with-ai', 
--  'Content about AI...', 'AI-ს შესახებ კონტენტი...', 
--  'Learn the basics of AI', 'ისწავლეთ AI-ს საფუძვლები',
--  'Mypen Team', true);

-- Sample FAQ data (optional)
-- INSERT INTO faqs (question, question_ka, answer, answer_ka, category, category_ka, sort_order)
-- VALUES 
-- ('What is Mypen?', 'რა არის Mypen?', 
--  'Mypen is an AI-powered writing assistant...', 'Mypen არის AI-ზე დაფუძნებული წერის ასისტენტი...',
--  'General', 'ზოგადი', 1);