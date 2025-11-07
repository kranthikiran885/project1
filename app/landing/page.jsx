"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import { ChevronDown, MapPin, Shield, Zap, Users, TrendingUp, ArrowRight, Menu, X } from "lucide-react"
import Link from "next/link"

export default function LandingPage() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2 },
    },
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.8, ease: "easeOut" },
    },
  }

  return (
    <div className="bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 text-white min-h-screen">
      {/* Navigation */}
      <nav className="fixed top-0 w-full z-50 backdrop-blur-md bg-slate-900/80 border-b border-purple-500/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-2xl font-bold bg-gradient-to-r from-orange-500 to-cyan-400 bg-clip-text text-transparent"
            >
              CTMS 2.0
            </motion.div>

            {/* Desktop Menu */}
            <div className="hidden md:flex gap-8">
              {["Features", "Pricing", "About", "Contact"].map((item) => {
                const href = item === "Pricing" ? "/billing" : `#${item.toLowerCase()}`
                return (
                  <motion.a
                    key={item}
                    href={href}
                    whileHover={{ textShadow: "0 0 8px rgba(0, 212, 255, 0.6)" }}
                    className="text-gray-300 hover:text-cyan-400 transition-colors"
                  >
                    {item}
                  </motion.a>
                )
              })}
            </div>

            {/* CTA Button */}
            <motion.div whileHover={{ scale: 1.05 }} className="hidden md:block">
              <Link
                href="/auth"
                className="bg-gradient-to-r from-orange-500 to-pink-500 px-6 py-2 rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all"
              >
                Get Started
              </Link>
            </motion.div>

            {/* Mobile Menu Button */}
            <button className="md:hidden" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="md:hidden pb-4 space-y-2"
            >
              {["Features", "Pricing", "About", "Contact"].map((item) => (
                <a key={item} href={`#${item.toLowerCase()}`} className="block text-gray-300 hover:text-cyan-400 py-2">
                  {item}
                </a>
              ))}
            </motion.div>
          )}
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 px-4 sm:px-6 lg:px-8 min-h-screen flex items-center">
        <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <motion.div variants={containerVariants} initial="hidden" animate="visible" className="space-y-6">
            <motion.h1 variants={itemVariants} className="text-5xl md:text-6xl font-bold leading-tight">
              Ride Smart,
              <span className="bg-gradient-to-r from-orange-500 via-pink-500 to-cyan-400 bg-clip-text text-transparent">
                {" "}
                Ride Safe
              </span>
            </motion.h1>

            <motion.p variants={itemVariants} className="text-xl text-gray-300">
              Smart college transport management with real-time tracking, AI-powered optimization, and comprehensive
              safety features.
            </motion.p>

            <motion.div variants={itemVariants} className="flex gap-4">
              <Link
                href="/auth"
                className="bg-gradient-to-r from-orange-500 to-pink-500 px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all flex items-center gap-2"
              >
                Start Free Trial <ArrowRight size={18} />
              </Link>
              <button className="border border-cyan-400 px-8 py-3 rounded-lg font-semibold hover:bg-cyan-400/10 transition-all">
                Watch Demo
              </button>
            </motion.div>

            <motion.div variants={itemVariants} className="flex gap-8 pt-8">
              {[
                { icon: Users, label: "500+ Colleges" },
                { icon: TrendingUp, label: "99.9% Uptime" },
                { icon: Shield, label: "Enterprise Security" },
              ].map((stat, i) => (
                <div key={i} className="flex items-center gap-2">
                  <stat.icon className="text-cyan-400" size={20} />
                  <span className="text-gray-400">{stat.label}</span>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1 }}
            className="relative"
          >
            <div className="relative w-full h-96 md:h-full">
              <img
                src="/college-transport-bus-modern-dashboard-interface.jpg"
                alt="CTMS Dashboard"
                className="w-full h-full object-cover rounded-2xl shadow-2xl"
              />
              <div className="absolute inset-0 bg-gradient-to-tr from-orange-500/20 to-cyan-400/20 rounded-2xl"></div>
            </div>
          </motion.div>
        </div>

        {/* Scroll Indicator */}
        <motion.div
          animate={{ y: [0, 10, 0] }}
          transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2"
        >
          <ChevronDown size={32} className="text-cyan-400" />
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-transparent to-purple-900/20">
        <div className="max-w-7xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Powerful Features for
              <span className="text-cyan-400"> Every Role</span>
            </h2>
            <p className="text-xl text-gray-400 max-w-2xl mx-auto">
              From students to drivers to administrators, CTMS 2.0 provides comprehensive tools for everyone.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                icon: MapPin,
                title: "Real-Time Tracking",
                description: "Live GPS tracking with dynamic ETA calculations and route optimization",
                image: "/gps-tracking-map-interface.jpg",
              },
              {
                icon: Shield,
                title: "Safety First",
                description: "Emergency SOS alerts, incident reporting, and geofence notifications",
                image: "/security-safety-alert-system.jpg",
              },
              {
                icon: Zap,
                title: "AI Optimization",
                description: "Machine learning-powered route optimization and predictive maintenance",
                image: "/ai-artificial-intelligence-dashboard.jpg",
              },
              {
                icon: TrendingUp,
                title: "Advanced Analytics",
                description: "Comprehensive reports, driver performance metrics, and business insights",
                image: "/analytics-charts-data-visualization.jpg",
              },
              {
                icon: Users,
                title: "Multi-Role Portal",
                description: "Dedicated dashboards for admin, drivers, students, and parents",
                image: "/users-multi-role-management.jpg",
              },
              {
                icon: Zap,
                title: "Smart Payments",
                description: "Online payments, invoicing, subscriptions, and payment tracking",
                image: "/payment-billing-system-interface.jpg",
              },
            ].map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                whileHover={{ y: -10 }}
                className="group"
              >
                <div className="relative bg-gradient-to-br from-purple-900/50 to-slate-900/50 backdrop-blur-xl border border-purple-500/30 rounded-xl overflow-hidden hover:border-cyan-400/50 transition-all duration-300 h-full">
                  {/* Feature Image */}
                  <div className="relative h-40 overflow-hidden">
                    <img
                      src={feature.image || "/placeholder.svg"}
                      alt={feature.title}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900/80"></div>
                  </div>

                  {/* Content */}
                  <div className="p-6 relative">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="p-2 bg-gradient-to-br from-orange-500 to-cyan-400 rounded-lg">
                        <feature.icon size={20} className="text-white" />
                      </div>
                      <h3 className="text-xl font-bold">{feature.title}</h3>
                    </div>
                    <p className="text-gray-400">{feature.description}</p>
                  </div>

                  {/* Border Glow */}
                  <div className="absolute inset-0 border border-transparent group-hover:border-cyan-400/50 rounded-xl transition-all duration-300 pointer-events-none"></div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { value: "500+", label: "Active Colleges" },
              { value: "50K+", label: "Daily Rides" },
              { value: "99.9%", label: "Uptime" },
              { value: "4.9/5", label: "User Rating" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.5 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-8 bg-gradient-to-br from-orange-500/10 to-cyan-400/10 rounded-xl border border-purple-500/20"
              >
                <div className="text-4xl font-bold bg-gradient-to-r from-orange-500 to-cyan-400 bg-clip-text text-transparent mb-2">
                  {stat.value}
                </div>
                <div className="text-gray-400">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-orange-900/30 to-cyan-900/30">
        <div className="max-w-4xl mx-auto text-center">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-bold mb-6"
          >
            Ready to Transform Your
            <span className="text-cyan-400"> College Transport?</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-400 mb-8"
          >
            Join 500+ colleges using CTMS 2.0 for smart, safe, and efficient transport management.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="flex gap-4 justify-center flex-wrap"
          >
            <Link
              href="/auth"
              className="bg-gradient-to-r from-orange-500 to-pink-500 px-8 py-3 rounded-lg font-semibold hover:shadow-lg hover:shadow-orange-500/50 transition-all"
            >
              Get Started Today
            </Link>
            <button className="border border-cyan-400 px-8 py-3 rounded-lg font-semibold hover:bg-cyan-400/10 transition-all">
              Schedule Demo
            </button>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-purple-500/30 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            {[
              { title: "Product", items: ["Features", "Pricing", "Security", "Roadmap"] },
              { title: "Company", items: ["About", "Blog", "Careers", "Press"] },
              { title: "Resources", items: ["Documentation", "Help Center", "API Docs", "Community"] },
              { title: "Legal", items: ["Privacy", "Terms", "License", "Contact"] },
            ].map((col, i) => (
              <div key={i}>
                <h4 className="font-semibold mb-4 text-cyan-400">{col.title}</h4>
                <ul className="space-y-2">
                  {col.items.map((item) => (
                    <li key={item}>
                      <a href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                        {item}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="border-t border-purple-500/30 pt-8 flex justify-between items-center">
            <p className="text-gray-400">© 2025 CTMS 2.0. All rights reserved.</p>
            <div className="flex gap-4">
              {["Twitter", "LinkedIn", "GitHub"].map((social) => (
                <a key={social} href="#" className="text-gray-400 hover:text-cyan-400 transition-colors">
                  {social}
                </a>
              ))}
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}
