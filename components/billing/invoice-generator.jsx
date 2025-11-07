"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Download, Mail, Printer } from "lucide-react"
import { PaymentService } from "@/lib/payment-service"

export default function InvoiceGenerator({ bookingId, studentData }) {
  const [showInvoice, setShowInvoice] = useState(false)
  const [invoice, setInvoice] = useState(null)
  const [loading, setLoading] = useState(false)

  const generateInvoice = async () => {
    setLoading(true)
    try {
      const generatedInvoice = await PaymentService.generateInvoice(bookingId, studentData, 450)
      setInvoice(generatedInvoice)
      setShowInvoice(true)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={generateInvoice}
        disabled={loading}
        className="flex items-center gap-2 bg-primary text-primary-foreground px-4 py-2 rounded-lg font-semibold hover:bg-primary/90 disabled:opacity-50"
      >
        <Download className="w-4 h-4" />
        {loading ? "Generating..." : "Generate Invoice"}
      </motion.button>

      {/* Invoice Preview Modal */}
      {showInvoice && invoice && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          onClick={() => setShowInvoice(false)}
          className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            onClick={(e) => e.stopPropagation()}
            className="bg-card rounded-2xl shadow-2xl max-w-2xl w-full border border-border p-8 max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-foreground">INVOICE</h1>
                <p className="text-muted-foreground">{invoice.invoiceId}</p>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground text-sm">Date</p>
                <p className="font-semibold text-foreground">{new Date(invoice.date).toLocaleDateString()}</p>
              </div>
            </div>

            {/* Invoice Details */}
            <div className="grid grid-cols-2 gap-8 mb-8 pb-8 border-b border-border">
              <div>
                <p className="text-muted-foreground text-sm mb-2">Bill To</p>
                <div>
                  <p className="font-bold text-foreground">{invoice.studentName}</p>
                  <p className="text-sm text-muted-foreground">{invoice.studentEmail}</p>
                  <p className="text-sm text-muted-foreground">College Transport Pass</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-muted-foreground text-sm mb-2">Invoice Status</p>
                <span className="px-3 py-1 bg-chart-5/20 text-chart-5 text-xs font-bold rounded-full">
                  {invoice.status}
                </span>
              </div>
            </div>

            {/* Items Table */}
            <div className="mb-8">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border">
                    <th className="text-left py-3 text-muted-foreground font-semibold">Description</th>
                    <th className="text-right py-3 text-muted-foreground font-semibold">Quantity</th>
                    <th className="text-right py-3 text-muted-foreground font-semibold">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-border">
                    <td className="py-4 text-foreground font-medium">Monthly Transport Subscription</td>
                    <td className="text-right text-foreground">1</td>
                    <td className="text-right text-foreground font-bold">₹{invoice.amount}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Summary */}
            <div className="flex justify-end mb-8">
              <div className="w-64 space-y-2">
                <div className="flex justify-between py-2 text-foreground">
                  <span>Subtotal</span>
                  <span>₹{invoice.amount}</span>
                </div>
                <div className="flex justify-between py-2 text-foreground">
                  <span>Tax (0%)</span>
                  <span>₹0</span>
                </div>
                <div className="flex justify-between py-3 px-4 bg-primary/10 rounded-lg border border-primary font-bold text-foreground">
                  <span>Total</span>
                  <span>₹{invoice.amount}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 justify-end">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-sidebar"
              >
                <Printer className="w-4 h-4" />
                Print
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg text-foreground hover:bg-sidebar"
              >
                <Mail className="w-4 h-4" />
                Email
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90"
              >
                <Download className="w-4 h-4" />
                Download PDF
              </motion.button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  )
}
