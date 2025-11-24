import { Metadata } from "next";
import { getActiveReturnItemsByUserId, getAllRetailerPolicies } from "@/lib/queries";
import { getDaysRemaining, formatDaysRemaining, getUrgencyColor } from "@/lib/return-logic";
import AppHeader from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Package, ExternalLink } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "Return Tracker - Never Miss a Return Deadline",
  description: "Track your purchases and never miss a return deadline again",
};

// TODO: Replace with actual user ID from authentication
const PLACEHOLDER_USER_ID = "demo-user-123";

export default async function DashboardPage() {
  // Fetch return items and retailer policies
  let returnItems = [];
  let retailers = [];
  
  try {
    [returnItems, retailers] = await Promise.all([
      getActiveReturnItemsByUserId(PLACEHOLDER_USER_ID),
      getAllRetailerPolicies(),
    ]);
  } catch (error) {
    console.error("Error fetching data:", error);
    // If tables don't exist yet, show empty state
  }

  return (
    <div className="flex min-h-screen flex-col pb-[60px] md:pb-0">
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

          {/* Stats Summary */}
          {returnItems.length > 0 && (
            <div className="grid grid-cols-3 gap-3 mb-6">
              <Card className="ios-rounded">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">Active</CardDescription>
                  <CardTitle className="text-xl">{returnItems.length}</CardTitle>
                </CardHeader>
              </Card>
              <Card className="ios-rounded">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">Due Soon</CardDescription>
                  <CardTitle className="text-xl">
                    {returnItems.filter(item => {
                      const days = getDaysRemaining(new Date(item.return_deadline));
                      return days >= 0 && days <= 7;
                    }).length}
                  </CardTitle>
                </CardHeader>
              </Card>
              <Card className="ios-rounded">
                <CardHeader className="pb-2">
                  <CardDescription className="text-xs">Total Value</CardDescription>
                  <CardTitle className="text-xl">
                    ${returnItems.reduce((sum, item) => sum + (item.price || 0), 0).toFixed(0)}
                  </CardTitle>
                </CardHeader>
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
                <Button asChild className="ios-rounded">
                  <Link href="/add">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Your First Purchase
                  </Link>
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-3">
              {returnItems.map((item) => {
                const daysRemaining = getDaysRemaining(new Date(item.return_deadline));
                const urgencyColor = getUrgencyColor(daysRemaining);
                const retailer = item.retailer;

                return (
                  <Card key={item.id} className="ios-rounded ios-shadow hover:shadow-lg transition-shadow">
                    <CardHeader className="pb-3">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <CardTitle className="text-base mb-1">
                            {item.name || "Unnamed Item"}
                          </CardTitle>
                          <CardDescription className="flex items-center gap-2 text-xs">
                            {retailer && (
                              <>
                                <span>{retailer.name}</span>
                                {retailer.has_free_returns && (
                                  <Badge variant="secondary" className="text-[10px] px-1.5 py-0">
                                    Free Returns
                                  </Badge>
                                )}
                              </>
                            )}
                          </CardDescription>
                        </div>
                        <Badge 
                          variant={daysRemaining < 0 ? "destructive" : daysRemaining <= 2 ? "destructive" : daysRemaining <= 7 ? "secondary" : "default"}
                          className={cn("text-xs", urgencyColor)}
                        >
                          {formatDaysRemaining(daysRemaining)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-sm mb-4">
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Purchase Date</div>
                          <div className="font-medium text-xs">
                            {format(new Date(item.purchase_date), "MMM d, yyyy")}
                          </div>
                        </div>
                        <div>
                          <div className="text-xs text-muted-foreground mb-1">Return Deadline</div>
                          <div className="font-medium text-xs">
                            {format(new Date(item.return_deadline), "MMM d, yyyy")}
                          </div>
                        </div>
                      </div>
                      {item.price && (
                        <div className="text-sm mb-4">
                          <div className="text-xs text-muted-foreground mb-1">Price</div>
                          <div className="font-semibold">${item.price.toFixed(2)}</div>
                        </div>
                      )}
                      <div className="flex gap-2">
                        {retailer?.website_url && (
                          <Button variant="outline" size="sm" className="ios-rounded flex-1" asChild>
                            <a 
                              href={retailer.website_url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                            >
                              Return Portal
                              <ExternalLink className="ml-2 h-3 w-3" />
                            </a>
                          </Button>
                        )}
                        <Button variant="outline" size="sm" className="ios-rounded flex-1" asChild>
                          <Link href={`/items/${item.id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
