"use client"

import { useState } from "react"
import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import RegistrationModal from "./registration-modal"
import { CurrencyTotal } from "./currency-total"

interface RegistrationBannerProps {
  itemCount: number
  totalValue: number
  variant?: "soft" | "medium" | "strong"
  preferredCurrency?: string
}

export default function RegistrationBanner({
  itemCount,
  totalValue,
  variant = "soft",
  preferredCurrency = "USD",
}: RegistrationBannerProps) {
  const [open, setOpen] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  const getMessage = () => {
    if (variant === "soft") {
      return "Save your returns and get reminders"
    } else if (variant === "medium") {
      return (
        <span>
          You're tracking {itemCount} return{itemCount !== 1 ? 's' : ''} worth{' '}
          <CurrencyTotal
            items={[{ price: totalValue, original_currency: 'USD', price_usd: totalValue }]}
            preferredCurrency={preferredCurrency}
            className="font-semibold"
          />
          . Save them permanently?
        </span>
      )
    } else {
      return `Save your ${itemCount} return${itemCount !== 1 ? 's' : ''} before you go?`
    }
  }

  return (
    <>
      <Card className="ios-rounded bg-primary/10 border-primary/20">
        <div className="p-4 flex items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm font-medium text-foreground">{getMessage()}</p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              size="sm"
              variant="shopify"
              className="ios-rounded"
              onClick={() => setOpen(true)}
            >
              Save My Returns
            </Button>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 ios-rounded"
              onClick={() => setDismissed(true)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </Card>

      <RegistrationModal
        open={open}
        onOpenChange={setOpen}
        itemCount={itemCount}
        totalValue={totalValue}
      />
    </>
  )
}

