import React from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../utils/AuthContext'

const Home = () => {
  const { user } = useAuth()

  return (
    <div className="min-h-screen bg-dark-charcoal">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-dark-charcoal via-medium-charcoal to-dark-charcoal">
        <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="heading-primary mb-6 animate-fade-in-up">
              QUIZOCK
            </h1>
            <p className="text-xl text-text-muted mb-8 max-w-3xl mx-auto animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              Master mathematics with our comprehensive quiz platform designed for 
              <span className="text-primary-green font-semibold"> JEE, CUET, and NDA </span> 
              preparation. Track your progress and achieve your goals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              {user ? (
                <>
                  <Link to="/dashboard" className="btn btn-primary">
                    Go to Dashboard
                  </Link>
                  <Link to="/quiz" className="btn btn-outline">
                    Start Quiz
                  </Link>
                </>
              ) : (
                <>
                  <Link to="/login" className="btn btn-primary">
                    Get Started
                  </Link>
                  <a href="#features" className="btn btn-ghost">
                    Learn More
                  </a>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-24 bg-medium-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="heading-secondary mb-4">Platform Features</h2>
            <p className="text-text-muted max-w-2xl mx-auto">
              Comprehensive tools and features designed to accelerate your mathematical learning
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="card hover-scale">
              <div className="text-primary-green text-4xl mb-4">📊</div>
              <h3 className="heading-tertiary">Progress Tracking</h3>
              <p className="text-text-muted">
                Monitor your performance with detailed analytics, accuracy tracking, and personalized insights.
              </p>
            </div>

            <div className="card hover-scale">
              <div className="text-accent-orange text-4xl mb-4">🧮</div>
              <h3 className="heading-tertiary">LaTeX Formulas</h3>
              <p className="text-text-muted">
                Experience mathematical expressions rendered with perfect clarity using advanced LaTeX formatting.
              </p>
            </div>

            <div className="card hover-scale">
              <div className="text-primary-green text-4xl mb-4">🎯</div>
              <h3 className="heading-tertiary">Adaptive Learning</h3>
              <p className="text-text-muted">
                Questions adapt to your skill level with multiple difficulty settings and targeted practice.
              </p>
            </div>

            <div className="card hover-scale">
              <div className="text-accent-orange text-4xl mb-4">⚡</div>
              <h3 className="heading-tertiary">Mock Tests</h3>
              <p className="text-text-muted">
                Simulate real exam conditions with timed mock tests and comprehensive result analysis.
              </p>
            </div>

            <div className="card hover-scale">
              <div className="text-primary-green text-4xl mb-4">🏆</div>
              <h3 className="heading-tertiary">Leaderboards</h3>
              <p className="text-text-muted">
                Compete with peers and track your ranking in various mathematical topics and difficulty levels.
              </p>
            </div>

            <div className="card hover-scale">
              <div className="text-accent-orange text-4xl mb-4">📚</div>
              <h3 className="heading-tertiary">Module System</h3>
              <p className="text-text-muted">
                Organized content across trigonometry, calculus, algebra, and geometry with structured learning paths.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-24 bg-dark-charcoal">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div className="animate-fade-in-up">
              <div className="text-4xl font-bold text-primary-green mb-2">1000+</div>
              <div className="text-text-muted">Practice Questions</div>
            </div>
            <div className="animate-fade-in-up" style={{animationDelay: '0.2s'}}>
              <div className="text-4xl font-bold text-accent-orange mb-2">50+</div>
              <div className="text-text-muted">Topics Covered</div>
            </div>
            <div className="animate-fade-in-up" style={{animationDelay: '0.4s'}}>
              <div className="text-4xl font-bold text-primary-green mb-2">95%</div>
              <div className="text-text-muted">Success Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 bg-gradient-to-r from-medium-charcoal to-light-charcoal">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="heading-secondary mb-4">Ready to Excel in Mathematics?</h2>
          <p className="text-xl text-text-muted mb-8">
            Join thousands of students who have improved their mathematical skills with Quizock
          </p>
          
          {!user && (
            <Link to="/login" className="btn btn-primary btn-lg animate-glow">
              Start Your Journey Today
            </Link>
          )}
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-dark-charcoal border-t border-border-color py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <div className="flex items-center space-x-2 mb-4">
                <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                  <span className="text-dark-charcoal font-bold text-lg">Q</span>
                </div>
                <span className="text-xl font-bold text-gradient font-orbitron">QUIZOCK</span>
              </div>
              <p className="text-text-muted">
                Empowering students with comprehensive mathematics preparation for competitive exams.
              </p>
            </div>
            
            <div>
              <h3 className="heading-tertiary mb-4">Quick Links</h3>
              <ul className="space-y-2 text-text-muted">
                <li><Link to="/" className="hover:text-primary-green transition-colors">Home</Link></li>
                <li><Link to="/login" className="hover:text-primary-green transition-colors">Login</Link></li>
                {user && (
                  <>
                    <li><Link to="/dashboard" className="hover:text-primary-green transition-colors">Dashboard</Link></li>
                    <li><Link to="/quiz" className="hover:text-primary-green transition-colors">Quiz</Link></li>
                  </>
                )}
              </ul>
            </div>
            
            <div>
              <h3 className="heading-tertiary mb-4">Support</h3>
              <ul className="space-y-2 text-text-muted">
                <li><a href="mailto:support@quizock.com" className="hover:text-primary-green transition-colors">Contact Us</a></li>
                <li><a href="#" className="hover:text-primary-green transition-colors">Help Center</a></li>
                <li><a href="#" className="hover:text-primary-green transition-colors">Documentation</a></li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-border-color mt-8 pt-8 text-center text-text-muted">
            <p>&copy; 2024 Quizock. All rights reserved. Built with ❤️ for mathematics education.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default Home
