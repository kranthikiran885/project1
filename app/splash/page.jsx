"use client"

import { useRouter } from "next/navigation"
import SplashScreen from "@/components/auth/splash-screen"

export default function SplashPage() {
  const router = useRouter()

  const handleNext = () => {
    router.push("/onboarding")
  }

  return <SplashScreen onNext={handleNext} />
}
