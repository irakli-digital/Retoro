"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { CheckCircle2, XCircle, Trash2 } from "lucide-react"
import axios from "axios"
import { toast } from "sonner"
import { getUserIdClient } from "@/lib/auth-client"

interface ReturnItemActionsProps {
  itemId: string
}

export default function ReturnItemActions({ itemId }: ReturnItemActionsProps) {
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [deleteLoading, setDeleteLoading] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)

  // Get user ID from server (for authenticated users) or client (for anonymous)
  useEffect(() => {
    const fetchUserId = async () => {
      try {
        // Try to get authenticated user ID from server
        const response = await axios.get("/api/auth/session")
        if (response.data?.userId && response.data.userId !== "demo-user-123") {
          setUserId(response.data.userId)
        } else {
          // Fall back to anonymous user ID
          setUserId(getUserIdClient())
        }
      } catch (error) {
        // Fall back to anonymous user ID if API call fails
        setUserId(getUserIdClient())
      }
    }
    fetchUserId()
  }, [])

  const handleMarkReturned = async () => {
    if (!userId) {
      toast.error("Unable to determine user session")
      return
    }

    setLoading(true)
    try {
      await axios.patch(`/api/return-items/${itemId}`, {
        is_returned: true,
        user_id: userId,
      })
      
      toast.success("Item marked as returned")
      router.refresh()
    } catch (error: any) {
      console.error("Error marking as returned:", error)
      const errorMessage = error.response?.data?.error || "Failed to update item"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkKept = async () => {
    if (!userId) {
      toast.error("Unable to determine user session")
      return
    }

    setLoading(true)
    try {
      await axios.patch(`/api/return-items/${itemId}`, {
        is_returned: false,
        user_id: userId,
      })
      
      toast.success("Item marked as kept")
      router.refresh()
    } catch (error: any) {
      console.error("Error marking as kept:", error)
      const errorMessage = error.response?.data?.error || "Failed to update item"
      toast.error(errorMessage)
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    if (!userId) {
      toast.error("Unable to determine user session")
      return
    }

    setDeleteLoading(true)
    try {
      await axios.delete(`/api/return-items/${itemId}?user_id=${userId}`)
      
      toast.success("Item deleted")
      router.push("/")
      router.refresh()
    } catch (error: any) {
      console.error("Error deleting item:", error)
      const errorMessage = error.response?.data?.error || "Failed to delete item"
      toast.error(errorMessage)
    } finally {
      setDeleteLoading(false)
    }
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <Button
          variant="default"
          className="ios-rounded"
          onClick={handleMarkReturned}
          disabled={loading || !userId}
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Mark as Returned
        </Button>
        
        <Button
          variant="outline"
          className="ios-rounded"
          onClick={handleMarkKept}
          disabled={loading || !userId}
        >
          <XCircle className="mr-2 h-4 w-4" />
          Mark as Kept
        </Button>
      </div>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            variant="destructive"
            className="w-full ios-rounded"
            disabled={deleteLoading}
          >
            <Trash2 className="mr-2 h-4 w-4" />
            Delete Item
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent className="ios-rounded">
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Item?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this return item.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="ios-rounded">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="ios-rounded bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={deleteLoading}
            >
              {deleteLoading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}

