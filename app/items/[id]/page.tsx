import { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getReturnItemById } from "@/lib/queries";
import { getUserId } from "@/lib/auth-server";
import { getDaysRemaining, formatDaysRemaining, getUrgencyColor } from "@/lib/return-logic";
import AppHeader from "@/components/app-header";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ExternalLink, 
  CheckCircle2, 
  XCircle, 
  Calendar, 
  Package, 
  Store,
  Trash2,
  Edit,
  ArrowLeft
} from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import ReturnItemActions from "@/components/return-item-actions";

export const metadata: Metadata = {
  title: "Return Item Details - Return Tracker",
  description: "View and manage your return item",
};

export default async function ReturnItemDetailsPage({
  params,
}: {
  params: { id: string };
}) {
  const userId = await getUserId();
  let item;
  
  try {
    item = await getReturnItemById(params.id);
  } catch (error) {
    console.error("Error fetching item:", error);
    notFound();
  }

  if (!item) {
    notFound();
  }

  // Verify ownership
  if (item.user_id !== userId) {
    redirect("/");
  }

  const daysRemaining = getDaysRemaining(new Date(item.return_deadline));
  const urgencyColor = getUrgencyColor(daysRemaining);
  const retailer = item.retailer;

  return (
    <div className="flex min-h-screen flex-col pb-[60px] md:pb-0">
      <AppHeader 
        title="Item Details" 
        showBack 
        backHref="/"
        rightAction={
          <Link href={`/items/${params.id}/edit`}>
            <Button variant="ghost" size="sm">
              <Edit className="h-4 w-4" />
            </Button>
          </Link>
        }
      />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Status Badge */}
          {item.is_returned ? (
            <Card className="ios-rounded bg-green-50 dark:bg-green-950 border-green-200 dark:border-green-800">
              <CardContent className="p-4">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  <span className="font-semibold text-green-900 dark:text-green-100">
                    Returned
                  </span>
                  {item.returned_date && (
                    <span className="text-sm text-green-700 dark:text-green-300 ml-auto">
                      {format(new Date(item.returned_date), "MMM d, yyyy")}
                    </span>
                  )}
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className={cn("ios-rounded", daysRemaining < 0 && "bg-red-50 dark:bg-red-950 border-red-200 dark:border-red-800")}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Package className={cn("h-5 w-5", urgencyColor)} />
                    <span className={cn("font-semibold", urgencyColor)}>
                      {formatDaysRemaining(daysRemaining)}
                    </span>
                  </div>
                  <Badge 
                    variant={daysRemaining < 0 ? "destructive" : daysRemaining <= 2 ? "destructive" : daysRemaining <= 7 ? "secondary" : "default"}
                    className={cn("text-xs", urgencyColor)}
                  >
                    {daysRemaining < 0 ? "Overdue" : daysRemaining <= 2 ? "Urgent" : daysRemaining <= 7 ? "Due Soon" : "Active"}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Item Details */}
          <Card className="ios-rounded">
            <CardHeader>
              <CardTitle className="text-xl">
                {item.name || "Unnamed Item"}
              </CardTitle>
              {retailer && (
                <CardDescription className="flex items-center gap-2">
                  <Store className="h-4 w-4" />
                  <span>{retailer.name}</span>
                  {retailer.has_free_returns && (
                    <Badge variant="secondary" className="text-xs">
                      Free Returns
                    </Badge>
                  )}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Price */}
              {item.price && (
                <div className="flex items-center justify-between py-2 ios-separator">
                  <span className="text-sm text-muted-foreground">Price</span>
                  <span className="font-semibold text-lg">${Number(item.price).toFixed(2)}</span>
                </div>
              )}

              {/* Purchase Date */}
              <div className="flex items-center justify-between py-2 ios-separator">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Purchase Date</span>
                </div>
                <span className="font-medium">
                  {format(new Date(item.purchase_date), "MMMM d, yyyy")}
                </span>
              </div>

              {/* Return Deadline */}
              <div className="flex items-center justify-between py-2 ios-separator">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Return Deadline</span>
                </div>
                <span className={cn("font-medium", urgencyColor)}>
                  {format(new Date(item.return_deadline), "MMMM d, yyyy")}
                </span>
              </div>

              {/* Retailer Policy */}
              {retailer && (
                <div className="pt-2">
                  <div className="text-sm text-muted-foreground mb-2">Return Policy</div>
                  <div className="p-3 bg-muted/50 ios-rounded">
                    <div className="text-sm font-medium mb-1">
                      {retailer.return_window_days === 0
                        ? "No deadline - free returns"
                        : `${retailer.return_window_days} days from purchase`}
                    </div>
                    {retailer.policy_description && (
                      <div className="text-xs text-muted-foreground">
                        {retailer.policy_description}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Actions */}
          {!item.is_returned && (
            <ReturnItemActions itemId={params.id} />
          )}

          {/* Return Portal Link */}
          {retailer?.website_url && (
            <Button 
              variant="default" 
              className="w-full ios-rounded" 
              size="lg"
              asChild
            >
              <a 
                href={retailer.website_url} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                <ExternalLink className="mr-2 h-4 w-4" />
                Open Return Portal
              </a>
            </Button>
          )}
        </div>
      </main>
    </div>
  );
}

