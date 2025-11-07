const Payment = require("../models/Payment")
const User = require("../models/User")

exports.createPayment = async (req, res) => {
  try {
    const { student, amount, paymentMethod, month, route, subscriptionType } = req.body

    const invoiceNumber = "INV-" + Date.now()
    const payment = new Payment({
      student,
      amount,
      paymentMethod,
      month,
      route,
      subscriptionType,
      invoiceNumber,
      status: "pending",
    })

    await payment.save()
    res.status(201).json({ message: "Payment created", payment })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ student: req.user.id }).populate("student route")
    res.json(payments)
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.completePayment = async (req, res) => {
  try {
    const { transactionId } = req.body
    const payment = await Payment.findByIdAndUpdate(
      req.params.id,
      { status: "completed", transactionId, updatedAt: new Date() },
      { new: true },
    )
    res.json({ message: "Payment completed", payment })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}

exports.generateInvoice = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id).populate("student route")
    if (!payment) return res.status(404).json({ error: "Payment not found" })

    const invoiceData = {
      invoiceNumber: payment.invoiceNumber,
      date: payment.createdAt,
      student: payment.student.name,
      email: payment.student.email,
      amount: payment.amount,
      month: payment.month,
      description: "Transport Fee",
    }

    res.json({ invoice: invoiceData })
  } catch (error) {
    res.status(500).json({ error: error.message })
  }
}
