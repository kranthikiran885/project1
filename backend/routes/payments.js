const express = require("express")
const paymentController = require("../controllers/paymentController")
const auth = require("../middleware/auth")

const router = express.Router()

router.post("/", auth, paymentController.createPayment)
router.get("/history", auth, paymentController.getPaymentHistory)
router.put("/:id/complete", auth, paymentController.completePayment)
router.get("/:id/invoice", auth, paymentController.generateInvoice)

module.exports = router
