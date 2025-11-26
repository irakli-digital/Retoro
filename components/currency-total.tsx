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
    const convertAll = async () => {
      try {
        const conversions = await Promise.all(
          items
            .filter(item => item.price && item.price > 0)
            .map(async (item) => {
              const originalCurrency = item.original_currency || 'USD'
              
              if (originalCurrency === preferredCurrency) {
                return item.price!
              }

              try {
                const response = await axios.get("/api/currency/convert", {
                  params: {
                    amount: item.price,
                    from: originalCurrency,
                    to: preferredCurrency,
                  },
                })
                return response.data.converted
              } catch (error) {
                // Fallback to USD price if conversion fails
                return item.price_usd || item.price || 0
              }
            })
        )

        const sum = conversions.reduce((acc, val) => acc + val, 0)
        setTotal(sum)
        setLoading(false)
      } catch (error) {
        console.error("Error calculating total:", error)
        // Fallback: sum USD prices
        const usdSum = items.reduce((sum, item) => sum + (item.price_usd || 0), 0)
        setTotal(usdSum)
        setLoading(false)
      }
    }

    convertAll()
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

