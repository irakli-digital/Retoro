"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Menu, X, Moon, Sun, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useTheme } from "next-themes"

interface HeaderProps {
  hideLoginButton?: boolean
  hideNavigation?: boolean
  notSticky?: boolean
}

export default function Header({ hideLoginButton = false, hideNavigation = false, notSticky = false }: HeaderProps) {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme, resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Determine if we should show the dark logo
  const isDarkTheme = !mounted ? true : theme === "dark" || resolvedTheme === "dark"

  useEffect(() => {
    setMounted(true)

    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleTheme = () => {
    setTheme(isDarkTheme ? "light" : "dark")
  }

  return (
    <header
      className={`${notSticky ? '' : 'sticky top-0'} z-50 w-full backdrop-blur-lg transition-all duration-300 ${isScrolled ? "bg-background/80 shadow-md" : "bg-transparent"}`}
    >
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center gap-2 font-bold">
          <Image
            src={isDarkTheme ? "/images/saasify-logo-dark.svg" : "/images/saasify-logo-light.svg"}
            alt="SaaSify Logo"
            width={150}
            height={35}
            className="h-auto max-w-[150px]"
            priority
          />
        </Link>
        {!hideNavigation && (
          <nav className="hidden md:flex gap-8">
            <Link
              href="/#features"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              მახასიათებლები
            </Link>
            <Link
              href="/#pricing"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              ფასი
            </Link>
            <Link
              href="/#faq"
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
            >
              FAQ
            </Link>
          </nav>
        )}
        <div className="hidden md:flex gap-3 items-center">
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
            {isDarkTheme ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
            <span className="sr-only">Toggle theme</span>
          </Button>

          {!hideLoginButton && (
            <>
              <Button variant="ghost" className="rounded-full" asChild>
                <Link href="https://chat.mypen.ge">
                  შესვლა
                </Link>
              </Button>
              <Button variant="default" className="rounded-full" asChild>
                <Link href="https://chat.mypen.ge">
                  დაიწყე უფასოდ
                  <ChevronRight className="ml-1 size-4" />
                </Link>
              </Button>
            </>
          )}
        </div>
        <div className="flex items-center gap-4 md:hidden">
          <Button variant="ghost" size="icon" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
            {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
            <span className="sr-only">Toggle menu</span>
          </Button>
          <Button variant="ghost" size="icon" onClick={toggleTheme} className="rounded-full">
            {isDarkTheme ? <Sun className="size-[18px]" /> : <Moon className="size-[18px]" />}
          </Button>
        </div>
      </div>
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden absolute top-16 inset-x-0 bg-background/95 backdrop-blur-lg border-b"
        >
          <div className="container py-4 flex flex-col gap-4">
            {!hideNavigation && (
              <>
                <Link href="/#features" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                  მახასიათებლები
                </Link>
                <Link href="/#pricing" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                  ფასი
                </Link>
                <Link href="/#faq" className="py-2 text-sm font-medium" onClick={() => setMobileMenuOpen(false)}>
                  FAQ
                </Link>
              </>
            )}
            {!hideLoginButton && (
              <div className="flex flex-col gap-2 pt-2 border-t">
                <Button variant="ghost" className="rounded-full w-full" asChild>
                  <Link href="https://chat.mypen.ge" onClick={() => setMobileMenuOpen(false)}>
                    შესვლა
                  </Link>
                </Button>
                <Button variant="default" className="rounded-full w-full" asChild>
                  <Link href="https://chat.mypen.ge" onClick={() => setMobileMenuOpen(false)}>
                    დაიწყე უფასოდ
                    <ChevronRight className="ml-1 size-4" />
                  </Link>
                </Button>
              </div>
            )}
          </div>
        </motion.div>
      )}
    </header>
  )
}
