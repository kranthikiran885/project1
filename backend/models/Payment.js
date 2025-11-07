const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema({
  student: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  amount: { type: Number, required: true },
  currency: { type: String, default: "INR" },
  paymentMethod: { type: String, enum: ["razorpay", "stripe", "bank_transfer", "cash"], default: "razorpay" },
  transactionId: String,
  status: { type: String, enum: ["pending", "completed", "failed", "refunded"], default: "pending" },
  invoiceNumber: String,
  month: String,
  description: String,
  route: { type: mongoose.Schema.Types.ObjectId, ref: "Route" },
  subscriptionType: { type: String, enum: ["monthly", "quarterly", "annual"], default: "monthly" },
  receipt: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
})

module.exports = mongoose.model("Payment", paymentSchema)
