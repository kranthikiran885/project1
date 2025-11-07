"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import {
  Bus,
  UserPlus,
  Eye,
  EyeOff,
  CheckCircle,
  AlertCircle,
  Mail,
  Lock,
  User,
  Phone,
  Building2,
  Check,
  X,
  Loader,
} from "lucide-react"
import { authService } from "@/lib/auth-service"

const ROLE_INFO = {
  student: { title: "Student", desc: "Get real-time tracking and bus notifications" },
  parent: { title: "Parent/Guardian", desc: "Monitor your child's commute in real-time" },
  driver: { title: "Driver", desc: "Manage your trips and student pickups" },
  admin: { title: "Admin", desc: "Oversee the entire transport system" },
}

const PASSWORD_REQUIREMENTS = [
  { regex: /.{8,}/, label: "At least 8 characters" },
  { regex: /[A-Z]/, label: "One uppercase letter" },
  { regex: /[a-z]/, label: "One lowercase letter" },
  { regex: /[0-9]/, label: "One number" },
  { regex: /[!@#$%^&*]/, label: "One special character" },
]

const validateEmail = async (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email)) return { valid: false, message: "Invalid email format" }
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/check-email`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email })
    })
    const data = await response.json()
    if (!response.ok || data.exists) return { valid: false, message: "Email already registered" }
    return { valid: true, message: "Email available" }
  } catch (error) {
    return { valid: false, message: "Could not verify email" }
  }
}

const validatePhone = async (phone) => {
  const phoneRegex = /^[\d\s\-\+\(\)]+$/
  if (!phoneRegex.test(phone) || phone.replace(/\D/g, '').length < 10) {
    return { valid: false, message: "Invalid phone number" }
  }
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/auth/check-phone`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ phone })
    })
    const data = await response.json()
    if (!response.ok || data.exists) return { valid: false, message: "Phone number already registered" }
    return { valid: true, message: "Phone available" }
  } catch (error) {
    return { valid: false, message: "Could not verify phone" }
  }
}

