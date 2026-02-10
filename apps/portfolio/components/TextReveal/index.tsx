'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, useInView, Variants } from 'framer-motion';
import styles from './TextReveal.module.scss';

// Text scramble effect hook
function useTextScramble(text: string, isActive: boolean, speed = 50) {
  const [displayText, setDisplayText] = useState('');
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';

  useEffect(() => {
    if (!isActive) {
      setDisplayText(text);
      return;
    }

    let iteration = 0;
    const maxIterations = text.length;

    const interval = setInterval(() => {
      setDisplayText(
        text
          .split('')
          .map((char, index) => {
            if (char === ' ') return ' ';
            if (index < iteration) return text[index];
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('')
      );

      iteration += 1 / 3;

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayText(text);
      }
    }, speed);

    return () => clearInterval(interval);
  }, [text, isActive, speed]);

  return displayText;
}

// Props interfaces
interface TextRevealProps {
  children: string;
  className?: string;
  delay?: number;
  duration?: number;
  as?: 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'p' | 'span' | 'div';
}

interface ScrambleTextProps extends TextRevealProps {
  speed?: number;
}

// Character-by-character reveal
export function CharacterReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.05,
}: TextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: duration,
        delayChildren: delay,
      },
    },
  };

  const charVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 20,
    },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.4,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.span
      ref={ref}
      className={`${styles.characterReveal} ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      aria-label={children}
    >
      {children.split('').map((char, index) => (
        <motion.span
          key={index}
          variants={charVariants}
          className={styles.char}
          style={{ display: char === ' ' ? 'inline' : 'inline-block' }}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.span>
  );
}

// Word-by-word reveal
export function WordReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.1,
}: TextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  const containerVariants: Variants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: duration,
        delayChildren: delay,
      },
    },
  };

  const wordVariants: Variants = {
    hidden: {
      opacity: 0,
      y: 30,
      rotateX: -90,
    },
    visible: {
      opacity: 1,
      y: 0,
      rotateX: 0,
      transition: {
        duration: 0.6,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.span
      ref={ref}
      className={`${styles.wordReveal} ${className}`}
      variants={containerVariants}
      initial="hidden"
      animate={isInView ? 'visible' : 'hidden'}
      aria-label={children}
    >
      {children.split(' ').map((word, index) => (
        <span key={index} className={styles.wordWrapper}>
          <motion.span variants={wordVariants} className={styles.word}>
            {word}
          </motion.span>
          {index < children.split(' ').length - 1 && '\u00A0'}
        </span>
      ))}
    </motion.span>
  );
}

// Line reveal with mask
export function LineReveal({
  children,
  className = '',
  delay = 0,
  duration = 0.8,
}: TextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <span ref={ref} className={`${styles.lineReveal} ${className}`}>
      <motion.span
        className={styles.lineText}
        initial={{ y: '100%' }}
        animate={isInView ? { y: 0 } : { y: '100%' }}
        transition={{
          duration,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}

// Scramble text effect
export function ScrambleText({
  children,
  className = '',
  delay = 0,
  speed = 30,
}: ScrambleTextProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });
  const [shouldScramble, setShouldScramble] = useState(false);
  const displayText = useTextScramble(children, shouldScramble, speed);

  useEffect(() => {
    if (isInView) {
      const timer = setTimeout(() => setShouldScramble(true), delay * 1000);
      return () => clearTimeout(timer);
    }
  }, [isInView, delay]);

  return (
    <span ref={ref} className={`${styles.scrambleText} ${className}`}>
      {displayText || children}
    </span>
  );
}

// Gradient reveal
export function GradientReveal({
  children,
  className = '',
  delay = 0,
  duration = 1,
}: TextRevealProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: '-10%' });

  return (
    <span ref={ref} className={`${styles.gradientReveal} ${className}`}>
      <motion.span
        className={styles.gradientText}
        initial={{ backgroundPosition: '200% center' }}
        animate={
          isInView
            ? { backgroundPosition: '0% center' }
            : { backgroundPosition: '200% center' }
        }
        transition={{
          duration,
          delay,
          ease: [0.22, 1, 0.36, 1],
        }}
      >
        {children}
      </motion.span>
    </span>
  );
}

// Default export for backwards compatibility
export default CharacterReveal;
