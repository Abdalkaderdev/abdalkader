'use client';

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReducedMotion } from '@/hooks/useAnimations';

interface AITypingAnimationProps {
  text: string;
  speed?: number;
  onComplete?: () => void;
  className?: string;
  showCursor?: boolean;
  cursorBlinkSpeed?: number;
}

export const AITypingAnimation: React.FC<AITypingAnimationProps> = ({
  text,
  speed = 30,
  onComplete,
  className = '',
  showCursor = true,
  cursorBlinkSpeed = 500,
}) => {
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isTyping, setIsTyping] = useState(true);
  const [showCursorState, setShowCursorState] = useState(true);
  const intervalRef = useRef<NodeJS.Timeout>();
  const cursorIntervalRef = useRef<NodeJS.Timeout>();
  const reducedMotion = useReducedMotion();

  // Cursor blink animation
  useEffect(() => {
    if (!showCursor) return;

    cursorIntervalRef.current = setInterval(() => {
      setShowCursorState(prev => !prev);
    }, cursorBlinkSpeed);

    return () => {
      if (cursorIntervalRef.current) {
        clearInterval(cursorIntervalRef.current);
      }
    };
  }, [showCursor, cursorBlinkSpeed]);

  // Typing animation
  useEffect(() => {
    if (reducedMotion) {
      setDisplayedText(text);
      setIsTyping(false);
      onComplete?.();
      return;
    }

    if (currentIndex < text.length) {
      intervalRef.current = setTimeout(() => {
        setDisplayedText(prev => prev + text[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, speed);
    } else {
      setIsTyping(false);
      onComplete?.();
    }

    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
    };
  }, [currentIndex, text, speed, onComplete, reducedMotion]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearTimeout(intervalRef.current);
      }
      if (cursorIntervalRef.current) {
        clearInterval(cursorIntervalRef.current);
      }
    };
  }, []);

  return (
    <div className={`relative ${className}`}>
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="text-sm text-gray-300 leading-relaxed"
      >
        {displayedText}
        <AnimatePresence>
          {showCursor && isTyping && (
            <motion.span
              key="cursor"
              initial={{ opacity: 0 }}
              animate={{ opacity: showCursorState ? 1 : 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.1 }}
              className="text-orange-400 font-mono"
            >
              |
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
      
      {/* Typing indicator dots */}
      <AnimatePresence>
        {isTyping && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="flex items-center gap-1 mt-2"
          >
            <motion.div
              className="w-1 h-1 bg-orange-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
            />
            <motion.div
              className="w-1 h-1 bg-orange-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
            />
            <motion.div
              className="w-1 h-1 bg-orange-400 rounded-full"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AITypingAnimation;