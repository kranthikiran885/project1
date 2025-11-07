"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { authService } from "@/lib/auth-service"

export default function DashboardLayout({ children }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (!authService.isAuthenticated()) {
          router.push("/auth")
          return
        }
        
        const authData = authService.getAuthData()
        if (authData.user) {
          setUserData(authData.user)
        } else {
          router.push("/auth")
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push("/auth")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          <p className="mt-4 text-foreground">Loading...</p>
        </div>
      </div>
    )
  }

  return <>{children}</>
}
