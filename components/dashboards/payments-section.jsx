"use client"
import { motion } from "framer-motion"
import { CreditCard, DollarSign, CheckCircle, Clock } from "lucide-react"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts"

const PAYMENT_DATA = [
  { month: "Jan", revenue: 8500, paid: 7800, pending: 700 },
  { month: "Feb", revenue: 9200, paid: 8900, pending: 300 },
  { month: "Mar", revenue: 8800, paid: 8200, pending: 600 },
  { month: "Apr", revenue: 10200, paid: 9800, pending: 400 },
  { month: "May", revenue: 11500, paid: 11100, pending: 400 },
]

const PAYMENT_STATUS = [
  { name: "Paid", value: 89, color: "#00d4ff" },
  { name: "Pending", value: 8, color: "#ff6b35" },
  { name: "Failed", value: 3, color: "#ff4444" },
]

export default function PaymentsSection() {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {[
          { label: "Total Revenue", value: "$48,200", icon: DollarSign, color: "from-green-500 to-emerald-500" },
          { label: "Paid", value: "$42,800", icon: CheckCircle, color: "from-cyan-500 to-blue-500" },
          { label: "Pending", value: "$4,200", icon: Clock, color: "from-orange-500 to-pink-500" },
        ].map((stat, idx) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.1 }}
            className="relative rounded-xl p-6 backdrop-blur-xl border border-purple-500/30 overflow-hidden group"
          >
            <div
              className={`absolute inset-0 bg-gradient-to-br ${stat.color} opacity-10 group-hover:opacity-20 transition-opacity`}
            />
            <div className="relative z-10 flex items-start justify-between">
              <div>
                <p className="text-gray-400 text-sm">{stat.label}</p>
                <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
              </div>
              <div className={`p-3 rounded-lg bg-gradient-to-br ${stat.color}`}>
                <stat.icon className="w-5 h-5 text-white" />
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 rounded-xl p-6 backdrop-blur-xl"
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full" />
            Revenue Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={PAYMENT_DATA}>
              <CartesianGrid strokeDasharray="3 3" stroke="rgba(139, 92, 246, 0.1)" />
              <XAxis dataKey="month" stroke="#9a9aaa" />
              <YAxis stroke="#9a9aaa" />
              <Tooltip
                contentStyle={{
                  backgroundColor: "#1a1a2e",
                  border: "1px solid #8b5cf6",
                  borderRadius: "8px",
                  boxShadow: "0 0 20px rgba(139, 92, 246, 0.3)",
                }}
                labelStyle={{ color: "#fff" }}
              />
              <Bar dataKey="revenue" fill="url(#revenueGradient)" radius={[8, 8, 0, 0]} />
              <defs>
                <linearGradient id="revenueGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#00d4ff" />
                  <stop offset="100%" stopColor="#0099cc" />
                </linearGradient>
              </defs>
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 rounded-xl p-6 backdrop-blur-xl"
        >
          <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
            <div className="w-3 h-3 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full" />
            Payment Status
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={PAYMENT_STATUS}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, value }) => `${name}: ${value}%`}
                outerRadius={100}
                fill="#8884d8"
                dataKey="value"
              >
                {PAYMENT_STATUS.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gradient-to-br from-slate-800/50 to-slate-900/50 border border-purple-500/30 rounded-xl p-6 backdrop-blur-xl"
      >
        <h3 className="text-lg font-bold text-white mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {[
            { id: 1, student: "John Doe", amount: "$450", date: "Today", status: "paid" },
            { id: 2, student: "Sarah Smith", amount: "$450", date: "Yesterday", status: "paid" },
            { id: 3, student: "Mike Johnson", amount: "$450", date: "2 days ago", status: "pending" },
            { id: 4, student: "Emma Wilson", amount: "$450", date: "3 days ago", status: "failed" },
          ].map((txn, idx) => (
            <motion.div
              key={txn._id || txn.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 + idx * 0.05 }}
              className="flex items-center justify-between p-4 bg-slate-700/30 border border-purple-500/20 rounded-lg hover:border-cyan-400/50 transition-all"
            >
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-pink-500 rounded-lg flex items-center justify-center">
                  <CreditCard className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-semibold text-white">{txn.user?.name || txn.student || 'Unknown User'}</p>
                  <p className="text-xs text-gray-400">{txn.createdAt ? new Date(txn.createdAt).toLocaleDateString() : txn.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-bold text-white">${txn.amount}</p>
                <span
                  className={`text-xs font-semibold px-2 py-1 rounded ${
                    txn.status === "completed" || txn.status === "paid"
                      ? "bg-cyan-500/20 text-cyan-400"
                      : txn.status === "pending"
                        ? "bg-orange-500/20 text-orange-400"
                        : "bg-red-500/20 text-red-400"
                  }`}
                >
                  {txn.status}
                </span>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </div>
  )
}
