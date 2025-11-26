"use client"

import { useState } from "react"
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

  const handleMarkReturned = async () => {
    setLoading(true)
    try {
      const userId = getUserIdClient();
      await axios.patch(`/api/return-items/${itemId}`, {
        is_returned: true,
        user_id: userId,
      })
      
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error marking as returned:", error)
      toast.error("Failed to update item")
    } finally {
      setLoading(false)
    }
  }

  const handleMarkKept = async () => {
    setLoading(true)
    try {
      const userId = getUserIdClient();
      await axios.patch(`/api/return-items/${itemId}`, {
        is_returned: false,
        user_id: userId,
      })
      
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error marking as kept:", error)
      toast.error("Failed to update item")
    } finally {
      setLoading(false)
    }
  }

  const handleDelete = async () => {
    setDeleteLoading(true)
    try {
      const userId = getUserIdClient();
      await axios.delete(`/api/return-items/${itemId}?user_id=${userId}`)
      
      router.push("/")
      router.refresh()
    } catch (error) {
      console.error("Error deleting item:", error)
      toast.error("Failed to delete item")
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
          disabled={loading}
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          Mark as Returned
        </Button>
        
        <Button
          variant="outline"
          className="ios-rounded"
          onClick={handleMarkKept}
          disabled={loading}
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

