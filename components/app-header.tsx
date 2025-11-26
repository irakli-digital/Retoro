"use client"

import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import Logo from "@/components/logo"

interface AppHeaderProps {
  title: string
  showBack?: boolean
  backHref?: string
  rightAction?: React.ReactNode
  largeTitle?: boolean
  className?: string
}

export default function AppHeader({
  title,
  showBack = false,
  backHref,
  rightAction,
  largeTitle = false,
  className,
}: AppHeaderProps) {
  const router = useRouter()
  const pathname = usePathname()
  const isHomePage = pathname === "/"

  const handleBack = () => {
    if (backHref) {
      router.push(backHref)
    } else {
      router.back()
    }
  }

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full ios-blur border-b border-border bg-background",
        "safe-top transition-all duration-200",
        className
      )}
    >
      <div className="flex h-[44px] items-center justify-between px-4">
        {/* Left side - Back button or spacer */}
        <div className="flex min-w-[44px] items-center">
          {showBack && (
            <Button
              variant="ghost"
              size="icon"
              onClick={handleBack}
              className="h-8 w-8 -ml-2"
              aria-label="Go back"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
          )}
        </div>

        {/* Center - Logo on home page, Title on other pages */}
        <div className="flex-1 flex items-center justify-center">
          {isHomePage ? (
            <Link href="/" className="flex items-center">
              <Logo width={100} height={24} className="h-6" />
            </Link>
          ) : (
            <h1
              className={cn(
                "text-center font-semibold",
                largeTitle ? "text-xl" : "text-base"
              )}
            >
              {title}
            </h1>
          )}
        </div>

        {/* Right side - Action button or spacer */}
        <div className="flex min-w-[44px] items-center justify-end">
          {rightAction}
        </div>
      </div>
    </header>
  )
}

