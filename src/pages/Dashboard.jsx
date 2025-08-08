import React, { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'
import { authAPI, quizAPI, formatAccuracy, formatTimeSpent, formatDate } from '../utils/api'

const Dashboard = () => {
  const { user } = useAuth()
  const navigate = useNavigate()
  const [dashboardData, setDashboardData] = useState(null)
  const [leaderboard, setLeaderboard] = useState([])
  const [modules, setModules] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)
      
      // Load dashboard data, leaderboard, and modules in parallel
      const [dashboardResponse, leaderboardResponse, modulesResponse] = await Promise.all([
        authAPI.getDashboard(),
        authAPI.getLeaderboard(),
        quizAPI.getModules()
      ])

      if (dashboardResponse.success) {
        setDashboardData(dashboardResponse.data)
      }

      if (leaderboardResponse.success) {
        setLeaderboard(leaderboardResponse.data)
      }

      if (modulesResponse.success) {
        setModules(modulesResponse.data)
      }
    } catch (error) {
      console.error('Error loading dashboard:', error)
      setError('Failed to load dashboard data')
    } finally {
      setLoading(false)
    }
  }

  const startQuiz = (module = null) => {
    if (module) {
      navigate(`/quiz/${module}`)
    } else {
      navigate('/quiz')
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-charcoal flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-text-muted">Loading your dashboard...</p>
        </div>
      </div>
    )
  }

  const progress = dashboardData?.progress || {}
  const recentQuizzes = dashboardData?.recentQuizzes || []
  const achievements = dashboardData?.achievements || []

  return (
    <div className="min-h-screen bg-dark-charcoal py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="heading-primary mb-4">Welcome Back, {user?.fullName}!</h1>
          <p className="text-text-muted text-lg">
            Track your progress and continue your mathematics mastery journey
          </p>
        </div>

        {error && (
          <div className="bg-red-900/50 border border-red-700 text-red-200 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-green mb-2">
              {progress.totalQuizzesTaken || 0}
            </div>
            <div className="text-text-muted">Quizzes Completed</div>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl font-bold text-accent-orange mb-2">
              {formatAccuracy(progress.averageAccuracy || 0)}
            </div>
            <div className="text-text-muted">Average Accuracy</div>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl font-bold text-primary-green mb-2">
              {progress.currentStreak || 0}
            </div>
            <div className="text-text-muted">Current Streak</div>
          </div>
          
          <div className="card text-center">
            <div className="text-3xl font-bold text-accent-orange mb-2">
              {formatTimeSpent(progress.totalTimeSpent || 0)}
            </div>
            <div className="text-text-muted">Time Practiced</div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Quick Actions */}
            <div className="card">
              <h2 className="heading-secondary mb-6">Quick Start</h2>
              <div className="grid md:grid-cols-2 gap-4">
                <button
                  onClick={() => startQuiz()}
                  className="btn btn-primary text-left p-6 h-auto flex-col items-start"
                >
                  <div className="text-lg font-semibold mb-2">🎯 Practice Quiz</div>
                  <div className="text-sm opacity-80">Start a quick practice session</div>
                </button>
                
                <button
                  onClick={() => navigate('/quiz/mock-test')}
                  className="btn btn-secondary text-left p-6 h-auto flex-col items-start"
                >
                  <div className="text-lg font-semibold mb-2">⚡ Mock Test</div>
                  <div className="text-sm opacity-80">Take a full-length mock exam</div>
                </button>
              </div>
            </div>

            {/* Modules */}
            <div className="card">
              <h2 className="heading-secondary mb-6">Study Modules</h2>
              <div className="grid md:grid-cols-2 gap-4">
                {modules.map((module) => (
                  <div key={module.name} className="card bg-light-charcoal hover:bg-light-charcoal/80">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold text-primary-green">
                        {module.name}
                      </h3>
                      <span className="text-sm text-text-muted">
                        {module.totalQuestions} questions
                      </span>
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-green-400">Easy: {module.easy}</span>
                        <span className="text-yellow-400">Medium: {module.medium}</span>
                        <span className="text-red-400">Hard: {module.hard}</span>
                      </div>
                      
                      {module.userProgress && (
                        <div className="progress-bar mt-3">
                          <div 
                            className="progress-fill" 
                            style={{ width: `${module.userProgress.completionPercentage}%` }}
                          ></div>
                        </div>
                      )}
                    </div>
                    
                    <button
                      onClick={() => startQuiz(module.name)}
                      className="btn btn-outline w-full"
                    >
                      Start Practice
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Activity */}
            <div className="card">
              <h2 className="heading-secondary mb-6">Recent Quiz Results</h2>
              {recentQuizzes.length > 0 ? (
                <div className="space-y-4">
                  {recentQuizzes.map((quiz, index) => (
                    <div key={index} className="flex items-center justify-between p-4 bg-medium-charcoal rounded-lg">
                      <div>
                        <div className="font-semibold text-text-light">
                          {quiz.module || 'Mixed Practice'}
                        </div>
                        <div className="text-sm text-text-muted">
                          {formatDate(quiz.completedAt)}
                        </div>
                      </div>
                      
                      <div className="text-right">
                        <div className={`font-semibold ${quiz.accuracy >= 80 ? 'text-primary-green' : quiz.accuracy >= 60 ? 'text-yellow-400' : 'text-red-400'}`}>
                          {formatAccuracy(quiz.accuracy)}
                        </div>
                        <div className="text-sm text-text-muted">
                          {quiz.correctAnswers}/{quiz.totalQuestions}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-text-muted">
                  <div className="text-4xl mb-4">📊</div>
                  <p>No quiz attempts yet. Start your first quiz to see results here!</p>
                  <button
                    onClick={() => startQuiz()}
                    className="btn btn-primary mt-4"
                  >
                    Take Your First Quiz
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-8">
            {/* Achievements */}
            <div className="card">
              <h2 className="heading-tertiary mb-4">🏆 Achievements</h2>
              {achievements.length > 0 ? (
                <div className="space-y-3">
                  {achievements.map((achievement, index) => (
                    <div key={index} className="flex items-center space-x-3 p-3 bg-medium-charcoal rounded-lg">
                      <div className="text-2xl">{achievement.icon}</div>
                      <div>
                        <div className="font-semibold text-sm text-text-light">
                          {achievement.title}
                        </div>
                        <div className="text-xs text-text-muted">
                          {achievement.description}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-text-muted">
                  <p className="text-sm">Complete quizzes to unlock achievements!</p>
                </div>
              )}
            </div>

            {/* Leaderboard */}
            <div className="card">
              <h2 className="heading-tertiary mb-4">🥇 Leaderboard</h2>
              {leaderboard.length > 0 ? (
                <div className="space-y-2">
                  {leaderboard.slice(0, 5).map((leader, index) => (
                    <div key={index} className="flex items-center justify-between p-2 rounded-lg bg-medium-charcoal">
                      <div className="flex items-center space-x-3">
                        <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                          index === 0 ? 'bg-yellow-500 text-black' :
                          index === 1 ? 'bg-gray-400 text-black' :
                          index === 2 ? 'bg-yellow-600 text-black' :
                          'bg-light-charcoal text-text-light'
                        }`}>
                          {index + 1}
                        </div>
                        <div>
                          <div className="text-sm font-semibold text-text-light">
                            {leader.fullName}
                          </div>
                          <div className="text-xs text-text-muted">
                            {leader.totalQuizzes} quizzes
                          </div>
                        </div>
                      </div>
                      <div className="text-sm font-semibold text-primary-green">
                        {formatAccuracy(leader.accuracy)}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4 text-text-muted">
                  <p className="text-sm">No leaderboard data available</p>
                </div>
              )}
            </div>

            {/* Study Tips */}
            <div className="card">
              <h2 className="heading-tertiary mb-4">💡 Study Tips</h2>
              <div className="space-y-3 text-sm text-text-muted">
                <div className="p-3 bg-medium-charcoal rounded-lg">
                  <div className="font-semibold text-primary-green mb-1">Consistency is Key</div>
                  <div>Practice daily, even if just for 15 minutes</div>
                </div>
                <div className="p-3 bg-medium-charcoal rounded-lg">
                  <div className="font-semibold text-accent-orange mb-1">Review Mistakes</div>
                  <div>Focus on understanding why answers were incorrect</div>
                </div>
                <div className="p-3 bg-medium-charcoal rounded-lg">
                  <div className="font-semibold text-primary-green mb-1">Progressive Difficulty</div>
                  <div>Start with easier questions and gradually increase difficulty</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
