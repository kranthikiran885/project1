"use client"

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { authApi, buildApiUrl } from '@/lib/api-helpers'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const router = useRouter()

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

  /**
   * Get dashboard route based on user role
   */
  const getDashboardRoute = (userRole) => {
    const routes = {
      student: '/dashboard/student',
      parent: '/dashboard/parent',
      driver: '/dashboard/driver',
      admin: '/dashboard/admin',
    }
    return routes[userRole] || '/dashboard'
  }

  const login = async (email, password) => {
    setLoading(true)
    setError(null)
    try {
      const data = await authApi.login(email, password)
      setUser(data.user)
      localStorage.setItem('user', JSON.stringify(data.user))
      localStorage.setItem('token', data.token)
      
      // Redirect to dashboard based on role
      const dashboardRoute = getDashboardRoute(data.user.role)
      router.push(dashboardRoute)
      
      return data
    } catch (err) {
      const errorMsg = err.message || 'Login failed'
      setError(errorMsg)
      throw err
    } finally {
      setLoading(false)
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem('user')
    localStorage.removeItem('token')
    router.push('/auth')
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
