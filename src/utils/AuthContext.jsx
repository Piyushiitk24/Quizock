import React, { createContext, useContext, useState, useEffect } from 'react'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)

  // Check authentication status on mount
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const response = await fetch('/api/auth/status', {
        credentials: 'include'
      })
      
      if (response.ok) {
        const data = await response.json()
        if (data.success && data.user) {
          setUser(data.user)
        }
        if (data.isAdmin) {
          setIsAdmin(true)
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error)
    } finally {
      setLoading(false)
    }
  }

  const login = async (username, fullName) => {
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ username, fullName })
      })

      const data = await response.json()
      
      if (data.success) {
        setUser(data.user)
        return { success: true, user: data.user }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('Login failed:', error)
      return { success: false, message: 'Network error occurred' }
    }
  }

  const adminLogin = async (password) => {
    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify({ password })
      })

      const data = await response.json()
      
      if (data.success) {
        setIsAdmin(true)
        return { success: true }
      } else {
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('Admin login failed:', error)
      return { success: false, message: 'Network error occurred' }
    }
  }

  const logout = async () => {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Logout failed:', error)
    } finally {
      setUser(null)
      setIsAdmin(false)
    }
  }

  const adminLogout = async () => {
    try {
      await fetch('/api/admin/logout', {
        method: 'POST',
        credentials: 'include'
      })
    } catch (error) {
      console.error('Admin logout failed:', error)
    } finally {
      setIsAdmin(false)
    }
  }

  const recordQuizAttempt = async (quizData) => {
    try {
      const response = await fetch('/api/auth/record-quiz', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(quizData)
      })

      const data = await response.json()
      
      if (data.success && data.updatedUser) {
        setUser(data.updatedUser)
        return { success: true }
      }
      
      return { success: false, message: data.message }
    } catch (error) {
      console.error('Failed to record quiz attempt:', error)
      return { success: false, message: 'Network error occurred' }
    }
  }

  const value = {
    user,
    isAdmin,
    loading,
    login,
    adminLogin,
    logout,
    adminLogout,
    recordQuizAttempt,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
