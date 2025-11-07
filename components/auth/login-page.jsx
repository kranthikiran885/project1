"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { Bus, LogIn, Eye, EyeOff, CheckCircle, AlertCircle } from "lucide-react"
import { authService } from "@/lib/auth-service"
import SignupPage from "./signup-page"

const DEMO_CREDENTIALS = {
  admin: { email: "admin@ctms.com", password: "admin123" },
  driver: { email: "driver@ctms.com", password: "driver123" },
  student: { email: "student@ctms.com", password: "student123" },
  parent: { email: "parent@ctms.com", password: "parent123" },
}

export default function LoginPage({ onLogin, onSignup }) {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [selectedRole, setSelectedRole] = useState("student")
  const [loading, setLoading] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)
  const [showSignup, setShowSignup] = useState(false)

  const handleDemoLogin = async (role) => {
    setSelectedRole(role)
    const creds = DEMO_CREDENTIALS[role]
    setEmail(creds.email)
    setPassword(creds.password)
    setError(null)
    setLoading(true)
    
    try {
      const result = await authService.login({
        email: creds.email,
        password: creds.password,
        role: role
      })
      
      if (result.success) {
        setSuccess('Login successful!')
        onLogin(role, result.data.user)
      } else {
        setError(result.error || 'Login failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError(null)
    setLoading(true)
    
    try {
      const result = await authService.login({
        email,
        password,
        role: selectedRole
      })
      
      if (result.success) {
        setSuccess('Login successful!')
        onLogin(selectedRole, result.data.user)
      } else {
        setError(result.error || 'Login failed')
      }
    } catch (err) {
      setError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return showSignup ? (
    <SignupPage onSignup={onSignup} onBack={() => setShowSignup(false)} />
  ) : (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4 overflow-hidden">
      {/* Animated background elements */}
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

      {/* Main Container with Left Image and Right Form */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="relative z-10 w-full max-w-5xl"
      >
        <div className="grid md:grid-cols-2 gap-8 items-center">
          {/* Left Side - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="hidden md:block"
          >
            <div className="relative rounded-2xl overflow-hidden">
              <img
                src="/college-transport-bus-modern-dashboard-interface.jpg"
                alt="CTMS Dashboard"
                className="w-full h-full object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 to-transparent flex flex-col justify-end p-6">
                <h3 className="text-2xl font-bold text-white mb-2">Smart Transport Management</h3>
                <p className="text-gray-300">Real-time tracking, AI optimization, and safety features</p>
              </div>
            </div>
          </motion.div>

          {/* Right Side - Login Form */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7 }}
            className="backdrop-blur-xl bg-slate-900/50 border border-purple-500/30 rounded-2xl p-8"
          >
            {/* Header */}
            <div className="text-center mb-8">
              <motion.div whileHover={{ scale: 1.1 }} className="inline-block mb-4">
                <div className="p-3 bg-gradient-to-br from-orange-500 to-pink-500 rounded-xl">
                  <Bus className="w-8 h-8 text-white" />
                </div>
              </motion.div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-orange-500 to-cyan-400 bg-clip-text text-transparent mb-1">
                CTMS 2.0
              </h1>
              <p className="text-gray-400">College Transport Management System</p>
            </div>

            {/* Role Selection */}
            <div className="mb-6">
              <label className="block text-sm font-semibold mb-3 text-gray-300">Select Your Role</label>
              <div className="grid grid-cols-2 gap-3">
                {["admin", "driver", "student", "parent"].map((role) => (
                  <motion.button
                    key={role}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDemoLogin(role)}
                    className={`p-3 rounded-lg font-semibold transition-all capitalize text-sm ${
                      selectedRole === role
                        ? "bg-gradient-to-r from-orange-500 to-pink-500 text-white shadow-lg shadow-orange-500/50"
                        : "bg-slate-800/50 text-gray-300 border border-purple-500/30 hover:border-cyan-400/50 hover:text-cyan-400"
                    }`}
                    disabled={loading}
                  >
                    {role}
                  </motion.button>
                ))}
              </div>
            </div>

            {/* Error/Success Messages */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-400 text-sm"
              >
                <AlertCircle className="w-4 h-4" />
                {error}
              </motion.div>
            )}
            
            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex items-center gap-2 p-3 bg-green-500/10 border border-green-500/30 rounded-lg text-green-400 text-sm"
              >
                <CheckCircle className="w-4 h-4" />
                {success}
              </motion.div>
            )}

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Email Address</label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="you@college.edu"
                  className="w-full px-4 py-2.5 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold mb-2 text-gray-300">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter your password"
                    className="w-full px-4 py-2.5 bg-slate-800/50 border border-purple-500/30 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-cyan-400 focus:border-transparent transition-all"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-300"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                disabled={loading}
                className="w-full bg-gradient-to-r from-orange-500 to-pink-500 text-white py-3 rounded-lg font-semibold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-orange-500/50 transition-all disabled:opacity-50"
              >
                <LogIn className="w-4 h-4" />
                {loading ? "Signing in..." : "Sign In"}
              </motion.button>
            </form>

            {/* Features List */}
            <div className="mt-6 pt-6 border-t border-purple-500/30 space-y-3">
              {["Real-time GPS tracking", "AI-powered route optimization", "Emergency SOS alerts"].map((feature, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                  className="flex items-center gap-2 text-sm text-gray-400"
                >
                  <CheckCircle size={16} className="text-cyan-400" />
                  {feature}
                </motion.div>
              ))}
            </div>

            {/* Signup Link */}
            <div className="mt-4 pt-4 border-t border-purple-500/30 text-center">
              <p className="text-sm text-gray-400">
                Don't have an account?{" "}
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  onClick={() => setShowSignup(true)}
                  className="text-cyan-400 font-semibold hover:text-cyan-300 transition-all"
                >
                  Sign Up Now
                </motion.button>
              </p>
            </div>
          </motion.div>
        </div>
      </motion.div>
    </div>
  )
}
