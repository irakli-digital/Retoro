import { Metadata } from "next";
import { getActiveReturnItemsByUserId, getAllRetailerPolicies, getUserById } from "@/lib/queries";
import { getDaysRemaining } from "@/lib/return-logic";
import { getUserId, getCurrentUser } from "@/lib/auth-server";
import AppHeader from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Package } from "lucide-react";
import Link from "next/link";
import RegistrationBanner from "@/components/registration-banner";
import OAuthHandler from "@/components/oauth-handler";
import { Suspense } from "react";
import { CurrencyDisplay } from "@/components/currency-display";
import { CurrencyTotal } from "@/components/currency-total";
import DashboardItemsList from "@/components/dashboard-items-list";
import ContextualOnboarding from "@/components/contextual-onboarding";

export const dynamic = 'force-dynamic';

export const metadata: Metadata = {
  title: "Return Tracker - Never Miss a Return Deadline",
  description: "Track your purchases and never miss a return deadline again",
};

export default async function DashboardPage() {
  // Get user ID from session and check if user is authenticated
  const userId = await getUserId();
  const currentUser = await getCurrentUser();
  const isAuthenticated = currentUser !== null;
  
  // Debug logging for guest users
  if (!isAuthenticated) {
    console.log("[Dashboard] Guest user detected:", {
      userId,
      isAnonymous: userId.startsWith("user_") || userId === "demo-user-123",
    });
  }
  
  // Get user's preferred currency (default to USD)
  // Only authenticated users have entries in the users table (UUID format)
  // Anonymous users have IDs like "user_123..." which are not UUIDs
  const isAnonymousUserId = userId === "demo-user-123" || userId.startsWith("user_");
  const user = currentUser || (!isAnonymousUserId ? await getUserById(userId).catch(() => null) : null);
  const preferredCurrency = user?.preferred_currency || "USD";
  
  // Fetch return items and retailer policies
  let returnItems = [];
  let retailers = [];
  
  try {
    console.log("[Dashboard] Fetching items for user_id:", userId);
    [returnItems, retailers] = await Promise.all([
      getActiveReturnItemsByUserId(userId),
      getAllRetailerPolicies(),
    ]);
    console.log("[Dashboard] Found items:", returnItems.length);
  } catch (error) {
    console.error("[Dashboard] Error fetching data:", error);
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
          {/* Contextual Onboarding - Shows welcome guide for first-time users */}
          <ContextualOnboarding 
            itemCount={returnItems.length}
            isAuthenticated={isAuthenticated}
          />

          {/* Registration Banner - Only show for anonymous users */}
          {!isAuthenticated && returnItems.length > 0 && (
            <div className="mb-6">
              <RegistrationBanner
                itemCount={returnItems.length}
                totalValue={returnItems.reduce((sum, item) => sum + (Number(item.price_usd || item.price) || 0), 0)}
                variant={returnItems.length === 1 ? "soft" : returnItems.length === 2 ? "medium" : "strong"}
                preferredCurrency={preferredCurrency}
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
                    <CurrencyTotal 
                      items={returnItems.map(item => ({
                        price: item.price,
                        original_currency: item.original_currency,
                        price_usd: item.price_usd,
                      }))}
                      preferredCurrency={preferredCurrency}
                    />
                  </div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wide">Total Value</div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Return Items List */}
          {returnItems.length > 0 && (
            <DashboardItemsList items={returnItems} preferredCurrency={preferredCurrency} />
          )}
        </div>
      </main>
    </div>
  );
}
