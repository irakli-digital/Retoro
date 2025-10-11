"use client"

import { ReactNode } from "react"
import Header from "@/components/header"
// import AnnouncementBanner from "@/components/announcement-banner"

export default function LayoutWrapper({ children }: { children: ReactNode }) {
  return (
    <>
      <div className="fixed top-0 left-0 right-0 z-50">
        {/* <AnnouncementBanner /> */}
        <Header />
      </div>
      <div className="pt-16">
        {children}
      </div>
    </>
  )
}