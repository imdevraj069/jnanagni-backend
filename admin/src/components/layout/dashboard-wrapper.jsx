"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuthStore } from "@/store/auth-store"
import { DashboardLayout } from "./dashboard-layout"

export function DashboardWrapper({ children, title, requiredRole }) {
  const router = useRouter()
  const { isAuthenticated, user } = useAuthStore()

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push("/auth/login")
      return
    }

    const userRole = user.specialRoles?.[0] || "volunteer"

    // If requiredRole is specified, check if user has the required role
    if (requiredRole && userRole !== requiredRole && userRole !== "admin") {
      router.push(`/dashboard/${userRole}`)
    }
  }, [isAuthenticated, user, requiredRole, router])

  if (!isAuthenticated || !user) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="inline-flex h-12 w-12 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-muted-foreground">Authenticating...</p>
        </div>
      </div>
    )
  }

  return <DashboardLayout title={title}>{children}</DashboardLayout>
}
