import { Metadata } from "next";
import { getActiveReturnItemsByUserId, getAllRetailerPolicies } from "@/lib/queries";
import { getDaysRemaining, formatDaysRemaining, getUrgencyColor, getUrgencyBadgeVariant } from "@/lib/return-logic";
import { getUserId, getCurrentUser } from "@/lib/auth-server";
import AppHeader from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, ExternalLink, Calendar, DollarSign, ChevronRight } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import RegistrationBanner from "@/components/registration-banner";
import OAuthHandler from "@/components/oauth-handler";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Return Tracker - Never Miss a Return Deadline",
  description: "Track your purchases and never miss a return deadline again",
};

export default async function DashboardPage() {
  // Get user ID from session and check if user is authenticated
  const userId = await getUserId();
  const currentUser = await getCurrentUser();
  const isAuthenticated = currentUser !== null;
  
  // Fetch return items and retailer policies
  let returnItems = [];
  let retailers = [];
  
  try {
    [returnItems, retailers] = await Promise.all([
      getActiveReturnItemsByUserId(userId),
      getAllRetailerPolicies(),
    ]);
  } catch (error) {
    console.error("Error fetching data:", error);
    // If tables don't exist yet, show empty state
  }

  return (
    <div className="flex min-h-screen flex-col pb-[60px] md:pb-0">
      <Suspense fallback={null}>
        <OAuthHandler />
      </Suspense>
      <AppHeader 
        title="Return Tracker" 
        largeTitle
        rightAction={
          <Button variant="ghost" size="sm" asChild>
            <Link href="/add">
              <Plus className="h-5 w-5" />
            </Link>
          </Button>
        }
      />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Registration Banner - Only show for anonymous users */}
          {!isAuthenticated && returnItems.length > 0 && (
            <div className="mb-6">
              <RegistrationBanner
                itemCount={returnItems.length}
                totalValue={returnItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0)}
                variant={returnItems.length === 1 ? "soft" : returnItems.length === 2 ? "medium" : "strong"}
              />
            </div>
          )}

          {/* Stats Summary */}
          {returnItems.length > 0 && (
            <div className="grid grid-cols-3 gap-2.5 mb-5">
              <Card className="ios-rounded">
                <CardContent className="p-3 text-center">
                  <div className="text-2xl font-bold mb-0.5">{returnItems.length}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Active</div>
                </CardContent>
              </Card>
              <Card className="ios-rounded">
                <CardContent className="p-3 text-center">
                  <div className="text-2xl font-bold mb-0.5">
                    {returnItems.filter(item => {
                      const days = getDaysRemaining(new Date(item.return_deadline));
                      return days >= 0 && days <= 7;
                    }).length}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Due Soon</div>
                </CardContent>
              </Card>
              <Card className="ios-rounded">
                <CardContent className="p-3 text-center">
                  <div className="text-2xl font-bold mb-0.5">
                    ${returnItems.reduce((sum, item) => sum + (Number(item.price) || 0), 0).toFixed(0)}
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Total Value</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Return Items List */}
          {returnItems.length === 0 ? (
            <Card className="ios-rounded text-center py-12">
              <CardContent>
                <Package className="h-12 w-12 mx-auto mb-4 text-muted-foreground" />
                <h3 className="text-lg font-semibold mb-2">No active returns</h3>
                <p className="text-muted-foreground mb-6 text-sm">
                  Start tracking your purchases by adding your first item
                </p>
                <Button asChild variant="shopify" className="ios-rounded">
                  <Link href="/add">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Purchase
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-2.5">
              {returnItems.map((item) => {
                const daysRemaining = getDaysRemaining(new Date(item.return_deadline));
                const urgencyColor = getUrgencyColor(daysRemaining);
                const badgeVariant = getUrgencyBadgeVariant(daysRemaining);
                const retailer = item.retailer;

                return (
                  <Link key={item.id} href={`/items/${item.id}`}>
                    <Card className="ios-rounded ios-shadow hover:shadow-lg active:scale-[0.99] transition-all ios-tap-highlight cursor-pointer group">
                      <CardContent className="p-4">
                        {/* Header: Product name and days remaining */}
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex-1 min-w-0 pr-3">
                            <h3 className="text-base font-semibold mb-1 truncate">
                              {item.name || "Unnamed Item"}
                            </h3>
                            <div className="flex items-center gap-2 text-xs text-muted-foreground">
                              {retailer && (
                                <>
                                  <span>{retailer.name}</span>
                                  {retailer.has_free_returns && (
                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 h-4">
                                      Free Returns
                                    </Badge>
                                  )}
                                </>
                              )}
                            </div>
                          </div>
                          <Badge 
                            variant={badgeVariant}
                            className={cn("text-xs font-medium shrink-0", urgencyColor)}
                          >
                            {formatDaysRemaining(daysRemaining)}
                          </Badge>
                        </div>

                        {/* Info row: Date and Price */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-4 text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Calendar className="h-3.5 w-3.5" />
                              <span className="text-xs">
                                {format(new Date(item.return_deadline), "MMM d")}
                              </span>
                            </div>
                            {item.price && (
                              <div className="flex items-center gap-1.5">
                                <DollarSign className="h-3.5 w-3.5" />
                                <span className="text-xs font-medium text-foreground">
                                  ${Number(item.price).toFixed(2)}
                                </span>
                              </div>
                            )}
                          </div>
                          <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
