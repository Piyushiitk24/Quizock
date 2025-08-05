import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '../ui/Button';

interface OptionsProps {
  options: [string, string, string, string];
  selectedAnswer?: string;
  correctAnswer?: string;
  onAnswerSelect: (answer: string) => void;
  reveal?: boolean;
  disabled?: boolean;
}

export const Options: React.FC<OptionsProps> = ({
  options,
  selectedAnswer,
  correctAnswer,
  onAnswerSelect,
  reveal = false,
  disabled = false,
}) => {
  const getOptionVariant = (option: string) => {
    if (!reveal && !selectedAnswer) return 'secondary';
    if (!reveal && selectedAnswer === option) return 'primary';
    if (!reveal) return 'secondary';
    
    // Reveal mode
    if (option === correctAnswer) return 'primary';
    if (option === selectedAnswer && option !== correctAnswer) return 'danger';
    return 'secondary';
  };

  const getOptionClasses = (option: string) => {
    let classes = 'w-full text-left justify-start min-h-[60px] p-4';
    
    if (reveal) {
      if (option === correctAnswer) {
        classes += ' ring-2 ring-green-400';
      } else if (option === selectedAnswer && option !== correctAnswer) {
        classes += ' ring-2 ring-red-400';
      }
    } else if (selectedAnswer === option) {
      classes += ' ring-2 ring-blue-400';
    }
    
    return classes;
  };

  return (
    <div className="grid gap-4 mt-6">
      {options.map((option, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: index * 0.1 }}
          whileHover={{ scale: disabled ? 1 : 1.02 }}
        >
          <Button
            variant={getOptionVariant(option)}
            className={getOptionClasses(option)}
            onClick={() => !disabled && !reveal && onAnswerSelect(option)}
            disabled={disabled || reveal}
          >
            <span className="font-semibold text-white/80 mr-3">
              {String.fromCharCode(65 + index)}.
            </span>
            <span className="flex-1">{option}</span>
          </Button>
        </motion.div>
      ))}
    </div>
  );
};
