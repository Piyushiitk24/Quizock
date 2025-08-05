import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hover = false,
}) => {
  const baseClasses = 'glass-effect p-6 shadow-lg';
  const hoverClasses = hover || onClick ? 'cursor-pointer hover:shadow-xl hover:bg-white/20' : '';
  const classes = `${baseClasses} ${hoverClasses} ${className}`;

  const cardContent = (
    <div className={classes}>
      {children}
    </div>
  );

  if (onClick || hover) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
        className="cursor-pointer"
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
};
