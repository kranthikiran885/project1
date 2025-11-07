"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { X, Lock, CheckCircle, AlertCircle } from "lucide-react"
import { PaymentService } from "@/lib/payment-service"

export default function PaymentModal({ isOpen, onClose, amount, onSuccess }) {
  const [step, setStep] = useState(1)
  const [loading, setLoading] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState(null)
  const [formData, setFormData] = useState({
    cardNumber: "4532 XXXX XXXX 1234",
    cardHolder: "John Doe",
    expiryDate: "12/25",
    cvv: "***",
    email: "john@example.com",
  })

  const [paymentMethod, setPaymentMethod] = useState("card")

  const handlePaymentSubmit = async () => {
    setLoading(true)
    try {
      const payment = await PaymentService.processPayment("order-123", paymentMethod)
      setPaymentStatus(payment)
      if (payment.status === "success") {
        setStep(3)
      } else {
        setStep(4)
      }
    } catch (error) {
      console.error("Payment error:", error)
      setStep(4)
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-card rounded-2xl shadow-2xl max-w-md w-full border border-border overflow-hidden"
      >
        {/* Header */}
        <div className="bg-gradient-to-r from-primary to-accent p-6 flex items-center justify-between">
          <h2 className="text-xl font-bold text-white">Secure Payment</h2>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
            className="text-white hover:bg-white/20 p-2 rounded-lg"
          >
            <X className="w-5 h-5" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-6">
          {step === 1 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-muted-foreground text-sm mb-6">Select your payment method</p>

              <div className="space-y-3 mb-6">
                {[
                  { id: "card", label: "Credit/Debit Card", icon: "💳" },
                  { id: "upi", label: "UPI", icon: "📱" },
                  { id: "wallet", label: "Digital Wallet", icon: "👛" },
                ].map((method) => (
                  <motion.button
                    key={method.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full p-4 rounded-lg border-2 transition-all flex items-center gap-3 ${
                      paymentMethod === method.id
                        ? "border-primary bg-primary/10"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <span className="text-2xl">{method.icon}</span>
                    <span className="font-semibold text-foreground">{method.label}</span>
                  </motion.button>
                ))}
              </div>

              <div className="bg-sidebar rounded-lg p-4 mb-6">
                <p className="text-muted-foreground text-sm mb-1">Amount to Pay</p>
                <p className="text-2xl font-bold text-foreground">₹{amount}</p>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setStep(2)}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-primary/90 flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                Continue to Payment
              </motion.button>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
              <p className="text-muted-foreground text-sm mb-6">Enter your card details</p>

              <div className="space-y-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Card Number</label>
                  <input
                    type="text"
                    value={formData.cardNumber}
                    readOnly
                    className="w-full px-4 py-2 bg-sidebar border border-border rounded-lg text-foreground"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-foreground mb-2">Cardholder Name</label>
                  <input
                    type="text"
                    value={formData.cardHolder}
                    readOnly
                    className="w-full px-4 py-2 bg-sidebar border border-border rounded-lg text-foreground"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">Expiry Date</label>
                    <input
                      type="text"
                      value={formData.expiryDate}
                      readOnly
                      className="w-full px-4 py-2 bg-sidebar border border-border rounded-lg text-foreground"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-foreground mb-2">CVV</label>
                    <input
                      type="text"
                      value={formData.cvv}
                      readOnly
                      className="w-full px-4 py-2 bg-sidebar border border-border rounded-lg text-foreground"
                    />
                  </div>
                </div>
              </div>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(1)}
                  className="flex-1 border border-border text-foreground py-2 rounded-lg font-bold hover:bg-sidebar"
                >
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handlePaymentSubmit}
                  disabled={loading}
                  className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-bold hover:bg-primary/90 disabled:opacity-50"
                >
                  {loading ? "Processing..." : "Pay Now"}
                </motion.button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <motion.div
                animate={{ scale: [0, 1] }}
                transition={{ duration: 0.5, type: "spring" }}
                className="w-16 h-16 bg-chart-5/20 rounded-full flex items-center justify-center mx-auto mb-4"
              >
                <CheckCircle className="w-8 h-8 text-chart-5" />
              </motion.div>
              <h3 className="text-xl font-bold text-foreground mb-2">Payment Successful</h3>
              <p className="text-muted-foreground mb-4">Your booking has been confirmed</p>
              <p className="text-sm text-muted-foreground mb-6">Transaction ID: {paymentStatus?.transactionId}</p>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={onClose}
                className="w-full bg-primary text-primary-foreground py-3 rounded-lg font-bold hover:bg-primary/90"
              >
                Done
              </motion.button>
            </motion.div>
          )}

          {step === 4 && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-8"
            >
              <motion.div className="w-16 h-16 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <AlertCircle className="w-8 h-8 text-destructive" />
              </motion.div>
              <h3 className="text-xl font-bold text-foreground mb-2">Payment Failed</h3>
              <p className="text-muted-foreground mb-6">Please try again with a different method</p>

              <div className="flex gap-3">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setStep(2)}
                  className="flex-1 bg-primary text-primary-foreground py-2 rounded-lg font-bold hover:bg-primary/90"
                >
                  Retry
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="flex-1 border border-border text-foreground py-2 rounded-lg font-bold hover:bg-sidebar"
                >
                  Cancel
                </motion.button>
              </div>
            </motion.div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-sidebar px-6 py-3 flex items-center justify-center gap-2 text-xs text-muted-foreground">
          <Lock className="w-3 h-3" />
          Secure SSL Encrypted Payment
        </div>
      </motion.div>
    </motion.div>
  )
}
