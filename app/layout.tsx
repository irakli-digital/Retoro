import type React from "react"
import "@/styles/globals.css"
import { Inter } from "next/font/google"
import type { Metadata } from "next"
import { ThemeProvider } from "@/components/theme-provider"
// import AnnouncementBanner from "@/components/announcement-banner"
import { BeforeInteractiveScripts, AfterInteractiveScripts, LazyScripts } from "@/components/ScriptInjector"
import AppTabBar from "@/components/app-tab-bar"
import { Toaster } from "sonner"
import SessionProvider from "@/components/session-provider"

const inter = Inter({ subsets: ["latin"] })

export const metadata: Metadata = {
  title: "Retoro - Return Tracker",
  description: "Track your purchases and never miss a return deadline again",
  icons: {
    icon: "/images/retoro-logo-light.svg",
  },
  generator: "v0.dev",
  metadataBase: new URL('https://mypen.ge'),
  openGraph: {
    title: "Mypen.ge - ᲓᲐᲖᲝᲒᲔ ᲓᲠᲝ. ᲬᲔᲠᲔ ᲣᲙᲔᲗᲔᲡᲐᲓ",
    description: "ყველა საბაზისო ინსტრუმენტი AI-სთან მუშაობის დასაწყებად.",
    url: 'https://mypen.ge',
    siteName: 'Mypen.ge',
    images: [
      {
        url: '/images/og-image.webp', // <- OG IMAGE PATH HERE
        width: 1200,
        height: 630,
        alt: 'Mypen.ge - AI ინსტრუმენტები',
      }
    ],
    locale: 'ka_GE',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: "Mypen.ge - ᲓᲐᲖᲝᲒᲔ ᲓᲠᲝ. ᲬᲔᲠᲔ ᲣᲙᲔᲗᲔᲡᲐᲓ",
    description: "ყველა საბაზისო ინსტრუმენტი AI-სთან მუშაობის დასაწყებად.",
    images: ['/images/og-image.jpg'], // <- TWITTER IMAGE PATH HERE
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ka" suppressHydrationWarning>
      <head>
        {/* Scripts that need to load before page becomes interactive */}
        <BeforeInteractiveScripts />
      </head>
      <body className={inter.className}>
        {/* Scripts that load after page becomes interactive */}
        <AfterInteractiveScripts />
        
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem={false} disableTransitionOnChange>
          <SessionProvider>
            <div className="flex min-h-screen flex-col">
              {children}
              {/* iOS-style tab bar - only shows on mobile and app pages */}
              <AppTabBar />
            </div>
            <Toaster position="top-center" richColors />
          </SessionProvider>
        </ThemeProvider>
        
        {/* Scripts that load lazily when page is idle */}
        <LazyScripts />
      </body>
    </html>
  )
}
