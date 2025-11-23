/**
 * Enhanced Toast Notification Component
 * Senior Frontend Developer - Component Specialist
 */

import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle, AlertCircle, AlertTriangle, Info } from 'lucide-react';
import './Toast.css';

export interface ToastOptions {
  id?: string;
  type?: 'success' | 'error' | 'warning' | 'info';
  title?: string;
  message: string;
  duration?: number;
  persistent?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
  onClose?: () => void;
}

interface ToastItem extends ToastOptions {
  id: string;
  timestamp: number;
}

interface ToastContextType {
  toasts: ToastItem[];
  addToast: (options: ToastOptions) => string;
  removeToast: (id: string) => void;
  clearToasts: () => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((options: ToastOptions): string => {
    const id = options.id || Math.random().toString(36).substr(2, 9);
    const newToast: ToastItem = {
      ...options,
      id,
      timestamp: Date.now(),
    };

    setToasts((prev) => [...prev, newToast]);

    // Auto-remove after duration (unless persistent)
    if (!options.persistent && options.duration !== 0) {
      const duration = options.duration || 5000;
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => {
      const toast = prev.find((t) => t.id === id);
      if (toast?.onClose) {
        toast.onClose();
      }
      return prev.filter((t) => t.id !== id);
    });
  }, []);

  const clearToasts = useCallback(() => {
    toasts.forEach((toast) => {
      if (toast.onClose) {
        toast.onClose();
      }
    });
    setToasts([]);
  }, [toasts]);

  return (
    <ToastContext.Provider value={{ toasts, addToast, removeToast, clearToasts }}>
      {children}
      <ToastContainer />
    </ToastContext.Provider>
  );
};

const ToastContainer: React.FC = () => {
  const { toasts, removeToast } = useToast();

  return (
    <div className="portfolio-toast-container">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <Toast key={toast.id} toast={toast} onRemove={removeToast} />
        ))}
      </AnimatePresence>
    </div>
  );
};

interface ToastComponentProps {
  toast: ToastItem;
  onRemove: (id: string) => void;
}

const Toast: React.FC<ToastComponentProps> = ({ toast, onRemove }) => {
  const getIcon = () => {
    switch (toast.type) {
      case 'success':
        return <CheckCircle size={20} />;
      case 'error':
        return <AlertCircle size={20} />;
      case 'warning':
        return <AlertTriangle size={20} />;
      case 'info':
      default:
        return <Info size={20} />;
    }
  };

  return (
    <motion.div
      className={`portfolio-toast portfolio-toast--${toast.type || 'info'}`}
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: -50, scale: 0.9 }}
      transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
      layout
    >
      <div className="portfolio-toast-icon">{getIcon()}</div>

      <div className="portfolio-toast-content">
        {toast.title && (
          <div className="portfolio-toast-title">{toast.title}</div>
        )}
        <div className="portfolio-toast-message">{toast.message}</div>
        {toast.action && (
          <button
            className="portfolio-toast-action"
            onClick={toast.action.onClick}
          >
            {toast.action.label}
          </button>
        )}
      </div>

      {!toast.persistent && (
        <button
          className="portfolio-toast-close"
          onClick={() => onRemove(toast.id)}
          aria-label="Close notification"
        >
          <X size={16} />
        </button>
      )}
    </motion.div>
  );
};

/**
 * Toast Hook with convenience methods
 */
export const useToastHelpers = () => {
  const { addToast, removeToast, clearToasts } = useToast();

  const success = useCallback(
    (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) =>
      addToast({ ...options, message, type: 'success' }),
    [addToast]
  );

  const error = useCallback(
    (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) =>
      addToast({ ...options, message, type: 'error', duration: 0 }),
    [addToast]
  );

  const warning = useCallback(
    (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) =>
      addToast({ ...options, message, type: 'warning' }),
    [addToast]
  );

  const info = useCallback(
    (message: string, options?: Omit<ToastOptions, 'message' | 'type'>) =>
      addToast({ ...options, message, type: 'info' }),
    [addToast]
  );

  return {
    addToast,
    removeToast,
    clearToasts,
    success,
    error,
    warning,
    info,
  };
};

/**
 * Toast Component for standalone usage
 */
export const ToastComponent: React.FC<ToastOptions> = (options) => {
  const { addToast } = useToast();
  
  React.useEffect(() => {
    addToast(options);
  }, [addToast, options]);

  return null;
};
