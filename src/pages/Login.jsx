import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'

const Login = () => {
  const [formData, setFormData] = useState({
    username: '',
    fullName: '',
    isAdmin: false,
    adminPassword: ''
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  
  const { login, adminLogin, user } = useAuth()
  const navigate = useNavigate()

  // Redirect if already logged in
  React.useEffect(() => {
    if (user) {
      navigate('/dashboard')
    }
  }, [user, navigate])

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }))
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      if (formData.isAdmin) {
        // Admin login
        if (!formData.adminPassword.trim()) {
          setError('Admin password is required')
          setLoading(false)
          return
        }

        const result = await adminLogin(formData.adminPassword)
        if (result.success) {
          navigate('/admin')
        } else {
          setError(result.message || 'Invalid admin credentials')
        }
      } else {
        // Student login
        if (!formData.username.trim() || !formData.fullName.trim()) {
          setError('Both username and full name are required')
          setLoading(false)
          return
        }

        const result = await login(formData.username.trim(), formData.fullName.trim())
        if (result.success) {
          navigate('/dashboard')
        } else {
          setError(result.message || 'Login failed')
        }
      }
    } catch (error) {
      setError('Network error occurred. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-dark-charcoal flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <Link to="/" className="inline-flex items-center space-x-2 mb-8">
            <div className="w-12 h-12 bg-gradient-primary rounded-lg flex items-center justify-center">
              <span className="text-dark-charcoal font-bold text-2xl">Q</span>
            </div>
            <span className="text-2xl font-bold text-gradient font-orbitron">QUIZOCK</span>
          </Link>
          
          <h2 className="heading-secondary text-center">
            {formData.isAdmin ? 'Admin Access' : 'Welcome Back'}
          </h2>
          <p className="text-text-muted">
            {formData.isAdmin 
              ? 'Enter admin credentials to access the control panel'
              : 'Enter your details to access your learning dashboard'
            }
          </p>
        </div>

        {/* Login Form */}
        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Admin Toggle */}
            <div className="flex items-center justify-center">
              <label className="flex items-center space-x-3 cursor-pointer">
                <input
                  type="checkbox"
                  name="isAdmin"
                  checked={formData.isAdmin}
                  onChange={handleInputChange}
                  className="w-4 h-4 text-primary-green bg-medium-charcoal border-border-color rounded focus:ring-primary-green focus:ring-2"
                />
                <span className="text-sm text-text-muted">
                  Admin Login
                </span>
              </label>
            </div>

            {formData.isAdmin ? (
              /* Admin Login Fields */
              <div>
                <label htmlFor="adminPassword" className="block text-sm font-medium text-text-light mb-2">
                  Admin Password
                </label>
                <input
                  id="adminPassword"
                  name="adminPassword"
                  type="password"
                  autoComplete="current-password"
                  required
                  value={formData.adminPassword}
                  onChange={handleInputChange}
                  className="input"
                  placeholder="Enter admin password"
                />
              </div>
            ) : (
              /* Student Login Fields */
              <>
                <div>
                  <label htmlFor="username" className="block text-sm font-medium text-text-light mb-2">
                    Username
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    autoComplete="username"
                    required
                    value={formData.username}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Enter your username"
                  />
                </div>

                <div>
                  <label htmlFor="fullName" className="block text-sm font-medium text-text-light mb-2">
                    Full Name
                  </label>
                  <input
                    id="fullName"
                    name="fullName"
                    type="text"
                    autoComplete="name"
                    required
                    value={formData.fullName}
                    onChange={handleInputChange}
                    className="input"
                    placeholder="Enter your full name"
                  />
                </div>
              </>
            )}

            {/* Error Message */}
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading}
              className={`w-full btn ${formData.isAdmin ? 'btn-secondary' : 'btn-primary'} 
                ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="spinner"></div>
                  <span>Logging in...</span>
                </div>
              ) : (
                formData.isAdmin ? 'Access Admin Panel' : 'Enter Platform'
              )}
            </button>
          </form>
        </div>

        {/* Additional Information */}
        <div className="text-center space-y-4">
          {!formData.isAdmin && (
            <div className="text-sm text-text-muted">
              <p>New to Quizock? Just enter your details above to get started!</p>
              <p className="mt-2">
                Your account will be created automatically and your progress will be saved.
              </p>
            </div>
          )}
          
          <div className="flex items-center justify-center space-x-6 text-sm">
            <Link 
              to="/" 
              className="text-primary-green hover:text-green-400 transition-colors"
            >
              ← Back to Home
            </Link>
            {!formData.isAdmin && (
              <a 
                href="#help" 
                className="text-accent-orange hover:text-orange-400 transition-colors"
              >
                Need Help?
              </a>
            )}
          </div>
        </div>

        {/* Features Preview */}
        {!formData.isAdmin && (
          <div className="mt-8 p-6 bg-medium-charcoal/50 rounded-lg border border-border-color">
            <h3 className="text-lg font-semibold text-primary-green mb-3">What you'll get:</h3>
            <ul className="space-y-2 text-sm text-text-muted">
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-primary-green rounded-full"></span>
                <span>Personalized progress tracking</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-accent-orange rounded-full"></span>
                <span>Access to 1000+ practice questions</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-primary-green rounded-full"></span>
                <span>Comprehensive mock tests</span>
              </li>
              <li className="flex items-center space-x-2">
                <span className="w-2 h-2 bg-accent-orange rounded-full"></span>
                <span>Detailed performance analytics</span>
              </li>
            </ul>
          </div>
        )}
      </div>
    </div>
  )
}

export default Login
