"use client"

import { useRouter } from "next/navigation"
import OnboardingFlow from "@/components/auth/onboarding-flow"

export default function OnboardingPage() {
  const router = useRouter()

  const handleComplete = () => {
    router.push("/auth")
  }

  return <OnboardingFlow onComplete={handleComplete} />
}
