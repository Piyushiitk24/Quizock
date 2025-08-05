import React from 'react';
import { motion } from 'framer-motion';
import type { MCQQuestion } from '../../types';
import { Options } from './Options';
import { Card } from '../ui/Card';

interface QuestionCardProps {
  question: MCQQuestion;
  selectedAnswer?: string;
  onAnswerSelect: (answer: string) => void;
  reveal?: boolean;
  questionNumber: number;
  totalQuestions: number;
}

export const QuestionCard: React.FC<QuestionCardProps> = ({
  question,
  selectedAnswer,
  onAnswerSelect,
  reveal = false,
  questionNumber,
  totalQuestions,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="max-w-4xl mx-auto">
        <div className="mb-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-white/60 font-medium">
              Question {questionNumber} of {totalQuestions}
            </span>
            <span className="text-white/60 text-sm">
              ID: {question.id}
            </span>
          </div>
          
          <h2 className="text-xl font-semibold text-white leading-relaxed">
            {question.question}
          </h2>
        </div>

        <Options
          options={question.options}
          selectedAnswer={selectedAnswer}
          correctAnswer={reveal ? question.correctAnswer : undefined}
          onAnswerSelect={onAnswerSelect}
          reveal={reveal}
        />

        {reveal && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-6 p-4 bg-green-900/30 border border-green-600/50 rounded-lg"
          >
            <p className="text-green-300 font-medium">
              Correct Answer: {question.correctAnswer}
            </p>
          </motion.div>
        )}
      </Card>
    </motion.div>
  );
};
