import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuizTimer } from '../hooks/useQuizTimer';
import { useUserStore } from '../store/useUserStore';
import type { MCQQuestion } from '../types';
import { QuestionCard } from '../components/quiz/QuestionCard';
import { Timer } from '../components/quiz/Timer';
import { ProgressBar } from '../components/quiz/ProgressBar';
import { Card } from '../components/ui/Card';
import { Button } from '../components/ui/Button';
import { Loader } from '../components/ui/Loader';
import mockTestDataRaw from '../data/mockTest1.json';

const EXAM_TIME_LIMIT = 150 * 60; // 2.5 hours in seconds

// Convert the raw data to proper MCQQuestion format
const mockTestData: MCQQuestion[] = mockTestDataRaw.map(item => ({
  ...item,
  options: item.options as [string, string, string, string]
}));

type QuizMode = 'practice' | 'exam';
type QuizState = 'setup' | 'quiz' | 'complete';

export const MockTest: React.FC = () => {
  const navigate = useNavigate();
  const { savePerformanceRecord } = useUserStore();
  
  const [questions] = useState<MCQQuestion[]>(mockTestData);
  const [quizState, setQuizState] = useState<QuizState>('setup');
  const [mode, setMode] = useState<QuizMode>('practice');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [userAnswers, setUserAnswers] = useState<string[]>(new Array(mockTestData.length).fill(''));
  const [isLoading, setIsLoading] = useState(false);
  const [startTime, setStartTime] = useState<number>(0);

  const { timeRemaining, startTimer, stopTimer } = useQuizTimer(() => {
    handleSubmitQuiz();
  });

  const handleModeSelection = (selectedMode: QuizMode) => {
    setMode(selectedMode);
    setIsLoading(true);
    
    setTimeout(() => {
      setIsLoading(false);
      setQuizState('quiz');
      setStartTime(Date.now());
      
      if (selectedMode === 'exam') {
        startTimer(EXAM_TIME_LIMIT);
      }
    }, 1000);
  };

  const handleAnswerSelect = (answer: string) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentIndex] = answer;
    setUserAnswers(newAnswers);
  };

  const handleNavigation = (direction: 'next' | 'prev') => {
    if (direction === 'next' && currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else if (direction === 'prev' && currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    stopTimer();
    
    const score = userAnswers.reduce((acc, answer, index) => {
      return acc + (answer === questions[index].correctAnswer ? 1 : 0);
    }, 0);

    const timeTaken = mode === 'exam' ? Math.round((Date.now() - startTime) / 1000) : undefined;

    const record = {
      quizName: 'Mock Test 1',
      date: new Date().toISOString(),
      score,
      totalQuestions: questions.length,
      timeTaken,
    };

    savePerformanceRecord(record);

    navigate('/results', {
      state: {
        quizName: 'Mock Test 1',
        score,
        totalQuestions: questions.length,
        timeTaken,
        showDetailedResults: true,
        questions,
        userAnswers,
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="lg" />
        <span className="ml-4 text-xl text-white">Setting up your test...</span>
      </div>
    );
  }

  if (quizState === 'setup') {
    return (
      <div className="min-h-screen flex items-center justify-center px-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="max-w-2xl mx-auto"
        >
          <Card>
            <div className="text-center">
              <div className="text-6xl mb-6">📝</div>
              <h1 className="text-3xl font-bold text-white mb-4">
                Mock Test Setup
              </h1>
              <p className="text-white/80 mb-8">
                Choose your test mode and get ready to challenge yourself with {questions.length} questions.
              </p>

              <div className="grid gap-6 mb-8">
                <Card
                  hover
                  onClick={() => handleModeSelection('practice')}
                  className="cursor-pointer hover:bg-white/15 transition-all duration-200"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">🧘‍♂️</div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Practice Mode
                    </h3>
                    <p className="text-white/70 text-sm">
                      Untimed practice. Take your time to think through each question.
                      Perfect for learning and review.
                    </p>
                  </div>
                </Card>

                <Card
                  hover
                  onClick={() => handleModeSelection('exam')}
                  className="cursor-pointer hover:bg-white/15 transition-all duration-200"
                >
                  <div className="text-center">
                    <div className="text-4xl mb-3">⏰</div>
                    <h3 className="text-xl font-semibold text-white mb-2">
                      Exam Mode
                    </h3>
                    <p className="text-white/70 text-sm">
                      Timed examination simulation (2.5 hours). 
                      Experience real exam conditions.
                    </p>
                  </div>
                </Card>
              </div>

              <Button
                variant="secondary"
                onClick={() => navigate('/dashboard')}
              >
                Back to Dashboard
              </Button>
            </div>
          </Card>
        </motion.div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];
  const answeredQuestions = userAnswers.filter(answer => answer !== '').length;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold text-white">
              Mock Test 1 - {mode === 'exam' ? 'Exam Mode' : 'Practice Mode'}
            </h1>
            {mode === 'exam' && (
              <Timer
                timeRemaining={timeRemaining}
                totalTime={EXAM_TIME_LIMIT}
                variant="bar"
                className="w-64"
              />
            )}
          </div>
          
          <ProgressBar
            current={currentIndex + 1}
            total={questions.length}
          />
        </div>

        {/* Question */}
        <AnimatePresence mode="wait">
          <QuestionCard
            key={currentIndex}
            question={currentQuestion}
            selectedAnswer={userAnswers[currentIndex]}
            onAnswerSelect={handleAnswerSelect}
            questionNumber={currentIndex + 1}
            totalQuestions={questions.length}
          />
        </AnimatePresence>

        {/* Navigation */}
        <div className="flex justify-between items-center mt-8">
          <Button
            variant="secondary"
            onClick={() => handleNavigation('prev')}
            disabled={currentIndex === 0}
          >
            Previous
          </Button>

          <div className="text-center">
            <p className="text-white/60 text-sm">
              Answered: {answeredQuestions} / {questions.length}
            </p>
          </div>

          {currentIndex < questions.length - 1 ? (
            <Button
              onClick={() => handleNavigation('next')}
            >
              Next
            </Button>
          ) : (
            <Button
              onClick={handleSubmitQuiz}
              variant="primary"
              disabled={answeredQuestions === 0}
            >
              Submit Test
            </Button>
          )}
        </div>

        {/* Quick Navigation */}
        <Card className="mt-8">
          <h3 className="text-lg font-semibold text-white mb-4">
            Question Navigator
          </h3>
          <div className="grid grid-cols-10 gap-2">
            {questions.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={`
                  w-10 h-10 rounded-lg text-sm font-medium transition-all duration-200
                  ${index === currentIndex 
                    ? 'bg-blue-600 text-white' 
                    : userAnswers[index] 
                      ? 'bg-green-600 text-white' 
                      : 'bg-white/10 text-white/60 hover:bg-white/20'
                  }
                `}
              >
                {index + 1}
              </button>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );
};
