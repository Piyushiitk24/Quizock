import React from 'react';
import { useUserStore } from '../../store/useUserStore';
import { Button } from '../ui/Button';
import { motion } from 'framer-motion';

export const Header: React.FC = () => {
  const { username, logout } = useUserStore();

  return (
    <motion.header
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className="glass-effect p-4 mb-8"
    >
      <div className="container mx-auto flex justify-between items-center">
        <motion.h1
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          className="text-3xl font-bold bg-gradient-to-r from-blue-400 to-purple-400 bg-clip-text text-transparent"
        >
          Quizock
        </motion.h1>
        
        {username && (
          <div className="flex items-center gap-4">
            <span className="text-white/80">Welcome, {username}!</span>
            <Button variant="secondary" size="sm" onClick={logout}>
              Logout
            </Button>
          </div>
        )}
      </div>
    </motion.header>
  );
};
