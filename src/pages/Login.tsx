import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserStore } from '../store/useUserStore';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';

export const Login: React.FC = () => {
  const [name, setName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useUserStore();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    setIsLoading(true);
    
    // Simulate a brief loading state for better UX
    setTimeout(() => {
      login(name.trim());
      navigate('/dashboard');
    }, 500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
      <div className="container">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="max-w-md mx-auto"
        >
          {/* Header */}
          <div className="text-center mb-8">
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
              className="inline-flex items-center justify-center w-20 h-20 bg-white rounded-2xl shadow-lg mb-6"
            >
              <span className="text-4xl">🎯</span>
            </motion.div>
            
            <motion.h1
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="text-4xl font-bold text-white mb-2"
            >
              Quizock
            </motion.h1>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="text-white/90 text-lg"
            >
              NDA Mathematics Preparation
            </motion.p>
            
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.8 }}
              className="text-white/70 mt-2"
            >
              Master formulas, ace your exams
            </motion.p>
          </div>

          {/* Login Card */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 1 }}
          >
            <Card elevated>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="text-center">
                  <h2 className="text-xl font-semibold text-gray-900 mb-2">
                    Get Started
                  </h2>
                  <p className="text-gray-600">
                    Enter your name to begin your learning journey
                  </p>
                </div>

                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your name..."
                    className="input"
                    required
                    disabled={isLoading}
                    autoFocus
                  />
                </div>

                <Button
                  type="submit"
                  size="lg"
                  className="w-full"
                  isLoading={isLoading}
                  disabled={!name.trim() || isLoading}
                >
                  Start Learning
                </Button>

                <div className="text-center text-sm text-gray-500">
                  <p>✓ No account needed • ✓ Data stored locally • ✓ Start instantly</p>
                </div>
              </form>
            </Card>
          </motion.div>

          {/* Features Preview */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2 }}
            className="mt-8 grid grid-cols-2 gap-4"
          >
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-2xl mb-2">⚡</div>
              <h3 className="font-medium text-white text-sm">Formula Flashcards</h3>
              <p className="text-white/70 text-xs mt-1">Quick recall training</p>
            </div>
            
            <div className="text-center p-4 bg-white/10 backdrop-blur-sm rounded-xl border border-white/20">
              <div className="text-2xl mb-2">📝</div>
              <h3 className="font-medium text-white text-sm">Mock Tests</h3>
              <p className="text-white/70 text-xs mt-1">Exam simulation</p>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4 }}
            className="text-center mt-8 text-white/60 text-sm"
          >
            <p>Built for aspiring defence officers</p>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};
