"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { CreditCard, Download, Plus, X } from "lucide-react"
import { SubscriptionService } from "@/lib/payment-service"
import PaymentModal from "../payments/payment-modal"

export default function BillingDashboard() {
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [paymentHistory, setPaymentHistory] = useState([])
  const [currentPlan, setCurrentPlan] = useState("basic")
  const [loading, setLoading] = useState(false)

  const plans = SubscriptionService.getSubscriptionPlans()

  const handlePayment = async (amount) => {
    setShowPaymentModal(true)
  }

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-br from-primary/20 to-accent/20 border border-primary/30 rounded-xl p-6"
      >
        <div className="flex items-start justify-between mb-4">
          <div>
            <p className="text-muted-foreground text-sm">Current Plan</p>
            <p className="text-2xl font-bold text-foreground capitalize">{currentPlan} Plan</p>
          </div>
          <motion.div className="p-3 bg-primary/20 rounded-lg">
            <CreditCard className="w-6 h-6 text-primary" />
          </motion.div>
        </div>

        <div className="grid grid-cols-3 gap-4 text-sm mb-6">
          <div>
            <p className="text-muted-foreground mb-1">Renewal Date</p>
            <p className="font-bold text-foreground">
              {new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Monthly Cost</p>
            <p className="font-bold text-foreground">₹450</p>
          </div>
          <div>
            <p className="text-muted-foreground mb-1">Status</p>
            <span className="px-3 py-1 bg-chart-5/20 text-chart-5 text-xs font-bold rounded-full">Active</span>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="w-full bg-primary text-primary-foreground py-2 rounded-lg font-semibold hover:bg-primary/90"
        >
          Upgrade Plan
        </motion.button>
      </motion.div>

      {/* Subscription Plans */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
        <h3 className="text-lg font-bold text-foreground mb-4">Available Plans</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {plans.map((plan, idx) => (
            <motion.div
              key={plan.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * (idx + 2) }}
              className={`border-2 rounded-xl p-6 transition-all ${
                currentPlan === plan.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"
              }`}
            >
              <p className="font-bold text-foreground mb-2">{plan.name}</p>
              <p className="text-2xl font-bold text-primary mb-1">₹{plan.price}</p>
              <p className="text-xs text-muted-foreground mb-4">per {plan.period.toLowerCase()}</p>

              <ul className="space-y-2 mb-6">
                {plan.features.map((feature, i) => (
                  <li key={i} className="text-sm text-foreground flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-accent rounded-full" />
                    {feature}
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePayment(plan.price)}
                disabled={currentPlan === plan.id}
                className={`w-full py-2 rounded-lg font-semibold transition-all ${
                  currentPlan === plan.id
                    ? "bg-muted text-muted-foreground cursor-default"
                    : "bg-primary text-primary-foreground hover:bg-primary/90"
                }`}
              >
                {currentPlan === plan.id ? "Current Plan" : "Subscribe"}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Payment History */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">Payment History</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="flex items-center gap-2 text-accent text-sm font-semibold hover:text-accent/80"
          >
            <Download className="w-4 h-4" />
            Export
          </motion.button>
        </div>

        <div className="space-y-3">
          {[
            { date: "2024-01-15", amount: 450, status: "paid", invoice: "INV-001" },
            { date: "2024-01-08", amount: 450, status: "paid", invoice: "INV-002" },
            { date: "2024-01-01", amount: 450, status: "paid", invoice: "INV-003" },
            { date: "2023-12-25", amount: 450, status: "paid", invoice: "INV-004" },
          ].map((payment, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.05 }}
              className="flex items-center justify-between p-4 bg-sidebar rounded-lg hover:bg-sidebar/80 transition-all"
            >
              <div>
                <p className="font-semibold text-foreground">{payment.invoice}</p>
                <p className="text-sm text-muted-foreground">{payment.date}</p>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <p className="font-bold text-foreground">₹{payment.amount}</p>
                  <span className="text-xs text-chart-5 font-semibold">{payment.status}</span>
                </div>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 hover:bg-primary/20 rounded-lg text-primary"
                >
                  <Download className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Payment Methods */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="bg-card border border-border rounded-xl p-6"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-bold text-foreground">Saved Payment Methods</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex items-center gap-2 bg-primary text-primary-foreground px-3 py-1 rounded-lg text-sm font-semibold"
          >
            <Plus className="w-4 h-4" />
            Add
          </motion.button>
        </div>

        <div className="space-y-3">
          {[
            { type: "Visa", last4: "1234", expiry: "12/25", default: true },
            { type: "Mastercard", last4: "5678", expiry: "08/26", default: false },
          ].map((method, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 + idx * 0.1 }}
              className="flex items-center justify-between p-4 bg-sidebar rounded-lg"
            >
              <div className="flex items-center gap-4">
                <div className="w-12 h-8 bg-primary/20 rounded-lg flex items-center justify-center font-bold text-sm text-primary">
                  {method.type.slice(0, 2)}
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    {method.type} •••• {method.last4}
                  </p>
                  <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                {method.default && (
                  <span className="text-xs bg-chart-5/20 text-chart-5 px-2 py-1 rounded-full font-semibold">
                    Default
                  </span>
                )}
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 hover:bg-destructive/20 rounded-lg text-destructive"
                >
                  <X className="w-4 h-4" />
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Payment Modal */}
      <PaymentModal isOpen={showPaymentModal} onClose={() => setShowPaymentModal(false)} amount={450} />
    </div>
  )
}
