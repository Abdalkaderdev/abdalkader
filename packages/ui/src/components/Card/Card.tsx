/**
 * Enhanced Card Component with Hover Effects & Tilt
 * Senior Frontend Developer - Component Specialist
 */

import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';
import './Card.css';
// import { animationSets } from '@/animations/presets';

export interface CardProps {
  children: React.ReactNode;
  hoverable?: boolean;
  glow?: boolean;
  tilt?: boolean;
  interactive?: boolean;
  className?: string;
  onClick?: () => void;
  variant?: 'default' | 'elevated' | 'outlined';
}

export const Card = React.forwardRef<HTMLDivElement, CardProps>(
  (
    {
      children,
      hoverable = true,
      glow = false,
      tilt = false,
      interactive = false,
      className = '',
      onClick,
      variant = 'default',
    },
    ref
  ) => {
    const cardRef = useRef<HTMLDivElement>(null);
    const [rotateX, setRotateX] = useState(0);
    const [rotateY, setRotateY] = useState(0);
    const [isHovered, setIsHovered] = useState(false);

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
      if (!tilt || !cardRef.current) return;

      const rect = cardRef.current.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const rotX = (y - centerY) / 15;
      const rotY = (centerX - x) / 15;

      setRotateX(rotX);
      setRotateY(rotY);
    };

    const handleMouseLeave = () => {
      setRotateX(0);
      setRotateY(0);
      setIsHovered(false);
    };

    const handleMouseEnter = () => {
      setIsHovered(true);
    };

    return (
      <motion.div
        ref={cardRef || ref}
        className={`portfolio-card portfolio-card--${variant} ${
          hoverable ? 'portfolio-card--hoverable' : ''
        } ${glow ? 'portfolio-card--glow' : ''} ${className}`.trim()}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        whileHover={hoverable && !tilt ? { y: -8 } : {}}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onMouseEnter={handleMouseEnter}
        onClick={onClick}
        transition={{ duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
        style={
          tilt
            ? {
                perspective: '1000px',
                rotateX,
                rotateY,
                transformStyle: 'preserve-3d',
              }
            : {}
        }
      >
        {/* Glow effect background */}
        {glow && isHovered && (
          <motion.div
            className="portfolio-card__glow"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}

        {/* Content */}
        <div className="portfolio-card__content">{children}</div>

        {/* Hover overlay for interactive cards */}
        {interactive && isHovered && (
          <motion.div
            className="portfolio-card__overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          />
        )}
      </motion.div>
    );
  }
);

Card.displayName = 'Card';
