'use client';

import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Mic, MicOff, Bot, User, Heart, AlertTriangle, Shield, Clock } from 'lucide-react';
import { InteractiveButton } from '@/components/interactions/InteractiveButton';
import { TherapyMessage, TherapySession, CrisisDetection } from '@/lib/therapy/aiTherapist';
import { useReducedMotion } from '@/hooks/useAnimations';

interface AIConversationProps {
  session: TherapySession | null;
  onMessageSent: (message: TherapyMessage) => void;
  onCrisisDetected: (crisis: CrisisDetection) => void;
  className?: string;
}

export const AIConversation: React.FC<AIConversationProps> = ({
  session,
  onMessageSent,
  onCrisisDetected,
  className = '',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isRecording, setIsRecording] = useState(false);
  const [crisisAlert, setCrisisAlert] = useState<CrisisDetection | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [session?.messages]);

  // Handle sending message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !session) return;

    const userMessage: TherapyMessage = {
      id: Date.now().toString(),
      role: 'user',
      content: inputValue,
      timestamp: Date.now(),
      confidence: 1.0
    };

    onMessageSent(userMessage);
    setInputValue('');
    setIsTyping(true);

    // Simulate AI response (in real implementation, this would call the AI therapist)
    setTimeout(() => {
      const aiMessage: TherapyMessage = {
        id: (Date.now() + 1).toString(),
        role: 'therapist',
        content: "I understand how you're feeling. Can you tell me more about what's been on your mind lately?",
        timestamp: Date.now(),
        modality: session.modality,
        emotion: 'empathy',
        confidence: 0.9
      };

      onMessageSent(aiMessage);
      setIsTyping(false);
    }, 2000);
  };

  // Handle voice input
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

  // Handle key press
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  // Get message styling based on role and emotion
  const getMessageStyle = (message: TherapyMessage) => {
    const baseStyle = "p-4 rounded-xl max-w-[85%]";
    
    if (message.role === 'user') {
      return `${baseStyle} bg-blue-500 text-white ml-auto`;
    }

    // Therapist message styling based on emotion
    const emotionStyles = {
      empathy: 'bg-green-500/20 text-green-300 border border-green-500/30',
      encouragement: 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30',
      concern: 'bg-orange-500/20 text-orange-300 border border-orange-500/30',
      neutral: 'bg-gray-500/20 text-gray-300 border border-gray-500/30'
    };

    return `${baseStyle} ${emotionStyles[message.emotion as keyof typeof emotionStyles] || emotionStyles.neutral}`;
  };

  // Get emotion icon
  const getEmotionIcon = (emotion?: string) => {
    switch (emotion) {
      case 'empathy': return <Heart className="w-4 h-4" />;
      case 'encouragement': return <Bot className="w-4 h-4" />;
      case 'concern': return <AlertTriangle className="w-4 h-4" />;
      default: return <Bot className="w-4 h-4" />;
    }
  };

  // Format timestamp
  const formatTimestamp = (timestamp: number) => {
    return new Date(timestamp).toLocaleTimeString([], { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  return (
    <div className={`flex flex-col h-full ${className}`}>
      {/* Header */}
      <div className="bg-black/50 backdrop-blur-lg border-b border-green-500/30 p-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-lg bg-gradient-to-r from-green-500 to-blue-500 flex items-center justify-center">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div>
            <h3 className="portfolio-medium-text text-white">AI Therapist</h3>
            <p className="portfolio-small-text text-green-400">
              {session?.modality?.toUpperCase()} • {session?.messages.length || 0} messages
            </p>
          </div>
        </div>
      </div>

      {/* Crisis Alert */}
      <AnimatePresence>
        {crisisAlert && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="bg-red-500/20 border border-red-500/30 p-4 m-4 rounded-lg"
          >
            <div className="flex items-center gap-3">
              <AlertTriangle className="w-5 h-5 text-red-400" />
              <div>
                <h4 className="portfolio-small-text text-red-400 font-medium">Crisis Detected</h4>
                <p className="portfolio-small-text text-red-300">
                  {crisisAlert.recommendations[0]}
                </p>
              </div>
            </div>
            <div className="mt-3 space-y-1">
              {crisisAlert.emergencyResources.map((resource, index) => (
                <p key={index} className="text-sm text-red-300">{resource}</p>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        <AnimatePresence>
          {session?.messages.map((message, index) => (
            <motion.div
              key={message.id}
              initial={{ opacity: 0, y: 20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
              className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className="group">
                {/* Message Header */}
                <div className={`flex items-center gap-2 mb-2 ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`flex items-center gap-2 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}>
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      message.role === 'user' 
                        ? 'bg-blue-500 text-white' 
                        : 'bg-green-500 text-white'
                    }`}>
                      {message.role === 'user' ? <User className="w-4 h-4" /> : getEmotionIcon(message.emotion)}
                    </div>
                    <span className="portfolio-small-text text-gray-400">
                      {message.role === 'user' ? 'You' : 'AI Therapist'}
                    </span>
                    <span className="portfolio-small-text text-gray-500">
                      {formatTimestamp(message.timestamp)}
                    </span>
                  </div>
                </div>

                {/* Message Content */}
                <div className={getMessageStyle(message)}>
                  <p className="text-sm leading-relaxed whitespace-pre-wrap">
                    {message.content}
                  </p>
                  
                  {/* Confidence Indicator */}
                  {message.confidence && message.role === 'therapist' && (
                    <div className="mt-2 flex items-center gap-2">
                      <div className="w-16 h-1 bg-gray-700 rounded-full overflow-hidden">
                        <motion.div
                          className="h-full bg-green-400"
                          initial={{ width: 0 }}
                          animate={{ width: `${message.confidence * 100}%` }}
                          transition={{ duration: 0.5 }}
                        />
                      </div>
                      <span className="text-xs text-gray-400">
                        {Math.round(message.confidence * 100)}%
                      </span>
                    </div>
                  )}
                </div>
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
            <div className="bg-gray-500/20 text-gray-300 p-4 rounded-xl max-w-[85%]">
              <div className="flex items-center gap-3">
                <Bot className="w-4 h-4 text-green-400" />
                <div className="flex items-center gap-1">
                  <motion.div
                    className="w-2 h-2 bg-green-400 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-green-400 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.2 }}
                  />
                  <motion.div
                    className="w-2 h-2 bg-green-400 rounded-full"
                    animate={{ scale: [1, 1.5, 1] }}
                    transition={{ duration: 0.6, repeat: Infinity, delay: 0.4 }}
                  />
                </div>
                <span className="text-sm">AI is thinking...</span>
              </div>
            </div>
          </motion.div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="bg-black/50 backdrop-blur-lg border-t border-green-500/30 p-4">
        <div className="flex gap-3">
          <div className="flex-1 relative">
            <textarea
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Share what's on your mind..."
              className="w-full bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-green-500 transition-colors resize-none"
              rows={1}
              disabled={isTyping}
              style={{ minHeight: '48px', maxHeight: '120px' }}
            />
          </div>
          
          <div className="flex gap-2">
            <InteractiveButton
              onClick={handleVoiceInput}
              variant="ghost"
              size="sm"
              className={`p-3 ${isRecording ? 'bg-red-500/20 text-red-400' : ''}`}
              disabled={isTyping}
            >
              {isRecording ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
            </InteractiveButton>
            
            <InteractiveButton
              onClick={handleSendMessage}
              disabled={!inputValue.trim() || isTyping}
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

export default AIConversation;