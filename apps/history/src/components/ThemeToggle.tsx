'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Sun, Moon } from 'lucide-react';
import { useTheme } from '@/contexts/ThemeContext';
import { useReducedMotion } from '@/hooks/useAnimations';

export const ThemeToggle: React.FC = () => {
  const { theme, toggleTheme } = useTheme();
  const reducedMotion = useReducedMotion();

  return (
    <motion.button
      onClick={toggleTheme}
      className="relative w-12 h-6 bg-gray-700 rounded-full p-1 transition-colors duration-300 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2 focus:ring-offset-black"
      whileHover={reducedMotion ? {} : { scale: 1.05 }}
      whileTap={reducedMotion ? {} : { scale: 0.95 }}
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <motion.div
        className="w-4 h-4 bg-white rounded-full shadow-md flex items-center justify-center"
        animate={{
          x: theme === 'dark' ? 0 : 24,
        }}
        transition={{
          type: 'spring',
          stiffness: 500,
          damping: 30,
        }}
      >
        <motion.div
          animate={{
            rotate: theme === 'dark' ? 0 : 180,
            scale: theme === 'dark' ? 1 : 0.8,
          }}
          transition={{
            duration: 0.3,
            ease: 'easeInOut',
          }}
        >
          {theme === 'dark' ? (
            <Moon className="w-2.5 h-2.5 text-gray-800" />
          ) : (
            <Sun className="w-2.5 h-2.5 text-yellow-500" />
          )}
        </motion.div>
      </motion.div>
      
      {/* Background gradient animation */}
      <motion.div
        className="absolute inset-0 rounded-full opacity-0"
        animate={{
          background: theme === 'dark' 
            ? 'linear-gradient(45deg, #1a1a1a, #2d2d2d)'
            : 'linear-gradient(45deg, #fbbf24, #f59e0b)',
          opacity: theme === 'dark' ? 0.3 : 0.6,
        }}
        transition={{ duration: 0.3 }}
      />
    </motion.button>
  );
};

export default ThemeToggle;