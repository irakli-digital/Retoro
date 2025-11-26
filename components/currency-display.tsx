"use client"

import { useEffect, useState } from "react"
import { getCurrencySymbol, formatCurrency } from "@/lib/currency"
import { Loader2 } from "lucide-react"
import axios from "axios"

interface CurrencyDisplayProps {
  amount: number | null
  originalCurrency: string
  preferredCurrency: string
  showOriginal?: boolean
  className?: string
}

export function CurrencyDisplay({ 
  amount, 
  originalCurrency, 
  preferredCurrency,
  showOriginal = false,
  className = ""
}: CurrencyDisplayProps) {
  const [convertedAmount, setConvertedAmount] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!amount || amount === 0) {
      setConvertedAmount(0)
      setLoading(false)
      return
    }

    if (originalCurrency === preferredCurrency) {
      setConvertedAmount(amount)
      setLoading(false)
      return
    }

    // Convert currency via API
    axios.get("/api/currency/convert", {
      params: {
        amount,
        from: originalCurrency,
        to: preferredCurrency,
      },
    })
      .then((response) => {
        setConvertedAmount(response.data.converted)
        setLoading(false)
      })
      .catch((error) => {
        console.error("Currency conversion error:", error)
        // Fallback to original amount if conversion fails
        setConvertedAmount(amount)
        setLoading(false)
      })
  }, [amount, originalCurrency, preferredCurrency])

  if (loading) {
    return (
      <span className={className}>
        <Loader2 className="h-3 w-3 inline animate-spin mr-1" />
        {formatCurrency(amount || 0, originalCurrency)}
      </span>
    )
  }

  const displayAmount = convertedAmount ?? amount ?? 0

  return (
    <span className={className}>
      {formatCurrency(displayAmount, preferredCurrency)}
      {showOriginal && originalCurrency !== preferredCurrency && (
        <span className="text-xs text-muted-foreground ml-1">
          ({formatCurrency(amount || 0, originalCurrency)})
        </span>
      )}
    </span>
  )
}

