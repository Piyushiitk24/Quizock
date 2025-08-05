import React from 'react';
import { motion } from 'framer-motion';

interface CardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
  hover?: boolean;
  elevated?: boolean;
}

export const Card: React.FC<CardProps> = ({
  children,
  className = '',
  onClick,
  hover = false,
  elevated = false,
}) => {
  const baseClasses = 'card';
  const elevatedClass = elevated ? 'card-elevated' : '';
  const hoverClasses = hover || onClick ? 'feature-card' : '';
  const classes = `${baseClasses} ${elevatedClass} ${hoverClasses} ${className}`;

  const cardContent = (
    <div className={classes}>
      <div className="p-6">
        {children}
      </div>
    </div>
  );

  if (onClick || hover) {
    return (
      <motion.div
        whileHover={{ scale: 1.02, y: -2 }}
        whileTap={{ scale: 0.98 }}
        onClick={onClick}
      >
        {cardContent}
      </motion.div>
    );
  }

  return cardContent;
};
