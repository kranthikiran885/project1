"use client"

import { motion } from "framer-motion"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"
import BillingDashboard from "@/components/billing/billing-dashboard"

export default function BillingPage() {
  const router = useRouter()

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.div
        initial={{ y: -64 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.4 }}
        className="fixed top-0 left-0 right-0 h-16 bg-card border-b border-border z-30 backdrop-blur-xl"
      >
        <div className="h-full px-6 flex items-center justify-between max-w-7xl mx-auto w-full">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => router.back()}
            className="flex items-center gap-2 text-foreground hover:text-primary"
          >
            <ArrowLeft className="w-5 h-5" />
            Back
          </motion.button>
          <h1 className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
            Billing & Payments
          </h1>
          <div className="w-10" />
        </div>
      </motion.div>

      {/* Content */}
      <div className="pt-24 pb-12 px-6 max-w-7xl mx-auto">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <BillingDashboard />
        </motion.div>
      </div>
    </div>
  )
}
