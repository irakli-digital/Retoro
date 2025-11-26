"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { Home, History, Plus, Settings } from "lucide-react"
import { cn } from "@/lib/utils"

const tabs = [
  {
    name: "Home",
    href: "/",
    icon: Home,
  },
  {
    name: "History",
    href: "/history",
    icon: History,
  },
  {
    name: "Add",
    href: "/add",
    icon: Plus,
  },
  {
    name: "Settings",
    href: "/settings",
    icon: Settings,
  },
]

function ScrollAwareGradient() {
  const [showGradient, setShowGradient] = useState(true)

  useEffect(() => {
    const checkScrollPosition = () => {
      // Check if user is at the bottom of the page
      const windowHeight = window.innerHeight
      const documentHeight = document.documentElement.scrollHeight
      const scrollTop = window.scrollY || document.documentElement.scrollTop
      
      // Tab bar height is 49px, add some threshold for smooth transition
      const tabBarHeight = 49
      const threshold = 20
      const bottomThreshold = tabBarHeight + threshold
      
      // Check if we're near or at the bottom
      const distanceFromBottom = documentHeight - (scrollTop + windowHeight)
      const isAtBottom = distanceFromBottom <= bottomThreshold
      
      setShowGradient(!isAtBottom)
    }

    // Check on mount and on scroll
    checkScrollPosition()
    window.addEventListener("scroll", checkScrollPosition, { passive: true })
    window.addEventListener("resize", checkScrollPosition, { passive: true })

    return () => {
      window.removeEventListener("scroll", checkScrollPosition)
      window.removeEventListener("resize", checkScrollPosition)
    }
  }, [])

  return (
    <div 
      className={cn(
        "fixed bottom-[49px] left-0 right-0 h-24 pointer-events-none z-40 md:hidden safe-bottom transition-opacity duration-300",
        showGradient ? "opacity-100" : "opacity-0"
      )}
    >
      <div className="h-full bg-gradient-to-t from-background via-background/60 via-background/30 to-transparent" />
    </div>
  )
}

export default function AppTabBar() {
  const pathname = usePathname()
  
  // Hide tab bar on landing page
  if (pathname === "/landing" || pathname.startsWith("/landing")) {
    return null
  }

  return (
    <>
      {/* Gradient overlay to soften content cutoff - only shows when not at bottom */}
      <ScrollAwareGradient />
      
      <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
        {/* Safe area spacer for iPhone home indicator */}
        <div className="bg-background ios-blur border-t border-border safe-bottom">
        <div className="flex h-[49px] items-center justify-around px-2">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href || (tab.href === "/" && pathname === "/")
            const Icon = tab.icon

            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all duration-200 ios-tap-highlight ios-touch-target",
                  isActive
                    ? "text-primary"
                    : "text-muted-foreground active:opacity-70"
                )}
              >
                <div className="relative">
                  <Icon className={cn(
                    "h-5 w-5 transition-transform duration-200",
                    isActive && "scale-110"
                  )} />
                </div>
                <span className={cn(
                  "text-[10px] font-medium leading-none transition-colors duration-200",
                  isActive ? "text-primary" : "text-muted-foreground"
                )}>
                  {tab.name}
                </span>
              </Link>
            )
          })}
        </div>
      </div>
    </nav>
    </>
  )
}

