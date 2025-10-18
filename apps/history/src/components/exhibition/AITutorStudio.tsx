'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Bot, MessageCircle, BookOpen, Code, Lightbulb, Send, RefreshCw } from 'lucide-react';
import { InteractiveCard } from '@/components/interactions/InteractiveCard';
import { InteractiveButton } from '@/components/interactions/InteractiveButton';
import { AITypingAnimation } from '@/components/ai/AITypingAnimation';
import { useGroqAI } from '@/hooks/useGroqAI';
import { useReducedMotion } from '@/hooks/useAnimations';

interface LearningTopic {
  id: string;
  title: string;
  description: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  icon: string;
  color: string;
  prompt: string;
}

const learningTopics: LearningTopic[] = [
  {
    id: 'programming-basics',
    title: 'Programming Fundamentals',
    description: 'Learn the core concepts that every programmer needs to know',
    difficulty: 'beginner',
    category: 'Fundamentals',
    icon: '📚',
    color: '#4ECDC4',
    prompt: 'Explain programming fundamentals including variables, functions, loops, and conditionals in simple terms with examples.',
  },
  {
    id: 'language-comparison',
    title: 'Language Comparison',
    description: 'Compare different programming languages and their strengths',
    difficulty: 'intermediate',
    category: 'Languages',
    icon: '⚖️',
    color: '#45B7D1',
    prompt: 'Compare and contrast different programming languages, explaining their strengths, weaknesses, and best use cases.',
  },
  {
    id: 'paradigm-explanation',
    title: 'Programming Paradigms',
    description: 'Understand different ways of thinking about programming problems',
    difficulty: 'intermediate',
    category: 'Concepts',
    icon: '🎭',
    color: '#96CEB4',
    prompt: 'Explain different programming paradigms (OOP, Functional, Procedural) with examples and when to use each.',
  },
  {
    id: 'code-optimization',
    title: 'Code Optimization',
    description: 'Learn techniques to write faster, more efficient code',
    difficulty: 'advanced',
    category: 'Performance',
    icon: '⚡',
    color: '#FECA57',
    prompt: 'Explain code optimization techniques, performance considerations, and best practices for writing efficient code.',
  },
  {
    id: 'debugging-techniques',
    title: 'Debugging Strategies',
    description: 'Master the art of finding and fixing bugs in your code',
    difficulty: 'intermediate',
    category: 'Skills',
    icon: '🐛',
    color: '#FF9FF3',
    prompt: 'Teach effective debugging strategies, common debugging tools, and systematic approaches to finding bugs.',
  },
  {
    id: 'architecture-patterns',
    title: 'Software Architecture',
    description: 'Learn how to design scalable and maintainable software systems',
    difficulty: 'advanced',
    category: 'Architecture',
    icon: '🏗️',
    color: '#54A0FF',
    prompt: 'Explain software architecture patterns, design principles, and how to build scalable systems.',
  },
];

