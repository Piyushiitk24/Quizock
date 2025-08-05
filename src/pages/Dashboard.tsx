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
      title: 'Formula Flashcards',
      description: 'High-speed formula memorization. Perfect for instant recall training.',
      features: ['🎯 Timed', '🧠 Memory Building', '⚡ Fast Paced'],
      action: () => navigate('/formula-quiz'),
      icon: '⚡',
      gradient: 'from-blue-500 to-cyan-500'
    },
    {
      title: 'Mock Test',
      description: 'Full-scale examination simulation with 120 questions and detailed analysis.',
      features: ['📊 Detailed Results', '🎯 Exam Mode', '🎖️ Precision'],
      action: () => navigate('/mock-test'),
      icon: '📝',
      gradient: 'from-purple-500 to-pink-500'
    }
  ];

  return (
    <div className="min-h-screen relative">
      {/* Header */}
      <motion.header 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="container mx-auto px-4 py-6"
      >
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-3">
            <div className="text-3xl">🎯</div>
            <h1 className="text-2xl font-bold">Quizock</h1>
          </div>
          <div className="flex items-center space-x-4">
            <span className="text-white/80">Welcome, {username}!</span>
            <Button variant="secondary" onClick={handleLogout}>
              Logout
            </Button>
          </div>
        </div>
      </motion.header>

      {/* Hero Section */}
      <div className="container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold mb-6 leading-tight">
            Welcome back, {username}! 🎯
          </h1>
          <p className="text-xl text-white/80 max-w-2xl mx-auto mb-8">
            Ready to level up your mathematics skills?
          </p>
          <div className="text-4xl mb-8 animate-pulse">⚡</div>
        </motion.div>

        {/* Features Grid */}
        <div className="feature-grid max-w-7xl mx-auto mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 + index * 0.1 }}
            >
              <Card className="card-hover h-full">
                <div className="text-center">
                  <div className="text-6xl mb-6">{feature.icon}</div>
                  <h2 className="text-2xl font-bold text-white mb-4">
                    {feature.title}
                  </h2>
                  <p className="text-white/70 mb-6 leading-relaxed">
                    {feature.description}
                  </p>
                  
                  <div className="flex flex-wrap justify-center gap-2 mb-8">
                    {feature.features.map((feat) => (
                      <span
                        key={feat}
                        className="px-3 py-1 bg-white/10 rounded-full text-sm text-white/80 border border-white/20"
                      >
                        {feat}
                      </span>
                    ))}
                  </div>
                  
                  <Button 
                    className={`w-full bg-gradient-to-r ${feature.gradient} hover:scale-105 transform transition-all`}
                    onClick={feature.action}
                  >
                    Start {feature.title}
                  </Button>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* Learning Journey Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="max-w-4xl mx-auto"
        >
          <Card className="text-center">
            <div className="text-4xl mb-6">🚀</div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Your Learning Journey
            </h2>
            <p className="text-white/70 mb-6 text-lg">
              Start your first quiz to begin tracking your progress!
            </p>
            <p className="text-white/60 mb-8">
              All your scores and improvements will be saved locally
            </p>
            
            {performanceRecords.length > 0 && (
              <div className="mb-6">
                <Button 
                  variant="secondary" 
                  onClick={() => navigate('/performance')}
                  className="mr-4"
                >
                  View Performance
                </Button>
              </div>
            )}
            
            <div className="bg-yellow-900/20 border border-yellow-600/40 rounded-xl p-4 backdrop-blur-sm">
              <p className="text-yellow-200 font-medium flex items-center justify-center">
                <span className="mr-2">💡</span>
                Pro Tip: Regular practice with flashcards before attempting mock tests yields the best results!
              </p>
            </div>
          </Card>
        </motion.div>
      </div>

      {/* Footer */}
      <footer className="container mx-auto px-4 py-8 text-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="text-white/60"
        >
          <p className="mb-2">© 2025 Quizock - NDA Mathematics Preparation Tool</p>
          <p className="flex items-center justify-center">
            Built with <span className="text-red-400 mx-1">❤️</span> for aspiring defence officers
          </p>
        </motion.div>
      </footer>
    </div>
  );
};
