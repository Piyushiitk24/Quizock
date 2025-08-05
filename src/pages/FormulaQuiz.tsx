import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { LaTeX } from '../components/ui/LaTeX';
import { useUserStore } from '../store/useUserStore';

interface QuizState {
  currentIndex: number;
  score: number;
  incorrectAnswers: number[];
  showAnswer: boolean;
  isComplete: boolean;
  quizStartTime: Date;
}

export const FormulaQuiz: React.FC = () => {
  const navigate = useNavigate();
  const { username, savePerformanceRecord } = useUserStore();
  const [seconds, setSeconds] = useState(0);

  const trigFormulas = [
    {
      name: "Sine Identity",
      formula: "\\sin^2(\\theta) + \\cos^2(\\theta) = 1",
      explanation: "This is the fundamental trigonometric identity relating sine and cosine.",
      usage: "Use this to convert between sine and cosine functions."
    },
    {
      name: "Double Angle - Sine",
      formula: "\\sin(2\\theta) = 2\\sin(\\theta)\\cos(\\theta)",
      explanation: "This formula gives the sine of double an angle.",
      usage: "Use when you need to find sine of 2θ given sine and cosine of θ."
    },
    {
      name: "Double Angle - Cosine",
      formula: "\\cos(2\\theta) = \\cos^2(\\theta) - \\sin^2(\\theta)",
      explanation: "This formula gives the cosine of double an angle.",
      usage: "Use when you need to find cosine of 2θ given sine and cosine of θ."
    }
  ];

  const [quizState, setQuizState] = useState<QuizState>({
    currentIndex: 0,
    score: 0,
    incorrectAnswers: [],
    showAnswer: false,
    isComplete: false,
    quizStartTime: new Date()
  });

  const currentFormula = trigFormulas[quizState.currentIndex];

  useEffect(() => {
    const timer = setInterval(() => {
      setSeconds(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswer = (isCorrect: boolean) => {
    if (quizState.showAnswer) return;

    setQuizState(prev => ({
      ...prev,
      showAnswer: true,
      score: isCorrect ? prev.score + 1 : prev.score,
      incorrectAnswers: isCorrect ? prev.incorrectAnswers : [...prev.incorrectAnswers, prev.currentIndex]
    }));
  };

  const handleNext = () => {
    if (quizState.currentIndex < trigFormulas.length - 1) {
      setQuizState(prev => ({
        ...prev,
        currentIndex: prev.currentIndex + 1,
        showAnswer: false
      }));
    } else {
      completeQuiz();
    }
  };

  const completeQuiz = () => {
    const performance = {
      quizName: 'Formula Quiz',
      score: quizState.score,
      totalQuestions: trigFormulas.length,
      date: new Date().toISOString(),
    };
    
    savePerformanceRecord(performance);
    setQuizState(prev => ({ ...prev, isComplete: true }));
  };

  const restartQuiz = () => {
    setQuizState({
      currentIndex: 0,
      score: 0,
      incorrectAnswers: [],
      showAnswer: false,
      isComplete: false,
      quizStartTime: new Date()
    });
    setSeconds(0);
  };

  const formatTime = (totalSeconds: number) => {
    const minutes = Math.floor(totalSeconds / 60);
    const secs = totalSeconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  if (quizState.isComplete) {
    const accuracy = Math.round((quizState.score / trigFormulas.length) * 100);
    
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="navbar">
          <div className="container flex justify-between items-center">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              ← Back to Dashboard
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Formula Quiz Complete!</h1>
            <div className="w-24"></div>
          </div>
        </nav>

        <main className="container py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center"
          >
            <Card>
              <div className="text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">�</span>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Quiz Completed!
                </h1>
                <p className="text-gray-600 mb-8">
                  Great job, {username}! Here's how you performed:
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {quizState.score}/{trigFormulas.length}
                    </div>
                    <div className="text-blue-700 font-medium">Score</div>
                  </div>
                  
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {accuracy}%
                    </div>
                    <div className="text-green-700 font-medium">Accuracy</div>
                  </div>
                  
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                    <div className="text-3xl font-bold text-yellow-600 mb-2">
                      {formatTime(seconds)}
                    </div>
                    <div className="text-yellow-700 font-medium">Time Spent</div>
                  </div>
                </div>

                {accuracy >= 80 ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                    <h3 className="font-semibold text-green-900 mb-2">
                      🌟 Excellent Performance!
                    </h3>
                    <p className="text-green-700">
                      You're ready for mock tests! Your formula knowledge is strong.
                    </p>
                  </div>
                ) : accuracy >= 60 ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                    <h3 className="font-semibold text-yellow-900 mb-2">
                      📚 Good Progress!
                    </h3>
                    <p className="text-yellow-700">
                      Keep practicing! A few more rounds will strengthen your foundation.
                    </p>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      💪 Keep Going!
                    </h3>
                    <p className="text-blue-700">
                      Practice makes perfect! Focus on the formulas you missed.
                    </p>
                  </div>
                )}

                <div className="flex justify-center gap-4">
                  <Button onClick={restartQuiz}>
                    Practice Again
                  </Button>
                  <Button variant="secondary" onClick={() => navigate('/mock-test')}>
                    Try Mock Test
                  </Button>
                  <Button variant="ghost" onClick={() => navigate('/performance')}>
                    View Progress
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            ← Back to Dashboard
          </Button>
          <h1 className="text-xl font-bold text-gray-900">Formula Flashcards</h1>
          <div className="flex items-center gap-4">
            <div className="bg-white border border-gray-200 rounded-lg px-3 py-2">
              <span className="text-gray-600 text-sm font-medium">
                ⏱️ {formatTime(seconds)}
              </span>
            </div>
          </div>
        </div>
      </nav>

      {/* Progress Bar */}
      <div className="bg-white border-b border-gray-200">
        <div className="container py-4">
          <div className="flex justify-between items-center mb-2">
            <span className="text-sm font-medium text-gray-600">
              Question {quizState.currentIndex + 1} of {trigFormulas.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              Score: {quizState.score}/{quizState.currentIndex + (quizState.showAnswer ? 1 : 0)}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((quizState.currentIndex + 1) / trigFormulas.length) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Main Content */}
      <main className="container py-8 max-w-4xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={quizState.currentIndex}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <Card>
              <div className="text-center">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">
                  {currentFormula.name}
                </h2>
                
                <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 mb-8">
                  <LaTeX>{currentFormula.formula}</LaTeX>
                </div>

                <p className="text-gray-600 mb-8 text-lg">
                  Do you know this formula?
                </p>

                {!quizState.showAnswer ? (
                  <div className="flex justify-center gap-4">
                    <Button 
                      onClick={() => handleAnswer(true)}
                      className="bg-green-600 hover:bg-green-700 text-white px-8"
                    >
                      ✓ I Know This
                    </Button>
                    <Button 
                      onClick={() => handleAnswer(false)}
                      className="bg-red-600 hover:bg-red-700 text-white px-8"
                    >
                      ✗ I Don't Know
                    </Button>
                  </div>
                ) : (
                  <div>
                    <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
                      <h3 className="font-semibold text-blue-900 mb-3">
                        📖 Formula Explanation
                      </h3>
                      <p className="text-blue-800 leading-relaxed">
                        {currentFormula.explanation}
                      </p>
                    </div>

                    <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
                      <h3 className="font-semibold text-green-900 mb-3">
                        💡 When to Use
                      </h3>
                      <p className="text-green-800 leading-relaxed">
                        {currentFormula.usage}
                      </p>
                    </div>

                    <Button onClick={handleNext} className="px-8">
                      {quizState.currentIndex < trigFormulas.length - 1 ? 'Next Formula →' : 'Complete Quiz'}
                    </Button>
                  </div>
                )}
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
