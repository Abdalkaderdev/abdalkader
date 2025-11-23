/**
 * Enhanced Tabs Component with Animations
 * Senior Frontend Developer - Component Specialist
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import './Tabs.css';

export interface TabItem {
  id: string;
  label: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface TabsProps {
  items: TabItem[];
  defaultTab?: string;
  onChange?: (tabId: string) => void;
  variant?: 'default' | 'pills' | 'underline';
  className?: string;
}

export const Tabs = React.forwardRef<HTMLDivElement, TabsProps>(
  (
    {
      items,
      defaultTab,
      onChange,
      variant = 'default',
      className = '',
    },
    ref
  ) => {
    const [activeTab, setActiveTab] = useState(defaultTab || items[0]?.id);

    const handleTabChange = (tabId: string) => {
      setActiveTab(tabId);
      onChange?.(tabId);
    };

    const activeItem = items.find((item) => item.id === activeTab);

    return (
      <motion.div
        ref={ref}
        className={`portfolio-tabs portfolio-tabs--${variant} ${className}`.trim()}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        {/* Tab list */}
        <motion.div
          className="portfolio-tabs-list"
          role="tablist"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.1, duration: 0.3 }}
        >
          {items.map((item, index) => (
            <motion.button
              key={item.id}
              role="tab"
              aria-selected={activeTab === item.id}
              aria-controls={`panel-${item.id}`}
              className={`portfolio-tabs-trigger ${
                activeTab === item.id ? 'portfolio-tabs-trigger--active' : ''
              } ${item.disabled ? 'portfolio-tabs-trigger--disabled' : ''}`}
              onClick={() => !item.disabled && handleTabChange(item.id)}
              disabled={item.disabled}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05, duration: 0.3 }}
              whileHover={!item.disabled ? { scale: 1.05 } : {}}
              whileTap={!item.disabled ? { scale: 0.95 } : {}}
            >
              {item.icon && (
                <span className="portfolio-tabs-icon">{item.icon}</span>
              )}
              <span className="portfolio-tabs-label">{item.label}</span>

              {/* Active indicator */}
              {activeTab === item.id && (
                <motion.div
                  className="portfolio-tabs-indicator"
                  layoutId="tab-indicator"
                  transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
                />
              )}
            </motion.button>
          ))}
        </motion.div>

        {/* Tab content */}
        <motion.div
          id={`panel-${activeTab}`}
          role="tabpanel"
          aria-labelledby={activeTab}
          className="portfolio-tabs-content"
          key={activeTab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
        >
          {activeItem?.content}
        </motion.div>
      </motion.div>
    );
  }
);

Tabs.displayName = 'Tabs';
