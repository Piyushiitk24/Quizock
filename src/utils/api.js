// API utility functions for making requests to the backend

const API_BASE = '/api'

// Helper function to handle API responses
const handleResponse = async (response) => {
  try {
    const data = await response.json()
    return data
  } catch (error) {
    return {
      success: false,
      message: 'Invalid response from server'
    }
  }
}

// Helper function to make API requests
const makeRequest = async (endpoint, options = {}) => {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`, {
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json',
        ...options.headers
      },
      ...options
    })

    return await handleResponse(response)
  } catch (error) {
    console.error('API Request failed:', error)
    return {
      success: false,
      message: 'Network error occurred'
    }
  }
}

// Auth API functions
export const authAPI = {
  login: (username, fullName) => 
    makeRequest('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, fullName })
    }),

  logout: () =>
    makeRequest('/auth/logout', { method: 'POST' }),

  getStatus: () =>
    makeRequest('/auth/status'),

  getDashboard: () =>
    makeRequest('/auth/dashboard'),

  getLeaderboard: () =>
    makeRequest('/auth/leaderboard'),

  recordQuiz: (quizData) =>
    makeRequest('/auth/record-quiz', {
      method: 'POST',
      body: JSON.stringify(quizData)
    })
}

// Quiz API functions
export const quizAPI = {
  getModules: () =>
    makeRequest('/quiz/modules'),

  getQuestions: (module, difficulty, limit) => {
    const params = new URLSearchParams()
    if (module) params.append('module', module)
    if (difficulty) params.append('difficulty', difficulty)
    if (limit) params.append('limit', limit)
    
    return makeRequest(`/quiz/questions?${params.toString()}`)
  },

  getMockTest: (difficulty) => {
    const params = new URLSearchParams()
    if (difficulty) params.append('difficulty', difficulty)
    
    return makeRequest(`/quiz/mock-test?${params.toString()}`)
  },

  submitMockTest: (answers, timeSpent) =>
    makeRequest('/quiz/submit-mock-test', {
      method: 'POST',
      body: JSON.stringify({ answers, timeSpent })
    }),

  getPerformance: (module) => {
    const params = new URLSearchParams()
    if (module) params.append('module', module)
    
    return makeRequest(`/quiz/performance?${params.toString()}`)
  }
}

// Admin API functions
export const adminAPI = {
  login: (password) =>
    makeRequest('/admin/login', {
      method: 'POST',
      body: JSON.stringify({ password })
    }),

  logout: () =>
    makeRequest('/admin/logout', { method: 'POST' }),

  getStats: () =>
    makeRequest('/admin/stats'),

  getQuestions: (page, limit, module, difficulty) => {
    const params = new URLSearchParams()
    if (page) params.append('page', page)
    if (limit) params.append('limit', limit)
    if (module) params.append('module', module)
    if (difficulty) params.append('difficulty', difficulty)
    
    return makeRequest(`/admin/questions?${params.toString()}`)
  },

  addQuestion: (questionData) =>
    makeRequest('/admin/questions', {
      method: 'POST',
      body: JSON.stringify(questionData)
    }),

  updateQuestion: (id, questionData) =>
    makeRequest(`/admin/questions/${id}`, {
      method: 'PUT',
      body: JSON.stringify(questionData)
    }),

  deleteQuestion: (id) =>
    makeRequest(`/admin/questions/${id}`, { method: 'DELETE' }),

  uploadCSV: (file) => {
    const formData = new FormData()
    formData.append('csvFile', file)
    
    return makeRequest('/admin/upload-csv', {
      method: 'POST',
      body: formData,
      headers: {} // Let browser set content-type for FormData
    })
  },

  getUsers: (page, limit) => {
    const params = new URLSearchParams()
    if (page) params.append('page', page)
    if (limit) params.append('limit', limit)
    
    return makeRequest(`/admin/users?${params.toString()}`)
  }
}

// Utility functions
export const formatError = (error) => {
  if (typeof error === 'string') {
    return error
  }
  
  if (error?.message) {
    return error.message
  }
  
  return 'An unexpected error occurred'
}

export const formatTimeSpent = (seconds) => {
  if (seconds < 60) {
    return `${seconds}s`
  }
  
  const minutes = Math.floor(seconds / 60)
  const remainingSeconds = seconds % 60
  
  if (minutes < 60) {
    return remainingSeconds > 0 
      ? `${minutes}m ${remainingSeconds}s`
      : `${minutes}m`
  }
  
  const hours = Math.floor(minutes / 60)
  const remainingMinutes = minutes % 60
  
  return `${hours}h ${remainingMinutes}m`
}

export const formatAccuracy = (accuracy) => {
  return `${Math.round(accuracy)}%`
}

export const formatDate = (dateString) => {
  try {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  } catch (error) {
    return 'Invalid date'
  }
}

export const validateQuestionData = (data) => {
  const errors = []
  
  if (!data.module?.trim()) {
    errors.push('Module is required')
  }
  
  if (!data.question?.trim()) {
    errors.push('Question is required')
  }
  
  if (!data.correctAnswer?.trim()) {
    errors.push('Correct answer is required')
  }
  
  if (data.type === 'MCQ') {
    const options = data.options || {}
    if (!options.A?.trim() || !options.B?.trim() || !options.C?.trim() || !options.D?.trim()) {
      errors.push('All four options are required for MCQ questions')
    }
  }
  
  if (data.marks && (isNaN(data.marks) || data.marks < 1)) {
    errors.push('Marks must be a positive number')
  }
  
  if (data.timeLimit && (isNaN(data.timeLimit) || data.timeLimit < 1)) {
    errors.push('Time limit must be a positive number')
  }
  
  return errors
}

export default {
  authAPI,
  quizAPI,
  adminAPI,
  formatError,
  formatTimeSpent,
  formatAccuracy,
  formatDate,
  validateQuestionData
}
