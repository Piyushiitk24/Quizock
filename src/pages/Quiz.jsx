import React, { useState, useEffect, useCallback } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { InlineMath, BlockMath } from 'react-katex'
import { useAuth } from '../utils/AuthContext'
import { quizAPI, formatTimeSpent } from '../utils/api'

const Quiz = () => {
  const { module } = useParams()
  const navigate = useNavigate()
  const { recordQuizAttempt } = useAuth()
  
  const [questions, setQuestions] = useState([])
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [answers, setAnswers] = useState({})
  const [timeLeft, setTimeLeft] = useState(null)
  const [startTime, setStartTime] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [quizType, setQuizType] = useState('practice')
  const [difficulty, setDifficulty] = useState('Medium')
  const [showResults, setShowResults] = useState(false)
  const [results, setResults] = useState(null)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    initializeQuiz()
  }, [module, difficulty, quizType])

  useEffect(() => {
    let timer
    if (timeLeft > 0 && !showResults) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000)
    } else if (timeLeft === 0) {
      handleSubmitQuiz()
    }
    return () => clearTimeout(timer)
  }, [timeLeft, showResults])

  const initializeQuiz = async () => {
    try {
      setLoading(true)
      setError('')
      
      let response
      if (quizType === 'mock-test') {
        response = await quizAPI.getMockTest(difficulty)
      } else {
        response = await quizAPI.getQuestions(module, difficulty, 10)
      }

      if (response.success) {
        setQuestions(response.data.questions || response.data)
        setAnswers({})
        setCurrentQuestionIndex(0)
        setStartTime(Date.now())
        
        // Set timer based on quiz type
        if (quizType === 'mock-test') {
          setTimeLeft(response.data.timeLimit || 3600) // 1 hour for mock test
        } else {
          setTimeLeft(response.data.questions?.length * 120 || 1200) // 2 minutes per question
        }
      } else {
        setError(response.message || 'Failed to load questions')
      }
    } catch (error) {
      console.error('Error loading quiz:', error)
      setError('Failed to load quiz questions')
    } finally {
      setLoading(false)
    }
  }

  const handleAnswerChange = (questionId, answer) => {
    setAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }))
  }

  const navigateToQuestion = (index) => {
    if (index >= 0 && index < questions.length) {
      setCurrentQuestionIndex(index)
    }
  }

  const handleSubmitQuiz = useCallback(async () => {
    if (isSubmitting) return
    
    setIsSubmitting(true)
    const timeSpent = Math.floor((Date.now() - startTime) / 1000)
    
    try {
      let response
      if (quizType === 'mock-test') {
        response = await quizAPI.submitMockTest(answers, timeSpent)
      } else {
        // Calculate results locally for practice quiz
        const correctAnswers = questions.filter(q => 
          answers[q._id] === q.correctAnswer
        ).length
        
        response = {
          success: true,
          data: {
            score: correctAnswers,
            totalQuestions: questions.length,
            accuracy: (correctAnswers / questions.length) * 100,
            timeSpent,
            correctAnswers: questions.map(q => ({
              questionId: q._id,
              isCorrect: answers[q._id] === q.correctAnswer,
              userAnswer: answers[q._id],
              correctAnswer: q.correctAnswer,
              explanation: q.explanation
            }))
          }
        }
      }

      if (response.success) {
        setResults(response.data)
        setShowResults(true)
        
        // Record quiz attempt
        await recordQuizAttempt({
          module: module || 'Mixed',
          difficulty,
          quizType,
          score: response.data.score,
          totalQuestions: response.data.totalQuestions,
          accuracy: response.data.accuracy,
          timeSpent
        })
      } else {
        setError('Failed to submit quiz')
      }
    } catch (error) {
      console.error('Error submitting quiz:', error)
      setError('Failed to submit quiz')
    } finally {
      setIsSubmitting(false)
    }
  }, [answers, questions, startTime, quizType, module, difficulty, recordQuizAttempt, isSubmitting])

  const renderMathContent = (text) => {
    if (!text) return ''
    
    // Handle block math ($$...$$)
    const blockMathRegex = /\$\$(.*?)\$\$/g
    let parts = text.split(blockMathRegex)
    
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        // This is math content
        return <BlockMath key={index} math={part} />
      } else {
        // Handle inline math ($...$)
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

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = seconds % 60
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-charcoal flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-text-muted">Loading quiz questions...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-dark-charcoal flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-400 text-4xl mb-4">⚠️</div>
          <h2 className="heading-secondary text-red-400 mb-4">Quiz Load Failed</h2>
          <p className="text-text-muted mb-6">{error}</p>
          <button
            onClick={() => navigate('/dashboard')}
            className="btn btn-primary"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    )
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-dark-charcoal py-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <h1 className="heading-primary mb-4">Quiz Results</h1>
            <div className="flex justify-center items-center space-x-8 mb-6">
              <div className="text-center">
                <div className="text-4xl font-bold text-primary-green">
                  {results.score}/{results.totalQuestions}
                </div>
                <div className="text-text-muted">Correct Answers</div>
              </div>
              <div className="text-center">
                <div className={`text-4xl font-bold ${
                  results.accuracy >= 80 ? 'text-primary-green' : 
                  results.accuracy >= 60 ? 'text-yellow-400' : 'text-red-400'
                }`}>
                  {Math.round(results.accuracy)}%
                </div>
                <div className="text-text-muted">Accuracy</div>
              </div>
              <div className="text-center">
                <div className="text-4xl font-bold text-accent-orange">
                  {formatTime(results.timeSpent)}
                </div>
                <div className="text-text-muted">Time Taken</div>
              </div>
            </div>
          </div>

          {/* Performance Message */}
          <div className="card text-center mb-8">
            {results.accuracy >= 80 ? (
              <div>
                <div className="text-6xl mb-4">🏆</div>
                <h2 className="heading-secondary text-primary-green mb-2">Excellent Performance!</h2>
                <p className="text-text-muted">You've mastered this topic. Keep up the great work!</p>
              </div>
            ) : results.accuracy >= 60 ? (
              <div>
                <div className="text-6xl mb-4">👍</div>
                <h2 className="heading-secondary text-yellow-400 mb-2">Good Effort!</h2>
                <p className="text-text-muted">You're on the right track. Review the explanations below to improve.</p>
              </div>
            ) : (
              <div>
                <div className="text-6xl mb-4">📚</div>
                <h2 className="heading-secondary text-accent-orange mb-2">Keep Learning!</h2>
                <p className="text-text-muted">Don't worry, practice makes perfect. Review the concepts and try again.</p>
              </div>
            )}
          </div>

          {/* Question Review */}
          <div className="space-y-6 mb-8">
            {results.correctAnswers?.map((result, index) => {
              const question = questions.find(q => q._id === result.questionId)
              if (!question) return null

              return (
                <div key={result.questionId} className="card">
                  <div className="flex items-start justify-between mb-4">
                    <h3 className="text-lg font-semibold text-text-light">
                      Question {index + 1}
                    </h3>
                    <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                      result.isCorrect 
                        ? 'bg-green-900 text-green-200' 
                        : 'bg-red-900 text-red-200'
                    }`}>
                      {result.isCorrect ? '✓ Correct' : '✗ Incorrect'}
                    </div>
                  </div>
                  
                  <div className="text-text-light mb-4">
                    {renderMathContent(question.question)}
                  </div>
                  
                  {question.type === 'MCQ' && (
                    <div className="grid md:grid-cols-2 gap-3 mb-4">
                      {Object.entries(question.options).map(([key, value]) => (
                        <div
                          key={key}
                          className={`p-3 rounded-lg border ${
                            key === result.correctAnswer
                              ? 'border-green-500 bg-green-900/20 text-green-200'
                              : key === result.userAnswer && !result.isCorrect
                              ? 'border-red-500 bg-red-900/20 text-red-200'
                              : 'border-border-color bg-medium-charcoal text-text-light'
                          }`}
                        >
                          <span className="font-semibold">{key})</span> {renderMathContent(value)}
                        </div>
                      ))}
                    </div>
                  )}
                  
                  {question.explanation && (
                    <div className="bg-light-charcoal p-4 rounded-lg">
                      <h4 className="font-semibold text-primary-green mb-2">Explanation:</h4>
                      <div className="text-text-muted">
                        {renderMathContent(question.explanation)}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setShowResults(false)
                setCurrentQuestionIndex(0)
                setAnswers({})
                initializeQuiz()
              }}
              className="btn btn-outline"
            >
              Retry Quiz
            </button>
            <button
              onClick={() => navigate('/dashboard')}
              className="btn btn-primary"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    )
  }

  const currentQuestion = questions[currentQuestionIndex]
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100

  return (
    <div className="min-h-screen bg-dark-charcoal py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Quiz Header */}
        <div className="card mb-8">
          <div className="flex flex-col sm:flex-row items-center justify-between mb-4">
            <div>
              <h1 className="heading-secondary">
                {module ? `${module} Quiz` : 'Mixed Practice'}
              </h1>
              <p className="text-text-muted">
                Question {currentQuestionIndex + 1} of {questions.length} | {difficulty} Level
              </p>
            </div>
            
            <div className="flex items-center space-x-4 mt-4 sm:mt-0">
              {timeLeft !== null && (
                <div className={`text-lg font-mono font-semibold ${
                  timeLeft < 300 ? 'text-red-400 animate-pulse' : 'text-primary-green'
                }`}>
                  ⏱️ {formatTime(timeLeft)}
                </div>
              )}
              <button
                onClick={handleSubmitQuiz}
                disabled={isSubmitting}
                className="btn btn-secondary"
              >
                {isSubmitting ? 'Submitting...' : 'Submit Quiz'}
              </button>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="progress-bar">
            <div className="progress-fill" style={{ width: `${progress}%` }}></div>
          </div>
        </div>

        {/* Question Content */}
        {currentQuestion && (
          <div className="card mb-8">
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-text-light">
                  Question {currentQuestionIndex + 1}
                </h2>
                <div className="flex items-center space-x-2">
                  <span className={`px-2 py-1 rounded text-xs font-semibold ${
                    currentQuestion.difficulty === 'Easy' ? 'bg-green-900 text-green-200' :
                    currentQuestion.difficulty === 'Medium' ? 'bg-yellow-900 text-yellow-200' :
                    'bg-red-900 text-red-200'
                  }`}>
                    {currentQuestion.difficulty}
                  </span>
                  <span className="text-text-muted text-sm">
                    {currentQuestion.marks} {currentQuestion.marks === 1 ? 'mark' : 'marks'}
                  </span>
                </div>
              </div>
              
              <div className="text-lg text-text-light leading-relaxed">
                {renderMathContent(currentQuestion.question)}
              </div>
            </div>

            {/* Answer Options */}
            {currentQuestion.type === 'MCQ' ? (
              <div className="space-y-3">
                {Object.entries(currentQuestion.options).map(([key, value]) => (
                  <label
                    key={key}
                    className={`block p-4 rounded-lg border cursor-pointer transition-all ${
                      answers[currentQuestion._id] === key
                        ? 'border-primary-green bg-primary-green/10'
                        : 'border-border-color bg-medium-charcoal hover:border-primary-green/50'
                    }`}
                  >
                    <input
                      type="radio"
                      name={`question-${currentQuestion._id}`}
                      value={key}
                      checked={answers[currentQuestion._id] === key}
                      onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                      className="sr-only"
                    />
                    <div className="flex items-center space-x-3">
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        answers[currentQuestion._id] === key
                          ? 'border-primary-green bg-primary-green'
                          : 'border-border-color'
                      }`}>
                        {answers[currentQuestion._id] === key && (
                          <div className="w-2 h-2 bg-dark-charcoal rounded-full"></div>
                        )}
                      </div>
                      <span className="font-semibold text-text-light">{key})</span>
                      <div className="text-text-light">
                        {renderMathContent(value)}
                      </div>
                    </div>
                  </label>
                ))}
              </div>
            ) : (
              <div>
                <input
                  type="text"
                  value={answers[currentQuestion._id] || ''}
                  onChange={(e) => handleAnswerChange(currentQuestion._id, e.target.value)}
                  placeholder="Enter your answer..."
                  className="input text-lg"
                />
              </div>
            )}
          </div>
        )}

        {/* Navigation */}
        <div className="flex items-center justify-between">
          <button
            onClick={() => navigateToQuestion(currentQuestionIndex - 1)}
            disabled={currentQuestionIndex === 0}
            className="btn btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
          >
            ← Previous
          </button>

          {/* Question Numbers */}
          <div className="flex flex-wrap gap-2 max-w-md">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => navigateToQuestion(index)}
                className={`w-8 h-8 rounded text-sm font-semibold transition-all ${
                  index === currentQuestionIndex
                    ? 'bg-primary-green text-dark-charcoal'
                    : answers[questions[index]._id]
                    ? 'bg-accent-orange text-dark-charcoal'
                    : 'bg-medium-charcoal text-text-light hover:bg-light-charcoal'
                }`}
              >
                {index + 1}
              </button>
            ))}
          </div>

          <button
            onClick={() => navigateToQuestion(currentQuestionIndex + 1)}
            disabled={currentQuestionIndex === questions.length - 1}
            className="btn btn-ghost disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Next →
          </button>
        </div>
      </div>
    </div>
  )
}

export default Quiz
