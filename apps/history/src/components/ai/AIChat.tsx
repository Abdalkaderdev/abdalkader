'use client';

import { useState, useRef, useEffect } from 'react';
import { Language } from '@/lib/types/language';
import { useGroqAI } from '@/hooks/useGroqAI';
import { askProgrammingHistoryQuestion } from '@/services/aiService';
import { Send, Bot, User, Loader } from 'lucide-react';

interface Message {
  id: string;
  content: string;
  isUser: boolean;
  timestamp: number;
}

interface AIChatProps {
  languages: Language[];
  selectedLanguage: Language | null;
}

export function AIChat({ languages, selectedLanguage }: AIChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { executeAIRequest, error } = useGroqAI();

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      content: input.trim(),
      isUser: true,
      timestamp: Date.now(),
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await executeAIRequest(
        askProgrammingHistoryQuestion,
        'question',
        'chat',
        input.trim()
      );

      if (response) {
        const aiMessage: Message = {
          id: (Date.now() + 1).toString(),
          content: response.content,
          isUser: false,
          timestamp: Date.now(),
        };
        setMessages(prev => [...prev, aiMessage]);
      }
    } catch (err) {
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        content: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: Date.now(),
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const suggestedQuestions = [
    "Why was JavaScript created in just 10 days?",
    "How did C influence modern systems programming?",
    "What made Python's syntax so revolutionary?",
    "How did object-oriented programming evolve?",
    "What was the impact of the web on programming languages?",
  ];

  return (
    <div className="max-w-4xl mx-auto">
      {/* Chat Messages */}
      <div className="bg-slate-800/50 rounded-xl border border-purple-500/20 h-96 overflow-y-auto p-4 space-y-4">
        {messages.length === 0 ? (
          <div className="text-center text-slate-400 py-8">
            <Bot className="w-12 h-12 mx-auto mb-4 text-purple-400" />
            <div className="text-lg font-semibold mb-2">Ask me anything about programming history!</div>
            <div className="text-sm mb-4">I can explain languages, compare them, and discuss their historical context.</div>
            
            <div className="space-y-2">
              <div className="text-sm font-semibold text-purple-400">Suggested questions:</div>
              {suggestedQuestions.map((question, index) => (
                <button
                  key={index}
                  onClick={() => setInput(question)}
                  className="block w-full text-left text-xs bg-slate-700/50 hover:bg-slate-600/50 rounded-lg p-2 transition-colors"
                >
                  {question}
                </button>
              ))}
            </div>
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={`flex ${message.isUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                  message.isUser
                    ? 'bg-purple-600 text-white'
                    : 'bg-slate-700 text-slate-200'
                }`}
              >
                <div className="flex items-start space-x-2">
                  {!message.isUser && <Bot className="w-4 h-4 mt-1 text-purple-400" />}
                  <div className="flex-1">
                    <div className="whitespace-pre-wrap">{message.content}</div>
                    <div className="text-xs opacity-70 mt-1">
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                  {message.isUser && <User className="w-4 h-4 mt-1" />}
                </div>
              </div>
            </div>
          ))
        )}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-slate-700 text-slate-200 px-4 py-2 rounded-lg">
              <div className="flex items-center space-x-2">
                <Loader className="w-4 h-4 animate-spin text-purple-400" />
                <span>AI is thinking...</span>
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="mt-4">
        <div className="flex space-x-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Ask about programming history..."
            className="flex-1 bg-slate-800/50 border border-purple-500/20 rounded-lg px-4 py-2 text-white placeholder-slate-400 focus:outline-none focus:border-purple-500"
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={!input.trim() || isLoading}
            className="bg-purple-600 hover:bg-purple-700 disabled:bg-slate-600 text-white px-4 py-2 rounded-lg transition-colors flex items-center space-x-2"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </form>

      {error && (
        <div className="mt-2 text-red-400 text-sm">
          Error: {error}
        </div>
      )}
    </div>
  );
}
