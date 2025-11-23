/**
 * Enhanced Accordion Component with Animations
 * Senior Frontend Developer - Component Specialist
 */

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import './Accordion.css';

export interface AccordionItem {
  id: string;
  title: string;
  content: React.ReactNode;
  icon?: React.ReactNode;
  disabled?: boolean;
}

export interface AccordionProps {
  items: AccordionItem[];
  allowMultiple?: boolean;
  defaultOpen?: string[];
  onChange?: (openIds: string[]) => void;
  className?: string;
}

export const Accordion = React.forwardRef<HTMLDivElement, AccordionProps>(
  (
    {
      items,
      allowMultiple = false,
      defaultOpen = [],
      onChange,
      className = '',
    },
    ref
  ) => {
    const [openIds, setOpenIds] = useState<string[]>(defaultOpen);

    const toggleItem = (id: string) => {
      let newOpenIds: string[];

      if (allowMultiple) {
        newOpenIds = openIds.includes(id)
          ? openIds.filter((openId) => openId !== id)
          : [...openIds, id];
      } else {
        newOpenIds = openIds.includes(id) ? [] : [id];
      }

      setOpenIds(newOpenIds);
      onChange?.(newOpenIds);
    };

    return (
      <motion.div
        ref={ref}
        className={`portfolio-accordion ${className}`.trim()}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        {items.map((item, index) => (
          <motion.div
            key={item.id}
            className={`portfolio-accordion-item ${
              openIds.includes(item.id) ? 'portfolio-accordion-item--open' : ''
            } ${item.disabled ? 'portfolio-accordion-item--disabled' : ''}`}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05, duration: 0.3 }}
          >
            {/* Header */}
            <motion.button
              className="portfolio-accordion-header"
              onClick={() => !item.disabled && toggleItem(item.id)}
              disabled={item.disabled}
              aria-expanded={openIds.includes(item.id)}
              aria-controls={`accordion-content-${item.id}`}
              whileHover={!item.disabled ? { backgroundColor: 'rgba(244, 78, 0, 0.05)' } : {}}
              transition={{ duration: 0.2 }}
            >
              <div className="portfolio-accordion-header-content">
                {item.icon && (
                  <span className="portfolio-accordion-icon">{item.icon}</span>
                )}
                <span className="portfolio-accordion-title">{item.title}</span>
              </div>

              <motion.div
                className="portfolio-accordion-chevron"
                animate={{ rotate: openIds.includes(item.id) ? 180 : 0 }}
                transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
              >
                <ChevronDown size={20} />
              </motion.div>
            </motion.button>

            {/* Content */}
            {openIds.includes(item.id) && (
              <motion.div
                id={`accordion-content-${item.id}`}
                className="portfolio-accordion-content"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
              >
                <motion.div
                  className="portfolio-accordion-content-inner"
                  initial={{ y: -10 }}
                  animate={{ y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  {item.content}
                </motion.div>
              </motion.div>
            )}
          </motion.div>
        ))}
      </motion.div>
    );
  }
);

Accordion.displayName = 'Accordion';
