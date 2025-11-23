/**
 * ChatInterface Component for AI Chat Applications
 * Full-featured chat interface with input, message list, and controls
 */

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChatMessage, ChatMessageProps } from '../ChatMessage';
import './ChatInterface.css';

export interface Message extends Omit<ChatMessageProps, 'onRetry' | 'onCopy'> {
  id: string;
}

export interface ChatInterfaceProps {
  messages: Message[];
  isLoading?: boolean;
  onSendMessage: (message: string) => void;
  onRetryMessage?: (messageId: string) => void;
  placeholder?: string;
  disabled?: boolean;
  maxLength?: number;
  showModelSelector?: boolean;
  availableModels?: string[];
  selectedModel?: string;
  onModelChange?: (model: string) => void;
  className?: string;
  'aria-label'?: string;
}

export const ChatInterface = React.forwardRef<HTMLDivElement, ChatInterfaceProps>(
  (
    {
      messages,
      isLoading = false,
      onSendMessage,
      onRetryMessage,
      placeholder = 'Type your message...',
      disabled = false,
      maxLength = 2000,
      showModelSelector = false,
      availableModels = [],
      selectedModel,
      onModelChange,
      className = '',
      'aria-label': ariaLabel = 'Chat interface',
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState('');
    const [characterCount, setCharacterCount] = useState(0);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages, isLoading]);

    useEffect(() => {
      setCharacterCount(inputValue.length);
    }, [inputValue]);

    const handleSend = () => {
      if (!inputValue.trim() || disabled || isLoading) return;

      onSendMessage(inputValue.trim());
      setInputValue('');
      setCharacterCount(0);
      inputRef.current?.focus();
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    };

    const handleCopy = (content: string) => {
      navigator.clipboard.writeText(content);
    };

    const handleRetry = (messageId: string) => {
      if (onRetryMessage) {
        onRetryMessage(messageId);
      }
    };

    const canSend = inputValue.trim().length > 0 && !disabled && !isLoading;
    const isNearLimit = characterCount > maxLength * 0.9;

    return (
      <div
        ref={ref}
        className={`ai-chat-interface ${className}`.trim()}
        aria-label={ariaLabel}
        role="region"
      >
        {showModelSelector && availableModels.length > 0 && (
          <div className="ai-chat-interface__model-selector">
            <label htmlFor="model-select" className="ai-chat-interface__model-label">
              Model:
            </label>
            <select
              id="model-select"
              className="ai-chat-interface__model-select"
              value={selectedModel || availableModels[0]}
              onChange={(e) => onModelChange?.(e.target.value)}
              disabled={disabled || isLoading}
              aria-label="Select AI model"
            >
              {availableModels.map((model) => (
                <option key={model} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>
        )}

        <div className="ai-chat-interface__messages" role="log" aria-live="polite" aria-atomic="false">
          <AnimatePresence>
            {messages.map((message) => (
              <ChatMessage
                key={message.id}
                {...message}
                onCopy={() => handleCopy(message.content)}
                onRetry={onRetryMessage ? () => handleRetry(message.id) : undefined}
              />
            ))}
          </AnimatePresence>

          {isLoading && (
            <ChatMessage
              role="assistant"
              content=""
              isLoading={true}
              timestamp={new Date()}
            />
          )}

          <div ref={messagesEndRef} aria-hidden="true" />
        </div>

        <div className="ai-chat-interface__input-container">
          <div className="ai-chat-interface__input-wrapper">
            <textarea
              ref={inputRef}
              className={`ai-chat-interface__input ${
                isNearLimit ? 'ai-chat-interface__input--warning' : ''
              } ${characterCount > maxLength ? 'ai-chat-interface__input--error' : ''}`.trim()}
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder={placeholder}
              disabled={disabled || isLoading}
              maxLength={maxLength}
              rows={1}
              aria-label="Message input"
              aria-describedby="character-count"
            />
            <div className="ai-chat-interface__input-footer">
              <span
                id="character-count"
                className={`ai-chat-interface__character-count ${
                  isNearLimit ? 'ai-chat-interface__character-count--warning' : ''
                } ${characterCount > maxLength ? 'ai-chat-interface__character-count--error' : ''}`.trim()}
                aria-live="polite"
              >
                {characterCount} / {maxLength}
              </span>
            </div>
          </div>

          <button
            className={`ai-chat-interface__send-button ${
              canSend ? 'ai-chat-interface__send-button--active' : ''
            } ${isLoading ? 'ai-chat-interface__send-button--loading' : ''}`.trim()}
            onClick={handleSend}
            disabled={!canSend}
            aria-label="Send message"
            type="button"
          >
            {isLoading ? (
              <span className="ai-chat-interface__send-spinner" aria-hidden="true">
                ⟳
              </span>
            ) : (
              <span aria-hidden="true">→</span>
            )}
            <span className="ai-chat-interface__send-text">Send</span>
          </button>
        </div>
      </div>
    );
  }
);

ChatInterface.displayName = 'ChatInterface';

