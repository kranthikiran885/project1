"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Send, MessageCircle, Loader } from "lucide-react"

const suggestedQueries = [
  "Show top 5 delayed routes",
  "What is this week revenue?",
  "Alert me of high-speed drivers",
  "Generate weekly report",
]

const sampleResponses = {
  "show top 5 delayed routes": {
    title: "Top 5 Delayed Routes",
    data: [
      { route: "Route B2", delays: "24 mins", incidents: 3 },
      { route: "Route A1", delays: "18 mins", incidents: 2 },
      { route: "Route C3", delays: "15 mins", incidents: 1 },
    ],
  },
  "what is this week revenue?": {
    title: "Weekly Revenue Summary",
    data: "Total Revenue: $12,450 | Average per trip: $4.35 | Peak hour: 8:00-9:00 AM",
  },
}

export default function AIChatAssistant() {
  const [messages, setMessages] = useState([
    {
      type: "bot",
      text: "Hello! I'm your AI Transport Assistant. Ask me about routes, revenue, safety, or any analytics!",
    },
  ])
  const [input, setInput] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const handleSendMessage = (text) => {
    const queryText = text || input
    if (!queryText.trim()) return

    setMessages([...messages, { type: "user", text: queryText }])
    setInput("")
    setIsLoading(true)

    setTimeout(() => {
      const response = sampleResponses[queryText.toLowerCase()] || {
        title: "Analysis Result",
        data: `Processing: ${queryText}`,
      }
      setMessages((prev) => [
        ...prev,
        {
          type: "bot",
          text: response.title,
          data: response.data,
        },
      ])
      setIsLoading(false)
    }, 1500)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-card border border-border rounded-2xl p-6 h-full max-h-96 flex flex-col"
    >
      <h3 className="text-lg font-bold text-foreground mb-4 flex items-center gap-2">
        <MessageCircle className="w-5 h-5 text-accent" />
        AI Chat Assistant
      </h3>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto mb-4 space-y-4 bg-background/30 rounded-lg p-4">
        <AnimatePresence>
          {messages.map((msg, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.type === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-xs px-4 py-2 rounded-lg ${
                  msg.type === "user" ? "bg-primary text-primary-foreground" : "bg-sidebar text-foreground"
                }`}
              >
                <p className="text-sm">{msg.text}</p>
                {msg.data && <p className="text-xs mt-2 opacity-80">{msg.data}</p>}
              </div>
            </motion.div>
          ))}
          {isLoading && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 justify-start">
              <Loader className="w-4 h-4 text-accent animate-spin" />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Suggested Queries */}
      {messages.length <= 1 && (
        <div className="mb-4 space-y-2">
          {suggestedQueries.map((query, idx) => (
            <motion.button
              key={idx}
              whileHover={{ scale: 1.02 }}
              onClick={() => handleSendMessage(query)}
              className="w-full text-left text-xs px-3 py-2 bg-sidebar hover:bg-sidebar/80 rounded-lg text-muted-foreground transition-all"
            >
              • {query}
            </motion.button>
          ))}
        </div>
      )}

      {/* Input */}
      <div className="flex gap-2">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
          placeholder="Ask me anything..."
          className="flex-1 px-3 py-2 bg-background border border-border rounded-lg text-sm text-foreground placeholder-muted-foreground focus:outline-none focus:ring-2 focus:ring-accent"
        />
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => handleSendMessage()}
          disabled={isLoading}
          className="px-3 py-2 bg-accent text-accent-foreground rounded-lg hover:bg-accent/90 disabled:opacity-50"
        >
          <Send className="w-4 h-4" />
        </motion.button>
      </div>
    </motion.div>
  )
}
