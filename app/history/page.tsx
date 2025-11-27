import { Metadata } from "next";
import { getReturnItemsByUserId } from "@/lib/queries";
import { getUserId } from "@/lib/auth-server";
import AppHeader from "@/components/app-header";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CheckCircle2, XCircle, DollarSign, Package, ChevronRight } from "lucide-react";
import { format } from "date-fns";
import Link from "next/link";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "History - Return Tracker",
  description: "View your return history and analytics",
};

export default async function HistoryPage() {
  const userId = await getUserId();
  let allItems = [];
  
  try {
    allItems = await getReturnItemsByUserId(userId);
  } catch (error) {
    console.error("Error fetching history:", error);
  }

  const returnedItems = allItems.filter(item => item.is_returned);
  const keptItems = allItems.filter(item => !item.is_returned);
  const totalValueReturned = returnedItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0);

  return (
    <div className="flex min-h-screen flex-col pb-[60px] md:pb-0">
      <AppHeader title="History" largeTitle />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Stats Summary */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            <Card className="ios-rounded">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Money Saved</CardDescription>
                <CardTitle className="text-2xl flex items-center gap-2">
                  ${totalValueReturned.toFixed(2)}
                </CardTitle>
              </CardHeader>
            </Card>
            <Card className="ios-rounded">
              <CardHeader className="pb-2">
                <CardDescription className="text-xs">Total Items</CardDescription>
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Package className="h-5 w-5 text-primary" />
                  {allItems.length}
                </CardTitle>
              </CardHeader>
            </Card>
          </div>

          {/* Filter Tabs */}
          <Tabs defaultValue="all" className="w-full">
            <TabsList className="grid w-full grid-cols-3 ios-rounded mb-4">
              <TabsTrigger value="all" className="ios-rounded">All</TabsTrigger>
              <TabsTrigger value="returned" className="ios-rounded">Returned</TabsTrigger>
              <TabsTrigger value="kept" className="ios-rounded">Kept</TabsTrigger>
            </TabsList>

            <TabsContent value="all" className="flex flex-col gap-2.5">
              {allItems.length === 0 ? (
                <Card className="ios-rounded">
                  <CardContent className="py-12 text-center">
                    <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No history yet</p>
                  </CardContent>
                </Card>
              ) : (
                allItems.map((item) => (
                  <HistoryItemCard key={item.id} item={item} />
                ))
              )}
            </TabsContent>

            <TabsContent value="returned" className="flex flex-col gap-2.5">
              {returnedItems.length === 0 ? (
                <Card className="ios-rounded">
                  <CardContent className="py-12 text-center">
                    <CheckCircle2 className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No returned items yet</p>
                  </CardContent>
                </Card>
              ) : (
                returnedItems.map((item) => (
                  <HistoryItemCard key={item.id} item={item} />
                ))
              )}
            </TabsContent>

            <TabsContent value="kept" className="flex flex-col gap-2.5">
              {keptItems.length === 0 ? (
                <Card className="ios-rounded">
                  <CardContent className="py-12 text-center">
                    <XCircle className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-muted-foreground">No kept items yet</p>
                  </CardContent>
                </Card>
              ) : (
                keptItems.map((item) => (
                  <HistoryItemCard key={item.id} item={item} />
                ))
              )}
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}

function HistoryItemCard({ item }: { item: any }) {
  const retailer = item.retailer;

  return (
    <Link href={`/items/${item.id}`} className="block">
      <Card className="ios-rounded ios-shadow hover:shadow-lg active:scale-[0.99] transition-all ios-tap-highlight cursor-pointer group">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0 pr-3">
              <CardTitle className="text-base mb-1">
                {item.name || "Unnamed Item"}
              </CardTitle>
              <CardDescription className="flex items-center gap-2">
                {retailer && <span>{retailer.name}</span>}
              </CardDescription>
            </div>
            <Badge variant={item.is_returned ? "default" : "secondary"} className="shrink-0">
              {item.is_returned ? (
                <CheckCircle2 className="h-3 w-3 mr-1" />
              ) : (
                <XCircle className="h-3 w-3 mr-1" />
              )}
              {item.is_returned ? "Returned" : "Kept"}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between text-sm">
            <div className="text-muted-foreground">
              Purchased: {format(new Date(item.purchase_date), "MMM d, yyyy")}
            </div>
            <div className="flex items-center gap-2">
              {item.price && (
                <div className="font-semibold">${Number(item.price).toFixed(2)}</div>
              )}
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          </div>
          {item.is_returned && item.returned_date && (
            <div className="text-sm text-muted-foreground mt-2">
              Returned: {format(new Date(item.returned_date), "MMM d, yyyy")}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

