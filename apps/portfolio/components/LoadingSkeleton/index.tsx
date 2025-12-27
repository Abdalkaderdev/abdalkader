'use client';

import { motion } from 'framer-motion';
import styles from './LoadingSkeleton.module.scss';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  borderRadius?: string | number;
  className?: string;
}

export const Skeleton = ({
  width = '100%',
  height = '1rem',
  borderRadius = '4px',
  className = '',
}: SkeletonProps) => {
  return (
    <div
      className={`${styles.skeleton} ${className}`}
      style={{
        width: typeof width === 'number' ? `${width}px` : width,
        height: typeof height === 'number' ? `${height}px` : height,
        borderRadius: typeof borderRadius === 'number' ? `${borderRadius}px` : borderRadius,
      }}
    />
  );
};

// Project Card Skeleton
export const ProjectCardSkeleton = () => {
  return (
    <div className={styles.projectCard}>
      <Skeleton height={200} borderRadius={12} />
      <div className={styles.cardContent}>
        <Skeleton width="60%" height={24} />
        <Skeleton width="40%" height={16} />
        <div className={styles.tags}>
          <Skeleton width={60} height={24} borderRadius={12} />
          <Skeleton width={80} height={24} borderRadius={12} />
          <Skeleton width={70} height={24} borderRadius={12} />
        </div>
      </div>
    </div>
  );
};

// Service Card Skeleton
export const ServiceCardSkeleton = () => {
  return (
    <div className={styles.serviceCard}>
      <Skeleton width={48} height={48} borderRadius="50%" />
      <Skeleton width="70%" height={20} />
      <Skeleton width="100%" height={14} />
      <Skeleton width="90%" height={14} />
    </div>
  );
};

// Text Block Skeleton
export const TextBlockSkeleton = ({ lines = 3 }: { lines?: number }) => {
  return (
    <div className={styles.textBlock}>
      {Array.from({ length: lines }).map((_, i) => (
        <Skeleton
          key={i}
          width={i === lines - 1 ? '70%' : '100%'}
          height={16}
        />
      ))}
    </div>
  );
};

// Page Loading Skeleton
export const PageSkeleton = () => {
  return (
    <motion.div
      className={styles.pageSkeleton}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      {/* Hero section skeleton */}
      <div className={styles.heroSkeleton}>
        <Skeleton width="50%" height={48} />
        <Skeleton width="70%" height={24} />
        <Skeleton width={150} height={48} borderRadius={24} />
      </div>

      {/* Content skeleton */}
      <div className={styles.contentSkeleton}>
        <div className={styles.grid}>
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
          <ProjectCardSkeleton />
        </div>
      </div>
    </motion.div>
  );
};

export default Skeleton;
