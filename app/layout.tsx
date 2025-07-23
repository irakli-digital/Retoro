import type React from "react"
import "@/styles/globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
import Script from "next/script"
import AnnouncementBanner from "@/components/announcement-banner"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Mypen.ge - ᲓᲐᲖᲝᲒᲔ ᲓᲠᲝ. ᲬᲔᲠᲔ ᲣᲙᲔᲗᲔᲡᲐᲓ",
  description: "ყველა საბაზისო ინსტრუმენტი AI-სთან მუშაობის დასაწყებად.",
  icons: {
    icon: "/images/favicon.png",
  },
  generator: "v0.dev",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ka" suppressHydrationWarning>
      <head>
      </head>
      <body className={inter.className}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          {children}
        </ThemeProvider>
      </body>
    </html>
  )
}
