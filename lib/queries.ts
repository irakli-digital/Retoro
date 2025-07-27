import { sql } from './db';
import type { BlogPost, BlogPostPreview, FAQ } from './types';
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