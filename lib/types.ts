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