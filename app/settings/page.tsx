"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import AppHeader from "@/components/app-header"
import { Card, CardContent } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import {
  Bell,
  Mail,
  User,
  Shield,
  HelpCircle,
  LogOut,
  ChevronRight,
  Moon,
  Sun,
  Loader2,
} from "lucide-react"
import Link from "next/link"
import { useTheme } from "next-themes"
import axios from "axios"
import { toast } from "sonner"

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [notifications, setNotifications] = useState(true)
  const [emailReminders, setEmailReminders] = useState(true)
  const [loggingOut, setLoggingOut] = useState(false)
  const router = useRouter()

  const handleSignOut = async () => {
    setLoggingOut(true)
    try {
      await axios.post("/api/auth/logout")
      toast.success("Signed out successfully")
      
      // Redirect to home page and refresh to clear server-side session
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error signing out:", error)
      toast.error("Failed to sign out. Please try again.")
    } finally {
      setLoggingOut(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col pb-[60px] md:pb-0">
      <AppHeader title="Settings" largeTitle />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Section */}
          <Card className="ios-rounded">
            <CardContent className="p-0">
              <Link
                href="/settings/profile"
                className="flex items-center justify-between p-4 ios-separator hover:bg-muted/50 active:bg-muted/70 transition-colors ios-tap-highlight"
              >
                <div className="flex items-center gap-3">
                  <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                    <User className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <div className="font-medium">Profile</div>
                    <div className="text-sm text-muted-foreground">Manage your account</div>
                  </div>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </Link>
            </CardContent>
          </Card>

          {/* Notifications Section */}
          <div>
            <h2 className="ios-section-header mb-2">Notifications</h2>
            <Card className="ios-rounded">
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-4 ios-separator ios-touch-target">
                  <div className="flex items-center gap-3">
                    <Bell className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="notifications" className="font-normal cursor-pointer">
                      Push Notifications
                    </Label>
                  </div>
                  <Switch
                    id="notifications"
                    checked={notifications}
                    onCheckedChange={setNotifications}
                  />
                </div>
                <div className="flex items-center justify-between p-4 ios-touch-target">
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <Label htmlFor="email-reminders" className="font-normal cursor-pointer">
                      Email Reminders
                    </Label>
                  </div>
                  <Switch
                    id="email-reminders"
                    checked={emailReminders}
                    onCheckedChange={setEmailReminders}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Appearance Section */}
          <div>
            <h2 className="ios-section-header mb-2">Appearance</h2>
            <Card className="ios-rounded">
              <CardContent className="p-0">
                <div className="flex items-center justify-between p-4">
                  <div className="flex items-center gap-3">
                    {theme === "dark" ? (
                      <Moon className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <Sun className="h-5 w-5 text-muted-foreground" />
                    )}
                    <Label htmlFor="theme" className="font-normal cursor-pointer">
                      Dark Mode
                    </Label>
                  </div>
                  <Switch
                    id="theme"
                    checked={theme === "dark"}
                    onCheckedChange={(checked) => setTheme(checked ? "dark" : "light")}
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Privacy & Security Section */}
          <div>
            <h2 className="ios-section-header mb-2">Privacy & Security</h2>
            <Card className="ios-rounded">
              <CardContent className="p-0">
                <Link
                  href="/settings/privacy"
                  className="flex items-center justify-between p-4 ios-separator hover:bg-muted/50 active:bg-muted/70 transition-colors ios-tap-highlight ios-touch-target"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <span>Privacy Policy</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
                <Link
                  href="/settings/data"
                  className="flex items-center justify-between p-4 hover:bg-muted/50 active:bg-muted/70 transition-colors ios-tap-highlight ios-touch-target"
                >
                  <div className="flex items-center gap-3">
                    <Shield className="h-5 w-5 text-muted-foreground" />
                    <span>Data Management</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* Support Section */}
          <div>
            <h2 className="ios-section-header mb-2">Support</h2>
            <Card className="ios-rounded">
              <CardContent className="p-0">
                <Link
                  href="/faq"
                  className="flex items-center justify-between p-4 ios-separator hover:bg-muted/50 active:bg-muted/70 transition-colors ios-tap-highlight ios-touch-target"
                >
                  <div className="flex items-center gap-3">
                    <HelpCircle className="h-5 w-5 text-muted-foreground" />
                    <span>Help & FAQ</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
                <Link
                  href="mailto:support@retoro.app"
                  className="flex items-center justify-between p-4 hover:bg-muted/50 active:bg-muted/70 transition-colors ios-tap-highlight ios-touch-target"
                >
                  <div className="flex items-center gap-3">
                    <Mail className="h-5 w-5 text-muted-foreground" />
                    <span>Contact Support</span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground" />
                </Link>
              </CardContent>
            </Card>
          </div>

          {/* About Section */}
          <div>
            <h2 className="ios-section-header mb-2">About</h2>
            <Card className="ios-rounded">
              <CardContent className="p-0">
                <div className="p-4 ios-separator">
                  <div className="text-sm text-muted-foreground">Version</div>
                  <div className="font-medium">1.0.0</div>
                </div>
                <div className="p-4">
                  <div className="text-sm text-muted-foreground">Build</div>
                  <div className="font-medium">MVP</div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sign Out */}
          <Button
            variant="destructive"
            className="w-full ios-rounded"
            onClick={handleSignOut}
            disabled={loggingOut}
          >
            {loggingOut ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Signing out...
              </>
            ) : (
              <>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </>
            )}
          </Button>
        </div>
      </main>
    </div>
  )
}

