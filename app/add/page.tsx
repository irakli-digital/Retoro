"use client"

import { useState, useEffect, useRef } from "react"
import { useRouter } from "next/navigation"
import AppHeader from "@/components/app-header"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { toast } from "sonner"
import { CalendarIcon, Loader2, Plus, ExternalLink, Search, X, Upload, Image as ImageIcon } from "lucide-react"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import axios from "axios"
import { COMMON_CURRENCIES, getCurrencySymbol } from "@/lib/currency"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
// user_id is now handled server-side via session, no need to import getUserIdClient

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
  const [uploadingInvoice, setUploadingInvoice] = useState(false)
  const [invoiceFile, setInvoiceFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  const [preferredCurrency, setPreferredCurrency] = useState("USD")
  const [loadingCurrency, setLoadingCurrency] = useState(true)
  
  const [formData, setFormData] = useState({
    retailerId: "",
    name: "",
    price: "",
    currency: "USD", // Will be set to user's preferred currency
    purchaseDate: new Date(), // Default to today
  })

  const [selectedRetailer, setSelectedRetailer] = useState<RetailerPolicy | null>(null)
  const [showAddRetailerDialog, setShowAddRetailerDialog] = useState(false)
  const [addingRetailer, setAddingRetailer] = useState(false)
  const [retailerSearch, setRetailerSearch] = useState("")
  const [showRetailerResults, setShowRetailerResults] = useState(false)
  const [newRetailer, setNewRetailer] = useState({
    name: "",
    return_window_days: "30",
    website_url: "",
    has_free_returns: false,
  })
  const searchRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Load user's preferred currency
    const loadCurrency = async () => {
      try {
        const response = await axios.get("/api/settings/currency")
        const currency = response.data.currency || "USD"
        setPreferredCurrency(currency)
        setFormData(prev => ({ ...prev, currency }))
      } catch (error) {
        console.error("Error loading currency:", error)
      } finally {
        setLoadingCurrency(false)
      }
    }
    loadCurrency()
  }, [])

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

  const handleAddNewClick = () => {
    setNewRetailer({ ...newRetailer, name: retailerSearch })
    setShowAddRetailerDialog(true)
    setShowRetailerResults(false)
  }

  const handleAddRetailer = async () => {
    if (!newRetailer.name.trim()) {
      toast.error("Please enter a retailer name")
      return
    }

    setAddingRetailer(true)
    try {
      const response = await axios.post("/api/retailers", {
        name: newRetailer.name.trim(),
        return_window_days: parseInt(newRetailer.return_window_days) || 30,
        website_url: newRetailer.website_url.trim() || null,
        has_free_returns: newRetailer.has_free_returns,
      })

      // Refresh retailers list
      const retailersResponse = await axios.get("/api/retailers")
      setRetailers(retailersResponse.data)

      // Select the newly added retailer
      setFormData({ ...formData, retailerId: response.data.id })
      setSelectedRetailer(response.data)
      setRetailerSearch(response.data.name)
      
      // Reset form and close dialog
      setNewRetailer({
        name: "",
        return_window_days: "30",
        website_url: "",
        has_free_returns: false,
      })
      setShowAddRetailerDialog(false)
    } catch (error: any) {
      console.error("Error adding retailer:", error)
      if (error.response?.status === 409) {
        toast.error("This retailer already exists")
      } else {
        toast.error("Failed to add retailer. Please try again.")
      }
    } finally {
      setAddingRetailer(false)
    }
  }

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setInvoiceFile(file)
    setUploadingInvoice(true)

    try {
      // Create FormData with the invoice file
      const formData = new FormData()
      formData.append("invoice", file)

      // Upload invoice and trigger n8n processing
      const response = await axios.post("/api/upload/invoice", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
        timeout: 60000, // 60 second timeout for n8n processing
      })

      const { job_id, status, result, error, validation_failed } = response.data

      // Check if validation failed (not a valid invoice)
      if (validation_failed && error) {
        toast.error(error)
        setUploadingInvoice(false)
        // Reset file input on validation error
        if (fileInputRef.current) {
          fileInputRef.current.value = ""
        }
        setInvoiceFile(null)
        return
      }

      // Show success message
      if (result && result.items_created && result.items_created.length > 0) {
        toast.success(`Successfully processed invoice! Added ${result.items_created.length} item(s).`)
      } else {
        toast.success("Invoice processed successfully! Items are being added...")
      }
      
      // Redirect immediately to dashboard
      router.push("/")
      
    } catch (error: any) {
      console.error("Error uploading invoice:", error)
      const errorMessage = error.response?.data?.error || error.message || "Failed to upload invoice. Please try again."
      toast.error(errorMessage)
      setUploadingInvoice(false)
      // Reset file input on error
      if (fileInputRef.current) {
        fileInputRef.current.value = ""
      }
      setInvoiceFile(null)
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

      // Validate purchase date
      if (!purchaseDate || isNaN(purchaseDate.getTime())) {
        toast.error("Please select a valid purchase date")
        setSubmitting(false)
        return
      }

      // Prepare request data
      const requestData = {
        retailer_id: formData.retailerId,
        name: formData.name || null,
        price: formData.price ? parseFloat(formData.price) : null,
        currency: formData.currency,
        purchase_date: purchaseDate.toISOString(),
      }

      console.log("[Add Purchase] Submitting:", requestData)

      // Note: user_id is now handled server-side via session
      const response = await axios.post("/api/return-items", requestData)

      if (response.data) {
        toast.success("Purchase added successfully!")
        router.push("/")
      }
    } catch (error: any) {
      console.error("[Add Purchase] Error adding item:", error)
      console.error("[Add Purchase] Error response:", error.response?.data)
      const errorMessage = error.response?.data?.error || error.response?.data?.details || error.message || "Failed to add item. Please try again."
      toast.error(errorMessage)
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
      />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        {/* Invoice Upload Option */}
        <div className="max-w-2xl mx-auto mb-6">
          <Card className="ios-rounded border-dashed border-primary/30 bg-gradient-to-br from-primary/5 to-primary/10 hover:border-primary/50 transition-all">
            <CardContent className="p-6">
              <div className="flex flex-col items-center justify-center gap-4">
                <div className="flex items-center gap-2 text-foreground">
                  <div className="p-2 rounded-full bg-primary/20">
                    <ImageIcon className="h-5 w-5 text-primary" />
                  </div>
                  <span className="text-sm font-medium">Or upload invoice (image, PDF, or document)</span>
                </div>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*,application/pdf,.doc,.docx,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                  onChange={handleFileChange}
                  className="hidden"
                  disabled={uploadingInvoice}
                />
                <Button
                  type="button"
                  variant="outline"
                  className="ios-rounded border-2 border-primary/50 bg-background hover:bg-primary/10 hover:border-primary text-primary shadow-md hover:shadow-lg transition-all duration-200 px-8 py-6 h-auto font-semibold text-base group"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploadingInvoice}
                >
                  {uploadingInvoice ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      <span>Processing Invoice...</span>
                    </>
                  ) : (
                    <>
                      <Upload className="mr-2 h-5 w-5 group-hover:scale-110 transition-transform duration-200" />
                      <span>Upload Invoice</span>
                    </>
                  )}
                </Button>
                {uploadingInvoice && (
                  <p className="text-xs text-muted-foreground text-center animate-pulse">
                    Extracting data from invoice... This may take a moment.
                  </p>
                )}
                {invoiceFile && !uploadingInvoice && (
                  <p className="text-xs text-muted-foreground">
                    {invoiceFile.name}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Show loading state when uploading invoice */}
        {uploadingInvoice && (
          <div className="max-w-2xl mx-auto mt-8">
            <Card className="ios-rounded">
              <CardContent className="p-8">
                <div className="flex flex-col items-center justify-center gap-4">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <div className="text-center">
                    <h3 className="text-lg font-semibold mb-2">Processing Invoice</h3>
                    <p className="text-sm text-muted-foreground">
                      Extracting data from your invoice and adding items to your dashboard...
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Hide form when uploading invoice */}
        {!uploadingInvoice && (
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
                    <>
                      {filteredRetailers.map((retailer) => (
                        <button
                          key={retailer.id}
                          type="button"
                          onClick={() => handleRetailerSelect(retailer)}
                          className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center justify-between first:rounded-t-md last:rounded-b-md"
                        >
                          <span className="font-medium">{retailer.name}</span>
                          {retailer.has_free_returns && (
                            <Badge variant="secondary" className="text-[10px]">Free Returns</Badge>
                          )}
                        </button>
                      ))}
                      <div className="border-t border-border">
                        <button
                          type="button"
                          onClick={handleAddNewClick}
                          className="w-full px-4 py-3 text-left hover:bg-muted transition-colors flex items-center gap-2 text-primary font-medium"
                        >
                          <Plus className="h-4 w-4" />
                          <span>Add "{retailerSearch}" as new retailer</span>
                        </button>
                      </div>
                    </>
                  ) : (
                    <div className="px-4 py-3">
                      <p className="text-sm text-muted-foreground mb-2">No retailers found</p>
                      <button
                        type="button"
                        onClick={handleAddNewClick}
                        className="w-full px-4 py-2 text-left hover:bg-muted transition-colors flex items-center gap-2 text-primary font-medium ios-rounded"
                      >
                        <Plus className="h-4 w-4" />
                        <span>Add "{retailerSearch}" as new retailer</span>
                      </button>
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

          {/* Purchase Date - Quick Access */}
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

          {/* Optional Details - Collapsed by Default */}
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
                Adding...
              </>
            ) : (
              "Add Purchase"
            )}
          </Button>

          {/* Request Official Retailer Link */}
          <div className="text-center pt-4">
            <a
              href="https://forms.gle/your-form-url-here"
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-muted-foreground hover:text-foreground transition-colors inline-flex items-center gap-1"
            >
              Request official retailer addition
              <ExternalLink className="h-3 w-3" />
            </a>
          </div>
        </form>
        )}
      </main>

      {/* Add Retailer Dialog */}
      <Dialog 
        open={showAddRetailerDialog} 
        onOpenChange={(open) => {
          setShowAddRetailerDialog(open)
          if (!open) {
            // Reset form when dialog closes
            setNewRetailer({
              name: "",
              return_window_days: "30",
              website_url: "",
              has_free_returns: false,
            })
          }
        }}
      >
        <DialogContent className="ios-rounded">
          <DialogHeader>
            <DialogTitle>Add New Retailer</DialogTitle>
            <DialogDescription>
              Add a retailer that's not in our list. You can always request official addition below.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="retailer-name">Retailer Name *</Label>
              <Input
                id="retailer-name"
                placeholder="e.g., My Store"
                value={newRetailer.name || retailerSearch}
                onChange={(e) => setNewRetailer({ ...newRetailer, name: e.target.value })}
                className="ios-rounded"
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="return-window">Return Window (days) *</Label>
              <Input
                id="return-window"
                type="number"
                min="0"
                placeholder="30"
                value={newRetailer.return_window_days}
                onChange={(e) => setNewRetailer({ ...newRetailer, return_window_days: e.target.value })}
                className="ios-rounded"
              />
              <p className="text-xs text-muted-foreground">
                Enter 0 for no deadline (like Nordstrom)
              </p>
            </div>

            <div className="space-y-2">
              <Label htmlFor="website-url">Website URL (optional)</Label>
              <Input
                id="website-url"
                type="url"
                placeholder="https://example.com"
                value={newRetailer.website_url}
                onChange={(e) => setNewRetailer({ ...newRetailer, website_url: e.target.value })}
                className="ios-rounded"
              />
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="free-returns"
                checked={newRetailer.has_free_returns}
                onChange={(e) => setNewRetailer({ ...newRetailer, has_free_returns: e.target.checked })}
                className="rounded"
              />
              <Label htmlFor="free-returns" className="text-sm font-normal cursor-pointer">
                Free returns
              </Label>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => setShowAddRetailerDialog(false)}
              className="ios-rounded flex-1"
            >
              Cancel
            </Button>
            <Button
              onClick={handleAddRetailer}
              disabled={addingRetailer || !newRetailer.name.trim()}
              className="ios-rounded flex-1"
              variant="shopify"
            >
              {addingRetailer ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                "Add Retailer"
              )}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  )
}

