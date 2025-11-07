"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"

const steps = [
  {
    title: "Welcome to CTMS 2.0",
    description: "Your AI-powered college transport solution",
    icon: "🚀",
  },
  {
    title: "Real-Time Tracking",
    description: "Track your bus in real-time with live GPS",
    icon: "📍",
  },
  {
    title: "Smart Routing",
    description: "AI-optimized routes save time and fuel",
    icon: "🤖",
  },
  {
    title: "Safety First",
    description: "Emergency SOS and incident reporting",
    icon: "🛡️",
  },
  {
    title: "Easy Payments",
    description: "Secure and seamless payment integration",
    icon: "💳",
  },
]

export default function OnboardingFlow({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0)

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      onComplete()
    }
  }

  const handleSkip = () => {
    onComplete()
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      <AnimatePresence mode="wait">
        <motion.div
          key={currentStep}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="max-w-md w-full"
        >
          <div className="bg-slate-800/50 backdrop-blur-xl rounded-2xl p-8 border border-slate-700/50">
            {/* Step indicator */}
            <div className="flex justify-center gap-2 mb-8">
              {steps.map((_, i) => (
                <motion.div
                  key={i}
                  className={`h-2 rounded-full transition-all ${
                    i === currentStep
                      ? "w-8 bg-gradient-to-r from-blue-500 to-cyan-500"
                      : i < currentStep
                        ? "w-2 bg-green-500"
                        : "w-2 bg-slate-600"
                  }`}
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                />
              ))}
            </div>

            {/* Content */}
            <div className="text-center mb-12">
              <motion.div
                className="text-6xl mb-6"
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              >
                {steps[currentStep].icon}
              </motion.div>
              <h2 className="text-3xl font-bold mb-3 bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                {steps[currentStep].title}
              </h2>
              <p className="text-muted-foreground text-lg">{steps[currentStep].description}</p>
            </div>

            {/* Buttons */}
            <div className="flex gap-4 flex-col">
              <Button
                onClick={handleNext}
                className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 text-white font-semibold h-12 rounded-lg"
              >
                {currentStep === steps.length - 1 ? "Get Started" : "Next"}
                <ChevronRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                onClick={handleSkip}
                variant="outline"
                className="w-full border-slate-600 hover:bg-slate-700/50 bg-transparent"
              >
                Skip
              </Button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
