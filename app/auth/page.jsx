"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import LoginPage from "@/components/auth/login-page"

export default function AuthPage() {
  const router = useRouter()

  const handleLogin = (role, userData) => {
    localStorage.setItem("ctmsAuth", JSON.stringify({ role, user: userData }))
    router.push(`/dashboard/${role}`)
  }

  const handleSignup = (role, userData) => {
    localStorage.setItem("ctmsAuth", JSON.stringify({ role, user: userData }))
    router.push(`/dashboard/${role}`)
  }

  return <LoginPage onLogin={handleLogin} onSignup={handleSignup} />
}
