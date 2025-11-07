"use client"

import { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    // Try to restore session from localStorage
    try {
      const savedUser = localStorage.getItem('user')
      if (savedUser) {
        setUser(JSON.parse(savedUser))
      }
    } catch (err) {
      console.error('Failed to restore user session:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const baseUrl = (process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000').replace(/\/$/, '')
      const response = await fetch(`${baseUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      })
      
      if (!response.ok) throw new Error('Login failed')
      
      const data = await response.json()
      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
      return data
    } catch (err) {
      setError(err.message)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
  }

  return (
    <AuthContext.Provider value={{ user, loading, error, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
