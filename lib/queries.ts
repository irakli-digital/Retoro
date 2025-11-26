import { sql } from './db';
import type { BlogPost, BlogPostPreview, FAQ, ReturnItem, RetailerPolicy, ReturnItemWithRetailer, User, MagicLinkToken, Session } from './types';
import { unstable_cache } from 'next/cache';

export const getPublishedPosts = unstable_cache(
  async (limit?: number): Promise<BlogPostPreview[]> => {
    try {
      const result = limit
        ? await sql`
            SELECT id, title, title_ka, slug, excerpt, excerpt_ka, published_at, author, featured_image 
            FROM posts 
            WHERE published = true 
            ORDER BY published_at DESC 
            LIMIT ${limit}
          `
        : await sql`
            SELECT id, title, title_ka, slug, excerpt, excerpt_ka, published_at, author, featured_image 
            FROM posts 
            WHERE published = true 
            ORDER BY published_at DESC
          `;
      
      return result as BlogPostPreview[];
    } catch (error: any) {
      // If posts table doesn't exist, return empty array
      if (error?.code === '42P01') {
        console.warn("Posts table does not exist, returning empty posts");
        return [];
      }
      throw error;
    }
  },
  ['blog-posts'],
  {
    tags: ['blog-posts'],
    revalidate: 60 // 60 seconds
  }
);

export const getPostBySlug = unstable_cache(
  async (slug: string): Promise<BlogPost | null> => {
    try {
      const result = await sql`
        SELECT * FROM posts 
        WHERE slug = ${slug} AND published = true 
        LIMIT 1
      `;
      
      return result[0] as BlogPost || null;
    } catch (error: any) {
      // If posts table doesn't exist, return null
      if (error?.code === '42P01') {
        console.warn("Posts table does not exist");
        return null;
      }
      throw error;
    }
  },
  ['blog-post'],
  {
    tags: ['blog-posts'],
    revalidate: 60 // 60 seconds
  }
);

export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
  try {
    const result = await sql`
      SELECT slug FROM posts WHERE published = true
    `;
    
    return result as { slug: string }[];
  } catch (error: any) {
    // If posts table doesn't exist, return empty array
    if (error?.code === '42P01') {
      console.warn("Posts table does not exist, returning empty slugs");
      return [];
    }
    throw error;
  }
}

export async function getFeaturedPosts(limit: number = 3): Promise<BlogPostPreview[]> {
  try {
    const result = await sql`
      SELECT id, title, title_ka, slug, excerpt, excerpt_ka, published_at, author, featured_image 
      FROM posts 
      WHERE published = true AND featured_image IS NOT NULL
      ORDER BY published_at DESC 
      LIMIT ${limit}
    `;
    
    return result as BlogPostPreview[];
  } catch (error: any) {
    // If posts table doesn't exist, return empty array
    if (error?.code === '42P01') {
      console.warn("Posts table does not exist, returning empty featured posts");
      return [];
    }
    throw error;
  }
}

// FAQ queries
export const getPublishedFAQs = unstable_cache(
  async (category?: string): Promise<FAQ[]> => {
    const result = category
      ? await sql`
          SELECT * FROM faqs 
          WHERE published = true AND category = ${category}
          ORDER BY sort_order ASC, created_at ASC
        `
      : await sql`
          SELECT * FROM faqs 
          WHERE published = true 
          ORDER BY sort_order ASC, created_at ASC
        `;
    
    return result as FAQ[];
  },
  ['faqs'],
  {
    tags: ['faqs'],
    revalidate: 60 // 60 seconds
  }
);

export const getFAQCategories = unstable_cache(
  async (): Promise<{ category: string; category_ka: string }[]> => {
    const result = await sql`
      SELECT DISTINCT category, category_ka 
      FROM faqs 
      WHERE published = true AND category IS NOT NULL
      ORDER BY category ASC
    `;
    
    return result as { category: string; category_ka: string }[];
  },
  ['faq-categories'],
  {
    tags: ['faqs'],
    revalidate: 60 // 60 seconds
  }
);

