"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import AppHeader from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CalendarIcon, Loader2 } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import axios from "axios"

interface RetailerPolicy {
  id: string
  name: string
  return_window_days: number
  policy_description: string | null
  website_url: string | null
  has_free_returns: boolean
}

export default function AddPurchasePage() {
  const router = useRouter()
  const [retailers, setRetailers] = useState<RetailerPolicy[]>([])
  const [loading, setLoading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  
  const [formData, setFormData] = useState({
    retailerId: "",
    name: "",
    price: "",
    purchaseDate: new Date(),
  })

  const [selectedRetailer, setSelectedRetailer] = useState<RetailerPolicy | null>(null)

  useEffect(() => {
    // Fetch retailers
    const fetchRetailers = async () => {
      try {
        const response = await axios.get("/api/retailers")
        setRetailers(response.data)
      } catch (error) {
        console.error("Error fetching retailers:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchRetailers()
  }, [])

  const handleRetailerChange = (retailerId: string) => {
    const retailer = retailers.find(r => r.id === retailerId)
    setSelectedRetailer(retailer || null)
    setFormData({ ...formData, retailerId })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      // Calculate deadline
      const purchaseDate = formData.purchaseDate
      const retailer = retailers.find(r => r.id === formData.retailerId)
      
      if (!retailer) {
        alert("Please select a retailer")
        return
      }

      const returnDeadline = new Date(purchaseDate)
      if (retailer.return_window_days === 0) {
        returnDeadline.setFullYear(returnDeadline.getFullYear() + 10)
      } else {
        returnDeadline.setDate(returnDeadline.getDate() + retailer.return_window_days)
      }

      const response = await axios.post("/api/return-items", {
        retailer_id: formData.retailerId,
        name: formData.name || null,
        price: formData.price ? parseFloat(formData.price) : null,
        purchase_date: purchaseDate.toISOString(),
        return_deadline: returnDeadline.toISOString(),
        user_id: "demo-user-123", // TODO: Replace with actual user ID
      })

      if (response.data) {
        router.push("/")
      }
    } catch (error) {
      console.error("Error adding item:", error)
      alert("Failed to add item. Please try again.")
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col pb-[60px] md:pb-0">
      <AppHeader 
        title="Add Purchase" 
        showBack 
        backHref="/"
        rightAction={
          <Button
            variant="ghost"
            size="sm"
            onClick={handleSubmit}
            disabled={submitting || !formData.retailerId}
            className="text-primary"
          >
            {submitting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              "Save"
            )}
          </Button>
        }
      />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <form onSubmit={handleSubmit} className="max-w-2xl mx-auto space-y-6">
          {/* Retailer Selection */}
          <Card className="ios-rounded">
            <CardHeader>
              <CardTitle className="text-lg">Retailer</CardTitle>
              <CardDescription>Select where you made the purchase</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Select value={formData.retailerId} onValueChange={handleRetailerChange}>
                <SelectTrigger className="ios-rounded">
                  <SelectValue placeholder="Select retailer" />
                </SelectTrigger>
                <SelectContent>
                  {retailers.map((retailer) => (
                    <SelectItem key={retailer.id} value={retailer.id}>
                      {retailer.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              {selectedRetailer && (
                <div className="p-3 bg-muted/50 ios-rounded space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Return Policy</span>
                    {selectedRetailer.has_free_returns && (
                      <Badge variant="secondary" className="text-xs">Free Returns</Badge>
                    )}
                  </div>
                  <p className="text-sm text-muted-foreground">
                    {selectedRetailer.return_window_days === 0
                      ? "No deadline - free returns"
                      : `${selectedRetailer.return_window_days} days from purchase`}
                  </p>
                  {selectedRetailer.policy_description && (
                    <p className="text-xs text-muted-foreground">
                      {selectedRetailer.policy_description}
                    </p>
                  )}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Item Details */}
          <Card className="ios-rounded">
            <CardHeader>
              <CardTitle className="text-lg">Item Details</CardTitle>
              <CardDescription>Optional information about the purchase</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name">Item Name</Label>
                <Input
                  id="name"
                  placeholder="e.g., Black Dress"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="ios-rounded"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price (USD)</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  placeholder="0.00"
                  value={formData.price}
                  onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                  className="ios-rounded"
                />
              </div>
            </CardContent>
          </Card>

          {/* Purchase Date */}
          <Card className="ios-rounded">
            <CardHeader>
              <CardTitle className="text-lg">Purchase Date</CardTitle>
              <CardDescription>When did you make this purchase?</CardDescription>
            </CardHeader>
            <CardContent>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal ios-rounded",
                      !formData.purchaseDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.purchaseDate ? (
                      format(formData.purchaseDate, "PPP")
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
            </CardContent>
          </Card>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full ios-rounded"
            disabled={submitting || !formData.retailerId}
            size="lg"
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              "Add Purchase"
            )}
          </Button>
        </form>
      </main>
    </div>
  )
}

