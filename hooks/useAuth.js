"use client"

import { createContext, useContext, useEffect, useState } from 'react'
import { authService } from '@/lib/auth-service'

const AuthContext = createContext()

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const checkAuth = async () => {
      try {
        const authData = authService.getAuthData()
        if (authData.token && authData.user) {
          setUser(authData.user)
          setIsAuthenticated(true)
        }
      } catch (error) {
        console.error('Auth check failed:', error)
      } finally {
        setLoading(false)
      }
    }

    checkAuth()
  }, [])

  const login = async (credentials) => {
    try {
      const result = await authService.login(credentials)
      if (result.success) {
        setUser(result.data.user)
        setIsAuthenticated(true)
        return { success: true, user: result.data.user }
      }
      return { success: false, error: result.error }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const register = async (userData) => {
    try {
      const result = await authService.register(userData)
      if (result.success) {
        setUser(result.data.user)
        setIsAuthenticated(true)
        return { success: true, user: result.data.user }
      }
      return { success: false, error: result.error }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const logout = () => {
    authService.logout()
    setUser(null)
    setIsAuthenticated(false)
  }

  const updateProfile = async (profileData) => {
    try {
      const result = await authService.updateProfile(profileData)
      if (result.success) {
        setUser(result.data.user)
        return { success: true, user: result.data.user }
      }
      return { success: false, error: result.error }
    } catch (error) {
      return { success: false, error: error.message }
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    register,
    logout,
    updateProfile,
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}