// Return Tracker Queries

export async function getAllRetailerPolicies(): Promise<RetailerPolicy[]> {
  const result = await sql`
    SELECT * FROM retailer_policies
    ORDER BY name ASC
  `;
  
  return result as RetailerPolicy[];
}

export async function getRetailerPolicy(retailerId: string): Promise<RetailerPolicy | null> {
  const result = await sql`
    SELECT * FROM retailer_policies
    WHERE id = ${retailerId}
    LIMIT 1
  `;
  
  return (result[0] as RetailerPolicy) || null;
}

export async function getReturnItemById(itemId: string): Promise<ReturnItemWithRetailer | null> {
  const result = await sql`
    SELECT 
      ri.*,
      json_build_object(
        'id', rp.id,
        'name', rp.name,
        'return_window_days', rp.return_window_days,
        'policy_description', rp.policy_description,
        'website_url', rp.website_url,
        'has_free_returns', rp.has_free_returns,
        'created_at', rp.created_at
      ) as retailer
    FROM return_items ri
    LEFT JOIN retailer_policies rp ON ri.retailer_id = rp.id
    WHERE ri.id = ${itemId}
    LIMIT 1
  `;
  
  if (result.length === 0) {
    return null;
  }
  
  return {
    ...result[0],
    retailer: result[0].retailer
  } as ReturnItemWithRetailer;
}

export async function getReturnItemsByUserId(userId: string): Promise<ReturnItemWithRetailer[]> {
  const result = await sql`
    SELECT 
      ri.*,
      json_build_object(
        'id', rp.id,
        'name', rp.name,
        'return_window_days', rp.return_window_days,
        'policy_description', rp.policy_description,
        'website_url', rp.website_url,
        'has_free_returns', rp.has_free_returns,
        'created_at', rp.created_at
      ) as retailer
    FROM return_items ri
    LEFT JOIN retailer_policies rp ON ri.retailer_id = rp.id
    WHERE ri.user_id = ${userId}
    ORDER BY ri.return_deadline ASC, ri.created_at DESC
  `;
  
  return result.map((row: any) => ({
    ...row,
    retailer: row.retailer
  })) as ReturnItemWithRetailer[];
}

export async function getActiveReturnItemsByUserId(userId: string): Promise<ReturnItemWithRetailer[]> {
  const result = await sql`
    SELECT 
      ri.*,
      json_build_object(
        'id', rp.id,
        'name', rp.name,
        'return_window_days', rp.return_window_days,
        'policy_description', rp.policy_description,
        'website_url', rp.website_url,
        'has_free_returns', rp.has_free_returns,
        'created_at', rp.created_at
      ) as retailer
    FROM return_items ri
    LEFT JOIN retailer_policies rp ON ri.retailer_id = rp.id
    WHERE ri.user_id = ${userId} AND ri.is_returned = false
    ORDER BY ri.return_deadline ASC
  `;
  
  return result.map((row: any) => ({
    ...row,
    retailer: row.retailer
  })) as ReturnItemWithRetailer[];
}

export async function addReturnItem(item: Omit<ReturnItem, 'id' | 'created_at' | 'updated_at'>): Promise<ReturnItem> {
  const result = await sql`
    INSERT INTO return_items (
      retailer_id, name, price, purchase_date, return_deadline, 
      is_returned, user_id
    )
    VALUES (
      ${item.retailer_id},
      ${item.name || null},
      ${item.price || null},
      ${item.purchase_date},
      ${item.return_deadline},
      ${item.is_returned || false},
      ${item.user_id}
    )
    RETURNING *
  `;
  
  return result[0] as ReturnItem;
}

export async function updateReturnStatus(
  itemId: string,
  isReturned: boolean,
  returnedDate?: Date
): Promise<void> {
  await sql`
    UPDATE return_items
    SET 
      is_returned = ${isReturned},
      returned_date = ${returnedDate || null},
      updated_at = NOW()
    WHERE id = ${itemId}
  `;
}

