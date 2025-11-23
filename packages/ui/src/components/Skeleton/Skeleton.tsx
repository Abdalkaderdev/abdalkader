/**
 * Enhanced Skeleton Loader Component
 * Senior Frontend Developer - Component Specialist
 */

import React from 'react';
import { motion } from 'framer-motion';
import './Skeleton.css';

export interface SkeletonProps {
  variant?: 'text' | 'circular' | 'rectangular' | 'rounded';
  width?: string | number;
  height?: string | number;
  lines?: number;
  className?: string;
  animation?: 'pulse' | 'wave' | 'shimmer';
  speed?: 'slow' | 'normal' | 'fast';
}

export const Skeleton = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (
    {
      variant = 'text',
      width,
      height,
      lines = 1,
      className = '',
      animation = 'pulse',
      speed = 'normal',
    },
    ref
  ) => {
    const getAnimationProps = () => {
      switch (animation) {
        case 'pulse':
          return {
            animate: { opacity: [0.6, 1, 0.6] },
            transition: {
              duration: speed === 'slow' ? 2 : speed === 'fast' ? 1 : 1.5,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          };
        case 'wave':
          return {
            animate: { x: ['-100%', '100%'] },
            transition: {
              duration: speed === 'slow' ? 2 : speed === 'fast' ? 0.8 : 1.2,
              repeat: Infinity,
              ease: 'linear',
            },
          };
        case 'shimmer':
          return {
            animate: { opacity: [0.3, 0.8, 0.3] },
            transition: {
              duration: speed === 'slow' ? 2.5 : speed === 'fast' ? 1 : 1.8,
              repeat: Infinity,
              ease: 'easeInOut',
            },
          };
        default:
          return {};
      }
    };

    const renderSkeleton = () => {
      const baseClasses = `portfolio-skeleton portfolio-skeleton--${variant} portfolio-skeleton--${animation} portfolio-skeleton--${speed} ${className}`.trim();

      switch (variant) {
        case 'text':
          return (
            <div className={baseClasses} ref={ref}>
              {Array.from({ length: lines }, (_, i) => (
                <motion.div
                  key={i}
                  className="portfolio-skeleton-line"
                  style={{
                    width: i === lines - 1 ? '60%' : '100%',
                    height: height || '1rem',
                  }}
                  {...getAnimationProps()}
                  transition={{ ...getAnimationProps().transition, delay: i * 0.1 }}
                />
              ))}
            </div>
          );

        case 'circular':
          return (
            <motion.div
              className={`${baseClasses} portfolio-skeleton-circle`}
              style={{
                width: width || height || '40px',
                height: height || width || '40px',
              }}
              {...getAnimationProps()}
              ref={ref}
            />
          );

        case 'rectangular':
          return (
            <motion.div
              className={baseClasses}
              style={{
                width: width || '100%',
                height: height || '20px',
              }}
              {...getAnimationProps()}
              ref={ref}
            />
          );

        case 'rounded':
          return (
            <motion.div
              className={`${baseClasses} portfolio-skeleton-rounded`}
              style={{
                width: width || '100%',
                height: height || '20px',
              }}
              {...getAnimationProps()}
              ref={ref}
            />
          );

        default:
          return null;
      }
    };

    return renderSkeleton();
  }
);

Skeleton.displayName = 'Skeleton';

/**
 * Skeleton Card Component - Pre-configured card skeleton
 */
export const SkeletonCard = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (props, ref) => (
    <div className="portfolio-skeleton-card" ref={ref}>
      <Skeleton
        variant="circular"
        width={60}
        height={60}
        className="portfolio-skeleton-card-avatar"
        {...props}
      />
      <div className="portfolio-skeleton-card-content">
        <Skeleton
          variant="text"
          lines={2}
          height={16}
          className="portfolio-skeleton-card-title"
          {...props}
        />
        <Skeleton
          variant="text"
          lines={3}
          height={14}
          className="portfolio-skeleton-card-description"
          {...props}
        />
      </div>
    </div>
  )
);

SkeletonCard.displayName = 'SkeletonCard';

/**
 * Skeleton Table Component - Pre-configured table skeleton
 */
export const SkeletonTable = React.forwardRef<HTMLDivElement, SkeletonProps>(
  (props, ref) => (
    <div className="portfolio-skeleton-table" ref={ref}>
      {Array.from({ length: 5 }, (_, i) => (
        <div key={i} className="portfolio-skeleton-table-row">
          {Array.from({ length: 4 }, (_, j) => (
            <Skeleton
              key={j}
              variant="text"
              height={16}
              width={j === 0 ? '80%' : '60%'}
              {...props}
            />
          ))}
        </div>
      ))}
    </div>
  )
);

SkeletonTable.displayName = 'SkeletonTable';
