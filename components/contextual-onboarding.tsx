"use client"

import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Package, Plus, ShoppingBag, Timer, Bell } from "lucide-react"
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
            className="w-full ios-rounded mb-8 bg-primary hover:bg-primary/90 shadow-lg text-white h-12 text-base"
            size="lg"
          >
            <Link href="/add">
              <Plus className="mr-2 h-5 w-5" />
              Add Your First Purchase
            </Link>
          </Button>

          {/* How It Works Section */}
          <div className="mt-8">
            <div className="relative flex items-center my-6">
              <div className="flex-grow border-t border-border/40"></div>
              <span className="flex-shrink mx-4 text-sm uppercase tracking-wider text-muted-foreground">How it works</span>
              <div className="flex-grow border-t border-border/40"></div>
            </div>
            <div className="space-y-3">
              {/* Step 1 */}
              <div className="flex items-start gap-4 p-3 rounded-xl bg-background/60 border border-border/10 shadow-sm">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm font-semibold text-foreground">Add your purchase</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Enter item details and purchase date. We support any retailer.
                  </p>
                </div>
              </div>

              {/* Step 2 */}
              <div className="flex items-start gap-4 p-3 rounded-xl bg-background/60 border border-border/10 shadow-sm">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Timer className="w-5 h-5" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm font-semibold text-foreground">We track deadlines</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Deadlines are automatically calculated based on store policy.
                  </p>
                </div>
              </div>

              {/* Step 3 */}
              <div className="flex items-start gap-4 p-3 rounded-xl bg-background/60 border border-border/10 shadow-sm">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                  <Bell className="w-5 h-5" />
                </div>
                <div className="flex-1 pt-1">
                  <p className="text-sm font-semibold text-foreground">Get reminders</p>
                  <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                    Receive notifications before your return window closes.
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

