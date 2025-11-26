"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Mail, Lock } from "lucide-react"
import { toast } from "sonner"
import axios from "axios"
import { getUserIdClient } from "@/lib/auth-client"
import GoogleAuthButton from "./google-auth-button"

interface RegistrationModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  itemCount?: number
  totalValue?: number
}

export default function RegistrationModal({
  open,
  onOpenChange,
  itemCount = 0,
  totalValue = 0,
}: RegistrationModalProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [name, setName] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [method, setMethod] = useState<"email" | "magic-link">("magic-link")

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const anonymousUserId = getUserIdClient()

      if (method === "magic-link") {
        // Send magic link
        await axios.post("/api/auth/register/magic-link", {
          email,
          name: name || null,
          anonymous_user_id: anonymousUserId,
        })
        
        onOpenChange(false)
      } else {
        // Email + password registration
        await axios.post("/api/auth/register", {
          email,
          password,
          name: name || null,
          anonymous_user_id: anonymousUserId,
        })
        
        onOpenChange(false)
        router.refresh()
      }
    } catch (error: any) {
      console.error("Registration error:", error)
      toast.error(error.response?.data?.error || "Failed to create account")
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="ios-rounded max-w-md bg-card border-border">
        <DialogHeader>
          <DialogTitle className="text-xl">Save Your Returns</DialogTitle>
          <DialogDescription>
            {itemCount > 0 ? (
              <>
                You're tracking <strong>{itemCount} return{itemCount !== 1 ? 's' : ''}</strong>
                {totalValue > 0 && (
                  <> worth <strong>${totalValue.toFixed(2)}</strong></>
                )}
                . Create an account to save them permanently and get email reminders.
              </>
            ) : (
              "Create an account to save your returns and get email reminders."
            )}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Google OAuth Button */}
          <GoogleAuthButton />

          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t border-border" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-card px-2 text-muted-foreground">Or continue with</span>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Name (Optional)</Label>
            <Input
              id="name"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="ios-rounded"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="ios-rounded"
            />
          </div>

          {method === "email" && (
            <div className="space-y-2">
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                minLength={8}
                className="ios-rounded"
              />
              <p className="text-xs text-muted-foreground">
                Must be at least 8 characters
              </p>
            </div>
          )}

          <div className="flex gap-2">
            <Button
              type="button"
              variant={method === "email" ? "shopify" : "outline"}
              className="flex-1 ios-rounded"
              onClick={() => setMethod("email")}
              disabled={loading}
            >
              <Mail className="mr-2 h-4 w-4" />
              Email + Password
            </Button>
            
            <Button
              type="button"
              variant={method === "magic-link" ? "shopify" : "outline"}
              className="flex-1 ios-rounded"
              onClick={() => setMethod("magic-link")}
              disabled={loading}
            >
              <Lock className="mr-2 h-4 w-4" />
              Magic Link
            </Button>
          </div>

          <Button
            type="submit"
            variant="shopify"
            className="w-full ios-rounded"
            disabled={loading || !email || (method === "email" && !password)}
          >
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating Account...
              </>
            ) : (
              "Create Account"
            )}
          </Button>

          <p className="text-xs text-muted-foreground text-center">
            By continuing, you agree to our Terms of Service and Privacy Policy
          </p>
        </form>
      </DialogContent>
    </Dialog>
  )
}

