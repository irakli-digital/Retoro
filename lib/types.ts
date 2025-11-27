export interface BlogPost {
  id: number;
  title: string;
  title_ka: string;
  slug: string;
  content: string;
  content_ka: string;
  excerpt: string | null;
  excerpt_ka: string | null;
  author: string | null;
  published_at: string | Date; // Database returns string, can be converted to Date
  updated_at: string | Date;
  published: boolean;
  featured_image: string | null;
}

export type BlogPostPreview = Pick<
  BlogPost,
  'id' | 'title' | 'title_ka' | 'slug' | 'excerpt' | 'excerpt_ka' | 'published_at' | 'author' | 'featured_image'
>;

export interface FAQ {
  id: number;
  question: string;
  question_ka: string;
  answer: string;
  answer_ka: string;
  category: string | null;
  category_ka: string | null;
  sort_order: number;
  published: boolean;
  created_at: string | Date;
  updated_at: string | Date;
}

// Return Tracker Types
export interface RetailerPolicy {
  id: string;
  name: string;
  return_window_days: number;
  policy_description: string | null;
  website_url: string | null;
  has_free_returns: boolean;
  created_at: string | Date;
}

export interface ReturnItem {
  id: string;
  retailer_id: string;
  name: string | null;
  price: number | null; // Price in original currency
  original_currency: string; // ISO 4217 currency code (e.g., 'USD', 'EUR', 'GEL')
  price_usd: number | null; // Price converted to USD
  currency_symbol: string; // Currency symbol (e.g., '$', '€', '₾', '₹')
  purchase_date: string | Date;
  return_deadline: string | Date;
  is_returned: boolean;
  returned_date: string | Date | null;
  user_id: string;
  created_at: string | Date;
  updated_at: string | Date;
}

export type ReturnItemWithRetailer = ReturnItem & {
  retailer?: RetailerPolicy;
};

export interface User {
  id: string;
  email: string;
  password_hash: string | null;
  name: string | null;
  email_verified: boolean;
  email_verified_at: string | Date | null;
  preferred_currency: string; // ISO 4217 currency code (e.g., 'USD', 'EUR', 'GEL')
  created_at: string | Date;
  updated_at: string | Date;
  last_login_at: string | Date | null;
}

export interface MagicLinkToken {
  id: string;
  user_id: string;
  token: string;
  expires_at: string | Date;
  used: boolean;
  created_at: string | Date;
}

export interface Session {
  id: string;
  user_id: string;
  token: string;
  expires_at: string | Date;
  created_at: string | Date;
  last_used_at: string | Date;
  ip_address: string | null;
  user_agent: string | null;
}