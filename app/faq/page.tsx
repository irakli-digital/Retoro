import { Metadata } from "next";
import { getPublishedFAQs } from "@/lib/queries";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { MessageCircleQuestion } from "lucide-react";
import Header from "@/components/header";
import Footer from "@/components/footer";
// import AnnouncementBanner from "@/components/announcement-banner";
import FAQSearch from "./faq-search";

export const metadata: Metadata = {
  title: "ხშირად დასმული კითხვები | Mypen.ge",
  description: "Mypen.ge-ის შესახებ ხშირად დასმული კითხვები და პასუხები",
};

// Revalidate every 60 seconds - fresh content without full rebuild
export const revalidate = 60;

export default async function FAQPage() {
  let allFAQs = [];
  
  try {
    allFAQs = await getPublishedFAQs();
  } catch (error) {
    console.log('Database table not found - showing empty state');
  }

  return (
    <div className="min-h-screen bg-background">
      {/* <AnnouncementBanner /> */}
      <Header />
      <main className="container mx-auto px-4 py-16">
        <div className="mx-auto max-w-4xl">
          {/* Header Section */}
          <div className="mb-12 text-center">
            <div className="mb-6 flex justify-center">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary/10">
                <MessageCircleQuestion className="h-10 w-10 text-primary" />
              </div>
            </div>
            <h1 className="mb-4 text-4xl font-bold tracking-tight">ხშირად დასმული კითხვები</h1>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Mypen.ge-ის შესახებ ყველაზე ხშირად დასმული კითხვების პასუხები
            </p>
          </div>

          {/* FAQ Search Component */}
          <FAQSearch faqs={allFAQs} />
        </div>
      </main>
      <Footer />
    </div>
  );
}