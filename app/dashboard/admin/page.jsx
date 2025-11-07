"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AdminDashboard from "@/components/dashboards/admin-dashboard"
import { authService } from "@/lib/auth-service"

export default function AdminDashboardPage() {
  const router = useRouter()
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      if (!authService.isAuthenticated()) {
        router.push("/auth")
        return
      }

      const authData = authService.getAuthData()
      if (authData.user?.role !== "admin") {
        router.push(`/dashboard/${authData.user?.role || 'student'}`)
        return
      }

      setUserData(authData.user)
    }

    checkAuth()
  }, [router])

  const handleLogout = () => {
    authService.logout()
    router.push("/")
  }

  if (!userData) return null

  return <AdminDashboard userData={userData} onLogout={handleLogout} />
}
