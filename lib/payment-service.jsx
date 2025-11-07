"use client"

// Simulated payment processing service
export const PaymentService = {
  async initializePayment(amount, email, name) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          orderId: `ORDER-${Date.now()}`,
          amount,
          email,
          name,
          currency: "INR",
          status: "initiated",
        })
      }, 500)
    })
  },

  async processPayment(orderId, paymentMethod) {
    return new Promise((resolve) => {
      setTimeout(() => {
        const success = Math.random() > 0.1 // 90% success rate
        resolve({
          orderId,
          transactionId: `TXN-${Date.now()}`,
          status: success ? "success" : "failed",
          method: paymentMethod,
          timestamp: new Date().toISOString(),
          message: success ? "Payment successful" : "Payment failed",
        })
      }, 2000)
    })
  },

  async generateInvoice(bookingId, studentData, amount) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          invoiceId: `INV-${bookingId}-${Date.now()}`,
          date: new Date().toISOString(),
          studentName: studentData.name,
          studentEmail: studentData.email,
          amount,
          status: "paid",
          url: "/invoices/sample.pdf",
        })
      }, 1000)
    })
  },

  async getPaymentHistory(studentId) {
    return [
      { id: 1, date: "2024-01-15", amount: 450, status: "paid", type: "Monthly Subscription" },
      { id: 2, date: "2024-01-08", amount: 450, status: "paid", type: "Monthly Subscription" },
      { id: 3, date: "2024-01-01", amount: 450, status: "paid", type: "Monthly Subscription" },
      { id: 4, date: "2023-12-25", amount: 450, status: "paid", type: "Monthly Subscription" },
    ]
  },
}

// Subscription management
export const SubscriptionService = {
  async createSubscription(studentId, planId, startDate) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          subscriptionId: `SUB-${Date.now()}`,
          studentId,
          planId,
          startDate,
          status: "active",
          renewalDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
        })
      }, 800)
    })
  },

  async cancelSubscription(subscriptionId) {
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve({
          subscriptionId,
          status: "cancelled",
          refundAmount: 150,
          message: "Subscription cancelled successfully",
        })
      }, 500)
    })
  },

  getSubscriptionPlans() {
    return [
      {
        id: "basic",
        name: "Basic Plan",
        price: 450,
        period: "Monthly",
        features: ["Unlimited trips", "Priority support"],
      },
      {
        id: "premium",
        name: "Premium Plan",
        price: 800,
        period: "Monthly",
        features: ["Unlimited trips", "24/7 support", "Family sharing"],
      },
      {
        id: "annual",
        name: "Annual Plan",
        price: 4500,
        period: "Yearly",
        features: ["Unlimited trips", "Premium support", "Free upgrades"],
      },
    ]
  },
}
