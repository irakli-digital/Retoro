"use client"

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

export default function AppTabBar() {
  const pathname = usePathname()
  
  // Hide tab bar on landing page
  if (pathname === "/landing" || pathname.startsWith("/landing")) {
    return null
  }

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 md:hidden">
      {/* Safe area spacer for iPhone home indicator */}
      <div className="bg-background/80 ios-blur border-t border-border/50 safe-bottom">
        <div className="flex h-[49px] items-center justify-around px-2">
          {tabs.map((tab) => {
            const isActive = pathname === tab.href || (tab.href === "/" && pathname === "/")
            const Icon = tab.icon

            return (
              <Link
                key={tab.name}
                href={tab.href}
                className={cn(
                  "flex flex-col items-center justify-center gap-1 flex-1 py-1 transition-all duration-200",
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
                  {isActive && (
                    <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 h-0.5 w-4 bg-primary rounded-full animate-in fade-in duration-200" />
                  )}
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
  )
}

