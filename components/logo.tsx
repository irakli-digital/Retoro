"use client"

import Image from "next/image"
import { useTheme } from "next-themes"
import { useEffect, useState } from "react"
import { cn } from "@/lib/utils"

interface LogoProps {
  className?: string
  height?: number
  width?: number
  priority?: boolean
}

export default function Logo({ className, height, width, priority = false }: LogoProps) {
  const { theme } = useTheme()
  const [mounted, setMounted] = useState(false)

  // Prevent hydration mismatch
  useEffect(() => {
    setMounted(true)
  }, [])

  // Use dark logo for dark theme, light logo for light theme
  // Default to dark logo to match default theme
  const logoSrc = mounted && theme === "light"
    ? "/images/retoro-logo-light.svg"
    : "/images/retoro-logo-dark.svg"

  return (
    <Image
      src={logoSrc}
      alt="Retoro"
      height={height || 32}
      width={width || 120}
      className={cn("h-auto", className)}
      priority={priority}
    />
  )
}

