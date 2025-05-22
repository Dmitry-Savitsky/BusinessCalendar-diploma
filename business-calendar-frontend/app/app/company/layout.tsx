"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { isAuthenticated, getUserRole } from "@/lib/auth"
import CompanySidebar from "@/components/company-sidebar"

export default function CompanyLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated and has the correct role
    if (!isAuthenticated() || getUserRole() !== "company") {
      router.push("/sign-in")
    } else {
      setLoading(false)
    }
  }, [router])

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-teal-500 border-t-transparent"></div>
      </div>
    )
  }

  return (
    <div className="flex min-h-screen">
      <CompanySidebar />
      <div className="flex-1 overflow-auto">{children}</div>
    </div>
  )
}
