"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import AdvancedStudentDashboard from "@/components/apps/advanced-student-dashboard"
import { authService } from "@/lib/auth-service"

export default function StudentDashboardPage() {
  const router = useRouter()
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      if (!authService.isAuthenticated()) {
        router.push("/auth")
        return
      }

      const authData = authService.getAuthData()
      if (authData.user?.role !== "student") {
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

  return <AdvancedStudentDashboard userData={userData} onLogout={handleLogout} />
}