export async function deleteReturnItem(itemId: string, userId: string): Promise<void> {
  await sql`
    DELETE FROM return_items
    WHERE id = ${itemId} AND user_id = ${userId}
  `;
}

// User queries
export async function createUser(
  email: string,
  name: string | null,
  passwordHash: string | null,
  emailVerified: boolean = false
): Promise<string> {
  const result = await sql`
    INSERT INTO users (email, name, password_hash, email_verified)
    VALUES (${email}, ${name || null}, ${passwordHash || null}, ${emailVerified})
    RETURNING id
  `;
  
  return result[0].id as string;
}

export async function updateUserEmailVerified(userId: string): Promise<void> {
  await sql`
    UPDATE users
    SET email_verified = true, email_verified_at = NOW(), updated_at = NOW()
    WHERE id = ${userId}
  `;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const result = await sql`
    SELECT * FROM users
    WHERE email = ${email}
    LIMIT 1
  `;
  
  return (result[0] as User) || null;
}

export async function getUserById(userId: string): Promise<User | null> {
  const result = await sql`
    SELECT * FROM users
    WHERE id = ${userId}
    LIMIT 1
  `;
  
  return (result[0] as User) || null;
}

// Migrate anonymous session data to registered user
export async function migrateAnonymousData(anonymousUserId: string, newUserId: string): Promise<number> {
  const result = await sql`
    UPDATE return_items
    SET user_id = ${newUserId}
    WHERE user_id = ${anonymousUserId}
    RETURNING id
  `;
  
  return result.length;
}

// Magic link token queries
export async function createMagicLinkToken(
  userId: string,
  token: string,
  expiresAt: Date
): Promise<void> {
  await sql`
    INSERT INTO magic_link_tokens (user_id, token, expires_at)
    VALUES (${userId}, ${token}, ${expiresAt.toISOString()})
  `;
}

export async function getMagicLinkToken(token: string): Promise<MagicLinkToken | null> {
  const result = await sql`
    SELECT * FROM magic_link_tokens
    WHERE token = ${token} AND used = false AND expires_at > NOW()
    LIMIT 1
  `;
  
  return (result[0] as MagicLinkToken) || null;
}

export async function markMagicLinkTokenAsUsed(token: string): Promise<void> {
  await sql`
    UPDATE magic_link_tokens
    SET used = true
    WHERE token = ${token}
  `;
}

// Session queries
import type { Session } from './types';

/**
 * Create a new session
 */
export async function createSession(
  userId: string,
  token: string,
  expiresAt: Date,
  ipAddress?: string | null,
  userAgent?: string | null
): Promise<Session> {
  const result = await sql`
    INSERT INTO sessions (user_id, token, expires_at, ip_address, user_agent)
    VALUES (${userId}, ${token}, ${expiresAt.toISOString()}, ${ipAddress || null}, ${userAgent || null})
    RETURNING *
  `;
  
  return result[0] as Session;
}

/**
 * Get session by token
 */
export async function getSessionByToken(token: string): Promise<Session | null> {
  const result = await sql`
    SELECT * FROM sessions
    WHERE token = ${token} AND expires_at > NOW()
    LIMIT 1
  `;
  
  return (result[0] as Session) || null;
}

/**
 * Update session last_used_at timestamp
 */
export async function updateSessionLastUsed(token: string): Promise<void> {
  await sql`
    UPDATE sessions
    SET last_used_at = NOW()
    WHERE token = ${token}
  `;
}

/**
 * Delete a session (logout)
 */
export async function deleteSession(token: string): Promise<void> {
  await sql`
    DELETE FROM sessions
    WHERE token = ${token}
  `;
}

/**
 * Delete all sessions for a user (logout from all devices)
 */
export async function deleteAllUserSessions(userId: string): Promise<void> {
  await sql`
    DELETE FROM sessions
    WHERE user_id = ${userId}
  `;
}

/**
 * Clean up expired sessions (can be run periodically)
 */
export async function cleanupExpiredSessions(): Promise<number> {
  const result = await sql`
    DELETE FROM sessions
    WHERE expires_at < NOW()
  `;
  
  return result.count || 0;
}