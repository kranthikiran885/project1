"use client"

import { motion, AnimatePresence } from "framer-motion"
import { Bell, Settings, LogOut, Menu, User, Zap, Search, Clock } from "lucide-react"
import { useState } from "react"

export default function AdminHeader({ userData, onLogout, sidebarOpen, setSidebarOpen }) {
  const [showNotifications, setShowNotifications] = useState(false)
  const [showSearch, setShowSearch] = useState(false)

  return (
    <motion.div
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-slate-900/95 via-purple-900/80 to-slate-900/95 backdrop-blur-xl border-b border-purple-500/20 z-30 shadow-lg shadow-purple-500/10"
    >
      <div className="h-full px-6 flex items-center justify-between gap-4">
        {/* Left Section */}
        <div className="flex items-center gap-4 flex-1">
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "rgba(168, 85, 247, 0.2)" }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-purple-500/20 rounded-lg text-white transition-all duration-200"
          >
            <Menu className="w-5 h-5" />
          </motion.button>

          {/* Logo & Branding */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2.5 cursor-pointer"
          >
            <div className="p-2 bg-gradient-to-br from-orange-500 via-pink-500 to-red-500 rounded-lg shadow-lg shadow-orange-500/30 hover:shadow-orange-500/50 transition-all duration-300">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-orange-400 via-pink-400 to-cyan-400 bg-clip-text text-transparent">
                CTMS 2.0
              </h1>
              <p className="text-xs text-gray-500 font-medium">College Transport Management</p>
            </div>
          </motion.div>

          {/* Search Bar - Optional */}
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: showSearch ? "200px" : "0px", opacity: showSearch ? 1 : 0 }}
            transition={{ duration: 0.3 }}
            className="hidden md:block ml-auto"
          >
            <input
              type="text"
              placeholder="Search..."
              className="w-full px-3 py-2 bg-slate-700/50 border border-purple-500/20 rounded-lg text-white placeholder-gray-500 focus:outline-none focus:border-purple-500/50 focus:ring-1 focus:ring-purple-500/20 transition-all"
            />
          </motion.div>
        </div>

        {/* Right Section */}
        <div className="flex items-center gap-3">
          {/* Search Toggle */}
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowSearch(!showSearch)}
            className="p-2 hover:bg-purple-500/20 rounded-lg text-gray-300 hover:text-white transition-all duration-200 hidden md:block"
          >
            <Search className="w-5 h-5" />
          </motion.button>

          {/* Notifications */}
          <motion.div className="relative">
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(!showNotifications)}
              className="p-2 hover:bg-purple-500/20 rounded-lg text-gray-300 hover:text-white transition-all duration-200 relative group"
            >
              <Bell className="w-5 h-5" />
              <motion.span
                animate={{ scale: [1, 1.2, 1], opacity: [1, 0.7, 1] }}
                transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                className="absolute top-1 right-1 w-2.5 h-2.5 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full shadow-lg shadow-orange-500/50"
              />
              <div className="absolute -top-1 -right-1 px-2 py-1 bg-red-500/90 text-white text-xs font-semibold rounded-full opacity-0 group-hover:opacity-100 transition-all">
                3
              </div>
            </motion.button>

            {/* Notification Dropdown */}
            <AnimatePresence>
              {showNotifications && (
                <motion.div
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  className="absolute right-0 mt-2 w-64 bg-slate-800/95 backdrop-blur-xl border border-purple-500/30 rounded-xl shadow-2xl shadow-purple-500/20 z-40 overflow-hidden"
                >
                  <div className="p-4 border-b border-purple-500/20">
                    <h3 className="text-sm font-bold text-white">Notifications</h3>
                  </div>
                  <div className="max-h-64 overflow-y-auto">
                    {[
                      { title: "Bus Delay Alert", desc: "Route #5 delayed by 5 min", time: "2 min ago" },
                      { title: "Payment Received", desc: "Student fee payment processed", time: "15 min ago" },
                      { title: "Safety Alert", desc: "Emergency SOS from Bus #12", time: "1 hour ago" }
                    ].map((notif, i) => (
                      <motion.div
                        key={i}
                        whileHover={{ backgroundColor: "rgba(168, 85, 247, 0.1)" }}
                        className="px-4 py-3 border-b border-purple-500/10 hover:bg-purple-500/10 transition-colors cursor-pointer last:border-b-0"
                      >
                        <p className="text-sm font-medium text-white">{notif.title}</p>
                        <p className="text-xs text-gray-400">{notif.desc}</p>
                        <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                          <Clock className="w-3 h-3" /> {notif.time}
                        </p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* Settings */}
          <motion.button
            whileHover={{ scale: 1.1, rotate: 20 }}
            whileTap={{ scale: 0.95 }}
            className="p-2 hover:bg-purple-500/20 rounded-lg text-gray-300 hover:text-white transition-all duration-200"
          >
            <Settings className="w-5 h-5" />
          </motion.button>

          {/* Divider */}
          <div className="h-6 w-px bg-gradient-to-b from-purple-500/30 to-transparent" />

          {/* User Profile */}
          <motion.div
            whileHover={{ scale: 1.02 }}
            className="flex items-center gap-2.5 px-3 py-2 rounded-lg hover:bg-purple-500/10 transition-colors cursor-pointer"
          >
            <motion.div
              animate={{ boxShadow: ["0 0 0 0 rgba(249, 115, 22, 0.4)", "0 0 0 8px rgba(249, 115, 22, 0)"] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg"
            >
              <User className="w-4 h-4 text-white" />
            </motion.div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-white">{userData.name}</p>
              <p className="text-xs text-gray-400 font-medium capitalize">Admin</p>
            </div>
          </motion.div>

          {/* Logout */}
          <motion.button
            whileHover={{ scale: 1.1, backgroundColor: "rgba(239, 68, 68, 0.2)" }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogout}
            className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 hover:text-red-300 transition-all duration-200"
            title="Logout"
          >
            <LogOut className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}