import { Metadata } from "next";
import Link from "next/link";
import { getPublishedPosts } from "@/lib/queries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, User } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
import AnnouncementBanner from "@/components/announcement-banner";
import { format } from "date-fns";
import { ka } from "date-fns/locale";

export const metadata: Metadata = {
  title: "ბლოგი | Mypen.ge",
  description: "AI-ს სამყაროს სიახლეები და რჩევები",
};

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBanner />
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
            <div className="grid gap-8">
              {posts.map((post) => (
                <Link key={post.id} href={`/blog/${post.slug}`}>
                  <Card className="transition-all hover:shadow-lg hover:-translate-y-1">
                    {post.featured_image && (
                      <div className="aspect-video relative overflow-hidden rounded-t-lg">
                        <img
                          src={post.featured_image}
                          alt={post.title_ka}
                          className="object-cover w-full h-full"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                        {post.author && (
                          <div className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            <span>{post.author}</span>
                          </div>
                        )}
                        <div className="flex items-center gap-1">
                          <Calendar className="h-4 w-4" />
                          <time dateTime={post.published_at.toISOString()}>
                            {format(new Date(post.published_at), "d MMMM, yyyy", { locale: ka })}
                          </time>
                        </div>
                      </div>
                      <CardTitle className="text-2xl">{post.title_ka}</CardTitle>
                      {post.excerpt_ka && (
                        <CardDescription className="text-base mt-2">
                          {post.excerpt_ka}
                        </CardDescription>
                      )}
                    </CardHeader>
                    <CardContent>
                      <Badge variant="secondary" className="hover:bg-secondary">
                        წაიკითხე მეტი →
                      </Badge>
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