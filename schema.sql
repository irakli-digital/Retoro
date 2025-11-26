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

-- Return Tracker Tables

-- Users table
CREATE TABLE IF NOT EXISTS users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255), -- NULL for passwordless/magic link
  name VARCHAR(255),
  email_verified BOOLEAN DEFAULT false,
  email_verified_at TIMESTAMP,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  last_login_at TIMESTAMP
);

-- Indexes for users
CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_users_email_verified ON users(email_verified);

-- Magic link tokens table
CREATE TABLE IF NOT EXISTS magic_link_tokens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  token VARCHAR(255) UNIQUE NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  used BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for magic link tokens
CREATE INDEX IF NOT EXISTS idx_magic_tokens_token ON magic_link_tokens(token);
CREATE INDEX IF NOT EXISTS idx_magic_tokens_user_id ON magic_link_tokens(user_id);
CREATE INDEX IF NOT EXISTS idx_magic_tokens_expires ON magic_link_tokens(expires_at);

-- Return Tracker Tables

-- Retailer policies table
CREATE TABLE IF NOT EXISTS retailer_policies (
  id VARCHAR(100) PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  return_window_days INTEGER NOT NULL,
  policy_description TEXT,
  website_url VARCHAR(500),
  has_free_returns BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for retailer policies
CREATE INDEX IF NOT EXISTS idx_retailer_policies_name ON retailer_policies(name);

-- Return items table
CREATE TABLE IF NOT EXISTS return_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  retailer_id VARCHAR(100) NOT NULL REFERENCES retailer_policies(id),
  name VARCHAR(255),
  price DECIMAL(10, 2),
  purchase_date TIMESTAMP NOT NULL,
  return_deadline TIMESTAMP NOT NULL,
  is_returned BOOLEAN DEFAULT false,
  returned_date TIMESTAMP,
  user_id VARCHAR(255) NOT NULL, -- UUID from users table or anonymous session ID
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Indexes for return items
CREATE INDEX IF NOT EXISTS idx_return_items_user_id ON return_items(user_id);
CREATE INDEX IF NOT EXISTS idx_return_items_return_deadline ON return_items(return_deadline);
CREATE INDEX IF NOT EXISTS idx_return_items_is_returned ON return_items(is_returned);
CREATE INDEX IF NOT EXISTS idx_return_items_user_deadline ON return_items(user_id, return_deadline);

-- Sample retailer policies (initial seed data)
INSERT INTO retailer_policies (id, name, return_window_days, policy_description, website_url, has_free_returns) VALUES
('zara', 'Zara', 30, '30 days from delivery date', 'https://www.zara.com/us/en/help/returns', false),
('nordstrom', 'Nordstrom', 0, 'No deadline - free returns', 'https://www.nordstrom.com/browse/customer-service/return-policy', true),
('asos', 'ASOS', 28, '28 days from delivery', 'https://www.asos.com/customer-care/returns/', true),
('macys', 'Macy''s', 90, '90 days from purchase', 'https://www.macys.com/service/returns/index', false),
('target', 'Target', 90, '90 days for most items', 'https://www.target.com/help/returns-exchanges', false),
('amazon', 'Amazon', 30, '30 days from delivery', 'https://www.amazon.com/gp/help/customer/display.html', true),
('h-m', 'H&M', 30, '30 days from purchase', 'https://www2.hm.com/en_us/customer-service/returns.html', false),
('gap', 'Gap', 30, '30 days from purchase', 'https://www.gap.com/customer-service/returns', true),
('old-navy', 'Old Navy', 30, '30 days from purchase', 'https://oldnavy.gap.com/customer-service/returns', true),
('banana-republic', 'Banana Republic', 30, '30 days from purchase', 'https://bananarepublic.gap.com/customer-service/returns', true)
ON CONFLICT (id) DO NOTHING;