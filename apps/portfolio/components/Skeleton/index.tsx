import React from 'react';
import styles from './Skeleton.module.scss';

interface SkeletonProps {
  width?: string | number;
  height?: string | number;
  circle?: boolean;
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({
  width = '100%',
  height = '20px',
  circle = false,
  className = '',
}) => {
  const style: React.CSSProperties = {
    width: typeof width === 'number' ? `${width}px` : width,
    height: typeof height === 'number' ? `${height}px` : height,
  };

  return (
    <div
      className={`${styles.skeleton} ${circle ? styles.circle : ''} ${className}`}
      style={style}
      aria-busy="true"
      aria-label="Loading..."
    />
  );
};

interface SkeletonCardProps {
  className?: string;
}

export const SkeletonCard: React.FC<SkeletonCardProps> = ({ className = '' }) => {
  return (
    <div className={`${styles.card} ${className}`}>
      <Skeleton height={200} className={styles.image} />
      <div className={styles.content}>
        <Skeleton height={20} width="80%" className={styles.title} />
        <Skeleton height={16} width="100%" className={styles.text} />
        <Skeleton height={16} width="90%" className={styles.text} />
        <Skeleton height={40} width="100%" className={styles.button} />
      </div>
    </div>
  );
};

interface SkeletonListProps {
  count?: number;
  className?: string;
}

export const SkeletonList: React.FC<SkeletonListProps> = ({ count = 3, className = '' }) => {
  return (
    <div className={`${styles.list} ${className}`}>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className={styles.item}>
          <Skeleton height={20} width="30%" className={styles.text} />
          <Skeleton height={16} width="100%" className={styles.text} />
          <Skeleton height={16} width="80%" className={styles.text} />
        </div>
      ))}
    </div>
  );
};

interface SkeletonGridProps {
  columns?: number;
  count?: number;
  className?: string;
}

export const SkeletonGrid: React.FC<SkeletonGridProps> = ({
  columns = 3,
  count = 6,
  className = '',
}) => {
  return (
    <div className={`${styles.grid} ${className}`} style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>
  );
};
