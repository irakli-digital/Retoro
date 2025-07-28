import { AlertTriangle } from "lucide-react"

interface AnnouncementBannerProps {
  hide?: boolean
}

export default function AnnouncementBanner({ hide = false }: AnnouncementBannerProps) {
  if (hide) return null
  
  return (
    <div className="relative bg-amber-500 dark:bg-green-600 text-white">
      <div className="container flex items-center justify-center py-3 px-4">
        <div className="flex items-center gap-3">
          <AlertTriangle className="h-5 w-5 flex-shrink-0" />
          <p className="text-sm text-center">
          mypen.ge-ს ძველი ვერსიის პაკეტის მფლობელებმა, მონაცემების გადმოსატანად მოგვწერეთ: support@mypen.ge
          </p>
        </div>
      </div>
    </div>
  )
}