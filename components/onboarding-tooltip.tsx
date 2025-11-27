"use client"

import { useState, useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { X, ChevronRight } from "lucide-react"
import { cn } from "@/lib/utils"

interface OnboardingTooltipProps {
  id: string // Unique ID for this tooltip (e.g., "first-item-added")
  title: string
  description: string
  position?: "top" | "bottom" | "left" | "right"
  showSkip?: boolean
  onComplete?: () => void
  children?: React.ReactNode
}

export default function OnboardingTooltip({
  id,
  title,
  description,
  position = "bottom",
  showSkip = true,
  onComplete,
  children,
}: OnboardingTooltipProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [isDismissed, setIsDismissed] = useState(false)

  useEffect(() => {
    // Check if this tooltip has been shown before
    const hasSeenTooltip = localStorage.getItem(`onboarding_${id}`)
    if (!hasSeenTooltip && !isDismissed) {
      // Small delay for better UX
      const timer = setTimeout(() => setIsVisible(true), 500)
      return () => clearTimeout(timer)
    }
  }, [id, isDismissed])

  const handleComplete = () => {
    localStorage.setItem(`onboarding_${id}`, "true")
    setIsVisible(false)
    setIsDismissed(true)
    onComplete?.()
  }

  const handleSkip = () => {
    localStorage.setItem(`onboarding_${id}`, "skipped")
    setIsVisible(false)
    setIsDismissed(true)
  }

  if (!isVisible || isDismissed) {
    return <>{children}</>
  }

  return (
    <div className="relative">
      {children}
      <div
        className={cn(
          "fixed z-50 pointer-events-none",
          position === "top" && "bottom-full mb-2 left-1/2 -translate-x-1/2",
          position === "bottom" && "top-full mt-2 left-1/2 -translate-x-1/2",
          position === "left" && "right-full mr-2 top-1/2 -translate-y-1/2",
          position === "right" && "left-full ml-2 top-1/2 -translate-y-1/2"
        )}
      >
        <Card className="ios-rounded shadow-lg pointer-events-auto w-[280px]">
          <CardContent className="p-4">
            <div className="flex items-start justify-between mb-2">
              <h4 className="font-semibold text-sm">{title}</h4>
              {showSkip && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-5 w-5 -mt-1 -mr-1"
                  onClick={handleSkip}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground mb-3">{description}</p>
            <Button
              size="sm"
              variant="shopify"
              className="w-full ios-rounded"
              onClick={handleComplete}
            >
              Got it
              <ChevronRight className="ml-1 h-3 w-3" />
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

