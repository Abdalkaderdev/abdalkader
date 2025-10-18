import React from 'react';

export type ComponentStatus = 'stable' | 'beta' | 'deprecated' | 'experimental';

interface ComponentStatusProps {
  status: ComponentStatus;
  className?: string;
}

const statusConfig = {
  stable: {
    label: 'Stable',
    icon: '✅',
    description: 'Production ready, fully tested and documented'
  },
  beta: {
    label: 'Beta',
    icon: '🧪',
    description: 'Feature complete but may have minor issues'
  },
  experimental: {
    label: 'Experimental',
    icon: '⚡',
    description: 'New feature, API may change'
  },
  deprecated: {
    label: 'Deprecated',
    icon: '⚠️',
    description: 'Will be removed in future version'
  }
};

export const ComponentStatusBadge: React.FC<ComponentStatusProps> = ({ 
  status, 
  className = '' 
}) => {
  const config = statusConfig[status];
  
  return (
    <span 
      className={`component-status status-${status} ${className}`}
      title={config.description}
      role="status"
      aria-label={`Component status: ${config.label}`}
    >
      <span className="status-icon" aria-hidden="true">
        {config.icon}
      </span>
      <span className="status-label">
        {config.label}
      </span>
    </span>
  );
};

export default ComponentStatusBadge;