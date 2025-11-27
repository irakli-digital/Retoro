"use client"

import { useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Plus } from "lucide-react"
import Link from "next/link"

export default function EmptyStateCard() {
  const [showEmptyState, setShowEmptyState] = useState(false)

  useEffect(() => {
    // Only show empty state if user has dismissed the welcome guide
    const hasSeenGuide = localStorage.getItem("onboarding_empty_state")
    if (hasSeenGuide) {
      setShowEmptyState(true)
    }
  }, [])

  // Don't show empty state if welcome guide is still visible
  if (!showEmptyState) {
    return null
  }

  return (
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
  )
}

