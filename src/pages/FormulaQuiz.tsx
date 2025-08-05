import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useQuizTimer } from '../hooks/useQuizTimer';
import { useUserStore } from '../store/useUserStore';
import type { FormulaQuestion } from '../types';
import { Timer } from '../components/quiz/Timer';
import { ProgressBar } from '../components/quiz/ProgressBar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Loader } from '../components/ui/Loader';
import trigFormulasData from '../data/trigFormulas.json';

const FORMULA_TIME_LIMIT = 10; // seconds per formula

export const FormulaQuiz: React.FC = () => {
  const navigate = useNavigate();
  const { savePerformanceRecord } = useUserStore();
  const [questions] = useState<FormulaQuestion[]>(trigFormulasData);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isQuizComplete, setIsQuizComplete] = useState(false);
  const [userScore, setUserScore] = useState<number | null>(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const { timeRemaining, isRunning, startTimer, stopTimer } = useQuizTimer(() => {
    handleNextQuestion();
  });

  useEffect(() => {
    // Simulate loading delay for better UX
    const timer = setTimeout(() => {
      setIsLoading(false);
      startTimer(FORMULA_TIME_LIMIT);
    }, 1000);

    return () => clearTimeout(timer);
  }, [startTimer]);

  const handleNextQuestion = () => {
    setShowAnswer(true);
    stopTimer();

    setTimeout(() => {
      if (currentIndex < questions.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setShowAnswer(false);
        startTimer(FORMULA_TIME_LIMIT);
      } else {
        setIsQuizComplete(true);
      }
    }, 2000); // Show answer for 2 seconds
  };

  const handleScoreSubmit = (score: number) => {
    setUserScore(score);
    const record = {
      quizName: 'Trigonometry Formulas',
      date: new Date().toISOString(),
      score,
      totalQuestions: questions.length,
    };
    savePerformanceRecord(record);
    
    // Navigate to results with the performance data
    navigate('/results', { 
      state: { 
        quizName: 'Trigonometry Formulas',
        score,
        totalQuestions: questions.length,
        showDetailedResults: false
      } 
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
        <span className="ml-4 text-xl text-white">Loading formulas...</span>
      </div>
    );
  }

  if (isQuizComplete && userScore === null) {
    return (
      <div className="container mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          <Card>
            <div className="text-center">
              <div className="text-6xl mb-6">🎯</div>
              <h2 className="text-3xl font-bold text-white mb-4">
                Quiz Complete!
              </h2>
              <p className="text-white/80 mb-6">
                You've reviewed all {questions.length} trigonometry formulas.
                How many did you get correct?
              </p>
              
              <div className="grid grid-cols-5 gap-3 mb-6">
                {Array.from({ length: questions.length + 1 }, (_, i) => (
                  <Button
                    key={i}
                    variant={i === questions.length ? 'primary' : 'secondary'}
                    onClick={() => handleScoreSubmit(i)}
                    className="aspect-square"
                  >
                    {i}
                  </Button>
                ))}
              </div>
              
              <p className="text-sm text-white/60">
                Be honest with yourself - it helps track your real progress!
              </p>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <ProgressBar
            current={currentIndex + 1}
            total={questions.length}
            className="mb-6"
          />
          
          <div className="flex justify-center mb-6">
            <Timer
              timeRemaining={timeRemaining}
              totalTime={FORMULA_TIME_LIMIT}
              variant="circle"
            />
          </div>
        </div>

        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -50 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="text-center">
            <div className="mb-6">
              <span className="text-white/60 font-medium">
                Formula {currentIndex + 1} of {questions.length}
              </span>
            </div>

            <div className="mb-8">
              <h2 className="text-2xl font-semibold text-white mb-4">
                Complete this formula:
              </h2>
              <div className="text-4xl font-mono bg-slate-800/50 p-6 rounded-lg border border-white/20">
                {currentQuestion.prompt}
              </div>
            </div>

            {showAnswer && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-8 p-6 bg-green-900/30 border border-green-600/50 rounded-lg"
              >
                <h3 className="text-green-300 font-semibold mb-3">Answer:</h3>
                <div className="text-2xl font-mono text-green-200">
                  {currentQuestion.answer}
                </div>
              </motion.div>
            )}

            {!showAnswer && !isRunning && (
              <Button onClick={handleNextQuestion}>
                Show Answer
              </Button>
            )}
          </Card>
        </motion.div>

        <div className="text-center mt-8">
          <Button
            variant="secondary"
            onClick={() => navigate('/dashboard')}
          >
            Exit Quiz
          </Button>
        </div>
      </div>
    </div>
  );
};
