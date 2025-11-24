import { sql } from './db';
import type { BlogPost, BlogPostPreview, FAQ, ReturnItem, RetailerPolicy, ReturnItemWithRetailer } from './types';
import { unstable_cache } from 'next/cache';

export const getPublishedPosts = unstable_cache(
  async (limit?: number): Promise<BlogPostPreview[]> => {
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
  },
  ['blog-posts'],
  {
    tags: ['blog-posts'],
    revalidate: 60 // 60 seconds
  }
);

export const getPostBySlug = unstable_cache(
  async (slug: string): Promise<BlogPost | null> => {
    const result = await sql`
      SELECT * FROM posts 
      WHERE slug = ${slug} AND published = true 
      LIMIT 1
    `;
    
    return result[0] as BlogPost || null;
  },
  ['blog-post'],
  {
    tags: ['blog-posts'],
    revalidate: 60 // 60 seconds
  }
);

export async function getAllPostSlugs(): Promise<{ slug: string }[]> {
  const result = await sql`
    SELECT slug FROM posts WHERE published = true
  `;
  
  return result as { slug: string }[];
}

export async function getFeaturedPosts(limit: number = 3): Promise<BlogPostPreview[]> {
  const result = await sql`
    SELECT id, title, title_ka, slug, excerpt, excerpt_ka, published_at, author, featured_image 
    FROM posts 
    WHERE published = true AND featured_image IS NOT NULL
    ORDER BY published_at DESC 
    LIMIT ${limit}
  `;
  
  return result as BlogPostPreview[];
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