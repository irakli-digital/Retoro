"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, X, Trash2, ChevronRight } from "lucide-react"
import Link from "next/link"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { getDaysRemaining, formatDaysRemaining, getUrgencyColor, getUrgencyBadgeVariant } from "@/lib/return-logic"
import { CurrencyDisplay } from "@/components/currency-display"
import { Calendar, DollarSign } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { getUserIdClient } from "@/lib/auth-client"

interface ReturnItemWithRetailer {
  id: string
  name: string | null
  price: number | null
  price_usd: number | null
  original_currency: string | null
  purchase_date: string
  return_deadline: string
  retailer: {
    id: string
    name: string
    return_window_days: number
    website_url: string | null
    has_free_returns: boolean
  } | null
}

interface DashboardItemsListProps {
  items: ReturnItemWithRetailer[]
  preferredCurrency: string
}

export default function DashboardItemsList({ items, preferredCurrency }: DashboardItemsListProps) {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState("")
  const [bulkMode, setBulkMode] = useState(false)
  const [selectedItems, setSelectedItems] = useState<Set<string>>(new Set())
  const [deletingItems, setDeletingItems] = useState<Set<string>>(new Set())
  const [userId, setUserId] = useState<string | null>(null)

  // Get user ID from server (for authenticated users) or client (for anonymous)
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        // Try to get authenticated user ID from server
        const response = await axios.get("/api/auth/session")
        if (response.data?.userId && response.data.userId !== "demo-user-123") {
          setUserId(response.data.userId)
        } else {
          // Fall back to anonymous user ID
          setUserId(getUserIdClient())
        }
      } catch (error) {
        // Fall back to anonymous user ID if API call fails
        setUserId(getUserIdClient())
      }
    }
    fetchUserId()
  }, [])

  // Filter items based on search query
  const filteredItems = items.filter((item) => {
    if (!searchQuery.trim()) return true
    
    const query = searchQuery.toLowerCase()
    const itemName = (item.name || "").toLowerCase()
    const retailerName = (item.retailer?.name || "").toLowerCase()
    const price = item.price?.toString() || ""
    
    return (
      itemName.includes(query) ||
      retailerName.includes(query) ||
      price.includes(query)
    )
  })

  const handleToggleBulkMode = () => {
    setBulkMode(!bulkMode)
    setSelectedItems(new Set())
  }

  const handleToggleSelect = (itemId: string) => {
    const newSelected = new Set(selectedItems)
    if (newSelected.has(itemId)) {
      newSelected.delete(itemId)
    } else {
      newSelected.add(itemId)
    }
    setSelectedItems(newSelected)
  }

  const handleDeleteItem = async (itemId: string, e: React.MouseEvent) => {
    e.preventDefault()
    e.stopPropagation()

    if (!userId) {
      toast.error("Unable to determine user session")
      return
    }

    setDeletingItems((prev) => new Set(prev).add(itemId))

    try {
      await axios.delete(`/api/return-items/${itemId}?user_id=${userId}`)
      toast.success("Item deleted")
      router.refresh()
    } catch (error: any) {
      console.error("Error deleting item:", error)
      const errorMessage = error.response?.data?.error || "Failed to delete item"
      toast.error(errorMessage)
    } finally {
      setDeletingItems((prev) => {
        const next = new Set(prev)
        next.delete(itemId)
        return next
      })
    }
  }

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0 || !userId) {
      toast.error("Please select items to delete")
      return
    }

    const itemsToDelete = Array.from(selectedItems)
    setDeletingItems(new Set(itemsToDelete))

    try {
      // Delete all selected items
      await Promise.all(
        itemsToDelete.map((itemId) =>
          axios.delete(`/api/return-items/${itemId}?user_id=${userId}`)
        )
      )

      toast.success(`Deleted ${itemsToDelete.length} item(s)`)
      setBulkMode(false)
      setSelectedItems(new Set())
      router.refresh()
    } catch (error: any) {
      console.error("Error deleting items:", error)
      toast.error("Failed to delete some items")
    } finally {
      setDeletingItems(new Set())
    }
  }

  return (
    <div className="space-y-4">
      {/* Search and Bulk Action Bar */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by name, retailer, price..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-9 ios-rounded"
          />
        </div>
        <Button
          variant={bulkMode ? "default" : "outline"}
          size="icon"
          onClick={handleToggleBulkMode}
          className="ios-rounded shrink-0"
        >
          {bulkMode ? <X className="h-4 w-4" /> : <Trash2 className="h-4 w-4" />}
        </Button>
      </div>

      {/* Bulk Delete Button */}
      {bulkMode && selectedItems.size > 0 && (
        <div className="flex justify-between items-center">
          <span className="text-sm text-muted-foreground">
            {selectedItems.size} item(s) selected
          </span>
          <Button
            variant="destructive"
            onClick={handleBulkDelete}
            disabled={deletingItems.size > 0}
            className="ios-rounded"
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Selected
          </Button>
        </div>
      )}

      {/* Items List */}
      {filteredItems.length === 0 ? (
        <Card className="ios-rounded text-center py-12">
          <CardContent>
            <p className="text-muted-foreground">
              {searchQuery ? "No items found matching your search" : "No active returns"}
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2.5">
          {filteredItems.map((item) => {
            const daysRemaining = getDaysRemaining(new Date(item.return_deadline))
            const urgencyColor = getUrgencyColor(daysRemaining)
            const badgeVariant = getUrgencyBadgeVariant(daysRemaining)
            const retailer = item.retailer
            const isSelected = selectedItems.has(item.id)
            const isDeleting = deletingItems.has(item.id)

            return (
              <Card
                key={item.id}
                className={cn(
                  "ios-rounded ios-shadow transition-all",
                  bulkMode
                    ? "cursor-pointer hover:shadow-lg active:scale-[0.99] ios-tap-highlight"
                    : "",
                  isSelected && bulkMode && "ring-2 ring-primary"
                )}
                onClick={bulkMode ? () => handleToggleSelect(item.id) : undefined}
              >
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
                          <CurrencyDisplay
                            amount={item.price}
                            originalCurrency={item.original_currency || "USD"}
                            preferredCurrency={preferredCurrency}
                            className="text-xs font-medium text-foreground"
                          />
                        </div>
                      )}
                    </div>
                    {bulkMode ? (
                      <button
                        onClick={(e) => handleDeleteItem(item.id, e)}
                        disabled={isDeleting}
                        className={cn(
                          "p-1 rounded transition-colors",
                          isDeleting
                            ? "opacity-50 cursor-not-allowed"
                            : "hover:bg-destructive/10 text-destructive hover:text-destructive"
                        )}
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    ) : (
                      <Link href={`/items/${item.id}`} className="group">
                        <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                      </Link>
                    )}
                  </div>
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}
    </div>
  )
}



