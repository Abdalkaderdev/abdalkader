import React from 'react';
import './Badge.css';

export interface BadgeProps {
  children: React.ReactNode;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export const Badge: React.FC<BadgeProps> = ({
  children,
  variant = 'primary',
  size = 'md',
  className = '',
}) => {
  const badgeClasses = `portfolio-badge portfolio-badge--${variant} portfolio-badge--${size} ${className}`.trim();

  return (
    <span className={badgeClasses}>
      {children}
    </span>
  );
};

Badge.displayName = 'Badge';
