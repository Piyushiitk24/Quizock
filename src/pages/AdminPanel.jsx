import React, { useState, useEffect } from 'react'
import { InlineMath, BlockMath } from 'react-katex'
import { useAuth } from '../utils/AuthContext'
import { adminAPI, formatDate, validateQuestionData, formatError } from '../utils/api'

const AdminPanel = () => {
  const { adminLogout } = useAuth()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState(null)
  const [questions, setQuestions] = useState([])
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')

  // Question management states
  const [questionForm, setQuestionForm] = useState({
    module: '',
    chapter: '',
    difficulty: 'Medium',
    type: 'MCQ',
    question: '',
    options: { A: '', B: '', C: '', D: '' },
    correctAnswer: '',
    explanation: '',
    marks: 1,
    timeLimit: 120,
    tags: []
  })
  const [editingQuestion, setEditingQuestion] = useState(null)
  const [questionFilters, setQuestionFilters] = useState({
    module: 'all',
    difficulty: 'all',
    page: 1,
    limit: 20
  })

  // CSV upload states
  const [csvFile, setCsvFile] = useState(null)
  const [uploadProgress, setUploadProgress] = useState(null)

  useEffect(() => {
    if (activeTab === 'dashboard') {
      loadStats()
    } else if (activeTab === 'questions') {
      loadQuestions()
    } else if (activeTab === 'users') {
      loadUsers()
    }
  }, [activeTab, questionFilters])

  const loadStats = async () => {
    setLoading(true)
    try {
      const response = await adminAPI.getStats()
      if (response.success) {
        setStats(response.data)
      } else {
        setError(response.message)
      }
    } catch (error) {
      setError('Failed to load statistics')
    } finally {
      setLoading(false)
    }
  }

  const loadQuestions = async () => {
    setLoading(true)
    try {
      const response = await adminAPI.getQuestions(
        questionFilters.page,
        questionFilters.limit,
        questionFilters.module,
        questionFilters.difficulty
      )
      if (response.success) {
        setQuestions(response.data.questions)
      } else {
        setError(response.message)
      }
    } catch (error) {
      setError('Failed to load questions')
    } finally {
      setLoading(false)
    }
  }

  const loadUsers = async () => {
    setLoading(true)
    try {
      const response = await adminAPI.getUsers(1, 50)
      if (response.success) {
        setUsers(response.data.users)
      } else {
        setError(response.message)
      }
    } catch (error) {
      setError('Failed to load users')
    } finally {
      setLoading(false)
    }
  }

  const handleQuestionSubmit = async (e) => {
    e.preventDefault()
    
    const errors = validateQuestionData(questionForm)
    if (errors.length > 0) {
      setError(errors.join(', '))
      return
    }

    setLoading(true)
    try {
      const response = editingQuestion
        ? await adminAPI.updateQuestion(editingQuestion._id, questionForm)
        : await adminAPI.addQuestion(questionForm)

      if (response.success) {
        setSuccess(editingQuestion ? 'Question updated successfully' : 'Question added successfully')
        resetQuestionForm()
        loadQuestions()
      } else {
        setError(response.message)
      }
    } catch (error) {
      setError('Failed to save question')
    } finally {
      setLoading(false)
    }
  }

  const handleDeleteQuestion = async (questionId) => {
    if (!confirm('Are you sure you want to delete this question?')) return

    setLoading(true)
    try {
      const response = await adminAPI.deleteQuestion(questionId)
      if (response.success) {
        setSuccess('Question deleted successfully')
        loadQuestions()
      } else {
        setError(response.message)
      }
    } catch (error) {
      setError('Failed to delete question')
    } finally {
      setLoading(false)
    }
  }

  const handleEditQuestion = (question) => {
    setQuestionForm({
      module: question.module,
      chapter: question.chapter,
      difficulty: question.difficulty,
      type: question.type,
      question: question.question,
      options: question.options || { A: '', B: '', C: '', D: '' },
      correctAnswer: question.correctAnswer,
      explanation: question.explanation,
      marks: question.marks,
      timeLimit: question.timeLimit,
      tags: question.tags || []
    })
    setEditingQuestion(question)
    setActiveTab('add-question')
  }

  const resetQuestionForm = () => {
    setQuestionForm({
      module: '',
      chapter: '',
      difficulty: 'Medium',
      type: 'MCQ',
      question: '',
      options: { A: '', B: '', C: '', D: '' },
      correctAnswer: '',
      explanation: '',
      marks: 1,
      timeLimit: 120,
      tags: []
    })
    setEditingQuestion(null)
  }

  const handleCsvUpload = async (e) => {
    e.preventDefault()
    if (!csvFile) {
      setError('Please select a CSV file')
      return
    }

    setLoading(true)
    setUploadProgress({ status: 'uploading', message: 'Uploading CSV file...' })
    
    try {
      const response = await adminAPI.uploadCSV(csvFile)
      if (response.success) {
        setUploadProgress({
          status: 'success',
          message: `Upload completed! ${response.data.successfulImports} questions imported successfully.`,
          details: response.data
        })
        setCsvFile(null)
        if (activeTab === 'questions') {
          loadQuestions()
        }
      } else {
        setUploadProgress({
          status: 'error',
          message: response.message,
          details: response.data
        })
      }
    } catch (error) {
      setUploadProgress({
        status: 'error',
        message: 'Failed to upload CSV file'
      })
    } finally {
      setLoading(false)
    }
  }

  const renderMathContent = (text) => {
    if (!text) return ''
    
    const blockMathRegex = /\$\$(.*?)\$\$/g
    let parts = text.split(blockMathRegex)
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return <BlockMath key={index} math={part} />
      } else {
        const inlineMathRegex = /\$(.*?)\$/g
        const inlineParts = part.split(inlineMathRegex)
        
        return inlineParts.map((inlinePart, inlineIndex) => {
          if (inlineIndex % 2 === 1) {
            return <InlineMath key={`${index}-${inlineIndex}`} math={inlinePart} />
          } else {
            return inlinePart
          }
        })
      }
    })
  }

  const clearMessages = () => {
    setError('')
    setSuccess('')
  }

  return (
    <div className="min-h-screen bg-dark-charcoal">
      {/* Header */}
      <div className="bg-medium-charcoal border-b border-border-color">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <h1 className="heading-secondary text-accent-orange">🛠️ Admin Panel</h1>
            <button
              onClick={adminLogout}
              className="btn btn-outline text-sm"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Messages */}
        {(error || success) && (
          <div className="mb-6">
            {error && (
              <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
                <span>{error}</span>
                <button onClick={clearMessages} className="text-red-400 hover:text-red-200">✕</button>
              </div>
            )}
            {success && (
              <div className="bg-green-900/50 border border-green-700 text-green-200 px-4 py-3 rounded-lg mb-4 flex items-center justify-between">
                <span>{success}</span>
                <button onClick={clearMessages} className="text-green-400 hover:text-green-200">✕</button>
              </div>
            )}
          </div>
        )}

        {/* Navigation Tabs */}
        <div className="flex flex-wrap gap-2 mb-8">
          {[
            { id: 'dashboard', label: '📊 Dashboard', icon: '📊' },
            { id: 'questions', label: '❓ Questions', icon: '❓' },
            { id: 'add-question', label: '➕ Add Question', icon: '➕' },
            { id: 'upload-csv', label: '📄 Upload CSV', icon: '📄' },
            { id: 'users', label: '👥 Users', icon: '👥' }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`btn ${activeTab === tab.id ? 'btn-secondary' : 'btn-ghost'}`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        {activeTab === 'dashboard' && (
          <div className="space-y-8">
            {loading ? (
              <div className="text-center py-8">
                <div className="spinner mx-auto mb-4"></div>
                <p className="text-text-muted">Loading statistics...</p>
              </div>
            ) : stats ? (
              <>
                {/* Overview Stats */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="card text-center">
                    <div className="text-3xl font-bold text-primary-green mb-2">
                      {stats.overview.totalQuestions}
                    </div>
                    <div className="text-text-muted">Total Questions</div>
                  </div>
                  <div className="card text-center">
                    <div className="text-3xl font-bold text-accent-orange mb-2">
                      {stats.overview.totalUsers}
                    </div>
                    <div className="text-text-muted">Registered Users</div>
                  </div>
                  <div className="card text-center">
                    <div className="text-3xl font-bold text-primary-green mb-2">
                      {stats.overview.totalModules}
                    </div>
                    <div className="text-text-muted">Active Modules</div>
                  </div>
                </div>

                {/* Module Statistics */}
                <div className="card">
                  <h2 className="heading-tertiary mb-6">📚 Module Statistics</h2>
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-border-color">
                          <th className="text-left py-3 px-4 text-text-light">Module</th>
                          <th className="text-center py-3 px-4 text-text-light">Total</th>
                          <th className="text-center py-3 px-4 text-green-400">Easy</th>
                          <th className="text-center py-3 px-4 text-yellow-400">Medium</th>
                          <th className="text-center py-3 px-4 text-red-400">Hard</th>
                        </tr>
                      </thead>
                      <tbody>
                        {stats.moduleStats.map((module, index) => (
                          <tr key={index} className="border-b border-border-color/50">
                            <td className="py-3 px-4 text-text-light font-semibold">{module.module}</td>
                            <td className="py-3 px-4 text-center text-text-muted">{module.totalQuestions}</td>
                            <td className="py-3 px-4 text-center text-green-400">{module.easy}</td>
                            <td className="py-3 px-4 text-center text-yellow-400">{module.medium}</td>
                            <td className="py-3 px-4 text-center text-red-400">{module.hard}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>

                {/* Recent Activity */}
                <div className="grid lg:grid-cols-2 gap-8">
                  <div className="card">
                    <h2 className="heading-tertiary mb-4">👥 Recent Users</h2>
                    <div className="space-y-3">
                      {stats.recentActivity.users.map((user, index) => (
                        <div key={index} className="flex items-center justify-between p-3 bg-medium-charcoal rounded-lg">
                          <div>
                            <div className="font-semibold text-text-light">{user.fullName}</div>
                            <div className="text-sm text-text-muted">@{user.username}</div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm text-primary-green">{user.progress.totalQuizzesTaken} quizzes</div>
                            <div className="text-xs text-text-muted">
                              {user.progress.lastActivity ? formatDate(user.progress.lastActivity) : 'No activity'}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="card">
                    <h2 className="heading-tertiary mb-4">❓ Recent Questions</h2>
                    <div className="space-y-3">
                      {stats.recentActivity.questions.map((question, index) => (
                        <div key={index} className="p-3 bg-medium-charcoal rounded-lg">
                          <div className="font-semibold text-text-light text-sm mb-1">
                            {question.module} - {question.chapter}
                          </div>
                          <div className="text-text-muted text-sm line-clamp-2">
                            {question.question.substring(0, 100)}...
                          </div>
                          <div className="text-xs text-text-muted mt-2">
                            {formatDate(question.createdAt)}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <div className="text-center py-8 text-text-muted">
                No statistics available
              </div>
            )}
          </div>
        )}

        {activeTab === 'questions' && (
          <div className="space-y-6">
            {/* Filters */}
            <div className="card">
              <div className="flex flex-wrap gap-4 items-center">
                <select
                  value={questionFilters.module}
                  onChange={(e) => setQuestionFilters(prev => ({ ...prev, module: e.target.value, page: 1 }))}
                  className="input"
                >
                  <option value="all">All Modules</option>
                  <option value="Trigonometry">Trigonometry</option>
                  <option value="Calculus">Calculus</option>
                  <option value="Algebra">Algebra</option>
                  <option value="Geometry">Geometry</option>
                </select>

                <select
                  value={questionFilters.difficulty}
                  onChange={(e) => setQuestionFilters(prev => ({ ...prev, difficulty: e.target.value, page: 1 }))}
                  className="input"
                >
                  <option value="all">All Difficulties</option>
                  <option value="Easy">Easy</option>
                  <option value="Medium">Medium</option>
                  <option value="Hard">Hard</option>
                </select>

                <button
                  onClick={loadQuestions}
                  className="btn btn-primary"
                >
                  🔄 Refresh
                </button>
              </div>
            </div>

            {/* Questions List */}
            {loading ? (
              <div className="text-center py-8">
                <div className="spinner mx-auto mb-4"></div>
                <p className="text-text-muted">Loading questions...</p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question) => (
                  <div key={question._id} className="card">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-2">
                          <span className="px-2 py-1 bg-primary-green text-dark-charcoal rounded text-xs font-semibold">
                            {question.module}
                          </span>
                          <span className={`px-2 py-1 rounded text-xs font-semibold ${
                            question.difficulty === 'Easy' ? 'bg-green-900 text-green-200' :
                            question.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-200' :
                            'bg-red-900 text-red-200'
                          }`}>
                            {question.difficulty}
                          </span>
                          <span className="text-xs text-text-muted">
                            {question.marks} marks | {question.timeLimit}s
                          </span>
                        </div>
                        <div className="text-text-light mb-2">
                          {renderMathContent(question.question)}
                        </div>
                        {question.type === 'MCQ' && (
                          <div className="grid md:grid-cols-2 gap-2 text-sm">
                            {Object.entries(question.options).map(([key, value]) => (
                              <div key={key} className={`p-2 rounded ${
                                key === question.correctAnswer ? 'bg-green-900/20 text-green-200' : 'bg-medium-charcoal text-text-muted'
                              }`}>
                                <span className="font-semibold">{key})</span> {renderMathContent(value)}
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="flex space-x-2 ml-4">
                        <button
                          onClick={() => handleEditQuestion(question)}
                          className="btn btn-ghost text-sm px-3 py-1"
                        >
                          ✏️ Edit
                        </button>
                        <button
                          onClick={() => handleDeleteQuestion(question._id)}
                          className="btn btn-ghost text-sm px-3 py-1 text-red-400 hover:text-red-200"
                        >
                          🗑️ Delete
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'add-question' && (
          <div className="card max-w-4xl">
            <h2 className="heading-tertiary mb-6">
              {editingQuestion ? '✏️ Edit Question' : '➕ Add New Question'}
            </h2>
            
            <form onSubmit={handleQuestionSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">Module</label>
                  <select
                    value={questionForm.module}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, module: e.target.value }))}
                    className="input"
                    required
                  >
                    <option value="">Select Module</option>
                    <option value="Trigonometry">Trigonometry</option>
                    <option value="Calculus">Calculus</option>
                    <option value="Algebra">Algebra</option>
                    <option value="Geometry">Geometry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">Chapter</label>
                  <input
                    type="text"
                    value={questionForm.chapter}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, chapter: e.target.value }))}
                    className="input"
                    placeholder="e.g., Basic Identities"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">Difficulty</label>
                  <select
                    value={questionForm.difficulty}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, difficulty: e.target.value }))}
                    className="input"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">Question Type</label>
                  <select
                    value={questionForm.type}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, type: e.target.value }))}
                    className="input"
                  >
                    <option value="MCQ">Multiple Choice</option>
                    <option value="Short Answer">Short Answer</option>
                    <option value="Numerical">Numerical</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">Marks</label>
                  <input
                    type="number"
                    min="1"
                    max="10"
                    value={questionForm.marks}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, marks: parseInt(e.target.value) }))}
                    className="input"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">Time Limit (seconds)</label>
                  <input
                    type="number"
                    min="30"
                    max="600"
                    value={questionForm.timeLimit}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, timeLimit: parseInt(e.target.value) }))}
                    className="input"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-text-light mb-2">
                  Question (Use $ for inline math, $$ for block math)
                </label>
                <textarea
                  value={questionForm.question}
                  onChange={(e) => setQuestionForm(prev => ({ ...prev, question: e.target.value }))}
                  className="input min-h-[100px]"
                  placeholder="Enter the question text with LaTeX math notation..."
                  required
                />
                {questionForm.question && (
                  <div className="mt-2 p-3 bg-medium-charcoal rounded-lg">
                    <div className="text-sm text-text-muted mb-1">Preview:</div>
                    <div className="text-text-light">
                      {renderMathContent(questionForm.question)}
                    </div>
                  </div>
                )}
              </div>

              {questionForm.type === 'MCQ' && (
                <div>
                  <label className="block text-sm font-medium text-text-light mb-2">Options</label>
                  <div className="grid md:grid-cols-2 gap-4">
                    {['A', 'B', 'C', 'D'].map((option) => (
                      <div key={option}>
                        <label className="block text-sm text-text-muted mb-1">Option {option}</label>
                        <textarea
                          value={questionForm.options[option]}
                          onChange={(e) => setQuestionForm(prev => ({
                            ...prev,
                            options: { ...prev.options, [option]: e.target.value }
                          }))}
                          className="input min-h-[60px]"
                          placeholder={`Enter option ${option}...`}
                          required
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label className="block text-sm font-medium text-text-light mb-2">Correct Answer</label>
                {questionForm.type === 'MCQ' ? (
                  <select
                    value={questionForm.correctAnswer}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, correctAnswer: e.target.value }))}
                    className="input"
                    required
                  >
                    <option value="">Select correct option</option>
                    <option value="A">A</option>
                    <option value="B">B</option>
                    <option value="C">C</option>
                    <option value="D">D</option>
                  </select>
                ) : (
                  <input
                    type="text"
                    value={questionForm.correctAnswer}
                    onChange={(e) => setQuestionForm(prev => ({ ...prev, correctAnswer: e.target.value }))}
                    className="input"
                    placeholder="Enter the correct answer..."
                    required
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-text-light mb-2">Explanation (Optional)</label>
                <textarea
                  value={questionForm.explanation}
                  onChange={(e) => setQuestionForm(prev => ({ ...prev, explanation: e.target.value }))}
                  className="input min-h-[100px]"
                  placeholder="Provide a detailed explanation of the solution..."
                />
              </div>

              <div className="flex space-x-4">
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? 'Saving...' : editingQuestion ? 'Update Question' : 'Add Question'}
                </button>
                
                {editingQuestion && (
                  <button
                    type="button"
                    onClick={resetQuestionForm}
                    className="btn btn-ghost"
                  >
                    Cancel Edit
                  </button>
                )}
              </div>
            </form>
          </div>
        )}

        {activeTab === 'upload-csv' && (
          <div className="card max-w-2xl">
            <h2 className="heading-tertiary mb-6">📄 Upload Questions via CSV</h2>
            
            <div className="space-y-6">
              <div className="bg-light-charcoal p-4 rounded-lg">
                <h3 className="font-semibold text-primary-green mb-2">CSV Format Requirements:</h3>
                <ul className="text-sm text-text-muted space-y-1">
                  <li>• <strong>Required columns:</strong> module, question, correctAnswer</li>
                  <li>• <strong>Optional columns:</strong> chapter, difficulty, type, optionA, optionB, optionC, optionD, explanation, marks, timeLimit, tags</li>
                  <li>• Use LaTeX notation for mathematical expressions (e.g., $x^2$, $$\int x dx$$)</li>
                  <li>• For MCQ questions, include optionA, optionB, optionC, optionD columns</li>
                  <li>• Separate multiple tags with commas</li>
                </ul>
              </div>

              <form onSubmit={handleCsvUpload}>
                <div className="mb-4">
                  <label className="block text-sm font-medium text-text-light mb-2">
                    Select CSV File
                  </label>
                  <input
                    type="file"
                    accept=".csv"
                    onChange={(e) => setCsvFile(e.target.files[0])}
                    className="input"
                    required
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading || !csvFile}
                  className="btn btn-primary"
                >
                  {loading ? 'Uploading...' : 'Upload CSV'}
                </button>
              </form>

              {uploadProgress && (
                <div className="mt-6">
                  <div className={`p-4 rounded-lg ${
                    uploadProgress.status === 'success' ? 'bg-green-900/20 border border-green-700' :
                    uploadProgress.status === 'error' ? 'bg-red-900/20 border border-red-700' :
                    'bg-blue-900/20 border border-blue-700'
                  }`}>
                    <h4 className="font-semibold mb-2">Upload Results</h4>
                    <p className="text-sm">{uploadProgress.message}</p>
                    
                    {uploadProgress.details && (
                      <div className="mt-3 text-sm">
                        <div>Total rows processed: {uploadProgress.details.totalRows}</div>
                        <div>Successfully imported: {uploadProgress.details.successfulImports}</div>
                        <div>Errors: {uploadProgress.details.errors}</div>
                        
                        {uploadProgress.details.errorDetails && uploadProgress.details.errorDetails.length > 0 && (
                          <details className="mt-2">
                            <summary className="cursor-pointer text-red-400">View Error Details</summary>
                            <div className="mt-2 max-h-40 overflow-y-auto">
                              {uploadProgress.details.errorDetails.map((error, index) => (
                                <div key={index} className="text-xs text-red-300 py-1">
                                  {error}
                                </div>
                              ))}
                            </div>
                          </details>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'users' && (
          <div className="space-y-6">
            <div className="card">
              <h2 className="heading-tertiary mb-6">👥 Registered Users</h2>
              
              {loading ? (
                <div className="text-center py-8">
                  <div className="spinner mx-auto mb-4"></div>
                  <p className="text-text-muted">Loading users...</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-border-color">
                        <th className="text-left py-3 px-4 text-text-light">User</th>
                        <th className="text-center py-3 px-4 text-text-light">Quizzes</th>
                        <th className="text-center py-3 px-4 text-text-light">Accuracy</th>
                        <th className="text-center py-3 px-4 text-text-light">Streak</th>
                        <th className="text-center py-3 px-4 text-text-light">Last Activity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {users.map((user, index) => (
                        <tr key={index} className="border-b border-border-color/50">
                          <td className="py-3 px-4">
                            <div>
                              <div className="font-semibold text-text-light">{user.fullName}</div>
                              <div className="text-sm text-text-muted">@{user.username}</div>
                            </div>
                          </td>
                          <td className="py-3 px-4 text-center text-text-muted">
                            {user.progress?.totalQuizzesTaken || 0}
                          </td>
                          <td className="py-3 px-4 text-center">
                            <span className={`font-semibold ${
                              (user.progress?.averageAccuracy || 0) >= 80 ? 'text-primary-green' :
                              (user.progress?.averageAccuracy || 0) >= 60 ? 'text-yellow-400' :
                              'text-red-400'
                            }`}>
                              {Math.round(user.progress?.averageAccuracy || 0)}%
                            </span>
                          </td>
                          <td className="py-3 px-4 text-center text-accent-orange font-semibold">
                            {user.progress?.currentStreak || 0}
                          </td>
                          <td className="py-3 px-4 text-center text-text-muted text-sm">
                            {user.progress?.lastActivity ? formatDate(user.progress.lastActivity) : 'Never'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default AdminPanel
