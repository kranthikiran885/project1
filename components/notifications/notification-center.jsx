"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bell, X, CheckCircle, AlertCircle, Info } from "lucide-react"

export default function NotificationCenter({ notifications = [] }) {
  const [expandedNotif, setExpandedNotif] = useState(null)

  const getIcon = (type) => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-5 h-5 text-chart-5" />
      case "warning":
        return <AlertCircle className="w-5 h-5 text-primary" />
      case "info":
        return <Info className="w-5 h-5 text-accent" />
      default:
        return <Bell className="w-5 h-5 text-muted-foreground" />
    }
  }

  return (
    <div className="fixed top-20 right-4 z-40 max-w-sm space-y-2">
      <AnimatePresence>
        {notifications.map((notif, idx) => (
          <motion.div
            key={notif.id || idx}
            initial={{ opacity: 0, x: 400, y: -20 }}
            animate={{ opacity: 1, x: 0, y: 0 }}
            exit={{ opacity: 0, x: 400, y: -20 }}
            transition={{ duration: 0.3 }}
            className="bg-card border border-border rounded-lg p-4 backdrop-blur-sm shadow-lg"
          >
            <div className="flex items-start gap-3">
              {getIcon(notif.type)}
              <div className="flex-1">
                <p className="font-semibold text-foreground text-sm">{notif.message || notif.title}</p>
                {notif.description && <p className="text-xs text-muted-foreground mt-1">{notif.description}</p>}
              </div>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </motion.button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}
