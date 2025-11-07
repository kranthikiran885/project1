"use client"

import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import ParentPortal from "@/components/apps/parent-portal"

export default function ParentDashboardPage() {
  const router = useRouter()
  const [userData, setUserData] = useState(null)

  useEffect(() => {
    const authData = localStorage.getItem("ctmsAuth")
    if (!authData) {
      router.push("/auth")
      return
    }

    const { role, user } = JSON.parse(authData)
    if (role !== "parent") {
      router.push(`/dashboard/${role}`)
      return
    }

    setUserData(user)
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("ctmsAuth")
    router.push("/")
  }

  if (!userData) return null

  return <ParentPortal userData={userData} onLogout={handleLogout} />
}
