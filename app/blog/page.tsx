import { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/queries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, ArrowRight } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
// import AnnouncementBanner from "@/components/announcement-banner";
import { format } from "date-fns";
import { ka } from "date-fns/locale";

export const metadata: Metadata = {
  title: "ბლოგი | Mypen.ge",
  description: "AI-ს სამყაროს სიახლეები და რჩევები",
};

// Revalidate every 60 seconds - fresh content without full rebuild
export const revalidate = 60;

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="min-h-screen bg-background">
      {/* <AnnouncementBanner /> */}
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl">
          <div className="mb-12 text-center">
            <h1 className="mb-4 text-4xl font-bold tracking-tight">ბლოგი</h1>
            <p className="text-xl text-muted-foreground">
              AI-ს სამყაროს სიახლეები, რჩევები და საუკეთესო პრაქტიკები
            </p>
          </div>

          {posts.length === 0 ? (
            <div className="text-center py-12">
              <p className="text-muted-foreground">ჯერ არ არის ბლოგ პოსტები.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="h-full transition-all hover:shadow-md hover:-translate-y-1 group">
                    {post.featured_image && (
                      <div className="aspect-[16/9] relative overflow-hidden rounded-t-lg">
                        <img
                          src={post.featured_image}
                          alt={post.title_ka}
                          className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
                        />
                      </div>
                    )}
                    <CardHeader className="pb-4">
                      <div className="flex items-center gap-3 text-xs text-muted-foreground mb-3">
                        <div className="flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          <time dateTime={new Date(post.published_at).toISOString()}>
                            {format(new Date(post.published_at), "d MMM", { locale: ka })}
                          </time>
                        </div>
                      </div>
                      <CardTitle className="text-lg leading-tight line-clamp-2 group-hover:text-primary transition-colors">
                        {post.title_ka}
                      </CardTitle>
                      {post.excerpt_ka && (
                        <CardDescription className="text-sm mt-2 line-clamp-3">
                          {post.excerpt_ka}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent className="pt-0">
                      <div className="flex items-center text-sm text-primary font-medium group-hover:gap-2 transition-all">
                        <span>წაიკითხე მეტი</span>
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}