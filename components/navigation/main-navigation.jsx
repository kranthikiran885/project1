"use client"

import Link from "next/link"
import { motion } from "framer-motion"

export default function MainNavigation() {
  const allPages = [
    // Public Pages
    { name: "Home", path: "/", category: "Public" },
    { name: "Landing", path: "/landing", category: "Public" },
    { name: "Authentication", path: "/auth", category: "Public" },
    { name: "Splash Screen", path: "/splash", category: "Public" },
    { name: "Onboarding", path: "/onboarding", category: "Public" },
    { name: "Billing", path: "/billing", category: "Public" },
    
    // Dashboard Pages
    { name: "Admin Dashboard", path: "/dashboard/admin", category: "Dashboard" },
    { name: "Student Portal", path: "/dashboard/student", category: "Dashboard" },
    { name: "Driver Dashboard", path: "/dashboard/driver", category: "Dashboard" },
    { name: "Parent Portal", path: "/dashboard/parent", category: "Dashboard" },
    
    // Feature Pages
    { name: "Analytics", path: "/dashboard/analytics", category: "Features" },
    { name: "Live Tracking", path: "/dashboard/tracking", category: "Features" },
    { name: "Vehicle Management", path: "/dashboard/vehicles", category: "Features" },
    { name: "Route Optimization", path: "/dashboard/routes", category: "Features" },
    { name: "Safety Alerts", path: "/dashboard/safety", category: "Features" },
    { name: "Payment Management", path: "/dashboard/payments", category: "Features" },
    
    // Other Pages
    { name: "Maps", path: "/maps", category: "Other" },
    { name: "Payment Portal", path: "/payments", category: "Other" },
    { name: "Invoices", path: "/invoices", category: "Other" },
  ]

  const categories = [...new Set(allPages.map(page => page.category))]

  return (
    <div className="p-6 bg-slate-800/50 rounded-xl border border-purple-500/30">
      <h3 className="text-xl font-bold text-white mb-6">All Available Pages ({allPages.length})</h3>
      
      {categories.map((category, idx) => (
        <motion.div
          key={category}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: idx * 0.1 }}
          className="mb-6"
        >
          <h4 className="text-lg font-semibold text-cyan-400 mb-3">{category} Pages</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
            {allPages
              .filter(page => page.category === category)
              .map((page, pageIdx) => (
                <motion.div
                  key={page.path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (idx * 0.1) + (pageIdx * 0.05) }}
                >
                  <Link
                    href={page.path}
                    className="block p-3 bg-slate-700/50 hover:bg-slate-600/50 rounded-lg border border-purple-500/20 hover:border-cyan-400/50 transition-all group"
                  >
                    <span className="text-white font-medium group-hover:text-cyan-400 transition-colors">
                      {page.name}
                    </span>
                    <p className="text-xs text-gray-400 mt-1">{page.path}</p>
                  </Link>
                </motion.div>
              ))}
          </div>
        </motion.div>
      ))}
    </div>
  )
}