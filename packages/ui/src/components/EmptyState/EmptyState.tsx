/**
 * EmptyState Component
 * Displays empty state messages with optional icons and actions
 */

import React from 'react';
import './EmptyState.css';
import { Button } from '../Button';

export interface EmptyStateProps {
  title?: string;
  description?: string;
  icon?: React.ReactNode;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
  variant?: 'default' | 'minimal' | 'detailed';
}

export function EmptyState({
  title = 'No data available',
  description,
  icon,
  action,
  className = '',
  variant = 'default',
}: EmptyStateProps) {
  return (
    <div className={`empty-state empty-state--${variant} ${className}`.trim()}>
      {icon && <div className="empty-state__icon">{icon}</div>}
      <h3 className="empty-state__title">{title}</h3>
      {description && <p className="empty-state__description">{description}</p>}
      {action && (
        <div className="empty-state__action">
          <Button variant="primary" onClick={action.onClick}>
            {action.label}
          </Button>
        </div>
      )}
    </div>
  );
}

