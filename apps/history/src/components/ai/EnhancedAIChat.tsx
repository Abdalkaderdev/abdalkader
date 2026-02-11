'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Bot, User, Code, Lightbulb, BookOpen, RefreshCw, Copy, Check } from 'lucide-react';
import { InteractiveButton } from '@/components/interactions/InteractiveButton';
import { AITypingAnimation } from '@/components/ai/AITypingAnimation';
import { useGroqAI } from '@/hooks/useGroqAI';
import { useReducedMotion } from '@/hooks/useAnimations';

interface ChatMessage {
  id: string;
  role: 'user' | 'ai';
  content: string;
  type: 'text' | 'code' | 'comparison' | 'explanation';
  timestamp: Date;
  metadata?: {
    language?: string;
    paradigm?: string;
    era?: string;
    confidence?: number;
  };
}

interface EnhancedAIChatProps {
  context?: string;
  onMessageSent?: (message: ChatMessage) => void;
  className?: string;
  placeholder?: string;
  maxHeight?: string;
}

export const EnhancedAIChat: React.FC<EnhancedAIChatProps> = ({
  context = 'general',
  onMessageSent,
  className = '',
  placeholder = 'Ask me anything about programming languages...',
  maxHeight = '600px',
}) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputValue, setInputValue] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [copiedMessageId, setCopiedMessageId] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { executeAIRequest, isLoading, error } = useGroqAI();
  const reducedMotion = useReducedMotion();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Voice recognition setup
  useEffect(() => {
    if (typeof window !== 'undefined' && 'webkitSpeechRecognition' in window) {
      // Voice recognition is available
    }
  }, []);

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      type: 'text',
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsTyping(true);
    onMessageSent?.(userMessage);

    try {
      const response = await executeAIRequest(
        async (prompt: string) => {
          const { secureAIClient } = await import('@/lib/groq/groqClient');
          const conversationHistory = messages.map(msg => `${msg.role === 'ai' ? 'Assistant' : 'User'}: ${msg.content}`).join('\n');
          const aiResponse = await secureAIClient.chat({
            message: inputValue,
            context: `You are an expert programming language historian and educator. Context: ${context}. Provide detailed, accurate, and engaging responses about programming languages, their history, paradigms, and evolution.\n\nPrevious conversation:\n${conversationHistory}`,
          });

          if (!aiResponse.success) {
            throw new Error(aiResponse.error || 'AI request failed');
          }

          return {
            content: aiResponse.response || 'No response generated',
            model: aiResponse.model || 'llama3-8b-8192'
          };
        },
        'question',
        context,
        inputValue
      );

      if (response) {
        const aiMessage: ChatMessage = {
          id: (Date.now() + 1).toString(),
          role: 'ai',
          content: response.content,
          type: 'text',
          timestamp: new Date(),
          metadata: {
            confidence: 0.95,
          },
        };

        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (error) {
      const errorMessage: ChatMessage = {
        id: (Date.now() + 1).toString(),
        role: 'ai',
        content: 'Sorry, I encountered an error. Please try again.',
        type: 'text',
        timestamp: new Date(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleVoiceInput = () => {
    if (!('webkitSpeechRecognition' in window)) {
      alert('Voice recognition is not supported in this browser.');
      return;
    }

    const recognition = new (window as any).webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = 'en-US';

    recognition.onstart = () => {
      setIsRecording(true);
    };

    recognition.onresult = (event: any) => {
      const transcript = event.results[0][0].transcript;
      setInputValue(transcript);
      setIsRecording(false);
    };

    recognition.onerror = () => {
      setIsRecording(false);
    };

    recognition.onend = () => {
      setIsRecording(false);
    };

    recognition.start();
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const copyToClipboard = async (content: string, messageId: string) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedMessageId(messageId);
      setTimeout(() => setCopiedMessageId(null), 2000);
    } catch (error) {
      console.error('Failed to copy text:', error);
    }
  };

  const getMessageIcon = (message: ChatMessage) => {
    switch (message.type) {
      case 'code':
        return <Code className="w-4 h-4" />;
      case 'comparison':
        return <Lightbulb className="w-4 h-4" />;
      case 'explanation':
        return <BookOpen className="w-4 h-4" />;
      default:
        return message.role === 'user' ? <User className="w-4 h-4" /> : <Bot className="w-4 h-4" />;
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    return timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className={`bg-black/50 backdrop-blur-lg rounded-xl border border-orange-500/30 overflow-hidden ${className}`}>
      {/* Chat Header */}
      <div className="bg-gradient-to-r from-orange-500/20 to-orange-400/20 p-4 border-b border-orange-500/30">
        <div className="flex items-center gap-3">
          <motion.div
            className="w-10 h-10 rounded-lg bg-gradient-to-r from-orange-500 to-orange-400 flex items-center justify-center"
            animate={reducedMotion ? {} : { rotate: [0, 5, -5, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Bot className="w-5 h-5 text-black" />
          </motion.div>
          <div>
            <h3 className="portfolio-medium-text text-white">AI Programming Historian</h3>
            <p className="portfolio-small-text text-orange-400">Ask me anything about programming languages</p>
          </div>
        </div>
      </div>

      {/* Messages Container */}
      <div 
        className="p-4 space-y-4 overflow-y-auto"
        style={{ maxHeight, height: maxHeight }}
      >
        <AnimatePresence>
          {messages.map((message) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`max-w-[85%] group`}>
                {/* Message Header */}
                <div className={`flex items-center gap-2 mb-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-center gap-2 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      message.role === 'user' 
                        ? 'bg-orange-500 text-black' 
                        : 'bg-gray-700 text-orange-400'
                    }`}>
                      {getMessageIcon(message)}
                    </div>
                    <span className="portfolio-small-text text-gray-400">
                      {message.role === 'user' ? 'You' : 'AI Historian'}
                    </span>
                    <span className="portfolio-small-text text-gray-500">
                      {formatTimestamp(message.timestamp)}
                    </span>
                  </div>
                  
                  {/* Copy Button */}
                  <motion.button
                    onClick={() => copyToClipboard(message.content, message.id)}
                    className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-gray-700/50 rounded"
                    whileHover={reducedMotion ? {} : { scale: 1.1 }}
                    whileTap={reducedMotion ? {} : { scale: 0.9 }}
                  >
                    {copiedMessageId === message.id ? (
                      <Check className="w-3 h-3 text-green-400" />
                    ) : (
                      <Copy className="w-3 h-3 text-gray-400" />
                    )}
                  </motion.button>
                </div>

                {/* Message Content */}
                <div className={`p-4 rounded-xl ${
                  message.role === 'user' 
                    ? 'bg-orange-500 text-black' 
                    : 'bg-gray-800/50 text-gray-300'
                }`}>
                  {message.role === 'ai' ? (
                    <AITypingAnimation
                      text={message.content}
                      speed={20}
                      className="text-sm leading-relaxed"
                    />
                  ) : (
                    <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>
                  )}
                </div>

                {/* Message Metadata */}
                {message.metadata && (
                  <div className={`mt-2 ${message.role === 'user' ? 'text-right' : 'text-left'}`}>
                    {message.metadata.confidence && (
                      <div className="flex items-center gap-2">
                        <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-orange-500 to-orange-400"
                            initial={{ width: 0 }}
                            animate={{ width: `${message.metadata.confidence * 100}%` }}
                            transition={{ duration: 0.5 }}
                          />
                        </div>
                        <span className="portfolio-small-text text-gray-500">
                          {Math.round(message.metadata.confidence * 100)}% confidence
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          ))}
        </AnimatePresence>

        {/* Typing Indicator */}
        {isTyping && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-gray-800/50 text-gray-300 p-4 rounded-xl max-w-[85%]">
              <div className="flex items-center gap-3">
                <RefreshCw className="w-4 h-4 animate-spin text-orange-400" />
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Message */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-start"
          >
            <div className="bg-red-500/20 text-red-300 p-4 rounded-xl max-w-[85%] border border-red-500/30">
              <p className="text-sm">Error: {error}</p>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-orange-500/30 bg-gray-900/50">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder={placeholder}
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors resize-none"
              rows={1}
              disabled={isLoading}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          
          <div className="flex gap-2">
            <InteractiveButton
              onClick={handleVoiceInput}
              variant="ghost"
              size="sm"
              className={`p-3 ${isRecording ? 'bg-red-500/20 text-red-400' : ''}`}
              disabled={isLoading}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </InteractiveButton>
            
            <InteractiveButton
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isLoading}
              variant="primary"
              size="sm"
              className="p-3"
            >
              <Send className="w-4 h-4" />
            </InteractiveButton>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedAIChat;