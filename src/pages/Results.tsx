import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Confetti from 'react-confetti';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import type { MCQQuestion } from '../types';

interface ResultsState {
  quizName: string;
  score: number;
  totalQuestions: number;
  timeTaken?: number;
  showDetailedResults?: boolean;
  questions?: MCQQuestion[];
  userAnswers?: string[];
}

export const Results: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as ResultsState;

  if (!state) {
    navigate('/dashboard');
    return null;
  }

  const { 
    quizName, 
    score, 
    totalQuestions, 
    timeTaken, 
    showDetailedResults = false,
    questions = [],
    userAnswers = []
  } = state;

  const percentage = Math.round((score / totalQuestions) * 100);
  const shouldShowConfetti = percentage >= 70;

  const getPerformanceMessage = () => {
    if (percentage >= 90) return "Outstanding! 🌟";
    if (percentage >= 80) return "Excellent work! 🎯";
    if (percentage >= 70) return "Good job! 👍";
    if (percentage >= 60) return "Not bad, keep practicing! 📚";
    if (percentage >= 50) return "You're getting there! 💪";
    return "Keep studying, you'll improve! 🚀";
  };

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m ${secs}s`;
    }
    return `${minutes}m ${secs}s`;
  };

  return (
    <div className="container mx-auto px-4 py-8">
      {shouldShowConfetti && (
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={200}
          gravity={0.1}
        />
      )}

      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="max-w-4xl mx-auto"
      >
        {/* Main Results Card */}
        <Card className="text-center mb-8">
          <div className="mb-6">
            <div className="text-6xl mb-4">
              {percentage >= 90 ? '🏆' : percentage >= 70 ? '🎉' : percentage >= 50 ? '👏' : '📖'}
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">
              Quiz Complete!
            </h1>
            <p className="text-xl text-white/80">
              {quizName}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-white/10 rounded-lg p-6">
              <div className="text-3xl font-bold text-blue-400">
                {score}
              </div>
              <div className="text-white/60">Correct Answers</div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-6">
              <div className="text-3xl font-bold text-purple-400">
                {percentage}%
              </div>
              <div className="text-white/60">Score</div>
            </div>
            
            <div className="bg-white/10 rounded-lg p-6">
              <div className="text-3xl font-bold text-green-400">
                {totalQuestions}
              </div>
              <div className="text-white/60">Total Questions</div>
            </div>
          </div>

          {timeTaken && (
            <div className="mb-6">
              <div className="text-lg text-white/80">
                Time Taken: <span className="font-semibold">{formatTime(timeTaken)}</span>
              </div>
            </div>
          )}

          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-white mb-2">
              {getPerformanceMessage()}
            </h2>
            <p className="text-white/70">
              You scored {score} out of {totalQuestions} questions correctly.
            </p>
          </div>

          <div className="flex flex-wrap gap-4 justify-center">
            <Button onClick={() => navigate('/dashboard')}>
              Back to Dashboard
            </Button>
            <Button 
              variant="secondary" 
              onClick={() => navigate('/performance')}
            >
              View Performance History
            </Button>
          </div>
        </Card>

        {/* Detailed Results */}
        {showDetailedResults && questions.length > 0 && (
          <Card>
            <h2 className="text-2xl font-bold text-white mb-6">
              Detailed Results
            </h2>
            <div className="space-y-6">
              {questions.map((question, index) => {
                const userAnswer = userAnswers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <motion.div
                    key={question.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className={`
                      p-4 rounded-lg border-2 
                      ${isCorrect 
                        ? 'border-green-500/50 bg-green-900/20' 
                        : 'border-red-500/50 bg-red-900/20'
                      }
                    `}
                  >
                    <div className="flex items-start gap-4">
                      <div className={`
                        w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold
                        ${isCorrect ? 'bg-green-600 text-white' : 'bg-red-600 text-white'}
                      `}>
                        {index + 1}
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-white mb-3">
                          {question.question}
                        </h3>
                        
                        <div className="grid gap-2">
                          {question.options.map((option, optionIndex) => {
                            const isUserAnswer = option === userAnswer;
                            const isCorrectAnswer = option === question.correctAnswer;
                            
                            return (
                              <div
                                key={optionIndex}
                                className={`
                                  p-2 rounded text-sm
                                  ${isCorrectAnswer 
                                    ? 'bg-green-600/30 text-green-200 border border-green-500' 
                                    : isUserAnswer 
                                      ? 'bg-red-600/30 text-red-200 border border-red-500'
                                      : 'bg-white/10 text-white/70'
                                  }
                                `}
                              >
                                <span className="font-semibold mr-2">
                                  {String.fromCharCode(65 + optionIndex)}.
                                </span>
                                {option}
                                {isCorrectAnswer && (
                                  <span className="ml-2 font-bold text-green-300">✓ Correct</span>
                                )}
                                {isUserAnswer && !isCorrectAnswer && (
                                  <span className="ml-2 font-bold text-red-300">✗ Your Answer</span>
                                )}
                              </div>
                            );
                          })}
                        </div>
                        
                        {!userAnswer && (
                          <div className="mt-2 text-yellow-400 text-sm">
                            ⚠️ Not answered
                          </div>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </Card>
        )}
      </motion.div>
    </div>
  );
};
