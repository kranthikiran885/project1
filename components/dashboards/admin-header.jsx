"use client"

import { motion } from "framer-motion"
import { Bell, Settings, LogOut, Menu, User, Zap } from "lucide-react"

export default function AdminHeader({ userData, onLogout, sidebarOpen, setSidebarOpen }) {
  return (
    <motion.div
      initial={{ y: -64 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
      className="fixed top-0 left-0 right-0 h-16 bg-gradient-to-r from-slate-900/80 to-purple-900/80 backdrop-blur-xl border-b border-purple-500/30 z-30"
    >
      <div className="h-full px-6 flex items-center justify-between">
        {/* Left */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 hover:bg-purple-500/20 rounded-lg text-white transition-colors"
          >
            <Menu className="w-5 h-5" />
          </motion.button>
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg">
              <Zap className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold bg-gradient-to-r from-orange-500 to-cyan-400 bg-clip-text text-transparent">
                CTMS 2.0
              </h1>
              <p className="text-xs text-gray-400">Admin Dashboard</p>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-4">
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="p-2 hover:bg-purple-500/20 rounded-lg text-gray-300 hover:text-white transition-colors relative"
          >
            <Bell className="w-5 h-5" />
            <motion.span
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
              className="absolute top-1 right-1 w-2 h-2 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full shadow-lg shadow-orange-500/50"
            />
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            className="p-2 hover:bg-purple-500/20 rounded-lg text-gray-300 hover:text-white transition-colors"
          >
            <Settings className="w-5 h-5" />
          </motion.button>

          <div className="h-8 w-px bg-purple-500/30" />

          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-gradient-to-br from-orange-500 to-pink-500 rounded-full flex items-center justify-center shadow-lg shadow-orange-500/50">
              <User className="w-4 h-4 text-white" />
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-medium text-white">{userData.name}</p>
              <p className="text-xs text-gray-400 capitalize">Admin • {userData.id}</p>
            </div>
          </div>

          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            onClick={onLogout}
            className="p-2 hover:bg-red-500/20 rounded-lg text-red-400 transition-colors"
          >
            <LogOut className="w-5 h-5" />
          </motion.button>
        </div>
      </div>
    </motion.div>
  )
}
