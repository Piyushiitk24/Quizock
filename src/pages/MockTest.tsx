import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '../components/ui/Button';
import { Card } from '../components/ui/Card';
import { useUserStore } from '../store/useUserStore';

interface Question {
  id: number;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
}

interface QuizState {
  currentIndex: number;
  answers: number[];
  timeSpent: number;
  isComplete: boolean;
  mode: 'practice' | 'exam';
}

export const MockTest: React.FC = () => {
  const navigate = useNavigate();
  const { username, savePerformanceRecord } = useUserStore();
  const [seconds, setSeconds] = useState(0);
  const [isStarted, setIsStarted] = useState(false);

  // Sample questions for demo
  const questions: Question[] = [
    {
      id: 1,
      question: "What is the value of sin(90°)?",
      options: ["0", "1", "-1", "1/2"],
      correctAnswer: 1,
      explanation: "sin(90°) = 1, as the sine of 90 degrees is at its maximum value."
    },
    {
      id: 2,
      question: "If log₁₀(x) = 2, what is the value of x?",
      options: ["10", "20", "100", "200"],
      correctAnswer: 2,
      explanation: "log₁₀(x) = 2 means 10² = x, therefore x = 100."
    },
    {
      id: 3,
      question: "What is the derivative of x²?",
      options: ["x", "2x", "x²", "2x²"],
      correctAnswer: 1,
      explanation: "The derivative of x² is 2x using the power rule."
    }
  ];

  const [quizState, setQuizState] = useState<QuizState>({
    currentIndex: 0,
    answers: new Array(questions.length).fill(-1),
    timeSpent: 0,
    isComplete: false,
    mode: 'practice'
  });

  const currentQuestion = questions[quizState.currentIndex];

  useEffect(() => {
    if (isStarted) {
      const timer = setInterval(() => {
        setSeconds(prev => prev + 1);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [isStarted]);

  const handleStart = (mode: 'practice' | 'exam') => {
    setQuizState(prev => ({ ...prev, mode }));
    setIsStarted(true);
  };

  const handleAnswer = (answerIndex: number) => {
    const newAnswers = [...quizState.answers];
    newAnswers[quizState.currentIndex] = answerIndex;
    setQuizState(prev => ({ ...prev, answers: newAnswers }));
  };

  const handleNext = () => {
    if (quizState.currentIndex < questions.length - 1) {
      setQuizState(prev => ({ ...prev, currentIndex: prev.currentIndex + 1 }));
    } else {
      completeQuiz();
    }
  };

  const handlePrevious = () => {
    if (quizState.currentIndex > 0) {
      setQuizState(prev => ({ ...prev, currentIndex: prev.currentIndex - 1 }));
    }
  };

  const completeQuiz = () => {
    const score = quizState.answers.reduce((acc, answer, index) => {
      return answer === questions[index].correctAnswer ? acc + 1 : acc;
    }, 0);

    const performance = {
      quizName: `Mock Test (${quizState.mode})`,
      score,
      totalQuestions: questions.length,
      date: new Date().toISOString(),
    };
    
    savePerformanceRecord(performance);
    setQuizState(prev => ({ ...prev, isComplete: true }));
  };

  const formatTime = (totalSeconds: number) => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const secs = totalSeconds % 60;
    return hours > 0 
      ? `${hours}:${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`
      : `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const restartQuiz = () => {
    setQuizState({
      currentIndex: 0,
      answers: new Array(questions.length).fill(-1),
      timeSpent: 0,
      isComplete: false,
      mode: 'practice'
    });
    setSeconds(0);
    setIsStarted(false);
  };

  // Setup screen
  if (!isStarted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="navbar">
          <div className="container flex justify-between items-center">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              ← Back to Dashboard
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Mock Test</h1>
            <div className="w-24"></div>
          </div>
        </nav>

        <main className="container py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <Card>
              <div className="text-center">
                <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">📝</span>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                  NDA Mathematics Mock Test
                </h1>
                <p className="text-gray-600 mb-8 text-lg">
                  Test your preparation with a comprehensive practice exam
                </p>

                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-blue-900 mb-2">
                      📚 Practice Mode
                    </h3>
                    <p className="text-blue-700 mb-4">
                      Learn at your own pace with immediate feedback and explanations
                    </p>
                    <ul className="text-sm text-blue-600 mb-4 space-y-1">
                      <li>• No time pressure</li>
                      <li>• Instant feedback</li>
                      <li>• Detailed explanations</li>
                    </ul>
                    <Button onClick={() => handleStart('practice')} className="w-full">
                      Start Practice Mode
                    </Button>
                  </div>

                  <div className="bg-green-50 border border-green-200 rounded-lg p-6">
                    <h3 className="text-xl font-semibold text-green-900 mb-2">
                      ⚡ Exam Mode
                    </h3>
                    <p className="text-green-700 mb-4">
                      Simulate real exam conditions with time limits and pressure
                    </p>
                    <ul className="text-sm text-green-600 mb-4 space-y-1">
                      <li>• Timed experience</li>
                      <li>• Exam-like pressure</li>
                      <li>• Results at the end</li>
                    </ul>
                    <Button onClick={() => handleStart('exam')} className="w-full bg-green-600 hover:bg-green-700">
                      Start Exam Mode
                    </Button>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-yellow-100 rounded-lg flex items-center justify-center flex-shrink-0">
                      <span className="text-lg">💡</span>
                    </div>
                    <div className="text-left">
                      <h3 className="font-semibold text-yellow-900 mb-1">
                        Test Information
                      </h3>
                      <p className="text-yellow-800 text-sm">
                        This mock test contains {questions.length} questions covering various mathematical topics. 
                        Take your time in practice mode or challenge yourself with exam mode!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </motion.div>
        </main>
      </div>
    );
  }

  // Results screen
  if (quizState.isComplete) {
    const score = quizState.answers.reduce((acc, answer, index) => {
      return answer === questions[index].correctAnswer ? acc + 1 : acc;
    }, 0);
    const accuracy = Math.round((score / questions.length) * 100);
    
    return (
      <div className="min-h-screen bg-gray-50">
        <nav className="navbar">
          <div className="container flex justify-between items-center">
            <Button variant="ghost" onClick={() => navigate('/dashboard')}>
              ← Back to Dashboard
            </Button>
            <h1 className="text-xl font-bold text-gray-900">Mock Test Complete!</h1>
            <div className="w-24"></div>
          </div>
        </nav>

        <main className="container py-8 max-w-4xl">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center mb-8"
          >
            <Card>
              <div className="text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <span className="text-4xl">🎯</span>
                </div>
                
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  Test Completed!
                </h1>
                <p className="text-gray-600 mb-8">
                  Well done, {username}! Here are your results:
                </p>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {score}/{questions.length}
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
                    <div className="text-yellow-700 font-medium">Time Taken</div>
                  </div>
                </div>

                {accuracy >= 80 ? (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-8">
                    <h3 className="font-semibold text-green-900 mb-2">
                      🌟 Outstanding Performance!
                    </h3>
                    <p className="text-green-700">
                      Excellent work! You're well-prepared for the actual exam.
                    </p>
                  </div>
                ) : accuracy >= 60 ? (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
                    <h3 className="font-semibold text-yellow-900 mb-2">
                      📚 Good Performance!
                    </h3>
                    <p className="text-yellow-700">
                      Nice work! Focus on areas where you struggled to improve further.
                    </p>
                  </div>
                ) : (
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
                    <h3 className="font-semibold text-blue-900 mb-2">
                      💪 Keep Practicing!
                    </h3>
                    <p className="text-blue-700">
                      Don't worry! More practice with formulas will help improve your score.
                    </p>
                  </div>
                )}

                <div className="flex justify-center gap-4">
                  <Button onClick={restartQuiz}>
                    Take Another Test
                  </Button>
                  <Button variant="secondary" onClick={() => navigate('/formula-quiz')}>
                    Practice Formulas
                  </Button>
                  <Button variant="ghost" onClick={() => navigate('/performance')}>
                    View Progress
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>

          {/* Review answers */}
          <Card>
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Review Your Answers</h2>
            <div className="space-y-6">
              {questions.map((question, index) => {
                const userAnswer = quizState.answers[index];
                const isCorrect = userAnswer === question.correctAnswer;
                
                return (
                  <div key={question.id} className="border border-gray-200 rounded-lg p-6">
                    <div className="flex items-start gap-3 mb-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 ${
                        isCorrect ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'
                      }`}>
                        {isCorrect ? '✓' : '✗'}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-gray-900 mb-2">
                          Question {index + 1}
                        </h3>
                        <p className="text-gray-700 mb-4">{question.question}</p>
                        
                        <div className="grid gap-2 mb-4">
                          {question.options.map((option, optionIndex) => (
                            <div
                              key={optionIndex}
                              className={`p-3 rounded-lg text-sm ${
                                optionIndex === question.correctAnswer
                                  ? 'bg-green-50 border border-green-200 text-green-800'
                                  : optionIndex === userAnswer
                                  ? 'bg-red-50 border border-red-200 text-red-800'
                                  : 'bg-gray-50 border border-gray-200 text-gray-700'
                              }`}
                            >
                              {String.fromCharCode(65 + optionIndex)}. {option}
                              {optionIndex === question.correctAnswer && (
                                <span className="ml-2 font-medium">(Correct)</span>
                              )}
                              {optionIndex === userAnswer && optionIndex !== question.correctAnswer && (
                                <span className="ml-2 font-medium">(Your answer)</span>
                              )}
                            </div>
                          ))}
                        </div>
                        
                        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                          <h4 className="font-medium text-blue-900 mb-1">Explanation</h4>
                          <p className="text-blue-800 text-sm">{question.explanation}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </Card>
        </main>
      </div>
    );
  }

  // Quiz screen
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <nav className="navbar">
        <div className="container flex justify-between items-center">
          <Button variant="ghost" onClick={() => navigate('/dashboard')}>
            ← Exit Test
          </Button>
          <h1 className="text-xl font-bold text-gray-900">
            Mock Test - {quizState.mode === 'exam' ? 'Exam Mode' : 'Practice Mode'}
          </h1>
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
              Question {quizState.currentIndex + 1} of {questions.length}
            </span>
            <span className="text-sm font-medium text-gray-600">
              Answered: {quizState.answers.filter(a => a !== -1).length}/{questions.length}
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${((quizState.currentIndex + 1) / questions.length) * 100}%` }}
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
              <div>
                <h2 className="text-xl font-bold text-gray-900 mb-6">
                  Question {quizState.currentIndex + 1}
                </h2>
                
                <div className="mb-8">
                  <p className="text-gray-700 text-lg leading-relaxed">
                    {currentQuestion.question}
                  </p>
                </div>

                <div className="space-y-3 mb-8">
                  {currentQuestion.options.map((option, index) => (
                    <button
                      key={index}
                      onClick={() => handleAnswer(index)}
                      className={`w-full text-left p-4 rounded-lg border transition-all ${
                        quizState.answers[quizState.currentIndex] === index
                          ? 'bg-blue-50 border-blue-300 text-blue-900'
                          : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50'
                      }`}
                    >
                      <span className="font-medium mr-3">
                        {String.fromCharCode(65 + index)}.
                      </span>
                      {option}
                    </button>
                  ))}
                </div>

                <div className="flex justify-between">
                  <Button
                    variant="secondary"
                    onClick={handlePrevious}
                    disabled={quizState.currentIndex === 0}
                  >
                    ← Previous
                  </Button>
                  
                  <Button
                    onClick={handleNext}
                    disabled={quizState.answers[quizState.currentIndex] === -1}
                  >
                    {quizState.currentIndex === questions.length - 1 ? 'Finish Test' : 'Next →'}
                  </Button>
                </div>
              </div>
            </Card>
          </motion.div>
        </AnimatePresence>
      </main>
    </div>
  );
};