export const AITutorStudio: React.FC = () => {
  const [selectedTopic, setSelectedTopic] = useState<LearningTopic | null>(null);
  const [chatHistory, setChatHistory] = useState<Array<{ role: 'user' | 'ai'; content: string }>>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const { executeAIRequest, isLoading, error } = useGroqAI();
  const reducedMotion = useReducedMotion();

  const handleTopicSelect = async (topic: LearningTopic) => {
    setSelectedTopic(topic);
    setChatHistory([]);
    
    // Start with an AI introduction
    const introduction = await executeAIRequest(
      (prompt: string) => ({ messages: [{ role: 'user', content: prompt }] }),
      'tutor',
      topic.id,
      topic.prompt,
      0
    );
    
    if (introduction) {
      setChatHistory([{ role: 'ai', content: introduction.content }]);
    }
  };

  const handleSendMessage = async () => {
    if (!currentMessage.trim() || !selectedTopic) return;

    const userMessage = currentMessage;
    setCurrentMessage('');
    setChatHistory(prev => [...prev, { role: 'user', content: userMessage }]);
    setIsTyping(true);

    try {
      const response = await executeAIRequest(
        (prompt: string) => ({ 
          messages: [
            { role: 'user', content: selectedTopic.prompt },
            ...chatHistory.map(msg => ({ role: msg.role, content: msg.content })),
            { role: 'user', content: userMessage }
          ]
        }),
        'tutor',
        selectedTopic.id,
        userMessage,
        0
      );

      if (response) {
        setChatHistory(prev => [...prev, { role: 'ai', content: response.content }]);
      }
    } catch (error) {
      setChatHistory(prev => [...prev, { 
        role: 'ai', 
        content: 'Sorry, I encountered an error. Please try again.' 
      }]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'text-green-400';
      case 'intermediate': return 'text-yellow-400';
      case 'advanced': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };

  return (
    <div className="space-y-12">
      {/* Section Header */}
      <motion.div 
        className="text-center"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
      >
        <div className="flex items-center justify-center gap-4 mb-6">
          <motion.div
            className="w-16 h-16 rounded-xl bg-gradient-to-r from-orange-500 to-red-500 flex items-center justify-center text-3xl shadow-lg"
            animate={reducedMotion ? {} : { scale: [1, 1.1, 1] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            🤖
          </motion.div>
          <div>
            <h1 className="portfolio-hero-text text-white">AI TUTOR STUDIO</h1>
            <p className="portfolio-large-text text-orange-400">Groq-Powered Learning Area</p>
          </div>
        </div>
        
        <p className="portfolio-base-text text-gray-300 max-w-4xl mx-auto leading-relaxed">
          Learn programming with your personal AI tutor powered by Groq. Choose a topic, ask questions, 
          and get instant explanations tailored to your learning level. The AI adapts to your needs and 
          provides interactive, engaging lessons on programming concepts.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Learning Topics */}
        <motion.div
          className="lg:col-span-1"
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.3, duration: 0.6 }}
        >
          <h2 className="portfolio-large-text text-white mb-6">LEARNING TOPICS</h2>
          <div className="space-y-4">
            {learningTopics.map((topic, index) => (
              <motion.div
                key={topic.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 + index * 0.1, duration: 0.4 }}
              >
                <InteractiveCard
                  variant="ai"
                  onClick={() => handleTopicSelect(topic)}
                  className={`group cursor-pointer ${
                    selectedTopic?.id === topic.id ? 'ring-2 ring-orange-500' : ''
                  }`}
                  tilt
                  glow
                >
                  <div className="flex items-center gap-4">
                    <motion.div
                      className={`w-12 h-12 rounded-lg bg-gradient-to-r ${topic.color} flex items-center justify-center text-xl`}
                      whileHover={reducedMotion ? {} : { scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.3 }}
                    >
                      {topic.icon}
                    </motion.div>
                    <div className="flex-1">
                      <h3 className="portfolio-medium-text text-white mb-1">{topic.title}</h3>
                      <p className="portfolio-small-text text-gray-300 mb-2">{topic.description}</p>
                      <div className="flex items-center gap-2">
                        <span className={`portfolio-small-text ${getDifficultyColor(topic.difficulty)}`}>
                          {topic.difficulty.toUpperCase()}
                        </span>
                        <span className="portfolio-small-text text-gray-400">•</span>
                        <span className="portfolio-small-text text-orange-400">{topic.category}</span>
                      </div>
                    </div>
                    <motion.div
                      className="opacity-0 group-hover:opacity-100 transition-opacity"
                      animate={selectedTopic?.id === topic.id ? { scale: [1, 1.2, 1] } : {}}
                      transition={{ duration: 1, repeat: Infinity }}
                    >
                      <Bot className="w-5 h-5 text-orange-400" />
                    </motion.div>
                  </div>
                </InteractiveCard>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Chat Interface */}
        <motion.div
          className="lg:col-span-2"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.5, duration: 0.6 }}
        >
          {selectedTopic ? (
            <div className="h-[600px] flex flex-col">
              {/* Chat Header */}
              <div className="bg-black/50 backdrop-blur-lg rounded-t-xl p-4 border border-orange-500/30">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-lg bg-gradient-to-r ${selectedTopic.color} flex items-center justify-center text-lg`}>
                    {selectedTopic.icon}
                  </div>
                  <div>
                    <h3 className="portfolio-medium-text text-white">{selectedTopic.title}</h3>
                    <p className="portfolio-small-text text-orange-400">{selectedTopic.category} • {selectedTopic.difficulty}</p>
                  </div>
                </div>
              </div>

              {/* Chat Messages */}
              <div className="flex-1 bg-gray-900/50 backdrop-blur-lg p-4 overflow-y-auto space-y-4">
                <AnimatePresence>
                  {chatHistory.map((message, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                    >
                      <div className={`max-w-[80%] p-4 rounded-lg ${
                        message.role === 'user' 
                          ? 'bg-orange-500 text-black' 
                          : 'bg-gray-800 text-gray-300'
                      }`}>
                        {message.role === 'ai' ? (
                          <AITypingAnimation
                            text={message.content}
                            speed={20}
                            className="text-sm leading-relaxed"
                          />
                        ) : (
                          <p className="text-sm leading-relaxed">{message.content}</p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>

                {isTyping && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-gray-800 text-gray-300 p-4 rounded-lg max-w-[80%]">
                      <div className="flex items-center gap-2">
                        <RefreshCw className="w-4 h-4 animate-spin text-orange-400" />
                        <span className="text-sm">AI is thinking...</span>
                      </div>
                    </div>
                  </motion.div>
                )}

                {error && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex justify-start"
                  >
                    <div className="bg-red-500/20 text-red-300 p-4 rounded-lg max-w-[80%] border border-red-500/30">
                      <p className="text-sm">Error: {error}</p>
                    </div>
                  </motion.div>
                )}
              </div>

              {/* Message Input */}
              <div className="bg-black/50 backdrop-blur-lg rounded-b-xl p-4 border border-orange-500/30">
                <div className="flex gap-3">
                  <input
                    type="text"
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    onKeyPress={handleKeyPress}
                    placeholder="Ask a question about this topic..."
                    className="flex-1 bg-gray-800/50 border border-gray-600 rounded-lg px-4 py-2 text-white placeholder-gray-400 focus:outline-none focus:border-orange-500 transition-colors"
                    disabled={isLoading}
                  />
                  <InteractiveButton
                    onClick={handleSendMessage}
                    disabled={!currentMessage.trim() || isLoading}
                    variant="primary"
                    size="sm"
                  >
                    <Send className="w-4 h-4" />
                  </InteractiveButton>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[600px] flex items-center justify-center bg-gray-900/50 backdrop-blur-lg rounded-xl border border-orange-500/30">
              <div className="text-center">
                <Bot className="w-16 h-16 text-orange-400 mx-auto mb-4" />
                <h3 className="portfolio-large-text text-white mb-2">Select a Learning Topic</h3>
                <p className="portfolio-base-text text-gray-300">
                  Choose a topic from the left to start your AI-powered learning journey
                </p>
              </div>
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default AITutorStudio;