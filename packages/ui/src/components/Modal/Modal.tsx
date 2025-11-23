/**
 * Enhanced Modal/Dialog Component with Animations
 * Senior Frontend Developer - Component Specialist
 */

import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import './Modal.css';

export interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title?: string;
  children: React.ReactNode;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  closeButton?: boolean;
  backdrop?: boolean;
  closeOnBackdropClick?: boolean;
  closeOnEscape?: boolean;
  footer?: React.ReactNode;
}

export const Modal = React.forwardRef<HTMLDivElement, ModalProps>(
  (
    {
      isOpen,
      onClose,
      title,
      children,
      size = 'md',
      closeButton = true,
      backdrop = true,
      closeOnBackdropClick = true,
      closeOnEscape = true,
      footer,
    },
    ref
  ) => {
    useEffect(() => {
      if (!isOpen || !closeOnEscape) return;

      const handleEscape = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          onClose();
        }
      };

      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';

      return () => {
        document.removeEventListener('keydown', handleEscape);
        document.body.style.overflow = 'unset';
      };
    }, [isOpen, closeOnEscape, onClose]);

    return (
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            {backdrop && (
              <motion.div
                className="portfolio-modal-backdrop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.2 }}
                onClick={() => closeOnBackdropClick && onClose()}
              />
            )}

            {/* Modal */}
            <motion.div
              ref={ref}
              className={`portfolio-modal portfolio-modal--${size}`}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
              role="dialog"
              aria-modal="true"
              aria-labelledby={title ? 'modal-title' : undefined}
            >
              {/* Header */}
              {(title || closeButton) && (
                <motion.div
                  className="portfolio-modal-header"
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1, duration: 0.3 }}
                >
                  {title && (
                    <h2 id="modal-title" className="portfolio-modal-title">
                      {title}
                    </h2>
                  )}

                  {closeButton && (
                    <motion.button
                      className="portfolio-modal-close"
                      onClick={onClose}
                      aria-label="Close modal"
                      whileHover={{ scale: 1.1, rotate: 90 }}
                      whileTap={{ scale: 0.95 }}
                      transition={{ duration: 0.2 }}
                    >
                      <X size={24} />
                    </motion.button>
                  )}
                </motion.div>
              )}

              {/* Content */}
              <motion.div
                className="portfolio-modal-content"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.15, duration: 0.3 }}
              >
                {children}
              </motion.div>

              {/* Footer */}
              {footer && (
                <motion.div
                  className="portfolio-modal-footer"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2, duration: 0.3 }}
                >
                  {footer}
                </motion.div>
              )}
            </motion.div>
          </>
        )}
      </AnimatePresence>
    );
  }
);

Modal.displayName = 'Modal';

/**
 * useModal Hook - Manage modal state easily
 */
export const useModal = (initialState = false) => {
  const [isOpen, setIsOpen] = React.useState(initialState);

  const open = React.useCallback(() => setIsOpen(true), []);
  const close = React.useCallback(() => setIsOpen(false), []);
  const toggle = React.useCallback(() => setIsOpen((prev) => !prev), []);

  return { isOpen, open, close, toggle };
};
