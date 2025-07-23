import { revalidatePath, revalidateTag } from 'next/cache';

export function revalidateBlog() {
  // Revalidate blog listing page
  revalidatePath('/blog');
  
  // Revalidate all blog post pages  
  revalidateTag('blog-posts');
}

export function revalidateBlogPost(slug: string) {
  // Revalidate specific blog post
  revalidatePath(`/blog/${slug}`);
  
  // Also revalidate blog listing
  revalidatePath('/blog');
}