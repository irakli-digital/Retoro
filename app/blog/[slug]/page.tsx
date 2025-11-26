import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostBySlug, getAllPostSlugs } from "@/lib/queries";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { ArrowLeft, Calendar, Clock } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
// import AnnouncementBanner from "@/components/announcement-banner";
import { format } from "date-fns";
import { ka } from "date-fns/locale";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  try {
    const posts = await getAllPostSlugs();
    return posts.map((post) => ({
      slug: post.slug,
    }));
  } catch (error) {
    // If posts table doesn't exist or query fails, return empty array
    // This allows the build to succeed even without blog tables
    console.warn("Blog posts table not found, skipping static generation:", error);
    return [];
  }
}

// Revalidate every 60 seconds - fresh content without full rebuild  
export const revalidate = 60;

// Generate static params at build time, but allow new ones at runtime
export const dynamicParams = true;

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = await getPostBySlug(params.slug);
  
  if (!post) {
    return {
      title: "პოსტი ვერ მოიძებნა | Mypen.ge",
    };
  }

  return {
    title: `${post.title_ka} | Mypen.ge`,
    description: post.excerpt_ka || post.content_ka.substring(0, 160),
    openGraph: {
      title: post.title_ka,
      description: post.excerpt_ka || post.content_ka.substring(0, 160),
      images: post.featured_image ? [post.featured_image] : undefined,
    },
  };
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = await getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  const readingTime = Math.ceil(post.content_ka.split(' ').length / 200);

  return (
    <div className="min-h-screen bg-background">
      {/* <AnnouncementBanner /> */}
      <Header />
      <main className="container mx-auto px-4 py-16">
        <article className="mx-auto max-w-3xl">
          <Link href="/blog">
            <Button variant="ghost" className="mb-8">
              <ArrowLeft className="mr-2 h-4 w-4" />
              ბლოგზე დაბრუნება
            </Button>
          </Link>

          {post.featured_image && (
            <div className="mb-8 aspect-video relative overflow-hidden rounded-lg">
              <img
                src={post.featured_image}
                alt={post.title_ka}
                className="object-cover w-full h-full"
              />
            </div>
          )}

          <header className="mb-8">
            <h1 className="mb-4 text-4xl font-bold tracking-tight">
              {post.title_ka}
            </h1>
            
            <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <time dateTime={new Date(post.published_at).toISOString()}>
                  {format(new Date(post.published_at), "d MMMM, yyyy", { locale: ka })}
                </time>
              </div>
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span>{readingTime} წთ წასაკითხი</span>
              </div>
            </div>
          </header>

          <Separator className="mb-8" />

          <div 
            className="text-lg leading-relaxed space-y-6 [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:mt-12 [&>h1]:mb-6 [&>h2]:text-2xl [&>h2]:font-bold [&>h2]:mt-10 [&>h2]:mb-5 [&>h3]:text-xl [&>h3]:font-semibold [&>h3]:mt-8 [&>h3]:mb-4 [&>h4]:text-lg [&>h4]:font-semibold [&>h4]:mt-6 [&>h4]:mb-3 [&>p]:mb-6 [&>p]:leading-8 [&>ul]:mb-6 [&>ul]:pl-6 [&>li]:mb-3 [&>blockquote]:border-l-4 [&>blockquote]:border-primary [&>blockquote]:pl-6 [&>blockquote]:py-2 [&>blockquote]:my-8 [&>blockquote]:italic [&>blockquote]:bg-muted/30"
            dangerouslySetInnerHTML={{ __html: post.content_ka }}
          />

          <Separator className="my-12" />

          <div className="flex justify-between items-center">
            <Link href="/blog">
              <Button variant="outline">
                <ArrowLeft className="mr-2 h-4 w-4" />
                ყველა პოსტი
              </Button>
            </Link>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}