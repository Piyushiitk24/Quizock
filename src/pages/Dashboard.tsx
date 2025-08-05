import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useUserStore } from '../store/useUserStore';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { username, getPerformanceRecords } = useUserStore();
  const performanceRecords = getPerformanceRecords();

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12"
      >
        <h1 className="text-4xl font-bold text-white mb-4">
          Welcome back, {username}! 🎯
        </h1>
        <p className="text-xl text-white/80">
          Ready to level up your mathematics skills?
        </p>
      </motion.div>

      <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto mb-8">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <Card hover onClick={() => navigate('/formula-quiz')}>
            <div className="text-center">
              <div className="text-6xl mb-4">⚡</div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Formula Flashcards
              </h2>
              <p className="text-white/70 mb-4">
                High-speed formula memorization. Perfect for instant recall training.
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-white/60">
                <span>⏱️ Timed</span>
                <span>🧠 Memory Building</span>
                <span>⚡ Fast Paced</span>
              </div>
            </div>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <Card hover onClick={() => navigate('/mock-test')}>
            <div className="text-center">
              <div className="text-6xl mb-4">📝</div>
              <h2 className="text-2xl font-bold text-white mb-3">
                Mock Test
              </h2>
              <p className="text-white/70 mb-4">
                Full-scale examination simulation with 120 questions and detailed analysis.
              </p>
              <div className="flex items-center justify-center space-x-4 text-sm text-white/60">
                <span>📊 Detailed Results</span>
                <span>⏰ Exam Mode</span>
                <span>🎯 Precision</span>
              </div>
            </div>
          </Card>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
        <Card>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-4">
              Your Learning Journey
            </h3>
            {performanceRecords.length > 0 ? (
              <div className="space-y-3">
                <p className="text-white/70">
                  You've completed <span className="font-bold text-blue-400">{performanceRecords.length}</span> quizzes so far!
                </p>
                <Button
                  variant="secondary"
                  onClick={() => navigate('/performance')}
                >
                  View Detailed Performance
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <p className="text-white/70">
                  Start your first quiz to begin tracking your progress!
                </p>
                <p className="text-sm text-white/50">
                  All your scores and improvements will be saved locally
                </p>
              </div>
            )}
          </div>
        </Card>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-center mt-12"
      >
        <p className="text-white/60 mb-4">
          💡 Pro Tip: Regular practice with flashcards before attempting mock tests yields the best results!
        </p>
      </motion.div>
    </div>
  );
};
