"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter, useParams } from "next/navigation"
import AppHeader from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { toast } from "sonner"
import { CalendarIcon, Loader2, Search, X } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import axios from "axios"
import { COMMON_CURRENCIES, getCurrencySymbol } from "@/lib/currency"

interface RetailerPolicy {
  id: string
  name: string
  return_window_days: number
  policy_description: string | null
  website_url: string | null
  has_free_returns: boolean
}

interface ReturnItem {
  id: string
  retailer_id: string
  name: string | null
  price: number | null
  original_currency: string
  currency_symbol: string
  purchase_date: string
  return_deadline: string
  user_id: string
}

export default function EditItemPage() {
  const router = useRouter()
  const params = useParams()
  const itemId = params.id as string
  
  const [loading, setLoading] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [retailers, setRetailers] = useState<RetailerPolicy[]>([])
  const [preferredCurrency, setPreferredCurrency] = useState("USD")
  
  const [formData, setFormData] = useState({
    retailerId: "",
    name: "",
    price: "",
    currency: "USD",
    purchaseDate: new Date(),
  })

  const [selectedRetailer, setSelectedRetailer] = useState<RetailerPolicy | null>(null)
  const [retailerSearch, setRetailerSearch] = useState("")
  const [showRetailerResults, setShowRetailerResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load user's preferred currency
    const loadCurrency = async () => {
      try {
        const response = await axios.get("/api/settings/currency")
        setPreferredCurrency(response.data.currency || "USD")
      } catch (error) {
        console.error("Error loading currency:", error)
      }
    }
    loadCurrency()
  }, [])

  useEffect(() => {
    // Fetch item and retailers
    const fetchData = async () => {
      try {
        const [itemResponse, retailersResponse] = await Promise.all([
          axios.get(`/api/return-items/${itemId}`),
          axios.get("/api/retailers")
        ])
        
        const item: ReturnItem = itemResponse.data
        setRetailers(retailersResponse.data)
        
        // Set form data from item
        const retailer = retailersResponse.data.find((r: RetailerPolicy) => r.id === item.retailer_id)
        setSelectedRetailer(retailer || null)
        setRetailerSearch(retailer?.name || "")
        
        setFormData({
          retailerId: item.retailer_id,
          name: item.name || "",
          price: item.price ? item.price.toString() : "",
          currency: item.original_currency || preferredCurrency,
          purchaseDate: new Date(item.purchase_date),
        })
      } catch (error: any) {
        console.error("Error fetching data:", error)
        if (error.response?.status === 404) {
          toast.error("Item not found")
          router.push("/")
        } else {
          toast.error("Failed to load item")
        }
      } finally {
        setLoading(false)
      }
    }
    
    fetchData()
  }, [itemId, router, preferredCurrency])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowRetailerResults(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])

  const filteredRetailers = retailers.filter((retailer) =>
    retailer.name.toLowerCase().includes(retailerSearch.toLowerCase())
  )

  const handleRetailerSelect = (retailer: RetailerPolicy) => {
    setSelectedRetailer(retailer)
    setFormData({ ...formData, retailerId: retailer.id })
    setRetailerSearch(retailer.name)
    setShowRetailerResults(false)
  }

  const handleSearchChange = (value: string) => {
    setRetailerSearch(value)
    setShowRetailerResults(true)
    if (!value) {
      setSelectedRetailer(null)
      setFormData({ ...formData, retailerId: "" })
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const purchaseDate = formData.purchaseDate
      const retailer = retailers.find(r => r.id === formData.retailerId)
      
      if (!retailer) {
        toast.error("Please select a retailer")
        setSubmitting(false)
        return
      }

      if (!formData.retailerId) {
        toast.error("Please select a retailer")
        setSubmitting(false)
        return
      }

      // Get user_id from session (handled server-side)
      const response = await axios.put(`/api/return-items/${itemId}`, {
        retailer_id: formData.retailerId,
        name: formData.name || null,
        price: formData.price ? parseFloat(formData.price) : null,
        currency: formData.currency,
        purchase_date: purchaseDate.toISOString(),
      })

      if (response.data) {
        toast.success("Item updated successfully")
        router.push(`/items/${itemId}`)
      }
    } catch (error: any) {
      console.error("Error updating item:", error)
      const errorMessage = error.response?.data?.error || error.message || "Failed to update item. Please try again."
      toast.error(errorMessage)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className="flex min-h-screen flex-col pb-[60px] md:pb-0">
        <AppHeader title="Edit Item" showBack backHref={`/items/${itemId}`} />
        <main className="flex-1 container mx-auto px-4 py-6">
          <div className="max-w-2xl mx-auto flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen flex-col pb-[60px] md:pb-0">
      <AppHeader 
        title="Edit Item" 
        showBack 
        backHref={`/items/${itemId}`}
      />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-4">
          {/* Retailer Selection - Live Search */}
          <div className="space-y-2 relative">
            <Label htmlFor="retailer" className="text-sm font-medium">Retailer</Label>
            <div className="relative" ref={searchRef}>
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input
                id="retailer"
                type="text"
                placeholder="Search retailers..."
                value={retailerSearch}
                onChange={(e) => handleSearchChange(e.target.value)}
                onFocus={() => setShowRetailerResults(true)}
                className="ios-rounded h-12 pl-9 pr-9"
                autoComplete="off"
              />
              {retailerSearch && (
                <button
                  type="button"
                  onClick={() => handleSearchChange("")}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
              
              {/* Search Results Dropdown */}
              {showRetailerResults && retailerSearch && (
                <div className="absolute z-50 w-full mt-1 bg-background border border-border ios-rounded shadow-lg max-h-60 overflow-auto">
                  {filteredRetailers.length > 0 ? (
                    filteredRetailers.map((retailer) => (
                      <button
                        key={retailer.id}
                        type="button"
                        onClick={() => handleRetailerSelect(retailer)}
                        className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center justify-between first:rounded-t-md last:rounded-b-md"
                      >
                        <span className="font-medium">{retailer.name}</span>
                      </button>
                    ))
                  ) : (
                    <div className="px-4 py-3">
                      <p className="text-sm text-muted-foreground">No retailers found</p>
                    </div>
                  )}
                </div>
              )}
            </div>
            {selectedRetailer && (
              <p className="text-xs text-muted-foreground px-1">
                {selectedRetailer.return_window_days === 0
                  ? "No deadline"
                  : `${selectedRetailer.return_window_days} day return window`}
              </p>
            )}
          </div>

          {/* Purchase Date */}
          <div className="space-y-2">
            <Label className="text-sm font-medium">Purchase Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal ios-rounded h-12",
                    !formData.purchaseDate && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {formData.purchaseDate ? (
                    format(formData.purchaseDate, "MMM d, yyyy")
                  ) : (
                    <span>Pick a date</span>
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={formData.purchaseDate}
                  onSelect={(date) => date && setFormData({ ...formData, purchaseDate: date })}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          {/* Optional Details */}
          <div className="space-y-3 pt-2">
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm text-muted-foreground">Item Name (optional)</Label>
              <Input
                id="name"
                placeholder="e.g., Black Dress"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="ios-rounded h-12"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="price" className="text-sm text-muted-foreground">Price (optional)</Label>
              <div className="flex gap-3">
                <div className="relative flex-1 min-w-0">
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none z-10 font-medium">
                    {getCurrencySymbol(formData.currency)}
                  </span>
                  <Input
                    id="price"
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="ios-rounded h-12 pl-10 w-full"
                  />
                </div>
                <div className="flex-shrink-0">
                  <Select
                    value={formData.currency}
                    onValueChange={(value) => setFormData({ ...formData, currency: value })}
                  >
                    <SelectTrigger className="w-[170px] ios-rounded h-12 min-w-[170px] flex-shrink-0">
                      <SelectValue className="truncate pr-6" />
                    </SelectTrigger>
                    <SelectContent className="min-w-[170px]">
                      {COMMON_CURRENCIES.map((curr) => (
                        <SelectItem key={curr.code} value={curr.code}>
                          <span className="flex items-center gap-2">
                            <span className="font-medium">{curr.code}</span>
                            <span className="text-muted-foreground">({curr.symbol})</span>
                          </span>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            variant={formData.retailerId ? "default" : "ghost"}
            className={cn(
              "w-full ios-rounded h-12 mt-6 transition-all duration-200",
              formData.retailerId 
                ? "bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm" 
                : "bg-transparent text-muted-foreground opacity-50 border-0 hover:bg-transparent"
            )}
            disabled={submitting || !formData.retailerId}
            size="lg"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Updating...
              </>
            ) : (
              "Update Item"
            )}
          </Button>
        </form>
      </main>
    </div>
  )
}

