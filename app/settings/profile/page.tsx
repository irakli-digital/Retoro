import { Metadata } from "next"
import { getUserId, getCurrentUser } from "@/lib/auth-server"
import { getUserById, getReturnItemsByUserId } from "@/lib/queries"
import { redirect } from "next/navigation"
import AppHeader from "@/components/app-header"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { User, Mail, Calendar, Package, CheckCircle2, XCircle, DollarSign } from "lucide-react"
import { format } from "date-fns"
import { Badge } from "@/components/ui/badge"

export const dynamic = 'force-dynamic'

export const metadata: Metadata = {
  title: "Profile - Return Tracker",
  description: "View your profile and account statistics",
}

export default async function ProfilePage() {
  const userId = await getUserId()
  const currentUser = await getCurrentUser()

  // Redirect to home if not authenticated
  if (!currentUser || userId === "demo-user-123") {
    redirect("/")
  }

  // Get user data and stats
  const user = await getUserById(userId)
  if (!user) {
    redirect("/")
  }

  // Get user's return items for stats
  const allItems = await getReturnItemsByUserId(userId)
  const activeItems = allItems.filter(item => !item.is_returned && new Date(item.return_deadline) > new Date())
  const returnedItems = allItems.filter(item => item.is_returned)
  const keptItems = allItems.filter(item => !item.is_returned && new Date(item.return_deadline) <= new Date())
  
  const totalValue = allItems.reduce((sum, item) => sum + (Number(item.price_usd || item.price) || 0), 0)
  const returnedValue = returnedItems.reduce((sum, item) => sum + (Number(item.price_usd || item.price) || 0), 0)

  return (
    <div className="flex min-h-screen flex-col pb-[60px] md:pb-0">
      <AppHeader title="Profile" largeTitle />
      
      <main className="flex-1 container mx-auto px-4 py-6">
        <div className="max-w-2xl mx-auto space-y-6">
          {/* Profile Info Card */}
          <Card className="ios-rounded">
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
                  <User className="h-8 w-8 text-primary" />
                </div>
                <div className="flex-1">
                  <CardTitle className="text-xl">
                    {user.name || "User"}
                  </CardTitle>
                  <CardDescription className="flex items-center gap-2 mt-1">
                    <Mail className="h-3.5 w-3.5" />
                    {user.email}
                  </CardDescription>
                </div>
                {user.email_verified && (
                  <Badge variant="secondary" className="shrink-0">
                    <CheckCircle2 className="h-3 w-3 mr-1" />
                    Verified
                  </Badge>
                )}
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Calendar className="h-4 w-4" />
                <span>Member since {format(new Date(user.created_at), "MMMM d, yyyy")}</span>
              </div>
              {user.last_login_at && (
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Calendar className="h-4 w-4" />
                  <span>Last login {format(new Date(user.last_login_at), "MMM d, yyyy 'at' h:mm a")}</span>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Statistics */}
          <div>
            <h2 className="ios-section-header mb-2">Statistics</h2>
            <div className="grid grid-cols-2 gap-3">
              <Card className="ios-rounded">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <div className="text-sm text-muted-foreground">Total Items</div>
                  </div>
                  <div className="text-2xl font-bold">{allItems.length}</div>
                </CardContent>
              </Card>
              
              <Card className="ios-rounded">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <CheckCircle2 className="h-5 w-5 text-green-500" />
                    <div className="text-sm text-muted-foreground">Returned</div>
                  </div>
                  <div className="text-2xl font-bold text-green-500">{returnedItems.length}</div>
                </CardContent>
              </Card>
              
              <Card className="ios-rounded">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <XCircle className="h-5 w-5 text-muted-foreground" />
                    <div className="text-sm text-muted-foreground">Kept</div>
                  </div>
                  <div className="text-2xl font-bold">{keptItems.length}</div>
                </CardContent>
              </Card>
              
              <Card className="ios-rounded">
                <CardContent className="p-4">
                  <div className="flex items-center gap-3 mb-2">
                    <DollarSign className="h-5 w-5 text-green-500" />
                    <div className="text-sm text-muted-foreground">Money Saved</div>
                  </div>
                  <div className="text-2xl font-bold text-green-500">
                    ${returnedValue.toFixed(2)}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Account Info */}
          <div>
            <h2 className="ios-section-header mb-2">Account</h2>
            <Card className="ios-rounded">
              <CardContent className="p-0">
                <div className="p-4 ios-separator">
                  <div className="text-sm text-muted-foreground">Email</div>
                  <div className="font-medium">{user.email}</div>
                </div>
                <div className="p-4 ios-separator">
                  <div className="text-sm text-muted-foreground">Email Status</div>
                  <div className="font-medium">
                    {user.email_verified ? (
                      <Badge variant="secondary" className="mt-1">
                        <CheckCircle2 className="h-3 w-3 mr-1" />
                        Verified
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="mt-1">
                        Unverified
                      </Badge>
                    )}
                  </div>
                </div>
                <div className="p-4">
                  <div className="text-sm text-muted-foreground">Account Created</div>
                  <div className="font-medium">
                    {format(new Date(user.created_at), "MMMM d, yyyy 'at' h:mm a")}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  )
}

