"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
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
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
        <AdminHeader
          userData={userData}
          onLogout={onLogout}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
        />

        <div className="flex">
          {/* Sidebar */}
          <motion.div
            initial={{ x: -300 }}
            animate={{ x: sidebarOpen ? 0 : -300 }}
            transition={{ duration: 0.3 }}
            className="fixed left-0 top-16 w-64 h-[calc(100vh-64px)] bg-gradient-to-b from-slate-800/50 to-slate-900/50 backdrop-blur-xl border-r border-purple-500/30 z-20 overflow-y-auto"
          >
            <nav className="p-4 space-y-2">
              {navItems.map(({ id, label, icon: Icon, color }) => (
                <motion.button
                  key={id}
                  whileHover={{ x: 4 }}
                  onClick={() => setActiveTab(id)}
                  className={`w-full text-left px-4 py-3 rounded-lg font-medium flex items-center gap-3 transition-all ${
                    activeTab === id
                      ? `bg-gradient-to-r ${color} text-white shadow-lg`
                      : "text-gray-300 hover:bg-slate-700/50 hover:text-white"
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {label}
                </motion.button>
              ))}
            </nav>
          </motion.div>

          {/* Main Content */}
          <div className={`flex-1 transition-all ${sidebarOpen ? "md:ml-64" : ""}`}>
            <div className="p-6 max-w-7xl">
              {activeTab === "overview" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h1 className="text-3xl font-bold text-white">Dashboard Overview</h1>
                      <p className="text-gray-400">Welcome back, {userData.name}!</p>
                      {loading && <p className="text-sm text-cyan-400">Loading real-time data...</p>}
                      {error && <p className="text-sm text-red-400">Error: {error}</p>}
                    </div>
                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all"
                      >
                        <Download className="w-4 h-4" />
                        Export
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="flex items-center gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-cyan-500/50 transition-all"
                      >
                        <Plus className="w-4 h-4" />
                        Add
                      </motion.button>
                    </div>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {stats.map((stat, i) => {
                      const StatIcon = stat.icon
                      return (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, y: 20 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ delay: i * 0.1 }}
                          whileHover={{ y: -4 }}
                          className={`relative rounded-xl overflow-hidden border border-purple-500/30 p-6 ${
                            loading ? 'animate-pulse' : ''
                          }`}
                        >
                          <img
                            src="/data-analytics-dashboard.png"
                            alt={stat.label}
                            className="absolute inset-0 w-full h-full object-cover opacity-10"
                          />
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-4">
                              <p className="text-gray-400 text-sm">{stat.label}</p>
                              <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-lg`}>
                                <StatIcon className="w-5 h-5 text-white" />
                              </div>
                            </div>
                            <p className="text-3xl font-bold text-white">{stat.value}</p>
                            {dashboardStats && (
                              <p className="text-xs text-gray-500 mt-2">
                                Last updated: {new Date(dashboardStats.timestamp).toLocaleTimeString()}
                              </p>
                            )}
                          </div>
                        </motion.div>
                      )
                    })}
                  </div>

                  {/* Main Content Sections */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
                    <div className="lg:col-span-2">
                      <RealtimeMap />
                    </div>
                    <div>
                      <AnalyticsSection />
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "analytics" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h1 className="text-3xl font-bold mb-6 text-white">Analytics & Insights</h1>
                  <AnalyticsSection />
                </motion.div>
              )}

              {activeTab === "tracking" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                  className="space-y-6"
                >
                  <h1 className="text-3xl font-bold text-white">Advanced Live Tracking</h1>
                  <RealtimeTrackingAdvanced />
                </motion.div>
              )}

              {activeTab === "vehicles" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="flex items-center justify-between mb-6">
                    <h1 className="text-3xl font-bold text-white">Vehicle Management</h1>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="flex items-center gap-2 bg-gradient-to-r from-orange-500 to-pink-500 text-white px-4 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all"
                    >
                      <Plus className="w-4 h-4" />
                      Add Vehicle
                    </motion.button>
                  </div>
                  <VehicleManagement />
                </motion.div>
              )}

              {activeTab === "payments" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h1 className="text-3xl font-bold mb-6 text-white">Payment & Billing</h1>
                  <PaymentsSection />
                </motion.div>
              )}

              {activeTab === "safety" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h1 className="text-3xl font-bold mb-6 text-white">Safety Alerts & SOS</h1>
                  <SafetyAlerts />
                </motion.div>
              )}

              {activeTab === "routing" && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <h1 className="text-3xl font-bold mb-6 text-white">Route Optimization</h1>
                  <RouteOptimization />
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </SocketListener>
  )
}
