"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { CreditCard, Download, CheckCircle, Plus, Eye } from "lucide-react"

export default function AdvancedPaymentPortal() {
  const [activeTab, setActiveTab] = useState("overview")
  const [selectedPlan, setSelectedPlan] = useState(null)
  const [showPaymentForm, setShowPaymentForm] = useState(false)
  const [maskCard, setMaskCard] = useState(true)

  const paymentHistory = [
    {
      id: 1,
      date: "2024-01-15",
      amount: "$150",
      status: "paid",
      method: "Razorpay",
      description: "Monthly subscription - January",
    },
    { id: 2, date: "2024-01-10", amount: "$45", status: "paid", method: "Card", description: "Extra trips - January" },
    {
      id: 3,
      date: "2024-01-05",
      amount: "$150",
      status: "paid",
      method: "Razorpay",
      description: "Monthly subscription - Initial",
    },
    {
      id: 4,
      date: "2023-12-25",
      amount: "$20",
      status: "failed",
      method: "Card",
      description: "Payment retry pending",
    },
  ]

  const plans = [
    { id: 1, name: "Basic", price: "$49", trips: "20 trips/month", color: "from-blue-500 to-cyan-500" },
    {
      id: 2,
      name: "Premium",
      price: "$99",
      trips: "Unlimited trips",
      color: "from-purple-500 to-pink-500",
      featured: true,
    },
    { id: 3, name: "Business", price: "$199", trips: "Multi-student", color: "from-orange-500 to-red-500" },
  ]

  const savedPaymentMethods = [
    { id: 1, type: "card", last4: "4242", brand: "Visa", expiry: "12/25", default: true },
    { id: 2, type: "upi", method: "user@upi", default: false },
  ]

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="min-h-screen bg-background pt-6 pb-20"
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-2">Payments & Billing</h1>
          <p className="text-muted-foreground">Manage your subscriptions, invoices, and payment methods</p>
        </motion.div>

        {/* Tab Navigation */}
        <div className="flex gap-4 mb-8 bg-sidebar p-2 rounded-xl overflow-x-auto">
          {["overview", "subscriptions", "history", "invoices", "methods"].map((tab) => (
            <motion.button
              key={tab}
              whileHover={{ scale: 1.05 }}
              onClick={() => setActiveTab(tab)}
              className={`flex-shrink-0 px-6 py-3 rounded-lg font-semibold transition-all capitalize ${
                activeTab === tab
                  ? "bg-gradient-to-r from-primary to-accent text-white glow-primary"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </motion.button>
          ))}
        </div>

        <AnimatePresence mode="wait">
          {/* Overview Tab */}
          {activeTab === "overview" && (
            <motion.div
              key="overview"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              {/* Quick Stats */}
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {[
                  { label: "Total Spent", value: "$345", change: "+12%" },
                  { label: "Active Subscription", value: "Premium", change: "Until Jan 15" },
                  { label: "Trips Used", value: "45/Unlimited", change: "This month" },
                  { label: "Next Billing", value: "Jan 15, 2024", change: "$99.00" },
                ].map((stat, idx) => (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.05 * idx }}
                    whileHover={{ y: -4 }}
                    className="bg-gradient-to-br from-slate-800/50 to-slate-700/30 border border-slate-700/50 rounded-xl p-6"
                  >
                    <p className="text-muted-foreground text-sm mb-2">{stat.label}</p>
                    <p className="text-2xl font-bold text-foreground mb-1">{stat.value}</p>
                    <p className="text-xs text-accent">{stat.change}</p>
                  </motion.div>
                ))}
              </div>

              {/* Active Subscription Card */}
              <motion.div
                whileHover={{ y: -4 }}
                className="bg-gradient-to-r from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-2xl p-8"
              >
                <div className="flex items-start justify-between">
                  <div>
                    <p className="text-muted-foreground mb-2">CURRENT PLAN</p>
                    <h2 className="text-3xl font-bold text-foreground">Premium Unlimited</h2>
                    <p className="text-muted-foreground mt-2">Unlimited trips, Priority support</p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    className="px-6 py-3 bg-primary text-primary-foreground rounded-lg font-semibold hover:bg-primary/90"
                  >
                    Upgrade Plan
                  </motion.button>
                </div>
                <div className="mt-6 flex items-center justify-between p-4 bg-background/30 rounded-lg">
                  <span className="text-foreground">Renews on January 15, 2024</span>
                  <span className="text-accent font-bold">$99.00/month</span>
                </div>
              </motion.div>

              {/* Payment Alerts */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="bg-chart-5/10 border border-chart-5/30 rounded-xl p-6 flex items-start gap-4"
              >
                <CheckCircle className="w-6 h-6 text-chart-5 flex-shrink-0 mt-1" />
                <div>
                  <p className="font-bold text-foreground">Payment Method Active</p>
                  <p className="text-sm text-muted-foreground">Your Visa ending in 4242 is active and ready to use</p>
                </div>
              </motion.div>
            </motion.div>
          )}

          {/* Subscriptions Tab */}
          {activeTab === "subscriptions" && (
            <motion.div
              key="subscriptions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">Choose Your Plan</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {plans.map((plan, idx) => (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 * idx }}
                    whileHover={{ y: -8 }}
                    onClick={() => setSelectedPlan(plan.id)}
                    className={`relative rounded-2xl p-8 cursor-pointer transition-all border-2 ${
                      selectedPlan === plan.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50 bg-card"
                    }`}
                  >
                    {plan.featured && (
                      <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                        <span className="bg-gradient-to-r from-purple-500 to-pink-500 text-white px-4 py-1 rounded-full text-sm font-bold">
                          MOST POPULAR
                        </span>
                      </div>
                    )}

                    <h3 className="text-2xl font-bold text-foreground mb-2">{plan.name}</h3>
                    <div className="mb-6">
                      <span className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                        {plan.price}
                      </span>
                      <span className="text-muted-foreground">/month</span>
                    </div>

                    <ul className="space-y-4 mb-8">
                      <li className="flex items-center gap-3 text-foreground">
                        <CheckCircle className="w-5 h-5 text-chart-5" />
                        {plan.trips}
                      </li>
                      <li className="flex items-center gap-3 text-foreground">
                        <CheckCircle className="w-5 h-5 text-chart-5" />
                        24/7 Support
                      </li>
                      <li className="flex items-center gap-3 text-foreground">
                        <CheckCircle className="w-5 h-5 text-chart-5" />
                        Real-time Tracking
                      </li>
                    </ul>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className={`w-full py-3 rounded-lg font-bold transition-all ${
                        selectedPlan === plan.id
                          ? "bg-gradient-to-r from-primary to-accent text-white glow-primary"
                          : "bg-sidebar text-foreground hover:bg-sidebar/80"
                      }`}
                    >
                      {selectedPlan === plan.id ? "Selected" : "Choose Plan"}
                    </motion.button>
                  </motion.div>
                ))}
              </div>

              {selectedPlan && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-primary/10 border border-primary/30 rounded-xl p-6 text-center"
                >
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowPaymentForm(true)}
                    className="px-8 py-4 bg-gradient-to-r from-primary to-accent text-white rounded-lg font-bold hover:shadow-lg hover:shadow-primary/50 transition-all"
                  >
                    Proceed to Payment
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* History Tab */}
          {activeTab === "history" && (
            <motion.div
              key="history"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <h2 className="text-2xl font-bold text-foreground mb-6">Payment History</h2>
              {paymentHistory.map((payment, idx) => (
                <motion.div
                  key={payment.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * idx }}
                  whileHover={{ x: 4 }}
                  className="bg-card border border-border rounded-lg p-6 flex items-center justify-between hover:border-primary/50 transition-all"
                >
                  <div className="flex items-center gap-4">
                    <div
                      className={`p-3 rounded-lg ${payment.status === "paid" ? "bg-chart-5/20" : "bg-destructive/20"}`}
                    >
                      <CreditCard
                        className={`w-6 h-6 ${payment.status === "paid" ? "text-chart-5" : "text-destructive"}`}
                      />
                    </div>
                    <div>
                      <p className="font-bold text-foreground">{payment.description}</p>
                      <div className="flex gap-4 text-sm text-muted-foreground mt-1">
                        <span>{payment.date}</span>
                        <span>{payment.method}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">{payment.amount}</p>
                    <p
                      className={`text-sm font-semibold capitalize ${
                        payment.status === "paid" ? "text-chart-5" : "text-destructive"
                      }`}
                    >
                      {payment.status}
                    </p>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}

          {/* Invoices Tab */}
          {activeTab === "invoices" && (
            <motion.div
              key="invoices"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-4"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Invoices</h2>
              </div>
              {paymentHistory
                .filter((p) => p.status === "paid")
                .map((invoice, idx) => (
                  <motion.div
                    key={invoice.id}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.05 * idx }}
                    whileHover={{ scale: 1.02 }}
                    className="bg-card border border-border rounded-lg p-6 flex items-center justify-between hover:border-primary/50 transition-all"
                  >
                    <div>
                      <p className="font-bold text-foreground">Invoice #{invoice.id.toString().padStart(4, "0")}</p>
                      <p className="text-sm text-muted-foreground">{invoice.date}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      className="flex items-center gap-2 px-4 py-2 bg-accent/20 text-accent rounded-lg hover:bg-accent/30 transition-all"
                    >
                      <Download className="w-4 h-4" />
                      Download
                    </motion.button>
                  </motion.div>
                ))}
            </motion.div>
          )}

          {/* Payment Methods Tab */}
          {activeTab === "methods" && (
            <motion.div
              key="methods"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="space-y-6"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">Payment Methods</h2>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg"
                >
                  <Plus className="w-4 h-4" />
                  Add Method
                </motion.button>
              </div>

              {savedPaymentMethods.map((method, idx) => (
                <motion.div
                  key={method.id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.1 * idx }}
                  className={`bg-card border-2 rounded-lg p-6 relative ${
                    method.default ? "border-primary" : "border-border"
                  }`}
                >
                  {method.default && (
                    <div className="absolute -top-3 right-4">
                      <span className="bg-primary text-primary-foreground px-3 py-1 rounded-full text-xs font-bold">
                        DEFAULT
                      </span>
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div>
                      {method.type === "card" && (
                        <>
                          <p className="font-bold text-foreground text-lg mb-2">
                            {method.brand} Ending in {method.last4}
                          </p>
                          <p className="text-sm text-muted-foreground">Expires {method.expiry}</p>
                        </>
                      )}
                      {method.type === "upi" && <p className="font-bold text-foreground">{method.method}</p>}
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        className="p-2 hover:bg-sidebar rounded-lg text-muted-foreground hover:text-foreground"
                      >
                        <Eye className="w-5 h-5" />
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Payment Modal */}
      {showPaymentForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowPaymentForm(false)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-2xl p-8 max-w-lg w-full border border-border"
          >
            <h3 className="text-2xl font-bold text-foreground mb-6">Complete Your Payment</h3>
            <div className="space-y-4 mb-6">
              <input
                type="text"
                placeholder="Card Number"
                className="w-full px-4 py-3 bg-sidebar border border-border rounded-lg text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <div className="grid grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="MM/YY"
                  className="px-4 py-3 bg-sidebar border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
                <input
                  type="text"
                  placeholder="CVV"
                  className="px-4 py-3 bg-sidebar border border-border rounded-lg text-foreground focus:outline-none focus:ring-2 focus:ring-primary"
                />
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              className="w-full bg-gradient-to-r from-primary to-accent text-white py-4 rounded-lg font-bold hover:shadow-lg hover:shadow-primary/50"
            >
              Pay $99.00
            </motion.button>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}
