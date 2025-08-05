import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserStore } from '../store/useUserStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { username, logout, getPerformanceRecords } = useUserStore();
  const performanceRecords = getPerformanceRecords();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const features = [
    {
      icon: '⚡',
      title: 'Formula Flashcards',
      description: 'Master mathematical formulas with spaced repetition and instant feedback.',
      features: ['Interactive Learning', 'Progress Tracking', 'Instant Feedback'],
      route: '/formula-quiz',
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      iconBg: 'bg-blue-100'
    },
    {
      icon: '📝',
      title: 'Mock Tests',
      description: 'Take comprehensive practice tests to evaluate your preparation level.',
      features: ['Timed Tests', 'Detailed Analysis', 'Performance Metrics'],
      route: '/mock-test',
      color: 'from-green-500 to-green-600',
      bgColor: 'bg-green-50',
      iconBg: 'bg-green-100'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-lg">Q</span>
            </div>
            <h1 className="text-xl font-bold text-gray-900">Quizock</h1>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-gray-600">Welcome, {username}!</span>
            <Button variant="ghost" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container py-8">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Ready to Excel in Mathematics? 🎯
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Master NDA mathematics with our comprehensive study tools. 
            Practice formulas and take mock tests to boost your confidence.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Card hover onClick={() => navigate(feature.route)} className="h-full">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 ${feature.iconBg} rounded-xl flex items-center justify-center flex-shrink-0`}>
                    <span className="text-2xl">{feature.icon}</span>
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 mb-4">
                      {feature.description}
                    </p>
                    
                    <div className="flex flex-wrap gap-2 mb-4">
                      {feature.features.map((feat) => (
                        <span
                          key={feat}
                          className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm font-medium"
                        >
                          {feat}
                        </span>
                      ))}
                    </div>
                    
                    <Button className={`bg-gradient-to-r ${feature.color} text-white`}>
                      Start {feature.title}
                    </Button>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Progress Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card>
            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">📊</span>
              </div>
              
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Track Your Progress
              </h2>
              
              <p className="text-gray-600 mb-6">
                Monitor your learning journey and see how you're improving over time.
              </p>
              
              {performanceRecords.length > 0 ? (
                <div className="flex justify-center gap-4">
                  <Button onClick={() => navigate('/performance')}>
                    View Performance
                  </Button>
                  <Button variant="secondary" onClick={() => navigate('/formula-quiz')}>
                    Continue Learning
                  </Button>
                </div>
              ) : (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                  <h3 className="font-semibold text-blue-900 mb-2">
                    🚀 Start Your Journey
                  </h3>
                  <p className="text-blue-700 text-sm mb-4">
                    Begin with formula flashcards to build a strong foundation, 
                    then challenge yourself with mock tests.
                  </p>
                  <Button onClick={() => navigate('/formula-quiz')}>
                    Start with Formulas
                  </Button>
                </div>
              )}
            </div>
          </Card>
        </motion.div>

        {/* Tips Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8"
        >
          <div className="bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <span className="text-lg">💡</span>
              </div>
              <div>
                <h3 className="font-semibold text-yellow-900 mb-1">
                  Pro Tip for Success
                </h3>
                <p className="text-yellow-800 text-sm">
                  Practice formula flashcards daily for 15-20 minutes, then take a mock test weekly 
                  to track your progress. Consistency is key to mastering mathematics!
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
};
