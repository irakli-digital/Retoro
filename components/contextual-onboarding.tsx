"use client"

import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Plus } from "lucide-react"
import Link from "next/link"
import Image from "next/image"

interface ContextualOnboardingProps {
  itemCount: number
  isAuthenticated: boolean
}

export default function ContextualOnboarding({
  itemCount,
  isAuthenticated,
}: ContextualOnboardingProps) {
  const pathname = usePathname()

  // Show onboarding card only when dashboard is empty
  if (pathname === "/" && itemCount === 0) {
    return (
      <Card className="ios-rounded border-primary/20 bg-primary/5 mb-6">
        <CardContent className="p-6">
          {/* Mockup Image */}
          <div className="mb-6 pt-6 flex justify-center">
            <Image
              src="/images/mockup.webp"
              alt="App mockup"
              width={800}
              height={600}
              className="w-[70%] h-auto ios-rounded-lg object-cover"
              priority
            />
          </div>
          
          {/* Add Button - Top */}
          <Button
            asChild
            variant="default"
            className="w-full ios-rounded mb-6 bg-primary hover:bg-primary/90 shadow-lg text-white"
            size="lg"
          >
            <Link href="/add">
              <Plus className="mr-2 h-4 w-4" />
              Add Your First Purchase
            </Link>
          </Button>

          {/* How It Works Section */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <Package className="h-5 w-5 text-primary" />
              How it works
            </h3>
            <div className="space-y-3">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                  1
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Add your purchase</p>
                  <p className="text-xs text-muted-foreground">
                    Select retailer, add item details, and purchase date
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                  2
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">We track your return deadline</p>
                  <p className="text-xs text-muted-foreground">
                    Automatically calculated based on retailer policy
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center text-xs font-semibold text-primary">
                  3
                </div>
                <div className="flex-1">
                  <p className="text-sm font-medium">Get reminders</p>
                  <p className="text-xs text-muted-foreground">
                    Never miss a return deadline again
                  </p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    )
  }

  return null
}

// Hook to check if user has completed onboarding
export function useOnboardingStatus() {
  const [status, setStatus] = useState<Record<string, boolean>>({})

  useEffect(() => {
    if (typeof window === "undefined") return

    const checks = [
      "empty_state",
      "first_item_added",
      "first_item_viewed",
      "add_form_opened",
    ]

    const onboardingStatus: Record<string, boolean> = {}
    checks.forEach((key) => {
      onboardingStatus[key] = !!localStorage.getItem(`onboarding_${key}`)
    })

    setStatus(onboardingStatus)
  }, [])

  return status
}

