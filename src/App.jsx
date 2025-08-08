import React, { useState, useEffect } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/Navbar'
import Home from './pages/Home'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Quiz from './pages/Quiz'
import AdminPanel from './pages/AdminPanel'
import { AuthProvider, useAuth } from './utils/AuthContext'

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-charcoal flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }
  
  return user ? children : <Navigate to="/login" replace />
}

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { isAdmin, loading } = useAuth()
  
  if (loading) {
    return (
      <div className="min-h-screen bg-dark-charcoal flex items-center justify-center">
        <div className="spinner"></div>
      </div>
    )
  }
  
  return isAdmin ? children : <Navigate to="/dashboard" replace />
}

function App() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate app initialization
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1000)

    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className="min-h-screen bg-dark-charcoal flex items-center justify-center">
        <div className="text-center">
          <div className="heading-primary animate-pulse mb-4">QUIZOCK</div>
          <div className="spinner mx-auto"></div>
          <p className="text-muted mt-4">Loading Mathematics Quiz Platform...</p>
        </div>
      </div>
    )
  }

  return (
    <AuthProvider>
      <div className="min-h-screen bg-dark-charcoal">
        <Navbar />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/quiz/:module?" 
              element={
                <ProtectedRoute>
                  <Quiz />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/admin" 
              element={
                <AdminRoute>
                  <AdminPanel />
                </AdminRoute>
              } 
            />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </AuthProvider>
  )
}

export default App
