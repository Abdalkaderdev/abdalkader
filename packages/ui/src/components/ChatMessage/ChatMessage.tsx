/**
 * ChatMessage Component for AI Chat Interfaces
 * Displays individual chat messages with support for user and AI responses
 */

import React from 'react';
import { motion } from 'framer-motion';
import './ChatMessage.css';

export interface ChatMessageProps {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp?: Date | string;
  isLoading?: boolean;
  error?: string | null;
  modelName?: string;
  metadata?: {
    tokens?: number;
    latency?: number;
    confidence?: number;
  };
  className?: string;
  onRetry?: () => void;
  onCopy?: () => void;
}

export const ChatMessage = React.forwardRef<HTMLDivElement, ChatMessageProps>(
  (
    {
      role,
      content,
      timestamp,
      isLoading = false,
      error = null,
      modelName,
      metadata,
      className = '',
      onRetry,
      onCopy,
    },
    ref
  ) => {
    const isUser = role === 'user';
    const isSystem = role === 'system';
    const hasError = !!error;

    const formatTimestamp = (ts: Date | string | undefined): string => {
      if (!ts) return '';
      const date = typeof ts === 'string' ? new Date(ts) : ts;
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    };

    return (
      <motion.div
        ref={ref}
        className={`ai-chat-message ai-chat-message--${role} ${
          hasError ? 'ai-chat-message--error' : ''
        } ${isLoading ? 'ai-chat-message--loading' : ''} ${className}`.trim()}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        role="article"
        aria-label={`${role} message${timestamp ? ` at ${formatTimestamp(timestamp)}` : ''}`}
      >
        <div className="ai-chat-message__container">
          <div className="ai-chat-message__avatar" aria-hidden="true">
            {isUser ? (
              <span className="ai-chat-message__avatar-icon" aria-label="User">
                👤
              </span>
            ) : isSystem ? (
              <span className="ai-chat-message__avatar-icon" aria-label="System">
                ⚙️
              </span>
            ) : (
              <span className="ai-chat-message__avatar-icon" aria-label="Assistant">
                🤖
              </span>
            )}
          </div>

          <div className="ai-chat-message__content-wrapper">
            <div className="ai-chat-message__header">
              <span className="ai-chat-message__role">
                {isUser ? 'You' : isSystem ? 'System' : modelName || 'Assistant'}
              </span>
              {timestamp && (
                <time
                  className="ai-chat-message__timestamp"
                  dateTime={typeof timestamp === 'string' ? timestamp : timestamp.toISOString()}
                >
                  {formatTimestamp(timestamp)}
                </time>
              )}
            </div>

            <div className="ai-chat-message__body">
              {hasError ? (
                <div className="ai-chat-message__error" role="alert">
                  <span className="ai-chat-message__error-icon" aria-hidden="true">
                    ⚠️
                  </span>
                  <span className="ai-chat-message__error-text">{error}</span>
                  {onRetry && (
                    <button
                      className="ai-chat-message__retry-button"
                      onClick={onRetry}
                      aria-label="Retry message"
                    >
                      Retry
                    </button>
                  )}
                </div>
              ) : isLoading ? (
                <div className="ai-chat-message__loading" aria-live="polite" aria-busy="true">
                  <span className="ai-chat-message__loading-dot" />
                  <span className="ai-chat-message__loading-dot" />
                  <span className="ai-chat-message__loading-dot" />
                  <span className="ai-chat-message__loading-text">Thinking...</span>
                </div>
              ) : (
                <div className="ai-chat-message__text">{content}</div>
              )}
            </div>

            {metadata && !hasError && !isLoading && (
              <div className="ai-chat-message__metadata" aria-label="Message metadata">
                {metadata.tokens && (
                  <span className="ai-chat-message__metadata-item">
                    {metadata.tokens} tokens
                  </span>
                )}
                {metadata.latency && (
                  <span className="ai-chat-message__metadata-item">
                    {metadata.latency}ms
                  </span>
                )}
                {metadata.confidence !== undefined && (
                  <span className="ai-chat-message__metadata-item">
                    {Math.round(metadata.confidence * 100)}% confidence
                  </span>
                )}
              </div>
            )}

            {!isLoading && !hasError && onCopy && (
              <button
                className="ai-chat-message__copy-button"
                onClick={onCopy}
                aria-label="Copy message"
                title="Copy message"
              >
                📋
              </button>
            )}
          </div>
        </div>
      </motion.div>
    );
  }
);

ChatMessage.displayName = 'ChatMessage';

