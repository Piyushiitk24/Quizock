// src/types/index.ts

export interface FormulaQuestion {
  id: number;
  prompt: string; // LaTeX string for the formula prompt, e.g., "\\sin(A+B)"
  answer: string; // LaTeX string for the full formula answer
}

export interface MCQQuestion {
  id: number;
  question: string; // The question text, can contain LaTeX
  options: [string, string, string, string]; // A tuple ensuring exactly 4 options
  correctAnswer: string; // Must be one of the strings from the options array
}

// Stored in localStorage as an array for the logged-in user
export interface PerformanceRecord {
  quizName: string;         // e.g., "Trigonometry Formulas" or "Mock Test 1"
  date: string;             // ISO 8601 timestamp for precise tracking
  score: number;            // Number of correct answers
  totalQuestions: number;   // Total number of questions in the quiz
  timeTaken?: number;       // Optional: time in seconds for timed tests
}
