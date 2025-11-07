"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AdvancedDriverDashboard from "@/components/apps/advanced-driver-dashboard"
import { authService } from "@/lib/auth-service"

export default function DriverDashboardPage() {
  const router = useRouter()
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      if (!authService.isAuthenticated()) {
        router.push("/auth")
        return
      }

      const authData = authService.getAuthData()
      if (authData.user?.role !== "driver") {
        router.push(`/dashboard/${authData.user?.role || 'admin'}`)
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

  return <AdvancedDriverDashboard userData={userData} onLogout={handleLogout} />
}
