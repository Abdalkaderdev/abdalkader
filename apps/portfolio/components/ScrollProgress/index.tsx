'use client';

import { useEffect, useState } from 'react';
import { motion, useScroll, useSpring } from 'framer-motion';
import useReducedMotion from '@/hooks/useReducedMotion';
import styles from './ScrollProgress.module.scss';

export const ScrollProgress = () => {
  const [isVisible, setIsVisible] = useState(false);
  const prefersReducedMotion = useReducedMotion();
  const { scrollYProgress } = useScroll();

  // Smooth spring animation for the progress bar
  const scaleX = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001
  });

  useEffect(() => {
    // Only show after scrolling a bit
    const handleScroll = () => {
      setIsVisible(window.scrollY > 100);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Respect reduced motion preference
  if (prefersReducedMotion) {
    return null;
  }

  return (
    <motion.div
      className={styles.progressContainer}
      initial={{ opacity: 0 }}
      animate={{ opacity: isVisible ? 1 : 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className={styles.progressBar}
        style={{ scaleX }}
      />
    </motion.div>
  );
};

export default ScrollProgress;
