"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  LogOut, MapPin, Clock, Users, Bell, Settings, Phone, Shield, AlertCircle,
  Navigation, Bus, User, Calendar, MessageSquare, Star, Activity, BarChart3,
  Home, School, CheckCircle, X, Plus, Eye, EyeOff, RefreshCw, Download,
  Heart, Zap, Target, Coffee, BookOpen, CreditCard, Wallet, TrendingUp
} from "lucide-react"
import { useRealTimeData } from "@/hooks/useRealTimeData"
import { useSocket } from "@/components/realtime/socket-integration"
import { dataService } from "@/lib/data-service"

export default function ParentPortal({ userData, onLogout }) {
  const [activeTab, setActiveTab] = useState("home")
  const [showNotifications, setShowNotifications] = useState(false)
  const [childData, setChildData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const { trips, vehicles, loading: realtimeLoading } = useRealTimeData()
  const { connected, notifications, clearNotification } = useSocket()

  // Fetch child data
  useEffect(() => {
    const fetchChildData = async () => {
      try {
        setLoading(true)
        // In a real app, this would fetch the child's data based on parent's account
        const result = await dataService.request('/api/parent/child-info')
        if (result.success) {
          setChildData(result.data)
        } else {
          // Use mock data if API fails
          setChildData({
            name: userData.childName || "Alex Johnson",
            studentId: "STU2024001",
            class: "Grade 10-A",
            school: userData.childCollege || "Central High School",
            busNumber: "B-42",
            route: "Route-A",
            currentLocation: "Main Street Junction",
            eta: "8 mins",
            attendance: 95,
            lastSeen: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
            emergencyContacts: [
              { name: "School Office", phone: "+1-555-0123" },
              { name: "Bus Driver", phone: "+1-555-0456" }
            ]
          })
        }
      } catch (err) {
        setError('Failed to fetch child data')
        // Fallback to mock data
        setChildData({
          name: userData.childName || "Alex Johnson",
          studentId: "STU2024001",
          class: "Grade 10-A",
          school: userData.childCollege || "Central High School",
          busNumber: "B-42",
          route: "Route-A",
          currentLocation: "Main Street Junction",
          eta: "8 mins",
          attendance: 95,
          lastSeen: new Date(Date.now() - 30 * 60 * 1000),
          emergencyContacts: [
            { name: "School Office", phone: "+1-555-0123" },
            { name: "Bus Driver", phone: "+1-555-0456" }
          ]
        })
      } finally {
        setLoading(false)
      }
    }

    fetchChildData()
  }, [userData])

  const tabs = [
    { id: "home", label: "Home", icon: Home },
    { id: "tracking", label: "Live Tracking", icon: MapPin },
    { id: "schedule", label: "Schedule", icon: Calendar },
    { id: "attendance", label: "Attendance", icon: CheckCircle },
    { id: "payments", label: "Payments", icon: CreditCard },
    { id: "settings", label: "Settings", icon: Settings }
  ]

  const handleEmergencyContact = (contact) => {
    if (typeof window !== 'undefined') {
      window.open(`tel:${contact.phone}`, '_self')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-400 mx-auto mb-4"></div>
          <p className="text-gray-400">Loading parent portal...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 pt-20 pb-20">
      <div className="max-w-7xl mx-auto p-4">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800/40 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-6 mb-6"
        >
          <div className="flex items-center justify-between mb-4">
            <div>
              <h1 className="text-3xl font-bold text-white flex items-center gap-3">
                Welcome, {userData.name}! 
                <span className="text-2xl">👨‍👩‍👧‍👦</span>
                {connected && <span className="w-3 h-3 bg-green-400 rounded-full animate-pulse"></span>}
              </h1>
              <p className="text-gray-400 mt-1">Monitoring {childData?.name}'s commute</p>
            </div>
            <div className="flex gap-3">
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-3 hover:bg-cyan-500/20 rounded-lg text-cyan-400 transition-all"
              >
                <Bell className="w-5 h-5" />
                {notifications.length > 0 && (
                  <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                )}
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                onClick={onLogout}
                className="p-3 hover:bg-red-500/20 rounded-lg text-red-400 transition-all"
              >
                <LogOut className="w-5 h-5" />
              </motion.button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            <div className="bg-slate-700/50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400">Child Status</p>
              <p className="text-lg font-bold text-green-400">Safe</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400">Bus ETA</p>
              <p className="text-lg font-bold text-orange-400">{childData?.eta || '--'}</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400">Attendance</p>
              <p className="text-lg font-bold text-cyan-400">{childData?.attendance || 0}%</p>
            </div>
            <div className="bg-slate-700/50 rounded-lg p-3 text-center">
              <p className="text-xs text-gray-400">Last Seen</p>
              <p className="text-lg font-bold text-purple-400">
                {childData?.lastSeen ? new Date(childData.lastSeen).toLocaleTimeString() : '--'}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Navigation Tabs */}
        <div className="bg-slate-800/40 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-2 mb-6">
          <div className="flex overflow-x-auto gap-2">
            {tabs.map((tab) => (
              <motion.button
                key={tab.id}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-4 py-3 rounded-xl transition-all whitespace-nowrap ${
                  activeTab === tab.id
                    ? "bg-purple-500/30 text-purple-300 border border-purple-400/50"
                    : "hover:bg-slate-700/50 text-gray-400"
                }`}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            {activeTab === "home" && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Child Info Card */}
                <motion.div className="bg-slate-800/40 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <User className="w-5 h-5 text-blue-500" />
                    Child Information
                  </h3>
                  <div className="space-y-4">
                    <div className="text-center mb-4">
                      <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-500 rounded-full mx-auto mb-3 flex items-center justify-center text-white text-2xl font-bold">
                        {childData?.name?.charAt(0) || 'A'}
                      </div>
                      <h4 className="text-lg font-bold text-white">{childData?.name}</h4>
                      <p className="text-gray-400">{childData?.class}</p>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Student ID:</span>
                        <span className="text-white font-medium">{childData?.studentId}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">School:</span>
                        <span className="text-white font-medium">{childData?.school}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Bus:</span>
                        <span className="text-white font-medium">{childData?.busNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Route:</span>
                        <span className="text-white font-medium">{childData?.route}</span>
                      </div>
                    </div>
                  </div>
                </motion.div>

                {/* Live Tracking */}
                <motion.div className="bg-slate-800/40 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <MapPin className="w-5 h-5 text-green-500" />
                    Live Tracking
                  </h3>
                  <div className="space-y-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-gray-400">Current Location:</span>
                        <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      </div>
                      <p className="text-white font-medium">{childData?.currentLocation}</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                        <p className="text-gray-400 text-sm">ETA</p>
                        <p className="text-lg font-bold text-orange-400">{childData?.eta}</p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                        <p className="text-gray-400 text-sm">Status</p>
                        <p className="text-lg font-bold text-green-400">On Route</p>
                      </div>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      className="w-full bg-gradient-to-r from-green-500 to-emerald-500 text-white py-3 rounded-lg font-semibold"
                    >
                      View Live Map
                    </motion.button>
                  </div>
                </motion.div>

                {/* Emergency Contacts */}
                <motion.div className="bg-slate-800/40 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                    <Phone className="w-5 h-5 text-red-500" />
                    Emergency Contacts
                  </h3>
                  <div className="space-y-3">
                    {childData?.emergencyContacts?.map((contact, index) => (
                      <motion.button
                        key={index}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => handleEmergencyContact(contact)}
                        className="w-full bg-slate-700/50 hover:bg-red-500/20 border border-red-500/30 rounded-lg p-4 text-left transition-all"
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">{contact.name}</p>
                            <p className="text-gray-400 text-sm">{contact.phone}</p>
                          </div>
                          <Phone className="w-5 h-5 text-red-400" />
                        </div>
                      </motion.button>
                    ))}
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="w-full bg-red-500/20 border border-red-500/50 rounded-lg p-4 text-center transition-all"
                    >
                      <AlertCircle className="w-6 h-6 text-red-400 mx-auto mb-2" />
                      <p className="text-red-400 font-semibold">Emergency SOS</p>
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === "tracking" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Map View */}
                <motion.div className="bg-slate-800/40 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-6 h-96">
                  <h3 className="text-xl font-bold text-white mb-4">Live Bus Location</h3>
                  <div className="relative h-full bg-gradient-to-br from-blue-900/20 to-purple-900/20 rounded-lg flex items-center justify-center">
                    <div className="text-center">
                      <MapPin className="w-12 h-12 text-cyan-400 mx-auto mb-2" />
                      <p className="text-gray-400">Interactive map would be here</p>
                      <p className="text-sm text-gray-500">Showing real-time GPS location</p>
                    </div>
                  </div>
                </motion.div>

                {/* Route Details */}
                <motion.div className="bg-slate-800/40 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Route Progress</h3>
                  <div className="space-y-4">
                    {[
                      { stop: "School", time: "07:30", status: "completed" },
                      { stop: "Main Junction", time: "07:45", status: "completed" },
                      { stop: "City Center", time: "08:00", status: "current" },
                      { stop: "Your Area", time: "08:15", status: "upcoming" },
                      { stop: "Home", time: "08:20", status: "upcoming" }
                    ].map((stop, index) => (
                      <div key={index} className="flex items-center gap-3">
                        <div className={`w-4 h-4 rounded-full ${
                          stop.status === 'completed' ? 'bg-green-500' : 
                          stop.status === 'current' ? 'bg-blue-500 animate-pulse' : 'bg-gray-400'
                        }`}></div>
                        <div className="flex-1">
                          <p className="font-medium text-white">{stop.stop}</p>
                          <p className="text-sm text-gray-400">{stop.time}</p>
                        </div>
                        {stop.status === 'current' && (
                          <span className="text-xs bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full">Current</span>
                        )}
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === "attendance" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div className="bg-slate-800/40 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Attendance Overview</h3>
                  <div className="text-center mb-6">
                    <div className="text-4xl font-bold text-green-400 mb-2">{childData?.attendance}%</div>
                    <p className="text-gray-400">This Month</p>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-gray-400">Present Days:</span>
                      <span className="text-green-400 font-semibold">19</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Absent Days:</span>
                      <span className="text-red-400 font-semibold">1</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-400">Total Days:</span>
                      <span className="text-white font-semibold">20</span>
                    </div>
                  </div>
                </motion.div>

                <motion.div className="bg-slate-800/40 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    {[
                      { date: "Today", status: "Present", time: "08:15 AM" },
                      { date: "Yesterday", status: "Present", time: "08:12 AM" },
                      { date: "Dec 18", status: "Present", time: "08:20 AM" },
                      { date: "Dec 17", status: "Absent", time: "N/A" },
                      { date: "Dec 16", status: "Present", time: "08:18 AM" }
                    ].map((record, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{record.date}</p>
                          <p className="text-gray-400 text-sm">{record.time}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                          record.status === 'Present' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {record.status}
                        </span>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === "payments" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div className="bg-slate-800/40 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Payment Overview</h3>
                  <div className="space-y-4">
                    <div className="bg-slate-700/50 rounded-lg p-4">
                      <p className="text-gray-400 text-sm">Current Balance</p>
                      <p className="text-2xl font-bold text-green-400">$245.00</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                        <p className="text-gray-400 text-sm">This Month</p>
                        <p className="text-lg font-bold text-orange-400">$45.00</p>
                      </div>
                      <div className="bg-slate-700/50 rounded-lg p-3 text-center">
                        <p className="text-gray-400 text-sm">Next Due</p>
                        <p className="text-lg font-bold text-cyan-400">Jan 1</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div className="bg-slate-800/40 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Recent Transactions</h3>
                  <div className="space-y-3">
                    {[
                      { date: "Dec 19", amount: "$45.00", type: "Monthly Fee", status: "Paid" },
                      { date: "Nov 19", amount: "$45.00", type: "Monthly Fee", status: "Paid" },
                      { date: "Oct 19", amount: "$45.00", type: "Monthly Fee", status: "Paid" }
                    ].map((transaction, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
                        <div>
                          <p className="text-white font-medium">{transaction.type}</p>
                          <p className="text-gray-400 text-sm">{transaction.date}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-white font-bold">{transaction.amount}</p>
                          <span className="text-xs bg-green-500/20 text-green-400 px-2 py-1 rounded-full">
                            {transaction.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              </div>
            )}

            {activeTab === "settings" && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div className="bg-slate-800/40 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Notification Settings</h3>
                  <div className="space-y-4">
                    {[
                      { label: "Bus Arrival Alerts", enabled: true },
                      { label: "Attendance Notifications", enabled: true },
                      { label: "Emergency Alerts", enabled: true },
                      { label: "Payment Reminders", enabled: false },
                      { label: "Route Changes", enabled: true }
                    ].map((setting, index) => (
                      <div key={index} className="flex justify-between items-center p-3 bg-slate-700/50 rounded-lg">
                        <span className="text-white">{setting.label}</span>
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          className={`w-12 h-6 rounded-full transition-all ${
                            setting.enabled ? 'bg-green-500' : 'bg-gray-600'
                          }`}
                        >
                          <div className={`w-5 h-5 bg-white rounded-full transition-all ${
                            setting.enabled ? 'translate-x-6' : 'translate-x-0.5'
                          }`}></div>
                        </motion.button>
                      </div>
                    ))}
                  </div>
                </motion.div>

                <motion.div className="bg-slate-800/40 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-6">
                  <h3 className="text-xl font-bold text-white mb-4">Account Settings</h3>
                  <div className="space-y-4">
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-gray-400 text-sm">Parent Name</p>
                      <p className="text-white font-medium">{userData.name}</p>
                    </div>
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-gray-400 text-sm">Email</p>
                      <p className="text-white font-medium">{userData.email}</p>
                    </div>
                    <div className="p-3 bg-slate-700/50 rounded-lg">
                      <p className="text-gray-400 text-sm">Phone</p>
                      <p className="text-white font-medium">{userData.phone}</p>
                    </div>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      className="w-full bg-gradient-to-r from-purple-500 to-cyan-500 text-white py-3 rounded-lg font-semibold"
                    >
                      Update Profile
                    </motion.button>
                  </div>
                </motion.div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>

        {/* Notifications Panel */}
        <AnimatePresence>
          {showNotifications && (
            <motion.div
              initial={{ opacity: 0, x: 300 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 300 }}
              className="fixed top-20 right-4 w-80 bg-slate-800/90 backdrop-blur-lg border border-purple-500/30 rounded-2xl p-4 max-h-96 overflow-y-auto z-50"
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-white">Notifications</h3>
                <button onClick={() => setShowNotifications(false)} className="text-gray-400 hover:text-white">
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="space-y-3">
                {notifications.length === 0 ? (
                  <p className="text-gray-400 text-center py-4">No new notifications</p>
                ) : (
                  notifications.map((notif) => (
                    <motion.div
                      key={notif.id}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      className="p-3 rounded-lg border bg-blue-500/10 border-blue-500/30"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <p className="font-semibold text-white text-sm">{notif.title}</p>
                          <p className="text-xs text-gray-400">{notif.message}</p>
                          <p className="text-xs text-gray-500 mt-1">{notif.timestamp?.toLocaleTimeString()}</p>
                        </div>
                        <button
                          onClick={() => clearNotification(notif.id)}
                          className="text-gray-400 hover:text-white ml-2"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}