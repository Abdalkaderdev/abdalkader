'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import { motion, useMotionValue, useSpring, AnimatePresence } from 'framer-motion';
import styles from './CustomCursor.module.scss';

interface CursorState {
  isHovering: boolean;
  isClicking: boolean;
  hoverText: string | null;
  cursorType: 'default' | 'link' | 'project' | 'button' | 'text';
}

export default function CustomCursor() {
  const cursorRef = useRef<HTMLDivElement>(null);
  const [cursorState, setCursorState] = useState<CursorState>({
    isHovering: false,
    isClicking: false,
    hoverText: null,
    cursorType: 'default',
  });
  const [isVisible, setIsVisible] = useState(false);
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  // Motion values for smooth cursor movement
  const cursorX = useMotionValue(0);
  const cursorY = useMotionValue(0);

  // Spring animation for smooth following
  const springConfig = { damping: 25, stiffness: 400, mass: 0.5 };
  const cursorXSpring = useSpring(cursorX, springConfig);
  const cursorYSpring = useSpring(cursorY, springConfig);

  // Check for touch device
  useEffect(() => {
    const checkTouch = () => {
      setIsTouchDevice(
        'ontouchstart' in window || navigator.maxTouchPoints > 0
      );
    };
    checkTouch();
  }, []);

  // Mouse move handler with requestAnimationFrame for performance
  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      cursorX.set(e.clientX);
      cursorY.set(e.clientY);

      if (!isVisible) {
        setIsVisible(true);
      }
    },
    [cursorX, cursorY, isVisible]
  );

  // Mouse enter/leave window
  const handleMouseEnter = useCallback(() => setIsVisible(true), []);
  const handleMouseLeave = useCallback(() => setIsVisible(false), []);

  // Click handlers
  const handleMouseDown = useCallback(() => {
    setCursorState((prev) => ({ ...prev, isClicking: true }));
  }, []);

  const handleMouseUp = useCallback(() => {
    setCursorState((prev) => ({ ...prev, isClicking: false }));
  }, []);

  // Hover detection for interactive elements
  useEffect(() => {
    const handleElementHover = (e: MouseEvent) => {
      const target = e.target as HTMLElement;

      // Check for data attributes first
      const cursorType = target.closest('[data-cursor]')?.getAttribute('data-cursor');
      const cursorText = target.closest('[data-cursor-text]')?.getAttribute('data-cursor-text');

      if (cursorType || cursorText) {
        setCursorState((prev) => ({
          ...prev,
          isHovering: true,
          hoverText: cursorText || null,
          cursorType: (cursorType as CursorState['cursorType']) || 'link',
        }));
        return;
      }

      // Check for interactive elements
      const interactiveElement = target.closest(
        'a, button, [role="button"], input, textarea, select, [data-hoverable]'
      );

      if (interactiveElement) {
        const tagName = interactiveElement.tagName.toLowerCase();
        let type: CursorState['cursorType'] = 'link';

        if (tagName === 'button' || interactiveElement.getAttribute('role') === 'button') {
          type = 'button';
        } else if (['input', 'textarea', 'select'].includes(tagName)) {
          type = 'text';
        }

        setCursorState((prev) => ({
          ...prev,
          isHovering: true,
          cursorType: type,
        }));
      }
    };

    const handleElementLeave = () => {
      setCursorState({
        isHovering: false,
        isClicking: false,
        hoverText: null,
        cursorType: 'default',
      });
    };

    document.addEventListener('mouseover', handleElementHover);
    document.addEventListener('mouseout', handleElementLeave);

    return () => {
      document.removeEventListener('mouseover', handleElementHover);
      document.removeEventListener('mouseout', handleElementLeave);
    };
  }, []);

  // Main event listeners
  useEffect(() => {
    if (isTouchDevice) return;

    window.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseenter', handleMouseEnter);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mousedown', handleMouseDown);
    document.addEventListener('mouseup', handleMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseenter', handleMouseEnter);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mousedown', handleMouseDown);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [
    isTouchDevice,
    handleMouseMove,
    handleMouseEnter,
    handleMouseLeave,
    handleMouseDown,
    handleMouseUp,
  ]);

  // Don't render on touch devices
  if (isTouchDevice) return null;

  return (
    <>
      {/* Main cursor dot */}
      <motion.div
        ref={cursorRef}
        className={`${styles.cursor} ${cursorState.isHovering ? styles.hovering : ''} ${
          cursorState.isClicking ? styles.clicking : ''
        }`}
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          opacity: isVisible ? 1 : 0,
        }}
      />

      {/* Cursor ring/outline */}
      <motion.div
        className={`${styles.cursorRing} ${cursorState.isHovering ? styles.hovering : ''}`}
        style={{
          x: cursorXSpring,
          y: cursorYSpring,
          opacity: isVisible ? 1 : 0,
        }}
      />

      {/* Hover text label */}
      <AnimatePresence>
        {cursorState.hoverText && (
          <motion.div
            className={styles.cursorLabel}
            style={{
              x: cursorXSpring,
              y: cursorYSpring,
            }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.2 }}
          >
            {cursorState.hoverText}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
