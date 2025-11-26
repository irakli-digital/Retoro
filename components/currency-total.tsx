"use client"

import { useEffect, useState } from "react"
import { formatCurrency } from "@/lib/currency"
import { Loader2 } from "lucide-react"
import axios from "axios"

interface CurrencyTotalProps {
  items: Array<{
    price: number | null
    original_currency?: string
    price_usd?: number | null
  }>
  preferredCurrency: string
  className?: string
}

export function CurrencyTotal({ items, preferredCurrency, className = "" }: CurrencyTotalProps) {
  const [total, setTotal] = useState<number | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (items.length === 0) {
      setTotal(0)
      setLoading(false)
      return
    }

    // Calculate total in preferred currency
    // Strategy: Sum all USD prices first, then convert the total (more accurate and efficient)
    const calculateTotal = async () => {
      try {
        // First, sum all USD prices (use price_usd if available, otherwise convert price to USD)
        let totalUsd = 0
        
        for (const item of items) {
          if (!item.price || item.price <= 0) continue
          
          const originalCurrency = item.original_currency || 'USD'
          
          if (originalCurrency === 'USD') {
            // Already in USD, use price directly
            totalUsd += Number(item.price) || 0
          } else if (item.price_usd) {
            // Use pre-calculated USD price (most accurate)
            totalUsd += Number(item.price_usd) || 0
          } else {
            // Fallback: use price as-is (assume USD if no conversion available)
            console.warn(`Item missing price_usd, using price as USD: ${item.price}`)
            totalUsd += Number(item.price) || 0
          }
        }

        // If preferred currency is USD, we're done
        if (preferredCurrency === 'USD') {
          setTotal(totalUsd)
          setLoading(false)
          return
        }

        // Convert total USD to preferred currency
        try {
          const response = await axios.get("/api/currency/convert", {
            params: {
              amount: totalUsd,
              from: 'USD',
              to: preferredCurrency,
            },
          })
          setTotal(response.data.converted)
          setLoading(false)
        } catch (error) {
          console.error("Error converting total:", error)
          // Fallback: return USD total
          setTotal(totalUsd)
          setLoading(false)
        }
      } catch (error) {
        console.error("Error calculating total:", error)
        // Fallback: sum USD prices
        const usdSum = items.reduce((sum, item) => sum + (Number(item.price_usd) || Number(item.price) || 0), 0)
        setTotal(usdSum)
        setLoading(false)
      }
    }

    calculateTotal()
  }, [items, preferredCurrency])

  if (loading) {
    return (
      <span className={className}>
        <Loader2 className="h-4 w-4 inline animate-spin mr-1" />
        {formatCurrency(0, preferredCurrency)}
      </span>
    )
  }

  const numTotal = typeof total === 'number' ? total : parseFloat(String(total || 0)) || 0
  return <span className={className}>{formatCurrency(numTotal, preferredCurrency)}</span>
}

