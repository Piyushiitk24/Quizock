import React from 'react';
import { motion } from 'framer-motion';

interface TimerProps {
  timeRemaining: number;
  totalTime: number;
  variant?: 'circle' | 'bar';
  className?: string;
}

export const Timer: React.FC<TimerProps> = ({
  timeRemaining,
  totalTime,
  variant = 'circle',
  className = '',
}) => {
  const percentage = (timeRemaining / totalTime) * 100;
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const getColorClass = () => {
    if (percentage > 50) return 'text-green-400 border-green-400';
    if (percentage > 25) return 'text-yellow-400 border-yellow-400';
    return 'text-red-400 border-red-400';
  };

  if (variant === 'circle') {
    const radius = 45;
    const circumference = 2 * Math.PI * radius;
    const strokeDasharray = circumference;
    const strokeDashoffset = circumference - (percentage / 100) * circumference;

    return (
      <div className={`flex flex-col items-center ${className}`}>
        <div className="relative">
          <svg width="120" height="120" className="transform -rotate-90">
            {/* Background circle */}
            <circle
              cx="60"
              cy="60"
              r={radius}
              stroke="rgba(255, 255, 255, 0.2)"
              strokeWidth="8"
              fill="transparent"
            />
            {/* Progress circle */}
            <motion.circle
              cx="60"
              cy="60"
              r={radius}
              stroke="currentColor"
              strokeWidth="8"
              fill="transparent"
              strokeDasharray={strokeDasharray}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              className={getColorClass()}
              initial={{ strokeDashoffset: circumference }}
              animate={{ strokeDashoffset }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
            />
          </svg>
          <div className={`absolute inset-0 flex items-center justify-center font-bold text-xl ${getColorClass()}`}>
            {timeString}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`w-full ${className}`}>
      <div className="flex justify-between items-center mb-2">
        <span className="text-white/80 font-medium">Time Remaining</span>
        <span className={`font-bold ${getColorClass()}`}>{timeString}</span>
      </div>
      <div className="w-full bg-white/20 rounded-full h-3 overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${getColorClass().replace('text-', 'bg-').replace('border-', 'bg-')}`}
          initial={{ width: '100%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.5, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};
