import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'

const Navbar = () => {
  const { user, isAdmin, logout, adminLogout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const handleLogout = async () => {
    if (isAdmin) {
      await adminLogout()
    }
    if (user) {
      await logout()
    }
    navigate('/')
    setIsMenuOpen(false)
  }

  const isActive = (path) => {
    return location.pathname === path
  }

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen)
  }

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-medium-charcoal/90 backdrop-blur-md border-b border-border-color">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-2 hover:opacity-80 transition-opacity"
          >
            <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-dark-charcoal font-bold text-lg">Q</span>
            </div>
            <span className="text-xl font-bold text-gradient font-orbitron">
              QUIZOCK
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link
              to="/"
              className={`nav-link ${isActive('/') ? 'text-primary-green' : 'text-text-light'} 
                hover:text-primary-green transition-colors`}
            >
              Home
            </Link>

            {user && (
              <>
                <Link
                  to="/dashboard"
                  className={`nav-link ${isActive('/dashboard') ? 'text-primary-green' : 'text-text-light'} 
                    hover:text-primary-green transition-colors`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/quiz"
                  className={`nav-link ${location.pathname.startsWith('/quiz') ? 'text-primary-green' : 'text-text-light'} 
                    hover:text-primary-green transition-colors`}
                >
                  Quiz
                </Link>
              </>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                className={`nav-link ${isActive('/admin') ? 'text-accent-orange' : 'text-text-light'} 
                  hover:text-accent-orange transition-colors`}
              >
                Admin Panel
              </Link>
            )}

            {/* User Actions */}
            <div className="flex items-center space-x-4">
              {user ? (
                <div className="flex items-center space-x-4">
                  <div className="text-sm text-text-muted">
                    Welcome, <span className="text-primary-green font-semibold">{user.fullName}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="btn btn-outline text-sm px-4 py-2"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="btn btn-primary text-sm px-4 py-2"
                >
                  Login
                </Link>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-text-light hover:text-primary-green focus:outline-none"
            >
              <svg
                className={`w-6 h-6 transition-transform ${isMenuOpen ? 'rotate-90' : ''}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                {isMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-medium-charcoal/95 backdrop-blur-md border-t border-border-color">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <Link
              to="/"
              onClick={() => setIsMenuOpen(false)}
              className={`block px-3 py-2 rounded-md text-base font-medium transition-colors
                ${isActive('/') ? 'text-primary-green bg-light-charcoal' : 'text-text-light hover:text-primary-green hover:bg-light-charcoal'}`}
            >
              Home
            </Link>

            {user && (
              <>
                <Link
                  to="/dashboard"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors
                    ${isActive('/dashboard') ? 'text-primary-green bg-light-charcoal' : 'text-text-light hover:text-primary-green hover:bg-light-charcoal'}`}
                >
                  Dashboard
                </Link>
                <Link
                  to="/quiz"
                  onClick={() => setIsMenuOpen(false)}
                  className={`block px-3 py-2 rounded-md text-base font-medium transition-colors
                    ${location.pathname.startsWith('/quiz') ? 'text-primary-green bg-light-charcoal' : 'text-text-light hover:text-primary-green hover:bg-light-charcoal'}`}
                >
                  Quiz
                </Link>
              </>
            )}

            {isAdmin && (
              <Link
                to="/admin"
                onClick={() => setIsMenuOpen(false)}
                className={`block px-3 py-2 rounded-md text-base font-medium transition-colors
                  ${isActive('/admin') ? 'text-accent-orange bg-light-charcoal' : 'text-text-light hover:text-accent-orange hover:bg-light-charcoal'}`}
              >
                Admin Panel
              </Link>
            )}

            {/* Mobile User Actions */}
            <div className="border-t border-border-color pt-4 mt-4">
              {user ? (
                <div className="px-3">
                  <div className="text-sm text-text-muted mb-3">
                    Welcome, <span className="text-primary-green font-semibold">{user.fullName}</span>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="w-full btn btn-outline text-sm"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="px-3">
                  <Link
                    to="/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="w-full btn btn-primary text-sm block text-center"
                  >
                    Login
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  )
}

export default Navbar
