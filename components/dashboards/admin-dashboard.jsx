"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  BarChart3,
  Users,
  Bus,
  MapPin,
  AlertCircle,
  TrendingUp,
  Download,
  Plus,
  Activity,
  DollarSign,
  ChevronRight,
  Zap,
  RefreshCw,
  Clock,
} from "lucide-react"
import AdminHeader from "./admin-header"
import RealtimeMap from "./realtime-map"
import AnalyticsSection from "./analytics-section"
import VehicleManagement from "./vehicle-management"
import PaymentsSection from "./payments-section"
import SafetyAlerts from "./safety-alerts"
import RouteOptimization from "./route-optimization"
import RealtimeTrackingAdvanced from "./realtime-tracking-advanced"
import SocketListener from "../notifications/socket-listener"
import { dataService } from "../../lib/data-service"

export default function AdminDashboard({ userData, onLogout }) {
  const [sidebarOpen, setSidebarOpen] = useState(true)
  const [activeTab, setActiveTab] = useState("overview")
  const [dashboardStats, setDashboardStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [lastUpdate, setLastUpdate] = useState(null)

  const navItems = [
    { id: "overview", label: "Overview", icon: BarChart3, color: "from-orange-500 to-pink-500" },
    { id: "vehicles", label: "Vehicles", icon: Bus, color: "from-cyan-500 to-blue-500" },
    { id: "tracking", label: "Live Tracking", icon: MapPin, color: "from-purple-500 to-pink-500" },
    { id: "analytics", label: "Analytics", icon: TrendingUp, color: "from-green-500 to-cyan-500" },
    { id: "payments", label: "Payments", icon: DollarSign, color: "from-yellow-500 to-orange-500" },
    { id: "safety", label: "Safety Alerts", icon: AlertCircle, color: "from-red-500 to-orange-500" },
    { id: "routing", label: "Route Optimization", icon: Activity, color: "from-blue-500 to-purple-500" },
    { id: "users", label: "Users", icon: Users, color: "from-indigo-500 to-purple-500" },
  ]

  // Fetch dashboard stats on component mount
  useEffect(() => {
    const fetchDashboardStats = async () => {
      try {
        setLoading(true)
        const result = await dataService.request('/api/dashboard/stats')
        if (result.success) {
          setDashboardStats(result.data)
          setLastUpdate(new Date())
        } else {
          setError(result.error)
        }
      } catch (err) {
        setError('Failed to fetch dashboard data')
      } finally {
        setLoading(false)
      }
    }

    fetchDashboardStats()
    
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchDashboardStats, 30000)
    return () => clearInterval(interval)
  }, [])

  const stats = dashboardStats ? [
    { 
      label: "Active Buses", 
      value: dashboardStats.activeVehicles?.toString() || "0", 
      icon: Bus, 
      color: "from-orange-500 to-pink-500" 
    },
    { 
      label: "Total Students", 
      value: dashboardStats.studentsCount?.toLocaleString() || "0", 
      icon: Users, 
      color: "from-cyan-500 to-blue-500" 
    },
    { 
      label: "Revenue (Month)", 
      value: `$${dashboardStats.monthlyRevenue?.toLocaleString() || '0'}`, 
      icon: DollarSign, 
      color: "from-green-500 to-emerald-500" 
    },
    { 
      label: "Safety Score", 
      value: `${dashboardStats.safetyScore || 0}%`, 
      icon: AlertCircle, 
      color: "from-purple-500 to-pink-500" 
    },
  ] : [
    { label: "Active Buses", value: "--", icon: Bus, color: "from-orange-500 to-pink-500" },
    { label: "Total Students", value: "--", icon: Users, color: "from-cyan-500 to-blue-500" },
    { label: "Revenue (Month)", value: "--", icon: DollarSign, color: "from-green-500 to-emerald-500" },
    { label: "Safety Score", value: "--", icon: AlertCircle, color: "from-purple-500 to-pink-500" },
  ]

  return (
    <SocketListener>
      <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950">
        <AdminHeader
          userData={userData}
          onLogout={onLogout}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="flex">
          {/* Enhanced Sidebar */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: sidebarOpen ? 0 : -300 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="fixed left-0 top-16 w-64 h-[calc(100vh-64px)] bg-gradient-to-b from-slate-800/80 to-slate-900/80 backdrop-blur-2xl border-r border-purple-500/20 z-20 overflow-y-auto shadow-2xl"
          >
            <nav className="p-4 space-y-1">
              {navItems.map(({ id, label, icon: Icon, color }) => (
                <motion.button
                  key={id}
                  whileHover={{ x: 6, scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(id)}
                  className={`w-full text-left px-4 py-3.5 rounded-xl font-medium flex items-center gap-3 transition-all duration-200 relative group ${
                    activeTab === id
                      ? `bg-gradient-to-r ${color} text-white shadow-lg shadow-purple-500/30 border border-white/20`
                      : "text-gray-300 hover:bg-slate-700/50 hover:text-white border border-transparent"
                  }`}
                >
                  {activeTab === id && (
                    <motion.div
                      layoutId="activeIndicator"
                      className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-transparent via-white to-transparent rounded-r-full"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                  <Icon className="w-5 h-5 flex-shrink-0" />
                  <span className="flex-1">{label}</span>
                  {activeTab === id && (
                    <ChevronRight className="w-4 h-4 ml-auto" />
                  )}
                </motion.button>
              ))}
            </nav>
          </motion.div>

          {/* Main Content */}
          <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? "md:ml-64" : ""}`}>
            <div className="p-8 max-w-7xl">
              {activeTab === "overview" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-8"
                >
                  {/* Header Section */}
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
                        Dashboard Overview
                      </h1>
                      <p className="text-gray-400 mt-2">Welcome back, {userData.name}! 👋</p>
                      {lastUpdate && (
                        <div className="flex items-center gap-2 mt-3 text-xs text-gray-500">
                          <Clock className="w-3.5 h-3.5" />
                          Last updated: {lastUpdate.toLocaleTimeString()}
                        </div>
                      )}
                    </motion.div>

                    {/* Action Buttons */}
                    <motion.div
                      className="flex gap-3 w-full md:w-auto flex-wrap md:flex-nowrap"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <motion.button
                        whileHover={{ scale: 1.05, shadow: "0 0 20px rgba(249, 115, 22, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 whitespace-nowrap"
                      >
                        <Download className="w-4 h-4" />
                        Export Report
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05, shadow: "0 0 20px rgba(34, 197, 94, 0.4)" }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 whitespace-nowrap"
                      >
                        <Plus className="w-4 h-4" />
                        Add New
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 bg-slate-700/50 hover:bg-slate-600/50 text-white px-5 py-2.5 rounded-lg font-semibold transition-all duration-200 border border-slate-600/30"
                      >
                        <RefreshCw className="w-4 h-4" />
                        Refresh
                      </motion.button>
                    </motion.div>
                  </div>

                  {/* Status Indicator */}
                  {error && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="bg-red-500/10 border border-red-500/30 rounded-lg p-4 flex items-center gap-3"
                    >
                      <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
                      <p className="text-red-200">{error}</p>
                    </motion.div>
                  )}

                  {/* Stats Grid - Enhanced */}
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ staggerChildren: 0.1, delayChildren: 0.2 }}
                  >
                    {stats.map((stat, i) => {
                      const StatIcon = stat.icon
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          whileHover={{ y: -8, scale: 1.02 }}
                          className={`group relative rounded-2xl overflow-hidden border border-purple-500/20 p-6 bg-gradient-to-br from-slate-800/50 to-slate-900/50 backdrop-blur-xl transition-all duration-300 ${
                            loading ? 'animate-pulse' : ''
                          }`}
                        >
                          {/* Animated background gradient */}
                          <div className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-0 group-hover:opacity-10 transition-all duration-500`} />
                          
                          {/* Decorative elements */}
                          <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-purple-500/10 to-transparent rounded-full blur-2xl -mr-10 -mt-10" />
                          <div className="absolute bottom-0 left-0 w-20 h-20 bg-gradient-to-tr from-cyan-500/10 to-transparent rounded-full blur-2xl -ml-10 -mb-10" />

                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-5">
                              <p className="text-gray-400 text-sm font-medium">{stat.label}</p>
                              <motion.div
                                whileHover={{ rotate: 12, scale: 1.1 }}
                                className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl shadow-lg`}
                              >
                                <StatIcon className="w-5 h-5 text-white" />
                              </motion.div>
                            </div>
                            <motion.p
                              key={stat.value}
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              className="text-4xl font-bold bg-gradient-to-r from-white to-gray-300 bg-clip-text text-transparent"
                            >
                              {stat.value}
                            </motion.p>
                            <motion.div
                              className="flex items-center gap-2 mt-3"
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              transition={{ delay: 0.5 }}
                            >
                              <Zap className="w-3.5 h-3.5 text-cyan-400" />
                              <p className="text-xs text-gray-500">Real-time monitoring</p>
                            </motion.div>
                          </div>
                        </motion.div>
                      )
                    })}
                  </motion.div>

                  {/* Main Content Sections - Enhanced Layout */}
                  <motion.div
                    className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                  >
                    <div className="lg:col-span-2">
                      <motion.div
                        className="rounded-2xl border border-purple-500/20 overflow-hidden bg-slate-800/30 backdrop-blur-xl"
                        whileHover={{ borderColor: "rgba(168, 85, 247, 0.4)" }}
                      >
                        <div className="p-6 border-b border-purple-500/10">
                          <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <MapPin className="w-5 h-5 text-cyan-400" />
                            Real-time Vehicle Tracking
                          </h2>
                        </div>
                        <RealtimeMap />
                      </motion.div>
                    </div>
                    <div>
                      <motion.div
                        className="rounded-2xl border border-purple-500/20 overflow-hidden bg-slate-800/30 backdrop-blur-xl h-full"
                        whileHover={{ borderColor: "rgba(168, 85, 247, 0.4)" }}
                      >
                        <div className="p-6 border-b border-purple-500/10">
                          <h2 className="text-xl font-bold text-white flex items-center gap-2">
                            <TrendingUp className="w-5 h-5 text-green-400" />
                            Quick Analytics
                          </h2>
                        </div>
                        <AnalyticsSection />
                      </motion.div>
                    </div>
                  </motion.div>
                </motion.div>
              )}

              {activeTab === "analytics" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                  >
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-green-400 via-cyan-400 to-blue-400 bg-clip-text text-transparent">
                      Analytics & Insights
                    </h1>
                    <p className="text-gray-400 mt-2">Comprehensive data analysis and reporting</p>
                  </motion.div>
                  <motion.div
                    className="rounded-2xl border border-purple-500/20 overflow-hidden bg-slate-800/30 backdrop-blur-xl"
                    whileHover={{ borderColor: "rgba(168, 85, 247, 0.4)" }}
                  >
                    <AnalyticsSection />
                  </motion.div>
                </motion.div>
              )}

              {activeTab === "tracking" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                  >
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-purple-400 via-pink-400 to-red-400 bg-clip-text text-transparent">
                      Advanced Live Tracking
                    </h1>
                    <p className="text-gray-400 mt-2">Real-time vehicle locations and routes</p>
                  </motion.div>
                  <motion.div
                    className="rounded-2xl border border-purple-500/20 overflow-hidden bg-slate-800/30 backdrop-blur-xl"
                    whileHover={{ borderColor: "rgba(168, 85, 247, 0.4)" }}
                  >
                    <RealtimeTrackingAdvanced />
                  </motion.div>
                </motion.div>
              )}

              {activeTab === "vehicles" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-8">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                    >
                      <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-cyan-400 via-blue-400 to-indigo-400 bg-clip-text text-transparent">
                        Vehicle Management
                      </h1>
                      <p className="text-gray-400 mt-2">Monitor and manage your fleet</p>
                    </motion.div>
                    <motion.button
                      whileHover={{ scale: 1.05, shadow: "0 0 20px rgba(249, 115, 22, 0.4)" }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-5 py-2.5 rounded-lg font-semibold hover:shadow-lg transition-all duration-200 whitespace-nowrap"
                    >
                      <Plus className="w-4 h-4" />
                      Add Vehicle
                    </motion.button>
                  </div>
                  <motion.div
                    className="rounded-2xl border border-purple-500/20 overflow-hidden bg-slate-800/30 backdrop-blur-xl"
                    whileHover={{ borderColor: "rgba(168, 85, 247, 0.4)" }}
                  >
                    <VehicleManagement />
                  </motion.div>
                </motion.div>
              )}

              {activeTab === "payments" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                  >
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-yellow-400 via-orange-400 to-red-400 bg-clip-text text-transparent">
                      Payment & Billing
                    </h1>
                    <p className="text-gray-400 mt-2">Manage payments, invoices, and billing cycles</p>
                  </motion.div>
                  <motion.div
                    className="rounded-2xl border border-purple-500/20 overflow-hidden bg-slate-800/30 backdrop-blur-xl"
                    whileHover={{ borderColor: "rgba(168, 85, 247, 0.4)" }}
                  >
                    <PaymentsSection />
                  </motion.div>
                </motion.div>
              )}

              {activeTab === "safety" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                  >
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-red-400 via-pink-400 to-orange-400 bg-clip-text text-transparent">
                      Safety Alerts & SOS
                    </h1>
                    <p className="text-gray-400 mt-2">Monitor safety incidents and emergency alerts</p>
                  </motion.div>
                  <motion.div
                    className="rounded-2xl border border-purple-500/20 overflow-hidden bg-slate-800/30 backdrop-blur-xl"
                    whileHover={{ borderColor: "rgba(168, 85, 247, 0.4)" }}
                  >
                    <SafetyAlerts />
                  </motion.div>
                </motion.div>
              )}

              {activeTab === "routing" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                  >
                    <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                      Route Optimization
                    </h1>
                    <p className="text-gray-400 mt-2">Optimize routes for efficiency and cost savings</p>
                  </motion.div>
                  <motion.div
                    className="rounded-2xl border border-purple-500/20 overflow-hidden bg-slate-800/30 backdrop-blur-xl"
                    whileHover={{ borderColor: "rgba(168, 85, 247, 0.4)" }}
                  >
                    <RouteOptimization />
                  </motion.div>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SocketListener>
  )
}