export default function SignupPage({ onSignup, onBack }) {
  const [step, setStep] = useState(1)
  const [selectedRole, setSelectedRole] = useState(null)
  const [loading, setLoading] = useState(false)
  const [verifying, setVerifying] = useState(null)
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [agreeTerms, setAgreeTerms] = useState(false)

  const [validation, setValidation] = useState({
    email: { status: null, message: "" },
    phone: { status: null, message: "" },
  })

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    rollNumber: "",
    collegeName: "",
    childName: "",
    childCollege: "",
    licenseNumber: "",
    vehicleNumber: "",
    employeeId: "",
    department: "",
  })

  const passwordStrength = {
    score: PASSWORD_REQUIREMENTS.filter((req) => req.regex.test(formData.password)).length,
    total: PASSWORD_REQUIREMENTS.length,
  }

  const getStrengthColor = () => {
    const percentage = (passwordStrength.score / passwordStrength.total) * 100
    if (percentage < 40) return "bg-red-500"
    if (percentage < 70) return "bg-orange-500"
    return "bg-green-500"
  }

  // Real-time email validation
  useEffect(() => {
    if (!formData.email) {
      setValidation(prev => ({ ...prev, email: { status: null, message: "" } }))
      return
    }
    const validateEmailAsync = async () => {
      setVerifying("email")
      const result = await validateEmail(formData.email)
      setValidation(prev => ({
        ...prev,
        email: { status: result.valid ? "valid" : "invalid", message: result.message }
      }))
      setVerifying(null)
    }
    const timer = setTimeout(validateEmailAsync, 500)
    return () => clearTimeout(timer)
  }, [formData.email])

  // Real-time phone validation
  useEffect(() => {
    if (!formData.phone) {
      setValidation(prev => ({ ...prev, phone: { status: null, message: "" } }))
      return
    }
    const validatePhoneAsync = async () => {
      setVerifying("phone")
      const result = await validatePhone(formData.phone)
      setValidation(prev => ({
        ...prev,
        phone: { status: result.valid ? "valid" : "invalid", message: result.message }
      }))
      setVerifying(null)
    }
    const timer = setTimeout(validatePhoneAsync, 500)
    return () => clearTimeout(timer)
  }, [formData.phone])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setError(null)
  }

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      setError("Full name is required")
      return false
    }
    if (!formData.email.trim()) {
      setError("Email is required")
      return false
    }
    if (!formData.phone.trim()) {
      setError("Phone number is required")
      return false
    }
    // Check if email validation is still pending or failed
    if (verifying === "email") {
      setError("Please wait for email validation to complete")
      return false
    }
    if (validation.email.status === "invalid") {
      setError(validation.email.message || "Email is invalid or already registered")
      return false
    }
    // Check if phone validation is still pending or failed
    if (verifying === "phone") {
      setError("Please wait for phone validation to complete")
      return false
    }
    if (validation.phone.status === "invalid") {
      setError(validation.phone.message || "Phone number is invalid or already registered")
      return false
    }
    if (passwordStrength.score < 3) {
      setError("Password does not meet minimum requirements")
      return false
    }
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match")
      return false
    }
    if (!agreeTerms) {
      setError("You must agree to the terms and conditions")
      return false
    }
    if (selectedRole === "student" && !formData.rollNumber.trim()) {
      setError("Roll number is required")
      return false
    }
    if (selectedRole === "parent" && !formData.childName.trim()) {
      setError("Child's name is required")
      return false
    }
    if (selectedRole === "driver" && !formData.licenseNumber.trim()) {
      setError("License number is required")
      return false
    }
    if (selectedRole === "admin" && !formData.employeeId.trim()) {
      setError("Employee ID is required")
      return false
    }
    return true
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validateForm()) return

    setLoading(true)
    setError(null)
    
    try {
      const registrationData = {
        name: formData.fullName,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
        role: selectedRole,
        rollNumber: selectedRole === "student" ? formData.rollNumber : undefined,
        collegeName: selectedRole === "student" ? formData.collegeName : undefined,
        childName: selectedRole === "parent" ? formData.childName : undefined,
        childCollege: selectedRole === "parent" ? formData.childCollege : undefined,
        licenseNumber: selectedRole === "driver" ? formData.licenseNumber : undefined,
        vehicleNumber: selectedRole === "driver" ? formData.vehicleNumber : undefined,
        employeeId: selectedRole === "admin" ? formData.employeeId : undefined,
        department: selectedRole === "admin" ? formData.department : undefined,
      }

      Object.keys(registrationData).forEach(key => 
        registrationData[key] === undefined && delete registrationData[key]
      )

      const result = await authService.register(registrationData)
      
      if (result.success) {
        setSuccess("Account created successfully! Redirecting...")
        setTimeout(() => {
          onSignup(selectedRole, result.data.user)
        }, 1500)
      } else {
        setError(result.error || "Signup failed. Please try again.")
      }
    } catch (err) {
      setError("Network error. Please check your connection and try again.")
      console.error("Signup error:", err)
    } finally {
      setLoading(false)
    }
  }

  if (step === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 overflow-hidden">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ y: [-20, 20, -20] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            className="absolute top-10 left-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [20, -20, 20] }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
            className="absolute bottom-10 right-10 w-60 h-60 bg-cyan-400/10 rounded-full blur-3xl"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="relative z-10 w-full max-w-2xl"
        >
          <div className="text-center mb-12">
            <motion.div whileHover={{ scale: 1.1 }} className="inline-block mb-4">
              <div className="p-3 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl">
                <Bus className="w-8 h-8 text-white" />
              </div>
            </motion.div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-cyan-400 bg-clip-text text-transparent mb-2">
              Join CTMS
            </h1>
            <p className="text-gray-400">Select your role to get started</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
            {Object.entries(ROLE_INFO).map(([role, info]) => (
              <motion.button
                key={role}
                whileHover={{ scale: 1.05, y: -4 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  setSelectedRole(role)
                  setStep(2)
                }}
                className="text-left backdrop-blur-xl bg-slate-800/50 border border-purple-500/30 rounded-2xl p-6 hover:border-cyan-400/50 transition-all group"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="p-2 bg-gradient-to-br from-orange-500/20 to-pink-500/20 group-hover:from-cyan-500/20 group-hover:to-blue-500/20 rounded-lg transition-all">
                    <UserPlus className="w-6 h-6 text-cyan-400" />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-white capitalize mb-1">{info.title}</h3>
                <p className="text-sm text-gray-400">{info.desc}</p>
              </motion.button>
            ))}
          </div>

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onBack}
            className="w-full flex items-center justify-center gap-2 text-gray-400 hover:text-gray-300 transition-all"
          >
            Back to Login
          </motion.button>
        </motion.div>
      </div>
    )
  }

  if (step === 2 && selectedRole) {
    const roleInfo = ROLE_INFO[selectedRole]
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 py-10 overflow-auto">
        <div className="absolute inset-0 overflow-hidden">
          <motion.div
            animate={{ y: [-20, 20, -20] }}
            transition={{ duration: 4, repeat: Number.POSITIVE_INFINITY }}
            className="absolute top-10 left-10 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl"
          />
          <motion.div
            animate={{ y: [20, -20, 20] }}
            transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY }}
            className="absolute bottom-10 right-10 w-60 h-60 bg-cyan-400/10 rounded-full blur-3xl"
          />
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="relative z-10 w-full max-w-2xl"
        >
          <div className="text-center mb-8">
            <button
              onClick={() => setStep(1)}
              className="flex items-center gap-2 text-gray-400 hover:text-gray-300 mb-4 mx-auto"
            >
              Change Role
            </button>
            <h1 className="text-3xl font-bold text-white mb-1 capitalize">{roleInfo.title} Registration</h1>
            <p className="text-gray-400">{roleInfo.desc}</p>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="backdrop-blur-xl bg-slate-900/50 border border-purple-500/30 rounded-2xl p-8"
          >
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm mb-6"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm mb-6"
              >
                <CheckCircle className="w-4 h-4" />
                {success}
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Full Name *</label>
                <div className="relative">
                  <User className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="text"
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="John Doe"
                    className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Email Address *</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="you@college.edu"
                    className={`w-full pl-10 pr-10 py-2.5 bg-slate-800/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                      validation.email.status === "valid"
                        ? "border-green-500/50 focus:ring-green-400"
                        : validation.email.status === "invalid"
                          ? "border-red-500/50 focus:ring-red-400"
                          : "border-purple-500/30 focus:ring-cyan-400"
                    }`}
                  />
                  {verifying === "email" && (
                    <Loader className="absolute right-3 top-2.5 w-5 h-5 text-cyan-400 animate-spin" />
                  )}
                  {verifying !== "email" && validation.email.status === "valid" && (
                    <CheckCircle className="absolute right-3 top-2.5 w-5 h-5 text-green-400" />
                  )}
                  {verifying !== "email" && validation.email.status === "invalid" && (
                    <AlertCircle className="absolute right-3 top-2.5 w-5 h-5 text-red-400" />
                  )}
                </div>
                {validation.email.message && (
                  <p className={`text-xs mt-1 ${validation.email.status === "valid" ? "text-green-400" : "text-red-400"}`}>
                    {validation.email.message}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Phone Number *</label>
                <div className="relative">
                  <Phone className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="+91 98765 43210"
                    className={`w-full pl-10 pr-10 py-2.5 bg-slate-800/50 border rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                      validation.phone.status === "valid"
                        ? "border-green-500/50 focus:ring-green-400"
                        : validation.phone.status === "invalid"
                          ? "border-red-500/50 focus:ring-red-400"
                          : "border-purple-500/30 focus:ring-cyan-400"
                    }`}
                  />
                  {verifying === "phone" && (
                    <Loader className="absolute right-3 top-2.5 w-5 h-5 text-cyan-400 animate-spin" />
                  )}
                  {verifying !== "phone" && validation.phone.status === "valid" && (
                    <CheckCircle className="absolute right-3 top-2.5 w-5 h-5 text-green-400" />
                  )}
                  {verifying !== "phone" && validation.phone.status === "invalid" && (
                    <AlertCircle className="absolute right-3 top-2.5 w-5 h-5 text-red-400" />
                  )}
                </div>
                {validation.phone.message && (
                  <p className={`text-xs mt-1 ${validation.phone.status === "valid" ? "text-green-400" : "text-red-400"}`}>
                    {validation.phone.message}
                  </p>
                )}
              </div>

              {selectedRole === "student" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-300">Roll Number *</label>
                      <input
                        type="text"
                        name="rollNumber"
                        value={formData.rollNumber}
                        onChange={handleInputChange}
                        placeholder="E.g., 001"
                        className="w-full px-4 py-2.5 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-300">College Name *</label>
                      <input
                        type="text"
                        name="collegeName"
                        value={formData.collegeName}
                        onChange={handleInputChange}
                        placeholder="Your College"
                        className="w-full px-4 py-2.5 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </>
              )}

              {selectedRole === "parent" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-300">Child's Name *</label>
                      <input
                        type="text"
                        name="childName"
                        value={formData.childName}
                        onChange={handleInputChange}
                        placeholder="Jane Doe"
                        className="w-full px-4 py-2.5 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-300">College *</label>
                      <input
                        type="text"
                        name="childCollege"
                        value={formData.childCollege}
                        onChange={handleInputChange}
                        placeholder="Child's College"
                        className="w-full px-4 py-2.5 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </>
              )}

              {selectedRole === "driver" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-300">License Number *</label>
                      <input
                        type="text"
                        name="licenseNumber"
                        value={formData.licenseNumber}
                        onChange={handleInputChange}
                        placeholder="DL-1234567890"
                        className="w-full px-4 py-2.5 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-300">Vehicle Number *</label>
                      <input
                        type="text"
                        name="vehicleNumber"
                        value={formData.vehicleNumber}
                        onChange={handleInputChange}
                        placeholder="KA01AB1234"
                        className="w-full px-4 py-2.5 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </>
              )}

              {selectedRole === "admin" && (
                <>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-300">Employee ID *</label>
                      <input
                        type="text"
                        name="employeeId"
                        value={formData.employeeId}
                        onChange={handleInputChange}
                        placeholder="EMP-001"
                        className="w-full px-4 py-2.5 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-2 text-gray-300">Department *</label>
                      <input
                        type="text"
                        name="department"
                        value={formData.department}
                        onChange={handleInputChange}
                        placeholder="Transportation"
                        className="w-full px-4 py-2.5 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                      />
                    </div>
                  </div>
                </>
              )}

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type={showPassword ? "text" : "password"}
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    placeholder="Create a strong password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="mt-2 space-y-2">
                  <div className="flex gap-1 h-1.5">
                    {[...Array(passwordStrength.total)].map((_, i) => (
                      <div
                        key={i}
                        className={`flex-1 rounded-full transition-all ${
                          i < passwordStrength.score ? getStrengthColor() : "bg-slate-700"
                        }`}
                      ></div>
                    ))}
                  </div>
                  <p className="text-xs text-gray-400">Password strength: {Math.round((passwordStrength.score / passwordStrength.total) * 100)}%</p>
                </div>

                <div className="mt-3 space-y-2">
                  {PASSWORD_REQUIREMENTS.map((req, i) => (
                    <div key={i} className="flex items-center gap-2 text-xs">
                      {req.regex.test(formData.password) ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <X className="w-4 h-4 text-red-400" />
                      )}
                      <span className={req.regex.test(formData.password) ? "text-green-400" : "text-gray-400"}>{req.label}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Confirm Password *</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                  <input
                    type={showConfirmPassword ? "text" : "password"}
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    placeholder="Confirm your password"
                    className="w-full pl-10 pr-10 py-2.5 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-300"
                  >
                    {showConfirmPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                {formData.password && formData.confirmPassword && (
                  <p
                    className={`text-xs mt-2 ${
                      formData.password === formData.confirmPassword ? "text-green-400" : "text-red-400"
                    }`}
                  >
                    {formData.password === formData.confirmPassword ? "✓ Passwords match" : "✗ Passwords do not match"}
                  </p>
                )}
              </div>

              <div className="flex items-start gap-3 p-4 bg-slate-800/50 border border-purple-500/30 rounded-lg">
                <input
                  type="checkbox"
                  id="terms"
                  checked={agreeTerms}
                  onChange={(e) => setAgreeTerms(e.target.checked)}
                  className="w-4 h-4 mt-0.5 cursor-pointer"
                />
                <label htmlFor="terms" className="text-sm text-gray-400 cursor-pointer">
                  I agree to the <span className="text-cyan-400 hover:underline">Terms and Conditions</span> and <span className="text-cyan-400 hover:underline">Privacy Policy</span>
                </label>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading || verifying === "email" || verifying === "phone" || validation.email.status === "invalid" || validation.phone.status === "invalid"}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-500/50 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <UserPlus className="w-4 h-4" />
                {loading ? "Creating Account..." : verifying ? "Validating..." : "Create Account"}
              </motion.button>

              <p className="text-center text-sm text-gray-400">
                Already have an account?{" "}
                <button onClick={onBack} className="text-cyan-400 hover:underline">
                  Sign In
                </button>
              </p>
            </form>
          </motion.div>
        </motion.div>
      </div>
    )
  }

  return null
}
